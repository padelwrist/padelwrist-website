from pathlib import Path


def append_pass(path: Path, marker: str, css: str) -> None:
    text = path.read_text()
    if marker in text:
        text = text.split(marker, 1)[0].rstrip() + '\n'
    path.write_text(text + '\n\n' + marker + '\n' + css.strip() + '\n')


# Keep primary navigation focused. Secondary destinations remain in the footer.
site_js = Path('assets/site.js')
text = site_js.read_text()
old_nav = '''    nav.innerHTML = `
      <a href="/#why">Why PadelWrist</a>
      <a href="/#features">Features</a>
      <a href="/guides/">Guides</a>
      <a href="/padel-player-statistics/">Insights</a>
      <a href="/whats-new/">What's new</a>
      <a href="https://padelwrist.fider.io/" target="_blank" rel="noopener">Feedback</a>
      <a href="/support/">Support</a>
      <a href="/privacy/">Privacy</a>
    `;'''
new_nav = '''    nav.innerHTML = `
      <a href="/#why">Why PadelWrist</a>
      <a href="/#features">Features</a>
      <a href="/padel-player-statistics/">Insights</a>
      <a href="/whats-new/">What's new</a>
      <a href="/guides/">Guides</a>
      <a href="/support/">Support</a>
    `;'''
if old_nav in text:
    text = text.replace(old_nav, new_nav, 1)
site_js.write_text(text)


append_pass(
    Path('assets/site.css'),
    '/* gpt-taste premium shared chrome pass */',
    r'''
body.page-body .site-header.solid {
  padding-top: 16px;
  border-bottom: 0;
  background: transparent;
  backdrop-filter: none;
}
body.page-body .site-header.solid .nav-wrap {
  width: min(1180px, calc(100% - (var(--pw-edge) * 2)));
  min-height: 64px;
  padding: 0 18px;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 20px;
  background: rgba(3,8,18,.68);
  box-shadow: 0 18px 60px rgba(0,0,0,.20);
  backdrop-filter: blur(22px) saturate(135%);
  -webkit-backdrop-filter: blur(22px) saturate(135%);
}
body.page-body .site-nav { gap: 21px; }
body.page-body .site-nav a {
  color: rgba(247,248,251,.64);
  font-size: 11.5px;
}
body.page-body .site-nav a::after { height: 1px; background: var(--pw-lilac); }

.site-footer {
  padding-top: 64px;
  padding-bottom: 48px;
  background:
    radial-gradient(circle at 12% 0%, rgba(51,95,255,.08), transparent 24rem),
    #000;
}
.site-footer .footer-grid { row-gap: 36px; }
.site-footer nav { gap: 14px 30px; }
.site-footer nav a,
.site-footer .cookie-settings-link { color: rgba(247,248,251,.52); }

@media (max-width: 760px) {
  body.page-body .site-header.solid {
    padding: 10px 12px 0;
    background: transparent !important;
    border: 0 !important;
    backdrop-filter: none;
  }
  body.page-body .site-header.solid .nav-wrap {
    width: 100%;
    min-height: 60px;
    padding: 0 14px;
    border-radius: 17px;
  }
  body.page-body .site-header .site-nav {
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 18px;
    background: rgba(2,6,13,.98);
  }
}
''',
)


