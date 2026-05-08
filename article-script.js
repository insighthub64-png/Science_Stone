// ===================== ARTICLE-SCRIPT.JS MEJORADO =====================
const categories = [
    { key: 'quimica', name: 'Química', icon: '⚗️', color: '#1E90FF' },
    { key: 'biologia', name: 'Biología', icon: '🧬', color: '#2E8B57' },
    { key: 'geografia', name: 'Geografía', icon: '🌍', color: '#A0522D' },
    { key: 'geologia', name: 'Geología', icon: '🪨', color: '#696969' },
    { key: 'paleontologia', name: 'Paleontología', icon: '🦕', color: '#C68642' },
    { key: 'astronomia', name: 'Astronomía', icon: '🔭', color: '#191970' },
    { key: 'tecnologia', name: 'Tecnología', icon: '💻', color: '#00BFFF' },
    { key: 'meteorologia', name: 'Meteorología', icon: '⛈️', color: '#87CEEB' },
    { key: 'ingenieria', name: 'Ingeniería', icon: '⚙️', color: '#FF8C00' },
    { key: 'historia', name: 'Historia', icon: '📚', color: '#8B6F47' },
    { key: 'medicina', name: 'Medicina', icon: '💊', color: '#DC143C' },
    { key: 'experimentos', name: 'Experimentos', icon: '🔬', color: '#32CD32' },
    { key: 'noticias', name: 'Noticias', icon: '📰', color: '#E53935' },
    { key: 'datos-curiosos', name: 'Datos Curiosos', icon: '💡', color: '#FF6F61' }
];

let articles = [];
let currentArticle = null;

