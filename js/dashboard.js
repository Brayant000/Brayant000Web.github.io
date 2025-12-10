class UserDashboard {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userToDelete = null;
        this.filteredUsers = [...this.users]; // Array para usuarios filtrados
        this.searchTerm = "";
        this.sortBy = "name-asc";
        this.filterBy = "all";
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.renderUsers();
        this.setupEventListeners();
        
        console.log('Dashboard inicializado. Usuarios:', this.users.length);
    }

    checkAuthentication() {
        if (!this.currentUser) {
            alert('⚠️ Debes iniciar sesión para acceder al dashboard');
            window.location.href = 'login.html';
            return;
        }
    }

    loadUserData() {
        const welcomeElement = document.getElementById('userWelcome');
        if (welcomeElement && this.currentUser) {
            welcomeElement.textContent = `Bienvenido, ${this.currentUser.name}`;
        }
        this.updateStats();
    }

    updateStats() {
        const totalUsers = this.users.length;
        const today = new Date().toDateString();
        const todayUsers = this.users.filter(user => 
            new Date(user.createdAt).toDateString() === today
        ).length;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('todayUsers').textContent = todayUsers;
    }

    renderUsers() {
        const usersList = document.getElementById('usersList');
        
        if (!usersList) return;

        usersList.innerHTML = '';

        if (this.users.length === 0) {
            usersList.innerHTML = `
                <div class="no-users">
                    <h3>📭 No hay usuarios registrados</h3>
                    <p>Registra el primer usuario desde la página de registro</p>
                    <a href="index.html" class="btn btn-primary" style="width: auto; display: inline-block; margin-top: 10px;">
                        Ir al Registro
                    </a>
                </div>
            `;
            return;
        }

        this.users.forEach(user => {
            const userCard = this.createUserCard(user);
            usersList.appendChild(userCard);
        });
    }

    createUserCard(user) {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <h3>👤 ${user.name}</h3>
            <p><strong>📧 Email:</strong> ${user.email}</p>
            <p><strong>📞 Teléfono:</strong> ${user.phone || 'No especificado'}</p>
            <p><strong>🆔 ID:</strong> ${user.id}</p>
            <p><strong>📅 Registrado:</strong> ${this.formatDate(user.createdAt)}</p>
            <p><strong>✏️ Actualizado:</strong> ${this.formatDate(user.updatedAt)}</p>
            
            <div class="user-actions">
                <button class="btn-edit" data-id="${user.id}">
                    ✏️ Editar
                </button>
                <button class="btn-delete" data-id="${user.id}">
                    🗑️ Eliminar
                </button>
            </div>
        `;
        return card;
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                // AuthSystem.logout(); // Si tienes una clase AuthSystem
                localStorage.removeItem('currentUser'); 
                window.location.href = 'login.html';
            }
        });

        // Refresh
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.users = JSON.parse(localStorage.getItem('users')) || [];
            this.renderUsers();
            this.updateStats();
            this.showToast('✅ Lista actualizada');
        });

        // Event delegation para botones de editar/eliminar
        document.getElementById('usersList').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-edit')) {
                this.editUser(e.target.dataset.id);
            }
            if (e.target.classList.contains('btn-delete')) {
                this.deleteUser(e.target.dataset.id); // Llama al nuevo método
            }
        });
        
        // Modal de Edición events
        document.getElementById('editUserForm').addEventListener('submit', (e) => this.handleEditSubmit(e));
        document.getElementById('cancelEdit').addEventListener('click', () => this.hideEditModal());
        document.querySelector('.close-modal').addEventListener('click', () => this.hideEditModal());
        
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.hideEditModal();
            }
        });

        // Modal de Eliminación events (NUEVOS)
        document.getElementById('confirmDelete').addEventListener('click', () => this.confirmDelete());
        document.getElementById('cancelDelete').addEventListener('click', () => this.hideDeleteModal());
        document.querySelector('.close-delete-modal').addEventListener('click', () => this.hideDeleteModal());
        
        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteModal') {
                this.hideDeleteModal();
            }
        });
    }

    // --- MÉTODOS DE EDICIÓN (UPDATE) ---

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserPhone').value = user.phone || '';

            this.showEditModal();
        }
    }

    showEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => {
                document.getElementById('editUserName').focus();
            }, 100);
        }
    }

    hideEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.getElementById('editUserForm').reset();
    }

    handleEditSubmit(e) {
        e.preventDefault();

        const userId = document.getElementById('editUserId').value;
        const userData = {
            name: document.getElementById('editUserName').value.trim(),
            email: document.getElementById('editUserEmail').value.trim().toLowerCase(),
            phone: document.getElementById('editUserPhone').value.trim(),
            updatedAt: new Date().toISOString()
        };

        if (this.validateEditData(userId, userData)) {
            this.updateUser(userId, userData);
        }
    }

    validateEditData(userId, userData) {
        if (!userData.name || !userData.email) {
            alert('❌ Nombre y email son campos obligatorios');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            alert('❌ Por favor ingresa un email válido');
            return false;
        }

        const existingUser = this.users.find(user => 
            user.email === userData.email && user.id !== userId
        );
        
        if (existingUser) {
            alert('❌ El email ya está registrado por otro usuario');
            return false;
        }
        return true;
    }

    updateUser(userId, userData) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = {
                ...this.users[userIndex],
                ...userData
            };
            
            localStorage.setItem('users', JSON.stringify(this.users));
            this.hideEditModal();
            this.renderUsers();
            this.updateStats();
            this.showToast('✅ Usuario actualizado exitosamente!');
        }
    }

    // --- MÉTODOS DE ELIMINACIÓN (DELETE) ---

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.userToDelete = userId;
            this.showDeleteModal(user);
        }
    }

    showDeleteModal(user) {
        // Actualizar mensaje y información del usuario
        document.getElementById('deleteMessage').textContent = 
            `¿Estás seguro de que quieres eliminar permanentemente a "${user.name}"?`;
        
        // Mostrar preview del usuario
        document.getElementById('userPreview').innerHTML = `
            <h4>👤 ${user.name}</h4>
            <p><strong>📧 Email:</strong> ${user.email}</p>
            <p><strong>📞 Teléfono:</strong> ${user.phone || 'No especificado'}</p>
            <p><strong>📅 Registrado:</strong> ${this.formatDate(user.createdAt)}</p>
            <p class="text-danger"><strong>⚠️ Esta acción no se puede deshacer</strong></p>
        `;
        
        document.getElementById('deleteModal').style.display = 'block';
    }

    hideDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        this.userToDelete = null;
    }

    confirmDelete() {
        if (this.userToDelete) {
            const userIndex = this.users.findIndex(user => user.id === this.userToDelete);
            
            if (userIndex !== -1) {
                const deletedUser = this.users[userIndex];
                
                // Eliminar usuario
                this.users.splice(userIndex, 1);
                localStorage.setItem('users', JSON.stringify(this.users));
                
                this.hideDeleteModal();
                this.renderUsers();
                this.updateStats();
                this.showToast('✅ Usuario eliminado exitosamente!');
                
                console.log('Usuario eliminado:', deletedUser);
                
                // Lógica de cerrar sesión si el usuario se elimina a sí mismo
                if (this.currentUser && this.currentUser.id === this.userToDelete) {
                    setTimeout(() => {
                        alert('Has eliminado tu propia cuenta. Serás redirigido al login.');
                        // AuthSystem.logout(); // Si tienes una clase AuthSystem
                        localStorage.removeItem('currentUser'); 
                        window.location.href = 'login.html';
                    }, 1000);
                }
            }
        }
    }

    // --- MÉTODO DE FEEDBACK ---

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1000;
            font-weight: 500;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Inicialización de la Aplicación
document.addEventListener('DOMContentLoaded', () => {
    new UserDashboard(); 
});