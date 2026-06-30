/* =========================================================
   BOOMER AUTOMATION — PRIVACY JS
   File: privacy.v1.js
   Purpose: Privacy page loader, reveal animations, active
   sidebar tracking, smooth anchors, and back-to-top control.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initPrivacyLoader();
  initPrivacyRevealAnimations();
  initPrivacySidebarTracking();
  initPrivacyAnchorScrolling();
  initPrivacyBackToTop();
});

/* =========================================================
   PRIVACY LOADER
========================================================= */

function initPrivacyLoader() {
  const loader = document.getElementById("privacyLoader");

  if (!loader) {
    document.body.classList.remove("loading");
    return;
  }

  const hideLoader = () => {
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");
    }, 450);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
}

/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

function initPrivacyRevealAnimations() {
  const revealItems = document.querySelectorAll(".privacy-reveal");

  if (!revealItems.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* =========================================================
   ACTIVE SIDEBAR SECTION TRACKING
========================================================= */

function initPrivacySidebarTracking() {
  const sections = document.querySelectorAll(".privacy-policy section[id]");
  const links = document.querySelectorAll(".privacy-sidebar-card a[href^='#']");

  if (!sections.length || !links.length) return;

  const setActiveLink = (sectionId) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        setActiveLink(entry.target.id);
      });
    },
    {
      threshold: 0.28,
      rootMargin: "-20% 0px -58% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   SMOOTH INTERNAL ANCHOR SCROLLING
========================================================= */

function initPrivacyAnchorScrolling() {
  const links = document.querySelectorAll(".privacy-sidebar-card a[href^='#']");

  if (!links.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      history.pushState(null, "", targetId);
    });
  });
}

/* =========================================================
   BACK TO TOP
========================================================= */

function initPrivacyBackToTop() {
  const button = document.querySelector("[data-privacy-top]");

  if (!button) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateButtonState = () => {
    button.classList.toggle("is-visible", window.scrollY > 700);
  };

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  updateButtonState();
  window.addEventListener("scroll", updateButtonState, { passive: true });
}