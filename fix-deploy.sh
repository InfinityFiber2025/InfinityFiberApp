#!/bin/bash
echo "🔧 Corrigindo InfinityFiberApp e forçando deploy no GitHub Pages..."

# Garantir que está no diretório do projeto
cd "$(dirname "$0")"

# Verifica se App.jsx existe
if [ ! -f src/App.jsx ]; then
  echo "❌ ERRO: src/App.jsx não encontrado!"
  exit 1
fi

# Adiciona no git
git add src/App.jsx

# Faz o commit
git commit -m "Corrige App.jsx com export default (forçar deploy)"

# Envia para o GitHub
git push origin main

echo "✅ Correção enviada! Agora acompanhe o workflow em: https://github.com/InfinityFiber2025/InfinityFiberApp/actions"
