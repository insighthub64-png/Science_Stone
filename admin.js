// ===================== ADMIN.JS MEJORADO =====================
let articles = [];
let editingId = null;

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

// ===================== CARGAR ARTÍCULOS =====================
async function loadArticles() {
    try {
        const response = await fetch('data.json');
        articles = await response.json();
    } catch (error) {
        articles = [];
    }
    
    const saved = localStorage.getItem('science_stone_articles');
    if (saved) {
        const savedArticles = JSON.parse(saved);
        articles = [...articles, ...savedArticles];
    }
    
    renderCategoriesCheckboxes();
    renderArticlesList();
}

// ===================== RENDERIZAR CHECKBOXES DE CATEGORÍAS =====================
function renderCategoriesCheckboxes() {
    const container = document.getElementById('categoriesCheckboxes');
    container.innerHTML = categories.map(cat => `
        <div class="checkbox-item">
            <input type="checkbox" id="cat_${cat.key}" value="${cat.key}" name="category">
            <label for="cat_${cat.key}">${cat.name}</label>
        </div>
    `).join('');
}

// ===================== EDITOR DE TEXTO ENRIQUECIDO =====================
function execCommand(command) {
    document.execCommand(command, false, null);
    document.getElementById('contentEditor').focus();
}

function execCommandWithValue(command, value) {
    document.execCommand(command, false, value);
    document.getElementById('contentEditor').focus();
}

function addLink() {
    const url = prompt('Ingresa la URL:');
    if (url) {
        document.execCommand('createLink', false, url);
        document.getElementById('contentEditor').focus();
    }
}

function insertQuote() {
    const quote = prompt('Ingresa la cita:');
    if (quote) {
        document.execCommand('insertHTML', false, `<blockquote style="border-left: 4px solid #FFD700; padding-left: 15px; margin: 15px 0; font-style: italic; color: #666;">"${quote}"</blockquote>`);
        document.getElementById('contentEditor').focus();
    }
}

// ===================== AGREGAR IMAGEN =====================
document.getElementById('addImageBtn')?.addEventListener('click', () => {
    const container = document.getElementById('imagesContainer');
    const newGroup = document.createElement('div');
    newGroup.className = 'image-input-group';
    newGroup.innerHTML = `
        <input type="url" class="image-url-input" placeholder="URL de imagen (https://...)">
        <input type="text" class="image-credit-input" placeholder="Crédito/Autor (obligatorio)">
        <button type="button" class="btn btn-small" onclick="removeImageInput(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(newGroup);
});

// ===================== CARGAR IMAGEN DESDE PC =====================
document.getElementById('uploadImageBtn')?.addEventListener('click', () => {
    document.getElementById('imageFileInput').click();
});

document.getElementById('imageFileInput')?.addEventListener('change', (e) => {
    const files = e.target.files;
    const container = document.getElementById('imagesContainer');
    
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const newGroup = document.createElement('div');
            newGroup.className = 'image-input-group';
            newGroup.innerHTML = `
                <input type="url" class="image-url-input" value="${event.target.result}" placeholder="URL de imagen (https://...)">
                <input type="text" class="image-credit-input" placeholder="Crédito/Autor (obligatorio)">
                <button type="button" class="btn btn-small" onclick="removeImageInput(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            container.appendChild(newGroup);
        };
        reader.readAsDataURL(file);
    }
});

function removeImageInput(btn) {
    btn.parentElement.remove();
}