append_pass(
    Path('assets/pages.css'),
    '/* gpt-taste premium inner-page pass */',
    r'''
body.page-body {
  background:
    radial-gradient(circle at 10% 2%, rgba(51,95,255,.16), transparent 34rem),
    radial-gradient(circle at 90% 34%, rgba(128,153,249,.07), transparent 31rem),
    linear-gradient(180deg, #050a18 0%, #020811 48%, #000 100%);
}
.page-body .content-page {
  padding-top: clamp(94px, 9vw, 144px);
  padding-bottom: clamp(120px, 11vw, 176px);
}
.page-body .breadcrumbs {
  margin-bottom: 34px;
  color: rgba(247,248,251,.38);
}
.page-body .page-heading {
  grid-column: 1 / span 10;
  margin-bottom: clamp(78px, 8vw, 122px);
  padding: 0 0 clamp(48px,5vw,72px);
  border-bottom-color: rgba(255,255,255,.10);
}
.page-body .page-heading::after {
  width: clamp(82px,9vw,128px);
  height: 1px;
  background: var(--pw-lilac);
}
.page-body .page-heading .eyebrow {
  margin-bottom: 22px;
  color: rgba(186,197,255,.76);
}
.page-body .page-heading h1 {
  max-width: 1040px;
  font-size: clamp(46px,5.15vw,80px);
  line-height: .96;
  letter-spacing: -.048em;
  text-transform: none;
}
.page-body .page-heading > p:not(.eyebrow) {
  max-width: 760px;
  margin-top: 30px;
  color: rgba(247,248,251,.62);
  font-size: clamp(17px,1.45vw,20px);
}

.page-body .guide-copy { grid-column: 1 / span 9; }
.page-body .guide-copy > section {
  padding: clamp(46px,5vw,66px) 0;
  border-top-color: rgba(255,255,255,.09);
}
.page-body .guide-copy h2,
.page-body .policy-copy h2,
.page-body .support-panel h2,
.page-body .guide-cta h2 {
  letter-spacing: -.035em;
  text-transform: none;
}
.page-body .guide-copy h2 { font-size: clamp(29px,2.7vw,41px); }
.page-body:not(.guides-hub) .guide-copy > section h2::before,
.page-body .policy-copy h2::before,
.page-body .support-panel h2::before { display: none; }
.page-body .guide-copy h3 {
  font-size: 21px;
  letter-spacing: -.02em;
  text-transform: none;
}
.page-body .guide-copy p,
.page-body .policy-copy p,
.page-body .support-panel p {
  max-width: 70ch;
  color: rgba(247,248,251,.63);
  line-height: 1.78;
}

.guides-hub .guide-copy {
  grid-column: 1 / span 11;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 30px;
  background: rgba(255,255,255,.09);
}
.guides-hub .guide-copy > section,
.guides-hub .guide-copy > section:nth-of-type(2),
.guides-hub .guide-copy > section:nth-of-type(3),
.guides-hub .guide-copy > section:nth-of-type(4) {
  padding: clamp(36px,4vw,52px);
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(circle at 100% 0%, rgba(51,95,255,.10), transparent 23rem),
    linear-gradient(145deg, rgba(15,35,50,.68), rgba(5,14,24,.72));
  transition: background .4s ease;
}
.guides-hub .guide-copy > section:hover {
  background:
    radial-gradient(circle at 100% 0%, rgba(128,153,249,.16), transparent 23rem),
    linear-gradient(145deg, rgba(17,39,56,.82), rgba(5,14,24,.78));
}
.guides-hub .guide-copy > .guide-cta {
  border-top: 1px solid rgba(255,255,255,.08);
}

.page-body .guide-cta {
  margin-top: 84px;
  padding: clamp(46px,5.5vw,68px);
  border-color: rgba(128,153,249,.18);
  border-radius: 30px;
  background:
    radial-gradient(circle at 12% 0%, rgba(51,95,255,.24), transparent 36rem),
    linear-gradient(145deg,rgba(12,30,44,.86),rgba(3,10,18,.88));
  box-shadow: 0 28px 84px rgba(0,0,0,.20);
}
.page-body .guide-cta h2 { max-width: 800px; font-size: clamp(34px,3.5vw,50px); }
.page-body .guide-cta p { max-width: 62ch; color: rgba(247,248,251,.62); }

.page-body .related-guides {
  margin-top: 40px;
  padding: 30px 0;
  gap: 14px 28px;
}
.page-body .related-guides a {
  padding: 0 0 4px;
  border: 0;
  border-bottom: 1px solid rgba(128,153,249,.26);
  border-radius: 0;
  background: transparent;
  color: rgba(247,248,251,.65) !important;
}
.page-body .related-guides a:hover {
  border-color: var(--pw-lilac);
  background: transparent;
}

.page-body .check-list.plain li { color: rgba(247,248,251,.62); }
.page-body .check-list.plain li::before {
  width: 4px;
  height: 4px;
  background: var(--pw-lilac);
}

.page-body .support-panel {
  grid-column: 1 / span 10;
  padding: clamp(44px,5vw,66px) 0;
  border: 0;
  border-top: 1px solid rgba(255,255,255,.10);
  border-bottom: 1px solid rgba(255,255,255,.10);
  border-radius: 0;
  background: transparent;
}
.page-body .support-panel h2 { font-size: clamp(34px,3.8vw,54px); }
.page-body .support-panel .check-list li { padding: 26px 0; }
.page-body .quick-note,
.page-body .support-safety-note {
  border-radius: 18px;
  background: rgba(255,107,69,.045);
}

.page-body .policy-layout {
  grid-template-columns: 220px minmax(0,820px);
  gap: clamp(58px,8vw,124px);
}
.page-body .policy-nav {
  top: 34px;
  padding: 22px 0;
  border-top: 1px solid rgba(255,255,255,.10);
  border-bottom: 1px solid rgba(255,255,255,.10);
}
.page-body .policy-copy section { padding: 52px 0; }
.page-body .policy-copy section > span:first-child { color: rgba(128,153,249,.66); }

@media (max-width: 1024px) {
  .page-body .page-heading { grid-column: 1 / span 8; }
  .page-body .guide-copy { grid-column: 1 / span 8; }
  .guides-hub .guide-copy { grid-column: 1 / span 8; }
  .page-body .support-panel { grid-column: 1 / span 8; }
}

@media (max-width: 760px) {
  .page-body .content-page {
    padding-top: 74px;
    padding-bottom: 102px;
  }
  .page-body .page-heading {
    margin-bottom: 62px;
    padding-bottom: 44px;
  }
  .page-body .page-heading h1 {
    font-size: clamp(40px,11.5vw,56px);
    line-height: .98;
  }
  .page-body .guide-copy > section { padding: 40px 0; }
  .guides-hub .guide-copy {
    grid-template-columns: 1fr;
    gap: 16px;
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
  }
  .guides-hub .guide-copy > section,
  .guides-hub .guide-copy > section:nth-of-type(2),
  .guides-hub .guide-copy > section:nth-of-type(3),
  .guides-hub .guide-copy > section:nth-of-type(4) {
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 22px;
  }
  .page-body .guide-cta { margin-top: 62px; padding: 34px 26px; border-radius: 24px; }
  .page-body .support-panel { padding: 38px 0; }
}
''',
)
