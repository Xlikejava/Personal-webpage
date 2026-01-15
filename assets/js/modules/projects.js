import { qs } from "../utils/dom.js";
import { trackEvent } from "../utils/analytics.js";

export class ProjectManager {
  constructor() {
    this.projects = [];
    this.filters = new Set();
  }

  async init() {
    await this.loadProjects();
    this.renderFilters();
    this.renderProjects();
    this.setupFilterClicks();
  }

  async loadProjects() {
    try {
      const resp = await fetch("assets/data/projects.json");
      const data = await resp.json();
      this.projects = data.projects || [];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("加载项目数据失败", e);
      this.projects = [];
    }
  }

  renderFilters() {
    const container = qs("#project-filters");
    if (!container || this.projects.length === 0) return;

    const categories = new Set();
    const techs = new Set();
    this.projects.forEach((p) => {
      (p.category || []).forEach((c) => categories.add(c));
      (p.techStack || []).forEach((t) => techs.add(t));
    });

    const buildBtn = (id, label) =>
      `<button class="filter-btn" data-filter="${id}">${label}</button>`;

    container.innerHTML =
      buildBtn("all", "全部") +
      Array.from(categories)
        .map((c) => buildBtn(c, c))
        .join("") +
      Array.from(techs)
        .slice(0, 6)
        .map((t) => buildBtn(t.toLowerCase(), t))
        .join("");
  }

  filteredProjects() {
    if (this.filters.size === 0 || this.filters.has("all")) return this.projects;

    const filters = Array.from(this.filters);
    return this.projects.filter((p) => {
      const techs = (p.techStack || []).map((t) => t.toLowerCase());
      const cats = p.category || [];
      return filters.some(
        (f) => cats.includes(f) || techs.some((t) => t.includes(f))
      );
    });
  }

  renderProjects() {
    const container = qs("#projects-container");
    if (!container) return;

    const items = this.filteredProjects();
    if (items.length === 0) {
      container.innerHTML =
        '<p style="color: var(--color-text-secondary); font-size: 0.9rem;">暂无匹配的项目。</p>';
      return;
    }

    container.innerHTML = items
      .map(
        (p) => `
      <article class="project-card">
        <header>
          <div class="project-badge">${(p.category || [])[0] || "项目"}</div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-description">${p.shortDescription || ""}</p>
        </header>
        <div>
          <div class="tags">
            ${(p.techStack || [])
              .map(
                (t) =>
                  `<span class="tag" data-tech="${t.toLowerCase()}">${t}</span>`
              )
              .join("")}
          </div>
          ${
            p.metrics
              ? `<div class="project-metrics">
            ${Object.entries(p.metrics)
              .map(
                ([label, value]) => `
              <div class="metric">
                <span class="metric-value">${value}</span>
                <span class="metric-label">${label}</span>
              </div>`
              )
              .join("")}
          </div>`
              : ""
          }
        </div>
        <footer class="project-card-footer">
          ${
            p.githubUrl
              ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-ghost" data-analytics="project-github" data-project="${p.id}">查看代码</a>`
              : ""
          }
          ${
            p.demoUrl
              ? `<a href="${p.demoUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" data-analytics="project-demo" data-project="${p.id}">在线演示</a>`
              : ""
          }
        </footer>
      </article>
    `
      )
      .join("");

    container
      .querySelectorAll("[data-analytics]")
      .forEach((el) =>
        el.addEventListener("click", () => {
          trackEvent(el.dataset.analytics || "project-click", {
            projectId: el.dataset.project,
          });
        })
      );
  }

  setupFilterClicks() {
    const container = qs("#project-filters");
    if (!container) return;

    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      const filter = btn.dataset.filter;

      if (filter === "all") {
        this.filters.clear();
        container
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      } else {
        const isActive = btn.classList.toggle("active");
        if (isActive) {
          this.filters.add(filter);
          container
            .querySelector(".filter-btn[data-filter='all']")
            ?.classList.remove("active");
        } else {
          this.filters.delete(filter);
        }
      }

      this.renderProjects();
    });
  }
}

