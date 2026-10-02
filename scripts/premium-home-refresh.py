from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise SystemExit(f"Expected {label} block not found")
    return text.replace(old, new, 1)


# Homepage structure: keep product truth and existing content, but remove fabricated UI
# and use the real app screenshots already held in the repository.
index_path = Path('index.html')
index = index_path.read_text()

index = replace_once(
    index,
    '  <script src="/assets/site.js" defer></script>\n  <script src="/assets/motion.js" defer></script>',
    '  <script src="/assets/site.js" defer></script>\n  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" defer></script>\n  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" defer></script>\n  <script src="/assets/motion.js" defer></script>',
    'GSAP script',
)

index = replace_once(
    index,
    '        <div class="hero-v2-meta"><span>Apple Watch first</span><span>Insights after every match</span><span>No account required</span></div>',
    '        <p class="hero-v2-meta">Apple Watch first · Insights after every match · No PadelWrist account required</p>',
    'hero proof line',
)

old_devices = '''      <div class="device-stack reveal" aria-label="Illustrative PadelWrist interface across Apple Watch, iPhone and iPad">
        <div class="device-panel device-watch"><div class="device-label"><span>Apple Watch</span><span>Live</span></div><div class="device-screen-title">Team One serving</div><div class="score-pair"><div><small>Team One</small><b>40</b></div><div><small>Team Two</small><b>30</b></div></div><div class="match-row"><span>Games</span><strong>4–3</strong></div><div class="match-row"><span>Sets</span><strong>1–0</strong></div></div>
        <div class="device-panel device-phone"><div class="device-label"><span>iPhone</span><span>Match</span></div><div class="device-screen-title">Match in progress</div><div class="score-pair"><div><small>Team One</small><b>40</b></div><div><small>Team Two</small><b>30</b></div></div><div class="match-row"><span>Server</span><strong>Team One</strong></div><div class="match-row"><span>Format</span><strong>Standard</strong></div><div class="match-row"><span>Insights</span><strong>Recent form</strong></div></div>
        <div class="device-panel device-pad"><div class="device-label"><span>iPad</span><span>Courtside</span></div><div class="device-screen-title">A bigger view of the same match.</div><div class="match-row"><span>Team One</span><strong>40 · 4 · 1</strong></div><div class="match-row"><span>Team Two</span><strong>30 · 3 · 0</strong></div></div>
      </div>'''
new_devices = '''      <div class="product-showcase reveal" aria-label="Real PadelWrist app screens">
        <figure class="product-shot product-shot-primary">
          <div class="product-shot-frame"><img src="/assets/iphone-play.png" alt="PadelWrist play screen on iPhone" loading="lazy" decoding="async"></div>
          <figcaption><strong>Set up on iPhone.</strong><span>Players, format and match details are ready before the first serve.</span></figcaption>
        </figure>
        <div class="product-showcase-side">
          <figure class="product-shot product-shot-watch">
            <div class="product-shot-frame"><img src="/assets/watch-fixedpoints.png" alt="PadelWrist Fixed Points scoring on Apple Watch" loading="lazy" decoding="async"></div>
            <figcaption><strong>Score from your wrist.</strong><span>The live interaction stays fast enough to disappear between rallies.</span></figcaption>
          </figure>
          <figure class="product-shot product-shot-secondary">
            <div class="product-shot-frame"><img src="/assets/iphone-standardmatch.png" alt="PadelWrist Standard Match setup on iPhone" loading="lazy" decoding="async"></div>
            <figcaption><strong>Keep the match useful afterwards.</strong><span>History and Insights turn a finished score into something you can learn from.</span></figcaption>
          </figure>
        </div>
      </div>'''
index = replace_once(index, old_devices, new_devices, 'product showcase')
index_path.write_text(index)


# Premium art-direction pass, kept in the existing homepage stylesheet in line with
# the project's architecture rather than creating another override stylesheet.
home_path = Path('assets/home.css')
home = home_path.read_text()
marker = '/* gpt-taste premium homepage pass */'
if marker in home:
    home = home.split(marker, 1)[0].rstrip() + '\n'

