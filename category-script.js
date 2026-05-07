// ===================== CATEGORY-SCRIPT.JS =====================
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
let currentCategory = null;

// ===================== CARGAR CATEGORÍA =====================
async function loadCategory() {
    const params = new URLSearchParams(window.location.search);
    const categoryKey = params.get('cat');
    
    if (!categoryKey) {
        window.location.href = 'index.html';
        return;
    }
    
    currentCategory = categories.find(c => c.key === categoryKey);
    if (!currentCategory) {
        window.location.href = 'index.html';
        return;
    }
    
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
    
    renderPage();
    setupEventListeners();
    updateFooterSocials();
    checkAdminStatus();
}

function renderPage() {
    // Actualizar títulos
    document.getElementById('categoryTitle').textContent = currentCategory.name;
    document.getElementById('categoryDescription').textContent = `Explora todos los artículos de ${currentCategory.name}`;
    document.title = `${currentCategory.name} - Science Stone`;
    
    renderArticles();
}

function renderArticles() {
    const grid = document.getElementById('articlesGrid');
    const noArticles = document.getElementById('noArticles');
    grid.innerHTML = '';
    
    const filtered = articles.filter(article => 
        article.categories && article.categories.includes(currentCategory.key)
    );
    
    if (filtered.length === 0) {
        grid.style.display = 'none';
        noArticles.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noArticles.style.display = 'none';
    
    filtered.forEach((article, index) => {
        const card = document.createElement('div');
        card.className = 'article-card';
        
        // Variar tamaño de tarjetas (masónico)
        const sizes = ['normal', 'normal', 'large', 'list'];
        const size = sizes[index % sizes.length];
        if (size === 'large') card.classList.add('article-card-large');
        if (size === 'list') card.classList.add('article-card-list');
        
        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/300x200'}" 
                 alt="${article.title}" class="article-image" 
                 onerror="this.src='https://via.placeholder.com/300x200'">
            <div class="article-content">
                <span class="article-category">${currentCategory.name}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES')}</p>
                <p class="article-excerpt">${article.excerpt}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `article.html?id=${article.id}`;
        });
        
        grid.appendChild(card);
    });
}

function setupEventListeners() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
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
            renderArticles();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const grid = document.getElementById('articlesGrid');
            grid.innerHTML = '';
            
            const filtered = articles.filter(article =>
                article.categories && article.categories.includes(currentCategory.key) &&
                (article.title.toLowerCase().includes(query) ||
                 article.excerpt.toLowerCase().includes(query))
            );
            
            if (filtered.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No se encontraron artículos</div>';
                return;
            }
            
            filtered.forEach(article => {
                const card = document.createElement('div');
                card.className = 'article-card';
                card.innerHTML = `
                    <img src="${article.image || 'https://via.placeholder.com/300x200'}" 
                         alt="${article.title}" class="article-image">
                    <div class="article-content">
                        <span class="article-category">${currentCategory.name}</span>
                        <h3 class="article-title">${article.title}</h3>
                        <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES')}</p>
                        <p class="article-excerpt">${article.excerpt}</p>
                    </div>
                `;
                card.addEventListener('click', () => {
                    window.location.href = `article.html?id=${article.id}`;
                });
                grid.appendChild(card);
            });
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
loadCategory();