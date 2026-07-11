/* =========================================================
   BOOMER AUTOMATION — GLOBAL JS
   File: global.v2.js
   Purpose: global header/footer partial loading,
   burger menu, scroll state, footer year, and privacy consent.
========================================================= */

/* 
   Wait until the HTML document has loaded before running
   any global site behavior.
*/
document.addEventListener("DOMContentLoaded", async () => {
  /*
     Load reusable header and footer partials first because
     several functions depend on elements inside those partials.
  */
  await loadGlobalPartials();

  /*
     Initialize global site features after partials are available.
  */
  initFooterYear();
  initHeaderScrollState();
  initMobileMenu();
  initPrivacyConsentBanner();
});

/* =========================================================
   LOAD GLOBAL PARTIALS
========================================================= */

/*
   Loads reusable global HTML partials into the current page.

   Expected page mount points:
   - #siteHeaderMount
   - #siteFooterMount

   Expected files:
   - /header.html
   - /footer.html
*/
async function loadGlobalPartials() {
  const headerMount = document.getElementById("siteHeaderMount");
  const footerMount = document.getElementById("siteFooterMount");

  /*
     Store all partial-loading promises so they can be loaded
     at the same time instead of one after another.
  */
  const partials = [];

  /*
     Only load the header if the page actually includes
     the header mount point.
  */
  if (headerMount && !headerMount.innerHTML.trim()) {
    partials.push(loadPartial(headerMount, "header.html"));
  }

  /*
     Only load the footer if the page actually includes
     the footer mount point.
  */
  if (footerMount && !footerMount.innerHTML.trim()) {
    partials.push(loadPartial(footerMount, "footer.html"));
  }

  /*
     Wait until all requested partials have finished loading.
  */
  await Promise.all(partials);

  /*
     Dispatch a custom event in case page-specific scripts ever
     need to wait for header/footer content before running.
  */
  document.dispatchEvent(new CustomEvent("partialsLoaded"));
}

/*
   Fetches an HTML partial and injects it into a target element.

   Parameters:
   - target: the element where the partial should be inserted
   - path: the HTML file path to fetch
*/
async function loadPartial(target, path) {
  try {
    /*
       Fetch the partial file from the server.
    */
    const response = await fetch(path);

    /*
       If the server does not return a successful response,
       throw an error so it can be caught below.
    */
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }

    /*
       Convert the response into usable HTML text.
    */
    const markup = await response.text();

    /*
       Inject the partial markup into the page.
    */
    target.innerHTML = markup;
  } catch (error) {
    /*
       Log the error for debugging without breaking the page.
    */
    console.error(error);
  }
}

/* =========================================================
   FOOTER YEAR
========================================================= */

