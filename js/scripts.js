// DJ Elite Website JavaScript Functionality

// ===== FORM HANDLER CLASS =====
class FormHandler {
    constructor() {
        this.initializeFormHandlers();
        this.setupValidation();
    }

    initializeFormHandlers() {
        // Hero form submission
        const heroForm = document.getElementById('hero-form');
        if (heroForm) {
            heroForm.addEventListener('submit', this.handleLeadCapture.bind(this));
        }

        // Newsletter form submission
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletter.bind(this));
        }

        // Payment form tracking
        const paymentForms = document.querySelectorAll('form[action*="checkout"]');
        paymentForms.forEach(form => {
            form.addEventListener('submit', this.handlePaymentClick.bind(this));
        });
    }

    async handleLeadCapture(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="loading"></span>Processing...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        try {
            // Submit to Systeme.io
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Required for cross-origin requests to Systeme.io
            });

            // Since we're using no-cors mode, we can't check response status
            // Assume success and show success message
            this.showSuccessMessage(form, '✅ Success! Check your email for the free training!');
            
            // Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'event_category': 'Lead Generation',
                    'event_label': 'Hero Form',
                    'value': 1
                });
            }

            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead');
            }

            // Reset form
            form.reset();

        } catch (error) {
            this.showErrorMessage(form, 'Something went wrong. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    async handleNewsletter(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;

        try {
            // Submit to Systeme.io
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Required for cross-origin requests to Systeme.io
            });
            
            // Since we're using no-cors mode, assume success
            this.showSuccessMessage(form, '✅ Successfully subscribed!');
            form.reset();
        } catch (error) {
            this.showErrorMessage(form, 'Error subscribing. Please try again.');
            console.error('Newsletter error:', error);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    handlePaymentClick(event) {
        // Track payment button clicks for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                'event_category': 'E-commerce',
                'event_label': 'DJ Elite Masterclass',
                'value': 1997,
                'currency': 'USD'
            });
        }

        if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
                value: 1997,
                currency: 'USD'
            });
        }
    }

    setupValidation() {
        // Real-time email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', this.validateEmail.bind(this));
            input.addEventListener('input', this.clearValidationError.bind(this));
        });

        // Name validation
        const nameInputs = document.querySelectorAll('input[name="first_name"]');
        nameInputs.forEach(input => {
            input.addEventListener('blur', this.validateName.bind(this));
        });
    }

    validateEmail(event) {
        const input = event.target;
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.showInputError(input, 'Please enter a valid email address');
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }

    validateName(event) {
        const input = event.target;
        const name = input.value.trim();
        
        if (name.length < 2) {
            this.showInputError(input, 'Please enter your first name');
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }

    showInputError(input, message) {
        input.classList.add('error');
        let errorElement = input.parentNode.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearInputError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearValidationError(event) {
        this.clearInputError(event.target);
    }

    showSuccessMessage(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-text">${message}</span>
            </div>
        `;
        
        form.parentNode.insertBefore(successDiv, form.nextSibling);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    showErrorMessage(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message-global';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${message}</span>
            </div>
        `;
        
        form.parentNode.insertBefore(errorDiv, form);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// ===== ANALYTICS TRACKER CLASS =====
class AnalyticsTracker {
    constructor() {
        this.initializeTracking();
    }

    initializeTracking() {
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.trackTimeOnPage();
        
        // Track CTA clicks
        this.trackCTAClicks();
        
        // Track video interactions
        this.trackVideoEngagement();
    }

    trackScrollDepth() {
        const scrollMarkers = [25, 50, 75, 90, 100];
        let trackedMarkers = [];

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            scrollMarkers.forEach(marker => {
                if (scrollPercent >= marker && !trackedMarkers.includes(marker)) {
                    trackedMarkers.push(marker);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            'event_category': 'Engagement',
                            'event_label': `${marker}%`,
                            'value': marker
                        });
                    }
                }
            });
        });
    }

    trackTimeOnPage() {
        const startTime = Date.now();
        
        // Track engagement milestones
        const milestones = [30, 60, 120, 300, 600]; // seconds
        
        milestones.forEach(milestone => {
            setTimeout(() => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        'event_category': 'Engagement',
                        'event_label': `${milestone} seconds`,
                        'value': milestone
                    });
                }
            }, milestone * 1000);
        });
    }

    trackCTAClicks() {
        const ctaButtons = document.querySelectorAll('.cta-button, .primary-cta, .purchase-cta');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const buttonText = button.textContent.trim();
                const buttonPosition = this.getElementPosition(button);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'cta_click', {
                        'event_category': 'Conversion',
                        'event_label': buttonText,
                        'event_position': buttonPosition
                    });
                }
            });
        });
    }

    trackVideoEngagement() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            video.addEventListener('play', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'video_play', {
                        'event_category': 'Engagement',
                        'event_label': 'Hero Video'
                    });
                }
            });
            
            video.addEventListener('ended', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'video_complete', {
                        'event_category': 'Engagement',
                        'event_label': 'Hero Video'
                    });
                }
            });
        });
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return Math.round(rect.top + scrollTop);
    }
}

