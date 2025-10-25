#!/bin/bash

echo "=================================="
echo "Configuração SSL - iFinanceAI"
echo "=================================="
echo ""
echo "Tentando obter certificado SSL para ifinanceai.angrax.com.br..."
echo ""

# Obter certificado
sudo certbot --nginx -d ifinanceai.angrax.com.br --non-interactive --agree-tos --email admin@angrax.com.br --redirect

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL configurado com sucesso!"
    echo ""
    echo "Seu site está disponível em: https://ifinanceai.angrax.com.br"
    echo ""
    echo "Configurando renovação automática..."
    sudo certbot renew --dry-run
else
    echo ""
    echo "❌ Falha ao configurar SSL"
    echo ""
    echo "Verifique se:"
    echo "1. O domínio ifinanceai.angrax.com.br está apontando para este servidor"
    echo "2. As portas 80 e 443 estão abertas no firewall"
    echo "3. Se estiver usando Cloudflare, configure o SSL mode para 'Full' ou 'Full (strict)'"
    echo ""
fi
