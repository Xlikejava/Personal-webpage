/**
 * Spotlight — 鼠标跟随光斑效果
 * 卡片上鼠标移动时，光斑跟随鼠标位置
 */
import { qsa } from "../utils/dom.js";

export class Spotlight {
  constructor() {
    this.cards = [];
  }

  init() {
    this.cards = qsa(".project-card");
    if (!this.cards.length) return;

    this.cards.forEach((card) => {
      // 创建光斑元素
      const spot = document.createElement("div");
      spot.className = "spotlight-glow";
      spot.style.cssText =
        "position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity 0.3s;z-index:0";
      card.style.position = "relative";
      card.style.overflow = "hidden";
      card.insertBefore(spot, card.firstChild);

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spot.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(96, 165, 250, 0.15), rgba(139, 92, 246, 0.08), transparent)`;
        spot.style.opacity = "1";
      });

      card.addEventListener("mouseleave", () => {
        spot.style.opacity = "0";
      });
    });
  }
}
