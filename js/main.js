/* ================================================
   main.js — Core functionality
   Loading, Dark Mode, Particles, Page Transitions,
   Scroll Progress, Back-to-Top, Typing Effect
   ================================================ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initDarkMode();
  initScrollProgress();
  initBackToTop();
  initParticles();
  initPageTransitions();
  initScrollReveal();
});

/* ════════════════════════════════════
   LOADING SCREEN
   ════════════════════════════════════ */
function initLoading() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      screen.classList.add('hidden');
    }, 1200);
  });

  // Fallback if load is slow
  setTimeout(() => {
    if (screen && !screen.classList.contains('hidden')) {
      screen.classList.add('hidden');
    }
  }, 3500);
}

/* ════════════════════════════════════
   DARK MODE
   ════════════════════════════════════ */
function initDarkMode() {
  const btn = document.getElementById('dark-mode-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('fd-dark-mode');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀️';
  }

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('fd-dark-mode', isDark);
  });
}

/* ════════════════════════════════════
   SCROLL PROGRESS BAR
   ════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ════════════════════════════════════
   BACK TO TOP
   ════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ════════════════════════════════════
   PAGE TRANSITIONS
   ════════════════════════════════════ */
function initPageTransitions() {
  // Animate page entrance
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });

  // Intercept navigation links
  document.querySelectorAll('[data-transition]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href') || link.dataset.href;
      if (!href) return;
      
      const overlay = document.getElementById('page-transition');
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 500);
      } else {
        window.location.href = href;
      }
    });
  });
}

/* ════════════════════════════════════
   PARTICLE SYSTEM
   ════════════════════════════════════ */
function initParticles() {
  const container = document.querySelector('.particles-container');
  if (!container) return;

  createFloatingHearts(container);
  createSparkles(container);
  createGlowOrbs(container);
  createBubbles(container);
}

function createFloatingHearts(container) {
  const hearts = ['❤️','💕','💖','💗','💝','🌸','✨'];
  const count = window.innerWidth < 600 ? 8 : 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'heart-float';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      font-size: ${0.8 + Math.random() * 1.5}rem;
      animation-duration: ${3 + Math.random() * 5}s;
      animation-delay: ${Math.random() * 5}s;
      opacity: ${0.3 + Math.random() * 0.5};
    `;
    container.appendChild(el);
  }
}

function createSparkles(container) {
  const count = window.innerWidth < 600 ? 12 : 25;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${3 + Math.random() * 6}px;
      height: ${3 + Math.random() * 6}px;
      animation-duration: ${1.5 + Math.random() * 3}s;
      animation-delay: ${Math.random() * 4}s;
      background: ${Math.random() > 0.5 ? 'white' : '#ffb3de'};
    `;
    container.appendChild(el);
  }
}

function createGlowOrbs(container) {
  const colors = [
    'rgba(249,168,201,0.6)',
    'rgba(201,168,232,0.5)',
    'rgba(255,182,193,0.5)',
    'rgba(216,170,255,0.5)'
  ];
  
  colors.forEach((color, i) => {
    const el = document.createElement('div');
    el.className = 'glow-orb';
    const size = 150 + Math.random() * 200;
    el.style.cssText = `
      left: ${Math.random() * 80}%;
      top: ${Math.random() * 80}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${6 + i * 2}s;
      animation-delay: ${i * 1.5}s;
    `;
    container.appendChild(el);
  });
}

function createBubbles(container) {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = 4 + Math.random() * 10;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -20px;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255,255,255,${0.3 + Math.random() * 0.5});
      animation-duration: ${5 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(el);
  }
}

/* ════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
   ════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll, .timeline-item, .polaroid, .quote-card, .collage-photo');
  
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════
   TYPING EFFECT
   ════════════════════════════════════ */
function typeText(element, texts, options = {}) {
  const {
    typingSpeed = 60,
    deletingSpeed = 35,
    pauseAfter = 2000,
    pauseBefore = 500,
    loop = false,
    onComplete = null
  } = options;

  if (!element) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  element.appendChild(cursor);

  function tick() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
      // Typing
      element.textContent = currentText.substring(0, charIndex + 1);
      element.appendChild(cursor);
      charIndex++;

      if (charIndex === currentText.length) {
        // Done typing this text
        if (textIndex === texts.length - 1 && !loop) {
          // Last text, no loop
          if (onComplete) setTimeout(onComplete, pauseAfter);
          return;
        }
        setTimeout(() => { isDeleting = true; tick(); }, pauseAfter);
        return;
      }
    } else {
      // Deleting
      element.textContent = currentText.substring(0, charIndex - 1);
      element.appendChild(cursor);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(tick, pauseBefore);
        return;
      }
    }

    setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
  }

  setTimeout(tick, 800);
}

// Export for other scripts
window.FD = {
  typeText,
  createFloatingHearts,
};
