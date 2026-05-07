// ===================== ARTICLE-SCRIPT.JS =====================
const categories = [
    { key: 'quimica', name: 'Química', icon: '⚗️', color: '#FF6B6B' },
    { key: 'biologia', name: 'Biología', icon: '🧬', color: '#4ECDC4' },
    { key: 'geografia', name: 'Geografía', icon: '🌍', color: '#FFD93D' },
    { key: 'geologia', name: 'Geología', icon: '🪨', color: '#A0826D' },
    { key: 'paleontologia', name: 'Paleontología', icon: '🦕', color: '#C38D5D' },
    { key: 'astronomia', name: 'Astronomía', icon: '🔭', color: '#1E3A8A' },
    { key: 'tecnologia', name: 'Tecnología', icon: '💻', color: '#06B6D4' },
    { key: 'meteorologia', name: 'Meteorología', icon: '⛈️', color: '#9CA3AF' },
    { key: 'ingenieria', name: 'Ingeniería', icon: '⚙️', color: '#8B5CF6' },
    { key: 'historia', name: 'Historia', icon: '📚', color: '#DC2626' },
    { key: 'medicina', name: 'Medicina', icon: '💊', color: '#EC4899' },
    { key: 'experimentos', name: 'Experimentos', icon: '🔬', color: '#F59E0B' },
    { key: 'noticias', name: 'Noticias', icon: '📰', color: '#10B981' },
    { key: 'datos-curiosos', name: 'Datos Curiosos', icon: '💡', color: '#8B5CF6' }
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
        document.getElementById('articleContent').innerHTML = '<h1>Artículo no encontrado</h1><p><a href="index.html">Volver a inicio</a></p>';
        return;
    }
    
    renderArticle();
    setupEventListeners();
    updateFooterSocials();
    checkAdminStatus();
}

function renderArticle() {
    const container = document.getElementById('articleContent');
    const categoryObj = categories.find(c => currentArticle.categories && currentArticle.categories.includes(c.key));
    const categoryName = categoryObj ? categoryObj.name : 'Ciencia';
    const authorName = localStorage.getItem('author_name') || 'Administrador';
    
    let mediaHTML = '';
    if (currentArticle.images && currentArticle.images.length > 0) {
        currentArticle.images.forEach((img, index) => {
            const credit = currentArticle.imageCredits && currentArticle.imageCredits[index] ? `<p class="image-credit">Crédito: ${currentArticle.imageCredits[index]}</p>` : '';
            mediaHTML += `<figure class="article-figure"><img src="${img}" alt="Imagen" class="article-full-image"><figcaption>${credit}</figcaption></figure>`;
        });
    }
    
    if (currentArticle.videos && currentArticle.videos.length > 0) {
        currentArticle.videos.forEach(video => {
            if (video.type === 'url') {
                mediaHTML += `<div class="article-video-container"><iframe class="article-video" src="${video.url}" allowfullscreen></iframe></div>`;
            } else if (video.type === 'file') {
                mediaHTML += `<video class="article-video" controls><source src="${video.url}"></video>`;
            }
        });
    }
    
    let linksHTML = '';
    if (currentArticle.links && currentArticle.links.length > 0) {
        linksHTML = `<div class="article-links"><h4>Enlaces Relacionados:</h4><ul>`;
        currentArticle.links.forEach(link => {
            linksHTML += `<li><a href="${link.url}" target="_blank">${link.title}</a>${link.description ? `<p>${link.description}</p>` : ''}</li>`;
        });
        linksHTML += `</ul></div>`;
    }
    
    let sourcesHTML = '';
    if (currentArticle.sources) {
        sourcesHTML = `<div class="article-sources"><p><strong>Fuentes:</strong> ${currentArticle.sources}</p></div>`;
    }
    
    let tagsHTML = '';
    if (currentArticle.tags && currentArticle.tags.length > 0) {
        tagsHTML = `<div class="article-tags">${currentArticle.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`;
    }
    
    const editBtn = currentArticle.editedAt ? `<p class="edit-info"><small>Última modificación: ${new Date(currentArticle.editedAt).toLocaleString('es-ES')}</small></p>` : '';
    
    container.innerHTML = `
        <div class="article-header">
            <span class="article-category-badge">${categoryName}</span>
            <h1>${currentArticle.title}</h1>
            <div class="article-meta">
                <p>Por: <strong>${authorName}</strong></p>
                <p>Publicado: ${new Date(currentArticle.date).toLocaleDateString('es-ES')}</p>
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
        
        <div class="article-social">
            <button class="social-btn like-btn" id="likeBtn" onclick="toggleLike()">
                <i class="far fa-heart"></i> Me gusta
            </button>
            <button class="social-btn favorite-btn" id="favoriteBtn" onclick="toggleFavorite()">
                <i class="far fa-bookmark"></i> Guardar
            </button>
            <button class="social-btn share-btn" id="shareBtn" onclick="shareArticle()">
                <i class="fas fa-share-alt"></i> Compartir
            </button>
        </div>
        
        <div class="rating-section">
            <p>¿Qué te pareció este artículo?</p>
            <div class="stars" id="starsRating">
                <i class="far fa-star" data-rating="1" onclick="setRating(1)"></i>
                <i class="far fa-star" data-rating="2" onclick="setRating(2)"></i>
                <i class="far fa-star" data-rating="3" onclick="setRating(3)"></i>
                <i class="far fa-star" data-rating="4" onclick="setRating(4)"></i>
                <i class="far fa-star" data-rating="5" onclick="setRating(5)"></i>
            </div>
        </div>
        
        <div class="comments-section">
            <h3>Comentarios</h3>
            <div class="comment-form">
                <input type="text" id="commentName" placeholder="Tu nombre" maxlength="50">
                <textarea id="commentText" placeholder="Deja tu comentario..." rows="4" maxlength="500"></textarea>
                <button class="btn btn-primary" onclick="submitComment()">Comentar</button>
            </div>
            <div class="comments-list" id="commentsList">
                <!-- Se llena dinámicamente -->
            </div>
        </div>
        
        <div class="article-navigation">
            <a href="index.html#articulos" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Volver a Artículos</a>
            <a href="index.html" class="btn btn-secondary"><i class="fas fa-home"></i> Ir al Inicio</a>
        </div>
    `;
    
    loadRating();
    loadComments();
    updateSocialButtons();
}

