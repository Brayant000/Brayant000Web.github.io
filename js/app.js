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

        // Modo oscuro
        this.setupThemeToggle();

        // Toggle de mostrar/ocultar contraseña
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
            });

            // Validación de fortaleza de contraseña en tiempo real
            passwordInput.addEventListener('input', () => {
                this.checkPasswordStrength(passwordInput.value);
            });
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.classList.add('active');
            }

            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                themeToggle.classList.toggle('active');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('passwordStrengthBar');
        const hint = document.getElementById('passwordHint');
        
        if (!strengthBar || !hint) return;

        let strength = 0;
        let message = '';

        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        strengthBar.className = 'password-strength-bar';
        
        if (password.length === 0) {
            strengthBar.className = 'password-strength-bar';
            hint.textContent = 'La contraseña debe tener al menos 6 caracteres';
        } else if (strength <= 2) {
            strengthBar.classList.add('weak');
            hint.textContent = '⚠️ Contraseña débil - Considera agregar mayúsculas, números o símbolos';
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
            hint.textContent = '⚡ Contraseña media - Casi perfecta!';
        } else {
            strengthBar.classList.add('strong');
            hint.textContent = '✅ Contraseña fuerte!';
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