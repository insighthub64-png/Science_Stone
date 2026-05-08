// ===================== ADMIN.JS CMS PROFESIONAL =====================
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
let currentEditingId = null;
let selectedFormat = 'standard';

// ===================== VERIFICAR AUTENTICACIÓN =====================
window.addEventListener('load', () => {
    if (!localStorage.getItem('owner_password')) {
        window.location.href = 'auth.html';
        return;
    }
    
    initializeAdmin();
});

function initializeAdmin() {
    loadArticles();
    initializeCategories();
    loadAuthorInfo();
    loadSocials();
    loadHeroInfo();
    loadIntroInfo();
    setupFormListeners();
    setupFormatSelector();
}

function loadArticles() {
    const saved = localStorage.getItem('science_stone_articles');
    if (saved) {
        articles = JSON.parse(saved);
    }
    renderArticlesList();
}

function initializeCategories() {
    const container = document.getElementById('categoriesCheckboxes');
    const resCategory = document.getElementById('resCategory');

    container.innerHTML = categories.map(cat => `
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" value="${cat.key}" class="category-checkbox">
            <span>${cat.icon} ${cat.name}</span>
        </label>
    `).join('');

    resCategory.innerHTML = categories.map(cat => `
        <option value="${cat.key}">${cat.icon} ${cat.name}</option>
    `).join('');
}

function renderArticlesList() {
    const container = document.getElementById('articlesList');
    
    if (articles.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">No hay artículos publicados aún.</p>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <div class="article-item">
            <div class="article-item-info">
                <h4>${article.title}</h4>
                <p>Publicado: ${new Date(article.date).toLocaleDateString('es-ES')}</p>
            </div>
            <div class="article-item-actions">
                <button class="btn btn-small btn-primary" onclick="editArticle(${article.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-small btn-secondary" onclick="deleteArticle(${article.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function setupFormatSelector() {
    document.querySelectorAll('.format-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.format-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            selectedFormat = this.dataset.format;
            document.getElementById('articleFormat').value = selectedFormat;
        });
    });
    // Seleccionar por defecto
    document.querySelector('[data-format="standard"]').click();
}

function setupFormListeners() {
    // Artículos
    document.getElementById('articleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveArticle();
    });

    // Recursos
    document.getElementById('resourceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveResource();
    });

    // Autor
    document.getElementById('authorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAuthor();
    });

    // Redes Sociales
    document.getElementById('socialsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSocials();
    });

    // Hero
    document.getElementById('heroForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveHero();
    });

    // Introducción
    document.getElementById('introForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveIntro();
    });
}

function saveArticle() {
    const title = document.getElementById('title').value.trim();
    const excerpt = document.getElementById('excerpt').value.trim();
    const content = document.getElementById('contentEditor').innerHTML;
    const image = document.getElementById('imageUrl').value.trim() || document.getElementById('imageFile').value;
    const imageCredit = document.getElementById('imageCredit').value.trim();
    const tags = document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t);
    const sources = document.getElementById('sources').value.trim();
    const featured = document.getElementById('featured').checked;
    const format = document.getElementById('articleFormat').value;

    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(cb => cb.value);

    if (!title || !excerpt || selectedCategories.length === 0) {
        alert('Por favor completa los campos obligatorios');
        return;
    }

    if (currentEditingId) {
        const index = articles.findIndex(a => a.id === currentEditingId);
        articles[index] = {
            ...articles[index],
            title,
            excerpt,
            content,
            image,
            imageCredits: [imageCredit],
            categories: selectedCategories,
            tags,
            sources,
            featured,
            format,
            editedAt: new Date().toISOString()
        };
        alert('✅ Artículo actualizado');
    } else {
        const newArticle = {
            id: Date.now(),
            title,
            excerpt,
            content,
            image,
            images: image ? [image] : [],
            imageCredits: imageCredit ? [imageCredit] : [],
            categories: selectedCategories,
            tags,
            sources,
            featured,
            format,
            date: new Date().toISOString(),
            links: [],
            videos: [],
            comments: [],
            likes: 0,
            rating: 0,
            ratings: []
        };
        articles.push(newArticle);
        alert('✅ Artículo publicado correctamente');
    }

    localStorage.setItem('science_stone_articles', JSON.stringify(articles));
    resetArticleForm();
    renderArticlesList();
}

function editArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    currentEditingId = id;
    
    document.getElementById('title').value = article.title;
    document.getElementById('excerpt').value = article.excerpt;
    document.getElementById('contentEditor').innerHTML = article.content;
    document.getElementById('imageUrl').value = article.image || '';
    document.getElementById('imageCredit').value = article.imageCredits?.[0] || '';
    document.getElementById('tags').value = (article.tags || []).join(', ');
    document.getElementById('sources').value = article.sources || '';
    document.getElementById('featured').checked = article.featured || false;

    // Establecer formato
    const format = article.format || 'standard';
    document.querySelectorAll('.format-option').forEach(o => {
        o.classList.remove('selected');
        if (o.dataset.format === format) {
            o.classList.add('selected');
            selectedFormat = format;
        }
    });

    document.querySelectorAll('.category-checkbox').forEach(cb => {
        cb.checked = article.categories.includes(cb.value);
    });

    document.getElementById('cancelArticleBtn').style.display = 'inline-block';
    document.querySelector('#articleForm button[type="submit"]').innerHTML = '<i class="fas fa-check"></i> Actualizar Artículo';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteArticle(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este artículo?')) return;
    
    articles = articles.filter(a => a.id !== id);
    localStorage.setItem('science_stone_articles', JSON.stringify(articles));
    renderArticlesList();
    alert('✅ Artículo eliminado');
}

