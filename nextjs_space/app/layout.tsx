
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/session-provider'

export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'iFinanceAI - Inteligência Artificial para Gestão Financeira Corporativa',
  description: 'Plataforma conversacional de IA para análise e gestão financeira corporativa. Integração com múltiplos modelos de linguagem (OpenAI, Anthropic, OpenRouter) com foco no mercado brasileiro.',
  keywords: 'IA financeira, análise financeira, DRE, DFC, gestão corporativa, inteligência artificial, finanças, Brasil',
  authors: [{ name: 'iFinanceAI Team' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'iFinanceAI - IA para Finanças Corporativas',
    description: 'Análise financeira inteligente com IA. Especializado em DRE, DFC e gestão corporativa para o mercado brasileiro.',
    url: 'https://app.ifinanceai.com.br',
    siteName: 'iFinanceAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'iFinanceAI - Conversational AI for Corporate Finance',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iFinanceAI - IA para Finanças Corporativas',
    description: 'Análise financeira inteligente com IA. Especializado em DRE, DFC e gestão corporativa.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://app.ifinanceai.com.br'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
