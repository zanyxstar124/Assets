document.addEventListener("DOMContentLoaded", () => {
   
    // ==========================================
    // 1. DYNAMIC NAVIGATION NAVBAR SCROLL
    // ==========================================
    const mainHeader = document.getElementById("main-header");
   
    function checkScroll() {
        if (!mainHeader) return;

        // Keep background solid if explicitly forced on standalone subpages
        if (mainHeader.classList.contains("scrolled") &&
            (window.location.pathname.includes("Products") || window.location.pathname.includes("Clients"))) {
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
    // 3. SMART CROSS-PAGE & IN-PAGE HASH SCROLL CONTROLLER
    // ==========================================
    function smoothScrollToElement(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerOffset = 80; // Offset for fixed navbar height
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }

    // Handle initial page load with a hash in URL (e.g. arriving from a subpage via ../#contact)
    if (window.location.hash) {
        const cleanHash = window.location.hash.substring(1);
        setTimeout(() => {
            smoothScrollToElement(cleanHash);
        }, 200);
    }

    // Intercept clicks on links pointing to homepage sections (#about, #contact, etc.)
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            const hashIndex = href.indexOf("#");
            
            if (hashIndex !== -1) {
                const targetId = href.substring(hashIndex + 1);
                
                // Check if user is already on the homepage
                const isHomepage = window.location.pathname === "/" || 
                                   window.location.pathname.endsWith("index.html") || 
                                   window.location.pathname === "";

                if (isHomepage && targetId) {
                    e.preventDefault(); // Stop full reload / url jump
                    history.pushState(null, null, `#${targetId}`); // Update URL cleanly
                    smoothScrollToElement(targetId); // Smooth scroll instantly
                }
            }
        });
    });


    document.querySelectorAll(".product-card").forEach(card => {
        const featureBtn = card.querySelector(".btn-features");
        const dropdown = card.querySelector(".features-dropdown");
    
        // CRASH-PROOF GUARDRAIL: Only execute logic if both elements exist inside this specific card
        if (featureBtn && dropdown) {
            featureBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevents grid layout events from clashing
    
                // Close all other dropdowns in other product cards
                document.querySelectorAll(".features-dropdown.open").forEach(openDropdown => {
                    if (openDropdown !== dropdown) {
                        openDropdown.classList.remove("open");
                        const otherFeatureBtn = openDropdown.closest(".product-card").querySelector(".btn-features");
                        if (otherFeatureBtn) {
                            otherFeatureBtn.textContent = "Features";
                        }
                    }
                });
    
                // Toggle the dropdown for the current product card
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
            const inquiryMessage = `I am interested in requesting an enterprise consultation regarding your product: ${productName || "Solutions Ecosystem"}. Please provide additional technical specifications.`;

            // Locate local contact form message text box instance
            const messageInput = document.getElementById("message");

            if (messageInput) {
                // If already on the homepage, pre-fill text box and focus view
                messageInput.value = inquiryMessage;
                messageInput.focus();
                messageInput.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                // If on a subpage, save pre-fill message to session storage and step up to homepage
                sessionStorage.setItem("bms_pending_inquiry", inquiryMessage);
                window.location.href = "../#contact"; // 🚀 Fixed relative step-up path
            }
        });
    });

    // Auto-fill form if user arrived from a subpage inquiry redirect
    const pendingInquiry = sessionStorage.getItem("bms_pending_inquiry");
    const messageInput = document.getElementById("message");

    if (pendingInquiry && messageInput) {
        messageInput.value = pendingInquiry;
        sessionStorage.removeItem("bms_pending_inquiry"); // Clear after populating
    }


