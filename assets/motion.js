(() => {
  if (!document.body.classList.contains('home-v2')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const heroImage = document.querySelector('.hero-v2-media img');
  if (heroImage) {
    gsap.set(heroImage, { scale: 1.03 });
    gsap.to(heroImage, {
      yPercent: 6,
      scale: 1.06,
      ease: 'none',
      scrollTrigger: { trigger: '.hero-v2', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  gsap.from('.hero-v2-copy > *', {
    y: 20,
    opacity: 0,
    duration: .75,
    stagger: .08,
    ease: 'power3.out',
    delay: .1
  });

  gsap.utils.toArray('.product-shot').forEach((shot) => {
    gsap.fromTo(shot,
      { y: 32, scale: .98 },
      {
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: shot, start: 'top 90%', end: 'top 55%', scrub: .8 }
      }
    );
  });

  gsap.utils.toArray('.story-photo img, .editorial-card img, .final-v2 img').forEach((image) => {
    gsap.fromTo(image,
      { scale: 1.01 },
      {
        scale: 1.045,
        ease: 'none',
        scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  });
})();
