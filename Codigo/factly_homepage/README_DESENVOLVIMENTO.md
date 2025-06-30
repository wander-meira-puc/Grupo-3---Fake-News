# 🚀 Guia de Desenvolvimento - Factly

## 📋 Requisitos
- PHP 7.4+ 
- Servidor web local (Apache/Nginx) ou PHP built-in server

## ⚡ Opções de Configuração

### **Opção 1: Laragon (Recomendado)**
1. Baixe o Laragon: https://laragon.org/download/
2. Instale e inicie os serviços
3. Clone/copie o projeto para: `C:\laragon\www\Factly`
4. Acesse: `http://localhost/Factly/Codigo/factly_homepage/index.html`

### **Opção 2: XAMPP**
1. Baixe o XAMPP: https://www.apachefriends.org/
2. Instale e inicie Apache
3. Copie o projeto para: `C:\xampp\htdocs\Factly`
4. Acesse: `http://localhost/Factly/Codigo/factly_homepage/index.html`

### **Opção 3: PHP Built-in Server**
Se você já tem PHP instalado:

```bash
# Navegue até a pasta do projeto
cd Codigo/factly_homepage

# Inicie o servidor PHP
php -S localhost:8000

# Acesse no navegador
http://localhost:8000/index.html
```

### **Opção 4: VS Code Live Server (Limitado)**
⚠️ **Funciona apenas para visualização sem funcionalidades PHP**

Se usar Live Server:
- Funcionará: navegação, CSS, pesquisa
- **NÃO funcionará**: cadastro de notícias, sistema de avaliação

## 🔧 Comandos Úteis

```bash
# Verificar se PHP está instalado
php --version

# Instalar PHP (Windows - Chocolatey)
choco install php

# Instalar PHP (macOS - Homebrew)  
brew install php

# Instalar PHP (Ubuntu/Debian)
sudo apt install php php-cli
```

## 📁 Estrutura do Projeto

```
Factly/
├── Codigo/
│   ├── factly_homepage/
│   │   ├── index.html          # Página principal
│   │   ├── cadastro-noticia.html # Formulário de cadastro
│   │   ├── cadastrar-noticia.php # Processamento do cadastro
│   │   ├── avaliar.php         # Sistema de avaliação
│   │   ├── noticias.json       # Base de dados das notícias
│   │   ├── script.js           # JavaScript principal
│   │   └── styles.css          # Estilos CSS
│   └── imgs/                   # Imagens do projeto
└── README_DESENVOLVIMENTO.md
```

## 🚨 Problemas Comuns

### **Erro: "fetch failed" ou "CORS error"**
- **Causa**: VS Code Live Server não executa PHP
- **Solução**: Use uma das opções com PHP acima

### **Erro: "File not found" para imagens**
- **Causa**: Caminhos relativos incorretos
- **Solução**: Verifique se está acessando via servidor (http://) e não file://

### **Erro: "Permission denied" ao fazer upload**
- **Causa**: Pasta `imgs` sem permissão de escrita
- **Solução**: 
  ```bash
  chmod 755 imgs/  # Linux/macOS
  # Windows: Propriedades > Segurança > Permitir escrita
  ```

## ✅ Testando se está funcionando

1. **Acesse**: `http://localhost/caminho-do-projeto/index.html`
2. **Teste a pesquisa**: Digite "vacina" na barra de pesquisa
3. **Teste o cadastro**: Clique em "Faça um Post" e tente cadastrar uma notícia
4. **Teste as avaliações**: Clique nas estrelas dos cards

Se tudo funcionar, o ambiente está configurado corretamente! 🎉

## 🤝 Contribuindo

1. Faça suas alterações
2. Teste localmente usando uma das opções acima
3. Commit suas mudanças
4. Envie pull request

---
**💡 Dica**: Para desenvolvimento, recomendamos usar Laragon no Windows ou MAMP no macOS para uma experiência mais fluida! 