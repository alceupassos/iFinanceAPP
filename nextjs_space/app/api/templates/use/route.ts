
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { templateId } = await request.json()

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 })
    }

    let template
    
    // Handle special iFinance template
    if (templateId === 'ifinance-template') {
      template = await prisma.financialTemplate.findFirst({
        where: { 
          name: 'Análise Financeira iFinance',
          active: true 
        }
      })
    } else {
      template = await prisma.financialTemplate.findUnique({
        where: { id: templateId, active: true }
      })
    }

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Log template usage
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'USE_TEMPLATE',
        resource: 'financial_template',
        details: {
          templateId: template.id,
          templateName: template.name
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        prompt: template.prompt
      }
    })

  } catch (error) {
    console.error('Use template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
