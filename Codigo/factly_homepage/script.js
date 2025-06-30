const ratings = {}; // Armazena avaliações por notícia

function renderStars(newsId) {
  // Retorna o HTML das estrelas de avaliação
  return `<div class="rating" data-id="${newsId}">
    <span class="star" data-value="1">☆</span>
    <span class="star" data-value="2">☆</span>
    <span class="star" data-value="3">☆</span>
    <span class="star" data-value="4">☆</span>
    <span class="star" data-value="5">☆</span>
  </div>`;
}

function attachRatingListeners() {
  document.querySelectorAll('.rating').forEach(rating => {
    const stars = rating.querySelectorAll('.star');
    const newsId = rating.getAttribute('data-id');

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        ratings[newsId] = ratings[newsId] || { total: 0, count: 0 };

        // Salva a avaliação
        ratings[newsId].total += value;
        ratings[newsId].count += 1;

        // Marca visualmente as estrelas
        stars.forEach(s => {
          s.classList.remove('selected');
          if (parseInt(s.getAttribute('data-value')) <= value) {
            s.classList.add('selected');
          }
        });

        // Exibe média de avaliação no console (pode ser usado para ranking)
        const avg = (ratings[newsId].total / ratings[newsId].count).toFixed(1);
        console.log(`Notícia ${newsId} - Média: ${avg} - Avaliações: ${ratings[newsId].count}`);

        // Envia para o backend em PHP
        fetch('avaliar.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsId, nota: value })
        })
        .then(response => response.json())
        .then(data => {
          console.log(`Média atualizada: ${data.media} (${data.count} avaliações)`);
        })
        .catch(err => {
          console.error('Erro ao enviar avaliação:', err);
        });
      });
    });
  });
}

let noticias = [];
let noticiasFiltradas = [];
let currentPage = 0;
const noticiasPorPagina = 4;

function renderNoticias() {
  const grid = document.querySelector('.news-grid');
  grid.innerHTML = '';
  const start = currentPage * noticiasPorPagina;
  const end = start + noticiasPorPagina;
  const noticiasParaExibir = noticiasFiltradas.slice(start, end);

  noticiasParaExibir.forEach(noticia => {
    const card = document.createElement('div');
    card.className = 'news-card';
<<<<<<< HEAD
=======
    
    // Determinar o tipo da notícia (usar 'tipo' se existir, senão tentar extrair do título)
    let tipoNoticia = noticia.tipo || 'FAKE'; // Padrão é FAKE se não especificado
    let labelClass = tipoNoticia === 'TRUE' ? 'true-label' : 'fake-label';
    let labelText = tipoNoticia === 'TRUE' ? 'É TRUE' : 'É FAKE';
    
    // Se não tem o campo tipo, tentar detectar pelo título
    if (!noticia.tipo) {
      if (noticia.titulo.toLowerCase().includes('é true')) {
        tipoNoticia = 'TRUE';
        labelClass = 'true-label';
        labelText = 'É TRUE';
      }
    }
    
>>>>>>> 9e933e47079d59cfe4cd44f5abefadf1102239fb
    card.innerHTML = `
      <div class="news-image-container">
        <img src="${noticia.imagem}" alt="${noticia.titulo}" class="news-image">
      </div>
      <div class="news-content">
<<<<<<< HEAD
        <h3 class="news-headline"><span class="fake-label">É FAKE</span> ${noticia.titulo}</h3>
=======
        <h3 class="news-headline"><span class="${labelClass}">${labelText}</span> ${noticia.titulo}</h3>
>>>>>>> 9e933e47079d59cfe4cd44f5abefadf1102239fb
        <p>${noticia.descricao}</p>
        <a href="${noticia.link}" class="read-more">Saiba mais...</a>
        <div class="news-footer">
          <div class="user-info">
            <span class="user-icon">👤</span>
            <span class="user-text">${noticia.autor}</span>
          </div>
          ${renderStars(noticia.id)}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  attachRatingListeners();
}

function pesquisarNoticias(termo) {
  const termoPesquisa = termo.toLowerCase().trim();
  
  if (termoPesquisa === '') {
    noticiasFiltradas = [...noticias];
  } else {
    noticiasFiltradas = noticias.filter(noticia => 
      noticia.titulo.toLowerCase().includes(termoPesquisa) ||
      noticia.descricao.toLowerCase().includes(termoPesquisa) ||
      noticia.autor.toLowerCase().includes(termoPesquisa)
    );
  }
  
  currentPage = 0; // Resetar para primeira página
  renderNoticias();
}

document.addEventListener("DOMContentLoaded", () => {
  fetch('noticias.json')
    .then(response => response.json())
    .then(data => {
      noticias = data;
      noticiasFiltradas = [...noticias]; // Inicializar com todas as notícias
      renderNoticias();
    });

  // Event listener para a barra de pesquisa
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', (e) => {
    pesquisarNoticias(e.target.value);
  });

  document.getElementById('prev-news').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderNoticias();
    }
  });
  document.getElementById('next-news').addEventListener('click', () => {
    if ((currentPage + 1) * noticiasPorPagina < noticiasFiltradas.length) {
      currentPage++;
      renderNoticias();
    }
  });
});
