// ===================== RESOURCES-SCRIPT.JS =====================
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

const resourceIcons = {
    pdf: '<i class="fas fa-file-pdf" style="color: #DC143C;"></i>',
    libro: '<i class="fas fa-book" style="color: #8B6F47;"></i>',
    video: '<i class="fas fa-video" style="color: #191970;"></i>',
    infografia: '<i class="fas fa-image" style="color: #FF6F61;"></i>',
    audio: '<i class="fas fa-podcast" style="color: #00BFFF;"></i>'
};

const resourceLabels = {
    pdf: 'PDF',
    libro: 'LIBRO',
    video: 'VIDEO',
    infografia: 'INFOGRAFÍA',
    audio: 'AUDIO'
};

let resources = [];
let currentTypeFilter = 'todos';
let currentCategoryFilter = 'todos';

// ===================== CARGAR RECURSOS =====================
async function loadResources() {
    const saved = localStorage.getItem('science_stone_resources');
    if (saved) {
        resources = JSON.parse(saved);
    }

    renderCategoryFilters();
    renderResources();
    setupEventListeners();
    updateFooterSocials();
    checkAdminStatus();
}

function renderCategoryFilters() {
    const container = document.getElementById('categoryFiltersResources');
    
    container.innerHTML = `<button class="filter-btn active" data-category="todos">Todas</button>` +
        categories.map(cat => `
            <button class="filter-btn" data-category="${cat.key}">
                ${cat.icon} ${cat.name}
            </button>
        `).join('');

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategoryFilter = btn.dataset.category;
            renderResources();
        });
    });
}

function renderResources() {
    const grid = document.getElementById('resourcesGrid');
    const noResources = document.getElementById('noResources');
    grid.innerHTML = '';

    let filtered = resources;

    if (currentTypeFilter !== 'todos') {
        filtered = filtered.filter(r => r.type === currentTypeFilter);
    }

    if (currentCategoryFilter !== 'todos') {
        filtered = filtered.filter(r => r.category === currentCategoryFilter);
    }

    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResources.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResources.style.display = 'none';

    filtered.forEach((resource, index) => {
        const card = document.createElement('div');
        card.className = 'resource-card';

        const categoryObj = categories.find(c => c.key === resource.category);
        const categoryColor = categoryObj ? categoryObj.color : '#666666';

        card.innerHTML = `
            <div class="resource-icon" style="background: linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%);">
                ${resourceIcons[resource.type]}
            </div>
            <div class="resource-content">
                <span class="resource-type" style="color: ${categoryColor};">${resourceLabels[resource.type]}</span>
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-meta">
                    <span>${resource.author || 'Sin autor'}</span>
                    <a href="${resource.url}" target="_blank" class="resource-download">
                        Descargar <i class="fas fa-download"></i>
                    </a>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function setupEventListeners() {
    // Filtros de tipo
    document.getElementById('filterButtonsResources').querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('filterButtonsResources').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTypeFilter = btn.dataset.filter;
            renderResources();
        });
    });

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
            renderResources();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const grid = document.getElementById('resourcesGrid');
            grid.innerHTML = '';

            const filtered = resources.filter(r =>
                r.title.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">No se encontraron recursos.</div>';
                return;
            }

            filtered.forEach(resource => {
                const card = document.createElement('div');
                card.className = 'resource-card';

                const categoryObj = categories.find(c => c.key === resource.category);
                const categoryColor = categoryObj ? categoryObj.color : '#666666';

                card.innerHTML = `
                    <div class="resource-icon" style="background: linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%);">
                        ${resourceIcons[resource.type]}
                    </div>
                    <div class="resource-content">
                        <span class="resource-type" style="color: ${categoryColor};">${resourceLabels[resource.type]}</span>
                        <h3 class="resource-title">${resource.title}</h3>
                        <p class="resource-description">${resource.description}</p>
                        <div class="resource-meta">
                            <span>${resource.author || 'Sin autor'}</span>
                            <a href="${resource.url}" target="_blank" class="resource-download">
                                Descargar <i class="fas fa-download"></i>
                            </a>
                        </div>
                    </div>
                `;

                grid.appendChild(card);
            });
        });
    }

    // Admin
    const addResourceBtn = document.getElementById('addResourceBtn');
    if (addResourceBtn) {
        addResourceBtn.addEventListener('click', () => {
            document.getElementById('addResourceModal').style.display = 'flex';
            loadCategoryOptions();
        });
    }

    const addResourceForm = document.getElementById('addResourceForm');
    if (addResourceForm) {
        addResourceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveNewResource();
        });
    }
}

function loadCategoryOptions() {
    const select = document.getElementById('resourceCategory');
    select.innerHTML = categories.map(cat => `
        <option value="${cat.key}">${cat.icon} ${cat.name}</option>
    `).join('');
}

function saveNewResource() {
    const title = document.getElementById('resourceTitle').value.trim();
    const type = document.getElementById('resourceType').value;
    const category = document.getElementById('resourceCategory').value;
    const description = document.getElementById('resourceDescription').value.trim();
    const url = document.getElementById('resourceUrl').value.trim();
    const author = document.getElementById('resourceAuthor').value.trim();

    if (!title || !type || !category || !url) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    const newResource = {
        id: Date.now(),
        title,
        type,
        category,
        description,
        url,
        author,
        createdAt: new Date().toISOString()
    };

    resources.push(newResource);
    localStorage.setItem('science_stone_resources', JSON.stringify(resources));

    document.getElementById('addResourceForm').reset();
    closeAddResource();
    renderResources();
    alert('✅ Recurso agregado correctamente');
}

function closeAddResource() {
    document.getElementById('addResourceModal').style.display = 'none';
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
    const addResourceBtn = document.getElementById('addResourceBtn');
    const adminBtn = document.getElementById('adminNavBtn');
    
    if (localStorage.getItem('owner_password')) {
        if (addResourceBtn) addResourceBtn.style.display = 'inline-block';
        if (adminBtn) adminBtn.style.display = 'inline-block';
    }
}

// ===================== CARGAR =====================
loadResources();