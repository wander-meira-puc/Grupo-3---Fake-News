@echo off
echo ========================================
echo        FACTLY - Servidor Local
echo ========================================
echo.

REM Verificar se PHP está instalado
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: PHP não está instalado ou não está no PATH
    echo.
    echo 💡 Instale PHP ou use uma dessas opções:
    echo    - Laragon: https://laragon.org/download/
    echo    - XAMPP: https://www.apachefriends.org/
    echo.
    pause
    exit /b 1
)

echo ✅ PHP encontrado!
echo 🚀 Iniciando servidor local...
echo.
echo 📍 Acesse no navegador: http://localhost:8000/index.html
echo.
echo ⚠️  Para parar o servidor, pressione Ctrl+C
echo ========================================
echo.

REM Iniciar servidor PHP na porta 8000
php -S localhost:8000 