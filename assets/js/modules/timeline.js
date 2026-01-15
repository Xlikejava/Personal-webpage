import { qs } from "../utils/dom.js";

export class Timeline {
  async init() {
    const container = qs("#timeline-list");
    if (!container) return;

    try {
      const resp = await fetch("assets/data/timeline.json");
      const data = await resp.json();
      const items = data.items || [];

      container.innerHTML = items
        .map(
          (item) => `
        <article class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-year">${item.year}</div>
          <h3 class="timeline-title">${item.title}</h3>
          <p class="timeline-body">${item.body}</p>
          ${
            item.tags && item.tags.length
              ? `<div class="timeline-tags tags">
                ${item.tags
                  .map((t) => `<span class="tag">${t}</span>`)
                  .join("")}
              </div>`
              : ""
          }
        </article>
      `
        )
        .join("");
    } catch {
      container.innerHTML =
        '<p style="color: var(--color-text-secondary); font-size: 0.9rem;">时间轴数据加载失败。</p>';
    }
  }
}

