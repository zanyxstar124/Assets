document.addEventListener("DOMContentLoaded", () => {
   
    // ==========================================
    // 1. DYNAMIC NAVIGATION NAVBAR SCROLL
    // ==========================================
    const mainHeader = document.getElementById("main-header");
   
    function checkScroll() {
        if (!mainHeader) return;

        // Keep background solid if explicitly forced on standalone subpages
        if (mainHeader.classList.contains("scrolled") &&
            (window.location.pathname.includes("products-page.html") || window.location.pathname.includes("Clients.html"))) {
            return;
        }
       
        if (window.scrollY > 50) {
            mainHeader.classList.add("scrolled");
        } else {
            mainHeader.classList.remove("scrolled");
        }
    }
   
    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Initial load check

    // ==========================================
    // 2. MOBILE HAMBURGER MENU TOGGLE
    // ==========================================
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
           
            // Toggle accessibility attribute
            const isOpen = navMenu.classList.contains("open");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        // Close menu automatically when a link is clicked (Mobile UX)
        document.querySelectorAll(".nav-item a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
            });
        });
    }

    // ==========================================
    // 3. CROSS-PAGE AUTO-SCROLL PARAMETER MAPPING
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const scrollTarget = urlParams.get("scroll");

    if (scrollTarget) {
        // Wait briefly for elements to render completely before scanning layout dimensions
        setTimeout(() => {
            const targetElement = document.getElementById(scrollTarget);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }, 300);
    }

    // ==========================================
    // 4. UNIVERSAL MODULAR CONTROLLER FOR PRODUCT DROPDOWNS (CRASH-PROOF)
    // ==========================================
    document.querySelectorAll(".product-card").forEach(card => {
        const featureBtn = card.querySelector(".btn-features");
        const dropdown = card.querySelector(".features-dropdown");

        // CRASH-PROOF GUARDRAIL: Only execute logic if both elements exist inside this specific card
        if (featureBtn && dropdown) {
            featureBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevents grid layout events from clashing

                // Toggle local target class state
                const isOpen = dropdown.classList.toggle("open");
               
                // Dynamically update text wording to match state change
                featureBtn.textContent = isOpen ? "Hide Specs" : "Features";
            });
        }
    });

    // ==========================================
    // 5. INTERACTIVE INQUIRY REDIRECT ROUTING
    // ==========================================
    document.querySelectorAll(".btn-inquiry").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".product-card");
            const productName = card ? card.getAttribute("data-product") : "";
           
            // Locate local contact form message text box instance
            const messageInput = document.getElementById("message");

            if (messageInput) {
                // If on homepage, pre-fill text box and focus view
                messageInput.value = `I am interested in requesting an enterprise consultation regarding your product: ${productName || "Solutions Ecosystem"}. Please provide additional technical specifications.`;
                messageInput.focus();
                messageInput.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                // If on a subpage, route down cleanly using lowercase index.html bounds
                window.location.href = `index.html?scroll=contact`;
            }
        });
    });

    // ==========================================
    // 6. CONTACT CONSULTATION FORM VALIDATION & TOAST INTERACTIVES
    // ==========================================
    const consultationForm = document.getElementById("consultationForm");
    const toastBox = document.getElementById("toast");

    if (consultationForm && toastBox) {
        consultationForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Suspend default browser reload sequences

            // Show confirmation system feedback toast notice
            toastBox.textContent = "Request submitted successfully! Our tech architects will contact you within 24 hours.";
            toastBox.classList.add("show");

            // Clear input metrics securely
            consultationForm.reset();

            // Diminish tracking banner visibility automatically after time delay limits
            setTimeout(() => {
                toastBox.classList.remove("show");
            }, 4500);
        });
    }

    // ==========================================
    // 7. UNIFIED EMAIL MAPPING CONTROLLER LINK
    // ==========================================
    const businessEmail = "brothersmsc.sales@gmail.com";
    const emailSelectors = ["#smart-email-link", "#smart-footer-email-link"];

    emailSelectors.forEach(selector => {
        const emailLink = document.querySelector(selector);
        if (emailLink) {
            emailLink.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = `mailto:${businessEmail}?subject=BMS Enterprise Consultation Inquiry&body=Describe your system scaling targets here...`;
            });
        }
    });

    // ==========================================
    // 8. TOP BAR PHONE CALL ICON ANIMATION ROUTER
    // ==========================================
    const callActionBtn = document.getElementById("call-action-btn");
    if (callActionBtn) {
        callActionBtn.addEventListener("click", (e) => {
            const contactSection = document.getElementById("contact");
            
            // If the contact section exists right on the current page (Homepage)
            if (contactSection) {
                e.preventDefault();
                window.scrollToSec("contact");
            } 
            // Otherwise, let the anchor redirect cleanly to index.html?scroll=contact on subpages
        });
    }

    // ==========================================
    // 9. LIVE NAVBAR SCROLL SPY & SUBPAGE MAPPER (RED LINE TRACKER)
    // ==========================================
    const navItems = document.querySelectorAll(".nav-menu .nav-item");
    const currentPath = window.location.pathname;

    // Check if the user is on a standalone subpage file
    const isProductsPage = currentPath.includes("products-page.html");
    const isClientsPage = currentPath.includes("Clients.html");

    if (isProductsPage || isClientsPage) {
        // Subpage Execution: Lock highlight line to the explicit active tab
        navItems.forEach(item => {
            const targetSec = item.getAttribute("data-sec");
            if ((isProductsPage && targetSec === "products") || (isClientsPage && targetSec === "clients")) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    } else {
        // Homepage Execution: Scan viewport offsets dynamically via IntersectionObserver
        const sectionIds = ["home", "products", "clients", "about", "contact"];
        const sections = sectionIds.map(id => document.getElementById(sectionId = id)).filter(el => el !== null);

        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -50% 0px", // Focus area set to center of display viewport
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entries.some(e => e.isIntersecting)) { 
                    // Process only if a transition state occurs
                    if (entry.isIntersecting) {
                        const activeId = entry.target.id;
                        
                        navItems.forEach(item => {
                            if (item.getAttribute("data-sec") === activeId) {
                                item.classList.add("active");
                            } else {
                                item.classList.remove("active");
                            }
                        });
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }
});

// Native globally scoped helper macro for standard interactive click events
window.scrollToSec = function(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
};