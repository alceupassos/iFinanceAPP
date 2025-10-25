
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  Upload,
  Settings,
  Zap,
  X,
  Paperclip,
  AlertCircle
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

interface UploadedFile {
  id: string
  name: string
  size: number
  extractedText: string
}

export function ChatInterface() {
  const { data: session } = useSession() || {}
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [selectedProvider, setSelectedProvider] = useState('auto')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showFinancialDialog, setShowFinancialDialog] = useState(false)
  const [clientName, setClientName] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        return response.json()
      })

      const results = await Promise.all(uploadPromises)
      
      const newFiles = results.map(result => ({
        id: result.fileId,
        name: result.fileName,
        size: result.size,
        extractedText: result.extractedText || ''
      }))

      setUploadedFiles(prev => [...prev, ...newFiles])

      toast({
        title: 'Upload Concluído',
        description: `${newFiles.length} arquivo(s) enviado(s) com sucesso!`,
      })

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Erro no Upload',
        description: 'Falha ao enviar arquivo(s). Tente novamente.',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const startFinancialAnalysis = () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Por favor, faça upload dos arquivos financeiros antes de iniciar a análise.',
        variant: 'destructive'
      })
      return
    }
    setShowFinancialDialog(true)
  }

  const runFinancialAnalysis = async () => {
    if (!clientName.trim()) {
      toast({
        title: 'Nome do Cliente Obrigatório',
        description: 'Por favor, informe o nome do cliente para a análise.',
        variant: 'destructive'
      })
      return
    }

    setShowFinancialDialog(false)
    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Análise Financeira Completa - Cliente: ${clientName}${additionalContext ? `\n\nContexto Adicional: ${additionalContext}` : ''}\n\nArquivos anexados: ${uploadedFiles.map(f => f.name).join(', ')}`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/financial-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          fileIds: uploadedFiles.map(f => f.id),
          additionalContext
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate analysis')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        model: 'gpt-4o',
        provider: 'iFinance'
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
              // Clear uploaded files after successful analysis
              setUploadedFiles([])
              setClientName('')
              setAdditionalContext('')
              return
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.choices?.[0]?.delta?.content) {
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
      console.error('Financial analysis error:', error)
      toast({
        title: 'Erro na Análise',
        description: 'Ocorreu um erro ao gerar a análise financeira. Tente novamente.',
        variant: 'destructive'
      })
      setMessages(prev => prev.filter(m => m.role !== 'assistant' || m.content))
    } finally {
      setIsLoading(false)
    }
  }

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



  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Chat com IA</h1>
            <p className="text-gray-600 dark:text-gray-400">Converse com múltiplos modelos de linguagem</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={startFinancialAnalysis}
              disabled={uploadedFiles.length === 0}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Análise Financeira
              {uploadedFiles.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {uploadedFiles.length}
                </Badge>
              )}
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

        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Arquivos Anexados ({uploadedFiles.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative group flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center space-y-2 w-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center w-full">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate px-2">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={isLoading}
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Financial Analysis Dialog */}
      <Dialog open={showFinancialDialog} onOpenChange={setShowFinancialDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Análise Financeira Completa</DialogTitle>
            <DialogDescription>
              Configure os detalhes para gerar a análise financeira estruturada do cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                placeholder="Ex: Oftprime, Empresa ABC"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalContext">Contexto Adicional (Opcional)</Label>
              <Textarea
                id="additionalContext"
                placeholder="Informações adicionais sobre o cliente, setor de atuação, período da análise, etc."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Arquivos anexados: {uploadedFiles.length}</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {uploadedFiles.map(f => f.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinancialDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={runFinancialAnalysis} disabled={!clientName.trim()}>
              Gerar Análise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Bem-vindo ao iFinanceAI
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
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
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-12'
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
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg mr-12 max-w-[80%]">
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
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.xlsx,.xls,.csv,.docx,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="icon"
              disabled={isUploading || isLoading}
              title="Anexar arquivos (PDF, Excel, CSV, Word)"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
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
