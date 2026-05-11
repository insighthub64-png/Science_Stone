// ===================== ADMIN.JS CMS PROFESIONAL AVANZADO =====================
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
let authors = [];
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
    loadAuthors();
    initializeCategories();
    loadContactInfo();
    loadHeroInfo();
    loadIntroInfo();
    setupFormListeners();
    setupFormatSelector();
    setupContentEditor();
    updateStatistics();
    loadCommentsList();
}

// ===================== CARGAR ARTÍCULOS =====================
function loadArticles() {
    const saved = localStorage.getItem('science_stone_articles');
    if (saved) {
        articles = JSON.parse(saved);
    }
    renderArticlesList();
}

// ===================== CARGAR AUTORES =====================
function loadAuthors() {
    const saved = localStorage.getItem('science_stone_authors');
    if (saved) {
        authors = JSON.parse(saved);
    } else {
        // Crear autor predeterminado
        authors = [{
            id: Date.now(),
            name: localStorage.getItem('author_name') || 'Administrador',
            title: localStorage.getItem('author_title') || '',
            bio: localStorage.getItem('author_bio') || '',
            image: localStorage.getItem('author_image') || '',
            email: localStorage.getItem('author_email') || '',
            location: localStorage.getItem('author_location') || '',
            website: localStorage.getItem('author_website') || ''
        }];
        saveAuthors();
    }
    renderAuthorsList();
    updateAuthorSelect();
}

