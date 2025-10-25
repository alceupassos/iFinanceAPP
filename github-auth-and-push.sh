
#!/bin/bash

echo "============================================"
echo "   GitHub Authentication & Push - iFinanceOne"
echo "============================================"
echo ""

# Autenticar no GitHub
echo "→ Iniciando autenticação no GitHub..."
echo ""
gh auth login

echo ""
echo "→ Fazendo push para o GitHub..."
cd /home/ubuntu/ifinance_app
git push -u origin main

echo ""
echo "============================================"
echo "   ✓ Push concluído com sucesso!           "
echo "============================================"
echo ""
echo "Acesse seu repositório em:"
echo "https://github.com/alceupassos/ifinanceone"
echo ""
