/* =========================================================
   BOOMER AUTOMATION — SYSTEMS JS
   File: systems.v1.js
   Purpose: systems page loader, reveal animations, hero
   parallax, interactive blueprint, counters, and magnetic CTAs.
========================================================= */

/*
   Wait until the HTML document is ready before initializing
   systems-page behavior.
*/
document.addEventListener("DOMContentLoaded", () => {
  /*
     Initialize the page-specific loading screen.
  */
  initSystemsLoader();

  /*
     Initialize scroll reveal animations.
  */
  initSystemsRevealAnimations();

  /*
     Initialize the hero parallax image.
  */
  initSystemsHeroParallax();

  /*
     Initialize animated metrics counters.
  */
  initSystemsCounters();

  /*
     Initialize the interactive systems blueprint.
  */
  initSystemsBlueprint();

  /*
     Initialize desktop-only magnetic button movement.
  */
  initSystemsMagneticButtons();
});

/* =========================================================
   SYSTEMS LOADER
========================================================= */

/*
   Controls the systems page loading screen.

   Expected element:
   - #systemsLoader

   Expected body class:
   - .loading
*/
function initSystemsLoader() {
  const loader = document.getElementById("systemsLoader");

  /*
     If the loader does not exist, make sure the page cannot
     stay stuck in a loading state.
  */
  if (!loader) {
    document.body.classList.remove("loading");
    return;
  }

  /*
     Hide the loader after the full page load event.
     A slightly longer delay gives this page a more premium
     intentional load transition.
  */
  const hideLoader = () => {
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");
    }, 650);
  };

  /*
     If the page is already fully loaded, hide immediately.
     Otherwise, wait for images and assets to finish loading.
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
function initSystemsRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  /*
     Stop if there are no reveal elements on this page.
  */
  if (!revealItems.length) return;

  /*
     Use IntersectionObserver for performant scroll reveals.
  */
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        /*
           Ignore elements that are not currently entering view.
        */
        if (!entry.isIntersecting) return;

        /*
           Add the visible class used by global CSS.
        */
        entry.target.classList.add("is-visible");

        /*
           Reveal each element only once.
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
         Trigger slightly before the element reaches the bottom
         of the viewport.
      */
      rootMargin: "0px 0px -60px 0px",
    }
  );

  /*
     Start watching each reveal element.
  */
  revealItems.forEach((item) => observer.observe(item));
}

/* =========================================================
   HERO PARALLAX
========================================================= */

/*
   Adds subtle parallax motion to the systems hero image.

   Expected element:
   - #systemsHeroImage
*/
function initSystemsHeroParallax() {
  const heroImage = document.getElementById("systemsHeroImage");

  /*
     Stop if the hero image does not exist.
  */
  if (!heroImage) return;

  /*
     Respect users who prefer reduced motion.
  */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  /*
     Prevent excessive scroll-based style updates.
  */
  let ticking = false;

  /*
     Update hero transform based on scroll position.
  */
  const updateParallax = () => {
    const scrollY = window.scrollY;

    /*
       Cap movement so the image never drifts too far.
    */
    const movement = Math.min(scrollY * 0.16, 100);

    /*
       Use translate3d for smoother GPU-accelerated motion.
    */
    heroImage.style.transform = `translate3d(0, ${movement}px, 0) scale(1.06)`;

    /*
       Allow another animation frame update.
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
     Passive scroll listener keeps scrolling smooth.
  */
  window.addEventListener("scroll", requestTick, { passive: true });
}

/* =========================================================
   SYSTEM COUNTERS
========================================================= */

/*
   Animates metric numbers when they enter the viewport.

   Expected markup:
   <span class="systems-counter" data-count="4">0</span>
*/
function initSystemsCounters() {
  const counters = document.querySelectorAll(".systems-counter");

  /*
     Stop if there are no counters.
  */
  if (!counters.length) return;

  /*
     Respect reduced motion by jumping to the final values.
  */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /*
     Animate a single counter.
  */
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.count);

    /*
       Stop if the counter target is missing or invalid.
    */
    if (!Number.isFinite(target)) return;

    /*
       Reduced motion users get the final value immediately.
    */
    if (prefersReducedMotion) {
      counter.textContent = target;
      return;
    }

    const duration = 1250;
    const startTime = performance.now();

    /*
       Update the number each animation frame.
    */
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      /*
         Ease-out curve for a more premium count animation.
      */
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      /*
         Render the current rounded number.
      */
      counter.textContent = Math.round(target * easedProgress);

      /*
         Continue until finished.
      */
      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    };

    window.requestAnimationFrame(update);
  };

  /*
     Observe counters and trigger them when visible.
  */
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        /*
           Ignore counters that are not visible yet.
        */
        if (!entry.isIntersecting) return;

        /*
           Animate the visible counter.
        */
        animateCounter(entry.target);

        /*
           Animate each counter once.
        */
        activeObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
    }
  );

  /*
     Start observing counters.
  */
  counters.forEach((counter) => observer.observe(counter));
}

/* =========================================================
   INTERACTIVE BLUEPRINT
========================================================= */

/*
   Controls the systems blueprint interaction.

   Expected controls:
   - [data-system-control]

   Expected details:
   - [data-system-detail]

   Expected stage:
   - .blueprint-stage
*/
function initSystemsBlueprint() {
  const controls = document.querySelectorAll("[data-system-control]");
  const details = document.querySelectorAll("[data-system-detail]");
  const stage = document.querySelector(".blueprint-stage");

  /*
     Stop if required blueprint elements are missing.
  */
  if (!controls.length || !details.length || !stage) return;

  /*
     Activate one blueprint system by key.
  */
  const activateSystem = (systemKey) => {
    /*
       Update active control button.
    */
    controls.forEach((control) => {
      const isActive = control.dataset.systemControl === systemKey;

      control.classList.toggle("is-active", isActive);
      control.setAttribute("aria-selected", String(isActive));
    });

    /*
       Update active detail panel.
    */
    details.forEach((detail) => {
      const isActive = detail.dataset.systemDetail === systemKey;

      detail.classList.toggle("is-active", isActive);
    });

    /*
       Update the blueprint visual state.
    */
    stage.dataset.activeSystem = systemKey;
  };

  /*
     Add click behavior to each control.
  */
  controls.forEach((control) => {
    control.addEventListener("click", () => {
      activateSystem(control.dataset.systemControl);
    });
  });

  /*
     Default to the first system if nothing is active.
  */
  const firstSystem = controls[0].dataset.systemControl;

  if (firstSystem) {
    activateSystem(firstSystem);
  }
}

/* =========================================================
   MAGNETIC BUTTONS
   Desktop only. Mobile users keep clean touch behavior.
========================================================= */

/*
   Adds subtle magnetic hover movement to elements with .magnetic.
*/
function initSystemsMagneticButtons() {
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
     Add cursor-follow movement to each magnetic element.
  */
  buttons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      /*
         Get button position and dimensions.
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
       Reset button position when the cursor leaves.
    */
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}