home += r'''

/* gpt-taste premium homepage pass */
.home-v2 {
  background:
    radial-gradient(circle at 14% 12%, rgba(51,95,255,.12), transparent 31rem),
    radial-gradient(circle at 86% 50%, rgba(128,153,249,.07), transparent 34rem),
    #020711;
}
.home-v2 .site-header .nav-wrap {
  width: min(1180px, calc(100% - (var(--pw-edge) * 2)));
  min-height: 64px;
  margin-top: 18px;
  padding: 0 18px;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 20px;
  background: rgba(3,8,18,.64);
  box-shadow: 0 18px 60px rgba(0,0,0,.22);
  backdrop-filter: blur(22px) saturate(135%);
  -webkit-backdrop-filter: blur(22px) saturate(135%);
}
.home-v2 .site-nav a[href*="fider.io"],
.home-v2 .site-nav a[href="/privacy/"] { display: none; }

.home-v2 .hero-v2 {
  min-height: min(940px, 96vh);
}
.home-v2 .hero-v2::before {
  background:
    linear-gradient(90deg, rgba(2,7,17,.97) 0%, rgba(2,7,17,.83) 39%, rgba(2,7,17,.28) 70%, rgba(2,7,17,.35) 100%),
    linear-gradient(0deg, #020711 0%, rgba(2,7,17,.58) 27%, transparent 63%);
}
.home-v2 .hero-v2::after {
  background:
    radial-gradient(circle at 72% 41%, rgba(51,95,255,.20), transparent 34%),
    radial-gradient(circle at 47% 78%, rgba(236,254,0,.055), transparent 24%);
}
.home-v2 .hero-v2-inner { padding-bottom: 104px; }
.home-v2 .hero-v2-copy {
  grid-column: 1 / span 8;
  max-width: 930px;
}
.home-v2 .hero-v2 h1,
.home-v2 .section-display,
.home-v2 .final-v2 h2,
.home-v2 .story-photo-copy strong,
.home-v2 .story-card > strong {
  text-transform: none;
  letter-spacing: -.045em;
}
.home-v2 .hero-v2 h1 {
  max-width: 920px;
  font-size: clamp(58px, 6.8vw, 108px);
  line-height: .91;
}
.home-v2 .hero-v2-intro {
  max-width: 650px;
  margin-top: 32px;
  color: rgba(247,248,251,.78);
  font-size: clamp(17px,1.4vw,20px);
}
.home-v2 .hero-v2-meta {
  max-width: 660px;
  margin: 28px 0 0;
  color: rgba(255,255,255,.48);
  font-size: 12px;
  letter-spacing: .015em;
}
.home-v2 .hero-v2-meta::before { content: none; }
.home-v2 .hero-v2-actions { margin-top: 34px; gap: 18px; }
.home-v2 .hero-v2-secondary {
  border: 0;
  border-bottom: 1px solid rgba(255,255,255,.32);
  border-radius: 0;
  background: transparent;
  backdrop-filter: none;
}

.home-v2 .proof-bar-v2 { background: rgba(2,7,17,.88); }
.home-v2 .proof-bar-v2-inner {
  min-height: 72px;
  color: rgba(255,255,255,.46);
  letter-spacing: .065em;
}

.home-v2 .story-v2 { padding-top: 152px; padding-bottom: 164px; }
.home-v2 .story-v2-head { margin-bottom: 72px; }
.home-v2 .story-grid-v2 {
  gap: 1px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 32px;
  background: rgba(255,255,255,.09);
}
.home-v2 .story-photo,
.home-v2 .story-card { border-radius: 0; }
.home-v2 .story-card.blue {
  background: linear-gradient(145deg, #315bff 0%, #2549df 100%);
}
.home-v2 .story-card.navy {
  border: 0;
  background:
    radial-gradient(circle at 82% 16%, rgba(128,153,249,.16), transparent 38%),
    linear-gradient(145deg,#102c3e,#06111b);
}
.home-v2 .story-photo img,
.home-v2 .editorial-card img {
  transition: transform .8s var(--pw-ease), filter .8s var(--pw-ease);
}
.home-v2 .story-photo:hover img,
.home-v2 .editorial-card:hover img { transform: scale(1.045); }

.home-v2 .product-band-v2 {
  padding: 152px 0 164px;
  background:
    radial-gradient(circle at 76% 20%, rgba(51,95,255,.38), transparent 34rem),
    radial-gradient(circle at 18% 82%, rgba(128,153,249,.13), transparent 30rem),
    linear-gradient(150deg,#07111e 0%,#06101d 48%,#020711 100%);
}
.home-v2 .product-band-v2::before {
  background: linear-gradient(180deg, rgba(255,255,255,.025), transparent 32%);
}
.home-v2 .product-v2-copy { max-width: 970px; }
.home-v2 .product-v2-copy p:not(.section-kicker) { max-width: 680px; }
.home-v2 .product-v2::after { display: none; }
.home-v2 .device-stack { display: none !important; }
.home-v2 .product-showcase {
  margin-top: 82px;
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 24px;
  align-items: stretch;
}
.home-v2 .product-showcase-side {
  display: grid;
  grid-template-rows: minmax(0, .82fr) minmax(0, 1.18fr);
  gap: 24px;
}
.home-v2 .product-shot {
  min-width: 0;
  margin: 0;
  padding: 26px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 30px;
  background: linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025));
  box-shadow: 0 28px 80px rgba(0,0,0,.24);
  transition: transform .5s var(--pw-ease), border-color .5s ease, background .5s ease;
}
.home-v2 .product-shot:hover {
  transform: translateY(-5px);
  border-color: rgba(128,153,249,.34);
  background: linear-gradient(145deg,rgba(255,255,255,.095),rgba(255,255,255,.035));
}
.home-v2 .product-shot-frame {
  height: 510px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 22px;
  background:
    radial-gradient(circle at 50% 22%, rgba(51,95,255,.20), transparent 42%),
    #02050b;
}
.home-v2 .product-shot-primary .product-shot-frame { height: 690px; }
.home-v2 .product-shot-watch .product-shot-frame { height: 260px; }
.home-v2 .product-shot-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 24px 42px rgba(0,0,0,.30));
  will-change: transform;
}
.home-v2 .product-shot figcaption {
  padding: 24px 2px 2px;
  display: grid;
  gap: 7px;
}
.home-v2 .product-shot figcaption strong {
  font-family: var(--pw-display);
  font-size: clamp(22px,2vw,30px);
  font-weight: 600;
  letter-spacing: -.03em;
}
.home-v2 .product-shot figcaption span {
  max-width: 48ch;
  color: rgba(247,248,251,.56);
  font-size: 14px;
  line-height: 1.55;
}

.home-v2 .roles-v2 { padding-top: 148px; padding-bottom: 154px; }
.home-v2 .roles-v2-head { max-width: 920px; margin-bottom: 64px; }
.home-v2 .role-v2 {
  transition: background .4s ease, transform .4s var(--pw-ease);
}
.home-v2 .role-v2:hover {
  background: rgba(255,255,255,.018);
  transform: translateY(-3px);
}

.home-v2 .guides-band-v2 { padding-top: 142px; padding-bottom: 152px; }
.home-v2 .editorial-card { border-radius: 24px; }
.home-v2 .editorial-card:hover { transform: translateY(-7px); }

.home-v2 .faq-v2 { padding-top: 142px; padding-bottom: 150px; }
.home-v2 .final-v2 {
  min-height: 680px;
  margin-bottom: 110px;
  border-radius: 36px;
  box-shadow: 0 36px 100px rgba(0,0,0,.28);
}
.home-v2 .final-v2-copy { max-width: 830px; padding: 72px; }
.home-v2 .final-v2 h2 { font-size: clamp(54px,6.2vw,88px); }

@media (max-width: 1024px) {
  .home-v2 .product-showcase { grid-template-columns: 1fr; }
  .home-v2 .product-showcase-side { grid-template-columns: 1fr 1fr; grid-template-rows: none; }
  .home-v2 .product-shot-primary .product-shot-frame { height: 620px; }
  .home-v2 .product-shot-secondary .product-shot-frame { height: 430px; }
  .home-v2 .product-shot-watch .product-shot-frame { height: 430px; }
}

@media (max-width: 760px) {
  .home-v2 .site-header .nav-wrap {
    width: calc(100% - 24px);
    min-height: 60px;
    margin-top: 12px;
    padding: 0 14px;
    border-radius: 17px;
  }
  .home-v2 .hero-v2 { min-height: 820px; }
  .home-v2 .hero-v2-inner { padding-bottom: 46px; }
  .home-v2 .hero-v2 h1 { font-size: clamp(43px,12.3vw,59px); line-height: .94; }
  .home-v2 .hero-v2-intro { margin-top: 24px; }
  .home-v2 .hero-v2-meta { margin-top: 22px; line-height: 1.55; }
  .home-v2 .story-v2 { padding-top: 92px; padding-bottom: 104px; }
  .home-v2 .story-grid-v2 { gap: 16px; overflow: visible; border: 0; border-radius: 0; background: transparent; }
  .home-v2 .story-photo,
  .home-v2 .story-card { border-radius: 24px; }
  .home-v2 .product-band-v2 { padding-top: 94px; padding-bottom: 104px; }
  .home-v2 .product-showcase { margin-top: 54px; gap: 16px; }
  .home-v2 .product-showcase-side { grid-template-columns: 1fr; gap: 16px; }
  .home-v2 .product-shot { padding: 16px; border-radius: 24px; }
  .home-v2 .product-shot-primary .product-shot-frame,
  .home-v2 .product-shot-secondary .product-shot-frame { height: 510px; }
  .home-v2 .product-shot-watch .product-shot-frame { height: 300px; }
  .home-v2 .roles-v2 { padding-top: 92px; padding-bottom: 104px; }
  .home-v2 .guides-band-v2,
  .home-v2 .faq-v2 { padding-top: 92px; padding-bottom: 104px; }
  .home-v2 .final-v2 { min-height: 580px; margin-bottom: 48px; border-radius: 26px; }
  .home-v2 .final-v2-copy { padding: 34px 26px; }
}
'''
home_path.write_text(home)


# Purposeful motion only. Real GSAP is used when available, with a reduced-motion escape hatch.
motion_path = Path('assets/motion.js')
motion_path.write_text(r'''(() => {
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
''')
