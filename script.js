/* --- APPLICATION INITIALIZATION GUARD --- */
document.addEventListener('DOMContentLoaded', () => {
    
    /* --- NAVIGATION HAMBURGER BEHAVIOR --- */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    // Close mobile nav when clicking a menu link
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('open');
        });
    });

    /* --- SCROLLING EFFECT HEADER CLASS ADDITIONS --- */
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        detectActiveSection();
    });

    /* --- INTERACTIVE ACTIONS & TOAST FEEDBACK --- */
    const toast = document.getElementById('toast');

    function triggerToast(message) {
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Call button feedback
    const callBtn = document.getElementById('call-action-btn');
    if (callBtn) {
        callBtn.addEventListener('click', () => {
            triggerToast("Connecting with direct dispatch desk: +63 (02) 8888-MEGA");
        });
    }

    // Profile portal feedback
    const profileBtn = document.getElementById('profile-action-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            triggerToast("Loading Secure BMS Client Portal Environment...");
        });
    }

    // Form submission intercept (prevents page reloading)
    const contactForm = document.getElementById('consultationForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstNameInput = document.getElementById('firstName');
            const name = firstNameInput ? firstNameInput.value : "there";
            triggerToast(`Thank you, ${name}! Your request was successfully submitted.`);
            contactForm.reset();
        });
    }

    /* --- SMART DESKTOP & MOBILE EMAIL FORWARDING ROUTER --- */
    const emailLink = document.getElementById('smart-email-link');
    if (emailLink) {
        emailLink.addEventListener('click', (event) => {
            event.preventDefault();
            const emailAddress = "brothersms.careers@gmail.com";
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                window.location.href = "mailto:" + emailAddress;
            } else {
                window.open("https://mail.google.com/mail/?view=cm&fs=1&to=" + emailAddress, "_blank");
            }
        });
    }
});

/* --- GLOBAL SCROLL-TO FUNCTIONALITY (Kept global for inline HTML onclick hooks) --- */
function scrollToSec(id) {
    const element = document.getElementById(id);
    if (element) {
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
function detectActiveSection() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
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
<<<<<<< HEAD
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
/* --- PRODUCT CARDS INTERACTIVE LOGIC --- */
document.querySelectorAll('.product-card').forEach(card => {
    const productName = card.getAttribute('data-product');
    const featuresBtn = card.querySelector('.btn-features');
    const inquiryBtn = card.querySelector('.btn-inquiry');
    const dropdown = card.querySelector('.features-dropdown');

    // Toggle dropdown features view
    featuresBtn.addEventListener('click', () => {
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) {
            featuresBtn.textContent = "Hide Specs";
        } else {
            featuresBtn.textContent = "Features";
        }
    });

    // Handle inquiry button and auto-fill target requirement message form
    inquiryBtn.addEventListener('click', () => {
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.value = `I am interested in acquiring details regarding your corporate tier deployment options for: "${productName}". Please send structural specifications layout details.`;
            // Focus on input to highlight field instantly for the visitor
            messageField.focus();
        }
        // Seamlessly scroll user straight to booking view using existing function
        scrollToSec('contact');
        triggerToast(`Inquiry initiated for ${productName}`);
    });
});

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
=======
}
>>>>>>> a61e92495dbb9956e939b00682b5716100cd6a31
