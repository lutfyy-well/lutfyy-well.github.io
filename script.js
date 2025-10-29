// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen Functionality
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgressBar = document.getElementById('loading-progress-bar');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
        loadingProgressBar.style.width = `${progress}%`;
    }, 200);

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeToggleButtons('light');
    }
    
    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLightTheme = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
        updateThemeToggleButtons(isLightTheme ? 'light' : 'dark');
    }
    
    function updateThemeToggleButtons(theme) {
        const icon = theme === 'light' ? '☀️' : '🌙';
        const text = theme === 'light' ? 'Mode Terang' : 'Mode Gelap';
        
        if (themeToggle) {
            themeToggle.innerHTML = icon;
            themeToggle.setAttribute('aria-label', text);
        }
        
        if (mobileThemeToggle) {
            mobileThemeToggle.innerHTML = `<span>${icon}</span> ${text}`;
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
            toggleTheme();
            closeMobileMenu();
        });
    }

    // Mobile Menu Functionality
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
        observer.observe(el);
    });

    // CTA Button functionality
    const ctaButton = document.getElementById('cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const profileSection = document.getElementById('profile');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const profilePosition = profileSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: profilePosition,
                behavior: 'smooth'
            });
        });
    }

    // ========== PERBAIKAN IMAGE MODAL FUNCTIONALITY ==========
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('caption');
    const closeModal = document.getElementById('close-modal');

    // Add click event to all clickable images
    document.querySelectorAll('.clickable-image').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            
            // Cari judul yang sesuai untuk caption
            const parentCard = this.closest('.memory-card');
            if (parentCard) {
                const title = parentCard.querySelector('.memory-content h3');
                if (title) {
                    captionText.innerHTML = title.textContent;
                }
            } else {
                // Untuk foto profil
                const parentSection = this.closest('section');
                if (parentSection) {
                    const sectionTitle = parentSection.querySelector('.section-title');
                    if (sectionTitle) {
                        captionText.innerHTML = sectionTitle.textContent;
                    } else {
                        captionText.innerHTML = 'Foto Profil';
                    }
                }
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside the image
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.form-submit');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Mengirim...';
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.textContent = 'Pesan berhasil dikirim!';
                    formStatus.className = 'form-status success';
                    this.reset();
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                formStatus.textContent = 'Maaf, terjadi kesalahan. Silakan coba lagi.';
                formStatus.className = 'form-status error';
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }
        });
    }

    // ========== PERBAIKAN MUSIC PLAYER FUNCTIONALITY ==========
    const backgroundMusic = document.getElementById('background-music');
    const playBtn = document.getElementById('play-btn');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');

    // Set initial volume
    if (backgroundMusic && volumeSlider) {
        backgroundMusic.volume = volumeSlider.value;
        updateVolumeIcon(backgroundMusic.volume);
    }

    // Play/Pause functionality
    if (playBtn && backgroundMusic) {
        playBtn.addEventListener('click', function() {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                this.classList.add('playing');
            } else {
                backgroundMusic.pause();
                this.classList.remove('playing');
            }
        });
    }

    // Volume control
    if (volumeSlider && backgroundMusic) {
        volumeSlider.addEventListener('input', function() {
            backgroundMusic.volume = this.value;
            updateVolumeIcon(this.value);
        });
    }

    // Volume button mute/unmute - PERBAIKAN
    if (volumeBtn && backgroundMusic) {
        volumeBtn.addEventListener('click', function() {
            if (backgroundMusic.volume > 0) {
                backgroundMusic.volume = 0;
                volumeSlider.value = 0;
            } else {
                backgroundMusic.volume = 0.5;
                volumeSlider.value = 0.5;
            }
            updateVolumeIcon(backgroundMusic.volume);
        });
    }

    function updateVolumeIcon(volume) {
        if (!volumeBtn) return;
        
        let iconClass = 'fa-volume-up'; // Default volume icon
        if (volume == 0) {
            iconClass = 'fa-volume-mute';
        } else if (volume < 0.3) {
            iconClass = 'fa-volume-down';
        } else if (volume < 0.6) {
            iconClass = 'fa-volume-off';
        }
        
        // Update icon menggunakan Font Awesome
        volumeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
    }

    // Auto-play music when user interacts with the page
    let musicStarted = false;
    
    function startMusicOnInteraction() {
        if (!musicStarted && backgroundMusic) {
            backgroundMusic.play().then(() => {
                if (playBtn) {
                    playBtn.classList.add('playing');
                }
                musicStarted = true;
            }).catch(error => {
                console.log('Auto-play prevented:', error);
            });
            
            // Remove event listeners after first interaction
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('scroll', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
        }
    }
    
    // Add event listeners for user interaction
    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('scroll', startMusicOnInteraction);
    document.addEventListener('keydown', startMusicOnInteraction);

    // Add hover effects to interactive elements
    document.querySelectorAll('.cta-button, .music-btn, .social-link').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Close modal with Escape key
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
        
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Performance optimization: Lazy loading for images
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

    console.log('Website loaded successfully!');
});