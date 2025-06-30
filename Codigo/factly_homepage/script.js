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
let avaliacoes = {};
let currentPage = 0;
const noticiasPorPagina = 4;

function renderNoticias() {
  const grid = document.querySelector('.news-grid');
  grid.innerHTML = '';
  const start = currentPage * noticiasPorPagina;
  const end = start + noticiasPorPagina;
  const noticiasParaExibir = noticiasFiltradas.slice(start, end);

  console.log(`🔄 Renderizando página ${currentPage + 1}`);
  console.log(`📊 Total de notícias filtradas: ${noticiasFiltradas.length}`);
  console.log(`📄 Notícias para exibir (${start}-${end}):`, noticiasParaExibir.map(n => `ID ${n.id}: ${n.titulo.substring(0, 30)}...`));

  noticiasParaExibir.forEach(noticia => {
    const card = document.createElement('div');
    card.className = 'news-card';
    
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
    
    card.innerHTML = `
      <div class="news-image-container">
        <img src="${noticia.imagem}" alt="${noticia.titulo}" class="news-image">
      </div>
      <div class="news-content">
        <h3 class="news-headline"><span class="${labelClass}">${labelText}</span> ${noticia.titulo}</h3>
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

// Função para calcular a média de avaliação de uma notícia
function calcularMediaAvaliacao(noticiaId) {
  const avaliacao = avaliacoes[noticiaId];
  if (!avaliacao || avaliacao.count === 0) {
    return 0;
  }
  return avaliacao.total / avaliacao.count;
}

// Função para selecionar os melhores destaques
function selecionarDestaques(noticias) {
  // Cria uma cópia das notícias com pontuação
  const noticiasComPontuacao = noticias.map(noticia => {
    let pontuacao = 0;
    const mediaAvaliacao = calcularMediaAvaliacao(noticia.id);
    
    // Prioriza notícias com avaliações altas (peso maior)
    if (mediaAvaliacao > 0) {
      pontuacao += mediaAvaliacao * 30; // Peso maior para avaliações
    }
    
    // Prioriza notícias TRUE (verificadas como verdadeiras)
    if (noticia.tipo && noticia.tipo.toLowerCase() === 'true') {
      pontuacao += 25;
    }
    
    // Considera o número de avaliações (mais avaliações = mais confiável)
    const avaliacaoData = avaliacoes[noticia.id];
    if (avaliacaoData && avaliacaoData.count > 0) {
      pontuacao += Math.min(avaliacaoData.count * 5, 20);
    }
    
    // Considera o tamanho da descrição (mais informativo)
    if (noticia.descricao) {
      pontuacao += Math.min(noticia.descricao.length / 30, 15);
    }
    
    // Prioriza notícias mais recentes (se tiver ID maior)
    pontuacao += noticia.id * 1;
    
    return { 
      ...noticia, 
      pontuacao,
      mediaAvaliacao: mediaAvaliacao,
      numeroAvaliacoes: avaliacaoData ? avaliacaoData.count : 0
    };
  });
  
  // Ordena por pontuação e retorna os 3 melhores
  return noticiasComPontuacao
    .sort((a, b) => b.pontuacao - a.pontuacao)
    .slice(0, 3);
}

// Função para renderizar os destaques
function renderDestaques() {
  const destaquesContainer = document.querySelector('.destaques');
  
  if (!destaquesContainer) return;
  
  const destaques = selecionarDestaques(noticias);
  
  destaquesContainer.innerHTML = destaques.map((noticia, index) => `
    <div class="destaque-card">
      <div class="news-image-container">
        <img src="${noticia.imagem}" alt="${noticia.titulo}" class="news-image">
      </div>
      <div class="news-content">
        <h3 class="news-headline">${noticia.titulo}</h3>
        <p class="news-description">${noticia.descricao}</p>
        
        <div class="destaque-info-section">
          <div class="destaque-status-rating">
            <span class="${noticia.tipo && noticia.tipo.toLowerCase() === 'true' ? 'true-label' : 'fake-label'}">
              ${noticia.tipo && noticia.tipo.toLowerCase() === 'true' ? 'É TRUE ✓' : 'É FAKE ✗'}
            </span>
            <div class="rating">
              ${'★'.repeat(Math.floor(noticia.mediaAvaliacao))}${'☆'.repeat(5 - Math.floor(noticia.mediaAvaliacao))}
              <span style="color: #ffd700; font-size: 14px;">
                ${noticia.mediaAvaliacao.toFixed(1)} 
                ${noticia.numeroAvaliacoes > 0 ? `(${noticia.numeroAvaliacoes})` : '(0)'}
              </span>
            </div>
          </div>
          
          <div class="destaque-author-badge">
            <div class="user-info">
              <span class="user-icon">👤</span>
              <span class="user-text">Por: ${noticia.autor}</span>
            </div>
            <div class="top-badge">
              #${index + 1} Top Destaque
            </div>
          </div>
        </div>
        
        ${noticia.link ? `
        <div class="destaque-read-more">
          <a href="${noticia.link}" target="_blank" class="read-more-destaque">Leia mais</a>
        </div>` : ''}
      </div>
    </div>
  `).join('');
}

// Função para verificar status de login e atualizar navbar
function verificarStatusLogin() {
  try {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    const cadastroLink = document.getElementById('cadastro-link');
    const loginLink = document.getElementById('login-link');
    const userInfo = document.getElementById('user-info');
    const logoutLink = document.getElementById('logout-link');
    
    if (usuarioLogado) {
      const userData = JSON.parse(usuarioLogado);
      const email = userData.email;
      const nome = email.split('@')[0]; // Usar primeira parte do email como nome de exibição
      
      // Esconder links de cadastro e login
      cadastroLink.style.display = 'none';
      loginLink.style.display = 'none';
      
      // Mostrar informações do usuário e botão de logout
      userInfo.textContent = `👤 Olá, ${nome}`;
      userInfo.style.display = 'inline';
      logoutLink.style.display = 'inline';
      
      console.log('✅ Usuário logado:', email);
    } else {
      // Mostrar links de cadastro e login
      cadastroLink.style.display = 'inline';
      loginLink.style.display = 'inline';
      
      // Esconder informações do usuário
      userInfo.style.display = 'none';
      logoutLink.style.display = 'none';
      
      console.log('👤 Usuário não logado');
    }
  } catch (error) {
    console.error('Erro ao verificar status de login:', error);
  }
}

// Função para fazer logout
function realizarLogout() {
  sessionStorage.removeItem('usuarioLogado');
  console.log('👋 Logout realizado');
  verificarStatusLogin(); // Atualizar a navbar
  alert('👋 Logout realizado com sucesso!');
}

document.addEventListener("DOMContentLoaded", () => {
  // Verificar status de login na inicialização
  verificarStatusLogin();
  
  // Adicionar event listener para o botão de logout
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      realizarLogout();
    });
  }
  
  // Carregar notícias e avaliações simultaneamente com timestamp para evitar cache
  const timestamp = new Date().getTime();
  Promise.all([
    fetch(`noticias.json?t=${timestamp}`).then(response => response.json()),
    fetch(`avaliacoes.json?t=${timestamp}`).then(response => response.json())
  ])
  .then(([noticiasData, avaliacoesData]) => {
    noticias = noticiasData;
    avaliacoes = avaliacoesData;
    noticiasFiltradas = [...noticias]; // Inicializar com todas as notícias
    
    console.log('📊 Avaliações carregadas:', avaliacoes);
    console.log('📰 Notícias carregadas:', noticias.length);
    console.log('📋 Lista de IDs das notícias:', noticias.map(n => n.id));
    console.log('🆕 Notícia mais recente:', noticias[0]);
    
    // Debug: mostrar ranking de destaques
    const debugDestaques = selecionarDestaques(noticias);
    console.log('🏆 Top 3 Destaques (ordenados por nota):');
    debugDestaques.forEach((noticia, index) => {
      console.log(`${index + 1}. ID: ${noticia.id} | Título: "${noticia.titulo}" | Nota: ${noticia.mediaAvaliacao.toFixed(1)} (${noticia.numeroAvaliacoes} avaliações) | Pontuação: ${noticia.pontuacao.toFixed(1)}`);
    });
    
    renderNoticias();
    renderDestaques(); // Renderizar os destaques também
  })
  .catch(error => {
    console.error('❌ Erro ao carregar dados:', error);
    // Se houver erro, carregar só as notícias sem cache
    const timestamp = new Date().getTime();
    fetch(`noticias.json?t=${timestamp}`)
      .then(response => response.json())
      .then(data => {
        console.log('⚠️ Carregado apenas notícias (sem avaliações)');
        console.log('📰 Notícias carregadas:', data.length);
        console.log('📋 IDs das notícias:', data.map(n => n.id));
        noticias = data;
        noticiasFiltradas = [...noticias];
        renderNoticias();
        renderDestaques();
      })
      .catch(err => {
        console.error('❌ Erro crítico ao carregar notícias:', err);
      });
  });

  // Event listener para a barra de pesquisa
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', (e) => {
    pesquisarNoticias(e.target.value);
  });

  document.getElementById('prev-news').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      console.log(`⬅️ Página anterior: ${currentPage + 1}`);
      renderNoticias();
    }
  });
  
  document.getElementById('next-news').addEventListener('click', () => {
    if ((currentPage + 1) * noticiasPorPagina < noticiasFiltradas.length) {
      currentPage++;
      console.log(`➡️ Próxima página: ${currentPage + 1}`);
      renderNoticias();
    } else {
      console.log('⚠️ Já está na última página');
    }
  });
});
