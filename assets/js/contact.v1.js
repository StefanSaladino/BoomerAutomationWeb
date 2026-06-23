/* =========================================================
   BOOMER AUTOMATION — CONTACT JS
   File: contact.v1.js
   Purpose: page loader, reveal animations, hero parallax,
   Netlify form interaction state, textarea auto-resize,
   and desktop-only magnetic CTAs.
========================================================= */

/*
   Wait until the HTML document is ready before initializing
   contact-page behavior.
*/
document.addEventListener("DOMContentLoaded", () => {
  /*
     Initialize the page-specific loading screen.
  */
  initContactLoader();

  /*
     Initialize scroll reveal animations.
  */
  initContactRevealAnimations();

  /*
     Initialize the contact hero parallax image.
  */
  initContactHeroParallax();

  /*
     Add non-blocking submit state to the Netlify form.
  */
  initContactFormState();

  /*
     Auto-resize message textarea as the user types.
  */
  initTextareaAutoResize();

  /*
     Initialize desktop-only magnetic button movement.
  */
  initContactMagneticButtons();
});

/* =========================================================
   CONTACT LOADER
========================================================= */

/*
   Controls the contact page loading screen.

   Expected element:
   - #contactLoader

   Expected body class:
   - .loading
*/
function initContactLoader() {
  const loader = document.getElementById("contactLoader");

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
function initContactRevealAnimations() {
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
   Adds subtle parallax movement to the contact hero image.

   Expected element:
   - #contactHeroImage
*/
function initContactHeroParallax() {
  const heroImage = document.getElementById("contactHeroImage");

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
   CONTACT FORM STATE
========================================================= */

/*
   Adds a simple submitting state to the Netlify form.
   This does not prevent the form from submitting normally.
   Netlify still receives the POST request.
*/
function initContactFormState() {
  const form = document.querySelector("[data-contact-form]");

  /*
     Stop if the contact form is not present.
  */
  if (!form) return;

  const submitButton = form.querySelector(".contact-submit");

  /*
     Stop if the submit button is missing.
  */
  if (!submitButton) return;

  /*
     When the form submits, let the browser/Netlify handle the POST.
     Only update the button state for user feedback.
  */
  form.addEventListener("submit", () => {
    /*
       If required fields are invalid, the browser will show validation
       and the button should not switch to a sending state.
    */
    if (!form.checkValidity()) return;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  });
}

/* =========================================================
   TEXTAREA AUTO-RESIZE
========================================================= */

/*
   Auto-resizes textareas with the data-auto-resize attribute.
*/
function initTextareaAutoResize() {
  const textareas = document.querySelectorAll("[data-auto-resize]");

  /*
     Stop if no auto-resize textareas exist.
  */
  if (!textareas.length) return;

  /*
     Resize one textarea to match its content height.
  */
  const resizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  /*
     Attach resize behavior to each textarea.
  */
  textareas.forEach((textarea) => {
    resizeTextarea(textarea);

    textarea.addEventListener("input", () => {
      resizeTextarea(textarea);
    });
  });
}

/* =========================================================
   MAGNETIC BUTTONS
   Desktop only. Mobile users keep clean touch behavior.
========================================================= */

/*
   Adds subtle magnetic hover movement to elements with .magnetic.
*/
function initContactMagneticButtons() {
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