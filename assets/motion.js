(() => {
  if (!document.body.classList.contains('home-v2')) return;

  if (!document.getElementById('padelwrist-home-responsive')) {
    const responsiveStyles = document.createElement('link');
    responsiveStyles.id = 'padelwrist-home-responsive';
    responsiveStyles.rel = 'stylesheet';
    responsiveStyles.href = '/assets/home-responsive.css';
    document.head.appendChild(responsiveStyles);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroImage = document.querySelector('.hero-v2-media img');
  const storyImage = document.querySelector('.story-photo img');
  const finalImage = document.querySelector('.final-v2 img');
  let ticking = false;

  function updateMotion() {
    const y = window.scrollY || 0;
    if (heroImage) {
      heroImage.style.transform = `translate3d(0, ${Math.min(y * 0.08, 48)}px, 0) scale(1.045)`;
    }

    [storyImage, finalImage].forEach((image) => {
      if (!image) return;
      const surface = image.closest('figure, section');
      const rect = surface?.getBoundingClientRect();
      if (!rect) return;
      const viewport = window.innerHeight || 1;
      const progress = (viewport - rect.top) / (viewport + rect.height);
      const offset = Math.max(-18, Math.min(18, (progress - 0.5) * 36));
      image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
    });

    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateMotion);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  requestUpdate();
})();
