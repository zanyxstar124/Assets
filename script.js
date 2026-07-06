/* --- NAVIGATION HAMBURGER BEHAVIOR --- */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

// Close mobile nav when clicking a menu link
const navLinks = document.querySelectorAll('.nav-item a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
    });
});

/* --- SCROLLING EFFECT HEADER CLASS ADDITIONS --- */
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    detectActiveSection();
});

/* --- SCROLL-TO FUNCTIONALITY --- */
function scrollToSec(id) {
    const element = document.getElementById(id);
    if(element) {
        const headerOffset = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/* --- HIGHLIGHT ACTIVE SECTION BAR --- */
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

function detectActiveSection() {
    let currentActive = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            currentActive = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-sec') === currentActive) {
            item.classList.add('active');
        }
    });
}

/* --- INTERACTIVE ACTIONS & TOAST FEEDBACK --- */
const toast = document.getElementById('toast');

function triggerToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Call button feedback
document.getElementById('call-action-btn').addEventListener('click', () => {
    triggerToast("Connecting with direct dispatch desk: +63 (02) 8888-MEGA");
});

// Profile portal feedback
document.getElementById('profile-action-btn').addEventListener('click', () => {
    triggerToast("Loading Secure BMS Client Portal Environment...");
});

// Form submission intercept (prevents page reloading)
document.getElementById('consultationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('firstName').value;
    triggerToast(`Thank you, ${name}! Your request was successfully submitted.`);
    document.getElementById('consultationForm').reset();
});
