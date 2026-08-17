(() => {
  const APP_STORE_URL = '';
  const path = window.location.pathname;
  const isHome = path === '/' || path === '';
  const isSupport = path === '/support/' || path === '/support';
  const isPrivacy = path === '/privacy/' || path === '/privacy';
  const isGuidesHub = path === '/guides/' || path === '/guides';

  function addBreadcrumbs() {
    if (!document.body.classList.contains('page-body')) return;
    const heading = document.querySelector('.content-page > .page-heading');
    if (!heading || document.querySelector('.breadcrumbs')) return;

    const current = heading.querySelector('h1')?.textContent?.trim() || document.title.split('|')[0].trim();
    const nav = document.createElement('nav');
    nav.className = 'breadcrumbs';
    nav.setAttribute('aria-label', 'Breadcrumb');

    const parts = ['<a href="/">Home</a>'];
    if (isGuidesHub) {
      parts.push('<span aria-current="page">Guides</span>');
    } else if (isSupport) {
      parts.push('<span aria-current="page">Support</span>');
    } else if (isPrivacy) {
      parts.push('<span aria-current="page">Privacy</span>');
    } else {
      parts.push('<a href="/guides/">Guides</a>');
      parts.push(`<span aria-current="page">${current}</span>`);
    }

    nav.innerHTML = parts.join('<span class="breadcrumb-separator" aria-hidden="true">/</span>');
    heading.before(nav);
  }

  function upgradeAppStoreCtas() {
    if (!APP_STORE_URL) return;

    document.querySelectorAll('[data-app-store-cta], .store-button').forEach((element) => {
      if (element.tagName === 'A') {
        element.href = APP_STORE_URL;
        element.target = '_blank';
        element.rel = 'noopener';
        element.classList.add('app-store-cta');
        element.setAttribute('aria-label', 'Download PadelWrist on the App Store');
        element.textContent = 'Download on the App Store';
        return;
      }

      const link = document.createElement('a');
      link.className = `${element.className} app-store-cta`;
      link.href = APP_STORE_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', 'Download PadelWrist on the App Store');
      link.textContent = 'Download on the App Store';
      element.replaceWith(link);
    });

    if (isHome && window.matchMedia('(max-width: 760px)').matches && !document.querySelector('.sticky-app-cta')) {
      const sticky = document.createElement('a');
      sticky.className = 'sticky-app-cta app-store-cta';
      sticky.href = APP_STORE_URL;
      sticky.target = '_blank';
      sticky.rel = 'noopener';
      sticky.innerHTML = '<span>Get PadelWrist</span><strong>App Store</strong>';
      document.body.appendChild(sticky);
      document.body.classList.add('has-sticky-app-cta');
    }
  }

  function analyticsReady() {
    return typeof window.gtag === 'function' && window['ga-disable-G-815ZHZPERH'] !== true;
  }

  function cleanText(value) {
    return (value || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  function linkType(link) {
    const href = link.getAttribute('href') || '';
    if (link.classList.contains('app-store-cta') || href.includes('apps.apple.com')) return 'app_store';
    if (href.startsWith('mailto:')) return 'email';
    if (href.includes('padelwrist.fider.io')) return 'feedback';
    if (link.closest('.site-header')) return 'header_navigation';
    if (link.closest('.site-footer')) return 'footer_navigation';
    if (link.closest('.breadcrumbs')) return 'breadcrumb';
    if (link.closest('.related-guides') || link.closest('.guide-grid') || link.closest('.guide-copy') || link.closest('.editorial-grid')) return 'content';
    try {
      return new URL(link.href, window.location.href).origin === window.location.origin ? 'internal' : 'outbound';
    } catch {
      return 'other';
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link && analyticsReady()) {
      const type = linkType(link);
      window.gtag('event', 'link_click', {
        link_text: cleanText(link.textContent || link.getAttribute('aria-label')),
        link_url: link.href,
        link_type: type,
        page_path: window.location.pathname
      });

      if (type === 'app_store') {
        window.gtag('event', 'select_content', {
          content_type: 'app_store_cta',
          item_id: 'padelwrist'
        });
      }
    }

    const button = event.target.closest('button');
    if (button && analyticsReady() && !button.closest('[data-cookie-banner]')) {
      window.gtag('event', 'button_click', {
        button_text: cleanText(button.textContent || button.getAttribute('aria-label')),
        button_type: button.classList.contains('mobile-nav-toggle') ? 'mobile_navigation' : 'interaction',
        page_path: window.location.pathname
      });
    }
  });

  addBreadcrumbs();
  upgradeAppStoreCtas();
})();