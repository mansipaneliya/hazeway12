// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Trigger animation when the pinned section starts
            if (entry.target.classList.contains('pinned-narrative')) {
                startStatSequence();
                observer.unobserve(entry.target); // Run once
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up, .pinned-narrative').forEach(el => {
    observer.observe(el);
});

// Navigation Background on Scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Statistic Animation Sequence via Scroll
const narrative = {
    container: document.querySelector('.pinned-narrative'),
    layer1: document.getElementById('layer-stat'),
    layer2: document.getElementById('layer-impact'),
    statValue: document.getElementById('stat-value'),
    statLabel: document.getElementById('stat-label')
};

// Scroll Handler for Pinned Section
window.addEventListener('scroll', () => {
    if (!narrative.container) return;

    const rect = narrative.container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate progress through the section
    const scrollDistance = narrative.container.offsetHeight - windowHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

    requestAnimationFrame(() => {
        updateNarrative(progress);
    });
});

// Initialize functions on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Assuming these functions exist elsewhere or are placeholders
    // initYearCounter();
    // initPinnedNarrative();
    // initOrbitalFeatures();
    // initCustomCursor();
    initFAQ();
    initTestimonials();
    initHowItWorks();
    initFooterInteractions();
});

// Interactive 'How It Works' Logic
function initHowItWorks() {
    const section = document.querySelector('.how-it-works');
    const progressFill = document.querySelector('.progress-fill');
    const stateItems = document.querySelectorAll('.state-item');
    const feedImages = document.querySelectorAll('.feed-img');

    if (!section) return;

    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate progress: 0 when top hits top, 1 when bottom hits bottom
        // But we want internal progress while stuck.
        // Sticky height is 100vh. Total height is 400vh. Scrollable distance is 300vh.

        const scrollDistance = section.offsetHeight - viewportHeight;
        let progress = -rect.top / scrollDistance;

        // Clamp 0 to 1
        progress = Math.max(0, Math.min(1, progress));

        // Update Line
        if (progressFill) {
            progressFill.style.height = `${progress * 100}%`;
        }

        // Determine Active State (4 states)
        // 0-0.25: State 0
        // 0.25-0.5: State 1
        // 0.5-0.75: State 2
        // 0.75-1.0: State 3

        const stateIndex = Math.floor(progress * 4);
        const activeIndex = Math.min(stateIndex, 3); // Clamp to max index

        // Update States List
        stateItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Feed Images
        feedImages.forEach((img, index) => {
            if (index === activeIndex) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    });
}

// Footer Progressive Interactions
function initFooterInteractions() {
    const columns = document.querySelectorAll('.footer-col');

    columns.forEach(col => {
        const title = col.querySelector('h4');
        if (!title) return;

        title.addEventListener('click', () => {
            // Toggle active state
            const isActive = col.classList.contains('active');

            // Optional: Close others? User didn't specify accordion behavior for columns, but "expand" implies toggle.
            // Let's keep it multi-open friendly for desktop unless constrained.
            // Actually user said "Treat each main heading as an interactive anchor... expand the sub-items".
            // Let's toggle.

            if (isActive) {
                col.classList.remove('active');
            } else {
                col.classList.add('active');
            }
        });
    });
}

