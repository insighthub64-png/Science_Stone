// ===================== SCRIPT.JS MEJORADO =====================
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
let currentFilter = 'todos';

// ===================== CARGAR DATOS DE ARTÍCULOS =====================
async function loadArticles() {
    try {
        const response = await fetch('data.json');
        articles = await response.json();
        
        const savedArticles = localStorage.getItem('science_stone_articles');
        if (savedArticles) {
            const saved = JSON.parse(savedArticles);
            articles = [...articles, ...saved];
        }
        
        initializeBlog();
    } catch (error) {
        console.log('Usando artículos por defecto...');
        articles = getDefaultArticles();
        initializeBlog();
    }
}

function getDefaultArticles() {
    return [
        {
            id: 1,
            title: "Los Misterios de la Química Orgánica",
            categories: ["quimica"],
            image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600",
            images: ["https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600"],
            imageCredits: ["Unsplash"],
            date: "2026-04-25",
            excerpt: "Explora los fundamentos y misterios de la química orgánica y su impacto en nuestro mundo.",
            content: "La química orgánica es la rama de la química que estudia los compuestos del carbono. Estos compuestos son esenciales para toda la vida en la Tierra.",
            tags: ["química", "orgánica", "carbono", "moléculas"],
            sources: "Wikipedia, Khan Academy",
            featured: true,
            videos: [],
            links: [],
            comments: [],
            likes: 0,
            rating: 0,
            ratings: []
        }
    ];
}

// ===================== SPLASH SCREEN =====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
        }
    }, 2200);
});

// ===================== INICIALIZAR BLOG =====================
function initializeBlog() {
    renderCategoryCards();
    renderFilterButtons();
    renderArticles('todos');
    setupEventListeners();
    loadAuthorInfo();
    updateFooterSocials();
    checkAdminStatus();
}

// ===================== RENDERIZAR TARJETAS DE CATEGORÍAS =====================
function renderCategoryCards() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" data-category="${cat.key}" style="background: linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%);">
            <div class="category-icon">${cat.icon}</div>
            <h3>${cat.name}</h3>
        </div>
    `).join('');

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `category.html?cat=${category}`;
        });
    });
}

// ===================== RENDERIZAR BOTONES DE FILTRO =====================
function renderFilterButtons() {
    const container = document.getElementById('filterButtons');
    let html = '<button class="filter-btn active" data-filter="todos">Todos los Artículos</button>';
    container.innerHTML = html;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderArticles(currentFilter);
        });
    });
}

// ===================== RENDERIZAR ARTÍCULOS CON VARIEDAD =====================
function renderArticles(filter = 'todos') {
    const grid = document.getElementById('articlesGrid');
    const noArticles = document.getElementById('noArticles');
    grid.innerHTML = '';

    let filtered = articles;
    
    if (filter !== 'todos') {
        filtered = articles.filter(article => 
            article.categories && article.categories.includes(filter)
        );
    }

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
        
        // Variar tamaño de tarjetas masónico
        const sizes = ['normal', 'normal', 'large', 'list', 'normal'];
        const size = sizes[index % sizes.length];
        if (size === 'large') card.classList.add('article-card-large');
        if (size === 'list') card.classList.add('article-card-list');
        
        const categoryObj = categories.find(c => article.categories && article.categories.includes(c.key));
        const categoryName = categoryObj ? categoryObj.name : 'Ciencia';
        
        card.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/300x200?text=Sin+imagen'}" 
                 alt="${article.title}" class="article-image" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Sin+imagen'">
            <div class="article-content">
                <span class="article-category">${categoryName}</span>
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

// ===================== EVENT LISTENERS =====================
function setupEventListeners() {
    // Menú hamburguesa
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

    // Buscador
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
            renderArticles(currentFilter);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const grid = document.getElementById('articlesGrid');
            grid.innerHTML = '';

            const filtered = articles.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.excerpt.toLowerCase().includes(query) ||
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
            );

            if (filtered.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">No se encontraron artículos</div>';
                return;
            }

            filtered.forEach(article => {
                const card = document.createElement('div');
                card.className = 'article-card';
                const categoryObj = categories.find(c => article.categories && article.categories.includes(c.key));
                const categoryName = categoryObj ? categoryObj.name : 'Ciencia';
                
                card.innerHTML = `
                    <img src="${article.image || 'https://via.placeholder.com/300x200?text=Sin+imagen'}" 
                         alt="${article.title}" class="article-image" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=Sin+imagen'">
                    <div class="article-content">
                        <span class="article-category">${categoryName}</span>
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

    // Newsletter
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            const email = document.getElementById('newsletterEmail').value.trim();
            if (!email) {
                alert('Por favor ingresa un email válido');
                return;
            }
            
            const emails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
            if (!emails.includes(email)) {
                emails.push(email);
                localStorage.setItem('newsletter_emails', JSON.stringify(emails));
            }
            
            const messageEl = document.getElementById('subscriptionMessage');
            messageEl.textContent = '✅ ¡Suscripción exitosa! Gracias por seguirnos.';
            messageEl.className = 'success';
            messageEl.style.display = 'block';
            document.getElementById('newsletterEmail').value = '';
            
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 3000);
        });
    }

    // Dropdown en móvil
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = toggle.parentElement;
            dropdown.classList.toggle('active');
        });
    });
}