function renderAuthorsList() {
    const container = document.getElementById('authorsList');
    if (!container) return;
    
    if (authors.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">No hay autores registrados.</p>';
        return;
    }

    container.innerHTML = authors.map(author => `
        <div class="article-item">
            <div class="article-item-info">
                <h4>${author.name}</h4>
                <p>${author.title || 'Sin título'}</p>
                <p style="font-size: 12px; color: var(--text-light); margin-top: 5px;">${author.email}</p>
            </div>
            <div class="article-item-actions">
                <button class="btn btn-small btn-primary" onclick="editAuthor(${author.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-small btn-secondary" onclick="deleteAuthor(${author.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function updateAuthorSelect() {
    const select = document.getElementById('articleAuthor');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecciona un autor</option>' + 
        authors.map(author => `<option value="${author.id}">${author.name}</option>`).join('');
}

function editAuthor(id) {
    const author = authors.find(a => a.id === id);
    if (!author) return;

    document.getElementById('authorName').value = author.name;
    document.getElementById('authorTitle').value = author.title;
    document.getElementById('authorBio').value = author.bio;
    document.getElementById('authorImage').value = author.image;
    document.getElementById('authorEmail').value = author.email;
    document.getElementById('authorLocation').value = author.location;
    document.getElementById('authorWebsite').value = author.website;

    document.querySelector('#authorForm button[type="submit"]').innerHTML = '<i class="fas fa-check"></i> Actualizar Autor';
    document.querySelector('#authorForm button[type="submit"]').dataset.editingId = id;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteAuthor(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este autor?')) return;
    
    authors = authors.filter(a => a.id !== id);
    saveAuthors();
    renderAuthorsList();
    updateAuthorSelect();
    alert('✅ Autor eliminado');
}

function saveAuthors() {
    localStorage.setItem('science_stone_authors', JSON.stringify(authors));
}

// ===================== INICIALIZAR CATEGORÍAS =====================
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

// ===================== RENDERIZAR ARTÍCULOS =====================
function renderArticlesList() {
    const container = document.getElementById('articlesList');
    
    if (articles.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">No hay artículos publicados aún.</p>';
        return;
    }

    container.innerHTML = articles.map(article => {
        const cats = article.categories.map(cat => {
            const catObj = categories.find(c => c.key === cat);
            return catObj ? `${catObj.icon} ${catObj.name}` : cat;
        }).join(', ');
        
        const author = authors.find(a => a.id === article.authorId);
        const authorName = author ? author.name : 'Desconocido';
        
        return `
            <div class="article-item">
                <div class="article-item-info">
                    <h4>${article.title}</h4>
                    <p>👤 ${authorName} | 📅 ${new Date(article.date).toLocaleDateString('es-ES')}</p>
                    <p style="font-size: 12px; color: var(--primary-yellow); margin-top: 5px;">📑 ${cats}</p>
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
        `;
    }).join('');
}

// ===================== SETUP =====================
function setupFormatSelector() {
    document.querySelectorAll('.format-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.format-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            selectedFormat = this.dataset.format;
            document.getElementById('articleFormat').value = selectedFormat;
        });
    });
}

function setupFormListeners() {
    document.getElementById('articleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveArticle();
    });

    document.getElementById('resourceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveResource();
    });

    document.getElementById('authorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAuthor();
    });

    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveContact();
    });

    document.getElementById('heroForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveHero();
    });

    document.getElementById('introForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveIntro();
    });
}

function setupContentEditor() {
    const editor = document.getElementById('contentEditor');
    if (!editor) return;
    
    editor.addEventListener('dragover', (e) => {
        e.preventDefault();
        editor.style.background = 'rgba(255, 204, 0, 0.1)';
    });
    
    editor.addEventListener('dragleave', () => {
        editor.style.background = 'white';
    });
}

// ===================== GUARDAR ARTÍCULO =====================
function saveArticle() {
    const title = document.getElementById('title').value.trim();
    const excerpt = document.getElementById('excerpt').value.trim();
    const content = document.getElementById('contentEditor').innerHTML;
    const image = document.getElementById('imageUrl').value.trim();
    const imageCredit = document.getElementById('imageCredit').value.trim();
    const tags = document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t);
    const sources = document.getElementById('sources').value.trim();
    const featured = document.getElementById('featured').checked;
    const format = document.getElementById('articleFormat').value;
    const relatedArticles = JSON.parse(document.getElementById('relatedArticles').value || '[]');
    const authorId = parseInt(document.getElementById('articleAuthor').value);

    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(cb => cb.value);

    if (!title || !excerpt || selectedCategories.length === 0 || !authorId) {
        alert('❗ Por favor completa los campos obligatorios');
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
            relatedArticles,
            authorId,
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
            relatedArticles,
            authorId,
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
    document.getElementById('relatedArticles').value = JSON.stringify(article.relatedArticles || []);
    document.getElementById('articleAuthor').value = article.authorId || '';

    const format = article.format || 'standard';
    document.getElementById('articleFormat').value = format;

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
}

// ===================== RECURSOS =====================
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

// ===================== AUTORES =====================
function saveAuthor() {
    const name = document.getElementById('authorName').value.trim();
    const title = document.getElementById('authorTitle').value.trim();
    const bio = document.getElementById('authorBio').value.trim();
    const image = document.getElementById('authorImage').value.trim();
    const email = document.getElementById('authorEmail').value.trim();
    const location = document.getElementById('authorLocation').value.trim();
    const website = document.getElementById('authorWebsite').value.trim();

    if (!name) {
        alert('El nombre es obligatorio');
        return;
    }

    const submitBtn = document.querySelector('#authorForm button[type="submit"]');
    const editingId = submitBtn.dataset.editingId;

    if (editingId) {
        const index = authors.findIndex(a => a.id == editingId);
        authors[index] = {
            ...authors[index],
            name, title, bio, image, email, location, website
        };
        delete submitBtn.dataset.editingId;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Autor';
        alert('✅ Autor actualizado');
    } else {
        authors.push({
            id: Date.now(),
            name, title, bio, image, email, location, website
        });
        alert('✅ Autor agregado');
    }

    saveAuthors();
    document.getElementById('authorForm').reset();
    renderAuthorsList();
    updateAuthorSelect();
}

// ===================== CONTACTO =====================
function loadContactInfo() {
    document.getElementById('contactEmail').value = localStorage.getItem('contact_email') || 'insight.hub64@gmail.com';
    document.getElementById('contactPhone').value = localStorage.getItem('contact_phone') || '';
    document.getElementById('contactAddress').value = localStorage.getItem('contact_address') || '';
    document.getElementById('contactCity').value = localStorage.getItem('contact_city') || '';
    document.getElementById('contactCountry').value = localStorage.getItem('contact_country') || '';
}

function saveContact() {
    localStorage.setItem('contact_email', document.getElementById('contactEmail').value);
    localStorage.setItem('contact_phone', document.getElementById('contactPhone').value);
    localStorage.setItem('contact_address', document.getElementById('contactAddress').value);
    localStorage.setItem('contact_city', document.getElementById('contactCity').value);
    localStorage.setItem('contact_country', document.getElementById('contactCountry').value);
    alert('✅ Información de contacto actualizada');
}

// ===================== HERO =====================
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
    }
    localStorage.setItem('hero_color1', color1);
    localStorage.setItem('hero_color2', color2);
    localStorage.setItem('hero_gradient', `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`);

    alert('✅ Sección Hero actualizada');
}

// ===================== INTRODUCCIÓN =====================
function loadIntroInfo() {
    const saved = localStorage.getItem('blog_introduction');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('introContent').value = data.content;
        document.getElementById('introFont').value = data.font || 'Arial';
        document.getElementById('introSize').value = data.size || '16';
    }
}

function saveIntro() {
    const content = document.getElementById('introContent').value.trim();
    const font = document.getElementById('introFont').value;
    const size = document.getElementById('introSize').value;
    
    if (!content) {
        alert('Por favor escribe la introducción');
        return;
    }

    const data = {
        content,
        font,
        size,
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

// ===================== EDITOR DE TEXTO =====================
function alignText(alignment) {
    const alignMap = {
        'left': 'justifyLeft',
        'center': 'justifyCenter',
        'right': 'justifyRight',
        'justify': 'justifyFull'
    };
    document.execCommand(alignMap[alignment]);
    document.getElementById('contentEditor').focus();
}

function insertFormat(format) {
    document.execCommand(format);
    document.getElementById('contentEditor').focus();
}

function changeFontFamily(font) {
    if (font) document.execCommand('fontName', false, font);
    document.getElementById('contentEditor').focus();
}

function changeFontSize(size) {
    if (size) document.execCommand('fontSize', false, size);
    document.getElementById('contentEditor').focus();
}

function setLineHeight(height) {
    const editor = document.getElementById('contentEditor');
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.lineHeight = height;
        range.surroundContents(span);
    }
    editor.focus();
}

function indent() {
    document.execCommand('indent');
    document.getElementById('contentEditor').focus();
}

function outdent() {
    document.execCommand('outdent');
    document.getElementById('contentEditor').focus();
}

function insertTextBox() {
    const text = prompt('Escribe el texto del cuadro:');
    if (text) {
        const box = `<div style="border: 2px solid var(--primary-yellow); padding: 15px; border-radius: 8px; background: rgba(255, 204, 0, 0.05); margin: 15px 0;">${text}</div>`;
        document.execCommand('insertHTML', false, box);
    }
}

function openColorPalette() {
    const palette = document.getElementById('colorPalette');
    palette.style.display = palette.style.display === 'none' ? 'block' : 'none';
}

function openHighlightPalette() {
    const palette = document.getElementById('highlightPalette');
    palette.style.display = palette.style.display === 'none' ? 'block' : 'none';
}

function applyColor(color) {
    document.execCommand('foreColor', false, color);
    document.getElementById('colorPalette').style.display = 'none';
    document.getElementById('contentEditor').focus();
}

function applyHighlight(color) {
    document.execCommand('backColor', false, color);
    document.getElementById('highlightPalette').style.display = 'none';
    document.getElementById('contentEditor').focus();
}

function insertLink() {
    const url = prompt('URL del enlace:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function insertImageDialog() {
    const response = prompt('Selecciona: 1 para URL, 2 para subir archivo');
    if (response === '1') {
        const url = prompt('URL de la imagen:');
        if (url) {
            const img = `<img src="${url}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px 0; display: block; cursor: move;" alt="Imagen" draggable="true">`;
            document.execCommand('insertHTML', false, img);
        }
    } else {
        uploadImage();
    }
}

function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = `<img src="${event.target.result}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px 0; display: block; cursor: move;" alt="Imagen" draggable="true">`;
                document.execCommand('insertHTML', false, img);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function insertVideoDialog() {
    const response = prompt('Selecciona: 1 para URL, 2 para subir archivo');
    if (response === '1') {
        const url = prompt('URL del video (YouTube o similar):');
        if (url) {
            let embedCode = '';
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.includes('youtu.be') ? url.split('/')[3] : url.split('v=')[1];
                embedCode = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="border-radius: 8px; margin: 15px 0; display: block; cursor: move;" draggable="true"></iframe>`;
            } else {
                embedCode = `<video width="100%" height="400" controls style="border-radius: 8px; margin: 15px 0; display: block; cursor: move;" draggable="true"><source src="${url}" type="video/mp4"></video>`;
            }
            document.execCommand('insertHTML', false, embedCode);
        }
    } else {
        uploadVideo();
    }
}