/*
   Automatically updates the copyright year in the footer.

   Expected footer element:
   - #year
*/
function initFooterYear() {
  const year = document.getElementById("year");

  /*
     Only update the year if the footer contains the #year span.
  */
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

/* =========================================================
   HEADER SCROLL STATE
========================================================= */

/*
   Adds a visual state to the fixed header once the user scrolls
   down slightly.

   Expected header element:
   - #siteHeader
*/
function initHeaderScrollState() {
  const header = document.getElementById("siteHeader");

  /*
     Stop if the current page does not have a header.
  */
  if (!header) return;

  /*
     Toggle the .is-scrolled class after the user scrolls
     more than 24px from the top.
  */
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  /*
     Run immediately so the header state is correct on refresh,
     especially if the page reloads while already scrolled.
  */
  updateHeader();

  /*
     Use passive scroll listener for better performance.
  */
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* =========================================================
   MOBILE MENU
========================================================= */

/*
   Controls the mobile burger menu.

   Expected elements in header.html:
   - #menuToggle
   - #menuClose
   - #mobileMenu
   - .mobile-nav a
   - .mobile-menu-actions a
*/
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuLinks = document.querySelectorAll(".mobile-nav a, .mobile-menu-actions a");

  /*
     Stop if required menu elements are missing.
     This prevents JavaScript errors on pages without a menu.
  */
  if (!menuToggle || !menuClose || !mobileMenu) return;

  /*
     This media query matches the desktop breakpoint used in CSS.
     If the viewport becomes desktop-sized while the menu is open,
     we force close the mobile menu.
  */
  const desktopQuery = window.matchMedia("(min-width: 881px)");

  /*
     Opens the mobile menu.
  */
  const openMenu = () => {
    /*
       Lock the page behind the menu and activate menu-open styles.
    */
    document.body.classList.add("menu-open");

    /*
       Show the menu visually and expose it to assistive technology.
    */
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");

    /*
       Update the burger button accessibility state.
    */
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  };

  /*
     Closes the mobile menu.
  */
  const closeMenu = () => {
    /*
       Restore normal page scrolling and default page state.
    */
    document.body.classList.remove("menu-open");

    /*
       Hide the mobile menu visually and from assistive technology.
    */
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");

    /*
       Reset the burger button accessibility state.
    */
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  /*
     Force-close the mobile menu when the viewport reaches
     the desktop breakpoint.
  */
  const forceCloseOnDesktop = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  /*
     Toggle the menu open/closed when the burger button is clicked.
  */
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /*
     Close the menu when the dedicated close button is clicked.
  */
  menuClose.addEventListener("click", closeMenu);

  /*
     Close the menu when any menu link or mobile menu CTA is clicked.
     This is important for same-page anchor links.
  */
  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /*
     Allow keyboard users to close the menu with Escape.
  */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /*
     Close the menu when clicking the overlay area outside the panel.
     This only triggers when the click target is the menu wrapper itself.
  */
  mobileMenu.addEventListener("click", (event) => {
    if (event.target === mobileMenu) {
      closeMenu();
    }
  });

  /*
     Watch for viewport changes into desktop size.
  */
  desktopQuery.addEventListener("change", forceCloseOnDesktop);

  /*
     If the page loads at desktop size, make sure no mobile menu
     state is accidentally active.
  */
  if (desktopQuery.matches) {
    closeMenu();
  }
}

/* =========================================================
   PRIVACY / COOKIE CONSENT BANNER
========================================================= */

/*
   Stores the visitor's privacy preference locally.

   This does not install Google Analytics, Google Tag Manager,
   Google Ads, or Consent Mode by itself. It prepares the site
   with clear consent language and a stored preference that can
   be connected to future tracking tools.
*/
const BA_PRIVACY_CONSENT_STORAGE_KEY = "boomer_automation_consent_v1";

/*
   Initializes the privacy/cookie consent banner.

   The banner is only shown when the visitor has not already
   saved a consent preference in this browser.
*/
function initPrivacyConsentBanner() {
  const savedConsent = getStoredPrivacyConsent();

  if (savedConsent) {
    return;
  }

  renderPrivacyConsentBanner();
}

/*
   Reads saved consent from localStorage.
*/
function getStoredPrivacyConsent() {
  try {
    const stored = window.localStorage.getItem(BA_PRIVACY_CONSENT_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/*
   Saves the visitor's consent choice in localStorage.
*/
function storePrivacyConsent(consent) {
  try {
    window.localStorage.setItem(
      BA_PRIVACY_CONSENT_STORAGE_KEY,
      JSON.stringify(consent)
    );
  } catch {
    /*
       If localStorage is blocked, the banner may appear again
       on a future visit. The page should still work normally.
    */
  }
}

/*
   Creates and injects the privacy/cookie consent banner.
*/
function renderPrivacyConsentBanner() {
  if (document.getElementById("privacyConsentBanner")) return;

  const banner = document.createElement("section");

  banner.className = "privacy-consent-banner";
  banner.id = "privacyConsentBanner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-label", "Privacy and cookie consent");

  banner.innerHTML = `
    <div class="privacy-consent-panel">
      <div class="privacy-consent-copy">
        <p class="privacy-consent-eyebrow">Privacy preferences</p>

        <h2>We use cookies and tracking to improve the site and measure marketing.</h2>

        <p>
          Boomer Automation Inc. uses cookies and may use analytics tools,
          Google Analytics, Google tags, Google Ads conversion tracking, and
          similar technologies to understand website activity, measure marketing
          performance, improve lead generation, and support advertising campaigns.
          When you submit a form, your inquiry details may also be collected and
          stored in our CRM so we can respond, follow up, manage your request,
          and track project communication.
        </p>

        <p>
          You can accept all tracking or reject non-essential analytics and
          advertising storage. Essential functionality and security features may
          still be used. Read our
          <a href="./privacy.html">Privacy Policy</a>.
        </p>
      </div>

      <div class="privacy-consent-actions" aria-label="Cookie consent choices">
        <button
          class="btn btn-secondary privacy-consent-btn"
          type="button"
          data-consent-reject
        >
          Reject Non-Essential
        </button>

        <button
          class="btn btn-primary privacy-consent-btn"
          type="button"
          data-consent-accept
        >
          Accept All
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  const acceptButton = banner.querySelector("[data-consent-accept]");
  const rejectButton = banner.querySelector("[data-consent-reject]");

  acceptButton?.addEventListener("click", () => {
    const consent = {
      choice: "accepted_all",
      analytics: true,
      advertising: true,
      crmDisclosureSeen: true,
      policyUrl: "./privacy.html",
      updatedAt: new Date().toISOString()
    };

    storePrivacyConsent(consent);
    closePrivacyConsentBanner(banner);
  });

  rejectButton?.addEventListener("click", () => {
    const consent = {
      choice: "rejected_non_essential",
      analytics: false,
      advertising: false,
      crmDisclosureSeen: true,
      policyUrl: "./privacy.html",
      updatedAt: new Date().toISOString()
    };

    storePrivacyConsent(consent);
    closePrivacyConsentBanner(banner);
  });
}

/*
   Animates the banner out and removes it from the DOM.
*/
function closePrivacyConsentBanner(banner) {
  banner.classList.add("is-hiding");

  window.setTimeout(() => {
    banner.remove();
  }, 360);
}
