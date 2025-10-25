
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        companyName: true,
        jobTitle: true,
        image: true,
        role: true,
        plan: true,
        locale: true,
        timezone: true,
        tokensUsed: true,
        tokensLimit: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error('Get profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { firstName, lastName, companyName, jobTitle, timezone, locale } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        companyName,
        jobTitle,
        timezone,
        locale
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        companyName: true,
        jobTitle: true,
        role: true,
        plan: true,
        locale: true,
        timezone: true
      }
    })

    // Log profile update
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_PROFILE',
        resource: 'user',
        details: {
          changes: { firstName, lastName, companyName, jobTitle, timezone, locale }
        }
      }
    })

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error('Update profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
