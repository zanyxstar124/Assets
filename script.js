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

    // Handle Call button scrolling based on what page the user is on
    const callBtn = document.getElementById('call-action-btn');
    if (callBtn) {
        // Only run scroll prevention on the homepage where 'contact' actually exists
        if (document.getElementById('contact')) {
            callBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Stop page jumping or reloading
                scrollToSec('contact'); 
                triggerToast("Scrolling to Contact Details & Consultation Request...");
            });
        }
    }

    // Handle Profile button fallback notice before the native href switches pages
    const profileBtn = document.getElementById('profile-action-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            triggerToast("Loading Secure BMS Employee Portal...");
        });
    }

    // Check URL parameters when a page loads (Handles auto-scroll from products page)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('scroll') === 'contact') {
        // Wait 400ms for the browser layout to cleanly render before firing the scroll
        setTimeout(() => {
            scrollToSec('contact');
        }, 400);
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
    const emailLinks = ['smart-email-link', 'smart-footer-email-link'];
    
    emailLinks.forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const emailAddress = "brothersmsc.sales@gmail.com";
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                if (isMobile) {
                    window.location.href = "mailto:" + emailAddress;
                } else {
                    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=" + emailAddress, "_blank");
                }
            });
        }
    });
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
    
    // Only parse section changes if section tracking maps exist on the active screen
    if (sections.length === 0 || navItems.length === 0) return;

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

/* --- PRODUCT CARDS INTERACTIVE LOGIC --- */
document.querySelectorAll('.product-card').forEach(card => {
    const productName = card.getAttribute('data-product');
    const featuresBtn = card.querySelector('.btn-features');
    const inquiryBtn = card.querySelector('.btn-inquiry');
    const dropdown = card.querySelector('.features-dropdown');

    // Toggle dropdown features view
    if (featuresBtn && dropdown) {
        featuresBtn.addEventListener('click', () => {
            dropdown.classList.toggle('open');
            if (dropdown.classList.contains('open')) {
                featuresBtn.textContent = "Hide Specs";
            } else {
                featuresBtn.textContent = "Features";
            }
        });
    }

    // Handle inquiry button and auto-fill target requirement message form
    if (inquiryBtn) {
        inquiryBtn.addEventListener('click', () => {
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `I am interested in acquiring details regarding your corporate tier deployment options for: "${productName}". Please send structural specifications layout details.`;
                messageField.focus();
                scrollToSec('contact');
            } else {
                // If on products-page, route to homepage and pass the inquiry text via storage
                localStorage.setItem('pendingInquiry', productName);
                window.location.href = "index.html?scroll=contact";
            }
        });
    }
});

// Auto-inject values into form if redirected from products-page inquiry
if (document.getElementById('message')) {
    const pendingInquiry = localStorage.getItem('pendingInquiry');
    if (pendingInquiry) {
        document.getElementById('message').value = `I am interested in acquiring details regarding your corporate tier deployment options for: "${pendingInquiry}". Please send structural specifications layout details.`;
        localStorage.removeItem('pendingInquiry'); // Clear storage after inserting
    }
}