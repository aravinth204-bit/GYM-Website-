// ==========================================
// AUTHENTICATION LOGIC
// ==========================================

console.log('Auth JS loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Ready');
    initLogin();
    initPasswordToggle();
    checkAuth();
});

// ==========================================
// LOGIN FUNCTIONALITY
// ==========================================
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    console.log('Login form:', loginForm);
    
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked;

        if (!email || !password) {
            showNotification('Please enter email and password', 'error');
            return;
        }

        // Admin Login
        if (email === 'admin@fitzone.com' && password === 'admin123') {
            const user = {
                email: email,
                name: 'Admin',
                role: 'admin',
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));

            showNotification('Admin login successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            return;
        }

        // Demo Member Login
        if (email === 'member@fitzone.com' && password === 'fitzone123') {
            const user = {
                email: email,
                name: 'Gym Member',
                role: 'member',
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));

            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            showNotification('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'member-dashboard.html';
            }, 1500);
        } else {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            const user = registeredUsers.find(u => u.email === email && u.password === password);

            if (user) {
                const currentUser = {
                    email: user.email,
                    name: user.fullName,
                    role: 'member',
                    loginTime: new Date().toISOString()
                };

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                showNotification('Login successful! Redirecting...', 'success');

                setTimeout(() => {
                    window.location.href = 'member-dashboard.html';
                }, 1500);
            } else {
                showNotification('Invalid credentials. Try: member@fitzone.com / fitzone123', 'error');
            }
        }
    });
}

// ==========================================
// PASSWORD TOGGLE
// ==========================================
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (!toggleBtn || !passwordInput) return;

    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleBtn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
    });
}

// ==========================================
// CHECK IF ALREADY LOGGED IN
// ==========================================
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.role === 'member') {
            window.location.href = 'member-dashboard.html';
        }
    }
}

// ==========================================
// NOTIFICATION
// ==========================================
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#ef4444';
        notification.style.color = 'white';
    }

    const style = document.createElement('style');
    style.textContent = `@keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }`;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

console.log('%c🔐 FitZone Gym Auth', 'color: #FF6B35; font-size: 16px; font-weight: bold;');