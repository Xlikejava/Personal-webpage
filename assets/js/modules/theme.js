import { getTheme, setTheme, getFontSizePref, setFontSizePref } from "../utils/storage.js";

export class ThemeManager {
  constructor() {
    this.themeToggle = document.querySelector("[data-action='toggle-theme']");
    this.fontSmall = document.querySelector("[data-font-size='small']");
    this.fontLarge = document.querySelector("[data-font-size='large']");
  }

  init() {
    const theme = getTheme();
    setTheme(theme);

    const fontSize = getFontSizePref();
    setFontSizePref(fontSize);
    this.syncFontButtons(fontSize);

    this.setupThemeToggle();
    this.setupFontSizeControls();
  }

  setupThemeToggle() {
    if (!this.themeToggle) return;

    this.themeToggle.addEventListener("click", () => {
      const current = getTheme();
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
      document.documentElement.style.transition = "background-color 0.3s var(--ease-in-out), color 0.3s var(--ease-in-out)";
      window.setTimeout(() => {
        document.documentElement.style.transition = "";
      }, 350);
    });
  }

  setupFontSizeControls() {
    if (this.fontSmall) {
      this.fontSmall.addEventListener("click", () => {
        setFontSizePref("small");
        this.syncFontButtons("small");
      });
    }
    if (this.fontLarge) {
      this.fontLarge.addEventListener("click", () => {
        setFontSizePref("large");
        this.syncFontButtons("large");
      });
    }
  }

  syncFontButtons(pref) {
    if (this.fontSmall) {
      this.fontSmall.classList.toggle("is-active", pref === "small");
    }
    if (this.fontLarge) {
      this.fontLarge.classList.toggle("is-active", pref === "large");
    }
  }
}

