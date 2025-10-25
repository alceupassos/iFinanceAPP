
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  Mail, 
  Building2, 
  MapPin, 
  Clock,
  Crown,
  Settings,
  Save,
  Loader2
} from 'lucide-react'

export function UserProfile() {
  const { data: session, update } = useSession() || {}
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    jobTitle: '',
    timezone: 'America/Sao_Paulo',
    locale: 'pt-BR'
  })
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          companyName: data.companyName || '',
          jobTitle: data.jobTitle || '',
          timezone: data.timezone || 'America/Sao_Paulo',
          locale: data.locale || 'pt-BR'
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        toast({
          title: 'Perfil Atualizado',
          description: 'Suas informações foram salvas com sucesso.'
        })
        // Update session
        await update()
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar perfil. Tente novamente.',
        variant: 'destructive'
      })
    }

    setIsLoading(false)
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return <Badge variant="outline">Gratuito</Badge>
      case 'START':
        return <Badge className="bg-blue-600">Start - R$ 69/mês</Badge>
      case 'PRO':
        return <Badge className="bg-green-600">Pro - R$ 99/mês</Badge>
      case 'ENTERPRISE':
        return <Badge className="bg-purple-600">Enterprise - R$ 299/mês</Badge>
      default:
        return <Badge variant="outline">Gratuito</Badge>
    }
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
        </div>
      </div>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                Status da Conta
              </CardTitle>
              <CardDescription>Informações sobre seu plano e uso</CardDescription>
            </div>
            {getPlanBadge(session.user?.plan || 'FREE')}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {session.user?.tokensUsed || 0}
              </div>
              <div className="text-sm text-gray-600">Tokens Usados</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {session.user?.tokensLimit || 10000}
              </div>
              <div className="text-sm text-gray-600">Limite de Tokens</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(((session.user?.tokensUsed || 0) / (session.user?.tokensLimit || 10000)) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Uso do Limite</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e preferências
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Seu nome"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Seu sobrenome"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center mt-1">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <Input
                  id="email"
                  value={session.user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email não pode ser alterado
              </p>
            </div>

            {/* Company Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Empresa</Label>
                <div className="flex items-center mt-1">
                  <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                  <Input
                    id="companyName"
                    value={userData.companyName}
                    onChange={(e) => setUserData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Nome da sua empresa"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="jobTitle">Cargo</Label>
                <Input
                  id="jobTitle"
                  value={userData.jobTitle}
                  onChange={(e) => setUserData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="Seu cargo"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Fuso Horário</Label>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <Select value={userData.timezone} onValueChange={(value) => setUserData(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                      <SelectItem value="America/Rio_Branco">Rio Branco (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="locale">Idioma</Label>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <Select value={userData.locale} onValueChange={(value) => setUserData(prev => ({ ...prev, locale: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Gerencie as configurações de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Alterar Senha</h4>
                <p className="text-sm text-gray-600">
                  Atualize sua senha para manter sua conta segura
                </p>
              </div>
              <Button variant="outline" size="sm">
                Alterar
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Autenticação em Duas Etapas</h4>
                <p className="text-sm text-gray-600">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
