// ===================== AUTHOR.JS MEJORADO =====================
let authorData = {
    name: 'Tu Nombre',
    title: 'Científico y Educador',
    bio: 'Bienvenido a mi blog de ciencia...',
    image: 'https://via.placeholder.com/200x200?text=Tu+Foto',
    email: 'correo@example.com',
    phone: '+502 1234-5678',
    location: 'Guatemala',
    website: 'https://tuwebsite.com',
    joinDate: new Date().toISOString().split('T')[0],
    socials: [],
    articles: [],
    password: ''
};

let contactData = {
    email: 'correo@example.com',
    phone: '+502 1234-5678',
    country: '+502',
    location: 'Guatemala',
    socials: []
};

let isOwner = false;
let articles = [];
const categories = [
    { key: 'quimica', name: 'Química' },
    { key: 'biologia', name: 'Biología' },
    { key: 'geografia', name: 'Geografía' },
    { key: 'geologia', name: 'Geología' },
    { key: 'paleontologia', name: 'Paleontología' },
    { key: 'astronomia', name: 'Astronomía' },
    { key: 'tecnologia', name: 'Tecnología' },
    { key: 'meteorologia', name: 'Meteorología' },
    { key: 'ingenieria', name: 'Ingeniería' },
    { key: 'historia', name: 'Historia' },
    { key: 'medicina', name: 'Medicina' },
    { key: 'experimentos', name: 'Experimentos' },
    { key: 'noticias', name: 'Noticias' },
    { key: 'datos-curiosos', name: 'Datos Curiosos' }
];

// ===================== CARGAR DATOS =====================
async function loadPageData() {
    // Cargar datos del autor
    const saved = localStorage.getItem('author_data');
    if (saved) {
        authorData = { ...authorData, ...JSON.parse(saved) };
    }

    // Cargar datos de contacto
    const savedContact = localStorage.getItem('contact_data');
    if (savedContact) {
        contactData = { ...contactData, ...JSON.parse(savedContact) };
    }

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

    // Verificar si es propietario
    const ownerPassword = localStorage.getItem('owner_password');
    isOwner = !!ownerPassword;

    // Renderizar página
    if (window.location.pathname.includes('author.html')) {
        renderAuthorPage();
    } else if (window.location.pathname.includes('contact.html')) {
        renderContactPage();
    }

    setupEventListeners();
    updateFooterSocials();
}

// ===================== RENDERIZAR PÁGINA DE AUTOR =====================
function renderAuthorPage() {
    const adminBtn = document.getElementById('adminNavBtn');
    const editBtn = document.getElementById('editAuthorBtn');
    
    if (adminBtn && isOwner) {
        adminBtn.style.display = 'inline-block';
    }

    // Renderizar perfil del autor
    const profileSection = document.querySelector('.author-profile');
    if (profileSection) {
        profileSection.innerHTML = `
            <img src="${authorData.image}" alt="${authorData.name}" class="author-image">
            <div class="author-info">
                <h1>${authorData.name}</h1>
                <p class="author-title">${authorData.title}</p>
                <p class="author-bio">${authorData.bio}</p>
                <div class="author-socials">
                    ${authorData.socials.map(social => {
                        const icons = {
                            facebook: 'fab fa-facebook',
                            twitter: 'fab fa-twitter',
                            instagram: 'fab fa-instagram',
                            linkedin: 'fab fa-linkedin',
                            youtube: 'fab fa-youtube',
                            whatsapp: 'fab fa-whatsapp',
                            telegram: 'fab fa-telegram'
                        };
                        return `<a href="${social.url}" target="_blank" title="${social.platform}"><i class="${icons[social.platform] || 'fas fa-link'}"></i></a>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Renderizar detalles
    const detailsSection = document.querySelector('.author-details');
    if (detailsSection) {
        detailsSection.innerHTML = `
            <div class="author-detail-item">
                <h3>Email</h3>
                <p>${authorData.email}</p>
            </div>
            <div class="author-detail-item">
                <h3>Ubicación</h3>
                <p>${authorData.location}</p>
            </div>
            <div class="author-detail-item">
                <h3>Se unió</h3>
                <p>${new Date(authorData.joinDate).toLocaleDateString('es-ES')}</p>
            </div>
        `;
    }

    // Renderizar artículos del autor
    renderAuthorArticles();

    // Botones de admin
    if (isOwner) {
        editBtn.style.display = 'inline-block';
        
        editBtn.addEventListener('click', () => {
            document.querySelector('.author-view').style.display = 'none';
            document.querySelector('.author-edit').style.display = 'block';
            populateAuthorForm();
        });

        document.getElementById('cancelAuthorEditBtn')?.addEventListener('click', () => {
            document.querySelector('.author-view').style.display = 'block';
            document.querySelector('.author-edit').style.display = 'none';
        });

        document.getElementById('authorEditForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            saveAuthorData();
        });

        document.getElementById('addAuthorSocialBtn')?.addEventListener('click', () => {
            const container = document.getElementById('authorSocialsContainer');
            const newGroup = document.createElement('div');
            newGroup.className = 'social-input-group';
            newGroup.innerHTML = `
                <select class="social-platform">
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                </select>
                <input type="url" class="social-url" placeholder="https://...">
                <button type="button" class="btn btn-small" onclick="removeSocialInput(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            container.appendChild(newGroup);
        });
    }
}

// ===================== RENDERIZAR PÁGINA DE CONTACTO =====================
function renderContactPage() {
    const adminBtn = document.getElementById('adminNavBtn');
    const editBtn = document.getElementById('editContactBtn');
    
    if (adminBtn && isOwner) {
        adminBtn.style.display = 'inline-block';
    }

    // Actualizar información de contacto
    document.getElementById('infoEmail').textContent = contactData.email;
    document.getElementById('infoPhone').textContent = `${contactData.country} ${contactData.phone}`;
    document.getElementById('infoLocation').textContent = contactData.location;

    // Renderizar redes sociales
    renderContactSocials();

    // Manejo del formulario de contacto
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactCountry').value + ' ' + document.getElementById('contactPhoneNumber').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            type: document.getElementById('contactType').value,
            date: new Date().toISOString()
        };

        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        messages.push(formData);
        localStorage.setItem('contact_messages', JSON.stringify(messages));

        showContactAlert('✅ ¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
        document.getElementById('contactForm').reset();
    });

    // Botones de admin para contacto
    if (isOwner) {
        editBtn.style.display = 'inline-block';
        
        editBtn.addEventListener('click', () => {
            document.getElementById('contactEdit').style.display = 'block';
            populateContactForm();
        });

        document.getElementById('cancelContactEditBtn')?.addEventListener('click', () => {
            document.getElementById('contactEdit').style.display = 'none';
        });

        document.getElementById('contactEditForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            saveContactData();
        });

        document.getElementById('addContactSocialBtn')?.addEventListener('click', () => {
            const container = document.getElementById('contactSocialsEditContainer');
            const newGroup = document.createElement('div');
            newGroup.className = 'social-input-group';
            newGroup.innerHTML = `
                <select class="social-platform">
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                </select>
                <input type="url" class="social-url" placeholder="https://...">
                <button type="button" class="btn btn-small" onclick="removeSocialInput(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            container.appendChild(newGroup);
        });
    }
}

