/* ==========================================================================
   neurodiversified.org — shared behavior
   Plain JS, no build step, no framework. Three small jobs:
   1. Dark/light theme toggle, remembered in localStorage
   2. Mobile nav open/close
   3. Lightweight "reveal on scroll" for elements marked [data-reveal]
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Theme toggle ---------------- */
  var root = document.documentElement;
  var THEME_KEY = "neurodiversified-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.textContent = theme === "dark" ? "☀︎" : "☾";
    }
  }

  function getPreferredTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  applyTheme(getPreferredTheme());

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".theme-toggle");
    if (!toggle) return;
    var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------------- Mobile nav ---------------- */
  document.addEventListener("click", function (e) {
    var navToggle = e.target.closest(".nav-toggle");
    if (navToggle) {
      var nav = document.getElementById("main-nav");
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      return;
    }
  });

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Newsletter form (placeholder) ---------------- */
  document.addEventListener("submit", function (e) {
    var form = e.target.closest("[data-newsletter-form]");
    if (!form) return;
    // Placeholder behavior only — replace the form's `action` attribute with
    // your Formspree/ConvertKit endpoint and remove this preventDefault
    // once that's wired up.
    e.preventDefault();
    var note = form.querySelector("[data-form-status]");
    if (note) {
      note.textContent = "Thanks — this form isn't connected yet, but your email would be saved here.";
    }
  });
})();
