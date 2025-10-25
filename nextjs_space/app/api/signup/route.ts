
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, companyName } = await request.json()

    if (!email || !password || !firstName) {
      return NextResponse.json(
        { message: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Usuário já existe com este email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        companyName,
        name: `${firstName} ${lastName}`.trim(),
        role: 'USER',
        plan: 'FREE',
        locale: 'pt-BR',
        timezone: 'America/Sao_Paulo'
      }
    })

    // Don't return password
    const { password: _, ...safeUser } = user

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: safeUser
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
