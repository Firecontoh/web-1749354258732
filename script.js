document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const heroTypingText = document.querySelector('.typing-text');
    const heroDescription = document.querySelector('.hero-description');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Preloader fade out
    setTimeout(() => {
        preloader.classList.add('hidden');
        mainContent.classList.add('visible');
    }, 2000); // Wait for 2 seconds (adjust as needed for loader animation)

    // Typewriter effect for "Wings Dev"
    const text = "Wings Dev";
    let i = 0;
    const typingSpeed = 150; // milliseconds per character

    function typeWriter() {
        if (i < text.length) {
            heroTypingText.textContent = text.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            heroTypingText.querySelector('.cursor').style.display = 'none'; // Hide cursor after typing
        }
    }

    // Delay start of typing effect until after preloader is hidden and initial content is somewhat ready
    setTimeout(() => {
        typeWriter();
        // Activate hero description after typing
        heroDescription.style.opacity = 1;
        heroDescription.style.transform = 'translateY(0)';
    }, 2500); // Adjust this delay to match preloader fade-out + a small buffer


    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Get the height of the fixed header
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            // Remove active class from all links and add to clicked one
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Scroll reveal for sections
    const observerOptions = {
        root: null, // viewport as root
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // For skill and project cards, activate them individually with a delay
                if (entry.target.id === 'skills' || entry.target.id === 'projects') {
                    const cards = entry.target.querySelectorAll('.skill-card, .project-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('active');
                        }, index * 100); // Staggered animation
                    });
                }
                // For about section paragraphs
                if (entry.target.id === 'about') {
                    const aboutParagraphs = entry.target.querySelectorAll('.about-text p, .about-text .btn');
                    aboutParagraphs.forEach((p, index) => {
                        setTimeout(() => {
                            p.style.opacity = 1;
                            p.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle initial active state for hero section if it's in view
    const heroSection = document.getElementById('hero');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelector('nav ul li a[href="#hero"]').classList.add('active');
            } else {
                document.querySelector('nav ul li a[href="#hero"]').classList.remove('active');
            }
        });
    }, { threshold: 0.5 }); // More threshold for hero section to be active

    heroObserver.observe(heroSection);

    // Active navigation link on scroll (more robust)
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const headerHeight = document.querySelector('header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 1; // Adjust for header
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    });

    // Form submission (placeholder)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Message Sent! (This is a demo, form data is not actually sent)');
            this.reset();
        });
    }

});