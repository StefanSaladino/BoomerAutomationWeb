document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html").then(() => {
    setYear();
  });
});

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

      initReveal();
    })
    .catch((error) => {
      console.error(error);
    });
}

function initNavbar() {
  const navLinks = document.querySelectorAll(".nav-link, .footer-links a, .btn-glass");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const navCollapse = document.querySelector(".navbar-collapse");
      if (navCollapse && navCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
        bsCollapse.hide();
      }
    });
  });
}

function setActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const currentHash = window.location.hash;

  document.querySelectorAll(".navbar .nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isCurrentPage = href === currentPath;
    const isHomeSectionLink = currentPath === "index.html" || currentPath === "";

    let active = false;

    if (href.includes("#")) {
      const [page, hash] = href.split("#");
      const samePage = page === "index.html" ? isHomeSectionLink : page === currentPath;
      active = samePage && currentHash === `#${hash}`;
      if (href === "index.html#services" && isHomeSectionLink && currentHash === "#services") active = true;
      if (href === "index.html#contact" && isHomeSectionLink && currentHash === "#contact") active = true;
    } else {
      active = isCurrentPage;
    }

    if (active) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}

function setYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initParallax() {
  const section = document.querySelector("[data-parallax-section]");
  const image = document.querySelector("[data-parallax-image]");

  if (!section || !image) return;

  const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isMobile || prefersReducedMotion) {
    image.style.transform = "none";
    return;
  }

  let ticking = false;

  const updateParallax = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const distanceFromCenter = sectionCenter - viewportCenter;

    const translateY = Math.max(-60, Math.min(60, distanceFromCenter * -0.08));
    image.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.08)`;

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateParallax);
}

function initReveal() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll("[data-reveal], .reveal, .reveal-stagger");

  if (reduceMotion) {
    elements.forEach((el) => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
}