// Cinematic Testimonial Slider Logic
function initTestimonials() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const container = document.querySelector('.slider-container');

    if (slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    const INTERVAL_TIME = 5000; // 5 Seconds

    // Function to show specific slide
    function showSlide(index) {
        // Handle wrapping
        if (index >= totalSlides) currentSlide = 0;
        else if (index < 0) currentSlide = totalSlides - 1;
        else currentSlide = index;

        // Update Slides
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update Dots
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Navigation Functions
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Auto Advance Logic
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing
        autoSlideInterval = setInterval(nextSlide, INTERVAL_TIME);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide(); // Reset timer on interaction
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    // Pause on Hover
    if (container) {
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
    }

    // Initialize
    showSlide(0);
    startAutoSlide();
}

// FAQ Accordion Logic
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Check if currently active
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

function updateNarrative(progress) {
    if (progress < 0.4) {
        // State 1: Stat Visible
        narrative.layer1.style.opacity = 1 - (progress * 2.5); // Fade out faster
        narrative.layer2.style.opacity = 0;
        narrative.layer1.style.pointerEvents = 'auto';
        narrative.layer2.style.pointerEvents = 'none';

    } else if (progress >= 0.4 && progress < 0.6) {
        // Transition Zone
        narrative.layer1.style.opacity = 0;
        narrative.layer2.style.opacity = (progress - 0.4) * 5; // Fade in

    } else {
        // State 2: Impact Visible
        narrative.layer1.style.opacity = 0;
        narrative.layer2.style.opacity = 1;
        narrative.layer1.style.pointerEvents = 'none';
        narrative.layer2.style.pointerEvents = 'auto';
    }
}


// Single continuous smooth flow animation
// Triggered once when section comes into view
let animationTriggered = false;

async function startStatSequence() {
    if (animationTriggered || !narrative.statValue) return;
    animationTriggered = true;

    await wait(500);

    const startValue = 26000;
    const endValue = 35000;
    const totalDuration = 6000; // 6 seconds for very slow, smooth motion

    await animateValue(startValue, endValue, totalDuration);

    // Final Transition
    await transitionToFinal();
}

function animateValue(start, end, duration) {
    return new Promise(resolve => {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Custom EaseInOutCubic for ultra-smooth acceleration/deceleration
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const current = Math.floor(start + (end - start) * ease);
            narrative.statValue.innerText = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                narrative.statValue.innerText = end.toLocaleString();
                resolve();
            }
        }

        requestAnimationFrame(update);
    });
}

async function transitionToFinal() {
    await wait(500);

    // Fade out label only
    narrative.statLabel.style.opacity = '0';

    await wait(500);

    // Update text
    narrative.statLabel.innerText = "EACH YEAR";
    narrative.statValue.innerText = "35,000+";

    // Fade label back in
    narrative.statLabel.style.opacity = '1';
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Orbital Interaction Logic
const nodes = document.querySelectorAll('.orbit-node');
const centerHub = document.querySelector('.orbit-center');

nodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
        // Deactivate all
        nodes.forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.connection-line').forEach(l => l.classList.remove('active'));

        // Activate Current
        node.classList.add('active');
        centerHub.classList.add('active');

        // Activate specific line
        const lineId = `line-${index + 1}`;
        const line = document.getElementById(lineId);
        if (line) line.classList.add('active');
    });

    node.addEventListener('mouseleave', () => {
        node.classList.remove('active');
        centerHub.classList.remove('active');
        const lineId = `line-${index + 1}`;
        const line = document.getElementById(lineId);
        if (line) line.classList.remove('active');
    });
});

// Custom Fog-Piercing Cursor Logic
const cursor = {
    system: document.querySelector('.cursor-system'),
    core: document.querySelector('.cursor-core'),
    glow: document.querySelector('.cursor-glow'),
    mouseX: 0,
    mouseY: 0,
    currentX: 0,
    currentY: 0
};

// Check if device supports hover (desktop)
const isDesktop = matchMedia('(pointer:fine)').matches;

if (isDesktop && cursor.system) {

    document.addEventListener('mousemove', (e) => {
        // Show cursor on first move
        cursor.system.style.opacity = '1';
        cursor.mouseX = e.clientX;
        cursor.mouseY = e.clientY;
    });

    // Smooth Interpolation Loop
    function updateCursor() {
        // Linear interpolation for smooth follow (factor 0.15)
        cursor.currentX += (cursor.mouseX - cursor.currentX) * 0.15;
        cursor.currentY += (cursor.mouseY - cursor.currentY) * 0.15;

        cursor.system.style.transform = `translate3d(${cursor.currentX}px, ${cursor.currentY}px, 0)`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Interactive States
    const hoverTargets = document.querySelectorAll('a, button, .orbit-node, .showcase-card, .feature-card');
    const ctaTargets = document.querySelectorAll('.btn-primary, .nav-cta');

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.system.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.system.classList.remove('cursor-hover'));
    });

    ctaTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.system.classList.add('cursor-cta'));
        el.addEventListener('mouseleave', () => cursor.system.classList.remove('cursor-cta'));
    });
}