// ===================== AGREGAR ENLACE EXTERNO =====================
document.getElementById('addLinkBtn')?.addEventListener('click', () => {
    const container = document.getElementById('linksContainer');
    const newGroup = document.createElement('div');
    newGroup.className = 'link-input-group';
    newGroup.innerHTML = `
        <input type="text" class="link-title-input" placeholder="Título del enlace">
        <input type="url" class="link-url-input" placeholder="URL (https://...)">
        <input type="text" class="link-description-input" placeholder="Descripción del enlace (opcional)">
        <button type="button" class="btn btn-small" onclick="removeLinkInput(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(newGroup);
});

function removeLinkInput(btn) {
    btn.parentElement.remove();
}

// ===================== GUARDAR ARTÍCULO =====================
document.getElementById('articleForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('articleId').value;
    
    const selectedCategories = [];
    document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });

    if (selectedCategories.length === 0) {
        showAlert('Por favor selecciona al menos una categoría', 'error');
        return;
    }

    const content = document.getElementById('contentEditor').innerHTML.trim();
    if (!content) {
        showAlert('Por favor escribe contenido en el artículo', 'error');
        return;
    }

    const images = [];
    const credits = [];
    document.querySelectorAll('.image-input-group').forEach(group => {
        const url = group.querySelector('.image-url-input').value.trim();
        const credit = group.querySelector('.image-credit-input').value.trim();
        if (url) {
            if (!credit) {
                showAlert('Todos los créditos de imágenes son obligatorios', 'error');
                return;
            }
            images.push(url);
            credits.push(credit);
        }
    });

    const mainImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/300x200?text=Sin+imagen';

    const videos = [];
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const videoFile = document.getElementById('videoFile').files[0];

    if (videoUrl) {
        videos.push({
            type: 'url',
            url: videoUrl
        });
    }

    if (videoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            videos.push({
                type: 'file',
                url: e.target.result
            });
        };
        reader.readAsDataURL(videoFile);
    }

    const links = [];
    document.querySelectorAll('.link-input-group').forEach(group => {
        const title = group.querySelector('.link-title-input').value.trim();
        const url = group.querySelector('.link-url-input').value.trim();
        const description = group.querySelector('.link-description-input').value.trim();
        if (title && url) {
            links.push({ title, url, description });
        }
    });

    const newArticle = {
        id: id ? parseInt(id) : Date.now(),
        title: document.getElementById('title').value,
        categories: selectedCategories,
        image: mainImage,
        images: images.length > 0 ? images : [mainImage],
        imageCredits: credits,
        date: editingId ? (articles.find(a => a.id === editingId)?.date || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
        excerpt: document.getElementById('excerpt').value,
        content: content,
        tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
        sources: document.getElementById('sources').value,
        featured: document.getElementById('featured').checked,
        videos: videos,
        links: links,
        comments: [],
        likes: 0,
        rating: 0,
        ratings: [],
        editedAt: new Date().toISOString()
    };

    if (editingId) {
        const index = articles.findIndex(a => a.id === editingId);
        if (index !== -1) {
            articles[index] = newArticle;
        }
        showAlert('✅ Artículo actualizado correctamente', 'success');
        editingId = null;
        document.getElementById('cancelBtn').style.display = 'none';
    } else {
        articles.push(newArticle);
        showAlert('✅ Artículo creado correctamente', 'success');
    }

    const savedArticles = JSON.parse(localStorage.getItem('science_stone_articles') || '[]');
    const filteredSaved = savedArticles.filter(a => a.id !== newArticle.id);
    filteredSaved.push(newArticle);
    localStorage.setItem('science_stone_articles', JSON.stringify(filteredSaved));

    resetForm();
    renderArticlesList();
});

// ===================== EDITAR ARTÍCULO =====================
function editArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    document.getElementById('articleId').value = article.id;
    document.getElementById('title').value = article.title;
    document.getElementById('excerpt').value = article.excerpt;
    document.getElementById('contentEditor').innerHTML = article.content || '';
    document.getElementById('tags').value = article.tags ? article.tags.join(', ') : '';
    document.getElementById('sources').value = article.sources || '';
    document.getElementById('featured').checked = article.featured || false;

    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.checked = article.categories && article.categories.includes(cb.value);
    });

    const imagesContainer = document.getElementById('imagesContainer');
    imagesContainer.innerHTML = '';
    
    if (article.images && article.images.length > 0) {
        article.images.forEach((img, index) => {
            const credit = article.imageCredits && article.imageCredits[index] ? article.imageCredits[index] : '';
            const group = document.createElement('div');
            group.className = 'image-input-group';
            group.innerHTML = `
                <input type="url" class="image-url-input" value="${img}" placeholder="URL de imagen">
                <input type="text" class="image-credit-input" value="${credit}" placeholder="Crédito">
                <button type="button" class="btn btn-small" onclick="removeImageInput(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            imagesContainer.appendChild(group);
        });
    } else {
        const group = document.createElement('div');
        group.className = 'image-input-group';
        group.innerHTML = `
            <input type="url" class="image-url-input" placeholder="URL de imagen (https://...)">
            <input type="text" class="image-credit-input" placeholder="Crédito/Autor (obligatorio)">
            <button type="button" class="btn btn-small" onclick="removeImageInput(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        imagesContainer.appendChild(group);
    }

    document.getElementById('videoUrl').value = '';
    document.getElementById('videoFile').value = '';
    
    if (article.videos && article.videos.length > 0) {
        const videoUrl = article.videos.find(v => v.type === 'url');
        if (videoUrl) {
            document.getElementById('videoUrl').value = videoUrl.url;
        }
    }

    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = '';
    
    if (article.links && article.links.length > 0) {
        article.links.forEach(link => {
            const group = document.createElement('div');
            group.className = 'link-input-group';
            group.innerHTML = `
                <input type="text" class="link-title-input" value="${link.title}" placeholder="Título del enlace">
                <input type="url" class="link-url-input" value="${link.url}" placeholder="URL (https://...)">
                <input type="text" class="link-description-input" value="${link.description || ''}" placeholder="Descripción (opcional)">
                <button type="button" class="btn btn-small" onclick="removeLinkInput(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            linksContainer.appendChild(group);
        });
    } else {
        const group = document.createElement('div');
        group.className = 'link-input-group';
        group.innerHTML = `
            <input type="text" class="link-title-input" placeholder="Título del enlace">
            <input type="url" class="link-url-input" placeholder="URL (https://...)">
            <input type="text" class="link-description-input" placeholder="Descripción (opcional)">
            <button type="button" class="btn btn-small" onclick="removeLinkInput(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        linksContainer.appendChild(group);
    }

    editingId = id;
    document.getElementById('cancelBtn').style.display = 'inline-block';
    document.querySelector('.admin-form-section').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('title').focus();
}

// ===================== ELIMINAR ARTÍCULO =====================
function deleteArticle(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
        articles = articles.filter(a => a.id !== id);
        
        const savedArticles = JSON.parse(localStorage.getItem('science_stone_articles') || '[]');
        const filtered = savedArticles.filter(a => a.id !== id);
        localStorage.setItem('science_stone_articles', JSON.stringify(filtered));
        
        renderArticlesList();
        showAlert('✅ Artículo eliminado correctamente', 'success');
    }
}

// ===================== RENDERIZAR LISTA DE ARTÍCULOS =====================
function renderArticlesList() {
    const container = document.getElementById('articlesList');
    const search = document.getElementById('searchArticles') ? document.getElementById('searchArticles').value.toLowerCase() : '';
    
    const filtered = articles.filter(a =>
        a.title.toLowerCase().includes(search) ||
        (a.categories && a.categories.some(cat => 
            categories.find(c => c.key === cat)?.name.toLowerCase().includes(search)
        ))
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">No hay artículos</p>';
        return;
    }

    container.innerHTML = filtered.reverse().map(article => {
        const categoryNames = article.categories ? article.categories.map(cat => {
            const catObj = categories.find(c => c.key === cat);
            return catObj ? catObj.name : cat;
        }).join(', ') : 'Sin categoría';
        
        const editedInfo = article.editedAt ? `<br><small style="color: #999;">Modificado: ${new Date(article.editedAt).toLocaleString('es-ES')}</small>` : '';
        const featuredBadge = article.featured ? '<i class="fas fa-star" style="color: #FFD700; margin-left: 8px;"></i>' : '';

        return `
            <div class="article-item">
                <div class="article-item-header">
                    <div>
                        <div class="article-item-title">${article.title} ${featuredBadge}</div>
                        <div class="article-item-date">${new Date(article.date).toLocaleDateString('es-ES')}</div>
                        ${editedInfo}
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">${categoryNames}</div>
                    </div>
                </div>
                <div class="article-item-actions">
                    <button class="btn btn-edit" onclick="editArticle(${article.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-delete" onclick="deleteArticle(${article.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===================== MOSTRAR ALERTAS =====================
function showAlert(message, type) {
    const form = document.getElementById('articleForm');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    form.parentElement.insertBefore(alert, form);

    setTimeout(() => alert.remove(), 4000);
}

// ===================== RESETEAR FORMULARIO =====================
function resetForm() {
    document.getElementById('articleForm').reset();
    document.getElementById('articleId').value = '';
    document.getElementById('contentEditor').innerHTML = '';
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
    document.getElementById('featured').checked = false;
    editingId = null;
    document.getElementById('cancelBtn').style.display = 'none';
    
    const imagesContainer = document.getElementById('imagesContainer');
    imagesContainer.innerHTML = `
        <div class="image-input-group">
            <input type="url" class="image-url-input" placeholder="URL de imagen (https://...)">
            <input type="text" class="image-credit-input" placeholder="Crédito/Autor (obligatorio)">
            <button type="button" class="btn btn-small" onclick="removeImageInput(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = `
        <div class="link-input-group">
            <input type="text" class="link-title-input" placeholder="Título del enlace">
            <input type="url" class="link-url-input" placeholder="URL (https://...)">
            <input type="text" class="link-description-input" placeholder="Descripción (opcional)">
            <button type="button" class="btn btn-small" onclick="removeLinkInput(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// ===================== CANCELAR EDICIÓN =====================
document.getElementById('cancelBtn')?.addEventListener('click', () => {
    resetForm();
});

// ===================== BUSCAR ARTÍCULOS =====================
document.getElementById('searchArticles')?.addEventListener('input', renderArticlesList);

// ===================== REFRESH BUTTON =====================
document.getElementById('refreshBtn')?.addEventListener('click', () => {
    loadArticles();
    showAlert('✅ Artículos actualizados', 'success');
});

// ===================== ESTILOS ADICIONALES PARA EDITOR =====================
const style = document.createElement('style');
style.textContent = `
    .editor-toolbar {
        display: flex;
        gap: 5px;
        background: #f5f5f5;
        padding: 10px;
        border-radius: 6px 6px 0 0;
        border: 2px solid #ddd;
        border-bottom: none;
        flex-wrap: wrap;
        align-items: center;
    }

    .editor-btn {
        width: 35px;
        height: 35px;
        padding: 0;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #333;
    }

    .editor-btn:hover {
        background: #FFD700;
        color: #000;
        border-color: #FFD700;
    }

    .separator {
        width: 1px;
        height: 25px;
        background: #ddd;
        margin: 0 5px;
    }

    .editor-select {
        padding: 6px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: 'Philosopher', sans-serif;
        background: white;
        color: #333;
        cursor: pointer;
        font-size: 12px;
    }

    .editor-select:hover {
        border-color: #FFD700;
    }

    #contentEditor {
        border: 2px solid #ddd;
        border-radius: 0 0 6px 6px;
        padding: 15px;
        min-height: 250px;
        font-family: 'Philosopher', sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        outline: none;
    }

    #contentEditor:focus {
        border-color: #FFD700;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
    }

    #contentEditor blockquote {
        border-left: 4px solid #FFD700 !important;
        padding-left: 15px !important;
        margin: 15px 0 !important;
        font-style: italic;
        color: #666;
    }

    .link-input-group {
        display: flex;
        gap: 10px;
        margin-bottom: 12px;
    }

    .link-title-input {
        flex: 1;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-family: 'Philosopher', sans-serif;
    }

    .link-url-input {
        flex: 2;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-family: 'Philosopher', sans-serif;
    }

    .link-description-input {
        flex: 1.5;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-family: 'Philosopher', sans-serif;
    }

    .link-title-input:focus,
    .link-url-input:focus,
    .link-description-input:focus {
        outline: none;
        border-color: #FFD700;
    }
`;
document.head.appendChild(style);

// ===================== INICIALIZAR =====================
loadArticles();