// ===================== FUNCIONES DEL HERO ADMIN =====================
function openHeroEditPanel() {
    document.getElementById('heroEditPanel').style.display = 'block';
}

function closeHeroEditPanel() {
    document.getElementById('heroEditPanel').style.display = 'none';
}

function updateHeroImage() {
    const url = document.getElementById('heroImageUrl').value;
    const file = document.getElementById('heroImageFile').files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('heroImage').src = e.target.result;
            localStorage.setItem('hero_image', e.target.result);
            alert('Imagen actualizada');
        };
        reader.readAsDataURL(file);
    } else if (url) {
        document.getElementById('heroImage').src = url;
        localStorage.setItem('hero_image', url);
        alert('Imagen actualizada');
    }
}

function updateHeroVideo() {
    const url = document.getElementById('heroVideoUrl').value;
    const file = document.getElementById('heroVideoFile').files[0];
    
    document.getElementById('heroImage').style.display = 'none';
    document.getElementById('heroVideo').style.display = 'block';
    document.getElementById('heroSolidColor').style.display = 'none';
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('heroVideo').src = e.target.result;
            localStorage.setItem('hero_video', e.target.result);
            alert('Video actualizado');
        };
        reader.readAsDataURL(file);
    } else if (url) {
        document.getElementById('heroVideo').src = url;
        localStorage.setItem('hero_video', url);
        alert('Video actualizado');
    }
}

function updateHeroColor() {
    const color = document.getElementById('heroColor').value;
    document.getElementById('heroSolidColor').style.backgroundColor = color;
    document.getElementById('heroSolidColor').style.display = 'block';
    document.getElementById('heroImage').style.display = 'none';
    document.getElementById('heroVideo').style.display = 'none';
    localStorage.setItem('hero_color', color);
    alert('Color actualizado');
}

function updateHeroAnimation() {
    const animation = document.getElementById('heroAnimation').value;
    const container = document.getElementById('heroAnimations');
    container.innerHTML = '';
    
    if (animation === 'bubbles') {
        createBubbles();
    } else if (animation === 'gears') {
        createGears();
    } else if (animation === 'stars') {
        createStars();
    } else if (animation === 'particles') {
        createParticles();
    }
    
    localStorage.setItem('hero_animation', animation);
}

function createBubbles() {
    const container = document.getElementById('heroAnimations');
    for (let i = 0; i < 10; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.width = Math.random() * 50 + 20 + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '-50px';
        bubble.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(bubble);
    }
}

function createGears() {
    const container = document.getElementById('heroAnimations');
    for (let i = 0; i < 5; i++) {
        const gear = document.createElement('div');
        gear.className = 'gear';
        gear.style.width = Math.random() * 60 + 40 + 'px';
        gear.style.height = gear.style.width;
        gear.style.left = Math.random() * 100 + '%';
        gear.style.top = Math.random() * 100 + '%';
        gear.style.animationDelay = Math.random() * 4 + 's';
        container.appendChild(gear);
    }
}

function createStars() {
    const container = document.getElementById('heroAnimations');
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = '⭐';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(star);
    }
}

function createParticles() {
    const container = document.getElementById('heroAnimations');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(particle);
    }
}

// ===================== CARGAR INFO DEL AUTOR =====================
function loadAuthorInfo() {
    const authorName = localStorage.getItem('author_name') || 'Tu Nombre';
    updateFooterSocials();
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
    const heroEditBtn = document.getElementById('heroEditBtn');
    const ownerPassword = localStorage.getItem('owner_password');
    
    if (ownerPassword) {
        adminBtn.style.display = 'inline-block';
        heroEditBtn.style.display = 'block';
        
        heroEditBtn.addEventListener('click', openHeroEditPanel);
    }
}

// ===================== CARGAR BLOG =====================
loadArticles();