/* =========================================================
   BOOMER AUTOMATION — ABOUT JS
   File: about.v1.js
   Purpose: about page loader, reveal animations, hero
   parallax, counters, and magnetic CTAs.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initAboutLoader();
  initAboutRevealAnimations();
  initAboutHeroParallax();
  initAboutCounters();
  initAboutMagneticButtons();
});

/* =========================================================
   ABOUT LOADER
========================================================= */

function initAboutLoader() {
  const loader = document.getElementById("aboutLoader");

  if (!loader) {
    document.body.classList.remove("loading");
    return;
  }

  const hideLoader = () => {
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");
    }, 520);
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

function initAboutRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) return;

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
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* =========================================================
   HERO PARALLAX
========================================================= */

function initAboutHeroParallax() {
  const heroImage = document.getElementById("aboutHeroImage");

  if (!heroImage) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  let ticking = false;

  const updateParallax = () => {
    const movement = Math.min(window.scrollY * 0.16, 100);
    heroImage.style.transform = `translate3d(0, ${movement}px, 0) scale(1.06)`;
    ticking = false;
  };

  const requestTick = () => {
    if (ticking) return;

    window.requestAnimationFrame(updateParallax);
    ticking = true;
  };

  window.addEventListener("scroll", requestTick, { passive: true });
}

/* =========================================================
   COUNTERS
========================================================= */

function initAboutCounters() {
  const counters = document.querySelectorAll(".about-counter");

  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderValue = (counter, value) => {
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";

    counter.textContent = `${prefix}${value}${suffix}`;
  };

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.count);

    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion) {
      renderValue(counter, target);
      return;
    }

    const duration = 1250;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * easedProgress);

      renderValue(counter, currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    };

    window.requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        activeObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
    }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

function initAboutMagneticButtons() {
  const buttons = document.querySelectorAll(".magnetic");

  if (!buttons.length) return;

  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (!isFinePointer) return;

  buttons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}