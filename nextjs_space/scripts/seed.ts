
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const IFINANCE_TEMPLATE_PROMPT = `# Sistema: Especialista em Análise Financeira - iFinance

Você é um especialista em análise financeira corporativa, focado no mercado brasileiro. 
Sua função é analisar demonstrativos financeiros (DRE e DFC) e fornecer insights 
estratégicos para tomada de decisão.

## Sua Expertise:
- Análise de Demonstração do Resultado do Exercício (DRE)
- Análise de Demonstração de Fluxo de Caixa (DFC)
- Cálculo e interpretação de indicadores financeiros
- Identificação de tendências e padrões
- Recomendações estratégicas baseadas em dados

## Metodologia de Análise:

### 1. Análise Horizontal e Vertical
- Compare períodos (mês a mês, ano a ano)
- Calcule variações percentuais
- Identifique tendências significativas

### 2. Indicadores Chave
- Margem de Lucro (Bruta, Operacional, Líquida)
- EBITDA e Margem EBITDA
- Liquidez (Corrente, Seca, Imediata)
- Endividamento
- Retorno sobre Investimento (ROI)
- Prazo Médio de Recebimento/Pagamento

### 3. Análise de Fluxo de Caixa
- Fluxo Operacional
- Fluxo de Investimento
- Fluxo de Financiamento
- Saldo Final de Caixa

### 4. Insights Estratégicos
- Pontos fortes identificados
- Áreas de atenção ou preocupação
- Oportunidades de melhoria
- Recomendações práticas

## Formato de Saída:

### Resumo Executivo
[Visão geral da situação financeira em 2-3 parágrafos]

### Análise Detalhada
[Análise completa dos demonstrativos]

### Indicadores Financeiros
[Tabela com todos os indicadores calculados]

### Próximos Passos e Recomendações
[Ações recomendadas com base na análise]

## Diretrizes:
- Sempre trabalhe em Português (pt-BR)
- Use formatação clara e profissional
- Cite os números dos demonstrativos
- Seja objetivo e prático
- Considere o contexto brasileiro (LGPD, CPC, tributação)
- Mantenha tom consultivo e estratégico

Quando o usuário enviar documentos financeiros, analise-os seguindo esta metodologia e forneça insights valiosos para a gestão corporativa.`

