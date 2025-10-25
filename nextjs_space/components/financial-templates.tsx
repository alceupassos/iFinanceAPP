
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Zap,
  ArrowRight
} from 'lucide-react'

interface FinancialTemplate {
  id: string
  name: string
  description: string
  category: string
  model: string
  temperature: number
  maxTokens: number
}

export function FinancialTemplates() {
  const [templates, setTemplates] = useState<FinancialTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
    setIsLoading(false)
  }

  const useTemplate = async (templateId: string) => {
    try {
      const response = await fetch('/api/templates/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      if (response.ok) {
        toast({
          title: 'Template Ativado',
          description: 'Template carregado com sucesso! Vá para o Chat para começar.',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar template. Tente novamente.',
        variant: 'destructive'
      })
    }
  }

  const getIcon = (category: string) => {
    switch (category) {
      case 'financial_analysis':
        return <BarChart3 className="w-6 h-6 text-blue-600" />
      case 'cash_flow':
        return <TrendingUp className="w-6 h-6 text-green-600" />
      case 'reporting':
        return <FileText className="w-6 h-6 text-purple-600" />
      default:
        return <Calculator className="w-6 h-6 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Templates de Análise Financeira
        </h1>
        <p className="text-lg text-gray-600">
          Templates pré-configurados para análises financeiras especializadas
        </p>
      </div>

      {/* Featured Template - iFinance */}
      <Card className="mb-8 border-2 border-gradient-to-r from-blue-200 to-green-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">
                Análise Financeira iFinance
                <Badge className="ml-2 bg-gradient-to-r from-blue-600 to-green-600">
                  DESTAQUE
                </Badge>
              </CardTitle>
              <CardDescription>
                Template especializado em análise de DRE e DFC para o mercado brasileiro
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Características:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Análise de Demonstração do Resultado do Exercício (DRE)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Análise de Demonstração de Fluxo de Caixa (DFC)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                  Cálculo de indicadores financeiros-chave
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                  Recomendações estratégicas personalizadas
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contexto Brasileiro:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Normas contábeis brasileiras (CPC)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Formatação em Real (BRL)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                  Considerações tributárias
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                  Compliance com LGPD
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              onClick={() => useTemplate('ifinance-template')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Usar Template iFinance
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Badge variant="outline">GPT-4 Mini</Badge>
              <Badge variant="outline">Temperature: 0.3</Badge>
              <Badge variant="outline">Max Tokens: 4000</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Templates */}
      <div className="grid lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getIcon(template.category)}
                </div>
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge variant="outline">{template.model}</Badge>
                  <Badge variant="outline">Temp: {template.temperature}</Badge>
                </div>
                <Button
                  onClick={() => useTemplate(template.id)}
                  variant="outline"
                  size="sm"
                >
                  Usar Template
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum template adicional encontrado
            </h3>
            <p className="text-gray-600">
              Use o template iFinance acima para começar suas análises financeiras.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="mt-8 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Como usar os templates?
              </h4>
              <p className="text-sm text-blue-700">
                Clique em "Usar Template" para ativar um template especializado. 
                Em seguida, vá para a seção Chat e comece a conversar. 
                O template será automaticamente aplicado com configurações otimizadas para análise financeira.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
