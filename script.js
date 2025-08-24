// Set dark mode theme
const body = document.body;
body.setAttribute('data-theme', 'dark');

// Custom cursor functionality
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor) {
        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .cta-button, .contact-button, .theme-toggle, .scroll-indicator, .service-card, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }
});

// Smooth Scrolling Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Arrow click functionality
document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const introSection = document.getElementById('intro');
            if (introSection) {
                introSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Intersection Observer for Scroll Animations
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

// Intro section animation observer
const introObserverOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const introObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, introObserverOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section-label, .intro-headline, .intro-text, .cta-button, .service-card, .project-card, .about-text, .about-image, .contact-content');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Observe intro section for smooth animation
    const introSection = document.querySelector('.intro');
    if (introSection) {
        introObserver.observe(introSection);
    }
});

// Sticky Hero Section with Extended Scroll
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        console.log('Hero elements found, setting up sticky scroll');
        
        // Create a spacer div to push content down during sticky phase
        const spacer = document.createElement('div');
        spacer.id = 'hero-spacer';
        spacer.style.cssText = `
            height: 2000px;
            width: 100%;
            position: relative;
            z-index: 0;
            pointer-events: none;
        `;
        
        // Insert spacer after hero section
        hero.parentNode.insertBefore(spacer, hero.nextSibling);
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const stickyScrollRange = 2000;
            
            console.log('Scroll position:', scrolled, 'Sticky range:', stickyScrollRange);
            
            if (scrolled < stickyScrollRange) {
                // Sticky phase - keep hero fixed
                hero.style.position = 'fixed';
                hero.style.top = '0';
                hero.style.left = '0';
                hero.style.width = '100%';
                hero.style.zIndex = '10';
                hero.style.height = '100vh';
                hero.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
                
                // Hide spacer during sticky phase
                spacer.style.display = 'none';
                
                console.log('Hero is now sticky');
            } else {
                // Normal scroll phase
                hero.style.position = 'relative';
                hero.style.top = 'auto';
                hero.style.left = 'auto';
                hero.style.width = 'auto';
                hero.style.zIndex = 'auto';
                hero.style.height = 'auto';
                hero.style.background = 'none';
                
                // Show spacer after sticky phase
                spacer.style.display = 'block';
                
                console.log('Hero is now normal');
            }
        });
    } else {
        console.error('Hero elements not found:', { hero, heroContent });
    }
});

// Magnetic Cursor Effect
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.cta-button, .contact-button, .theme-toggle');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            button.style.transform = `translate(${deltaX * 5}px, ${deltaY * 5}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
});

// Service Card Hover Effects
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Project Card Hover Effects
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        
        card.addEventListener('mouseenter', () => {
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
});

// Skill Tags Animation
document.addEventListener('DOMContentLoaded', () => {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.classList.add('animate-tag');
    });
});

// Add CSS for skill tag animation
const style = document.createElement('style');
style.textContent = `
    .animate-tag {
        animation: tagFloat 0.6s ease forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    @keyframes tagFloat {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Smooth Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 50) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.backdropFilter = 'blur(30px) saturate(200%)';
        header.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.15)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.12)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.85)';
        header.style.backdropFilter = 'blur(25px) saturate(180%)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
    }
});



// Initialize 3D Model Viewer
let modelViewer;
let silkBackground;

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Initialize 3D model viewer
    const container = document.getElementById('model-container');
    if (container) {
                                modelViewer = new ModelViewer(container, './assets/spider-_man_ps5.glb', {
                   cameraDistance: 25, // Back to original distance
                   rotationSpeed: 0.3,
                   scrollRotationMultiplier: 0.002, // Adjusted for extended scroll range
                   autoRotate: true
               });
    }
    
    // Initialize Silk background
    const silkContainer = document.getElementById('silk-background');
    if (silkContainer) {
        silkBackground = new SilkBackground(silkContainer, {
            speed: 8,
            scale: 3,
            color: "#ff4444",
            noiseIntensity: 2.0,
            rotation: 0.2
        });
    }
    
    // Initialize Project Cards with Canvas Reveal Effect
    const projectCards = document.querySelectorAll('.project-card');
    const projectData = [
        {
            title: "E-commerce Platform",
            description: "Modern online store with seamless user experience",
            category: "UI/UX • Development",
            colors: [[0, 255, 255]],
            animationSpeed: 0.4
        },
        {
            title: "Brand Identity",
            description: "Complete brand overhaul for tech startup",
            category: "Branding • Strategy",
            colors: [[236, 72, 153], [232, 121, 249]],
            animationSpeed: 0.3
        },
        {
            title: "Mobile App",
            description: "Fitness tracking app with social features",
            category: "UI/UX • Mobile",
            colors: [[125, 211, 252]],
            animationSpeed: 0.5
        },
        {
            title: "Corporate Website",
            description: "Professional website for financial services",
            category: "Design • Development",
            colors: [[255, 68, 68]],
            animationSpeed: 0.4
        },
        {
            title: "Marketing Campaign",
            description: "Digital marketing materials and strategy",
            category: "Marketing • Design",
            colors: [[34, 197, 94], [16, 185, 129]],
            animationSpeed: 0.3
        },
        {
            title: "Portfolio Website",
            description: "Personal portfolio for creative professional",
            category: "Design • Development",
            colors: [[168, 85, 247], [147, 51, 234]],
            animationSpeed: 0.4
        }
    ];
    
    projectCards.forEach((card, index) => {
        if (projectData[index]) {
            new ProjectCard(card, projectData[index]);
        }
    });
});

// Add CSS for loading animation
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

// Typing effect for hero text (optional enhancement)
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

// Initialize typing effect on page load (uncomment if desired)
// document.addEventListener('DOMContentLoaded', () => {
//     const heroName = document.querySelector('.hero-name');
//     if (heroName) {
//         setTimeout(() => {
//             typeWriter(heroName, 'Alex Graham', 150);
//         }, 1000);
//     }
// });



// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-color), #ff6666);
    z-index: 1001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
});

// Add hover sound effect (optional - requires audio file)
// function playHoverSound() {
//     const audio = new Audio('hover-sound.mp3');
//     audio.volume = 0.1;
//     audio.play().catch(() => {}); // Ignore errors if audio fails to play
// }

// Add to buttons if desired
// document.querySelectorAll('button').forEach(button => {
//     button.addEventListener('mouseenter', playHoverSound);
// });

console.log('Portfolio website loaded successfully! 🚀');

// Contact Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const openContactModal = document.getElementById('openContactModal');
    const closeContactModal = document.getElementById('closeContactModal');
    const contactModal = document.getElementById('contactModal');
    const contactForm = document.querySelector('.contact-form');
    
    if (openContactModal && closeContactModal && contactModal) {
        // Open modal
        openContactModal.addEventListener('click', () => {
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
        
        // Close modal
        closeContactModal.addEventListener('click', () => {
            contactModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        });
        
        // Close modal when clicking overlay
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('active')) {
                contactModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.querySelector('span').textContent;
            
            // Show loading state
            submitButton.querySelector('span').textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                // Show error message
                showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitButton.querySelector('span').textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Function to show form messages
    function showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Insert at the top of the form
        contactForm.insertBefore(messageElement, contactForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
});