// ===================== CARGAR ARTÍCULO =====================
async function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    const articleId = parseInt(params.get('id'));

    try {
        const response = await fetch('data.json');
        articles = await response.json();
        const savedArticles = localStorage.getItem('science_stone_articles');
        if (savedArticles) {
            articles = [...articles, ...JSON.parse(savedArticles)];
        }
    } catch (error) {
        const savedArticles = localStorage.getItem('science_stone_articles');
        if (savedArticles) {
            articles = JSON.parse(savedArticles);
        }
    }
    
    currentArticle = articles.find(a => a.id === articleId);
    
    if (!currentArticle) {
        document.getElementById('articleContent').innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h1 style="font-family: var(--font-serif); font-size: 32px; margin-bottom: 20px;">Artículo no encontrado</h1>
                <p style="color: var(--text-light); margin-bottom: 30px;">Lo sentimos, el artículo que buscas no existe.</p>
                <a href="index.html" class="btn btn-primary">Volver al Inicio</a>
            </div>
        `;
        return;
    }
    
    renderArticle();
    renderRelatedArticles();
    setupEventListeners();
    updateFooterSocials();
    checkAdminStatus();
}

function renderArticle() {
    const container = document.getElementById('articleContent');
    const categoryObj = categories.find(c => currentArticle.categories && currentArticle.categories.includes(c.key));
    const categoryName = categoryObj ? categoryObj.name : 'Ciencia';
    const categoryColor = categoryObj ? categoryObj.color : '#666666';
    const authorName = localStorage.getItem('author_name') || 'Administrador';
    
    let mediaHTML = '';
    if (currentArticle.images && currentArticle.images.length > 0) {
        currentArticle.images.forEach((img, index) => {
            const credit = currentArticle.imageCredits && currentArticle.imageCredits[index] 
                ? `<p style="font-size: 12px; color: var(--text-light); margin-top: 10px;">Crédito: ${currentArticle.imageCredits[index]}</p>` 
                : '';
            mediaHTML += `
                <figure class="article-figure">
                    <img src="${img}" alt="Imagen del artículo" class="article-full-image" onerror="this.src='https://via.placeholder.com/800x500'">
                    ${credit}
                </figure>
            `;
        });
    }
    
    if (currentArticle.videos && currentArticle.videos.length > 0) {
        currentArticle.videos.forEach(video => {
            if (video.type === 'url') {
                mediaHTML += `<div style="margin: 40px 0; text-align: center;">
                    <iframe style="width: 100%; max-width: 600px; height: 400px; border-radius: 4px;" 
                            src="${video.url}" allowfullscreen></iframe>
                </div>`;
            }
        });
    }
    
    let linksHTML = '';
    if (currentArticle.links && currentArticle.links.length > 0) {
        linksHTML = `<div style="background: var(--bg-light); padding: 30px; border-radius: 4px; margin: 40px 0;">
            <h4 style="font-family: var(--font-serif); margin-bottom: 15px;">Enlaces Relacionados</h4>
            <ul style="list-style: none;">`;
        currentArticle.links.forEach(link => {
            linksHTML += `<li style="margin-bottom: 12px;">
                <a href="${link.url}" target="_blank" style="color: var(--primary-yellow); text-decoration: none; font-weight: 600;">
                    ${link.title} <i class="fas fa-external-link-alt"></i>
                </a>
                ${link.description ? `<p style="font-size: 13px; color: var(--text-light); margin-top: 5px;">${link.description}</p>` : ''}
            </li>`;
        });
        linksHTML += `</ul></div>`;
    }
    
    let sourcesHTML = '';
    if (currentArticle.sources) {
        sourcesHTML = `<div style="background: var(--bg-light); padding: 30px; border-radius: 4px; margin: 40px 0;">
            <p style="margin: 0;"><strong>Fuentes:</strong> ${currentArticle.sources}</p>
        </div>`;
    }
    
    let tagsHTML = '';
    if (currentArticle.tags && currentArticle.tags.length > 0) {
        tagsHTML = `<div style="margin: 40px 0; display: flex; flex-wrap: wrap; gap: 10px;">`;
        currentArticle.tags.forEach(tag => {
            tagsHTML += `<span style="background: var(--bg-light); padding: 8px 16px; border-radius: 20px; font-size: 12px; color: var(--text-light);">#${tag}</span>`;
        });
        tagsHTML += `</div>`;
    }
    
    const editBtn = currentArticle.editedAt 
        ? `<p style="color: var(--text-light); font-size: 12px; margin-top: 15px;">Última modificación: ${new Date(currentArticle.editedAt).toLocaleString('es-ES')}</p>` 
        : '';
    
    container.innerHTML = `
        <div class="article-header">
            <span class="article-category" style="color: ${categoryColor}; font-size: 13px;">
                ${categoryObj ? categoryObj.icon : '📄'} ${categoryName}
            </span>
            <h1 style="font-family: var(--font-serif); font-size: 48px; margin: 20px 0; font-weight: 400; line-height: 1.3;">
                ${currentArticle.title}
            </h1>
            <div style="color: var(--text-light); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px;">
                <p style="margin: 5px 0;"><strong>Por:</strong> ${authorName}</p>
                <p style="margin: 5px 0;"><strong>Publicado:</strong> ${new Date(currentArticle.date).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                ${editBtn}
            </div>
        </div>
        
        ${mediaHTML}
        
        <div class="article-body">
            ${currentArticle.content}
        </div>
        
        ${linksHTML}
        ${sourcesHTML}
        ${tagsHTML}
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 40px 0; padding: 30px 0; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
            <button class="btn btn-primary" id="likeBtn" onclick="toggleLike()" style="width: 100%; padding: 12px;">
                <i class="far fa-heart"></i> Me gusta
            </button>
            <button class="btn btn-primary" id="favoriteBtn" onclick="toggleFavorite()" style="width: 100%; padding: 12px;">
                <i class="far fa-bookmark"></i> Guardar
            </button>
            <button class="btn btn-primary" id="shareBtn" onclick="shareArticle()" style="width: 100%; padding: 12px;">
                <i class="fas fa-share-alt"></i> Compartir
            </button>
        </div>
        
        <div style="background: var(--bg-light); padding: 30px; border-radius: 4px; margin: 40px 0;">
            <p style="margin-bottom: 20px; font-size: 16px;">¿Qué te pareció este artículo?</p>
            <div class="stars" id="starsRating" style="display: flex; gap: 10px; font-size: 28px;">
                <i class="far fa-star" data-rating="1" onclick="setRating(1)" style="cursor: pointer; transition: all 0.2s;"></i>
                <i class="far fa-star" data-rating="2" onclick="setRating(2)" style="cursor: pointer; transition: all 0.2s;"></i>
                <i class="far fa-star" data-rating="3" onclick="setRating(3)" style="cursor: pointer; transition: all 0.2s;"></i>
                <i class="far fa-star" data-rating="4" onclick="setRating(4)" style="cursor: pointer; transition: all 0.2s;"></i>
                <i class="far fa-star" data-rating="5" onclick="setRating(5)" style="cursor: pointer; transition: all 0.2s;"></i>
            </div>
        </div>
        
        <div style="margin: 40px 0;">
            <h3 style="font-family: var(--font-serif); font-size: 24px; margin-bottom: 25px; font-weight: 400;">Comentarios</h3>
            <div style="background: var(--bg-light); padding: 25px; border-radius: 4px; margin-bottom: 25px;">
                <input type="text" id="commentName" placeholder="Tu nombre" maxlength="50" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid var(--border-light); border-radius: 4px;">
                <textarea id="commentText" placeholder="Comparte tu opinión sobre este artículo..." rows="4" maxlength="500" style="width: 100%; padding: 12px; border: 1px solid var(--border-light); border-radius: 4px; font-family: var(--font-sans);"></textarea>
                <button class="btn btn-primary" onclick="submitComment()" style="margin-top: 15px; width: 100%; padding: 12px;">Publicar Comentario</button>
            </div>
            <div id="commentsList">
                <!-- Se llena dinámicamente -->
            </div>
        </div>
    `;
    
    loadRating();
    loadComments();
    updateSocialButtons();
}

