// ===================== AUTH.JS =====================
// Verificar autenticación en páginas protegidas
function checkAuth() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('admin.html')) {
        if (!localStorage.getItem('owner_password')) {
            window.location.href = 'auth.html';
        }
    }
}

// Ejecutar verificación
checkAuth();

// Funciones de autenticación
function setAdminPassword(password) {
    localStorage.setItem('owner_password', password);
}

function getAdminPassword() {
    return localStorage.getItem('owner_password');
}

function isAdminLoggedIn() {
    return !!localStorage.getItem('owner_password');
}

function logoutAdmin() {
    localStorage.removeItem('owner_password');
    window.location.href = 'index.html';
}

// Cambiar contraseña (opcional)
function changeAdminPassword(oldPassword, newPassword) {
    const currentPassword = localStorage.getItem('owner_password');
    
    if (oldPassword !== currentPassword) {
        return { success: false, message: 'Contraseña actual incorrecta' };
    }
    
    if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }
    
    localStorage.setItem('owner_password', newPassword);
    return { success: true, message: 'Contraseña actualizada correctamente' };
}