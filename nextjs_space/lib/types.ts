
export interface User {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  companyName?: string
  jobTitle?: string
  image?: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  plan: 'FREE' | 'START' | 'PRO' | 'ENTERPRISE'
  locale: string
  timezone: string
  tokensUsed: number
  tokensLimit: number
}

export interface Conversation {
  id: string
  title: string
  userId: string
  model: string
  template?: string
  preferredProvider?: string
  routingStrategy: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  conversationId: string
  content: string
  role: 'user' | 'assistant' | 'system'
  model?: string
  provider?: string
  tokenCount?: number
  cost?: number
  latency?: number
  createdAt: Date
}

export interface FinancialTemplate {
  id: string
  name: string
  description: string
  prompt: string
  category: string
  language: string
  active: boolean
  model: string
  temperature: number
  maxTokens: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface LLMProvider {
  id: string
  name: string
  models: string[]
  available: boolean
  cost: number
  latency: number
}
