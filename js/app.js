class UserRegistration {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registerUser();
            });
        }
    }

    registerUser() {
        const formData = new FormData(document.getElementById('registerForm'));
        const userData = {
            id: Date.now().toString(),
            name: formData.get('name').trim(),
            email: formData.get('email').trim().toLowerCase(),
            phone: formData.get('phone').trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.validateUser(userData)) {
            this.users.push(userData);
            localStorage.setItem('users', JSON.stringify(this.users));
            this.showMessage('🎉 Usuario registrado exitosamente!', 'success');
            document.getElementById('registerForm').reset();
            
            // Mostrar en consola de VS Code
            console.log('Nuevo usuario registrado:', userData);
        }
    }

    validateUser(userData) {
        // Validar campos obligatorios
        if (!userData.name || !userData.email) {
            this.showMessage('❌ Nombre y email son campos obligatorios', 'error');
            return false;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            this.showMessage('❌ Por favor ingresa un email válido', 'error');
            return false;
        }

        // Validar email único
        if (this.users.find(user => user.email === userData.email)) {
            this.showMessage('❌ El email ya está registrado en el sistema', 'error');
            return false;
        }

        return true;
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        
        // Auto-ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new UserRegistration();
    console.log('Sistema de registro inicializado correctamente');
});