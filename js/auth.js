class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.init();
    }

    init() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        this.checkAuthStatus();
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        const user = this.authenticateUser(email, password);
        
        if (user) {
            this.setCurrentUser(user);
            this.showMessage('✅ ¡Login exitoso! Redirigiendo...', 'success');
            
            // Redirigir después de 1 segundo
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            this.showMessage('❌ Credenciales incorrectas. Intenta nuevamente.', 'error');
        }
    }

    authenticateUser(email, password) {
        // En una aplicación real, esto se conectaría con un backend seguro
        // Por ahora, simulamos autenticación básica
        const user = this.users.find(user => user.email === email);
        
        if (user) {
            // Simulamos verificación de contraseña
            // En producción, esto debería ser con hash
            return user;
        }
        return null;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Usuario autenticado:', user);
    }

    checkAuthStatus() {
        // Si ya está autenticado y está en login, redirigir a dashboard
        if (this.currentUser && window.location.pathname.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('loginMessage');
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }

    // Método estático para logout
    static logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Inicializar sistema de autenticación
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});