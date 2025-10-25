
# 🔐 Configuração de Variáveis de Ambiente

Este documento explica como configurar as variáveis de ambiente necessárias para executar o **iFinanceAPP**.

## 📋 Variáveis Obrigatórias

### 1. **Database (PostgreSQL)**

```env
DATABASE_URL='postgresql://user:password@host:port/database'
```

- Conexão com o banco de dados PostgreSQL
- Contém credenciais de autenticação
- **Formato**: `postgresql://[user]:[password]@[host]:[port]/[database]?connect_timeout=15`

### 2. **NextAuth (Autenticação)**

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.com
```

- `NEXTAUTH_SECRET`: Chave secreta para criptografia de sessões (gerar com: `openssl rand -base64 32`)
- `NEXTAUTH_URL`: URL completa da aplicação (produção ou desenvolvimento)

### 3. **Abacus AI API**

```env
ABACUSAI_API_KEY=your-abacus-api-key
```

- Chave de API para acessar modelos LLM via Abacus.AI
- Obtida no console: https://apps.abacus.ai/

### 4. **AWS S3 (Armazenamento de Arquivos)**

```env
AWS_PROFILE=hosted_storage
AWS_REGION=us-west-2
AWS_BUCKET_NAME=your-bucket-name
AWS_FOLDER_PREFIX=your-folder-prefix/
```

- Configuração para upload de documentos financeiros
- `AWS_PROFILE`: Perfil de credenciais AWS (geralmente `hosted_storage`)
- `AWS_REGION`: Região do bucket S3
- `AWS_BUCKET_NAME`: Nome do bucket
- `AWS_FOLDER_PREFIX`: Prefixo da pasta (terminar com `/`)

## 🔧 Variáveis Opcionais

### 5. **GROQ API (Modelos Llama e Mixtral)**

```env
GROQ_API_KEY=your-groq-api-key
```

- **Opcional** - Necessária apenas se você quiser usar modelos Llama ou Mixtral
- Obtida em: https://console.groq.com/
- Permite acesso a modelos de alta performance:
  - Llama 3.1 70B Versatile
  - Llama 3.1 8B Instant
  - Mixtral 8x7B

## 🚀 Como Configurar

### Método 1: Copiar o arquivo de exemplo

```bash
cd /home/ubuntu/ifinance_app/nextjs_space
cp .env.example .env
nano .env  # ou use seu editor preferido
```

### Método 2: Criar manualmente

```bash
cd /home/ubuntu/ifinance_app/nextjs_space
touch .env
```

Depois, cole as variáveis acima e preencha com seus valores.

## ⚠️ Segurança

### ✅ Boas Práticas

1. **NUNCA** commite o arquivo `.env` no Git
2. **SEMPRE** use `.env.example` para documentar variáveis necessárias (sem valores reais)
3. **Mantenha** o `.env` no `.gitignore`
4. **Gere** secrets fortes para `NEXTAUTH_SECRET` usando:
   ```bash
   openssl rand -base64 32
   ```
5. **Rotacione** as chaves de API periodicamente

### 🔒 Verificação de Segurança

O GitHub tem **Push Protection** ativada e bloqueará automaticamente qualquer push que contenha:
- Chaves de API
- Secrets
- Tokens de acesso
- Credenciais de banco de dados

## 📝 Arquivo `.env.example`

Um arquivo `.env.example` está incluído no repositório com **placeholders** (sem valores reais). Use-o como referência:

```bash
cat .env.example
```

## 🔄 Ambientes Diferentes

### Desenvolvimento Local

```env
NEXTAUTH_URL=http://localhost:3000
```

### Produção

```env
NEXTAUTH_URL=https://ifinanceai.angrax.com.br
```

## 🆘 Troubleshooting

### Erro: "Missing environment variables"

**Causa**: Variáveis não configuradas no `.env`

**Solução**: Verifique se todas as variáveis obrigatórias estão presentes

```bash
cat .env | grep -E "DATABASE_URL|NEXTAUTH_SECRET|ABACUSAI_API_KEY"
```

### Erro: "Failed to connect to database"

**Causa**: `DATABASE_URL` incorreta ou banco de dados inacessível

**Solução**: 
1. Verifique a string de conexão
2. Teste a conexão:
   ```bash
   psql "$DATABASE_URL"
   ```

### Erro: "AWS S3 upload failed"

**Causa**: Credenciais AWS incorretas ou bucket inexistente

**Solução**:
1. Verifique as credenciais AWS
2. Confirme que o bucket existe na região especificada
3. Verifique as permissões IAM

## 📚 Referências

- [NextAuth.js Documentation](https://next-auth.js.org/configuration/options)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [GROQ API Documentation](https://console.groq.com/docs)
- [Abacus.AI Documentation](https://abacus.ai/help)

---

**Última atualização**: 25 de Outubro de 2025  
**Versão**: 1.0.0
