
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  Upload,
  Settings,
  Zap
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
  provider?: string
  tokenCount?: number
  latency?: number
}

export function ChatInterface() {
  const { data: session } = useSession() || {}
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [selectedProvider, setSelectedProvider] = useState('auto')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: selectedModel,
          provider: selectedProvider,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha na resposta da API')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        model: selectedModel,
        provider: selectedProvider
      }

      setMessages(prev => [...prev, assistantMessage])

      let buffer = ''
      let partialRead = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        partialRead += decoder.decode(value, { stream: true })
        let lines = partialRead.split('\n')
        partialRead = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.status === 'processing') {
                // Just a progress update
              } else if (parsed.status === 'completed') {
                // Final result for JSON responses
                if (parsed.result) {
                  assistantMessage.content = typeof parsed.result === 'string' 
                    ? parsed.result 
                    : JSON.stringify(parsed.result, null, 2)
                  setMessages(prev => prev.map(m => 
                    m.id === assistantMessage.id ? assistantMessage : m
                  ))
                }
              } else if (parsed.choices?.[0]?.delta?.content) {
                // Streaming text response
                buffer += parsed.choices[0].delta.content
                assistantMessage.content = buffer
                setMessages(prev => prev.map(m => 
                  m.id === assistantMessage.id ? assistantMessage : m
                ))
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error)
      toast({
        title: 'Erro no Chat',
        description: 'Ocorreu um erro ao processar sua mensagem. Tente novamente.',
        variant: 'destructive'
      })
      
      // Remove the assistant message if there was an error
      setMessages(prev => prev.filter(m => m.role !== 'assistant' || m.content))
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startFinancialAnalysis = () => {
    const template = `Olá! Sou seu assistente especializado em análise financeira. 

Posso ajudá-lo com:
📊 Análise de DRE (Demonstração do Resultado do Exercício)
💰 Análise de DFC (Demonstração de Fluxo de Caixa)
📈 Cálculo de indicadores financeiros
🔍 Interpretação de resultados e tendências
💡 Recomendações estratégicas

Para começar, você pode:
1. Fazer upload de seus demonstrativos financeiros
2. Fazer perguntas específicas sobre análise financeira
3. Solicitar cálculos de indicadores específicos

Como posso ajudá-lo hoje?`

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: template,
      timestamp: new Date(),
      model: 'ifinance-template',
      provider: 'template'
    }

    setMessages([assistantMessage])
    toast({
      title: 'Análise Financeira Ativada',
      description: 'Template iFinance carregado com sucesso!'
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat com IA</h1>
            <p className="text-gray-600">Converse com múltiplos modelos de linguagem</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={startFinancialAnalysis}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Análise Financeira iFinance
            </Button>
            <div className="flex gap-2">
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="openrouter">OpenRouter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4 Mini</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Bem-vindo ao iFinanceAI
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-md">
                    Comece uma conversa ou use o template de análise financeira para análises especializadas.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Zap className="w-3 h-3 mr-1" />
                      Multi-LLM
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      <FileText className="w-3 h-3 mr-1" />
                      Análise DRE/DFC
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      <Settings className="w-3 h-3 mr-1" />
                      Roteamento Inteligente
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-12'
                          : 'bg-gray-100 text-gray-900 mr-12'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 mt-1">
                          {message.role === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-sans">
                              {message.content}
                            </pre>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 text-xs opacity-70">
                            <span>
                              {message.timestamp.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.model && (
                              <Badge variant="outline" className="text-xs">
                                {message.model}
                              </Badge>
                            )}
                            {message.provider && message.provider !== 'template' && (
                              <Badge variant="outline" className="text-xs">
                                {message.provider}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-4 rounded-lg mr-12 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => {/* TODO: File upload */}}
              variant="outline"
              size="icon"
              disabled={isLoading}
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
