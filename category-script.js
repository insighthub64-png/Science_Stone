// ===================== CATEGORY-SCRIPT.JS ACTUALIZADO =====================
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
    // Actualizar títulos y color del hero
    const heroSection = document.getElementById('categoryHero');
    heroSection.style.background = `linear-gradient(135deg, ${currentCategory.color} 0%, ${currentCategory.color}dd 100%)`;
    
    document.getElementById('categoryTitle').innerHTML = `${currentCategory.icon} ${currentCategory.name}`;
    document.getElementById('categoryDescription').textContent = `Explora los artículos de ${currentCategory.name}`;
    document.title = `${currentCategory.name} - Science Stone`;
    
    // Cambiar color del texto a negro
    document.getElementById('categoryTitle').style.color = '#000';
    document.getElementById('categoryDescription').style.color = '#000';
    
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
                <span class="article-category" style="background-color: ${currentCategory.color}; color: #000;">${currentCategory.name}</span>
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
                        <span class="article-category" style="background-color: ${currentCategory.color}; color: #000;">${currentCategory.name}</span>
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