/* =========================================================
   BOOMER AUTOMATION — SERVICES JS
   File: services.v1.js
   Purpose: services page reveal animations, hero parallax,
   animated counters, and desktop-only magnetic CTAs.
========================================================= */

/*
   Wait until the HTML document is ready before initializing
   services-page behavior.
*/
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  /*
     Reveal sections and content as the user scrolls.
  */
  initServicesRevealAnimations();

  /*
     Add a subtle parallax movement to the services hero image.
  */
  initServicesHeroParallax();

  /*
     Animate the metric counters when they enter the viewport.
  */
  initServiceCounters();

  /*
     Add the desktop-only magnetic button hover effect.
  */
  initServicesMagneticButtons();
});

/* =========================================================
   LOADER
========================================================= */

/*
   Controls the loading screen.

   Expected element:
   - #siteLoader

   Expected body class:
   - .loading
*/
function initLoader() {
  const loader = document.getElementById("siteLoader");

  /*
     If there is no loader on the page, remove the loading class
     so the page cannot get stuck.
  */
  if (!loader) {
    document.body.classList.remove("loading");
    return;
  }

  /*
     Hides the loader shortly after the full page load event.
     The small delay makes the transition feel intentional instead
     of abrupt.
  */
  const hideLoader = () => {
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");
    }, 450);
  };

  /*
     If the page is already fully loaded, hide the loader immediately.
     Otherwise, wait for all page assets to finish loading.
  */
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
}

/* =========================================================
   SERVICES REVEAL ANIMATIONS
========================================================= */

/*
   Reveals elements using the existing global .reveal and
   .is-visible CSS classes.
*/
function initServicesRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  /*
     Stop if there are no reveal elements on this page.
  */
  if (!revealItems.length) return;

  /*
     Use IntersectionObserver for efficient scroll-based animation.
  */
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        /*
           Ignore anything that is not entering the viewport.
        */
        if (!entry.isIntersecting) return;

        /*
           Trigger CSS reveal animation.
        */
        entry.target.classList.add("is-visible");

        /*
           Animate each reveal item once.
        */
        activeObserver.unobserve(entry.target);
      });
    },
    {
      /*
         Trigger once 18% of the element is visible.
      */
      threshold: 0.18,

      /*
         Trigger slightly before the element hits the bottom
         of the viewport.
      */
      rootMargin: "0px 0px -60px 0px",
    },
  );

  /*
     Start watching all reveal elements.
  */
  revealItems.forEach((item) => observer.observe(item));
}

/* =========================================================
   SERVICES HERO PARALLAX
========================================================= */

/*
   Moves the services hero image slightly as the user scrolls.
*/
function initServicesHeroParallax() {
  const heroImage = document.getElementById("servicesHeroImage");

  /*
     Stop if the services hero image is not present.
  */
  if (!heroImage) return;

  /*
     Respect reduced motion settings.
  */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  /*
     Prevent excessive style updates during scroll.
  */
  let ticking = false;

  /*
     Apply transform based on page scroll position.
  */
  const updateParallax = () => {
    const scrollY = window.scrollY;

    /*
       Cap movement so the image does not drift too far.
    */
    const movement = Math.min(scrollY * 0.16, 100);

    /*
       Use translate3d for smoother GPU-accelerated movement.
    */
    heroImage.style.transform = `translate3d(0, ${movement}px, 0) scale(1.06)`;

    /*
       Allow the next requestAnimationFrame update.
    */
    ticking = false;
  };

  /*
     Request a single animation frame during scrolling.
  */
  const requestTick = () => {
    if (ticking) return;

    window.requestAnimationFrame(updateParallax);
    ticking = true;
  };

  /*
     Passive scroll listener keeps scrolling smooth.
  */
  window.addEventListener("scroll", requestTick, { passive: true });
}

/* =========================================================
   SERVICE COUNTERS
========================================================= */

/*
   Animates numbers inside elements with .metric-number.

   Expected markup:
   <span class="metric-number" data-count="30">0</span>
*/
function initServiceCounters() {
  const counters = document.querySelectorAll(".metric-number");

  /*
     Stop if no counters exist.
  */
  if (!counters.length) return;

  /*
     Respect reduced motion settings by jumping straight to
     the final counter value.
  */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /*
     Animate a single counter from 0 to its data-count value.
  */
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.count);

    /*
       If data-count is missing or invalid, do nothing.
    */
    if (!Number.isFinite(target)) return;

    /*
       If the user prefers reduced motion, immediately show
       the final value.
    */
    if (prefersReducedMotion) {
      counter.textContent = target;
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    /*
       Updates the counter value on each animation frame.
    */
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      /*
         Ease-out curve so the counter slows near the end.
      */
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      /*
         Calculate and render the current number.
      */
      const currentValue = Math.round(target * easedProgress);
      counter.textContent = currentValue;

      /*
         Continue until the animation reaches 100%.
      */
      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    };

    window.requestAnimationFrame(update);
  };

  /*
     Watch counters and animate them when visible.
  */
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        /*
           Ignore counters outside the viewport.
        */
        if (!entry.isIntersecting) return;

        /*
           Animate the visible counter.
        */
        animateCounter(entry.target);

        /*
           Only animate each counter once.
        */
        activeObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
    },
  );

  /*
     Start observing each counter.
  */
  counters.forEach((counter) => observer.observe(counter));
}

/* =========================================================
   MAGNETIC BUTTONS
   Desktop only. Mobile users keep clean touch behavior.
========================================================= */

/*
   Adds a subtle hover-follow movement to elements with .magnetic.
*/
function initServicesMagneticButtons() {
  const buttons = document.querySelectorAll(".magnetic");

  /*
     Stop if no magnetic buttons exist.
  */
  if (!buttons.length) return;

  /*
     Only run this effect on fine pointer devices, such as a mouse.
  */
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (!isFinePointer) return;

  /*
     Add cursor-follow effect to each magnetic button.
  */
  buttons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      /*
         Get button dimensions and position.
      */
      const rect = button.getBoundingClientRect();

      /*
         Calculate cursor offset from button center.
      */
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      /*
         Move the button slightly toward the cursor.
      */
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    /*
       Reset button position when cursor leaves.
    */
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}
