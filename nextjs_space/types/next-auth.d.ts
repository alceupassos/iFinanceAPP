
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
      plan: 'FREE' | 'START' | 'PRO' | 'ENTERPRISE'
      tokensUsed: number
      tokensLimit: number
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    plan: 'FREE' | 'START' | 'PRO' | 'ENTERPRISE'
    tokensUsed: number
    tokensLimit: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    plan: 'FREE' | 'START' | 'PRO' | 'ENTERPRISE'
    tokensUsed: number
    tokensLimit: number
  }
}
