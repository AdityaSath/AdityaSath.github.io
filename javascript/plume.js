/* Original canvas artwork: a continuous exhaust stream moving right to left. */
(() => {
  'use strict';
  const canvas = document.querySelector('.plume-canvas');
  if (!canvas) return;
  const host = canvas.closest('.plume-hero');
  const context = canvas.getContext('2d');
  if (!context) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true, frame = 0, last = 0, time = 2.4, width = 1, height = 1;
  const paused = () => motion.matches || document.body.classList.contains('motion-paused');
  const fract = n => n - Math.floor(n);
  const random = n => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);

  // Cached glow sprites avoid expensive blur filters in the animation loop.
  function sprite(r, g, b) {
    const image = document.createElement('canvas'); image.width = image.height = 128;
    const c = image.getContext('2d');
    const gradient = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, `rgba(${r},${g},${b},.7)`);
    gradient.addColorStop(.2, `rgba(${r},${g},${b},.36)`);
    gradient.addColorStop(.5, `rgba(${r},${g},${b},.12)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    c.fillStyle = gradient; c.fillRect(0, 0, 128, 128); return image;
  }
  const amber = sprite(237, 122, 52), pale = sprite(255, 220, 163), blue = sprite(123, 144, 225);
  function glow(image, x, y, rx, ry, opacity) {
    context.globalAlpha = opacity;
    context.drawImage(image, x - rx, y - ry, rx * 2, ry * 2);
  }

  function render() {
    context.clearRect(0, 0, width, height);
    const mobile = width < 761;
    const sourceX = width * (mobile ? .96 : .9);
    const sourceY = height * (mobile ? .64 : .67);
    const length = width * 1.15;
    const unit = Math.min(width / 1440, height / 850);
    const aperture = Math.max(17, 31 * unit);
    const breath = 1 + Math.sin(time * .75) * .06;

    context.globalCompositeOperation = 'screen';
    glow(amber, sourceX - length * .26, sourceY, width * .76, height * .58, .28 * breath);
    glow(blue, sourceX - 45, sourceY, width * .32, height * .27, .23);

    // Layered turbulent ribbons. Every phase travels away from the nozzle, to the left.
    for (let layer = 0; layer < 20; layer++) {
      const n = layer / 19;
      const gradient = context.createLinearGradient(sourceX - length, 0, sourceX, 0);
      gradient.addColorStop(0, 'rgba(110,45,21,0)');
      gradient.addColorStop(.22, `rgba(182,75,31,${.016 + n * .005})`);
      gradient.addColorStop(.65, `rgba(239,151,81,${.03 + n * .015})`);
      gradient.addColorStop(1, `rgba(255,230,195,${.11 + n * .03})`);
      context.beginPath();
      const spread = 1 - n * .83;
      for (let side = 0; side < 2; side++) {
        for (let k = 0; k <= 80; k++) {
          const q = (side ? 80 - k : k) / 80;
          const x = sourceX - q * length;
          const taper = (aperture * .5 + q ** .8 * height * .16) * spread;
          const wave = Math.sin(q * 27 - time * 3 + layer * .73) * q * 8 + Math.sin(q * 53 - time * 4 + layer) * q * 4;
          const center = sourceY + Math.sin(q * 5 - time * .6) * q * height * .015;
          const y = center + (side ? 1 : -1) * taper + wave;
          if (!side && !k) context.moveTo(x, y); else context.lineTo(x, y);
        }
      }
      context.closePath(); context.globalAlpha = breath; context.fillStyle = gradient; context.fill();
    }

    // Soft eddies carry warm light across the width of the scene.
    const particles = mobile ? 64 : 105;
    for (let i = 0; i < particles; i++) {
      const age = fract(random(i + 1) + time * (.065 + random(i + 5) * .045));
      const x = sourceX - age * length;
      const spread = aperture * .35 + age ** .8 * height * .13;
      const displacement = (random(i + 160) - .5) * 2;
      const y = sourceY + displacement * spread + Math.sin(age * 15 - time * 1.5 + i) * age * 9;
      const fade = Math.sin(age * Math.PI) ** .7 * (1 - age * .55);
      const radius = 10 + age * (mobile ? 65 : 125);
      glow(i % 5 === 0 ? blue : (i % 3 === 0 ? pale : amber), x, y, radius * 2.4, radius * .65, fade * .18);
    }

    // A sequence of luminous compression diamonds defines the jet's bright core.
    for (let i = 0; i < 7; i++) {
      const distance = (42 + i * 112) * Math.max(.5, unit);
      const x = sourceX - distance;
      const rx = (34 + i * 5) * Math.max(.65, unit);
      const ry = (5 + i * 2.7) * Math.max(.7, unit);
      const power = (1 - i / 8) * (.84 + Math.sin(time * 3 - i) * .08);
      glow(pale, x, sourceY, rx * 1.6, ry * 3, power * .6);
      const gradient = context.createLinearGradient(x - rx, sourceY, x + rx, sourceY);
      gradient.addColorStop(0, '#e7995400'); gradient.addColorStop(.5, '#ffdfaf'); gradient.addColorStop(1, '#fff5dc00');
      context.globalAlpha = power * .32; context.fillStyle = gradient;
      context.beginPath(); context.moveTo(x - rx, sourceY); context.quadraticCurveTo(x, sourceY - ry * 1.5, x + rx, sourceY); context.quadraticCurveTo(x, sourceY + ry * 1.5, x - rx, sourceY); context.fill();
    }
    glow(pale, sourceX - 5, sourceY, aperture * 3.5, aperture * 2, .85);

    // The cropped engine bell gives the light a physical origin.
    context.globalCompositeOperation = 'source-over'; context.globalAlpha = 1;
    const bellLength = Math.max(150, width * .16), bellHeight = aperture * 1.5;
    const metal = context.createLinearGradient(0, sourceY - bellHeight, 0, sourceY + bellHeight);
    metal.addColorStop(0, '#535962'); metal.addColorStop(.15, '#1b2025'); metal.addColorStop(.5, '#080b0e'); metal.addColorStop(.8, '#24282d'); metal.addColorStop(1, '#86725e');
    context.beginPath(); context.moveTo(sourceX, sourceY - bellHeight);
    context.bezierCurveTo(sourceX + bellLength * .4, sourceY - bellHeight * .95, sourceX + bellLength * .65, sourceY - bellHeight * .32, sourceX + bellLength, sourceY - bellHeight * .32);
    context.lineTo(sourceX + bellLength, sourceY + bellHeight * .32);
    context.bezierCurveTo(sourceX + bellLength * .65, sourceY + bellHeight * .32, sourceX + bellLength * .4, sourceY + bellHeight * .95, sourceX, sourceY + bellHeight);
    context.closePath(); context.fillStyle = metal; context.fill(); context.strokeStyle = '#af99805c'; context.lineWidth = .8; context.stroke();
    context.save(); context.clip();
    for (let i = 1; i <= 6; i++) { context.beginPath(); context.moveTo(sourceX + i * 18, sourceY - bellHeight); context.lineTo(sourceX + i * 18, sourceY + bellHeight); context.strokeStyle = '#9eabb719'; context.stroke(); }
    context.restore();
    context.beginPath(); context.ellipse(sourceX, sourceY, Math.max(3, 7 * unit), bellHeight, 0, 0, Math.PI * 2); context.fillStyle = '#847263'; context.fill(); context.strokeStyle = '#e9d0a9'; context.stroke();
    context.globalCompositeOperation = 'screen';
    glow(pale, sourceX - 2, sourceY, aperture * .45, aperture * 1.9, 1);
    glow(amber, sourceX - 5, sourceY, aperture * 6, aperture * 5, .28);
    context.globalAlpha = 1; context.globalCompositeOperation = 'source-over';
  }

  function tick(now) {
    frame = 0;
    if (!visible || paused() || document.hidden) return;
    if (now - last >= 32) {
      time += last ? Math.min((now - last) / 1000, .08) : .033;
      last = now; render();
    }
    frame = requestAnimationFrame(tick);
  }
  function update() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    render();
    if (visible && !paused() && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = host.getBoundingClientRect(); width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0); render();
    host.classList.add('plume-ready');
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
  else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }).observe(host);
  new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  resize(); update();
})();
