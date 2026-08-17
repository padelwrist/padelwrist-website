document.documentElement.classList.add('js');

const path = window.location.pathname;
const isHome = path === '/' || path === '';
const isInnerPage = document.body.classList.contains('page-body');
const isGuidesHub = path === '/guides/' || path === '/guides';
const isSupport = path === '/support/' || path === '/support';
const isPrivacy = path === '/privacy/' || path === '/privacy';

if (isGuidesHub) document.body.classList.add('guides-hub');

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

function standardiseChrome() {
  const nav = document.querySelector('.site-header .site-nav');
  if (nav) {
    nav.innerHTML = `
      <a href="/#why">Why PadelWrist</a>
      <a href="/#features">Features</a>
      <a href="/guides/">Guides</a>
      <a href="https://padelwrist.fider.io/" target="_blank" rel="noopener">Feedback</a>
      <a href="/support/">Support</a>
      <a href="/privacy/">Privacy</a>
    `;

    if (isGuidesHub || (isInnerPage && !isSupport && !isPrivacy)) {
      nav.querySelector('a[href="/guides/"]')?.setAttribute('aria-current', 'page');
    } else if (isSupport) {
      nav.querySelector('a[href="/support/"]')?.setAttribute('aria-current', 'page');
    } else if (isPrivacy) {
      nav.querySelector('a[href="/privacy/"]')?.setAttribute('aria-current', 'page');
    }
  }

  document.querySelectorAll('.brand').forEach((brand) => {
    brand.setAttribute('aria-label', 'PadelWrist home');
    const mark = brand.querySelector('.brand-mark');
    if (mark) {
      mark.textContent = '';
      mark.setAttribute('aria-hidden', 'true');
    }
    const wordmark = brand.querySelector('span:last-child');
    if (wordmark) wordmark.textContent = 'PADELWRIST';
  });

  const footerNav = document.querySelector('.site-footer nav');
  if (footerNav) {
    footerNav.innerHTML = `
      <a href="/guides/">Guides</a>
      <a href="/apple-watch-padel-scoring/">Apple Watch scoring</a>
      <a href="/how-padel-scoring-works/">Scoring rules</a>
      <a href="/padel-match-history/">Match history</a>
      <a href="https://padelwrist.fider.io/" target="_blank" rel="noopener">Feedback</a>
      <a href="/support/">Support</a>
      <a href="/privacy/">Privacy</a>
    `;
  }
}

function addMobileNavigation() {
  document.querySelectorAll('.site-header').forEach((header, index) => {
    const nav = header.querySelector('.site-nav');
    const wrap = header.querySelector('.nav-wrap');
    if (!nav || !wrap || wrap.querySelector('.mobile-nav-toggle')) return;

    const navId = nav.id || `site-nav-${index + 1}`;
    nav.id = navId;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mobile-nav-toggle';
    button.setAttribute('aria-controls', navId);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation');
    button.innerHTML = '<span aria-hidden="true"></span>';
    wrap.appendChild(button);

    const close = () => {
      header.classList.remove('nav-open');
      document.body.classList.remove('mobile-nav-open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation');
    };
    const open = () => {
      header.classList.add('nav-open');
      document.body.classList.add('mobile-nav-open');
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'Close navigation');
    };

    button.addEventListener('click', () => header.classList.contains('nav-open') ? close() : open());
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('nav-open')) {
        close();
        button.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760 && header.classList.contains('nav-open')) close();
    });
  });
}

function addBreadcrumbs() {
  if (!isInnerPage) return;
  const heading = document.querySelector('.content-page > .page-heading');
  if (!heading || document.querySelector('.breadcrumbs')) return;

  const current = heading.querySelector('h1')?.textContent?.trim() || document.title.split('|')[0].trim();
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';
  breadcrumbs.setAttribute('aria-label', 'Breadcrumb');

  const parts = ['<a href="/">Home</a>'];
  if (isGuidesHub) parts.push('<span aria-current="page">Guides</span>');
  else if (isSupport) parts.push('<span aria-current="page">Support</span>');
  else if (isPrivacy) parts.push('<span aria-current="page">Privacy</span>');
  else {
    parts.push('<a href="/guides/">Guides</a>');
    parts.push(`<span aria-current="page">${current}</span>`);
  }

  breadcrumbs.innerHTML = parts.join('<span class="breadcrumb-separator" aria-hidden="true">/</span>');
  heading.before(breadcrumbs);
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
}

