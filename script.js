document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header", "header.html");
    loadComponent("footer", "footer.html");
  });
  
  function loadComponent(id, file) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
        if (id === "header") {
          initNavbar();
        }
      })
      .catch(error => console.error(`Error loading ${file}:`, error));
  }
  
  // Re-init Bootstrap nav collapse behavior after injection
  function initNavbar() {
    const navLinks = document.querySelectorAll(".nav-link, .footer-links a");
  
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        const navCollapse = document.querySelector(".navbar-collapse");
        if (navCollapse && navCollapse.classList.contains("show")) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse)
            || new bootstrap.Collapse(navCollapse);
          bsCollapse.hide();
        }
      });
    });

  // =========================
// SCROLL REVEAL
// =========================

const revealElements = document.querySelectorAll(".reveal, .reveal-stagger");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // animate once
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(el => observer.observe(el));
  }