/* ================================================
   gallery.js — Photo Gallery Functionality
   Lightbox, Slideshow, Swipe, Lazy Loading
   ================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initSlideshow();
});

/* ════════════════════════════════════
   GALLERY & LIGHTBOX
   ════════════════════════════════════ */
function initGallery() {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbClose   = document.getElementById('lb-close');
  const lbPrev    = document.getElementById('lb-prev');
  const lbNext    = document.getElementById('lb-next');
  const polaroids = document.querySelectorAll('.polaroid');

  if (!lightbox || !lbImg || !polaroids.length) return;

  let currentIndex = 0;
  const images = Array.from(polaroids).map(p => ({
    src: p.querySelector('img').src,
    caption: p.querySelector('.polaroid-caption')?.textContent || ''
  }));

  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = images[currentIndex].src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    addHeartBurst(lightbox);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lbImg.style.animation = 'none';
    requestAnimationFrame(() => {
      lbImg.style.animation = '';
      lbImg.src = images[currentIndex].src;
    });
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImg.style.animation = 'none';
    requestAnimationFrame(() => {
      lbImg.style.animation = '';
      lbImg.src = images[currentIndex].src;
    });
  }

  // Click handlers
  polaroids.forEach((p, i) => {
    p.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'Escape')     closeLightbox();
  });

  // Touch / Swipe support
  let touchStartX = 0;
  let touchEndX   = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNext();
      else showPrev();
    }
  }, { passive: true });
}

/* ════════════════════════════════════
   AUTO SLIDESHOW
   ════════════════════════════════════ */
function initSlideshow() {
  const playBtn  = document.getElementById('slideshow-play');
  const stopBtn  = document.getElementById('slideshow-stop');
  if (!playBtn) return;

  let slideshowInterval = null;
  let isPlaying = false;

  const polaroids = document.querySelectorAll('.polaroid');
  let slideshowIndex = 0;

  function highlightCard(index) {
    polaroids.forEach((p, i) => {
      p.style.transform = i === index
        ? 'scale(1.08) rotate(0deg) translateY(-10px)'
        : '';
      p.style.zIndex = i === index ? '20' : '';
      p.style.boxShadow = i === index
        ? '0 30px 70px rgba(180,100,200,0.4)'
        : '';
    });
  }

  function nextSlide() {
    slideshowIndex = (slideshowIndex + 1) % polaroids.length;
    highlightCard(slideshowIndex);
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) return;
    isPlaying = true;
    playBtn.classList.add('active');
    stopBtn.classList.remove('active');
    slideshowInterval = setInterval(nextSlide, 2000);
  });

  stopBtn.addEventListener('click', () => {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(slideshowInterval);
    stopBtn.classList.add('active');
    playBtn.classList.remove('active');
    polaroids.forEach(p => {
      p.style.transform = '';
      p.style.zIndex = '';
      p.style.boxShadow = '';
    });
  });
}

/* ════════════════════════════════════
   HEART BURST (on lightbox open)
   ════════════════════════════════════ */
function addHeartBurst(container) {
  const hearts = ['❤️','💕','💖','🌸','✨'];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.cssText = `
      position: fixed;
      font-size: ${1 + Math.random()}rem;
      left: ${20 + Math.random() * 60}%;
      top: ${20 + Math.random() * 60}%;
      pointer-events: none;
      z-index: 9100;
      animation: floatHeart ${1.5 + Math.random()}s ease forwards;
      opacity: 0.8;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}
