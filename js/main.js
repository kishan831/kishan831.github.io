// Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});

// Enhanced Sparkle Particles
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#bb86fc' : '#03dac6';
        this.opacity = Math.random() * 0.8 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

        this.opacity += Math.random() * 0.02 - 0.01;
        this.opacity = Math.max(0.2, Math.min(1, this.opacity));
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 80 : 150;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

initParticles();
animate();
window.addEventListener('resize', initParticles);

// Typing Effect
const typedText = document.getElementById('typed-text');
const phrases = [
    "Unity Game Developer",
    "Slot Game Specialist",
    "Multiplayer Expert",
    "Creating Immersive Worlds"
];

let i = 0, j = 0, deleting = false;

function type() {
    const current = phrases[i];
    typedText.textContent = current.substring(0, j);
    
    if (!deleting && j === current.length) {
        deleting = true;
        setTimeout(type, 1500);
    } else if (deleting && j === 0) {
        deleting = false;
        i = (i + 1) % phrases.length;
        setTimeout(type, 500);
    } else {
        j += deleting ? -1 : 1;
        setTimeout(type, deleting ? 50 : 100);
    }
}

type();

// Scroll Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.2}s`;
    observer.observe(item);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Scroll to Top Button
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Create mailto link
    const mailtoLink = `mailto:jaiswalkishan628@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(email)}`;
    
    // Open mail client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Thank you for your message! Your email client will open to send the message.');
    
    // Reset form
    contactForm.reset();
});

// Skill Cards Animation
const skills = document.querySelectorAll('.skill');
skills.forEach((skill, index) => {
    skill.style.animationDelay = `${index * 0.1}s`;
});

// Project Cards Hover Effect
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Dynamic Stats Counter Animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalValue = target.textContent;
            const isPercentage = finalValue.includes('%');
            const isPlus = finalValue.includes('+');
            const numValue = parseInt(finalValue);
            
            let current = 0;
            const increment = numValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numValue) {
                    current = numValue;
                    clearInterval(timer);
                }
                target.textContent = Math.floor(current) + (isPlus ? '+' : '') + (isPercentage ? '%' : '');
            }, 30);
            
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }
});

// Add cursor trail effect (optional - subtle)
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #bb86fc, transparent);
            border-radius: 50%;
            pointer-events: none;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transform: translate(-50%, -50%);
            opacity: 0.6;
            z-index: 9999;
            animation: fadeOut 1s forwards;
        `;
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 1000);
    }
});

// Add fadeOut animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }
`;
document.head.appendChild(style);

// Console Easter Egg
console.log('%c👾 Hey there, Developer! 👾', 'color: #bb86fc; font-size: 20px; font-weight: bold;');
console.log('%cLooking for someone who can build awesome games? Let\'s talk!', 'color: #03dac6; font-size: 14px;');
console.log('%cEmail: jaiswalkishan628@gmail.com', 'color: #fff; font-size: 12px;');
