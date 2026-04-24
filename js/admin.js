// ==========================================
// ADMIN PANEL
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    initAdminPanel();
    loadEnquiries();
    loadMembers();
    loadAttendance();
});

// ==========================================
// AUTH CHECK
// ==========================================
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!isLoggedIn || !currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// ==========================================
// INIT ADMIN PANEL
// ==========================================
function initAdminPanel() {
    initNavigation();
    initLogout();
    updateStats();
    
    // Check for new enquiries periodically
    setInterval(() => {
        loadEnquiries();
    }, 5000);
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-section]');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.admin-sidebar');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const sectionId = item.dataset.section + '-section';
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId)?.classList.add('active');

            sidebar.classList.remove('active');
        });
    });

    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// ==========================================
// LOGOUT
// ==========================================
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (confirm('Logout from admin panel?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    });
}

// ==========================================
// STATS
// ==========================================
function updateStats() {
    const members = getAllMembers();
    const enquiries = getEnquiries();
    const payments = getPayments();
    
    const totalRevenue = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (parseInt(p.price) || 0), 0);
    
    const activeCount = members.filter(m => {
        if (!m.plan || !m.plan.expiryDate) return false;
        return new Date(m.plan.expiryDate) > new Date();
    }).length;

    document.getElementById('totalMembers').textContent = members.length;
    document.getElementById('activeMembers').textContent = activeCount;
    document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toLocaleString();
    document.getElementById('newEnquiries').textContent = enquiries.length;
    document.getElementById('enquiryBadge').textContent = enquiries.length;

    // Update plan stats
    const planCounts = { basic: 0, pro: 0, premium: 0, none: 0 };
    members.forEach(m => {
        if (!m.plan) planCounts.none++;
        else planCounts[m.plan.type] = (planCounts[m.plan.type] || 0) + 1;
    });

    document.getElementById('basicCount').textContent = planCounts.basic;
    document.getElementById('proCount').textContent = planCounts.pro;
    document.getElementById('premiumCount').textContent = planCounts.premium;
    document.getElementById('noPlanCount').textContent = planCounts.none;
}

// ==========================================
// GET ALL MEMBERS
// ==========================================
function getAllMembers() {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    return registeredUsers;
}

// ==========================================
// ENQUIRIES
// ==========================================
let lastEnquiryCount = -1;

function getEnquiries() {
    return JSON.parse(localStorage.getItem('enquiries')) || [];
}

function loadEnquiries() {
    const enquiries = getEnquiries();
    const table = document.getElementById('enquiriesTable');
    
    // Notification for new enquiries
    if (lastEnquiryCount !== -1 && enquiries.length > lastEnquiryCount) {
        showNotification(`New Trial Booking: ${enquiries[0].name}`, 'success');
        // Play notification sound (optional)
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play();
        } catch (e) {}
    }
    lastEnquiryCount = enquiries.length;

    if (enquiries.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="empty">No enquiries yet</td></tr>';
        return;
    }

    table.innerHTML = enquiries.map((enquiry, index) => `
        <tr>
            <td>${formatDate(enquiry.date)}</td>
            <td>${enquiry.name || '-'}</td>
            <td>${enquiry.phone || '-'}</td>
            <td>${enquiry.email || '-'}</td>
            <td>${enquiry.interest || '-'}</td>
            <td>${enquiry.message || '-'}</td>
            <td>
                <button class="action-btn delete" onclick="deleteEnquiry(${index})">Delete</button>
            </td>
        </tr>
    `).join('');

    document.getElementById('enquiryBadge').textContent = enquiries.length;
    document.getElementById('newEnquiries').textContent = enquiries.length;
}

function deleteEnquiry(index) {
    if (confirm('Delete this enquiry?')) {
        const enquiries = getEnquiries();
        enquiries.splice(index, 1);
        localStorage.setItem('enquiries', JSON.stringify(enquiries));
        loadEnquiries();
        showNotification('Enquiry deleted', 'success');
    }
}

