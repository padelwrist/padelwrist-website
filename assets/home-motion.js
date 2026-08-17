(() => {
  if (!document.body.classList.contains('home-v2')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  const heroImage = document.querySelector('.hero-v2-media img');
  const storyImage = document.querySelector('.story-photo img');
  const finalImage = document.querySelector('.final-v2 img');
  const floatCard = document.querySelector('.hero-product-card');
  let ticking = false;

  function updateMotion() {
    const y = window.scrollY || 0;
    if (heroImage) heroImage.style.transform = `translate3d(0, ${Math.min(y * 0.08, 48)}px, 0) scale(1.045)`;

    [storyImage, finalImage].forEach((image) => {
      if (!image) return;
      const rect = image.closest('figure, section')?.getBoundingClientRect();
      if (!rect) return;
      const viewport = window.innerHeight || 1;
      const progress = (viewport - rect.top) / (viewport + rect.height);
      const offset = Math.max(-18, Math.min(18, (progress - 0.5) * 36));
      image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
    });

    if (floatCard) {
      const rect = floatCard.getBoundingClientRect();
      const centre = (rect.top + rect.height / 2) - window.innerHeight / 2;
      const offset = Math.max(-10, Math.min(10, centre * -0.015));
      floatCard.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

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