// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        // Prevent scrolling when menu is open
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Reveal animation on scroll
const reveals = document.querySelectorAll('.reveal');
function reveal() {
    const windowHeight = window.innerHeight;
    for (let i = 0; i < reveals.length; i++) {
        const revealTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 150;
        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        } else {
            reveals[i].classList.remove('active');
        }
    }
}

window.addEventListener('scroll', reveal, { passive: true });
reveal();

// Intersection Observer for the header
const header = document.querySelector('header');
const hero = document.querySelector('.hero');

// Scroll events or other listeners can go here if needed later


// Check if hero image exists, if not, color the container
const heroImg = document.getElementById('heroImage');
heroImg.onerror = function () {
    this.style.display = 'none';
    const container = document.querySelector('.hero-image-container');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.fontSize = '2rem';
    container.style.fontWeight = '800';
    container.style.color = 'var(--accent)';
    container.textContent = 'IMAGE';

    const hint = document.createElement('div');
    hint.textContent = 'Please place your graduation photo as "hero.png" in the assets/images folder.';
    hint.style.position = 'absolute';
    hint.style.bottom = '20px';
    hint.style.fontSize = '0.7rem';
    hint.style.fontWeight = '400';
    hint.style.opacity = '0.5';
    hint.style.width = '80%';
    hint.style.textAlign = 'center';
    container.appendChild(hint);
};

// Tripwire Navigation Animations
document.querySelectorAll('nav ul a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.classList.add('is-animating');
    });

    link.addEventListener('animationiteration', () => {
        if (!link.matches(':hover')) {
            link.classList.remove('is-animating');
        }
    });
});

// AJAX Form Submission & Modal Handling
const contactForm = document.querySelector('.contact-form');
const modal = document.getElementById('thankYouModal');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show modal
                modal.classList.add('active');
                contactForm.reset();
            } else {
                alert('Oops! There was a problem submitting your form. Please try again or email me directly.');
            }
        } catch (error) {
            alert('Oops! There was a problem connecting. Please check your internet or email me directly.');
        }
    });
}

// Close modal on click outside the content box (on the dim area)
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Diploma Modal Handling
const diplomaArea = document.getElementById('diplomaArea');
const diplomaModal = document.getElementById('diplomaModal');
const closeDiplomaBtn = document.getElementById('closeDiplomaBtn');

if (diplomaArea && diplomaModal) {
    diplomaArea.addEventListener('click', () => {
        diplomaModal.classList.add('active');
    });
}

const mobileDiplomaArea = document.getElementById('mobileDiplomaArea');
if (mobileDiplomaArea && diplomaModal) {
    mobileDiplomaArea.addEventListener('click', () => {
        diplomaModal.classList.add('active');
    });
}

if (closeDiplomaBtn) {
    closeDiplomaBtn.addEventListener('click', () => {
        diplomaModal.classList.remove('active');
    });
}

if (diplomaModal) {
    diplomaModal.addEventListener('click', (e) => {
        if (e.target === diplomaModal) {
            diplomaModal.classList.remove('active');
        }
    });
}
