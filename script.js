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

// Project Gallery Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectModal = document.getElementById('projectGallery');
    const projectTitle = document.getElementById('projectTitle');
    const galleryMainImage = document.getElementById('galleryMainImage');
    const galleryThumbnails = document.getElementById('galleryThumbnails');
    const closeBtn = document.querySelector('.modal-close');
    
    // Debug: Check if modal elements exist
    console.log('Project Gallery elements check:');
    console.log('Project Modal:', projectModal);
    console.log('Gallery Main Image:', galleryMainImage);
    console.log('Gallery Thumbnails:', galleryThumbnails);
    console.log('Close Button:', closeBtn);
    
    if (!projectModal || !galleryMainImage) {
        console.error('Project Gallery elements not found!');
        return;
    }

    // Project image data
    const projectData = {
        'TRACE': {
            title: 'TRACE: VLM Spatial Reasoning',
            images: [
                'assets/images/TRACE/TRACE_Main.png',
                'assets/images/TRACE/TRACE_01.png',
                'assets/images/TRACE/TRACE_02.png',
                'assets/images/TRACE/TRACE_03.png',
                'assets/images/TRACE/TRACE_04.png',
                'assets/images/TRACE/TRACE_05.png'
            ]
        },
        'Multi_agent': {
            title: 'Multi-Agent AI System',
            images: [
                'assets/images/Multi_agent/Agentic_AI_main.png',
                'assets/images/Multi_agent/Agentic_AI_01.png',
                'assets/images/Multi_agent/Agentic_AI_02.png',
                'assets/images/Multi_agent/Agentic_AI_03.png'
            ]
        },
        'RobotTool': {
            title: 'Robot Tool Image Detection',
            images: [
                'assets/images/RobotTool/RobotTool_Detection_main.jpg',
                'assets/images/RobotTool/RobotTool_Detection_01.png'
            ]
        },
        'Medical_image': {
            title: 'Medical Image Segmentation',
            images: [
                'assets/images/Medical_image/Medical_segmentaion_main.jpg',
                'assets/images/Medical_image/Medical_segmentaion_01.png',
                'assets/images/Medical_image/Medical_segmentaion_02.png'
            ]
        }
    };

    let currentProject = '';
    let currentImageIndex = 0;

    // Project gallery open function
    function openProjectGallery(projectKey, clickedImageSrc) {
        console.log('=== PROJECT GALLERY DEBUG ===');
        console.log('Opening project:', projectKey);
        console.log('Clicked image:', clickedImageSrc);
        
        const project = projectData[projectKey];
        if (!project) {
            console.error('Project not found:', projectKey);
            return;
        }
        
        currentProject = projectKey;
        
        // Find which image was clicked to start from that image
        currentImageIndex = project.images.findIndex(img => img === clickedImageSrc);
        if (currentImageIndex === -1) currentImageIndex = 0;
        
        // Set project title
        projectTitle.textContent = project.title;
        
        // Create thumbnails
        createThumbnails(project.images);
        
        // Show main image
        showImage(currentImageIndex);
        
        // Show modal
        projectModal.style.setProperty('display', 'flex', 'important');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            projectModal.classList.add('show');
        }, 10);
    }

    // Create thumbnail images
    function createThumbnails(images) {
        galleryThumbnails.innerHTML = '';
        images.forEach((src, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = src;
            thumbnail.className = 'gallery-thumbnail';
            thumbnail.onclick = () => showImage(index);
            if (index === currentImageIndex) {
                thumbnail.classList.add('active');
            }
            galleryThumbnails.appendChild(thumbnail);
        });
    }

    // Show specific image in gallery
    function showImage(index) {
        const project = projectData[currentProject];
        if (!project || !project.images[index]) return;
        
        currentImageIndex = index;
        galleryMainImage.src = project.images[index];
        galleryMainImage.alt = `${project.title} - Image ${index + 1}`;
        
        // Update thumbnail active state
        document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    // Function to add project gallery functionality to images
    function addProjectGalleryToImages() {
        const allImages = document.querySelectorAll('.research-img');
        
        allImages.forEach(img => {
            if (!img.dataset.galleryReady) {
                img.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    console.log('Image clicked:', this.src);
                    
                    // For slider images, check if this image is in active slide
                    const slide = this.closest('.slide');
                    if (slide && !slide.classList.contains('active')) {
                        console.log('Clicked image is not in active slide, ignoring');
                        return;
                    }
                    
                    // Determine which project this image belongs to
                    const projectKey = getProjectKeyFromImagePath(this.src);
                    console.log('Determined project:', projectKey);
                    
                    if (projectKey) {
                        openProjectGallery(projectKey, this.src);
                    }
                });
                img.style.cursor = 'pointer';
                img.dataset.galleryReady = 'true';
            }
        });
    }

    // Get project key from image path
    function getProjectKeyFromImagePath(imagePath) {
        if (imagePath.includes('TRACE/')) return 'TRACE';
        if (imagePath.includes('Multi_agent/')) return 'Multi_agent';
        if (imagePath.includes('RobotTool/')) return 'RobotTool';
        if (imagePath.includes('Medical_image/')) return 'Medical_image';
        return null;
    }

    // Close project gallery
    function closeProjectGallery() {
        console.log('Closing project gallery');
        projectModal.classList.remove('show');
        setTimeout(() => {
            projectModal.style.setProperty('display', 'none', 'important');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Global functions for gallery navigation (called from HTML)
    window.changeGalleryImage = function(direction) {
        const project = projectData[currentProject];
        if (!project) return;
        
        let newIndex = currentImageIndex + direction;
        if (newIndex >= project.images.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = project.images.length - 1;
        }
        
        showImage(newIndex);
    };

    // Initialize project gallery for existing images
    addProjectGalleryToImages();

    // Re-initialize when new images are loaded (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
        let shouldReinit = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // Check if any added nodes contain research images
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('.research-img') ||
                            node.querySelector && node.querySelector('.research-img')) {
                            shouldReinit = true;
                        }
                    }
                });
            }
        });
        
        if (shouldReinit) {
            console.log('New research images detected, reinitializing gallery listeners');
            addProjectGalleryToImages();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Close gallery when clicking the X button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProjectGallery);
    }

    // Close gallery when clicking outside the content
    projectModal.addEventListener('click', function(e) {
        if (e.target === projectModal) {
            closeProjectGallery();
        }
    });

    // Close gallery with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal.classList.contains('show')) {
            closeProjectGallery();
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