import { qs, qsa, toggleClass } from "../utils/dom.js";

export class Core {
  init() {
    this.setupMobileNav();
    this.setupScrollSpy();
    this.setupBackToTop();
  }

  setupMobileNav() {
    const toggle = qs("[data-nav='toggle']");
    const panel = qs("[data-nav='panel']");

    if (!toggle || !panel) return;

    toggle.addEventListener("click", () => {
      toggleClass(panel, "is-open");
    });

    qsa("[data-nav='link']").forEach((link) => {
      link.addEventListener("click", () => {
        panel.classList.remove("is-open");
      });
    });
  }

  setupScrollSpy() {
    const sections = qsa("[data-section]");
    const navLinks = qsa("[data-nav='link']");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const hash = href.startsWith("#") ? href.slice(1) : "";
            link.classList.toggle("is-active", hash === id);
          });
        });
      },
      {
        threshold: 0.4,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  setupBackToTop() {
    const btn = qs("[data-back-to-top]");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      const show = window.scrollY > 360;
      toggleClass(btn, "is-visible", show);
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

