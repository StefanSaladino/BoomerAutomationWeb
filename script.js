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