function renderRelatedArticles() {
    const container = document.getElementById('relatedArticles');
    
    const related = articles.filter(a => 
        a.id !== currentArticle.id &&
        a.categories && currentArticle.categories &&
        a.categories.some(cat => currentArticle.categories.includes(cat))
    ).slice(0, 3);

    if (related.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">No hay artículos relacionados.</p>';
        return;
    }

    container.innerHTML = related.map(article => {
        const categoryObj = categories.find(c => article.categories && article.categories.includes(c.key));
        const categoryName = categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : '📄 Ciencia';
        const categoryColor = categoryObj ? categoryObj.color : '#666666';
        
        return `
            <div class="article-card" onclick="window.location.href='article.html?id=${article.id}'" style="cursor: pointer;">
                <img src="${article.image || 'https://via.placeholder.com/600x400'}" alt="${article.title}" class="article-image" onerror="this.src='https://via.placeholder.com/600x400'">
                <div class="article-content">
                    <span class="article-category" style="color: ${categoryColor};">${categoryName}</span>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                </div>
            </div>
        `;
    }).join('');
}

// ===================== FUNCIONES SOCIALES =====================
function toggleLike() {
    const likes = parseInt(localStorage.getItem(`likes_${currentArticle.id}`) || '0');
    localStorage.setItem(`likes_${currentArticle.id}`, likes + 1);
    updateSocialButtons();
}

function toggleFavorite() {
    const isFavorite = localStorage.getItem(`favorite_${currentArticle.id}`);
    if (isFavorite) {
        localStorage.removeItem(`favorite_${currentArticle.id}`);
    } else {
        localStorage.setItem(`favorite_${currentArticle.id}`, 'true');
    }
    updateSocialButtons();
}

function shareArticle() {
    const url = window.location.href;
    const text = `Mira este artículo en Science Stone: ${currentArticle.title}`;
    
    if (navigator.share) {
        navigator.share({
            title: currentArticle.title,
            text: text,
            url: url
        });
    } else {
        alert(`Comparte este enlace:\n${url}`);
    }
}

