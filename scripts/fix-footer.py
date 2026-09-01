from pathlib import Path

site = Path('assets/site.js')
text = site.read_text()
text = text.replace('      <a href="/padel-player-statistics/">Insights</a>\n      <a href="/padel-player-statistics/">Insights</a>\n', '      <a href="/padel-player-statistics/">Insights</a>\n')

startup_block = '''\n  if (footerBrand && !footerBrand.querySelector('[data-startupbase-badge]')) {\n    const startupBaseBadge = document.createElement('a');\n    startupBaseBadge.dataset.startupbaseBadge = '';\n    startupBaseBadge.href = 'https://startupbase.io/products/padelwrist?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-light';\n    startupBaseBadge.target = '_blank';\n    startupBaseBadge.rel = 'noopener noreferrer';\n    startupBaseBadge.style.display = 'inline-flex';\n    startupBaseBadge.style.marginTop = '14px';\n    startupBaseBadge.innerHTML = '<img src="https://statics.startupbase.io/site/badges/launched-on-sb.svg" alt="Launched on StartupBase" height="55" style="height:55px;width:auto;">';\n    footerBrand.appendChild(startupBaseBadge);\n  }\n'''
text = text.replace(startup_block, '\n')
site.write_text(text)

tokens = Path('assets/tokens.css')
css = tokens.read_text()
start = css.find('/* Keep third-party footer badges visually aligned without altering their artwork. */')
if start != -1:
    end = css.find('@media (max-width: 1024px)', start)
    css = css[:start] + '''/* Keep the App Store badge aligned as a secondary footer action. */\n.site-footer [data-footer-app-store] {\n  display: flex !important;\n  width: 150px !important;\n  height: 50px !important;\n  margin-top: 18px !important;\n  align-items: center;\n}\n.site-footer [data-footer-app-store] img {\n  display: block;\n  width: 150px !important;\n  height: 50px !important;\n  object-fit: contain;\n}\n\n''' + css[end:]
css = css.replace('''\n  .site-footer [data-startupbase-badge] {\n    margin-left: 8px;\n  }\n''', '\n')
tokens.write_text(css)
