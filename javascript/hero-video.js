/* The user-provided video, with motion preferences and a still-image fallback. */
(() => {
  'use strict';
  const video = document.querySelector('.hero-video');
  if (!video) return;
  const hero = video.closest('.plume-hero');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let pending = false;
  let introReady = false;
  const motionAllowed = () => !preference.matches && !document.body.classList.contains('motion-paused');
  const canPlay = () => introReady && visible && !document.hidden && motionAllowed();
  video.muted = true;
  video.defaultMuted = true;

  function update() {
    hero.classList.toggle('video-pending', !introReady && motionAllowed());
    if (!canPlay()) {
      video.pause();
      if (preference.matches) hero.classList.remove('video-ready');
      return;
    }
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    if (pending || !video.paused) return;
    pending = true;
    video.play().catch(() => {
      // A blocked autoplay or failed load leaves the poster visible.
      if (video.readyState < 2) hero.classList.remove('video-ready');
    }).finally(() => { pending = false; });
  }
  video.addEventListener('playing', () => {
    if (!canPlay()) { video.pause(); return; }
    hero.classList.add('video-ready');
  });
  video.addEventListener('error', () => hero.classList.remove('video-ready'));
  new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  if ('IntersectionObserver' in window) {
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio > .05;
      update();
    }, { rootMargin: `-${headerHeight}px 0px 0px 0px`, threshold: [0, .05] }).observe(hero);
  }
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', update);
  function scheduleIntro() {
    // Buffer during the one-second pause so the entrance starts promptly.
    if (motionAllowed()) {
      video.preload = 'auto';
      video.src = video.dataset.src;
      video.load();
    }
    setTimeout(() => {
      introReady = true;
      update();
    }, 1000);
  }
  if (document.readyState === 'complete') scheduleIntro();
  else window.addEventListener('load', scheduleIntro, { once: true });
  update();
})();
