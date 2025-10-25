
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current usage
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        tokensUsed: true,
        tokensLimit: true
      }
    })

    // Get usage logs (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const usageLogs = await prisma.usage.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Calculate statistics
    const totalTokens = usageLogs.reduce((sum, log) => sum + log.tokenCount, 0) || user?.tokensUsed || 0
    const totalCost = usageLogs.reduce((sum, log) => sum + log.cost, 0)
    const totalRequests = usageLogs.length
    const avgResponseTime = usageLogs.length > 0 
      ? usageLogs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / usageLogs.length
      : 1200

    // Provider breakdown (mock data for now)
    const providerBreakdown = {
      'OpenAI': 60,
      'Anthropic': 25,
      'OpenRouter': 15
    }

    // Model breakdown (mock data for now)
    const modelBreakdown = {
      'gpt-4o-mini': 40,
      'claude-3-sonnet': 30,
      'gpt-4': 20,
      'claude-3-haiku': 10
    }

    // Recent usage (last 5 days)
    const recentUsage = []
    for (let i = 0; i < 5; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dayLogs = usageLogs.filter(log => {
        const logDate = new Date(log.date)
        return logDate.toDateString() === date.toDateString()
      })

      recentUsage.push({
        date: date.toISOString().split('T')[0],
        tokens: dayLogs.reduce((sum, log) => sum + log.tokenCount, 0),
        cost: dayLogs.reduce((sum, log) => sum + log.cost, 0),
        requests: dayLogs.length
      })
    }

    return NextResponse.json({
      totalTokens,
      totalCost,
      totalRequests,
      avgResponseTime,
      providerBreakdown,
      modelBreakdown,
      recentUsage
    })

  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
