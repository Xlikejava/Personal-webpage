const THEME_KEY = "ashen-portfolio-theme";
const FONT_SIZE_KEY = "ashen-portfolio-font-size";

export function getTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function getFontSizePref() {
  const stored = localStorage.getItem(FONT_SIZE_KEY);
  if (stored === "small" || stored === "large") return stored;
  return "base";
}

export function setFontSizePref(pref) {
  const html = document.documentElement;
  html.removeAttribute("data-font-size");
  if (pref === "small" || pref === "large") {
    html.setAttribute("data-font-size", pref);
  }
  localStorage.setItem(FONT_SIZE_KEY, pref);
}