// ===== UI INTERACTIONS CLASS =====
class UIInteractions {
    constructor() {
        this.initializeInteractions();
    }

    initializeInteractions() {
        this.setupTestimonialCarousel();
        this.setupModuleExpansion();
        this.setupFAQAccordion();
        this.setupCountdownTimer();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
    }

    setupTestimonialCarousel() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const navDots = document.querySelectorAll('.nav-dot');
        let currentSlide = 0;

        if (slides.length === 0) return;

        // Auto-advance slides
        setInterval(() => {
            this.showSlide((currentSlide + 1) % slides.length);
        }, 8000);

        // Navigation dots
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showSlide(index);
            });
        });

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            navDots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            navDots[index].classList.add('active');
            currentSlide = index;
        };

        this.showSlide = showSlide;
    }

    setupModuleExpansion() {
        const moduleCards = document.querySelectorAll('.module-card');
        
        moduleCards.forEach(card => {
            const header = card.querySelector('.module-header');
            const expandBtn = card.querySelector('.expand-btn');
            
            header.addEventListener('click', () => {
                card.classList.toggle('expanded');
                
                if (card.classList.contains('expanded')) {
                    expandBtn.textContent = '−';
                } else {
                    expandBtn.textContent = '+';
                }
            });
        });
    }

    setupFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const toggle = item.querySelector('.faq-toggle');
            
            question.addEventListener('click', () => {
                item.classList.toggle('expanded');
                
                if (item.classList.contains('expanded')) {
                    toggle.textContent = '−';
                } else {
                    toggle.textContent = '+';
                }
            });
        });
    }

    setupCountdownTimer() {
        const timerElements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        if (!timerElements.days) return;

        // Set countdown to 3 days from now
        const countdownDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            if (distance < 0) {
                // Timer expired
                Object.values(timerElements).forEach(el => el.textContent = '00');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timerElements.days.textContent = days.toString().padStart(2, '0');
            timerElements.hours.textContent = hours.toString().padStart(2, '0');
            timerElements.minutes.textContent = minutes.toString().padStart(2, '0');
            timerElements.seconds.textContent = seconds.toString().padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.step-card, .pain-point, .value-item, .bonus-item');
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function updateSpotsRemaining() {
    const spotsElement = document.querySelector('.spots-number');
    if (spotsElement) {
        // Simulate decreasing spots
        let spots = parseInt(spotsElement.textContent);
        if (spots > 10) {
            spots = Math.max(10, spots - Math.floor(Math.random() * 3));
            spotsElement.textContent = spots;
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    new FormHandler();
    new AnalyticsTracker();
    new UIInteractions();
    
    // Update spots remaining periodically
    setInterval(updateSpotsRemaining, 30000); // Every 30 seconds
    
    console.log('DJ Elite website initialized successfully');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
window.addEventListener('load', () => {
    // Preload hero video if it exists
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.preload = 'metadata';
    }
});

