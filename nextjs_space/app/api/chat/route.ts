
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, model = 'gpt-4o-mini', provider = 'auto' } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check usage limits
    if (user.tokensUsed >= user.tokensLimit) {
      return NextResponse.json({ 
        error: 'Token limit exceeded. Please upgrade your plan.' 
      }, { status: 429 })
    }

    const startTime = Date.now()

    // Prepare messages for API
    const apiMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content
    }))

    // Call LLM API with streaming
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        stream: true,
        max_tokens: 3000,
        temperature: 0.7
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`)
    }

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        
        try {
          let totalTokens = 0
          let fullContent = ''
          
          while (true) {
            const { done, value } = await reader?.read() || { done: true, value: undefined }
            if (done) break
            
            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  const endTime = Date.now()
                  const latency = endTime - startTime

                  // Save conversation to database
                  try {
                    const conversation = await prisma.conversation.create({
                      data: {
                        title: messages[0]?.content?.slice(0, 50) + '...' || 'Nova Conversa',
                        userId: session.user.id,
                        model,
                        preferredProvider: provider,
                        messages: {
                          create: [
                            ...messages.map((msg: ChatMessage) => ({
                              content: msg.content,
                              role: msg.role,
                              model: msg.role === 'user' ? undefined : model,
                              provider: msg.role === 'user' ? undefined : provider
                            })),
                            {
                              content: fullContent,
                              role: 'assistant',
                              model,
                              provider,
                              tokenCount: totalTokens,
                              latency
                            }
                          ]
                        }
                      }
                    })

                    // Update user token usage
                    await prisma.user.update({
                      where: { id: session.user.id },
                      data: {
                        tokensUsed: {
                          increment: totalTokens || 100 // Estimated tokens
                        }
                      }
                    })

                    // Log usage
                    await prisma.usage.create({
                      data: {
                        userId: session.user.id,
                        provider: provider,
                        model,
                        tokenCount: totalTokens || 100,
                        cost: (totalTokens || 100) * 0.0001, // Estimated cost
                        requestType: 'chat',
                        responseTime: latency
                      }
                    })
                  } catch (dbError) {
                    console.error('Database save error:', dbError)
                  }

                  controller.close()
                  return
                }
                
                try {
                  const parsed = JSON.parse(data)
                  if (parsed.choices?.[0]?.delta?.content) {
                    fullContent += parsed.choices[0].delta.content
                  }
                  if (parsed.usage?.total_tokens) {
                    totalTokens = parsed.usage.total_tokens
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
                
                controller.enqueue(encoder.encode(line + '\n'))
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
