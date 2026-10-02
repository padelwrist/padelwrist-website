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
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const heroImage = document.querySelector('.hero-v2-media img');
  if (heroImage) {
    gsap.set(heroImage, { scale: 1.045 });
    gsap.to(heroImage, {
      yPercent: 8,
      scale: 1.085,
      ease: 'none',
      scrollTrigger: { trigger: '.hero-v2', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  gsap.from('.hero-v2-copy > *', {
    y: 24,
    opacity: 0,
    duration: .85,
    stagger: .09,
    ease: 'power3.out',
    delay: .12
  });

  gsap.utils.toArray('.product-shot').forEach((shot, index) => {
    gsap.fromTo(shot,
      { y: 52 + (index * 12), scale: .965 },
      {
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: shot, start: 'top 88%', end: 'top 48%', scrub: 1 }
      }
    );

    const image = shot.querySelector('img');
    if (image) {
      gsap.fromTo(image,
        { scale: .94 },
        {
          scale: 1.025,
          ease: 'none',
          scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    }
  });

  gsap.utils.toArray('.story-photo img, .editorial-card img, .final-v2 img').forEach((image) => {
    gsap.fromTo(image,
      { scale: 1.015, yPercent: -2 },
      {
        scale: 1.065,
        yPercent: 3,
        ease: 'none',
        scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  });
})();
