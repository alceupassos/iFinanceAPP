
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatInterface } from '@/components/chat-interface'
import { FinancialTemplates } from '@/components/financial-templates'
import { UserProfile } from '@/components/user-profile'
import { UsageStats } from '@/components/usage-stats'
import { 
  Bot, 
  MessageCircle, 
  Calculator, 
  User, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

export function DashboardPage() {
  const { data: session } = useSession() || {}
  const [activeTab, setActiveTab] = useState('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  iFinanceAI
                </h1>
                <p className="text-xs text-gray-500">
                  {session.user?.name || session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Button
                variant={activeTab === 'chat' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('chat')
                  setSidebarOpen(false)
                }}
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                Chat IA
              </Button>
              <Button
                variant={activeTab === 'templates' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('templates')
                  setSidebarOpen(false)
                }}
              >
                <Calculator className="w-4 h-4 mr-3" />
                Análise Financeira
              </Button>
              <Button
                variant={activeTab === 'stats' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('stats')
                  setSidebarOpen(false)
                }}
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Estatísticas
              </Button>
              <Button
                variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('profile')
                  setSidebarOpen(false)
                }}
              >
                <User className="w-4 h-4 mr-3" />
                Perfil
              </Button>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-6">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'templates' && <FinancialTemplates />}
          {activeTab === 'stats' && <UsageStats />}
          {activeTab === 'profile' && <UserProfile />}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
