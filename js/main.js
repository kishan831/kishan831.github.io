// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Initialize Lucide Icons ---
    lucide.createIcons();

    // --- 2. Loading Screen Logic (Speeded up) ---
    const loader = document.getElementById('loader');
    // Reduced wait time from 1500ms to 800ms for snappier feel
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 800);

    // --- 3. Three.js Background (The "Unity" Flex) ---
    const initThreeJS = () => {
        const canvas = document.getElementById('bg-canvas');
        const scene = new THREE.Scene();
        // Fog for depth
        scene.fog = new THREE.FogExp2(0x0f172a, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create Geometric Shape (Wireframe Icosahedron)
        const geometry = new THREE.IcosahedronGeometry(10, 2);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x8b5cf6, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.05 
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Add Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50; // Spread
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.8,
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 20;

        // Interactive Mouse Movement
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Rotate Sphere
            sphere.rotation.y += 0.002;
            sphere.rotation.x += 0.001;

            // Parallax based on mouse
            sphere.rotation.y += mouseX * 0.05;
            sphere.rotation.x += mouseY * 0.05;

            // Wave effect for particles
            particlesMesh.rotation.y = -elapsedTime * 0.05;
            particlesMesh.rotation.x = mouseY * 0.2;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    initThreeJS();

    // --- 4. GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Blur on Scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if(window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // Hero Animation
    const tl = gsap.timeline();
    tl.from(".hero-greeting", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" })
      .from("#hero h1", { y: 50, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .from("#typed-text", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");

    // Reveal Sections (General Fade Up)
    gsap.utils.toArray('.gs_reveal').forEach((elem) => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Timeline Items (Slide from Left)
    gsap.utils.toArray('.gs_reveal_left').forEach((elem) => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 80%",
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Project Cards (Staggered Fade Up)
    gsap.from(".gs_reveal_up", {
        scrollTrigger: {
            trigger: ".projects-container",
            start: "top 75%"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });

    // Stats Counter Animation
    gsap.utils.toArray('.stat-number').forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target'));
        
        ScrollTrigger.create({
            trigger: stat,
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: "power1.inOut",
                    onUpdate: function() {
                        stat.innerHTML = Math.ceil(this.targets()[0].innerHTML) + "+";
                    }
                });
            }
        });
    });

    // --- 5. Typing Effect (Vanilla JS) ---
    const typedText = document.getElementById('typed-text');
    const phrases = [
        "Unity Game Developer",
        "Slot Game Specialist",
        "Multiplayer Expert",
        "Creating Immersive Worlds"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typedText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing after initial animation
    setTimeout(typeEffect, 1000);

    // --- 6. Mobile Menu & Interactions ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Scroll to top
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 500) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 7. Formspree Form Handling ---
    const form = document.getElementById("contactForm");
    const status = document.getElementById("form-status");
    const submitBtn = document.getElementById("submitBtn");

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        
        // Update UI state
        submitBtn.innerHTML = "Sending...";
        submitBtn.disabled = true;

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "Thanks! I'll get back to you soon.";
                status.classList.add('success');
                form.reset();
                submitBtn.innerHTML = 'Message Sent <i data-lucide="check"></i>';
                lucide.createIcons(); // Re-render icon
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "Oops! There was a problem submitting your form";
                    }
                    status.classList.add('error');
                    submitBtn.innerHTML = 'Send Message';
                    submitBtn.disabled = false;
                })
            }
        }).catch(error => {
            status.innerHTML = "Oops! There was a problem submitting your form";
            status.classList.add('error');
            submitBtn.innerHTML = 'Send Message';
            submitBtn.disabled = false;
        });
    }
    form.addEventListener("submit", handleSubmit);

    // Console Easter Egg
    console.log('%c👾 System Ready: KJ-Portfolio v3.0 (Static Mode)', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');

        // ==================== Lazy Load YouTube Videos on Click ====================
    document.querySelectorAll('.youtube-lazy').forEach(card => {
        card.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            
            // Create iframe only when clicked
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.style.borderRadius = '16px 16px 0 0';

            // Replace thumbnail with video player
            const preview = this.querySelector('.youtube-preview');
            if (preview) {
                preview.replaceWith(iframe);
            }
        });
    });

    // Console Easter Egg (keep it if you like!)
    console.log('%c👾 System Ready: KJ-Portfolio v3.0 (Static Mode)', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
});
