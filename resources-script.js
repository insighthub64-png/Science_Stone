// ===================== RESOURCES-SCRIPT.JS =====================
const categories = [
    { key: 'quimica', name: 'Química', icon: '⚗️' },
    { key: 'biologia', name: 'Biología', icon: '🧬' },
    { key: 'geografia', name: 'Geografía', icon: '🌍' },
    { key: 'geologia', name: 'Geología', icon: '🪨' },
    { key: 'paleontologia', name: 'Paleontología', icon: '🦕' },
    { key: 'astronomia', name: 'Astronomía', icon: '🔭' },
    { key: 'tecnologia', name: 'Tecnología', icon: '💻' },
    { key: 'meteorologia', name: 'Meteorología', icon: '⛈️' },
    { key: 'ingenieria', name: 'Ingeniería', icon: '⚙️' },
    { key: 'historia', name: 'Historia', icon: '📚' },
    { key: 'medicina', name: 'Medicina', icon: '💊' },
    { key: 'experimentos', name: 'Experimentos', icon: '🔬' },
    { key: 'noticias', name: 'Noticias', icon: '📰' },
    { key: 'datos-curiosos', name: 'Datos Curiosos', icon: '💡' }
];

let resources = [];
let isOwner = false;
let editingResourceId = null;

// ===================== CARGAR RECURSOS =====================
function loadResources() {
    const saved = localStorage.getItem('science_stone_resources') || '[]';
    resources = JSON.parse(saved);
    
    initializePage();
}

function initializePage() {
    renderCategoryOptions();
    renderResources();
    setupEventListeners();
    updateFooterSocials();
    checkAdminStatus();
}

function renderCategoryOptions() {
    const select = document.getElementById('resourceCategory');
    const filterButtons = document.getElementById('filterButtons');
    
    // Limpiar opciones previas excepto la primera
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.key;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Agregar botones de filtro dinámicos
    let html = '<button class="filter-btn active" data-filter="todos">Todos</button>';
    categories.forEach(cat => {
        html += `<button class="filter-btn" data-filter="${cat.key}">${cat.name}</button>`;
    });
    filterButtons.innerHTML = html;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderResources(e.target.dataset.filter);
        });
    });
}

