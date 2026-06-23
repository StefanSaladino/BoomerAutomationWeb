/* =========================================================
   BOOMER AUTOMATION — HOME JS
   File: home.v1.js
   Purpose: loader, parallax hero, reveal animations,
   mobile-friendly magnetic CTAs.
========================================================= */

/*
   Wait until the HTML document has loaded before initializing
   homepage-specific effects.
*/
document.addEventListener("DOMContentLoaded", () => {
  /*
     Initialize the page loader first so the loading state can
     be removed once assets are ready.
  */
  initLoader();

  /*
     Initialize scroll-triggered reveal animations for sections
     and elements using the .reveal class.
  */
  initRevealAnimations();

  /*
     Initialize the hero image parallax effect.
  */
  initHeroParallax();

  /*
     Initialize desktop-only magnetic button movement.
  */
  initMagneticButtons();
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
   REVEAL ANIMATIONS
========================================================= */

/*
   Reveals elements when they enter the viewport.

   Expected class:
   - .reveal

   Added class:
   - .is-visible
*/
function initRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  /*
     Stop if there are no reveal elements on the page.
  */
  if (!revealItems.length) return;

  /*
     IntersectionObserver is used instead of scroll calculations
     for better performance and cleaner logic.
  */
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        /*
           Ignore elements that are not currently entering view.
        */
        if (!entry.isIntersecting) return;

        /*
           Add the visible class to trigger the CSS transition.
        */
        entry.target.classList.add("is-visible");

        /*
           Stop watching this element after it has animated once.
        */
        activeObserver.unobserve(entry.target);
      });
    },
    {
      /*
         The element must be at least 18% visible before animating.
      */
      threshold: 0.18,

      /*
         Trigger slightly before the element reaches the very bottom
         of the viewport.
      */
      rootMargin: "0px 0px -60px 0px",
    }
  );

  /*
     Start observing each reveal element.
  */
  revealItems.forEach((item) => observer.observe(item));
}

/* =========================================================
   HERO PARALLAX
========================================================= */

/*
   Applies a subtle parallax movement to the hero image on scroll.

   Expected element:
   - #heroParallaxImage
*/
function initHeroParallax() {
  const heroImage = document.getElementById("heroParallaxImage");

  /*
     Stop if the hero image does not exist on this page.
  */
  if (!heroImage) return;

  /*
     Respect users who prefer reduced motion.
  */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  /*
     Prevent excessive style updates during scroll.
     requestAnimationFrame batches the transform updates efficiently.
  */
  let ticking = false;

  /*
     Updates the hero image transform based on scroll position.
  */
  const updateParallax = () => {
    const scrollY = window.scrollY;

    /*
       Move the image downward slightly as the user scrolls.
       The cap prevents excessive movement.
    */
    const movement = Math.min(scrollY * 0.18, 110);

    /*
       translate3d helps browsers use GPU acceleration.
    */
    heroImage.style.transform = `translate3d(0, ${movement}px, 0) scale(1.06)`;

    /*
       Allow the next animation frame request.
    */
    ticking = false;
  };

  /*
     Requests a single animation frame when scrolling.
  */
  const requestTick = () => {
    if (ticking) return;

    window.requestAnimationFrame(updateParallax);
    ticking = true;
  };

  /*
     Passive listener improves scrolling performance.
  */
  window.addEventListener("scroll", requestTick, { passive: true });
}

/* =========================================================
   MAGNETIC BUTTONS
   Desktop only. Mobile users keep clean touch behavior.
========================================================= */

/*
   Adds a subtle magnetic hover movement to buttons with .magnetic.

   Expected class:
   - .magnetic
*/
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".magnetic");

  /*
     Stop if there are no magnetic buttons on the page.
  */
  if (!buttons.length) return;

  /*
     Only enable this effect for fine pointer devices like a mouse.
     This prevents awkward behavior on touch devices.
  */
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (!isFinePointer) return;

  /*
     Add mouse movement behavior to each magnetic button.
  */
  buttons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      /*
         Get button position and dimensions relative to the viewport.
      */
      const rect = button.getBoundingClientRect();

      /*
         Calculate cursor offset from the button center.
      */
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      /*
         Move the button slightly toward the cursor.
      */
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    /*
       Reset the button position when the cursor leaves.
    */
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}