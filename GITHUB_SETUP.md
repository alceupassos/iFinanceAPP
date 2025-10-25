# Guia de Configuração do Repositório GitHub - ifinanceone

## Passos para Criar e Sincronizar o Repositório

### 1. Criar Repositório no GitHub

Acesse [GitHub](https://github.com/new) e crie um novo repositório com as seguintes configurações:
- **Nome do repositório**: `ifinanceone`
- **Descrição**: "iFinanceAI - Plataforma de análise financeira inteligente com IA"
- **Visibilidade**: Escolha entre Público ou Privado
- **NÃO marque**: "Add a README file", "Add .gitignore", "Choose a license"
  (já temos esses arquivos configurados)

### 2. Comandos para Sincronizar

Após criar o repositório no GitHub, execute os comandos abaixo no terminal:

```bash
# Navegue até o diretório do projeto
cd /home/ubuntu/ifinance_app

# Adicione o repositório remoto (substitua SEU_USERNAME pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USERNAME/ifinanceone.git

# Ou se preferir usar SSH:
# git remote add origin git@github.com:SEU_USERNAME/ifinanceone.git

# Renomeie a branch para main (opcional, mas recomendado)
git branch -M main

# Faça o push inicial
git push -u origin main
```

### 3. Alternativa: Criação Automática com GitHub CLI

Se preferir usar o GitHub CLI, instale e configure:

```bash
# Instalar GitHub CLI (Ubuntu/Debian)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y

# Autenticar
gh auth login

# Criar repositório e fazer push
cd /home/ubuntu/ifinance_app
gh repo create ifinanceone --public --source=. --push
```

## Estrutura do Projeto

```
ifinance_app/
├── nextjs_space/          # Aplicação Next.js
│   ├── app/              # Rotas e páginas
│   ├── components/       # Componentes React
│   ├── lib/              # Bibliotecas e utilitários
│   ├── prisma/           # Schema do banco de dados
│   └── public/           # Arquivos estáticos
└── README.md             # Documentação do projeto
```

## Deploy

A aplicação está deployada em: **https://ifinanceone.abacusai.app**

## Tecnologias Utilizadas

- **Framework**: Next.js 14
- **Banco de Dados**: PostgreSQL (Prisma ORM)
- **Autenticação**: NextAuth.js
- **UI**: Shadcn UI + Tailwind CSS
- **Armazenamento**: AWS S3
- **IA**: Abacus.AI LLM APIs

## Próximos Passos

1. Criar o repositório no GitHub
2. Adicionar o remote origin
3. Fazer o push inicial
4. Configurar branch protection rules (opcional)
5. Adicionar colaboradores (se necessário)

---
Gerado em: $(date)
