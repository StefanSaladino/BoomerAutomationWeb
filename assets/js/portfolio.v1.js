
/* =========================================================
   BOOMER AUTOMATION — PORTFOLIO JS
   File: portfolio.v1.js
   Purpose: High-profile portfolio interactions:
   loader, unique reveal system, project row scroll progress,
   pointer lighting, and smooth internal navigation.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initPortfolioLoader();
  initPortfolioMotion();
  initProjectRowProgress();
  initProjectPointerLight();
  initPortfolioAnchors();
});

/* =========================================================
   PAGE LOADER
========================================================= */

function initPortfolioLoader() {
  const loader = document.getElementById("portfolioLoader");

  if (!loader) {
    document.body.classList.remove("loading");
    return;
  }

  const hideLoader = () => {
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");
    }, 460);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
}

/* =========================================================
   UNIQUE MOTION SYSTEM
========================================================= */

function initPortfolioMotion() {
  const motionItems = document.querySelectorAll(".portfolio-motion");

  if (!motionItems.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    motionItems.forEach((item) => item.classList.add("is-visible"));
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
      threshold: 0.18,
      rootMargin: "0px 0px -70px 0px",
    }
  );

  motionItems.forEach((item) => observer.observe(item));
}

/* =========================================================
   PROJECT ROW SCROLL PROGRESS
========================================================= */

function initProjectRowProgress() {
  const rows = document.querySelectorAll("[data-project-row]");

  if (!rows.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    rows.forEach((row) => row.style.setProperty("--row-progress", "0.5"));
    return;
  }

  let ticking = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateRows = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    rows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const rowMiddle = rect.top + rect.height / 2;
      const viewportMiddle = viewportHeight / 2;

      const distance = Math.abs(rowMiddle - viewportMiddle);
      const range = viewportHeight * 0.82;
      const progress = 1 - clamp(distance / range, 0, 1);

      row.style.setProperty("--row-progress", progress.toFixed(3));
    });

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;

    window.requestAnimationFrame(updateRows);
    ticking = true;
  };

  updateRows();

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

/* =========================================================
   PROJECT POINTER LIGHTING
========================================================= */

function initProjectPointerLight() {
  const rows = document.querySelectorAll("[data-project-light]");

  if (!rows.length) return;

  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (!isFinePointer) return;

  rows.forEach((preview) => {
    const parentRow = preview.closest("[data-project-row]");

    if (!parentRow) return;

    preview.addEventListener("pointermove", (event) => {
      const rect = parentRow.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      parentRow.style.setProperty("--light-x", `${x.toFixed(2)}%`);
      parentRow.style.setProperty("--light-y", `${y.toFixed(2)}%`);
    });

    preview.addEventListener("pointerleave", () => {
      parentRow.style.setProperty("--light-x", "50%");
      parentRow.style.setProperty("--light-y", "50%");
    });
  });
}

/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

function initPortfolioAnchors() {
  const links = document.querySelectorAll('a[href^="#"]');

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

