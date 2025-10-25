# iFinanceAI 🏦💼

> Plataforma inteligente de análise financeira com IA integrada

[![Deploy](https://img.shields.io/badge/deploy-live-success)](https://iFinanceAPP.abacusai.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.7-2D3748)](https://www.prisma.io/)

## 📋 Sobre o Projeto

iFinanceAI é uma plataforma completa de análise financeira que utiliza inteligência artificial para fornecer insights profundos e relatórios estruturados sobre a saúde financeira de empresas.

### ✨ Funcionalidades Principais

- 🤖 **Chat com IA**: Análise conversacional de dados financeiros
- 📊 **Análise Completa**: Upload de documentos e geração automática de relatórios
- 📁 **Gestão de Arquivos**: Sistema integrado de upload e armazenamento
- 📈 **Templates Financeiros**: Prompts pré-configurados para análises específicas
- 🌙 **Modo Escuro**: Interface adaptável com tema claro e escuro
- 🔐 **Autenticação Segura**: Sistema de login e gerenciamento de usuários

## 🚀 Tecnologias

### Frontend
- **Next.js 14** - Framework React com SSR
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes de interface
- **React Hook Form** - Gerenciamento de formulários

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js** - Autenticação

### Infraestrutura
- **AWS S3** - Armazenamento de arquivos
- **Abacus.AI** - APIs de LLM
- **Vercel/Abacus** - Deploy e hospedagem

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ou superior
- Yarn
- PostgreSQL
- Conta AWS (para S3)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/SEU_USERNAME/iFinanceAPP.git
cd iFinanceAPP/nextjs_space
```

2. **Instale as dependências**
```bash
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ifinance"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3
AWS_BUCKET_NAME="your-bucket-name"
AWS_FOLDER_PREFIX="uploads/"

# Abacus.AI
ABACUSAI_API_KEY="your-api-key"
```

4. **Configure o banco de dados**
```bash
yarn prisma generate
yarn prisma db push
```

5. **Execute o projeto**
```bash
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🗂️ Estrutura do Projeto

```
ifinance_app/
└── nextjs_space/
    ├── app/
    │   ├── api/              # Endpoints da API
    │   │   ├── auth/         # Autenticação
    │   │   ├── chat/         # Chat com IA
    │   │   ├── financial-analysis/  # Análise financeira
    │   │   ├── templates/    # Templates de prompts
    │   │   └── upload/       # Upload de arquivos
    │   ├── globals.css       # Estilos globais
    │   ├── layout.tsx        # Layout principal
    │   └── page.tsx          # Página inicial
    ├── components/
    │   ├── auth-page.tsx     # Componente de autenticação
    │   ├── chat-interface.tsx # Interface de chat
    │   ├── dashboard-page.tsx # Dashboard principal
    │   ├── financial-templates.tsx # Templates
    │   └── ui/               # Componentes UI (Shadcn)
    ├── lib/
    │   ├── auth.ts           # Configuração NextAuth
    │   ├── aws-config.ts     # Configuração AWS
    │   ├── db.ts             # Cliente Prisma
    │   ├── s3.ts             # Funções S3
    │   └── types.ts          # Tipos TypeScript
    ├── prisma/
    │   └── schema.prisma     # Schema do banco de dados
    └── public/
        └── favicon.svg       # Ícone da aplicação
```

## 📝 Uso

### Análise Financeira Completa

1. Faça login na plataforma
2. No dashboard, clique em "Análise Financeira"
3. Faça upload do documento financeiro (PDF, Excel, CSV)
4. Aguarde o processamento
5. Visualize o relatório estruturado com:
   - Resumo executivo
   - Análise de liquidez
   - Análise de rentabilidade
   - Estrutura de capital
   - Eficiência operacional
   - Recomendações estratégicas

### Chat com IA

1. Acesse a interface de chat
2. Faça perguntas sobre finanças
3. Receba respostas contextualizadas
4. Utilize templates pré-configurados para análises específicas

## 🔒 Segurança

- Autenticação JWT com NextAuth.js
- Senhas criptografadas com bcrypt
- Validação de entrada em todos os endpoints
- Proteção CSRF
- Headers de segurança configurados

## 🌐 Deploy

A aplicação está em produção em: **[https://iFinanceAPP.abacusai.app](https://iFinanceAPP.abacusai.app)**

### Fazer Deploy

```bash
# Pelo Abacus.AI
# O deploy é automatizado via plataforma

# Ou via Vercel
vercel --prod
```

## 🧪 Testes

```bash
# Rodar testes (quando implementados)
yarn test

# Build de produção
yarn build

# Iniciar em modo produção
yarn start
```

## 📄 Licença

Este projeto é privado e confidencial.

## 👥 Contribuindo

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para questões e suporte, entre em contato através do repositório.

---

Desenvolvido com ❤️ usando Next.js e Abacus.AI
