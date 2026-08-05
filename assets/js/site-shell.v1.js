/* Boomer Automation - shared runtime header and footer shell v1 */

/*
 * The site shell is stored once and injected into every page at runtime.
 * Keeping the templates in this local JavaScript file avoids duplicated HTML,
 * works from file:// and ordinary local servers, and adds no fetch dependency.
 */
(() => {
  'use strict';

  const headerMarkup = `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header class="site-header" id="siteHeader">
      <div class="shell header-inner">
        <a aria-label="Boomer Automation home" class="brand" href="./">
          <img
            alt=""
            height="44"
            src="assets/images/brand/boomer-automation-mark.png"
            width="44"
          />
          <span><strong>Boomer Automation</strong><small>Lead the pack</small></span>
        </a>

        <nav aria-label="Primary navigation" class="desktop-nav">
          <a data-nav="services" href="services.html">Services</a>
          <a data-nav="systems" href="systems.html">Systems</a>
          <a data-nav="process" href="process.html">Process</a>
          <a data-nav="portfolio" href="portfolio.html">Portfolio</a>
          <a data-nav="resources" href="resources.html">Resources</a>
          <a data-nav="about" href="about.html">About</a>
        </nav>

        <a class="header-cta" href="contact.html">Contact</a>
        <button
          aria-controls="mobileMenu"
          aria-expanded="false"
          aria-label="Open navigation menu"
          class="menu-toggle"
          id="menuToggle"
          type="button"
        >
          <span></span><span></span>
        </button>
      </div>
    </header>

    <!-- The fixed mobile dialog remains outside the sticky header. -->
    <div aria-hidden="true" class="mobile-menu" id="mobileMenu">
      <div
        aria-label="Site navigation"
        aria-modal="true"
        class="mobile-menu-panel"
        id="mobileMenuPanel"
        role="dialog"
        tabindex="-1"
      >
        <div class="mobile-menu-top">
          <span>Navigation</span>
          <button aria-label="Close navigation menu" id="menuClose" type="button">Close</button>
        </div>

        <nav aria-label="Mobile navigation" class="mobile-nav">
          <a data-nav="services" href="services.html">Services</a>
          <a data-nav="systems" href="systems.html">Systems</a>
          <a data-nav="process" href="process.html">Process</a>
          <a data-nav="portfolio" href="portfolio.html">Portfolio</a>
          <a data-nav="resources" href="resources.html">Resources</a>
          <a data-nav="about" href="about.html">About</a>
          <a data-nav="contact" href="contact.html">Contact</a>
        </nav>

        <div class="mobile-contact">
          <a href="tel:+12494065820">249-406-5820</a>
          <a href="mailto:boomerautomationinc@gmail.com">boomerautomationinc@gmail.com</a>
        </div>
      </div>
    </div>
  `;

  const footerMarkup = `
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div class="footer-brand">
          <a class="brand" href="./">
            <img
              alt=""
              height="46"
              src="assets/images/brand/boomer-automation-mark.png"
              width="46"
            />
            <span><strong>Boomer Automation</strong><small>Lead the pack</small></span>
          </a>
          <p>
            Websites, SEO, paid traffic, and workflow systems that help Ontario
            service businesses grow with more clarity and less manual work.
          </p>
        </div>

        <div>
          <h2>Explore</h2>
          <a href="services.html">Services</a>
          <a href="systems.html">Systems</a>
          <a href="process.html">Process</a>
          <a href="portfolio.html">Portfolio</a>
          <a href="about.html">About</a>
        </div>

        <div>
          <h2>Resources</h2>
          <a href="resources.html">Resource library</a>
          <a href="assets/docs/boomer-automation-website-strategy-pricing-guide.pdf">
            Website pricing guide
          </a>
          <a href="assets/docs/boomer-automation-paid-ads-strategy-comparison-guide.pdf">
            Paid ads guide
          </a>
        </div>

        <div>
          <h2>Contact</h2>
          <a href="mailto:boomerautomationinc@gmail.com">boomerautomationinc@gmail.com</a>
          <a href="tel:+12494065820">249-406-5820</a>
          <p>Ontario, Canada</p>
        </div>
      </div>

      <div class="shell footer-bottom">
        <p>© <span id="year"></span> Boomer Automation Inc. All rights reserved.</p>
        <div>
          <button class="text-button" data-privacy-open type="button">Privacy choices</button>
          <a href="privacy.html">Privacy Policy</a>
        </div>
      </div>
    </footer>

    <div class="privacy-panel" hidden id="privacyPanel">
      <div
        aria-describedby="privacyPanelDescription"
        aria-labelledby="privacyPanelTitle"
        aria-modal="true"
        class="privacy-panel-card"
        role="dialog"
      >
        <button
          aria-label="Close privacy choices"
          class="privacy-close"
          data-privacy-close
          type="button"
        >×</button>
        <p class="eyebrow">Privacy choices</p>
        <h2 id="privacyPanelTitle">Your browser, your choice.</h2>
        <p id="privacyPanelDescription">
          Essential storage supports navigation preferences. Optional analytics
          and advertising measurement remain off unless you allow them.
        </p>
        <div class="privacy-actions">
          <button class="button button-primary" data-privacy-accept type="button">
            Allow optional measurement
          </button>
          <button class="button button-secondary" data-privacy-decline type="button">
            Essential only
          </button>
        </div>
        <a href="privacy.html">Read the Privacy Policy</a>
      </div>
    </div>
  `;

  const injectShell = (mountId, markup) => {
    const mount = document.getElementById(mountId);
    if (!mount) return false;

    mount.innerHTML = markup.trim();
    mount.dataset.shellLoaded = 'true';
    return true;
  };

  injectShell('siteHeaderMount', headerMarkup);
  injectShell('siteFooterMount', footerMarkup);
})();