// ==========================================
    // 6. CONTACT CONSULTATION FORM (WEB3FORMS FETCH + HCAPTCHA)
    // ==========================================
    const consultationForm = document.getElementById("consultationForm");
    const toastBox = document.getElementById("toast");

    if (consultationForm && toastBox) {
        consultationForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Verify if hCaptcha was completed before submitting
            const hcaptchaResponse = consultationForm.querySelector('[name="h-captcha-response"]');
            if (hcaptchaResponse && !hcaptchaResponse.value) {
                toastBox.textContent = "Please complete the Captcha checkbox before submitting.";
                toastBox.classList.add("show");
                setTimeout(() => toastBox.classList.remove("show"), 3500);
                return;
            }

            const formData = new FormData(consultationForm);

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status === 200) {
                    toastBox.textContent = "Request submitted successfully! Our consultants will contact you within 24 hours.";
                    toastBox.classList.add("show");
                    consultationForm.reset();
                    
                    // 🚀 Reset hCaptcha widget after successful send
                    if (typeof hcaptcha !== "undefined") {
                        hcaptcha.reset();
                    }
                } else {
                    toastBox.textContent = json.message || "Submission failed. Please check the captcha and try again.";
                    toastBox.classList.add("show");
                }
            })
            .catch(() => {
                toastBox.textContent = "Network error. Please check your connection and try again.";
                toastBox.classList.add("show");
            })
            .finally(() => {
                setTimeout(() => {
                    toastBox.classList.remove("show");
                }, 4500);
            });
        });
    }


    // ==========================================
    // 7. UNIFIED EMAIL MAPPING CONTROLLER LINK (SMART LAPTOP FALLBACK LOGIC)
    // ==========================================
    const businessEmail = "brothersmsc.sales@gmail.com";
    const systemConcernsEmail = "brothersms.systemconcerns@gmail.com";
    const careersEmail = "brothersms.careers@gmail.com";
    const emailSelectors = ["#smart-email-link", "#smart-footer-email-link"];

    // Browser parsing test to see if laptop environment bounds are present
    const isMobileDevice = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    emailSelectors.forEach(selector => {
        const emailLink = document.querySelector("#smart-email-link");
        if (emailLink) {
            emailLink.addEventListener("click", (e) => {
                e.preventDefault();
                const subject = "BMSC Consultation Inquiry";
                const body = "Describe your system scaling targets here...";
                
                if (isMobileDevice()) {
                    window.location.href = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                } else {
                    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${businessEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(gmailWebUrl, "_blank");
                }
            });
        }
    });

    // Integrated Secondary Technical Systems Concerns Mapping Fallback Loop
    const systemEmailLink = document.querySelector("#system-email-link");
    if (systemEmailLink) {
        systemEmailLink.addEventListener("click", (e) => {
            e.preventDefault();
            const subject = "BMSC System Concern Support Inquiry";
            const body = "Describe the technical issue or system adjustments required here...";
            
            if (isMobileDevice()) {
                window.location.href = `mailto:${systemConcernsEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            } else {
                const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${systemConcernsEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(gmailWebUrl, "_blank");
            }
        });
    }

    const careersEmailLink = document.querySelector("#careers-email-link");
    if (careersEmailLink) {
        careersEmailLink.addEventListener("click", (e) => {
            e.preventDefault();
            const subject = "BMSC Careers Application Inquiry";
            const body = "Add your resume and cover letter details here for submission...";
            
            if (isMobileDevice()) {
                window.location.href = `mailto:${careersEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            } else {
                const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${careersEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(gmailWebUrl, "_blank");
            }
        });
    }

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
    const isProductsPage = currentPath.includes("Products");
    const isClientsPage = currentPath.includes("Clients");


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
        const sections = sectionIds.map(id => document.getElementById(id)).filter(el => el !== null);


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


    // ==========================================
    // 10. DYNAMIC CLIENT CAROUSEL AUTO-DUPLICATION
    // ==========================================
    const sliderTrack = document.querySelector('.client-slider-track');
    if (sliderTrack) {
        const originalSlides = Array.from(sliderTrack.children);
        // Automatically clone each item and append it to form the loop backing
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            sliderTrack.appendChild(clone);
        });
    }


    // ==========================================
    // 11. INTEGRATED CHATBOT (WITH CACHE RETENTION)
    // ==========================================
    const launcher = document.getElementById("chatbot-launcher");
    const windowBox = document.getElementById("chatbot-window");
    const closeBtn = document.getElementById("chat-close-btn");
    const inputForm = document.getElementById("chat-input-form");
    const inputField = document.getElementById("chat-input-field");
    const messagesContainer = document.getElementById("chat-messages-container");
    const quickTray = document.getElementById("chat-quick-replies-tray");


    if (launcher && windowBox && messagesContainer) {
       
        // Load saved state log context metric array or establish fallback initial block
        const defaultWelcome = "Hello! Welcome to Brothers Megawork Systems Corporation. How can I assist you today?";
        let storedHistory = JSON.parse(sessionStorage.getItem("bms_chat_history")) || [
            { text: defaultWelcome, sender: "system" }
        ];


        // Maintain view visibility state flags matching transitions across page shifts
        if (sessionStorage.getItem("bms_chat_open") === "true") {
            windowBox.classList.add("open");
        }


        function renderSavedHistory() {
            messagesContainer.innerHTML = "";
            storedHistory.forEach(msg => {
                const bubble = document.createElement("div");
                bubble.className = `chat-message ${msg.sender === 'user' ? 'user-msg' : 'system-msg'}`;
               
                const innerBubble = document.createElement("div");
                innerBubble.className = "message-bubble";
                innerBubble.textContent = msg.text;
               
                bubble.appendChild(innerBubble);
                messagesContainer.appendChild(bubble);
            });
            scrollToLatestMessage();
        }


        function scrollToLatestMessage() {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }


        function appendMessage(text, senderType) {
            storedHistory.push({ text: text, sender: senderType });
            sessionStorage.setItem("bms_chat_history", JSON.stringify(storedHistory));
           
            const bubble = document.createElement("div");
            bubble.className = `chat-message ${senderType === 'user' ? 'user-msg' : 'system-msg'}`;
           
            const innerBubble = document.createElement("div");
            innerBubble.className = "message-bubble";
            innerBubble.textContent = text;
           
            bubble.appendChild(innerBubble);
            messagesContainer.appendChild(bubble);
            scrollToLatestMessage();
        }


        function processAutomatedReply(triggerText) {
            const cleanText = triggerText.toLowerCase();
            setTimeout(() => {
                if (cleanText.includes("product") || cleanText.includes("bcsas") || cleanText.includes("hris") || cleanText.includes("aims")) {
                    appendMessage("We specialize in core B2B modules:\nBCSAS (Credit/Savings Ledgers),\nB-HRIS-PTMS (Payroll & Biometric Timekeeping),and\nB-AIMS (Accounting & Inventory Management System).\n\nYou can view deeper code features on our standalone 'Products' tab up top!", "system");
                } else if (cleanText.includes("contact") || cleanText.includes("consult") || cleanText.includes("inquiry") || cleanText.includes("call") || cleanText.includes("email")){
                    appendMessage("You can reach out to our Support & Business Desk at\nbrothersmsc.sales@gmail.com\nbrothersms.systemconcerns\n@gmail.com\n\nCall us directly at\n+632-5310-5085\n\nor drop details in the consultation form behind this window.", "system");
                } else if (cleanText.includes("portal") || cleanText.includes("login") || cleanText.includes("client")) {
                    appendMessage("Our corporate Client Portal can be reached using the secure authorization options on our top bar profile link icon or navigating directly to your assigned enterprise web subdomain dashboard.", "system");
                } else if (cleanText.includes("support") || cleanText.includes("systems support") || cleanText.includes("help")) {
                    appendMessage("For active system down alerts, patch requests, database synchronization drops, or biometric terminal mapping assistance, please reach our helpdesk engineers immediately:\n\nDirect Desk: +632-5310-5085\nTechnical Mail: brothersms.systemconcerns@gmail.com\n\nPlease quote your assigned Company ID and software variant when initiating ticket queues.", "system");
                } else {
                    appendMessage("Thank you for reaching out to Brothers Megawork Systems Corporation. Your message has been noted. For active system deployment discussions, please consider using our Consultation Form details container.", "system");
                }
            }, 600);
        }


        launcher.addEventListener("click", () => {
            const isOpen = windowBox.classList.toggle("open");
            sessionStorage.setItem("bms_chat_open", isOpen);
            scrollToLatestMessage();
        });


        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                windowBox.classList.remove("open");
                sessionStorage.setItem("bms_chat_open", "false");
            });
        }


        if (inputForm) {
            inputForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const text = inputField.value.trim();
                if (!text) return;


                appendMessage(text, "user");
                inputField.value = "";
                processAutomatedReply(text);
            });
        }


        if (quickTray) {
            quickTray.querySelectorAll(".quick-reply-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const replyVal = btn.getAttribute("data-reply");
                    if (replyVal === "Products") {
                        appendMessage("Tell me about your software products.", "user");
                        processAutomatedReply("products");
                    } else if (replyVal === "Contact") {
                        appendMessage("How can I contact you?", "user");
                        processAutomatedReply("contact");
                    } else if (replyVal === "Portal") {
                        appendMessage("Where is the client login portal?", "user");
                        processAutomatedReply("portal");
                    } else if (replyVal === "Support") {
                        appendMessage("I need systems support assistance.", "user");
                        processAutomatedReply("support");
                    }
                });
            });
        }


        // Boot system memory processing loops
        renderSavedHistory();
    }


    // ==========================================
    // 12. PERSISTENT LIGHT/DARK THEME SWITCHER
    // ==========================================
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    
    if (themeToggleBtn) {
        // Query current stored cache state from local disk memory
        const activeTheme = localStorage.getItem("bms_site_theme");

        // Sync visual UI on initialization
        if (activeTheme === "light") {
            document.documentElement.classList.add("light-theme");
            document.body.classList.add("light-theme");
            updateThemeIcon(true);
        } else {
            document.documentElement.classList.remove("light-theme");
            document.body.classList.remove("light-theme");
            updateThemeIcon(false);
        }

        themeToggleBtn.addEventListener("click", () => {
            const isLight = document.body.classList.toggle("light-theme");
            if (isLight) {
                document.documentElement.classList.add("light-theme");
            } else {
                document.documentElement.classList.remove("light-theme");
            }
            localStorage.setItem("bms_site_theme", isLight ? "light" : "dark");
            updateThemeIcon(isLight);
        });

        // Helper macro to transition SVG layouts
        function updateThemeIcon(isLight) {
            themeToggleBtn.innerHTML = isLight 
                ? `<svg viewBox="0 0 24 24" class="theme-icon-light" style="display: block; width: 22px; height: 22px; fill: currentColor;"><path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2A1,1 0 0,1 13,3V5A1,1 0 0,1 12,6A1,1 0 0,1 11,5V3A1,1 0 0,1 12,2M12,18A1,1 0 0,1 13,19V21A1,1 0 0,1 12,22A1,1 0 0,1 11,21V19A1,1 0 0,1 12,18M20,12A1,1 0 0,1 21,13H23A1,1 0 0,1 24,12A1,1 0 0,1 23,11H21A1,1 0 0,1 20,12M2,12A1,1 0 0,1 3,11H5A1,1 0 0,1 6,12A1,1 0 0,1 5,13H3A1,1 0 0,1 2,12M19.78,4.8C20.17,5.19 20.17,5.82 19.78,6.21L18.36,7.63C17.97,8.02 17.34,8.02 16.95,7.63C16.56,7.24 16.56,6.61 16.95,6.22L18.37,4.8C18.76,4.41 19.39,4.41 19.78,4.8M5.64,18.36C6.03,18.75 6.03,19.38 5.64,19.77L4.22,21.19C3.83,21.58 3.2,21.58 2.81,21.19C2.42,20.8 2.42,20.17 2.81,19.78L4.23,18.36C4.62,17.97 5.25,17.97 5.64,18.36M19.78,19.2C20.17,18.81 20.17,18.18 19.78,17.79L18.36,16.37C17.97,15.98 17.34,15.98 16.95,16.37C16.56,16.76 16.56,17.39 16.95,17.78L18.37,19.2C18.76,19.59 19.39,19.59 19.78,19.2M5.64,5.64C6.03,5.25 6.03,4.62 5.64,4.23L4.22,2.81C3.83,2.42 3.2,2.42 2.81,2.81C2.42,3.2 2.42,3.83 2.81,4.22L4.23,5.64C4.62,6.03 5.25,6.03 5.64,5.64Z"/></svg>`
                : `<svg viewBox="0 0 24 24" class="theme-icon-dark" style="display: block; width: 22px; height: 22px; fill: currentColor;"><path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/></svg>`;
        }
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
}