function resetArticleForm() {
    document.getElementById('articleForm').reset();
    document.getElementById('contentEditor').innerHTML = '';
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
    currentEditingId = null;
    document.getElementById('cancelArticleBtn').style.display = 'none';
    document.querySelector('#articleForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Publicar Artículo';
    setupFormatSelector();
}

function saveResource() {
    const title = document.getElementById('resTitle').value.trim();
    const type = document.getElementById('resType').value;
    const category = document.getElementById('resCategory').value;
    const description = document.getElementById('resDescription').value.trim();
    const url = document.getElementById('resUrl').value.trim();
    const author = document.getElementById('resAuthor').value.trim();

    if (!title || !type || !url) {
        alert('Por favor completa los campos obligatorios');
        return;
    }

    const resources = JSON.parse(localStorage.getItem('science_stone_resources') || '[]');
    resources.push({
        id: Date.now(),
        title,
        type,
        category,
        description,
        url,
        author,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem('science_stone_resources', JSON.stringify(resources));
    document.getElementById('resourceForm').reset();
    alert('✅ Recurso agregado correctamente');
}

function loadAuthorInfo() {
    document.getElementById('authorName').value = localStorage.getItem('author_name') || '';
    document.getElementById('authorTitle').value = localStorage.getItem('author_title') || '';
    document.getElementById('authorBio').value = localStorage.getItem('author_bio') || '';
    document.getElementById('authorImage').value = localStorage.getItem('author_image') || '';
    document.getElementById('authorEmail').value = localStorage.getItem('author_email') || '';
    document.getElementById('authorLocation').value = localStorage.getItem('author_location') || '';
    document.getElementById('authorWebsite').value = localStorage.getItem('author_website') || '';
}

function saveAuthor() {
    localStorage.setItem('author_name', document.getElementById('authorName').value);
    localStorage.setItem('author_title', document.getElementById('authorTitle').value);
    localStorage.setItem('author_bio', document.getElementById('authorBio').value);
    localStorage.setItem('author_image', document.getElementById('authorImage').value);
    localStorage.setItem('author_email', document.getElementById('authorEmail').value);
    localStorage.setItem('author_location', document.getElementById('authorLocation').value);
    localStorage.setItem('author_website', document.getElementById('authorWebsite').value);
    alert('✅ Perfil actualizado');
}

function loadSocials() {
    const socials = JSON.parse(localStorage.getItem('author_socials') || '[]');
    const container = document.getElementById('socialsContainer');
    
    if (socials.length === 0) {
        addSocialInput();
        return;
    }

    container.innerHTML = socials.map((social, index) => `
        <div style="background: var(--bg-light); padding: 15px; border-radius: 4px; margin-bottom: 10px; display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: end;">
            <div>
                <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 5px;">Red Social</label>
                <select class="social-platform" data-index="${index}">
                    <option value="facebook" ${social.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                    <option value="twitter" ${social.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                    <option value="instagram" ${social.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                    <option value="linkedin" ${social.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                    <option value="youtube" ${social.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                    <option value="whatsapp" ${social.platform === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
                    <option value="telegram" ${social.platform === 'telegram' ? 'selected' : ''}>Telegram</option>
                </select>
            </div>
            <div>
                <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 5px;">URL</label>
                <input type="url" class="social-url" value="${social.url}" data-index="${index}" placeholder="https://...">
            </div>
            <button type="button" class="btn btn-small btn-secondary" onclick="removeSocialInput(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function addSocialInput() {
    const container = document.getElementById('socialsContainer');
    const newIndex = container.children.length;
    
    const div = document.createElement('div');
    div.style.cssText = 'background: var(--bg-light); padding: 15px; border-radius: 4px; margin-bottom: 10px; display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: end;';
    div.innerHTML = `
        <div>
            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 5px;">Red Social</label>
            <select class="social-platform" data-index="${newIndex}">
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
            </select>
        </div>
        <div>
            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 5px;">URL</label>
            <input type="url" class="social-url" data-index="${newIndex}" placeholder="https://...">
        </div>
        <button type="button" class="btn btn-small btn-secondary" onclick="removeSocialInput(${newIndex})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    container.appendChild(div);
}

function removeSocialInput(index) {
    const inputs = document.querySelectorAll('.social-platform');
    if (inputs.length > 1) {
        inputs[index].closest('div').parentElement.remove();
    } else {
        alert('Debes mantener al menos una red social');
    }
}

function saveSocials() {
    const socials = [];
    document.querySelectorAll('.social-platform').forEach((select, index) => {
        const platform = select.value;
        const url = document.querySelectorAll('.social-url')[index].value;
        
        if (url.trim()) {
            socials.push({ platform, url });
        }
    });

    localStorage.setItem('author_socials', JSON.stringify(socials));
    alert('✅ Redes sociales actualizadas');
}

function loadHeroInfo() {
    document.getElementById('heroImageUrl').value = localStorage.getItem('hero_image') || '';
    document.getElementById('heroColor1').value = localStorage.getItem('hero_color1') || '#667eea';
    document.getElementById('heroColor2').value = localStorage.getItem('hero_color2') || '#764ba2';
}

function saveHero() {
    const imageUrl = document.getElementById('heroImageUrl').value.trim();
    const color1 = document.getElementById('heroColor1').value;
    const color2 = document.getElementById('heroColor2').value;

    if (imageUrl) {
        localStorage.setItem('hero_image', imageUrl);
        const hero = document.getElementById('heroSection');
        if (hero) {
            hero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${imageUrl}')`;
        }
    }
    localStorage.setItem('hero_color1', color1);
    localStorage.setItem('hero_color2', color2);
    localStorage.setItem('hero_gradient', `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`);

    alert('✅ Sección Hero actualizada');
}

function loadIntroInfo() {
    const saved = localStorage.getItem('blog_introduction');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('introContent').value = data.content;
    }
}

function saveIntro() {
    const content = document.getElementById('introContent').value.trim();
    
    if (!content) {
        alert('Por favor escribe la introducción');
        return;
    }

    const data = {
        content,
        editedAt: new Date().toISOString()
    };

    localStorage.setItem('blog_introduction', JSON.stringify(data));
    alert('✅ Introducción actualizada');
}

// ===================== NAVEGACIÓN TABS =====================
function switchTab(tabName) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.classList.add('active');
}

// ===================== EDITOR ENRIQUECIDO =====================
function insertFormat(format) {
    document.execCommand(format);
    document.getElementById('contentEditor').focus();
}

function changeTextColor() {
    const color = prompt('Ingresa el color (ej: #FF0000 o red):');
    if (color) {
        document.execCommand('foreColor', false, color);
    }
    document.getElementById('contentEditor').focus();
}

function insertLink() {
    const url = prompt('URL del enlace:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function insertImage() {
    const url = prompt('URL de la imagen:');
    if (url) {
        document.execCommand('insertImage', false, url);
    }
}

function insertTable() {
    const rows = prompt('Número de filas:');
    const cols = prompt('Número de columnas:');
    if (rows && cols) {
        let html = '<table border="1" style="width: 100%; border-collapse: collapse;"><tbody>';
        for (let i = 0; i < rows; i++) {
            html += '<tr>';
            for (let j = 0; j < cols; j++) {
                html += '<td style="padding: 10px;">Celda</td>';
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        document.execCommand('insertHTML', false, html);
    }
}

function insertVideo() {
    const url = prompt('URL del video (YouTube o similar):');
    if (url) {
        let embedCode = '';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('youtu.be') ? url.split('/')[3] : url.split('v=')[1];
            embedCode = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else {
            embedCode = `<video width="100%" height="400" controls><source src="${url}" type="video/mp4"></video>`;
        }
        document.execCommand('insertHTML', false, embedCode);
    }
}

function insertAudio() {
    const url = prompt('URL del audio:');
    if (url) {
        const embedCode = `<audio style="width: 100%;" controls><source src="${url}" type="audio/mpeg">Tu navegador no soporta audio</audio>`;
        document.execCommand('insertHTML', false, embedCode);
    }
}

// ===================== LOGOUT =====================
function logout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        localStorage.removeItem('owner_password');
        window.location.href = 'index.html';
    }
}