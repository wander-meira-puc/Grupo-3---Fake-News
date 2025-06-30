# Grupo-3 Fake-News
Trabalho interdisciplinar de aplicaçoes web - Grupo Fake news
grupo composto por: Wander Meira, Bernardo Vinhal, Luan Assis, Gabriel Henrique fernandes, João Paulo.


# Factly Homepage

Este projeto exibe notícias dinâmicas a partir de um arquivo JSON, simulando a integração com o back-end. As notícias são exibidas em formato de carrossel, mostrando 4 por vez, com botões para navegar entre elas.

## Como testar o projeto

1. **Pré-requisitos:**
   - Tenha o projeto extraído na pasta `factly_homepage`.
   - Certifique-se de que o arquivo `noticias.json` está dentro da pasta `factly_homepage`.
   - Para o carregamento dinâmico funcionar, é necessário rodar o projeto em um servidor local (por exemplo, Live Server do VSCode, XAMPP, WAMP, ou Python SimpleHTTPServer).

2. **Rodando com Live Server (VSCode):**
   - Clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".
   - O navegador abrirá o site e as notícias serão carregadas automaticamente.

3. **Rodando com Python (caso não use VSCode):**
   - Abra o terminal na pasta `factly_homepage`.
   - Execute:
     - Python 3: `python -m http.server 8000`
     - Python 2: `python -m SimpleHTTPServer 8000`
   - Acesse `http://localhost:8000` no navegador.

4. **Funcionalidades:**
   - O site busca as notícias do arquivo `noticias.json`.
   - Exibe 4 notícias por vez, no formato de cards estilizados.
   - Use os botões "Anterior" e "Próxima" para navegar entre as notícias.
   - O sistema de avaliação (estrelas) funciona normalmente para cada notícia.

5. **Integração com back-end real:**
   - Para integrar com o back-end, basta alterar o caminho do `fetch` no arquivo `script.js` para a rota da sua API que retorna as notícias em JSON.

## Estrutura dos arquivos principais
- `index.html`: Página principal do site.
- `script.js`: Lógica de carregamento e exibição das notícias.
- `noticias.json`: Arquivo de exemplo com 10 notícias.
- `styles.css`: Estilos do site.
