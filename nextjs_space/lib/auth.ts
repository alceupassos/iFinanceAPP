
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.firstName || user.email,
          image: user.image,
          role: user.role,
          plan: user.plan,
          tokensUsed: user.tokensUsed,
          tokensLimit: user.tokensLimit
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.plan = user.plan
        token.tokensUsed = user.tokensUsed
        token.tokensLimit = user.tokensLimit
      } else if (token.id) {
        // Refresh user data on subsequent requests
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: {
              id: true,
              role: true,
              plan: true,
              tokensUsed: true,
              tokensLimit: true
            }
          })

          if (dbUser) {
            token.role = dbUser.role
            token.plan = dbUser.plan
            token.tokensUsed = dbUser.tokensUsed
            token.tokensLimit = dbUser.tokensLimit
          }
        } catch (error) {
          console.error('Error refreshing user data in JWT:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.plan = token.plan
        session.user.tokensUsed = token.tokensUsed
        session.user.tokensLimit = token.tokensLimit
      }
      return session
    }
  }
}
