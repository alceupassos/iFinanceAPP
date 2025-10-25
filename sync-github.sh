#!/bin/bash

# Script de sincronização com GitHub - ifinanceone

echo "============================================"
echo "   Sincronização GitHub - iFinanceOne      "
echo "============================================"
echo ""

# Verificar se o remote já existe
if git remote get-url origin >/dev/null 2>&1; then
    echo "✓ Remote 'origin' já configurado:"
    git remote get-url origin
    echo ""
    read -p "Deseja atualizar o remote? (s/n): " UPDATE_REMOTE
    if [ "$UPDATE_REMOTE" = "s" ] || [ "$UPDATE_REMOTE" = "S" ]; then
        read -p "Digite o novo URL do repositório: " NEW_URL
        git remote set-url origin "$NEW_URL"
        echo "✓ Remote atualizado!"
    fi
else
    echo "→ Remote 'origin' não configurado"
    echo ""
    read -p "Digite seu usuário do GitHub: " GH_USERNAME
    read -p "Usar SSH (s) ou HTTPS (n)? [n]: " USE_SSH
    
    if [ "$USE_SSH" = "s" ] || [ "$USE_SSH" = "S" ]; then
        REMOTE_URL="git@github.com:${GH_USERNAME}/ifinanceone.git"
    else
        REMOTE_URL="https://github.com/${GH_USERNAME}/ifinanceone.git"
    fi
    
    echo "→ Configurando remote: $REMOTE_URL"
    git remote add origin "$REMOTE_URL"
    echo "✓ Remote configurado!"
fi

echo ""
echo "→ Renomeando branch para 'main'..."
git branch -M main

echo ""
echo "→ Fazendo push para o GitHub..."
git push -u origin main

echo ""
echo "============================================"
echo "   ✓ Sincronização concluída!              "
echo "============================================"
echo ""
echo "Acesse seu repositório em:"
echo "https://github.com/SEU_USERNAME/ifinanceone"
echo ""