const APP_STORE_URL = '';
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

  if (isHome && window.matchMedia('(max-width: 760px)').matches) {
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

/* Privacy-first analytics. GA4 is not loaded until consent is accepted. */
const GA_MEASUREMENT_ID = 'G-815ZHZPERH';
const CONSENT_STORAGE_KEY = 'padelwrist-analytics-consent';
let analyticsLoaded = false;

function getConsentChoice() {
  try { return window.localStorage.getItem(CONSENT_STORAGE_KEY); } catch { return null; }
}
function saveConsentChoice(choice) {
  try { window.localStorage.setItem(CONSENT_STORAGE_KEY, choice); } catch { /* no-op */ }
}
function deleteAnalyticsCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `${name}=; ${expires}; path=/; SameSite=Lax`;
    document.cookie = `${name}=; ${expires}; path=/; domain=.${window.location.hostname}; SameSite=Lax`;
  });
}
function disableAnalytics() {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  window.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  deleteAnalyticsCookies();
}
function loadAnalytics() {
  if (analyticsLoaded) {
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    return;
  }
  analyticsLoaded = true;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('config', GA_MEASUREMENT_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}
function removeConsentBanner() { document.querySelector('[data-cookie-banner]')?.remove(); }
function applyConsent(choice) {
  saveConsentChoice(choice);
  choice === 'accepted' ? loadAnalytics() : disableAnalytics();
  removeConsentBanner();
}
function showConsentBanner() {
  removeConsentBanner();
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.dataset.cookieBanner = '';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-labelledby', 'cookie-title');
  banner.setAttribute('aria-describedby', 'cookie-description');
  banner.innerHTML = `
    <div class="cookie-copy">
      <strong id="cookie-title">Website analytics</strong>
      <p id="cookie-description">We use optional Google Analytics cookies to understand how the PadelWrist website is used. Analytics stays off unless you accept. <a href="/privacy/#website-analytics">Privacy policy</a></p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-button cookie-button-secondary" data-cookie-reject>Reject</button>
      <button type="button" class="cookie-button cookie-button-primary" data-cookie-accept>Accept analytics</button>
    </div>`;
  banner.querySelector('[data-cookie-reject]').addEventListener('click', () => applyConsent('rejected'));
  banner.querySelector('[data-cookie-accept]').addEventListener('click', () => applyConsent('accepted'));
  document.body.appendChild(banner);
}
function addCookieSettingsLink() {
  const footerNav = document.querySelector('.site-footer nav');
  if (!footerNav || footerNav.querySelector('[data-cookie-settings]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cookie-settings-link';
  button.dataset.cookieSettings = '';
  button.textContent = 'Cookie settings';
  button.addEventListener('click', showConsentBanner);
  footerNav.appendChild(button);
}

function analyticsReady() {
  return typeof window.gtag === 'function' && window[`ga-disable-${GA_MEASUREMENT_ID}`] !== true;
}
function cleanText(value) { return (value || '').replace(/\s+/g, ' ').trim().slice(0, 100); }
function linkType(link) {
  const href = link.getAttribute('href') || '';
  if (link.classList.contains('app-store-cta') || href.includes('apps.apple.com')) return 'app_store';
  if (href.startsWith('mailto:')) return 'email';
  if (href.includes('padelwrist.fider.io')) return 'feedback';
  if (link.closest('.site-header')) return 'header_navigation';
  if (link.closest('.site-footer')) return 'footer_navigation';
  if (link.closest('.breadcrumbs')) return 'breadcrumb';
  if (link.closest('.related-guides') || link.closest('.guide-copy') || link.closest('.editorial-grid')) return 'content';
  try { return new URL(link.href, window.location.href).origin === window.location.origin ? 'internal' : 'outbound'; }
  catch { return 'other'; }
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
      window.gtag('event', 'select_content', { content_type: 'app_store_cta', item_id: 'padelwrist' });
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

standardiseChrome();
addMobileNavigation();
addBreadcrumbs();
upgradeAppStoreCtas();
addCookieSettingsLink();

const consentChoice = getConsentChoice();
if (consentChoice === 'accepted') loadAnalytics();
else if (consentChoice === 'rejected') disableAnalytics();
else {
  disableAnalytics();
  showConsentBanner();
}
