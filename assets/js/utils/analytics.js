export function trackEvent(name, detail = {}) {
  // 预留 GA4 / 其他分析工具集成
  // eslint-disable-next-line no-console
  console.debug("[analytics]", name, detail);

  if (typeof window.gtag === "function") {
    window.gtag("event", name, detail);
  }
}

