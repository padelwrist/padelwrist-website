(() => {
  if (!document.body.classList.contains('home-v2')) return;

  const responsiveStyles = document.createElement('style');
  responsiveStyles.id = 'padelwrist-home-responsive-qa';
  responsiveStyles.textContent = `
    @media (max-width: 1100px) {
      .home-v2 .story-v2-head,
      .home-v2 .guides-v2-head {
        grid-template-columns: 1fr;
      }

      .home-v2 .story-v2-head > div,
      .home-v2 .story-v2-head > p,
      .home-v2 .guides-v2-head > div,
      .home-v2 .guides-v2-head > p:last-child {
        grid-column: auto !important;
      }

      .home-v2 .story-v2-head > p,
      .home-v2 .guides-v2-head > p:last-child {
        margin-top: 24px;
        justify-self: start;
        max-width: 620px;
      }

      .home-v2 .story-grid-v2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: none;
        grid-auto-rows: auto;
        align-items: stretch;
      }

      .home-v2 .story-photo {
        grid-column: 1 / -1 !important;
        grid-row: auto !important;
        min-height: 430px;
      }

      .home-v2 .story-card,
      .home-v2 .story-card.blue,
      .home-v2 .story-card.navy {
        grid-column: auto !important;
        grid-row: auto !important;
        min-height: 280px;
      }

      .home-v2 .story-card > strong {
        font-size: clamp(30px, 4vw, 40px);
        text-wrap: balance;
      }

      .home-v2 .role-grid-v2,
      .home-v2 .editorial-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .home-v2 .role-v2,
      .home-v2 .role-v2:nth-child(1),
      .home-v2 .role-v2:nth-child(2),
      .home-v2 .role-v2:nth-child(3),
      .home-v2 .editorial-card,
      .home-v2 .editorial-card:nth-child(1),
      .home-v2 .editorial-card:nth-child(2),
      .home-v2 .editorial-card:nth-child(3) {
        grid-column: auto !important;
      }

      .home-v2 .editorial-card:nth-child(3) {
        min-height: 420px;
      }
    }

    @media (max-width: 860px) {
      .home-v2 .story-grid-v2,
      .home-v2 .role-grid-v2,
      .home-v2 .editorial-grid {
        grid-template-columns: 1fr;
      }

      .home-v2 .story-photo,
      .home-v2 .story-card,
      .home-v2 .story-card.blue,
      .home-v2 .story-card.navy,
      .home-v2 .role-v2,
      .home-v2 .editorial-card {
        grid-column: 1 / -1 !important;
        grid-row: auto !important;
      }

      .home-v2 .story-photo {
        min-height: 390px;
      }

      .home-v2 .story-card,
      .home-v2 .story-card.blue,
      .home-v2 .story-card.navy {
        min-height: 230px;
        padding: 28px;
      }

      .home-v2 .role-v2,
      .home-v2 .role-v2 + .role-v2 {
        min-height: auto;
        padding: 28px 0;
        border-right: 0;
        border-bottom: 1px solid rgba(255,255,255,.12);
      }

      .home-v2 .role-v2:last-child {
        border-bottom: 0;
      }

      .home-v2 .editorial-card,
      .home-v2 .editorial-card:nth-child(3) {
        min-height: 350px;
      }
    }

    @media (max-width: 560px) {
      .home-v2 .story-photo {
        min-height: 340px;
      }

      .home-v2 .story-card,
      .home-v2 .story-card.blue,
      .home-v2 .story-card.navy {
        min-height: 210px;
        padding: 24px;
      }

      .home-v2 .story-card > strong {
        font-size: clamp(28px, 8vw, 34px);
      }

      .home-v2 .editorial-card,
      .home-v2 .editorial-card:nth-child(3) {
        min-height: 320px;
      }

      .home-v2 .editorial-card strong {
        font-size: clamp(22px, 6.4vw, 27px);
        text-wrap: balance;
      }
    }
  `;
  document.head.appendChild(responsiveStyles);

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
