
# 🚀 Guia Rápido de Sincronização com GitHub

## Pré-requisitos
1. Tenha uma conta no GitHub
2. Crie um novo repositório vazio chamado `ifinanceone` em https://github.com/new

## Sincronização (Escolha uma opção)

### Opção A: Usando HTTPS (Mais simples)
```bash
cd /home/ubuntu/ifinance_app

# Configure seu usuário Git (se ainda não configurou)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Adicione o remote (substitua SEU_USERNAME pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USERNAME/ifinanceone.git

# Renomeie a branch para main
git branch -M main

# Faça o push
git push -u origin main
```

**Você precisará fornecer:**
- Username do GitHub
- Personal Access Token (não a senha) - crie em: https://github.com/settings/tokens

### Opção B: Usando SSH (Mais seguro)
```bash
cd /home/ubuntu/ifinance_app

# Configure seu usuário Git (se ainda não configurou)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Adicione o remote (substitua SEU_USERNAME pelo seu usuário do GitHub)
git remote add origin git@github.com:SEU_USERNAME/ifinanceone.git

# Renomeie a branch para main
git branch -M main

# Faça o push
git push -u origin main
```

**Pré-requisitos para SSH:**
- Ter chave SSH configurada no GitHub (https://github.com/settings/keys)

---

## Opção C: Usando o Script Interativo
```bash
cd /home/ubuntu/ifinance_app
./sync-github.sh
```

O script irá guiá-lo pelo processo de forma interativa.

---

## Após a Sincronização

Seu repositório estará disponível em:
```
https://github.com/SEU_USERNAME/ifinanceone
```

## Comandos Úteis

### Verificar status
```bash
git status
```

### Fazer commit de novas alterações
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

### Atualizar do GitHub
```bash
git pull
```

---

## Problemas Comuns

### Erro de autenticação
- **HTTPS**: Use Personal Access Token, não sua senha
- **SSH**: Certifique-se de que sua chave SSH está adicionada ao GitHub

### Remote já existe
```bash
git remote remove origin
# Então adicione novamente
```

### Conflitos
```bash
git pull --rebase
# Resolva conflitos manualmente
git push
```

---

**Nota**: Este repositório já está configurado com `.gitignore` apropriado e todas as mudanças já estão commitadas.
