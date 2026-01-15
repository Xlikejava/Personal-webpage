import { qs } from "../utils/dom.js";

export class Skills {
  async init() {
    const container = qs("#skills-grid");
    if (!container) return;

    try {
      const resp = await fetch("assets/data/skills.json");
      const data = await resp.json();
      const groups = data.groups || [];

      container.innerHTML = groups
        .map(
          (g) => `
        <section class="card">
          <div class="card-inner">
            <header class="card-header">
              <div class="card-title">${g.title}</div>
            </header>
            <div>
              ${(g.items || [])
                .map(
                  (item) => `
                <div class="skill-item">
                  <div class="skill-item-header">
                    <span>${item.name}</span>
                    <span>${item.label || ""}</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-bar-fill" data-skill-level="${item.level}"></div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
      `
        )
        .join("");
    } catch {
      container.innerHTML =
        '<p style="color: var(--color-text-secondary); font-size: 0.9rem;">技能数据加载失败，可稍后刷新重试。</p>';
    }
  }
}

