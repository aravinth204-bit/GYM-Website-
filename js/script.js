// ==========================================
// FITZONE GYM - JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initPricingTabs();
    initContactForm();
    initSmoothScroll();
});

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .pricing-card, .trainer-card, .testimonial-card, .gallery-item').forEach(el => {
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .service-card, .pricing-card, .trainer-card, .testimonial-card, .gallery-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        .service-card.animate, .pricing-card.animate, .trainer-card.animate, .testimonial-card.animate, .gallery-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// PRICING TABS
// ==========================================
function initPricingTabs() {
    const tabs = document.querySelectorAll('.pricing-tab');
    const prices = {
        monthly: { basic: '₹1,800', pro: '₹2,200', premium: '₹5,000' },
        quarterly: { basic: '₹3,300', pro: '₹4,500', premium: '₹12,000' },
        yearly: { basic: '₹7,500', pro: '₹15,000', premium: '₹45,000' }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const duration = tab.dataset.duration;
            const durationText = duration === 'monthly' ? '/month' : duration === 'quarterly' ? '/quarter' : '/year';

            document.querySelectorAll('.pricing-card').forEach(card => {
                const priceAmount = card.querySelector('.price-amount');
                const cardTitle = card.querySelector('.pricing-header h3').textContent.toLowerCase();
                let plan = 'basic';

                if (cardTitle.includes('pro')) plan = 'pro';
                else if (cardTitle.includes('premium')) plan = 'premium';

                priceAmount.textContent = prices[duration][plan];
                card.querySelector('.price-period').textContent = durationText;
            });
        });
    });
}

// ==========================================
// CONTACT FORM
// ==========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const phone = document.getElementById('contactPhone').value;
            const email = document.getElementById('contactEmail').value;
            const interest = document.getElementById('contactInterest').value;
            const message = document.getElementById('contactMessage').value;

            if (!name || !phone || !email || !interest) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            if (!validatePhone(phone)) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Save enquiry to localStorage
            const enquiry = {
                name: name,
                phone: phone,
                email: email,
                interest: interest,
                message: message,
                date: new Date().toISOString(),
                status: 'new'
            };

            const enquiries = JSON.parse(localStorage.getItem('enquiries')) || [];
            enquiries.unshift(enquiry);
            localStorage.setItem('enquiries', JSON.stringify(enquiries));

            showNotification('Thank you! We will contact you soon.', 'success');
            form.reset();
        });
    }
}

function validatePhone(phone) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// NOTIFICATION SYSTEM
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
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==========================================
// GALLERY HOVER EFFECT
// ==========================================
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.overflow = 'hidden';
    });
});

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
function animateStats() {
    const stats = document.querySelectorAll('.hero-stat .stat-number, .about-stat .stat-value');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
            }
        };

        updateCount();
    });
}

// Initialize stats animation when scrolled
const statsSection = document.querySelector('.hero');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// ==========================================
// PARALLAX EFFECT (OPTIONAL)
// ==========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }
});

// ==========================================
// PRELOADER (OPTIONAL)
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

console.log('%c🏋️ FitZone Gym', 'color: #FF6B35; font-size: 24px; font-weight: bold;');
console.log('%cPremium Fitness Center - Tamil Nadu', 'color: #fff; font-size: 14px;');