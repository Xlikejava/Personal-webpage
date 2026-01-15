export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function on(event, selector, handler, scope = document) {
  scope.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && scope.contains(target)) {
      handler(e, target);
    }
  });
}

export function toggleClass(el, className, force) {
  if (!el) return;
  if (typeof force === "boolean") {
    el.classList.toggle(className, force);
  } else {
    el.classList.toggle(className);
  }
}

export function inViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight - offset && rect.bottom >= 0 + offset;
}

