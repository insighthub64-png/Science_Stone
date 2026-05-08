// ===================== SCRIPT.JS PREMIUM EDITORIAL =====================
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
let currentFilter = 'todos';

// ===================== SPLASH SCREEN =====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('hidden');
        }
    }, 2000);
});

// ===================== CARGAR DATOS =====================
async function loadAllData() {
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
    
    initializeWebsite();
}

function initializeWebsite() {
    renderCategoryCards();
    renderFeaturedArticles();
    renderArticles();
    setupEventListeners();
    loadAuthorInfo();
    updateFooterSocials();
    checkAdminStatus();
    loadIntroduction();
}

// ===================== INTRODUCCIÓN EDITABLE =====================
function loadIntroduction() {
    const saved = localStorage.getItem('blog_introduction');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('introductionText').textContent = data.content;
    }
    
    const editBtn = document.getElementById('editIntroBtn');
    if (localStorage.getItem('owner_password')) {
        editBtn.style.display = 'inline-block';
        editBtn.addEventListener('click', editIntroduction);
    }
}

function editIntroduction() {
    const saved = localStorage.getItem('blog_introduction');
    let content = 'Science Stone es tu fuente editorial de ciencia...';
    
    if (saved) {
        content = JSON.parse(saved).content;
    }
    
    const newContent = prompt('Edita la introducción del blog:', content);
    if (newContent && newContent.trim()) {
        const data = {
            content: newContent,
            editedAt: new Date().toISOString()
        };
        localStorage.setItem('blog_introduction', JSON.stringify(data));
        document.getElementById('introductionText').textContent = newContent;
        alert('✅ Introducción actualizada');
    }
}

// ===================== RENDERIZAR CATEGORÍAS =====================
function renderCategoryCards() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" style="background: linear-gradient(135deg, ${cat.color}80 0%, ${cat.color}40 100%); color: white; border-top: 3px solid ${cat.color};">
            <div class="category-icon">${cat.icon}</div>
            <h3>${cat.name}</h3>
        </div>
    `).join('');

    document.querySelectorAll('.category-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const category = categories[index].key;
            window.open(`category-view.html?cat=${category}`, '_blank');
        });
    });
}

// ===================== RENDERIZAR ARTÍCULOS DESTACADOS =====================
function renderFeaturedArticles() {
    const grid = document.getElementById('featuredGrid');
    const noArticles = document.getElementById('noFeaturedArticles');
    grid.innerHTML = '';

    const featured = articles.filter(a => a.featured === true);

    if (featured.length === 0) {
        grid.style.display = 'none';
        noArticles.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noArticles.style.display = 'none';

    featured.forEach((article) => {
        const card = document.createElement('div');
        card.className = 'article-card featured';
        card.style.cursor = 'pointer';
        
        const categoryObj = categories.find(c => article.categories && article.categories.includes(c.key));
        const categoryName = categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : '📄 Ciencia';
        const categoryColor = categoryObj ? categoryObj.color : '#666666';
        
        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/600x400?text=Science+Stone'}" 
                 alt="${article.title}" 
                 class="article-image"
                 onerror="this.src='https://via.placeholder.com/600x400?text=Science+Stone'">
            <div class="article-content" style="background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
                <span class="article-category" style="background: ${categoryColor}; color: white;">${categoryName}</span>
                <h3 class="article-title" style="color: white;">${article.title}</h3>
                <p class="article-excerpt" style="color: rgba(255,255,255,0.9);">${article.excerpt}</p>
                <p class="article-date" style="color: rgba(255,255,255,0.8);">${new Date(article.date).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            window.open(`article-view.html?id=${article.id}`, '_blank');
        });
        
        grid.appendChild(card);
    });
}

// ===================== RENDERIZAR ARTÍCULOS GENERALES =====================
function renderArticles() {
    const grid = document.getElementById('articlesGrid');
    const noArticles = document.getElementById('noArticles');
    grid.innerHTML = '';

    const notFeatured = articles.filter(a => a.featured !== true);

    if (notFeatured.length === 0) {
        grid.style.display = 'none';
        noArticles.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noArticles.style.display = 'none';

    notFeatured.forEach((article) => {
        const card = document.createElement('div');
        card.className = 'article-card general';
        card.style.cursor = 'pointer';
        
        const categoryObj = categories.find(c => article.categories && article.categories.includes(c.key));
        const categoryName = categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : '📄 Ciencia';
        const categoryColor = categoryObj ? categoryObj.color : '#666666';
        
        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/600x400?text=Science+Stone'}" 
                 alt="${article.title}" 
                 class="article-image"
                 onerror="this.src='https://via.placeholder.com/600x400?text=Science+Stone'">
            <div class="article-content">
                <span class="article-category" style="background: linear-gradient(135deg, ${categoryColor}dd 0%, ${categoryColor}aa 100%); color: white;">${categoryName}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            window.open(`article-view.html?id=${article.id}`, '_blank');
        });
        
        grid.appendChild(card);
    });
}

// ===================== BÚSQUEDA FUNCIONAL =====================
function setupEventListeners() {
    // Hamburger
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

    // Búsqueda
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
            renderArticles();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length === 0) {
                renderArticles();
                return;
            }

            const grid = document.getElementById('articlesGrid');
            grid.innerHTML = '';

            const filtered = articles.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.excerpt.toLowerCase().includes(query) ||
                (article.categories && article.categories.some(cat => {
                    const catObj = categories.find(c => c.key === cat);
                    return catObj && catObj.name.toLowerCase().includes(query);
                }))
            );

            if (filtered.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #666;">No se encontraron artículos que coincidan con tu búsqueda.</div>';
                return;
            }

            filtered.forEach(article => {
                const card = document.createElement('div');
                card.className = 'article-card';
                card.style.cursor = 'pointer';
                const categoryObj = categories.find(c => article.categories && article.categories.includes(c.key));
                const categoryName = categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : '📄 Ciencia';
                const categoryColor = categoryObj ? categoryObj.color : '#666666';
                
                card.innerHTML = `
                    <img src="${article.image || 'https://via.placeholder.com/600x400'}" 
                         alt="${article.title}" 
                         class="article-image"
                         onerror="this.src='https://via.placeholder.com/600x400'">
                    <div class="article-content">
                        <span class="article-category" style="background: ${categoryColor}; color: white;">${categoryName}</span>
                        <h3 class="article-title">${article.title}</h3>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    </div>
                `;
                card.addEventListener('click', () => {
                    window.open(`article-view.html?id=${article.id}`, '_blank');
                });
                grid.appendChild(card);
            });
        });
    }

    // Newsletter
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            const email = document.getElementById('newsletterEmail').value.trim();
            if (!email) {
                showMessage('Por favor ingresa un email válido', 'error');
                return;
            }
            
            const emails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
            if (!emails.includes(email)) {
                emails.push(email);
                localStorage.setItem('newsletter_emails', JSON.stringify(emails));
            }
            
            showMessage('✅ ¡Suscripción exitosa! Gracias por seguirnos.', 'success');
            document.getElementById('newsletterEmail').value = '';
        });
    }
}

function showMessage(message, type) {
    const messageEl = document.getElementById('subscriptionMessage');
    messageEl.textContent = message;
    messageEl.className = type;
    messageEl.style.display = 'block';
    messageEl.style.color = type === 'success' ? '#2E8B57' : '#DC143C';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

function loadAuthorInfo() {
    const authorName = localStorage.getItem('author_name') || 'Administrador';
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
        if (adminBtn) adminBtn.style.display = 'inline-block';
    }
}

// ===================== INICIAR =====================
loadAllData();