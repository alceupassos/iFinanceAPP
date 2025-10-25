
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { 
  FINANCIAL_ANALYSIS_SYSTEM_PROMPT, 
  getFinancialAnalysisPrompt 
} from '@/lib/financial-analysis-template'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { clientName, fileIds, additionalContext } = await request.json()

    if (!clientName) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
    }

    // Get extracted text from uploaded files
    let fileContent = ''
    if (fileIds && fileIds.length > 0) {
      const files = await prisma.file.findMany({
        where: {
          id: { in: fileIds },
          userId: session.user.id
        },
        select: {
          name: true,
          extractedText: true
        }
      })

      fileContent = files.map(f => {
        return `### Arquivo: ${f.name}\n\n${f.extractedText || 'Sem conteúdo extraído'}`
      }).join('\n\n---\n\n')
    }

    if (additionalContext) {
      fileContent += `\n\n### Contexto Adicional Fornecido\n\n${additionalContext}`
    }

    // Prepare messages for LLM
    const messages = [
      {
        role: 'system',
        content: FINANCIAL_ANALYSIS_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: getFinancialAnalysisPrompt(clientName, fileContent)
      }
    ]

    // Call LLM API with streaming
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        stream: true,
        max_tokens: 8000,
        temperature: 0.3
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`)
    }

    // Return streaming response
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Financial analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to generate financial analysis' },
      { status: 500 }
    )
  }
}
