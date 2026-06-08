/* ================================================
   animations.js — Visual Effects
   Confetti, Fireworks, Gift Box, Heart Explosions
   ================================================ */

'use strict';

/* ════════════════════════════════════
   CONFETTI SYSTEM
   ════════════════════════════════════ */
class ConfettiSystem {
  constructor(canvasId) {
    this.canvas  = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx     = this.canvas.getContext('2d');
    this.pieces  = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createPiece() {
    const colors = ['#ff6eb4','#c94aff','#ffb3de','#ffd700','#a8e6cf','#ff8fab','#dda0dd','#87ceeb'];
    const shapes = ['rect','circle','heart'];
    return {
      x:      Math.random() * this.canvas.width,
      y:      -20,
      w:      6 + Math.random() * 10,
      h:      6 + Math.random() * 10,
      color:  colors[Math.floor(Math.random() * colors.length)],
      shape:  shapes[Math.floor(Math.random() * shapes.length)],
      vx:     (Math.random() - 0.5) * 3,
      vy:     2 + Math.random() * 4,
      vr:     (Math.random() - 0.5) * 0.2,
      r:      Math.random() * Math.PI * 2,
      alpha:  1,
      gravity:0.05 + Math.random() * 0.05,
    };
  }

  drawPiece(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);

    if (p.shape === 'rect') {
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    } else if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.w/2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Heart shape
      const s = p.w / 14;
      ctx.beginPath();
      ctx.moveTo(0, -s*2);
      ctx.bezierCurveTo(s*3, -s*5, s*7, -s*1, 0, s*4);
      ctx.bezierCurveTo(-s*7, -s*1, -s*3, -s*5, 0, -s*2);
      ctx.fill();
    }
    ctx.restore();
  }

  update() {
    if (!this.running || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Spawn new pieces
    if (this.pieces.length < 180) {
      for (let i = 0; i < 5; i++) {
        this.pieces.push(this.createPiece());
      }
    }

    // Update & draw
    this.pieces = this.pieces.filter(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.r  += p.vr;
      if (p.y > this.canvas.height * 0.8) p.alpha -= 0.02;
      this.drawPiece(p);
      return p.alpha > 0;
    });

    this.raf = requestAnimationFrame(() => this.update());
  }

  start(duration = 5000) {
    if (!this.canvas) return;
    this.running = true;
    this.update();
    if (duration > 0) {
      setTimeout(() => this.stop(), duration);
    }
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    setTimeout(() => {
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }, 2000);
  }

  burst() {
    // Instant burst from center
    for (let i = 0; i < 80; i++) {
      const p = this.createPiece();
      p.x  = this.canvas.width / 2;
      p.y  = this.canvas.height / 2;
      p.vx = (Math.random() - 0.5) * 15;
      p.vy = (Math.random() - 0.5) * 15;
      this.pieces.push(p);
    }
    if (!this.running) {
      this.running = true;
      this.update();
      setTimeout(() => this.stop(), 4000);
    }
  }
}

/* ════════════════════════════════════
   FIREWORKS SYSTEM
   ════════════════════════════════════ */
class FireworksSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx      = this.canvas.getContext('2d');
    this.particles= [];
    this.running  = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  explode(x, y) {
    const colors = ['#ff6eb4','#c94aff','#ffd700','#ff8fab','#80ff80','#87ceeb','#ffb347'];
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const count  = 50 + Math.floor(Math.random() * 40);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x, y,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        color,
        alpha: 1,
        size:  1 + Math.random() * 3,
        gravity: 0.08,
        trail: [],
      });
    }
  }

  update() {
    if (!this.running || !this.canvas) return;

    this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => {
      p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
      if (p.trail.length > 6) p.trail.shift();

      // Draw trail
      p.trail.forEach((t, i) => {
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y, p.size * (i/p.trail.length), 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = t.alpha * (i/p.trail.length) * 0.4;
        this.ctx.fill();
      });

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();

      p.x     += p.vx;
      p.y     += p.vy;
      p.vy    += p.gravity;
      p.vx    *= 0.98;
      p.alpha -= 0.018;

      this.ctx.globalAlpha = 1;
      return p.alpha > 0;
    });

    this.raf = requestAnimationFrame(() => this.update());
  }

  start(duration = 6000) {
    if (!this.canvas) return;
    this.running = true;
    this.update();

    const interval = setInterval(() => {
      if (!this.running) { clearInterval(interval); return; }
      this.explode(
        100 + Math.random() * (this.canvas.width - 200),
        80  + Math.random() * (this.canvas.height * 0.6)
      );
    }, 400);

    setTimeout(() => {
      this.running = false;
      clearInterval(interval);
      cancelAnimationFrame(this.raf);
      setTimeout(() => {
        if (this.ctx && this.canvas) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
      }, 2000);
    }, duration);
  }
}

/* ════════════════════════════════════
   FLOATING HEARTS BURST
   ════════════════════════════════════ */
function heartExplosion(count = 30) {
  const hearts = ['❤️','💕','💖','💗','💝','💓','💞'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      const startX = 30 + Math.random() * 40;
      const startY = 40 + Math.random() * 20;
      el.style.cssText = `
        position: fixed;
        left: ${startX}%;
        top: ${startY}%;
        font-size: ${1.5 + Math.random() * 2}rem;
        pointer-events: none;
        z-index: 9500;
        animation: floatHeart ${2 + Math.random() * 2}s ease forwards;
        filter: drop-shadow(0 0 8px rgba(233,30,140,0.6));
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 80);
  }
}

/* ════════════════════════════════════
   GIFT BOX ANIMATION (reveal.html)
   ════════════════════════════════════ */
function initGiftBox() {
  const gift = document.getElementById('gift-box');
  if (!gift) return;

  gift.addEventListener('click', () => {
    gift.classList.add('opening');
    heartExplosion(20);

    // Particle burst around gift
    const rect = gift.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random() * 4)];
        particle.style.cssText = `
          position: fixed;
          left: ${cx + (Math.random()-0.5)*200}px;
          top:  ${cy + (Math.random()-0.5)*200}px;
          font-size: ${1 + Math.random()}rem;
          pointer-events: none;
          z-index: 9500;
          animation: sparkleAnim ${0.8 + Math.random()}s ease forwards;
        `;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
      }, i * 50);
    }
  });
}

/* ════════════════════════════════════
   CELEBRATE BUTTON (finale.html)
   ════════════════════════════════════ */
function initCelebrate() {
  const btn = document.getElementById('celebrate-btn');
  if (!btn) return;

  const confetti  = new ConfettiSystem('confetti-canvas');
  const fireworks = new FireworksSystem('fireworks-canvas');

  btn.addEventListener('click', () => {
    confetti.burst();
    confetti.start(0); // continuous
    fireworks.start(6000);
    heartExplosion(40);

    // Stop confetti after 8s
    setTimeout(() => confetti.stop(), 8000);

    // Button animation
    btn.textContent = '🎊 Celebrating! 🎊';
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => {
      btn.textContent = '🎉 CELEBRATE 🎉';
      btn.style.transform = '';
    }, 3000);
  });
}

/* ── Init on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  initGiftBox();
  initCelebrate();
});

// Expose for inline use
window.FDAnimations = { heartExplosion, ConfettiSystem, FireworksSystem };
