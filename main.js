document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Trigger threshold

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Initial check on page load
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // Fecha outros abertos
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if(item !== faqItem) {
                    item.classList.remove('active');
                }
            });

            // Alterna o atual
            faqItem.classList.toggle('active');
        });
    });

    // Audio Player Logic
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('i');
    let hasInteracted = false;

    if(bgMusic && musicToggle) {
        const targetVolume = 0.025; // Volume bem mais baixo agora (2.5%)
        bgMusic.volume = 0; // Começa zerado para o fade in
        bgMusic.currentTime = 34; // Inicia a partir dos 34 segundos
        let fadeInterval;

        const fadeIn = (durationMs) => {
            clearInterval(fadeInterval);
            let vol = bgMusic.volume;
            const steps = Math.max(1, durationMs / 50);
            const increment = (targetVolume - vol) / steps;

            fadeInterval = setInterval(() => {
                if (vol < targetVolume) {
                    vol += increment;
                    bgMusic.volume = Math.min(vol, targetVolume);
                } else {
                    bgMusic.volume = targetVolume;
                    clearInterval(fadeInterval);
                }
            }, 50);
        };

        const updateIconState = () => {
            if (bgMusic.paused) {
                musicIcon.classList.remove('ph-speaker-high');
                musicIcon.classList.add('ph-speaker-slash');
                musicToggle.classList.remove('playing');
            } else {
                musicIcon.classList.remove('ph-speaker-slash');
                musicIcon.classList.add('ph-speaker-high');
                musicToggle.classList.add('playing');
            }
        };

        const toggleMusic = () => {
            hasInteracted = true; // Impede que o scroll tente tocar de novo
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    fadeIn(500); // Fade in rápido (meio segundo) se a pessoa clicar no botão
                    updateIconState();
                }).catch(e => console.log('Autoplay blocked:', e));
            } else {
                bgMusic.pause();
                updateIconState();
            }
        };

        musicToggle.addEventListener('click', toggleMusic);

        // Verifica estado inicial
        setTimeout(updateIconState, 100);

        // Tenta tocar na primeira interação do usuário com a página
        const playOnInteract = () => {
            if (!hasInteracted && bgMusic.paused) {
                hasInteracted = true;
                bgMusic.volume = 0;
                bgMusic.play().then(() => {
                    fadeIn(3000); // Fade in de 3 segundos se for pelo scroll
                    updateIconState();
                }).catch(e => console.log(e));
            }
        };

        document.body.addEventListener('click', playOnInteract, { once: true });
        document.body.addEventListener('scroll', playOnInteract, { once: true });
        window.addEventListener('scroll', playOnInteract, { once: true });
        document.body.addEventListener('touchstart', playOnInteract, { once: true });
    }
});
