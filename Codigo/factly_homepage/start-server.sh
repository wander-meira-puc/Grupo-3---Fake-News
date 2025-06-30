#!/bin/bash

echo "========================================"
echo "       FACTLY - Servidor Local"
echo "========================================"
echo

# Verificar se PHP está instalado
if ! command -v php &> /dev/null; then
    echo "❌ ERRO: PHP não está instalado"
    echo
    echo "💡 Instale PHP:"
    echo "   macOS: brew install php"
    echo "   Ubuntu: sudo apt install php php-cli"
    echo "   CentOS: sudo yum install php php-cli"
    echo
    exit 1
fi

echo "✅ PHP encontrado!"
echo "🚀 Iniciando servidor local..."
echo
echo "📍 Acesse no navegador: http://localhost:8000/index.html"
echo
echo "⚠️  Para parar o servidor, pressione Ctrl+C"
echo "========================================"
echo

# Iniciar servidor PHP na porta 8000
php -S localhost:8000 