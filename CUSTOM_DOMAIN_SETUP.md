
# 🌐 Configuração de Domínio Personalizado - ifinanceai.angrax.com.br

## ✅ Status do Repositório GitHub
- Repositório criado: https://github.com/alceupassos/ifinanceone
- Push concluído com sucesso
- Branch: main
- Commits sincronizados: 17+

---

## 🎯 Configuração do Domínio Personalizado

Para configurar o domínio **ifinanceai.angrax.com.br** para sua aplicação Next.js hospedada na Abacus.AI, você precisa seguir o processo oficial.

### 📚 Recursos Oficiais

1. **Console de Gerenciamento de Apps:**
   - URL: https://apps.abacus.ai/chatllm/?appId=appllm_engineer
   - Aqui você pode configurar seu domínio personalizado, obter as configurações DNS necessárias e gerenciar certificados SSL.

2. **Documentação Oficial de Configuração de Domínio:**
   - URL: https://abacus.ai/help/howTo/chatllm/app_deployment_and_custom_domain_how_to
   - Guia completo com instruções passo a passo

---

## 📋 Processo Geral de Configuração

### 1. Configurar no Console da Abacus.AI

1. Acesse o console: https://apps.abacus.ai/chatllm/?appId=appllm_engineer
2. Selecione seu projeto **iFinanceAI**
3. Navegue até a seção de configuração de domínio
4. Adicione o domínio: `ifinanceai.angrax.com.br`
5. O console fornecerá:
   - Instruções específicas de configuração DNS
   - Certificados SSL necessários
   - Status da verificação do domínio

### 2. Configurar DNS no Provedor do Domínio

Você precisará acessar o painel de controle do seu provedor de domínio (angrax.com.br) e configurar os registros DNS conforme instruído pelo console da Abacus.AI.

**Tipos comuns de registros DNS necessários:**
- **CNAME**: Para apontar o subdomínio para o servidor da Abacus.AI
- **A Record**: Ou um registro A com o IP fornecido
- **TXT**: Para verificação de propriedade do domínio

### 3. Aguardar Propagação DNS

- A propagação DNS pode levar de alguns minutos até 48 horas
- Você pode verificar o status usando ferramentas como:
  - https://dnschecker.org/
  - `dig ifinanceai.angrax.com.br`
  - `nslookup ifinanceai.angrax.com.br`

---

## ⚠️ Informações Importantes

### Sobre Nginx no VPS

**Não é necessário configurar Nginx no seu VPS** para este caso, porque:

1. Sua aplicação está hospedada na infraestrutura da Abacus.AI
2. O domínio personalizado é gerenciado diretamente pelo console da Abacus.AI
3. A Abacus.AI já fornece:
   - Servidor web configurado
   - Certificados SSL automáticos
   - CDN e otimizações
   - Load balancing

### Se você tiver um VPS separado

Se você planeja hospedar a aplicação no seu próprio VPS (diferente da hospedagem Abacus.AI), você precisaria:

1. Configurar o servidor web (Nginx/Apache)
2. Instalar certificados SSL (Let's Encrypt)
3. Configurar proxy reverso
4. Gerenciar o processo da aplicação (PM2/systemd)

**Mas isso seria uma configuração diferente** e não é necessária para usar o domínio personalizado com a hospedagem da Abacus.AI.

---

## 🔍 Verificação e Troubleshooting

### Verificar se o DNS está configurado corretamente:

```bash
# Verificar registros DNS
dig ifinanceai.angrax.com.br

# Ou com nslookup
nslookup ifinanceai.angrax.com.br

# Verificar registros CNAME
dig CNAME ifinanceai.angrax.com.br
```

### Problemas Comuns:

1. **Domínio não resolve:**
   - Verifique se os registros DNS foram configurados corretamente
   - Aguarde a propagação DNS (pode levar até 48h)

2. **Certificado SSL inválido:**
   - Aguarde a emissão automática do certificado
   - Verifique no console se o domínio foi validado

3. **Erro 404 ou página não encontrada:**
   - Verifique se o domínio foi configurado corretamente no console
   - Confirme se a aplicação está deployada e funcionando

---

## 📞 Suporte

Para questões específicas sobre:
- **Configuração de DNS**: Consulte a documentação do seu provedor de domínio
- **Configuração na Abacus.AI**: Consulte a documentação oficial ou entre em contato com o suporte
- **Registro de domínio**: Consulte o registrador do seu domínio (angrax.com.br)

---

## ✅ Checklist de Configuração

- [ ] Acessar console de apps: https://apps.abacus.ai/chatllm/?appId=appllm_engineer
- [ ] Adicionar domínio: ifinanceai.angrax.com.br
- [ ] Obter instruções de configuração DNS
- [ ] Configurar registros DNS no provedor do domínio
- [ ] Aguardar propagação DNS (até 48h)
- [ ] Verificar resolução DNS com `dig` ou `nslookup`
- [ ] Verificar acesso via navegador: https://ifinanceai.angrax.com.br
- [ ] Confirmar certificado SSL está ativo

---

## 🎯 URLs do Projeto

- **Aplicação atual**: https://ifinanceone.abacusai.app
- **Domínio personalizado (após configuração)**: https://ifinanceai.angrax.com.br
- **Repositório GitHub**: https://github.com/alceupassos/ifinanceone
- **Console de apps**: https://apps.abacus.ai/chatllm/?appId=appllm_engineer

---

**Para mais informações detalhadas, consulte a documentação oficial:**
https://abacus.ai/help/howTo/chatllm/app_deployment_and_custom_domain_how_to

---

_Última atualização: 25 de outubro de 2025_
