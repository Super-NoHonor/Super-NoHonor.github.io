// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add scrolled class to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .timeline-item, .education-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #2563eb !important;
        font-weight: 600;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }
    
    .nav-toggle.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active .bar:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
    }
    
    .nav-toggle.active .bar:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
    }
`;
document.head.appendChild(style);

// Image modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');

    // Modal open function
    function openModal(event) {
        event.stopPropagation(); // Prevent slider controls from interfering
        event.preventDefault();  // Prevent any default behavior
        console.log('=== MODAL DEBUG ===');
        console.log('Clicked image src:', this.src);
        console.log('Clicked image alt:', this.alt);
        console.log('Image element:', this);
        console.log('Is in active slide:', this.closest('.slide.active') ? 'YES' : 'NO');
        console.log('Window size:', window.innerWidth, 'x', window.innerHeight);
        
        // Set the image first
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        
        // Force reset modal styles
        modal.style.display = 'none';
        modal.classList.remove('show');
        
        // Show modal with proper display
        requestAnimationFrame(() => {
            modal.style.setProperty('display', 'flex', 'important');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            
            // Trigger animation after a short delay
            setTimeout(() => {
                modal.classList.add('show');
                console.log('Modal should be visible now');
            }, 50);
        });
    }

    // Function to add modal functionality to images
    function addModalToImages() {
        // Handle regular research images (not in sliders)
        const regularImages = document.querySelectorAll('.research-img:not(.image-slider .research-img)');
        
        regularImages.forEach(img => {
            if (!img.dataset.modalReady) {
                img.addEventListener('click', openModal);
                img.style.cursor = 'pointer';
                img.dataset.modalReady = 'true';
            }
        });
        
        // Handle slider images differently - only active ones
        const sliders = document.querySelectorAll('.image-slider');
        sliders.forEach(slider => {
            // Add event delegation to the slider container
            if (!slider.dataset.modalReady) {
                slider.addEventListener('click', function(event) {
                    // Only handle clicks on images in active slides
                    if (event.target.matches('img.research-img') && 
                        event.target.closest('.slide.active')) {
                        openModal.call(event.target, event);
                    }
                });
                slider.dataset.modalReady = 'true';
            }
        });
    }

    // Modal close function
    function closeModal() {
        console.log('Closing modal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.setProperty('display', 'none', 'important');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }, 300);
    }

    // Initialize modal for existing images
    addModalToImages();

    // Re-initialize when new images are loaded (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                addModalToImages();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Close modal when clicking the X button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});

// Image Slider Functionality
function changeSlide(button, direction) {
    try {
        const slider = button.closest('.image-slider');
        if (!slider) {
            console.error('Slider not found');
            return;
        }
        const slides = slider.querySelectorAll('.slide');
        const indicators = slider.querySelectorAll('.indicator');
        
        if (slides.length === 0) {
            console.error('No slides found');
            return;
        }
    
    let activeIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            activeIndex = index;
        }
    });
    
    // Remove active class from current slide and indicator
    slides[activeIndex].classList.remove('active');
    indicators[activeIndex].classList.remove('active');
    
    // Calculate new index
    let newIndex = activeIndex + direction;
    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    
    // Add active class to new slide and indicator
    slides[newIndex].classList.add('active');
    if (indicators[newIndex]) {
        indicators[newIndex].classList.add('active');
    }
    } catch (error) {
        console.error('Slider error:', error);
    }
}

function currentSlide(indicator, slideNumber) {
    const slider = indicator.closest('.image-slider');
    const slides = slider.querySelectorAll('.slide');
    const indicators = slider.querySelectorAll('.indicator');
    
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    
    // Add active class to selected slide and indicator
    slides[slideNumber - 1].classList.add('active');
    indicators[slideNumber - 1].classList.add('active');
}

// Auto-play slider (optional)
function autoSlide() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const nextBtn = slider.querySelector('.next-btn');
        if (nextBtn) {
            changeSlide(nextBtn, 1);
        }
    });
}

// Auto-advance slides every 5 seconds (optional - uncomment to enable)
// setInterval(autoSlide, 5000);