async function main() {
  console.log('🌱 Starting seed process...')

  try {
    // Create test admin user (john@doe.com / johndoe123)
    const hashedAdminPassword = await bcrypt.hash('johndoe123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: hashedAdminPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        companyName: 'iFinanceAI',
        jobTitle: 'Administrator',
        role: 'SUPER_ADMIN',
        plan: 'ENTERPRISE',
        locale: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        tokensUsed: 0,
        tokensLimit: 100000, // Higher limit for admin
      }
    })

    console.log(`✅ Created admin user: ${adminUser.email}`)

    // Create additional test user
    const hashedUserPassword = await bcrypt.hash('password123', 12)
    
    const testUser = await prisma.user.upsert({
      where: { email: 'usuario@teste.com' },
      update: {},
      create: {
        email: 'usuario@teste.com',
        password: hashedUserPassword,
        firstName: 'Usuario',
        lastName: 'Teste',
        name: 'Usuario Teste',
        companyName: 'Empresa Teste Ltda',
        jobTitle: 'CFO',
        role: 'USER',
        plan: 'PRO',
        locale: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        tokensUsed: 1250,
        tokensLimit: 50000,
      }
    })

    console.log(`✅ Created test user: ${testUser.email}`)

    // Create iFinance Financial Template
    const existingIfinanceTemplate = await prisma.financialTemplate.findFirst({
      where: { name: 'Análise Financeira iFinance' }
    })

    let ifinanceTemplate
    if (existingIfinanceTemplate) {
      ifinanceTemplate = await prisma.financialTemplate.update({
        where: { id: existingIfinanceTemplate.id },
        data: {
          prompt: IFINANCE_TEMPLATE_PROMPT,
          description: 'Template especializado em análise de DRE e DFC para o mercado brasileiro',
        }
      })
      console.log(`✅ Updated iFinance template: ${ifinanceTemplate.name}`)
    } else {
      ifinanceTemplate = await prisma.financialTemplate.create({
        data: {
          name: 'Análise Financeira iFinance',
          description: 'Template especializado em análise de DRE e DFC para o mercado brasileiro',
          prompt: IFINANCE_TEMPLATE_PROMPT,
          category: 'financial_analysis',
          language: 'pt-BR',
          active: true,
          model: 'gpt-4o-mini',
          temperature: 0.3,
          maxTokens: 4000,
        }
      })
      console.log(`✅ Created iFinance template: ${ifinanceTemplate.name}`)
    }

    // Create additional financial templates
    const templates = [
      {
        name: 'Análise de Fluxo de Caixa',
        description: 'Template focado em análise detalhada de fluxo de caixa e liquidez',
        category: 'cash_flow',
        prompt: `Você é um especialista em análise de fluxo de caixa. Analise demonstrativos de fluxo de caixa e forneça insights sobre liquidez, necessidades de capital de giro e gestão financeira. Considere o contexto brasileiro e as normas CPC.`
      },
      {
        name: 'Relatórios Financeiros',
        description: 'Template para geração de relatórios executivos e apresentações',
        category: 'reporting',
        prompt: `Você é um especialista em relatórios financeiros corporativos. Crie relatórios executivos, apresentações e dashboards baseados em dados financeiros. Use linguagem clara e gráficos quando apropriado.`
      }
    ]

    for (const template of templates) {
      const existingTemplate = await prisma.financialTemplate.findFirst({
        where: { name: template.name }
      })

      if (existingTemplate) {
        await prisma.financialTemplate.update({
          where: { id: existingTemplate.id },
          data: {
            description: template.description,
            prompt: template.prompt
          }
        })
        console.log(`✅ Updated template: ${template.name}`)
      } else {
        await prisma.financialTemplate.create({
          data: {
            name: template.name,
            description: template.description,
            prompt: template.prompt,
            category: template.category,
            language: 'pt-BR',
            active: true,
            model: 'gpt-4o-mini',
            temperature: 0.3,
            maxTokens: 4000,
          }
        })
        console.log(`✅ Created template: ${template.name}`)
      }
    }

    // Create sample workspace
    const workspace = await prisma.workspace.upsert({
      where: { slug: 'default-workspace' },
      update: {},
      create: {
        name: 'Workspace Principal',
        slug: 'default-workspace',
        description: 'Workspace padrão para análises financeiras',
        settings: {
          defaultModel: 'gpt-4o-mini',
          allowedProviders: ['openai', 'anthropic', 'openrouter']
        }
      }
    })

    console.log(`✅ Created workspace: ${workspace.name}`)

    // Add users to workspace
    await prisma.workspaceMember.upsert({
      where: {
        userId_workspaceId: {
          userId: adminUser.id,
          workspaceId: workspace.id
        }
      },
      update: {},
      create: {
        userId: adminUser.id,
        workspaceId: workspace.id,
        role: 'OWNER'
      }
    })

    await prisma.workspaceMember.upsert({
      where: {
        userId_workspaceId: {
          userId: testUser.id,
          workspaceId: workspace.id
        }
      },
      update: {},
      create: {
        userId: testUser.id,
        workspaceId: workspace.id,
        role: 'MEMBER'
      }
    })

    console.log('✅ Added users to workspace')

    // Create sample usage logs
    const usageLogs = [
      {
        userId: testUser.id,
        provider: 'openai',
        model: 'gpt-4o-mini',
        tokenCount: 150,
        cost: 0.015,
        requestType: 'chat',
        responseTime: 1200,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        userId: testUser.id,
        provider: 'anthropic',
        model: 'claude-3-sonnet',
        tokenCount: 320,
        cost: 0.032,
        requestType: 'chat',
        responseTime: 1500,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: testUser.id,
        provider: 'openrouter',
        model: 'gpt-4',
        tokenCount: 780,
        cost: 0.078,
        requestType: 'chat',
        responseTime: 2000,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ]

    for (const log of usageLogs) {
      await prisma.usage.create({ data: log })
    }

    console.log('✅ Created sample usage logs')

    // Create audit logs
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: 'SEED_DATABASE',
        resource: 'system',
        details: {
          message: 'Database seeded with initial data'
        }
      }
    })

    console.log('✅ Created audit logs')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📝 Test Accounts Created:')
    console.log('   🔐 Admin: john@doe.com / johndoe123 (SUPER_ADMIN)')
    console.log('   👤 User:  usuario@teste.com / password123 (USER)')
    console.log('\n🔧 Templates Created:')
    console.log('   📊 Análise Financeira iFinance (Main template)')
    console.log('   💰 Análise de Fluxo de Caixa')
    console.log('   📋 Relatórios Financeiros')
    console.log('\n🏢 Workspace Created: Workspace Principal')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
