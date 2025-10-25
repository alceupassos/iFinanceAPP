
# Guia de Deploy iFinanceAI no VPS

## 🚀 Status Atual do Deploy

### ✅ Componentes Instalados e Configurados

1. **NGINX** - Instalado e configurado como proxy reverso
2. **PM2** - Gerenciador de processos Node.js instalado
3. **Next.js App** - Aplicação buildada e rodando (com alguns ajustes de manifest)
4. **Certbot** - Instalado para SSL/TLS

### 📍 Configuração Atual

- **Aplicação Next.js**: Rodando na porta 3000 (gerenciada pelo PM2)
- **NGINX**: Escutando na porta 80, fazendo proxy para porta 3000
- **Domínio Configurado**: ifinanceai.angrax.com.br
- **URL da Aplicação Abacus**: ifinanceone.abacusai.app

---

## 🛠️ Próximos Passos para Conclusão do Deploy

### 1. Configurar DNS do Domínio

Você precisa configurar os registros DNS do seu domínio `angrax.com.br` para apontar para o IP do seu VPS:

#### Tipo A:
```
Host: ifinanceai
Tipo: A
Valor: [IP_DO_SEU_VPS]
TTL: 3600
```

#### Verificar IP do VPS:
```bash
curl ifconfig.me
```

#### Verificar se DNS está propagado:
```bash
dig ifinanceai.angrax.com.br
nslookup ifinanceai.angrax.com.br
```

---

### 2. Configurar SSL/HTTPS

Depois que o DNS estiver apontando corretamente, execute o script de configuração SSL:

```bash
cd /home/ubuntu/ifinance_app
./configure-ssl.sh
```

Este script irá:
- Obter certificado SSL gratuito do Let's Encrypt
- Configurar renovação automática
- Atualizar configuração do NGINX para HTTPS

---

## 📋 Comandos Úteis para Gerenciamento

### PM2 (Gerenciador de Processos)

```bash
# Adicionar PM2 ao PATH (se necessário)
export PATH="/home/ubuntu/.npm-global/bin:$PATH"

# Ver status da aplicação
pm2 list

# Ver logs da aplicação
pm2 logs ifinance-app

# Ver logs em tempo real
pm2 logs ifinance-app --lines 100

# Reiniciar aplicação
pm2 restart ifinance-app

# Parar aplicação
pm2 stop ifinance-app

# Iniciar aplicação
pm2 start ifinance-app

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot (se systemd disponível)
pm2 startup
```

### NGINX

```bash
# Reiniciar NGINX
sudo nginx -s reload

# Parar NGINX
sudo nginx -s stop

# Iniciar NGINX
sudo nginx

# Testar configuração
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log

# Ver logs de acesso
sudo tail -f /var/log/nginx/access.log
```

### Verificar Status da Aplicação

```bash
# Testar localmente
curl -I http://localhost:3000

# Testar via NGINX
curl -I http://localhost

# Testar com o domínio (depois do DNS configurado)
curl -I http://ifinanceai.angrax.com.br
```

---

## 🔍 Troubleshooting

### Aplicação não inicia

```bash
# Ver logs de erro
pm2 logs ifinance-app --err --lines 50

# Verificar se a porta 3000 está livre
sudo netstat -tlnp | grep 3000

# Matar processo na porta 3000 (se necessário)
sudo fuser -k 3000/tcp

# Rebuild da aplicação
cd /home/ubuntu/ifinance_app/nextjs_space
yarn build
pm2 restart ifinance-app
```

### NGINX retorna 502 Bad Gateway

```bash
# Verificar se a aplicação Next.js está rodando
pm2 status

# Verificar se pode conectar localmente
curl http://localhost:3000

# Reiniciar ambos
pm2 restart ifinance-app
sudo nginx -s reload
```

### SSL não funciona

```bash
# Verificar se o domínio aponta para o servidor
dig ifinanceai.angrax.com.br

# Verificar portas abertas no firewall
sudo netstat -tlnp | grep -E ':(80|443)'

# Executar certbot manualmente
sudo certbot --nginx -d ifinanceai.angrax.com.br
```

---

## 📁 Estrutura de Arquivos Importantes

```
/home/ubuntu/ifinance_app/
├── nextjs_space/                    # Aplicação Next.js
│   ├── .env                         # Variáveis de ambiente
│   ├── .next/                       # Build de produção
│   ├── package.json                 # Dependências
│   └── ecosystem.config.js          # Configuração PM2
├── configure-ssl.sh                 # Script de configuração SSL
├── sync-github.sh                   # Script para sync com GitHub
└── DEPLOY_GUIA_VPS.md              # Este guia

/etc/nginx/
├── nginx.conf                       # Configuração principal NGINX
└── sites-available/
    └── ifinanceai                   # Configuração do site
```

---

## 🔐 Variáveis de Ambiente (.env)

A aplicação usa as seguintes variáveis (já configuradas):

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://ifinanceai.angrax.com.br
ABACUSAI_API_KEY=...
AWS_PROFILE=hosted_storage
AWS_REGION=us-west-2
AWS_BUCKET_NAME=...
AWS_FOLDER_PREFIX=7550/
```

---

## 📝 Notas Importantes

### Banco de Dados
- O banco PostgreSQL já está configurado e hospedado pela Abacus.AI
- Não é necessário configurar banco local

### Armazenamento de Arquivos
- Os uploads são armazenados no S3 da AWS (já configurado)
- Não é necessário configurar storage local

### Porta e Firewall
- Certifique-se de que as portas 80 (HTTP) e 443 (HTTPS) estejam abertas no firewall do VPS
- Se usar firewall, libere as portas:
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  ```

### Monitoramento
- Use `pm2 monit` para monitorar uso de CPU/memória em tempo real
- Configure alertas se necessário

---

## 🌐 Acessar a Aplicação

### Antes do DNS (apenas localmente no VPS)
```
http://localhost
```

### Depois do DNS Configurado
```
http://ifinanceai.angrax.com.br
```

### Depois do SSL Configurado
```
https://ifinanceai.angrax.com.br
```

### Aplicação Atual na Abacus.AI
```
https://ifinanceone.abacusai.app
```

---

## 🎯 Checklist Final

- [ ] DNS configurado apontando para o VPS
- [ ] DNS propagado (verificado com `dig` ou `nslookup`)
- [ ] Portas 80 e 443 abertas no firewall
- [ ] SSL configurado com Let's Encrypt
- [ ] Aplicação acessível via HTTPS
- [ ] PM2 configurado para iniciar automaticamente
- [ ] Backup do código feito (GitHub já configurado)
- [ ] Documentação revisada

---

## 📞 Suporte

Se encontrar problemas:

1. **Verificar logs**: `pm2 logs ifinance-app`
2. **Verificar NGINX**: `sudo nginx -t && sudo tail -f /var/log/nginx/error.log`
3. **Reiniciar serviços**: `pm2 restart ifinance-app && sudo nginx -s reload`
4. **Verificar conectividade**: `curl -v http://localhost:3000`

---

## 🔄 Atualizar a Aplicação

Para atualizar o código da aplicação:

```bash
cd /home/ubuntu/ifinance_app/nextjs_space

# Fazer alterações no código...

# Rebuild
yarn build

# Reiniciar aplicação
pm2 restart ifinance-app
```

Ou sincronizar do GitHub (depois de configurar):

```bash
cd /home/ubuntu/ifinance_app
./sync-github.sh
```

---

**Data**: 25 de Outubro de 2025  
**Versão**: 1.0  
**Deploy**: VPS + NGINX + PM2