function uploadVideo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const vid = `<video width="100%" height="400" controls style="border-radius: 8px; margin: 15px 0; display: block; cursor: move;" draggable="true"><source src="${event.target.result}" type="video/mp4"></video>`;
                document.execCommand('insertHTML', false, vid);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function insertAudioDialog() {
    const response = prompt('Selecciona: 1 para URL, 2 para subir archivo');
    if (response === '1') {
        const url = prompt('URL del audio:');
        if (url) {
            const embedCode = `<audio style="width: 100%; margin: 15px 0; display: block; cursor: move;" controls draggable="true"><source src="${url}" type="audio/mpeg">Tu navegador no soporta audio</audio>`;
            document.execCommand('insertHTML', false, embedCode);
        }
    } else {
        uploadAudio();
    }
}

function uploadAudio() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const aud = `<audio style="width: 100%; margin: 15px 0; display: block; cursor: move;" controls draggable="true"><source src="${event.target.result}" type="audio/mpeg">Tu navegador no soporta audio</audio>`;
                document.execCommand('insertHTML', false, aud);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function insertTable() {
    const rows = prompt('Número de filas:');
    const cols = prompt('Número de columnas:');
    if (rows && cols) {
        let html = '<table border="1" style="width: 100%; border-collapse: collapse; margin: 15px 0; cursor: move;" draggable="true"><tbody>';
        for (let i = 0; i < rows; i++) {
            html += '<tr>';
            for (let j = 0; j < cols; j++) {
                html += '<td style="padding: 10px; border: 1px solid #ddd;">Celda</td>';
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        document.execCommand('insertHTML', false, html);
    }
}

function previewArticle() {
    const title = document.getElementById('title').value;
    const excerpt = document.getElementById('excerpt').value;
    const content = document.getElementById('contentEditor').innerHTML;
    const image = document.getElementById('imageUrl').value;

    const authorId = document.getElementById('articleAuthor').value;
    const author = authors.find(a => a.id == authorId);
    const authorName = author ? author.name : 'Desconocido';

    const html = `
        <div style="max-width: 900px;">
            <img src="${image || 'https://via.placeholder.com/900x500'}" style="width: 100%; border-radius: 8px; margin-bottom: 30px;">
            <h1 style="font-family: Georgia; font-size: 40px; margin-bottom: 10px;">${title}</h1>
            <p style="font-size: 14px; color: #666; margin-bottom: 30px;">Por ${authorName}</p>
            <div style="font-size: 16px; line-height: 1.8; color: #333;">${content}</div>
        </div>
    `;

    document.getElementById('previewContent').innerHTML = html;
    document.getElementById('previewModal').classList.add('active');
}

function closePreview() {
    document.getElementById('previewModal').classList.remove('active');
}

function selectRelatedArticles() {
    const availableArticles = articles.filter(a => a.id !== currentEditingId);
    if (availableArticles.length === 0) {
        alert('No hay otros artículos disponibles');
        return;
    }
    
    let html = '<div style="max-height: 400px; overflow-y: auto;">';
    availableArticles.forEach(article => {
        html += `
            <label style="display: block; padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">
                <input type="checkbox" value="${article.id}" class="related-article-checkbox">
                <span>${article.title}</span>
            </label>
        `;
    });
    html += '</div>';
    
    const modalHtml = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; width: 90%;">
                <h3 style="margin-top: 0;">Seleccionar Artículos Relacionados</h3>
                ${html}
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button onclick="saveRelatedArticles()" class="btn btn-primary" style="flex: 1;">Guardar</button>
                    <button onclick="closeRelatedModal()" class="btn btn-secondary" style="flex: 1;">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function saveRelatedArticles() {
    const selected = Array.from(document.querySelectorAll('.related-article-checkbox:checked'))
        .map(cb => parseInt(cb.value));
    document.getElementById('relatedArticles').value = JSON.stringify(selected);
    closeRelatedModal();
}

function closeRelatedModal() {
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) modal.remove();
}

// ===================== ESTADÍSTICAS =====================
function updateStatistics() {
    document.getElementById('statsArticles').textContent = articles.length;
    
    const resources = JSON.parse(localStorage.getItem('science_stone_resources') || '[]');
    document.getElementById('statsResources').textContent = resources.length;
    
    let totalLikes = 0;
    let totalComments = 0;
    articles.forEach(article => {
        totalLikes += parseInt(localStorage.getItem(`likes_${article.id}`) || '0');
        const comments = JSON.parse(localStorage.getItem(`comments_${article.id}`) || '[]');
        totalComments += comments.length;
    });
    
    document.getElementById('statsLikes').textContent = totalLikes;
    document.getElementById('statsComments').textContent = totalComments;
    
    const subscribers = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
    document.getElementById('statsSubscribers').textContent = subscribers.length;
    
    const subscribersList = document.getElementById('subscribersList');
    if (subscribersList) {
        subscribersList.innerHTML = subscribers.length > 0 
            ? subscribers.map(email => `<div style="padding: 8px; border-bottom: 1px solid white;">📧 ${email}</div>`).join('')
            : '<p style="text-align: center; color: white;">No hay suscriptores aún</p>';
    }
}

// ===================== COMENTARIOS =====================
function loadCommentsList() {
    const articlesComments = document.getElementById('articlesCommentsList');
    const contactMessages = document.getElementById('contactMessagesList');
    
    if (!articlesComments || !contactMessages) return;

    let allComments = [];
    articles.forEach(article => {
        const comments = JSON.parse(localStorage.getItem(`comments_${article.id}`) || '[]');
        comments.forEach(comment => {
            allComments.push({
                articleTitle: article.title,
                ...comment
            });
        });
    });

    articlesComments.innerHTML = allComments.length > 0
        ? allComments.map(c => `
            <div class="comment-item">
                <p style="font-weight: 600; color: var(--primary-yellow);">${c.articleTitle}</p>
                <p style="margin: 5px 0;"><strong>${c.name}:</strong> ${c.text}</p>
                <p style="font-size: 11px; color: #999; margin: 5px 0;">${new Date(c.date).toLocaleString('es-ES')}</p>
            </div>
        `).join('')
        : '<p style="text-align: center; color: #999;">No hay comentarios aún</p>';

    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    contactMessages.innerHTML = messages.length > 0
        ? messages.map(m => `
            <div class="comment-item">
                <p style="font-weight: 600;">De: ${m.email}</p>
                <p style="margin: 5px 0;"><strong>${m.subject}:</strong> ${m.message}</p>
                <p style="font-size: 11px; color: #999; margin: 5px 0;">${new Date(m.date).toLocaleString('es-ES')}</p>
            </div>
        `).join('')
        : '<p style="text-align: center; color: #999;">No hay mensajes de contacto</p>';
}

// ===================== LOGOUT =====================
function logout() {
    if (confirm('��Deseas cerrar sesión?')) {
        localStorage.removeItem('owner_password');
        window.location.href = 'index.html';
    }
}
