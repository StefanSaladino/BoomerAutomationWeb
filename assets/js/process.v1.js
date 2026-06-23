/* =========================================================
   BOOMER AUTOMATION — PROCESS JS
   File: process.v1.js
   Purpose: page loader, reveal animations, hero parallax,
   block accordions, process progress line, and magnetic CTAs.
========================================================= */

/*
   Wait until the HTML document is ready before initializing
   process-page behavior.
*/
document.addEventListener("DOMContentLoaded", () => {
  /*
     Initialize the page-specific loading screen.
  */
  initProcessLoader();

  /*
     Initialize scroll reveal animations.
  */
  initProcessRevealAnimations();

  /*
     Initialize the process hero parallax image.
  */
  initProcessHeroParallax();

  /*
     Initialize block-style accordion rows.
  */
  initProcessAccordions();

  /*
     Initialize animated process progress line.
  */
  initProcessPathProgress();

  /*
     Initialize desktop-only magnetic button movement.
  */
  initProcessMagneticButtons();
});

/* =========================================================
   PROCESS LOADER
========================================================= */

/*
   Controls the process page loading screen.

   Expected element:
   - #processLoader

   Expected body class:
   - .loading
*/
function initProcessLoader() {
  const loader = document.getElementById("processLoader");

  /*
     If the loader does not exist, make sure the body cannot
     stay stuck in the loading state.
  */
  if (!loader) {
    document.body.classList.remove("loading");
    return;
  }

  /*
     Hide the loader after the full page load event.
     A short delay makes the transition feel intentional.
  */
  const hideLoader = () => {
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");
    }, 450);
  };

  /*
     If the page is already fully loaded, hide immediately.
     Otherwise, wait until images and assets are ready.
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
function initProcessRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  /*
     Stop if no reveal elements exist.
  */
  if (!revealItems.length) return;

  /*
     Use IntersectionObserver for efficient scroll animation.
  */
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        /*
           Ignore elements that are not entering the viewport.
        */
        if (!entry.isIntersecting) return;

        /*
           Add the global visible class.
        */
        entry.target.classList.add("is-visible");

        /*
           Animate each element once.
        */
        activeObserver.unobserve(entry.target);
      });
    },
    {
      /*
         Trigger when 18% of the element is visible.
      */
      threshold: 0.18,

      /*
         Trigger slightly before the element reaches the very
         bottom of the viewport.
      */
      rootMargin: "0px 0px -60px 0px",
    }
  );

  /*
     Start observing all reveal elements.
  */
  revealItems.forEach((item) => observer.observe(item));
}

/* =========================================================
   HERO PARALLAX
========================================================= */

/*
   Adds subtle parallax movement to the process hero image.

   Expected element:
   - #processHeroImage
*/
function initProcessHeroParallax() {
  const heroImage = document.getElementById("processHeroImage");

  /*
     Stop if the hero image does not exist.
  */
  if (!heroImage) return;

  /*
     Respect reduced motion preferences.
  */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  /*
     Prevent too many scroll updates per frame.
  */
  let ticking = false;

  /*
     Update the hero image transform based on scroll position.
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
       Allow future animation frame updates.
    */
    ticking = false;
  };

  /*
     Request one animation frame while scrolling.
  */
  const requestTick = () => {
    if (ticking) return;

    window.requestAnimationFrame(updateParallax);
    ticking = true;
  };

  /*
     Passive listener helps keep scroll smooth.
  */
  window.addEventListener("scroll", requestTick, { passive: true });
}

/* =========================================================
   PROCESS ACCORDIONS
========================================================= */

/*
   Controls the block-style accordion rows.

   Expected structure:
   - .process-accordion
   - .process-accordion-trigger
   - .process-accordion-panel
*/
function initProcessAccordions() {
  const accordions = document.querySelectorAll(".process-accordion");

  /*
     Stop if there are no accordions.
  */
  if (!accordions.length) return;

  /*
     Sets the visual height of an accordion panel.
  */
  const setPanelHeight = (accordion) => {
    const panel = accordion.querySelector(".process-accordion-panel");

    /*
       Stop if this accordion is missing its panel.
    */
    if (!panel) return;

    /*
       Open panels need their content height.
       Closed panels return to 0.
    */
    if (accordion.classList.contains("is-open")) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    } else {
      panel.style.maxHeight = "0px";
    }
  };

  /*
     Initialize all accordions on page load.
  */
  accordions.forEach((accordion) => {
    const trigger = accordion.querySelector(".process-accordion-trigger");

    /*
       Stop if this accordion is missing its button.
    */
    if (!trigger) return;

    /*
       Set the correct initial panel height.
    */
    setPanelHeight(accordion);

    /*
       Toggle the accordion when clicked.
    */
    trigger.addEventListener("click", () => {
      const isOpen = accordion.classList.contains("is-open");

      /*
         Close all accordions first so the section behaves cleanly.
      */
      accordions.forEach((item) => {
        const itemTrigger = item.querySelector(".process-accordion-trigger");

        item.classList.remove("is-open");

        if (itemTrigger) {
          itemTrigger.setAttribute("aria-expanded", "false");
        }

        setPanelHeight(item);
      });

      /*
         If the clicked accordion was closed, open it.
         If it was already open, it remains closed.
      */
      if (!isOpen) {
        accordion.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        setPanelHeight(accordion);
      }
    });
  });

  /*
     Recalculate open panel heights if the viewport changes.
     This prevents content clipping after resizing.
  */
  window.addEventListener("resize", () => {
    accordions.forEach((accordion) => setPanelHeight(accordion));
  });
}

/* =========================================================
   PROCESS PATH PROGRESS
========================================================= */

/*
   Animates the vertical progress line through the process section
   as the user scrolls.

   Expected element:
   - #processPathProgress
*/
function initProcessPathProgress() {
  const progress = document.getElementById("processPathProgress");
  const path = document.querySelector(".process-path");

  /*
     Stop if the process path elements are missing.
  */
  if (!progress || !path) return;

  /*
     Respect reduced motion by showing the full line immediately.
  */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    progress.style.height = "100%";
    return;
  }

  /*
     Update progress based on how much of the path section
     has passed through the viewport.
  */
  const updateProgress = () => {
    const rect = path.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    /*
       Calculate a scroll progress value from 0 to 1.
    */
    const rawProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

    /*
       Convert progress into a CSS height percentage.
    */
    progress.style.height = `${clampedProgress * 100}%`;
  };

  /*
     Run once immediately for refreshed/scrolled pages.
  */
  updateProgress();

  /*
     Keep the line updated while scrolling and resizing.
  */
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

/* =========================================================
   MAGNETIC BUTTONS
   Desktop only. Mobile users keep clean touch behavior.
========================================================= */

/*
   Adds subtle magnetic hover movement to elements with .magnetic.
*/
function initProcessMagneticButtons() {
  const buttons = document.querySelectorAll(".magnetic");

  /*
     Stop if no magnetic buttons exist.
  */
  if (!buttons.length) return;

  /*
     Only enable on fine pointer devices like a mouse.
  */
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (!isFinePointer) return;

  /*
     Add hover movement to each magnetic element.
  */
  buttons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      /*
         Get the button position and size.
      */
      const rect = button.getBoundingClientRect();

      /*
         Calculate cursor position relative to the button center.
      */
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      /*
         Move the button slightly toward the cursor.
      */
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    /*
       Reset button position when the cursor leaves.
    */
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}