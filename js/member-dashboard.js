// ==========================================
// MEMBER DASHBOARD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initDashboard();
    initNavigation();
    initLogout();
    initPlanModal();
    initFilters();
    initDietTabs();
    initPhotoUpload();
});

// ==========================================
// AUTH CHECK
// ==========================================
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    if (currentUser.role !== 'member') {
        window.location.href = 'admin.html';
    }
}

// ==========================================
// INIT DASHBOARD
// ==========================================
function initDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const memberData = JSON.parse(localStorage.getItem(`member_${currentUser.email}`)) || {
        name: currentUser.name || 'Member',
        email: currentUser.email,
        joinDate: new Date().toISOString(),
        plan: null,
        attendance: [],
        activities: [{ text: 'Welcome to FitZone!', date: new Date().toISOString() }]
    };

    window.memberData = memberData;
    window.currentUser = currentUser;

    // Update welcome message
    document.getElementById('welcomeMessage').textContent = `Welcome, ${memberData.name}!`;
    document.getElementById('headerMemberName').textContent = memberData.name;

    // Update profile
    document.getElementById('profileName').textContent = memberData.name;
    document.getElementById('profileEmail').textContent = memberData.email;
    document.getElementById('profileJoinDate').textContent = formatDate(memberData.joinDate);

    // Update stats
    const joinDate = new Date(memberData.joinDate);
    const today = new Date();
    const daysDiff = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
    document.getElementById('membershipDays').textContent = daysDiff || 0;
    document.getElementById('attendanceCount').textContent = memberData.attendance?.length || 0;

    // Update plan
    if (memberData.plan) {
        document.getElementById('currentPlan').textContent = formatPlanType(memberData.plan.type);
        
        const expiry = new Date(memberData.plan.expiryDate);
        const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        document.getElementById('planExpiry').textContent = daysLeft > 0 ? daysLeft : 'Expired';

        updatePlanSection(memberData.plan);
        updateActivityList(memberData.activities);
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatPlanType(type) {
    const types = {
        'basic': 'Basic',
        'pro': 'Pro', 
        'premium': 'Premium'
    };
    return types[type] || type;
}

// ==========================================
// UPDATE PLAN SECTION
// ==========================================
function updatePlanSection(plan) {
    const planBody = document.getElementById('planStatusBody');
    const planDetails = document.getElementById('planDetailsContainer');
    
    const expiry = new Date(plan.expiryDate);
    const today = new Date();
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    const planHtml = `
        <div class="plan-details">
            <div class="plan-detail">
                <span>Plan Type</span>
                <strong>${formatPlanType(plan.type)}</strong>
            </div>
            <div class="plan-detail">
                <span>Price</span>
                <strong>₹${plan.price}</strong>
            </div>
            <div class="plan-detail">
                <span>Start Date</span>
                <strong>${formatDate(plan.startDate)}</strong>
            </div>
            <div class="plan-detail">
                <span>Expiry Date</span>
                <strong>${formatDate(plan.expiryDate)}</strong>
            </div>
            <div class="plan-detail">
                <span>Status</span>
                <strong style="color: ${daysLeft > 0 ? '#10b981' : '#ef4444'}">${daysLeft > 0 ? 'Active' : 'Expired'}</strong>
            </div>
        </div>
    `;

    if (planBody) planBody.innerHTML = planHtml;
    if (planDetails) planDetails.innerHTML = planHtml;
}

// ==========================================
// ACTIVITY LIST
// ==========================================
function updateActivityList(activities) {
    const list = document.getElementById('activityList');
    if (!list || !activities) return;

    list.innerHTML = activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <i class="fas fa-check-circle"></i>
            <span>${activity.text}</span>
            <small>${formatRelativeDate(activity.date)}</small>
        </div>
    `).join('');
}

function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return formatDate(dateString);
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-section]');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show section
            const sectionId = item.dataset.section + '-section';
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId)?.classList.add('active');

            // Close mobile menu
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
        
        if (confirm('Logout from dashboard?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    });
}

// ==========================================
// PLAN MODAL
// ==========================================
function initPlanModal() {
    const modal = document.getElementById('planModal');
    
    window.openPlanModal = function() {
        modal.classList.add('active');
    };

    window.closePlanModal = function() {
        modal.classList.remove('active');
    };

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closePlanModal();
    });

    // Plan selection
    document.querySelectorAll('.plan-option button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const option = e.target.closest('.plan-option');
            selectPlan(option.dataset.plan, parseInt(option.dataset.price));
        });
    });
}

function selectPlan(type, price) {
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const plan = {
        type: type,
        price: price,
        startDate: startDate.toISOString(),
        expiryDate: expiryDate.toISOString()
    };

    memberData.plan = plan;
    saveMemberData();
    
    closePlanModal();
    showNotification('Plan selected!', 'success');

    // Update UI
    document.getElementById('currentPlan').textContent = formatPlanType(type);
    document.getElementById('planExpiry').textContent = '30';
    updatePlanSection(plan);
    updateActivity([{ text: `Selected ${formatPlanType(type)} plan`, date: new Date().toISOString() }]);
}

function saveMemberData() {
    localStorage.setItem(`member_${currentUser.email}`, JSON.stringify(memberData));
}

function updateActivity(newActivities) {
    memberData.activities = [...(memberData.activities || []), ...newActivities];
    saveMemberData();
    updateActivityList(memberData.activities);
}

// ==========================================
// WORKOUT FILTERS
// ==========================================
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            
            document.querySelectorAll('.workout-card').forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ==========================================
// DIET TABS
// ==========================================
function initDietTabs() {
    const diets = {
        'weight-loss': {
            breakfast: ['Oatmeal with fruits', 'Green tea'],
            lunch: ['Grilled chicken', 'Brown rice', 'Vegetables'],
            snacks: ['Greek yogurt', 'Almonds'],
            dinner: ['Fish', 'Salad']
        },
        'muscle-gain': {
            breakfast: ['Eggs (4)', 'Bread', 'Milk'],
            lunch: ['Chicken', 'Rice', 'Curd'],
            snacks: ['Protein shake', 'Banana'],
            dinner: ['Fish', 'Pasta']
        },
        'maintenance': {
            breakfast: ['Idli', 'Sambar', 'Fruits'],
            lunch: ['Rice', 'Dal', 'Curry'],
            snacks: ['Buttermilk', 'Nuts'],
            dinner: ['Roti', 'Vegetable curry']
        }
    };

    document.querySelectorAll('.diet-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.diet-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const plan = tab.dataset.plan;
            const diet = diets[plan];

            document.getElementById('breakfastList').innerHTML = diet.breakfast.map(i => `<li>${i}</li>`).join('');
            document.getElementById('lunchList').innerHTML = diet.lunch.map(i => `<li>${i}</li>`).join('');
            document.getElementById('snacksList').innerHTML = diet.snacks.map(i => `<li>${i}</li>`).join('');
            document.getElementById('dinnerList').innerHTML = diet.dinner.map(i => `<li>${i}</li>`).join('');
        });
    });
}

// ==========================================
// NUTRITION TRACKER
// ==========================================
function saveNutrition() {
    const data = {
        calories: document.getElementById('caloriesInput').value,
        protein: document.getElementById('proteinInput').value,
        carbs: document.getElementById('carbsInput').value,
        water: document.getElementById('waterInput').value,
        date: new Date().toISOString()
    };

    memberData.nutrition = data;
    saveMemberData();
    showNotification('Nutrition saved!', 'success');
}

// ==========================================
// WEIGHT LOGGING
// ==========================================
function logWeight() {
    const input = document.getElementById('weightLogInput');
    const weight = parseFloat(input.value);

    if (!weight || weight <= 0) {
        showNotification('Enter valid weight', 'error');
        return;
    }

    if (!memberData.weightLog) memberData.weightLog = [];

    memberData.weightLog.push({ weight, date: new Date().toISOString() });
    saveMemberData();
    initProgress();
    
    input.value = '';
    showNotification('Weight logged!', 'success');
}

function initProgress() {
    const logs = memberData.weightLog || [];
    
    if (logs.length > 0) {
        document.getElementById('startWeight').textContent = logs[0].weight + ' kg';
        document.getElementById('currentWeight').textContent = logs[logs.length - 1].weight + ' kg';
        
        const change = (logs[logs.length - 1].weight - logs[0].weight).toFixed(1);
        document.getElementById('weightChange').textContent = (change > 0 ? '+' : '') + change + ' kg';
    }
}

// ==========================================
// PHOTO UPLOAD
// ==========================================
function initPhotoUpload() {
    const input = document.getElementById('photoInput');
    const gallery = document.getElementById('photoGallery');

    input?.addEventListener('change', (e) => {
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                gallery.appendChild(img);

                if (!memberData.photos) memberData.photos = [];
                memberData.photos.push(e.target.result);
                saveMemberData();
            };
            reader.readAsDataURL(file);
        });
    });
}

// ==========================================
// CLASS BOOKING
// ==========================================
function bookClass() {
    const type = document.getElementById('classType').value;
    const date = document.getElementById('classDate').value;

    if (!type || !date) {
        showNotification('Select class and date', 'error');
        return;
    }

    const classNames = {
        'morning': 'Morning Workout',
        'yoga': 'Yoga Class',
        'evening': 'Evening Workout',
        'zumba': 'Zumba'
    };

    if (!memberData.bookings) memberData.bookings = [];

    memberData.bookings.push({
        classType: classNames[type],
        date: date,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
    });

    saveMemberData();
    updateBookingsList();
    
    showNotification('Class booked!', 'success');
}

function updateBookingsList() {
    const container = document.getElementById('bookedClasses');
    const bookings = memberData.bookings || [];

    if (bookings.length === 0) {
        container.innerHTML = '<p>No classes booked yet</p>';
        return;
    }

    container.innerHTML = bookings.map(b => `
        <div class="booking-item">
            <strong>${b.classType}</strong>
            <span>${b.date}</span>
            <span class="status">${b.status}</span>
        </div>
    `).join('');
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

console.log('%c🏋️ Member Dashboard', 'color: #FF6B35; font-size: 16px; font-weight: bold;');