function updateSocialButtons() {
    const likeBtn = document.getElementById('likeBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const likes = localStorage.getItem(`likes_${currentArticle.id}`) || '0';
    const isFavorite = localStorage.getItem(`favorite_${currentArticle.id}`);
    
    if (likeBtn) {
        likeBtn.innerHTML = `<i class="fas fa-heart" style="color: #DC143C;"></i> Me gusta (${likes})`;
    }
    
    if (favoriteBtn) {
        if (isFavorite) {
            favoriteBtn.innerHTML = `<i class="fas fa-bookmark"></i> Guardado`;
            favoriteBtn.style.background = 'var(--primary-yellow)';
        } else {
            favoriteBtn.innerHTML = `<i class="far fa-bookmark"></i> Guardar`;
        }
    }
}

// ===================== RATING =====================
function loadRating() {
    const stars = document.querySelectorAll('.stars i');
    const savedRating = localStorage.getItem(`rating_${currentArticle.id}`) || '0';
    
    stars.forEach(star => {
        star.classList.remove('fas');
        star.classList.add('far');
        if (parseInt(star.dataset.rating) <= parseInt(savedRating)) {
            star.classList.remove('far');
            star.classList.add('fas');
            star.style.color = '#FFCC00';
        }
    });
}

function setRating(rating) {
    localStorage.setItem(`rating_${currentArticle.id}`, rating);
    loadRating();
}

// ===================== COMENTARIOS =====================
function loadComments() {
    const commentsList = document.getElementById('commentsList');
    const comments = JSON.parse(localStorage.getItem(`comments_${currentArticle.id}`) || '[]');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px 0;">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => `
        <div style="padding: 20px; border: 1px solid var(--border-light); border-radius: 4px; margin-bottom: 15px;">
            <p style="font-weight: 600; margin: 0 0 8px 0;">${comment.name}</p>
            <p style="margin: 0 0 10px 0; color: var(--text-dark);">${comment.text}</p>
            <p style="font-size: 12px; color: var(--text-light); margin: 0;">${new Date(comment.date).toLocaleDateString('es-ES')}</p>
        </div>
    `).join('');
}

function submitComment() {
    const name = document.getElementById('commentName').value.trim();
    const text = document.getElementById('commentText').value.trim();
    
    if (!name || !text) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const comments = JSON.parse(localStorage.getItem(`comments_${currentArticle.id}`) || '[]');
    comments.push({
        name,
        text,
        date: new Date().toISOString()
    });
    
    localStorage.setItem(`comments_${currentArticle.id}`, JSON.stringify(comments));
    document.getElementById('commentName').value = '';
    document.getElementById('commentText').value = '';
    loadComments();
    alert('✅ Comentario publicado');
}

// ===================== EVENT LISTENERS =====================
function setupEventListeners() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    const searchBtn = document.getElementById('searchBtn');
    const searchBar = document.getElementById('searchBar');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            searchBar.classList.remove('active');
            searchInput.value = '';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length === 0) return;
            
            const filtered = articles.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.excerpt.toLowerCase().includes(query)
            );
            
            if (filtered.length > 0) {
                window.location.href = `article.html?id=${filtered[0].id}`;
            }
        });
    }
}

function updateFooterSocials() {
    const footerSocial = document.getElementById('footerSocial');
    if (!footerSocial) return;
    
    const socials = JSON.parse(localStorage.getItem('author_socials') || '[]');
    const icons = {
        facebook: 'fab fa-facebook',
        twitter: 'fab fa-twitter',
        instagram: 'fab fa-instagram',
        linkedin: 'fab fa-linkedin',
        youtube: 'fab fa-youtube',
        whatsapp: 'fab fa-whatsapp',
        telegram: 'fab fa-telegram'
    };
    
    footerSocial.innerHTML = socials.map(social => `
        <a href="${social.url}" class="social-link" target="_blank" title="${social.platform}">
            <i class="${icons[social.platform] || 'fas fa-link'}"></i>
        </a>
    `).join('');
}

function checkAdminStatus() {
    const adminBtn = document.getElementById('adminNavBtn');
    if (localStorage.getItem('owner_password')) {
        adminBtn.style.display = 'inline-block';
    }
}

// ===================== CARGAR =====================
loadArticle();