// ==========================================
// MEMBERS TABLE
// ==========================================
function loadMembers() {
    const members = getAllMembers();
    const table = document.getElementById('membersTable');
    const searchInput = document.getElementById('searchMember');
    const filterSelect = document.getElementById('filterStatus');

    function renderMembers() {
        let filtered = [...members];
        
        // Search
        const search = searchInput?.value.toLowerCase();
        if (search) {
            filtered = filtered.filter(m => 
                (m.fullName || '').toLowerCase().includes(search) ||
                (m.email || '').toLowerCase().includes(search)
            );
        }

        // Filter by status
        const status = filterSelect?.value;
        if (status && status !== 'all') {
            filtered = filtered.filter(m => {
                const isActive = m.plan && new Date(m.plan.expiryDate) > new Date();
                return status === 'active' ? isActive : !isActive;
            });
        }

        if (filtered.length === 0) {
            table.innerHTML = '<tr><td colspan="7" class="empty">No members found</td></tr>';
            return;
        }

        table.innerHTML = filtered.map(member => {
            const isActive = member.plan && new Date(member.plan.expiryDate) > new Date();
            const planName = member.plan ? formatPlanType(member.plan.type) : 'None';
            
            return `
                <tr>
                    <td>${member.fullName || '-'}</td>
                    <td>${member.email || '-'}</td>
                    <td>${member.phone || '-'}</td>
                    <td>${planName}</td>
                    <td>${member.plan ? formatDate(member.plan.expiryDate) : '-'}</td>
                    <td><span class="status-badge ${isActive ? 'active' : 'expired'}">${isActive ? 'Active' : 'Expired'}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="editMember('${member.email}')">Edit</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    searchInput?.addEventListener('input', renderMembers);
    filterSelect?.addEventListener('change', renderMembers);
    renderMembers();
}

function editMember(email) {
    const members = getAllMembers();
    const member = members.find(m => m.email === email);
    if (member) {
        const newPlan = prompt('Enter new plan (basic/pro/premium) or leave empty:');
        if (newPlan && ['basic', 'pro', 'premium'].includes(newPlan.toLowerCase())) {
            member.plan = member.plan || {};
            member.plan.type = newPlan.toLowerCase();
            member.plan.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            
            const updated = members.map(m => m.email === email ? member : m);
            localStorage.setItem('registeredUsers', JSON.stringify(updated));
            
            loadMembers();
            updateStats();
            showNotification('Member updated!', 'success');
        }
    }
}

// ==========================================
// PAYMENTS
// ==========================================
function getPayments() {
    const members = getAllMembers();
    const payments = [];
    
    members.forEach(m => {
        if (m.plan) {
            payments.push({
                name: m.fullName,
                email: m.email,
                plan: m.plan.type,
                price: m.plan.price,
                method: m.plan.paymentMethod,
                expiryDate: m.plan.expiryDate,
                status: new Date(m.plan.expiryDate) > new Date() ? 'paid' : 'expired'
            });
        }
    });

    return payments;
}

function loadPayments() {
    const payments = getPayments();
    const table = document.getElementById('paymentsTable');
    
    const paid = payments.filter(p => p.status === 'paid').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const overdue = payments.filter(p => p.status === 'expired').length;

    document.getElementById('paidCount').textContent = paid;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('overdueCount').textContent = overdue;

    if (payments.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="empty">No payment records</td></tr>';
        return;
    }

    table.innerHTML = payments.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${formatPlanType(p.plan)}</td>
            <td>₹${p.price}</td>
            <td>${p.method || '-'}</td>
            <td>${formatDate(p.expiryDate)}</td>
            <td><span class="status-badge ${p.status}">${p.status}</span></td>
            <td>
                <button class="action-btn edit">View</button>
            </td>
        </tr>
    `).join('');
}

// ==========================================
// ATTENDANCE
// ==========================================
function loadAttendance() {
    const members = getAllMembers();
    const select = document.getElementById('attendanceMember');

    // Populate member dropdown
    if (select) {
        select.innerHTML = '<option value="">Select Member</option>' + 
            members.map(m => `<option value="${m.email}">${m.fullName}</option>`).join('');
    }

    // Load today's attendance
    const today = new Date().toDateString();
    const attendance = JSON.parse(localStorage.getItem(`attendance_${today}`)) || [];
    const container = document.getElementById('todayAttendance');

    if (attendance.length === 0) {
        container.innerHTML = '<p class="empty">No attendance marked today</p>';
    } else {
        container.innerHTML = attendance.map(a => `
            <div class="attendance-item">
                <span class="name">${a.name}</span>
                <span class="time">${a.time}</span>
            </div>
        `).join('');
    }
}

    window.markAttendance = function() {
        const select = document.getElementById('attendanceMember');
        const memberEmail = select.value;

        if (!memberEmail) {
            showNotification('Select a member', 'error');
            return;
        }

        const members = getAllMembers();
        const member = members.find(m => m.email === memberEmail);

        if (member) {
            const today = new Date().toDateString();
            const attendance = JSON.parse(localStorage.getItem(`attendance_${today}`)) || [];
            
            attendance.push({
                name: member.fullName,
                email: memberEmail,
                time: new Date().toLocaleTimeString()
            });

            localStorage.setItem(`attendance_${today}`, JSON.stringify(attendance));
            loadAttendance();
            showNotification('Attendance marked!', 'success');
        }
    };


// ==========================================
// UTILITIES
// ==========================================
function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatPlanType(type) {
    const types = {
        'basic': 'Basic',
        'pro': 'Pro', 
        'premium': 'Premium',
        'fitness': 'Fitness',
        'fitness-yoga': 'Fitness + Yoga',
        'fitness-zumba': 'Fitness + Zumba'
    };
    return types[type] || type;
}

// ==========================================
// NOTIFICATION
// ==========================================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span>`;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`;
document.head.appendChild(style);

console.log('%c⚙️ Admin Panel', 'color: #FF6B35; font-size: 16px; font-weight: bold;');