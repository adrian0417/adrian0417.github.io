document.addEventListener('DOMContentLoaded', () => {
  const postsListEl = document.getElementById('posts-list');
  const postTitleEl = document.getElementById('post-title');
  const postMetaEl = document.getElementById('post-meta');
  const postTagsEl = document.getElementById('post-tags');
  const postContentEl = document.getElementById('post-content');

  if (typeof postsData === 'undefined' || postsData.length === 0) return;

  // Catálogo de series (opcional). Si no existe, todo cae en "Otros".
  const seriesList = (typeof seriesData !== 'undefined') ? seriesData : [];
  const FALLBACK_SERIES = { id: 'otros', title: 'Otros' };

  // 1. LEER LA URL: Buscamos si hay un "?id=nombre-del-post"
  const urlParams = new URLSearchParams(window.location.search);
  const postIdFromUrl = urlParams.get('id');

  // Determinamos el post actual (el de la URL o el primero por defecto)
  let currentPost = postsData.find(p => p.id === postIdFromUrl) || postsData[0];

  // 2. AGRUPAR POSTS POR SERIE
  //    - El orden de las series lo marca seriesData.
  //    - Dentro de cada serie, los posts mantienen el orden de postsData.
  //    - Posts sin serie (o con un id de serie que no existe) van a "Otros", al final.
  function groupBySeries() {
    const knownIds = new Set(seriesList.map(s => s.id));
    const groups = seriesList
      .filter(s => s.id !== FALLBACK_SERIES.id)
      .map(s => ({ series: s, posts: postsData.filter(p => p.series === s.id) }));

    const orphans = postsData.filter(p =>
      !p.series || !knownIds.has(p.series) || p.series === FALLBACK_SERIES.id);

    if (orphans.length) {
      const fallback = seriesList.find(s => s.id === FALLBACK_SERIES.id) || FALLBACK_SERIES;
      groups.push({ series: fallback, posts: orphans });
    }

    if (seriesList.length) {
      postsData
        .filter(p => p.series && !knownIds.has(p.series))
        .forEach(p => console.warn(`[blog] El post "${p.id}" usa la serie "${p.series}", que no está en seriesData. Se muestra en "Otros".`));
    }

    return groups.filter(g => g.posts.length > 0);
  }

  // 3. RENDERIZAR LA BARRA LATERAL
  function renderSidebar() {
    postsListEl.innerHTML = '';

    groupBySeries().forEach(({ series, posts }) => {
      const groupLi = document.createElement('li');
      groupLi.className = 'series-group';

      const header = document.createElement('div');
      header.className = 'series-header';
      header.innerHTML = `<div class="series-title">${series.title}</div>`;
      if (series.description) {
        const desc = document.createElement('div');
        desc.className = 'series-desc';
        desc.textContent = series.description;
        header.appendChild(desc);
      }

      const ul = document.createElement('ul');
      ul.className = 'series-posts';

      posts.forEach(post => {
        const li = document.createElement('li');
        li.className = 'post-item';
        li.dataset.id = post.id;
        li.innerHTML = `
          <div class="post-item-title">${post.title}</div>
          <div class="post-item-date">${post.date}</div>
        `;

        li.addEventListener('click', () => {
          if (post.id === currentPost.id) return;
          loadPost(post);
          // Actualizar la URL del navegador sin recargar la página
          window.history.pushState({ id: post.id }, '', `${window.location.pathname}?id=${encodeURIComponent(post.id)}`);
        });

        ul.appendChild(li);
      });

      groupLi.append(header, ul);
      postsListEl.appendChild(groupLi);
    });
  }

  // Marca en la barra lateral el post activo
  function markActive() {
    postsListEl.querySelectorAll('.post-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === currentPost.id);
    });
  }

  // 4. CARGAR EL CONTENIDO DEL POST
  function loadPost(post) {
    currentPost = post;
    postTitleEl.textContent = post.title;
    postMetaEl.textContent = `${post.date} · Por Adrián Gómez-Lobo Núñez`;

    // Renderizar Tags
    postTagsEl.innerHTML = '';
    if (post.tags) {
      post.tags.forEach(t => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = t;
        postTagsEl.appendChild(tagSpan);
      });
    }

    // Inyectar HTML del contenido
    postContentEl.innerHTML = post.content;

    markActive();
    document.querySelector('main').scrollTo(0, 0);
  }

  // Inicializar la página por primera vez
  renderSidebar();
  loadPost(currentPost);

  // 5. SOPORTE DE NAVEGACIÓN: botones "Atrás/Adelante" del navegador
  window.addEventListener('popstate', () => {
    const id = new URLSearchParams(window.location.search).get('id');
    loadPost(postsData.find(p => p.id === id) || postsData[0]);
  });
});

// Función de copiar código
function copyCode(button) {
  const code = button.nextElementSibling.innerText;
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = 'Copied!';
    button.style.background = '#059669';
    button.style.color = '#fff';
    setTimeout(() => {
      button.textContent = 'Copy';
      button.style.background = '#1c202d';
      button.style.color = '#9ca3af';
    }, 2000);
  });
}