function renderResources(filter = 'todos') {
    const grid = document.getElementById('resourcesGrid');
    const noResources = document.getElementById('noResources');
    grid.innerHTML = '';
    
    let filtered = resources;
    if (filter !== 'todos') {
        filtered = resources.filter(r => r.category === filter);
    }
    
    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResources.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResources.style.display = 'none';
    
    filtered.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        const categoryObj = categories.find(c => c.key === resource.category);
        const categoryName = categoryObj ? categoryObj.name : 'Recurso';
        
        let mediaHTML = '';
        if (resource.image) {
            mediaHTML = `<img src="${resource.image}" alt="${resource.title}" class="resource-image">`;
        }
        
        let typeIcon = '📄';
        const typeNames = {
            video: '📹',
            podcast: '🎙️',
            libro: '📚',
            revista: '📰',
            articulo: '📝',
            tesis: '🎓',
            debate: '💬'
        };
        typeIcon = typeNames[resource.type] || '📄';
        
        const editedInfo = resource.editedAt ? `<p class="resource-date"><small>Modificado: ${new Date(resource.editedAt).toLocaleString('es-ES')}</small></p>` : '';
        
        card.innerHTML = `
            ${mediaHTML}
            <div class="resource-content">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <span style="font-size: 20px;">${typeIcon}</span>
                    <span class="resource-category">${categoryName}</span>
                </div>
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-date">${new Date(resource.date).toLocaleDateString('es-ES')}</p>
                ${editedInfo}
                <p class="resource-description">${resource.description}</p>
                ${resource.author ? `<p class="resource-author">Por: ${resource.author}</p>` : ''}
                <div class="resource-actions">
                    <button class="btn btn-small btn-cyan" onclick="openResource(${resource.id})">Ver más</button>
                    ${isOwner ? `<button class="btn btn-small btn-yellow" onclick="editResource(${resource.id})">Editar</button>
                    <button class="btn btn-small btn-red" onclick="deleteResource(${resource.id})">Eliminar</button>` : ''}
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function openResource(id) {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;
    
    if (resource.url) {
        window.open(resource.url, '_blank');
    } else if (resource.file) {
        window.location.href = resource.file;
    }
}

function editResource(id) {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;
    
    editingResourceId = id;
    document.getElementById('resourceModalTitle').textContent = 'Editar Recurso';
    document.getElementById('resourceTitle').value = resource.title;
    document.getElementById('resourceType').value = resource.type;
    document.getElementById('resourceCategory').value = resource.category;
    document.getElementById('resourceImage').value = resource.image || '';
    document.getElementById('resourceUrl').value = resource.url || '';
    document.getElementById('resourceDescription').value = resource.description;
    document.getElementById('resourceAuthor').value = resource.author || '';
    document.getElementById('resourceLink').value = resource.link || '';
    
    document.getElementById('resourceModal').style.display = 'flex';
}

function deleteResource(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este recurso?')) {
        resources = resources.filter(r => r.id !== id);
        localStorage.setItem('science_stone_resources', JSON.stringify(resources));
        renderResources();
    }
}

function setupEventListeners() {
    if (isOwner) {
        document.getElementById('addResourceBtn').addEventListener('click', () => {
            editingResourceId = null;
            document.getElementById('resourceModalTitle').textContent = 'Agregar Nuevo Recurso';
            document.getElementById('resourceForm').reset();
            document.getElementById('resourceModal').style.display = 'flex';
        });
        
        document.getElementById('resourceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            saveResource();
        });
    }
    
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
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No se encontraron recursos</div>';
                return;
            }
            
            filtered.forEach(resource => {
                const card = document.createElement('div');
                card.className = 'resource-card';
                const categoryObj = categories.find(c => c.key === resource.category);
                const categoryName = categoryObj ? categoryObj.name : 'Recurso';
                
                let mediaHTML = '';
                if (resource.image) {
                    mediaHTML = `<img src="${resource.image}" alt="${resource.title}" class="resource-image">`;
                }
                
                let typeIcon = '📄';
                const typeNames = {
                    video: '📹',
                    podcast: '🎙���',
                    libro: '📚',
                    revista: '📰',
                    articulo: '📝',
                    tesis: '🎓',
                    debate: '💬'
                };
                typeIcon = typeNames[resource.type] || '📄';
                
                card.innerHTML = `
                    ${mediaHTML}
                    <div class="resource-content">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">${typeIcon}</span>
                            <span class="resource-category">${categoryName}</span>
                        </div>
                        <h3 class="resource-title">${resource.title}</h3>
                        <p class="resource-date">${new Date(resource.date).toLocaleDateString('es-ES')}</p>
                        <p class="resource-description">${resource.description}</p>
                        ${resource.author ? `<p class="resource-author">Por: ${resource.author}</p>` : ''}
                        <div class="resource-actions">
                            <button class="btn btn-small btn-cyan" onclick="openResource(${resource.id})">Ver más</button>
                            ${isOwner ? `<button class="btn btn-small btn-yellow" onclick="editResource(${resource.id})">Editar</button>
                            <button class="btn btn-small btn-red" onclick="deleteResource(${resource.id})">Eliminar</button>` : ''}
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        });
    }
}

function saveResource() {
    const title = document.getElementById('resourceTitle').value.trim();
    const type = document.getElementById('resourceType').value;
    const category = document.getElementById('resourceCategory').value;
    const image = document.getElementById('resourceImage').value.trim();
    const url = document.getElementById('resourceUrl').value.trim();
    const description = document.getElementById('resourceDescription').value.trim();
    const author = document.getElementById('resourceAuthor').value.trim();
    const link = document.getElementById('resourceLink').value.trim();
    
    if (!title || !type || !category || !description) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    const resource = {
        id: editingResourceId || Date.now(),
        title,
        type,
        category,
        image,
        url,
        description,
        author,
        link,
        date: editingResourceId ? (resources.find(r => r.id === editingResourceId)?.date || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
        editedAt: new Date().toISOString()
    };
    
    if (editingResourceId) {
        const index = resources.findIndex(r => r.id === editingResourceId);
        if (index !== -1) resources[index] = resource;
    } else {
        resources.push(resource);
    }
    
    localStorage.setItem('science_stone_resources', JSON.stringify(resources));
    closeResourceModal();
    renderResources();
}

function closeResourceModal() {
    document.getElementById('resourceModal').style.display = 'none';
    editingResourceId = null;
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
    const addResourceBtnContainer = document.getElementById('addResourceBtnContainer');
    const ownerPassword = localStorage.getItem('owner_password');
    
    if (ownerPassword) {
        isOwner = true;
        adminBtn.style.display = 'inline-block';
        addResourceBtnContainer.style.display = 'block';
    }
}

// ===================== CARGAR =====================
loadResources();