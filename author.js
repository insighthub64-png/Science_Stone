// ===================== AUTHOR.JS MEJORADO =====================
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

// ===================== CARGAR PÁGINA =====================
async function loadAuthorPage() {
    // Cargar artículos
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
    
    loadAuthorInfo();
    renderAuthorArticles();
    setupEventListeners();
    updateFooterSocials();
    checkAdminStatus();
}

function loadAuthorInfo() {
    const authorName = localStorage.getItem('author_name') || 'Tu Nombre';
    const authorTitle = localStorage.getItem('author_title') || 'Título Profesional';
    const authorBio = localStorage.getItem('author_bio') || 'Bienvenido a Science Stone. Soy un apasionado por la ciencia...';
    const authorImage = localStorage.getItem('author_image') || 'https://via.placeholder.com/300x300?text=Foto+de+Perfil';
    const authorEmail = localStorage.getItem('author_email') || 'contacto@example.com';
    const authorLocation = localStorage.getItem('author_location') || 'Ubicación';
    const authorWebsite = localStorage.getItem('author_website') || '';

    document.getElementById('authorName').textContent = authorName;
    document.getElementById('authorTitle').textContent = authorTitle;
    document.getElementById('authorBio').textContent = authorBio;
    document.getElementById('authorImage').src = authorImage;
    document.getElementById('authorEmail').textContent = authorEmail;
    document.getElementById('authorLocation').textContent = authorLocation;
    document.getElementById('authorWebsite').textContent = authorWebsite;

    // Llenar form de edición
    if (document.getElementById('editAuthorName')) {
        document.getElementById('editAuthorName').value = authorName;
        document.getElementById('editAuthorTitle').value = authorTitle;
        document.getElementById('editAuthorBio').value = authorBio;
        document.getElementById('editAuthorImage').value = authorImage;
        document.getElementById('editAuthorEmail').value = authorEmail;
        document.getElementById('editAuthorLocation').value = authorLocation;
        document.getElementById('editAuthorWebsite').value = authorWebsite;
    }

    // Mostrar sociales
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
    
    const socialsDisplay = document.getElementById('authorSocialsDisplay');
    if (socialsDisplay) {
        socialsDisplay.innerHTML = socials.map(social => `
            <a href="${social.url}" class="social-link" target="_blank" title="${social.platform}">
                <i class="${icons[social.platform] || 'fas fa-link'}"></i>
            </a>
        `).join('');
    }
}

function renderAuthorArticles() {
    const container = document.getElementById('authorArticlesGrid');
    
    if (articles.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px;">No hay artículos publicados aún.</p>';
        return;
    }

    container.innerHTML = articles.map(article => {
        const categoryObj = categories.find(c => article.categories && article.categories.includes(c.key));
        const categoryName = categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : '📄 Ciencia';
        const categoryColor = categoryObj ? categoryObj.color : '#666666';
        
        return `
            <div class="article-card" onclick="window.location.href='article.html?id=${article.id}'" style="cursor: pointer;">
                <img src="${article.image || 'https://via.placeholder.com/600x400'}" 
                     alt="${article.title}" 
                     class="article-image"
                     onerror="this.src='https://via.placeholder.com/600x400'">
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
            if (query.length === 0) {
                renderAuthorArticles();
                return;
            }
            
            const filtered = articles.filter(a =>
                a.title.toLowerCase().includes(query) ||
                a.excerpt.toLowerCase().includes(query)
            );
            
            const container = document.getElementById('authorArticlesGrid');
            if (filtered.length === 0) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">No se encontraron artículos.</p>';
                return;
            }

            container.innerHTML = filtered.map(article => {
                const categoryObj = categories.find(c => article.categories && article.categories.includes(c.key));
                const categoryName = categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : '📄 Ciencia';
                const categoryColor = categoryObj ? categoryObj.color : '#666666';
                
                return `
                    <div class="article-card" onclick="window.location.href='article.html?id=${article.id}'" style="cursor: pointer;">
                        <img src="${article.image || 'https://via.placeholder.com/600x400'}" 
                             alt="${article.title}" 
                             class="article-image"
                             onerror="this.src='https://via.placeholder.com/600x400'">
                        <div class="article-content">
                            <span class="article-category" style="color: ${categoryColor};">${categoryName}</span>
                            <h3 class="article-title">${article.title}</h3>
                            <p class="article-excerpt">${article.excerpt}</p>
                            <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                        </div>
                    </div>
                `;
            }).join('');
        });
    }

    const editAuthorBtn = document.getElementById('editAuthorBtn');
    if (editAuthorBtn) {
        editAuthorBtn.addEventListener('click', () => {
            document.getElementById('authorEditPanel').style.display = 'flex';
        });
    }

    const editForm = document.getElementById('authorEditForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveAuthorInfo();
        });
    }
}

function saveAuthorInfo() {
    const name = document.getElementById('editAuthorName').value.trim();
    const title = document.getElementById('editAuthorTitle').value.trim();
    const bio = document.getElementById('editAuthorBio').value.trim();
    const image = document.getElementById('editAuthorImage').value.trim();
    const email = document.getElementById('editAuthorEmail').value.trim();
    const location = document.getElementById('editAuthorLocation').value.trim();
    const website = document.getElementById('editAuthorWebsite').value.trim();

    localStorage.setItem('author_name', name);
    localStorage.setItem('author_title', title);
    localStorage.setItem('author_bio', bio);
    localStorage.setItem('author_image', image);
    localStorage.setItem('author_email', email);
    localStorage.setItem('author_location', location);
    localStorage.setItem('author_website', website);

    alert('✅ Perfil actualizado correctamente');
    closeAuthorEdit();
    loadAuthorInfo();
}

function closeAuthorEdit() {
    document.getElementById('authorEditPanel').style.display = 'none';
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
    const editBtn = document.getElementById('editAuthorBtn');
    if (editBtn && localStorage.getItem('owner_password')) {
        editBtn.style.display = 'inline-block';
    }

    const adminBtn = document.getElementById('adminNavBtn');
    if (adminBtn && localStorage.getItem('owner_password')) {
        adminBtn.style.display = 'inline-block';
    }
}

// ===================== CARGAR =====================
loadAuthorPage();