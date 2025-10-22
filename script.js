// script.js
// DOM Elements
const scrollTopBtn = document.getElementById('scroll-top');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillProgresses = document.querySelectorAll('.skill-progress');
const ctaButton = document.querySelector('.cta-button');

// Scroll to Top Functionality
function toggleScrollTopButton() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Smooth Scroll for Navigation Links
function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 60;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        closeMobileMenu();
    }
}

// Scroll Animation for Elements
function checkScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
        
        if (isVisible) {
            element.classList.add('visible');
        }
    });
}

// Animate Skill Bars
function animateSkillBars() {
    skillProgresses.forEach(progress => {
        const width = progress.getAttribute('data-width');
        progress.style.width = width;
    });
}

// CTA Button Action
function handleCTAClick() {
    const profileSection = document.getElementById('profile');
    const offsetTop = profileSection.offsetTop - 60;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    alert('Terima kasih! Pesan Anda telah dikirim.');
    e.target.reset();
}

// Function untuk membuka gambar di modal
function openImage(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('caption');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    caption.textContent = imageSrc.replace('.jpg', '').replace(/([A-Z])/g, ' $1').trim();
    
    // Tambahkan event listener untuk menutup modal dengan ESC
    document.addEventListener('keydown', handleEscapeKey);
}

// Function untuk menutup modal
function closeImage() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // Hapus event listener
    document.removeEventListener('keydown', handleEscapeKey);
}

// Function untuk menangani tombol ESC
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeImage();
    }
}

// Prevent image download
function preventImageDownload() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
}

// Music Player Functionality
function initMusicPlayer() {
    const audio = document.getElementById('background-music');
    const toggleBtn = document.getElementById('music-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeDown = document.getElementById('volume-down');
    const volumeUp = document.getElementById('volume-up');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    // Set volume awal
    audio.volume = volumeSlider.value / 100;
    
    // Autoplay dengan handling promise
    const playAudio = () => {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay berhasil
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline';
            }).catch(error => {
                // Autoplay diblokir, tampilkan pesan atau biarkan user mulai manual
                console.log('Autoplay diblokir, pengguna harus memulai musik secara manual');
                playIcon.style.display = 'inline';
                pauseIcon.style.display = 'none';
            });
        }
    };
    
    // Coba autoplay saat halaman dimuat
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(playAudio, 1000); // Delay sedikit untuk meningkatkan kemungkinan autoplay berhasil
    });
    
    // Toggle play/pause
    toggleBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            audio.pause();
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    });
    
    // Kontrol volume
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });
    
    volumeDown.addEventListener('click', () => {
        volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
        audio.volume = volumeSlider.value / 100;
    });
    
    volumeUp.addEventListener('click', () => {
        volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
        audio.volume = volumeSlider.value / 100;
    });
    
    // Handle ketika audio berakhir (seharusnya tidak terjadi karena loop)
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play();
    });
    
    // Handle visibility change - pause saat tab tidak aktif
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !audio.paused) {
            audio.pause();
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    });
}

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize all functionality
function init() {
    // Event Listeners
    window.addEventListener('scroll', toggleScrollTopButton);
    scrollTopBtn.addEventListener('click', scrollToTop);
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // CTA button
    if (ctaButton) {
        ctaButton.addEventListener('click', handleCTAClick);
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Modal event listeners
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeImage();
            }
        });
    }
    
    // Prevent image download
    preventImageDownload();
    
    // Initialize music player
    initMusicPlayer();
    
    // Initial check for scroll position
    toggleScrollTopButton();
    
    // Debounced scroll handler for better performance
    const debouncedScrollHandler = debounce(() => {
        toggleScrollTopButton();
        checkScroll();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Initial animations check
    window.addEventListener('load', () => {
        // Set timeout untuk memastikan elemen sudah dirender sepenuhnya
        setTimeout(() => {
            checkScroll();
            animateSkillBars();
        }, 100);
    });
    
    // Animate skill bars when they come into view
    const observerOptions = {
        threshold: 0.5
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Tambahan untuk meningkatkan UX pada perangkat mobile
document.addEventListener('touchstart', function() {}, {passive: true});