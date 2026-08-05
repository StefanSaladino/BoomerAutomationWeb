/* Boomer Automation - shared production behaviour v3 */

/*
 * Remove a transition class when a page is restored from the browser cache.
 * This prevents the outgoing veil from remaining visible after Back/Forward.
 */
window.addEventListener('pageshow', () => {
  document.body?.classList.remove('is-page-leaving');
});

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMenu();
  initActiveNav();
  initReveals();
  initParallax();
  initPrivacy();
  initPageTransitions();
  initPremiumMediaReveals();
  initPremiumSurfaceLight();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', scrollY > 18);
  update();
  addEventListener('scroll', update, { passive: true });
}

function initActiveNav() {
  const page = document.body.dataset.page;
  document
    .querySelectorAll(`[data-nav="${page}"]`)
    .forEach((link) => link.setAttribute('aria-current', 'page'));
}

function initMenu() {
  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('menuClose');
  const menu = document.getElementById('mobileMenu');
  const panel = document.getElementById('mobileMenuPanel');
  if (!toggle || !close || !menu || !panel) return;

  let lastFocused = null;

  const focusables = () =>
    [...panel.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')].filter(
      (element) => !element.hasAttribute('disabled'),
    );

  const setBackgroundInert = (active) => {
    /*
     * Keep the mobile toggle interactive while the dialog is open so the
     * animated X remains a genuine close control. Other page regions are
     * inert and keyboard focus remains inside the navigation panel.
     */
    [
      document.querySelector('#siteHeader .brand'),
      document.querySelector('#siteHeader .desktop-nav'),
      document.querySelector('#siteHeader .header-cta'),
      document.querySelector('main'),
      document.getElementById('siteFooterMount'),
    ]
      .filter(Boolean)
      .forEach((element) => {
        element.inert = active;
      });
  };

  const open = () => {
    lastFocused = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('menu-open');
    setBackgroundInert(true);
    setTimeout(() => close.focus({ preventScroll: true }), 60);
  };

  const shut = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
    setBackgroundInert(false);
    lastFocused?.focus();
  };

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) {
      shut();
      return;
    }

    open();
  });
  close.addEventListener('click', shut);
  menu.addEventListener('click', (event) => {
    if (event.target === menu) shut();
  });
  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', shut));

  document.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      shut();
      return;
    }

    if (event.key !== 'Tab') return;

    const elements = focusables();
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (!first) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function initReveals() {
  const elements = document.querySelectorAll('.reveal,.reveal-line');
  if (!elements.length) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  elements.forEach((element) => observer.observe(element));
}

function initParallax() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const elements = [...document.querySelectorAll('[data-parallax]')];
  if (!elements.length) return;

  let ticking = false;

  const draw = () => {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const amount = (innerHeight / 2 - (rect.top + rect.height / 2)) * 0.025;
      const offset = Math.max(-16, Math.min(16, amount));
      element.style.transform = `translate3d(0,${offset}px,0)`;
    });
    ticking = false;
  };

  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      requestAnimationFrame(draw);
      ticking = true;
    },
    { passive: true },
  );

  draw();
}

function initPrivacy() {
  const panel = document.getElementById('privacyPanel');
  if (!panel) return;

  const dialog = panel.querySelector('[role=dialog]');
  const openers = document.querySelectorAll('[data-privacy-open]');
  const close = panel.querySelector('[data-privacy-close]');
  const accept = panel.querySelector('[data-privacy-accept]');
  const decline = panel.querySelector('[data-privacy-decline]');
  if (!dialog || !close || !accept || !decline) return;

  let opener = null;

  const focusables = () =>
    [...dialog.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(
      (element) => !element.hasAttribute('disabled'),
    );

  const setBackgroundInert = (active) => {
    [
      document.getElementById('siteHeaderMount'),
      document.querySelector('main'),
      document.querySelector('.site-footer'),
    ]
      .filter(Boolean)
      .forEach((element) => {
        element.inert = active;
      });
  };

  const open = () => {
    opener = document.activeElement;
    panel.hidden = false;
    document.body.classList.add('menu-open');
    setBackgroundInert(true);
    setTimeout(() => close.focus({ preventScroll: true }), 0);
  };

  const shut = () => {
    panel.hidden = true;
    document.body.classList.remove('menu-open');
    setBackgroundInert(false);
    opener?.focus();
  };

  openers.forEach((button) => button.addEventListener('click', open));
  close.addEventListener('click', shut);
  accept.addEventListener('click', () => {
    localStorage.setItem('boomer-privacy', 'optional');
    shut();
  });
  decline.addEventListener('click', () => {
    localStorage.setItem('boomer-privacy', 'essential');
    shut();
  });
  panel.addEventListener('click', (event) => {
    if (event.target === panel) shut();
  });

  document.addEventListener('keydown', (event) => {
    if (panel.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      shut();
      return;
    }

    if (event.key !== 'Tab') return;

    const elements = focusables();
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (!first) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/*
 * Add a brief outgoing veil to true internal page changes. Hash jumps,
 * downloads, external links, new-tab links, and modified clicks remain native.
 */
function initPageTransitions() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|sms:)/i.test(rawHref)) return;

    const destination = new URL(link.href, window.location.href);
    const current = new URL(window.location.href);
    const isSameHost = destination.protocol === current.protocol && destination.host === current.host;
    const lastSegment = destination.pathname.split('/').pop() || '';
    const extension = lastSegment.includes('.') ? lastSegment.split('.').pop().toLowerCase() : '';
    const isPage = !extension || extension === 'html';

    if (!isSameHost || !isPage || destination.href === current.href) return;

    event.preventDefault();
    document.body.classList.add('is-page-leaving');
    setTimeout(() => {
      window.location.assign(destination.href);
    }, 360);
  });
}

/* Apply a horizontal editorial mask to lazy-loaded content images. */
function initPremiumMediaReveals() {
  const images = [...document.querySelectorAll('main img[loading="lazy"]')];
  if (!images.length) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  images.forEach((image) => image.classList.add('premium-media'));

  if (reducedMotion || !('IntersectionObserver' in window)) {
    images.forEach((image) => image.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  images.forEach((image) => observer.observe(image));

  /* Immediately reveal media already inside the viewport after layout settles. */
  requestAnimationFrame(() => {
    images.forEach((image) => {
      const rect = image.getBoundingClientRect();
      if (rect.top < innerHeight * 0.98 && rect.bottom > 0) {
        image.classList.add('is-visible');
        observer.unobserve(image);
      }
    });
  });

  /* Never leave an image masked if a browser delays observer callbacks. */
  setTimeout(() => {
    images.forEach((image) => image.classList.add('is-visible'));
  }, 1800);
}

/*
 * Move a restrained radial light across selected surfaces. This does not tilt
 * the cards, so text remains stable and the effect stays quiet and premium.
 */
function initPremiumSurfaceLight() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const surfaces = document.querySelectorAll(
    '.card, .proof-strip article, .contact-form-card, .next-steps > article, .principle',
  );

  surfaces.forEach((surface) => {
    surface.classList.add('premium-surface');

    surface.addEventListener('pointermove', (event) => {
      const rect = surface.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      surface.style.setProperty('--surface-x', `${x.toFixed(2)}%`);
      surface.style.setProperty('--surface-y', `${y.toFixed(2)}%`);
    });

    surface.addEventListener('pointerleave', () => {
      surface.style.removeProperty('--surface-x');
      surface.style.removeProperty('--surface-y');
    });
  });
}