// ===================== FUNCIONES SOCIALES =====================
function toggleLike() {
    const likes = parseInt(localStorage.getItem(`likes_${currentArticle.id}`) || '0');
    const newLikes = likes + 1;
    localStorage.setItem(`likes_${currentArticle.id}`, newLikes);
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
    const text = `Mira este artículo: ${currentArticle.title}`;
    
    if (navigator.share) {
        navigator.share({
            title: currentArticle.title,
            text: text,
            url: url
        });
    } else {
        alert(`Comparte este artículo:\n${url}`);
    }
}

function updateSocialButtons() {
    const likeBtn = document.getElementById('likeBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const likes = localStorage.getItem(`likes_${currentArticle.id}`) || '0';
    const isFavorite = localStorage.getItem(`favorite_${currentArticle.id}`);
    
    likeBtn.innerHTML = `<i class="fas fa-heart" style="color: #e74c3c;"></i> Me gusta (${likes})`;
    
    if (isFavorite) {
        favoriteBtn.classList.add('saved');
        favoriteBtn.innerHTML = `<i class="fas fa-bookmark"></i> Guardado`;
    } else {
        favoriteBtn.classList.remove('saved');
        favoriteBtn.innerHTML = `<i class="far fa-bookmark"></i> Guardar`;
    }
}

// ===================== RATING =====================
function loadRating() {
    const stars = document.querySelectorAll('.stars i');
    const savedRating = localStorage.getItem(`rating_${currentArticle.id}`) || '0';
    
    stars.forEach(star => {
        star.classList.remove('active');
        if (parseInt(star.dataset.rating) <= parseInt(savedRating)) {
            star.classList.add('active');
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
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-author">${comment.name}</div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-date">${new Date(comment.date).toLocaleDateString('es-ES')}</div>
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

        document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
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
        <a href="${social.url}" class="social-link" target="_blank">
            <i class="${icons[social.platform] || 'fas fa-link'}"></i>
        </a>
    `).join('');
}

function checkAdminStatus() {
    const adminBtn = document.getElementById('adminNavBtn');
    const ownerPassword = localStorage.getItem('owner_password');
    if (ownerPassword) {
        adminBtn.style.display = 'inline-block';
    }
}

// ===================== CARGAR =====================
loadArticle();