// ===================== RENDERIZAR ARTÍCULOS DEL AUTOR =====================
function renderAuthorArticles() {
    const container = document.querySelector('.author-articles .articles-list');
    if (!container) return;

    if (articles.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999;">No hay artículos publicados aún.</p>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <div class="article-card" style="cursor:pointer;" onclick="window.location.href='article.html?id=${article.id}'">
            <img src="${article.image || 'https://via.placeholder.com/300x200'}" alt="${article.title}" class="article-image">
            <div class="article-content">
                <span class="article-category">${getCategoryName(article.categories)}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-date">${new Date(article.date).toLocaleDateString('es-ES')}</p>
                <p class="article-excerpt">${article.excerpt}</p>
            </div>
        </div>
    `).join('');
}

// ===================== OBTENER NOMBRE DE CATEGORÍA =====================
function getCategoryName(cats) {
    if (!cats || cats.length === 0) return 'Ciencia';
    const catObj = categories.find(c => c.key === cats[0]);
    return catObj ? catObj.name : 'Ciencia';
}

// ===================== RELLENAR FORMULARIO DE AUTOR =====================
function populateAuthorForm() {
    document.getElementById('editAuthorName').value = authorData.name;
    document.getElementById('editAuthorTitle').value = authorData.title;
    document.getElementById('editAuthorBio').value = authorData.bio;
    document.getElementById('editAuthorImage').value = authorData.image;
    document.getElementById('editAuthorEmail').value = authorData.email;
    document.getElementById('editAuthorLocation').value = authorData.location;
    document.getElementById('editAuthorWebsite').value = authorData.website;

    const socialsContainer = document.getElementById('authorSocialsContainer');
    socialsContainer.innerHTML = '';
    
    authorData.socials.forEach(social => {
        const group = document.createElement('div');
        group.className = 'social-input-group';
        group.innerHTML = `
            <select class="social-platform">
                <option value="facebook" ${social.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                <option value="twitter" ${social.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                <option value="instagram" ${social.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                <option value="linkedin" ${social.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                <option value="youtube" ${social.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                <option value="whatsapp" ${social.platform === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
                <option value="telegram" ${social.platform === 'telegram' ? 'selected' : ''}>Telegram</option>
            </select>
            <input type="url" class="social-url" value="${social.url}" placeholder="https://...">
            <button type="button" class="btn btn-small" onclick="removeSocialInput(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        socialsContainer.appendChild(group);
    });
}

// ===================== GUARDAR DATOS DE AUTOR =====================
function saveAuthorData() {
    authorData.name = document.getElementById('editAuthorName').value;
    authorData.title = document.getElementById('editAuthorTitle').value;
    authorData.bio = document.getElementById('editAuthorBio').value;
    authorData.image = document.getElementById('editAuthorImage').value;
    authorData.email = document.getElementById('editAuthorEmail').value;
    authorData.location = document.getElementById('editAuthorLocation').value;
    authorData.website = document.getElementById('editAuthorWebsite').value;

    const socials = [];
    document.querySelectorAll('#authorSocialsContainer .social-input-group').forEach(group => {
        const platform = group.querySelector('.social-platform').value;
        const url = group.querySelector('.social-url').value;
        if (platform && url) {
            socials.push({ platform, url });
        }
    });
    authorData.socials = socials;

    localStorage.setItem('author_data', JSON.stringify(authorData));
    localStorage.setItem('author_socials', JSON.stringify(socials));
    localStorage.setItem('author_name', authorData.name);

    alert('✅ Perfil de autor actualizado correctamente');
    
    document.querySelector('.author-view').style.display = 'block';
    document.querySelector('.author-edit').style.display = 'none';
    
    renderAuthorPage();
}

// ===================== RELLENAR FORMULARIO DE CONTACTO =====================
function populateContactForm() {
    document.getElementById('editContactEmail').value = contactData.email;
    document.getElementById('editContactCountry').value = contactData.country;
    document.getElementById('editContactPhoneNumber').value = contactData.phone;
    document.getElementById('editContactLocation').value = contactData.location;

    const socialsContainer = document.getElementById('contactSocialsEditContainer');
    socialsContainer.innerHTML = '';
    
    contactData.socials.forEach(social => {
        const group = document.createElement('div');
        group.className = 'social-input-group';
        group.innerHTML = `
            <select class="social-platform">
                <option value="facebook" ${social.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                <option value="twitter" ${social.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                <option value="instagram" ${social.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                <option value="linkedin" ${social.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                <option value="youtube" ${social.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
            </select>
            <input type="url" class="social-url" value="${social.url}" placeholder="https://...">
            <button type="button" class="btn btn-small" onclick="removeSocialInput(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        socialsContainer.appendChild(group);
    });
}

// ===================== GUARDAR DATOS DE CONTACTO =====================
function saveContactData() {
    contactData.email = document.getElementById('editContactEmail').value;
    contactData.country = document.getElementById('editContactCountry').value;
    contactData.phone = document.getElementById('editContactPhoneNumber').value;
    contactData.location = document.getElementById('editContactLocation').value;

    const socials = [];
    document.querySelectorAll('#contactSocialsEditContainer .social-input-group').forEach(group => {
        const platform = group.querySelector('.social-platform').value;
        const url = group.querySelector('.social-url').value;
        if (platform && url) {
            socials.push({ platform, url });
        }
    });
    contactData.socials = socials;

    localStorage.setItem('contact_data', JSON.stringify(contactData));
    localStorage.setItem('author_socials', JSON.stringify(socials));

    showContactAlert('✅ Información de contacto actualizada correctamente', 'success');
    
    document.getElementById('contactEdit').style.display = 'none';
    
    renderContactPage();
}

// ===================== RENDERIZAR REDES SOCIALES DE CONTACTO =====================
function renderContactSocials() {
    const container = document.getElementById('contactSocials');
    if (!container) return;

    const icons = {
        facebook: 'fab fa-facebook',
        twitter: 'fab fa-twitter',
        instagram: 'fab fa-instagram',
        linkedin: 'fab fa-linkedin',
        youtube: 'fab fa-youtube'
    };

    container.innerHTML = contactData.socials.map(social => `
        <a href="${social.url}" target="_blank" class="contact-social-link">
            <i class="${icons[social.platform] || 'fas fa-link'}"></i>
        </a>
    `).join('');
}

// ===================== REMOVER INPUT DE RED SOCIAL =====================
function removeSocialInput(btn) {
    btn.parentElement.remove();
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

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchBar.classList.toggle('active');
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            searchBar.classList.remove('active');
        });
    }
}

// ===================== MOSTRAR ALERTAS DE CONTACTO =====================
function showContactAlert(message, type) {
    const messageEl = document.getElementById('subscriptionMessage') || document.createElement('div');
    messageEl.id = 'subscriptionMessage';
    messageEl.textContent = message;
    messageEl.className = type === 'success' ? 'success' : 'error';
    messageEl.style.display = 'block';
    
    if (!document.getElementById('subscriptionMessage')) {
        document.body.appendChild(messageEl);
    }

    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 4000);
}

// ===================== ACTUALIZAR REDES SOCIALES DEL FOOTER =====================
function updateFooterSocials() {
    const footerSocial = document.getElementById('footerSocial');
    if (!footerSocial) return;
    
    let socials = authorData.socials;
    if (window.location.pathname.includes('contact.html')) {
        socials = contactData.socials;
    }
    
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

// ===================== CARGAR PÁGINA =====================
loadPageData();