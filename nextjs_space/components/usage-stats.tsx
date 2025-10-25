
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Activity,
  MessageCircle,
  Zap,
  Calendar
} from 'lucide-react'

interface UsageData {
  totalTokens: number
  totalCost: number
  totalRequests: number
  avgResponseTime: number
  providerBreakdown: Record<string, number>
  modelBreakdown: Record<string, number>
  recentUsage: Array<{
    date: string
    tokens: number
    cost: number
    requests: number
  }>
}

export function UsageStats() {
  const { data: session } = useSession() || {}
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsageData()
  }, [])

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/user/usage')
      if (response.ok) {
        const data = await response.json()
        setUsageData(data)
      }
    } catch (error) {
      console.error('Error fetching usage data:', error)
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Carregando estatísticas...</p>
      </div>
    )
  }

  const mockUsageData: UsageData = {
    totalTokens: session?.user?.tokensUsed || 0,
    totalCost: ((session?.user?.tokensUsed || 0) * 0.0001),
    totalRequests: Math.floor((session?.user?.tokensUsed || 0) / 100),
    avgResponseTime: 1200,
    providerBreakdown: {
      'OpenAI': 60,
      'Anthropic': 25,
      'OpenRouter': 15
    },
    modelBreakdown: {
      'gpt-4o-mini': 40,
      'claude-3-sonnet': 30,
      'gpt-4': 20,
      'claude-3-haiku': 10
    },
    recentUsage: [
      { date: '2025-01-25', tokens: 150, cost: 0.015, requests: 2 },
      { date: '2025-01-24', tokens: 320, cost: 0.032, requests: 4 },
      { date: '2025-01-23', tokens: 280, cost: 0.028, requests: 3 },
      { date: '2025-01-22', tokens: 190, cost: 0.019, requests: 2 },
      { date: '2025-01-21', tokens: 410, cost: 0.041, requests: 5 },
    ]
  }

  const data = usageData || mockUsageData

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Estatísticas de Uso</h1>
        <p className="text-lg text-gray-600">
          Acompanhe seu consumo de tokens, custos e performance
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data.totalTokens.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600">Total de Tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {data.totalCost.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Custo Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data.totalRequests}
                </p>
                <p className="text-sm text-gray-600">Conversas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(data.avgResponseTime / 1000).toFixed(1)}s
                </p>
                <p className="text-sm text-gray-600">Tempo Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Uso por Provedor
            </CardTitle>
            <CardDescription>
              Distribuição de uso entre diferentes provedores de IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.providerBreakdown).map(([provider, percentage]) => (
                <div key={provider}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{provider}</span>
                    <Badge variant="outline">{percentage}%</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Uso por Modelo
            </CardTitle>
            <CardDescription>
              Distribuição de uso entre diferentes modelos de IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.modelBreakdown).map(([model, percentage]) => (
                <div key={model}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{model}</span>
                    <Badge variant="outline">{percentage}%</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Uso Recente
          </CardTitle>
          <CardDescription>
            Atividade dos últimos 5 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentUsage.map((usage, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {new Date(usage.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {usage.requests} conversa{usage.requests !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {usage.tokens.toLocaleString('pt-BR')} tokens
                  </p>
                  <p className="text-sm text-gray-600">
                    R$ {usage.cost.toFixed(3)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 mb-2">
                Limite de Tokens
              </h4>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-orange-700">
                    {data.totalTokens.toLocaleString('pt-BR')} / {session?.user?.tokensLimit?.toLocaleString('pt-BR') || '10.000'}
                  </span>
                  <span className="text-sm font-medium text-orange-700">
                    {Math.round((data.totalTokens / (session?.user?.tokensLimit || 10000)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((data.totalTokens / (session?.user?.tokensLimit || 10000)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-orange-700">
                {data.totalTokens >= (session?.user?.tokensLimit || 10000) 
                  ? 'Limite atingido! Considere fazer upgrade do seu plano.' 
                  : 'Você ainda tem tokens disponíveis este mês.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
