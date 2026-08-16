document.documentElement.classList.add('js');

function addStylesheet(id, href) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

addStylesheet('padelwrist-launch-styles', '/assets/launch.css');
addStylesheet('padelwrist-qa-styles', '/assets/qa-pass.css');

const isInnerPage = document.body?.classList.contains('page-body');
if (isInnerPage) {
  addStylesheet('padelwrist-inner-pages', '/assets/inner-pages.css');
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

function standardiseInnerPageChrome() {
  if (!isInnerPage) return;

  const primaryNav = document.querySelector('.site-header .site-nav');
  if (primaryNav) {
    primaryNav.innerHTML = `
      <a href="/#why">Why PadelWrist</a>
      <a href="/#features">Features</a>
      <a href="/#guides">Guides</a>
      <a href="https://padelwrist.fider.io/" target="_blank" rel="noopener">Feedback</a>
      <a href="/support/">Support</a>
      <a href="/privacy/">Privacy</a>
    `;

    const path = window.location.pathname;
    if (path === '/support/' || path === '/support') {
      primaryNav.querySelector('a[href="/support/"]')?.setAttribute('aria-current', 'page');
    } else if (path === '/privacy/' || path === '/privacy') {
      primaryNav.querySelector('a[href="/privacy/"]')?.setAttribute('aria-current', 'page');
    } else if (path.includes('apple-watch-padel-scoring') || path.includes('how-padel-scoring-works') || path.includes('padel-match-history')) {
      primaryNav.querySelector('a[href="/#guides"]')?.setAttribute('aria-current', 'page');
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
      <a href="/apple-watch-padel-scoring/">Apple Watch scoring</a>
      <a href="/how-padel-scoring-works/">Scoring rules</a>
      <a href="/padel-match-history/">Match history</a>
      <a href="https://padelwrist.fider.io/" target="_blank" rel="noopener">Feedback</a>
      <a href="/support/">Support</a>
      <a href="/privacy/">Privacy</a>
    `;
  }

  const footerTagline = document.querySelector('.site-footer .footer-grid > div > p');
  if (footerTagline) footerTagline.textContent = 'Keep the score. Stay in the match.';
}

standardiseInnerPageChrome();

function addFeedbackLinks() {
  const feedbackUrl = 'https://padelwrist.fider.io/';

  document.querySelectorAll('.site-nav, .site-footer nav').forEach((nav) => {
    if (nav.querySelector(`a[href="${feedbackUrl}"]`)) return;

    const link = document.createElement('a');
    link.href = feedbackUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Feedback';

    const supportLink = nav.querySelector('a[href="/support/"]');
    if (supportLink) {
      nav.insertBefore(link, supportLink);
    } else {
      nav.appendChild(link);
    }
  });
}

addFeedbackLinks();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  items.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach((item) => observer.observe(item));
}

// Privacy-first website analytics. GA4 is not loaded until the visitor opts in.
const GA_MEASUREMENT_ID = 'G-815ZHZPERH';
const CONSENT_STORAGE_KEY = 'padelwrist-analytics-consent';
let analyticsLoaded = false;

function getConsentChoice() {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveConsentChoice(choice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Consent still applies for this page view if storage is unavailable.
  }
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
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }
  deleteAnalyticsCookies();
}

function loadAnalytics() {
  if (analyticsLoaded) {
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    return;
  }

  analyticsLoaded = true;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  window.gtag('config', GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

function removeConsentBanner() {
  document.querySelector('[data-cookie-banner]')?.remove();
}

function applyConsent(choice) {
  saveConsentChoice(choice);
  if (choice === 'accepted') {
    loadAnalytics();
  } else {
    disableAnalytics();
  }
  removeConsentBanner();
}

function showConsentBanner() {
  removeConsentBanner();
  addStylesheet('padelwrist-consent-styles', '/assets/consent.css');

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
    </div>
  `;

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

addStylesheet('padelwrist-consent-styles', '/assets/consent.css');
addCookieSettingsLink();

const consentChoice = getConsentChoice();
if (consentChoice === 'accepted') {
  loadAnalytics();
} else if (consentChoice === 'rejected') {
  disableAnalytics();
} else {
  disableAnalytics();
  showConsentBanner();
}
