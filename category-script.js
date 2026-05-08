// ===================== CATEGORY-SCRIPT.JS MEJORADO =====================
const categories = [
    { key: 'quimica', name: 'Química', icon: '⚗️', color: '#1E90FF', description: 'Explora el fascinante mundo de la química, desde reacciones moleculares hasta elementos fundamentales.' },
    { key: 'biologia', name: 'Biología', icon: '🧬', color: '#2E8B57', description: 'Descubre la complejidad de la vida, organismos y procesos biológicos.' },
    { key: 'geografia', name: 'Geografía', icon: '🌍', color: '#A0522D', description: 'Viaja por el planeta y conoce sus paisajes, culturas y características geográficas.' },
    { key: 'geologia', name: 'Geología', icon: '🪨', color: '#696969', description: 'Estudia la estructura, composición y dinámica de nuestro planeta.' },
    { key: 'paleontologia', name: 'Paleontología', icon: '🦕', color: '#C68642', description: 'Viaja al pasado a través de fósiles y especies extintas.' },
    { key: 'astronomia', name: 'Astronomía', icon: '🔭', color: '#191970', description: 'Explora el universo, estrellas, galaxias y misterios cósmicos.' },
    { key: 'tecnologia', name: 'Tecnología', icon: '💻', color: '#00BFFF', description: 'Descubre los últimos avances tecnológicos e innovaciones.' },
    { key: 'meteorologia', name: 'Meteorología', icon: '⛈️', color: '#87CEEB', description: 'Comprende los fenómenos climáticos y meteorológicos.' },
    { key: 'ingenieria', name: 'Ingeniería', icon: '⚙️', color: '#FF8C00', description: 'Conoce las aplicaciones prácticas de la ciencia en la ingeniería.' },
    { key: 'historia', name: 'Historia', icon: '📚', color: '#8B6F47', description: 'Viaja por la historia científica y sus hitos más importantes.' },
    { key: 'medicina', name: 'Medicina', icon: '💊', color: '#DC143C', description: 'Aprende sobre avances médicos y la salud humana.' },
    { key: 'experimentos', name: 'Experimentos', icon: '🔬', color: '#32CD32', description: 'Realiza experimentos y descubre por ti mismo los fenómenos científicos.' },
    { key: 'noticias', name: 'Noticias', icon: '📰', color: '#E53935', description: 'Mantente actualizado con las últimas noticias científicas.' },
    { key: 'datos-curiosos', name: 'Datos Curiosos', icon: '💡', color: '#FF6F61', description: 'Descubre datos fascinantes y curiosidades del mundo científico.' }
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
    const heroSection = document.getElementById('categoryHero');
    document.getElementById('categoryTitle').innerHTML = `${currentCategory.icon} ${currentCategory.name}`;
    document.getElementById('categoryDescription').textContent = currentCategory.description;
    document.title = `${currentCategory.name} - Science Stone`;
    
    heroSection.style.background = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), linear-gradient(135deg, ${currentCategory.color} 0%, ${currentCategory.color}dd 100%)`;
    
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
        
        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/600x400'}" 
                 alt="${article.title}" 
                 class="article-image"
                 onerror="this.src='https://via.placeholder.com/600x400'">
            <div class="article-content">
                <span class="article-category" style="color: ${currentCategory.color};">${currentCategory.icon} ${currentCategory.name}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
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
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">No se encontraron artículos en esta categoría.</div>';
                return;
            }
            
            filtered.forEach(article => {
                const card = document.createElement('div');
                card.className = 'article-card';
                card.innerHTML = `
                    <img src="${article.image || 'https://via.placeholder.com/600x400'}" 
                         alt="${article.title}" 
                         class="article-image"
                         onerror="this.src='https://via.placeholder.com/600x400'">
                    <div class="article-content">
                        <span class="article-category" style="color: ${currentCategory.color};">${currentCategory.icon} ${currentCategory.name}</span>
                        <h3 class="article-title">${article.title}</h3>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
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
loadCategory();