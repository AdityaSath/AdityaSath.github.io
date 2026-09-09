/* Progressive enhancements: all navigation and content work without JavaScript. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  try { userPaused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}
  const motionOff = () => preference.matches || userPaused;
  const animations = new Set();
  const decoders = new Set();
  const pauseButton = document.querySelector('.motion-toggle');

  function syncMotion() {
    document.body.classList.toggle('motion-paused', motionOff());
    if (pauseButton) {
      pauseButton.hidden = false;
      pauseButton.textContent = preference.matches ? 'Reduced motion enabled' : (userPaused ? 'Resume motion' : 'Pause motion');
      pauseButton.setAttribute('aria-pressed', String(motionOff()));
      pauseButton.disabled = preference.matches;
    }
    if (motionOff()) decoders.forEach(finish => finish());
    animations.forEach(animation => animation.update());
  }
  pauseButton?.addEventListener('click', () => {
    userPaused = !userPaused;
    try { localStorage.setItem('portfolio-motion', userPaused ? 'paused' : 'playing'); } catch {}
    syncMotion();
  });
  preference.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) decoders.forEach(finish => finish());
    animations.forEach(animation => animation.update());
  });

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu(returnFocus = false) {
    menuButton?.setAttribute('aria-expanded', 'false');
    navigation?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (menuButton) menuButton.lastElementChild.textContent = '+';
    if (returnFocus) menuButton?.focus();
  }
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.lastElementChild.textContent = open ? '−' : '+';
  });
  navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  // Keep a stable, screen-reader-accessible copy alongside the animated glyphs.
  const glyphs = '01/+×_<>:░';
  function prepareDecoder(element) {
    const text = element.textContent;
    const accessible = document.createElement('span');
    accessible.className = 'sr-only';
    accessible.textContent = text;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    visual.textContent = text;
    element.replaceChildren(accessible, visual);
    let frame = 0;
    let running = false;
    function finish() {
      cancelAnimationFrame(frame);
      visual.textContent = text;
      element.classList.remove('decode-active');
      element.style.minWidth = '';
      running = false;
      decoders.delete(finish);
    }
    function play() {
      if (motionOff() || document.hidden || running) return;
      running = true;
      decoders.add(finish);
      element.style.minWidth = `${element.getBoundingClientRect().width}px`;
      element.classList.add('decode-active');
      const start = performance.now();
      const duration = element.closest('nav, .button') ? 300 : 650;
      let last = 0;
      function tick(now) {
        const progress = (now - start) / duration;
        if (progress >= 1 || motionOff()) { finish(); return; }
        if (now - last > 38) {
          last = now;
          visual.textContent = [...text].map((char, index) => char === ' ' || index / text.length < progress ? char : glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
        }
        frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }
    const interactive = element.closest('a, button');
    interactive?.addEventListener('pointerenter', play);
    interactive?.addEventListener('focus', play);
    if (element.hasAttribute('data-intro')) setTimeout(play, 450);
    else if (!interactive && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { play(); observer.disconnect(); }
      }, { threshold: 0.8 });
      observer.observe(element);
    }
  }
  document.querySelectorAll('[data-decode]').forEach(prepareDecoder);

  // Lightweight illustrative previews; these do not run the original Python models.
  function simulation(host) {
    const canvas = host.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const kind = host.dataset.simulation;
    let width = 1, height = 1, visible = false, raf = 0, last = 0, time = 0;
    let pointer = null;
    const count = window.innerWidth < 761 ? 35 : 60;
    const birds = Array.from({ length: count }, (_, i) => ({
      x: (i * 0.618034) % 1, y: (i * 0.414214) % 1,
      vx: Math.cos(i * 2.39996) * 28, vy: Math.sin(i * 2.39996) * 28,
    }));
    const hunters = Array.from({ length: 6 }, (_, i) => ({ x: 0.2 + i * .065, y: .25 + (i % 3) * .2, trail: [] }));
    const obstacles = [{ x: .3, y: .38, r: .06 }, { x: .65, y: .68, r: .075 }, { x: .8, y: .24, r: .04 }];
    function triangle(x, y, angle, color, size = 5) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      ctx.beginPath(); ctx.moveTo(size * 1.4, 0); ctx.lineTo(-size, -size * .7); ctx.lineTo(-size * .4, 0); ctx.lineTo(-size, size * .7); ctx.closePath();
      ctx.fillStyle = color; ctx.fill(); ctx.restore();
    }
    function swarm(dt) {
      const target = pointer || { x: .54 + Math.sin(time * .3) * .22, y: .48 + Math.cos(time * .43) * .22 };
      for (const obstacle of obstacles) {
        ctx.beginPath(); ctx.arc(obstacle.x * width, obstacle.y * height, obstacle.r * Math.min(width, height), 0, Math.PI * 2);
        ctx.fillStyle = '#709b9120'; ctx.fill(); ctx.strokeStyle = '#709b9140'; ctx.stroke();
      }
      ctx.save(); ctx.setLineDash([3, 6]); ctx.beginPath(); ctx.arc(target.x * width, target.y * height, 65, 0, Math.PI * 2); ctx.strokeStyle = '#dfa96d30'; ctx.stroke(); ctx.restore();
      hunters.forEach((hunter, i) => {
        const angle = i * Math.PI / 3 + time * .18;
        const desired = { x: target.x + Math.cos(angle) * .15, y: target.y + Math.sin(angle) * .21 };
        const dx = desired.x - hunter.x, dy = desired.y - hunter.y;
        if (dt) {
          hunter.x += dx * dt * .95; hunter.y += dy * dt * .95;
          hunter.trail.push([hunter.x * width, hunter.y * height]);
          if (hunter.trail.length > 45) hunter.trail.shift();
        }
        ctx.beginPath(); hunter.trail.forEach(([x, y], j) => j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)); ctx.strokeStyle = '#90c9bc55'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hunter.x * width, hunter.y * height); ctx.lineTo(target.x * width, target.y * height); ctx.strokeStyle = '#7eb8aa25'; ctx.stroke();
        triangle(hunter.x * width, hunter.y * height, Math.atan2(dy * height, dx * width), '#a6d1c4', 5);
        ctx.font = '8px monospace'; ctx.fillStyle = '#9cbdb280'; ctx.fillText(`0${i + 1}`, hunter.x * width + 12, hunter.y * height - 8);
      });
      ctx.beginPath(); ctx.arc(target.x * width, target.y * height, 5, 0, Math.PI * 2); ctx.fillStyle = '#dfa96d'; ctx.fill();
      ctx.strokeStyle = '#dfa96d60'; ctx.strokeRect(target.x * width - 11, target.y * height - 11, 22, 22);
    }
    function flock(dt) {
      const next = birds.map(bird => {
        let ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0, neighbors = 0;
        for (const other of birds) {
          if (bird === other) continue;
          const dx = (other.x - bird.x) * width, dy = (other.y - bird.y) * height;
          const distance = dx * dx + dy * dy;
          if (distance < 90 * 90) {
            neighbors++; ax += other.vx; ay += other.vy; cx += dx; cy += dy;
            if (distance < 28 * 28 && distance > .01) { sx -= dx / distance; sy -= dy / distance; }
          }
        }
        let vx = bird.vx, vy = bird.vy;
        if (neighbors) {
          vx += ((ax / neighbors - vx) * .6 + cx / neighbors * .24 + sx * 90) * dt;
          vy += ((ay / neighbors - vy) * .6 + cy / neighbors * .24 + sy * 90) * dt;
        }
        if (pointer) {
          const dx = (bird.x - pointer.x) * width, dy = (bird.y - pointer.y) * height;
          const distance = Math.hypot(dx, dy);
          if (distance < 110 && distance > 1) { vx += dx / distance * dt * 90; vy += dy / distance * dt * 90; }
        }
        const speed = Math.hypot(vx, vy) || 1;
        const clipped = Math.max(22, Math.min(52, speed));
        vx = vx / speed * clipped; vy = vy / speed * clipped;
        return { x: (bird.x + vx * dt / width + 1) % 1, y: (bird.y + vy * dt / height + 1) % 1, vx, vy };
      });
      birds.forEach((bird, i) => {
        Object.assign(bird, next[i]);
        triangle(bird.x * width, bird.y * height, Math.atan2(bird.vy, bird.vx), i % 9 === 0 ? '#dfa96d' : '#a4b6cb', i % 9 === 0 ? 4.8 : 3.4);
      });
    }
    function draw(dt) {
      ctx.clearRect(0, 0, width, height);
      if (kind === 'swarm') swarm(dt); else flock(dt);
    }
    function tick(now) {
      raf = 0;
      if (!visible || motionOff() || document.hidden) return;
      if (now - last >= 32) {
        const dt = last ? Math.min((now - last) / 1000, .06) : .033;
        last = now; time += dt; draw(dt);
      }
      raf = requestAnimationFrame(tick);
    }
    function update() {
      cancelAnimationFrame(raf); raf = 0; last = 0;
      if (visible && !motionOff() && !document.hidden) raf = requestAnimationFrame(tick);
      else draw(0);
    }
    function resize() {
      const rect = host.getBoundingClientRect();
      width = Math.max(rect.width, 1); height = Math.max(rect.height, 1);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hunters.forEach(hunter => { hunter.trail = []; }); draw(0);
    }
    host.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      pointer = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
    }, { passive: true });
    host.addEventListener('pointerleave', () => { pointer = null; });
    new ResizeObserver(resize).observe(host);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { rootMargin: '80px' }).observe(host);
    animations.add({ update }); resize();
  }
  if ('IntersectionObserver' in window && 'ResizeObserver' in window) document.querySelectorAll('[data-simulation]').forEach(simulation);
  syncMotion();
})();
