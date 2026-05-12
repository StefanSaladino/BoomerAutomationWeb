document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html").then(setYear);

  prepareStaggers();
  initReveal();
  initParallax();
  setYear();
});

/* =========================================================
   COMPONENT LOADER
========================================================= */

function loadComponent(id, file) {
  return fetch(file)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${file}: ${response.status}`);
      }

      return response.text();
    })
    .then((data) => {
      const target = document.getElementById(id);

      if (target) {
        target.innerHTML = data;
      }

      if (id === "header") {
        initNavbar();
        setActiveNavLink();
      }

      if (id === "footer") {
        setYear();
      }
    })
    .catch(console.error);
}

/* =========================================================
   NAVBAR
========================================================= */

function initNavbar() {
  const navLinks = document.querySelectorAll(
    ".nav-link, .footer-links a, .btn-glass"
  );

  const navCollapse = document.querySelector(".navbar-collapse");

  if (!navCollapse) return;

  const bsCollapse =
    bootstrap.Collapse.getInstance(navCollapse) ||
    new bootstrap.Collapse(navCollapse, {
      toggle: false
    });

  navLinks.forEach((link) => {
    link.addEventListener(
      "click",
      () => {
        if (navCollapse.classList.contains("show")) {
          bsCollapse.hide();
        }
      },
      { passive: true }
    );
  });
}

/* =========================================================
   ACTIVE NAV LINK
========================================================= */

function setActiveNavLink() {
  const currentPath =
    window.location.pathname.split("/").pop() || "index.html";

  const currentHash = window.location.hash;

  document.querySelectorAll(".navbar .nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";

    const isCurrentPage = href === currentPath;

    const isHomePage =
      currentPath === "index.html" || currentPath === "";

    let active = false;

    if (href.includes("#")) {
      const [page, hash] = href.split("#");

      const samePage =
        page === "index.html"
          ? isHomePage
          : page === currentPath;

      active = samePage && currentHash === `#${hash}`;
    } else {
      active = isCurrentPage;
    }

    link.classList.toggle("active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* =========================================================
   FOOTER YEAR
========================================================= */

function setYear() {
  const yearEl = document.getElementById("currentYear");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* =========================================================
   STAGGER PREP
========================================================= */

function prepareStaggers() {
  document.querySelectorAll(".reveal-stagger").forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      child.style.transitionDelay = `${index * 70}ms`;
    });
  });
}

/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

function initReveal() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const targets = [
    ...document.querySelectorAll(".reveal"),
    ...document.querySelectorAll("[data-reveal]")
  ];

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add("active"));

    document
      .querySelectorAll(".reveal-stagger > *")
      .forEach((el) => el.classList.add("active"));

    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        entry.target.classList.add("active");

        obs.unobserve(entry.target);
      }
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -5% 0px"
    }
  );

  targets.forEach((el) => observer.observe(el));
}

/* =========================================================
   PARALLAX
========================================================= */

function initParallax() {
  const section = document.querySelector("[data-parallax-section]");
  const image = document.querySelector("[data-parallax-image]");

  if (!section || !image) return;

  const isMobile = window.matchMedia(
    "(max-width: 991.98px)"
  ).matches;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (isMobile || prefersReducedMotion) {
    image.style.transform = "scale(1.03)";
    return;
  }

  let latestY = 0;
  let ticking = false;

  const updateParallax = () => {
    image.style.transform =
      `translate3d(0, ${latestY}px, 0) scale(1.03)`;

    ticking = false;
  };

  const onScroll = () => {
    const rect = section.getBoundingClientRect();

    /*
      Extremely lightweight calculation.
      Small movement range prevents repaint stress.
    */

    latestY = rect.top * -0.02;

    /*
      Clamp movement.
    */

    if (latestY > 20) latestY = 20;
    if (latestY < -20) latestY = -20;

    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  onScroll();

  window.addEventListener("scroll", onScroll, {
    passive: true
  });

  window.addEventListener(
    "resize",
    () => requestAnimationFrame(onScroll),
    { passive: true }
  );
}