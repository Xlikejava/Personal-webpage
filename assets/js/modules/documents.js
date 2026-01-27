import { qs } from "../utils/dom.js";
import { trackEvent } from "../utils/analytics.js";

export class Documents {
  async init() {
    await this.loadDocuments();
    this.renderDocuments();
  }

  async loadDocuments() {
    try {
      const resp = await fetch("assets/data/documents.json");
      const data = await resp.json();
      this.categories = data.categories || [];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("加载文档数据失败", e);
      this.categories = [];
    }
  }

  renderDocuments() {
    const container = qs("#documents-container");
    if (!container) return;

    if (this.categories.length === 0) {
      container.innerHTML =
        '<p style="color: var(--color-text-secondary); font-size: 0.9rem;">文档数据加载失败，可稍后刷新重试。</p>';
      return;
    }

    container.innerHTML = this.categories
      .map(
        (category) => `
      <div class="document-category">
        <h3 class="document-category-title">${category.name}</h3>
        <ul class="document-list">
          ${category.documents
            .map(
              (doc) => `
            <li class="document-item">
              <a
                href="${doc.url}"
                target="_blank"
                rel="noopener"
                class="document-link"
                data-analytics="document-click"
                data-category="${category.id}"
                data-title="${doc.title}"
              >
                ${doc.title}
              </a>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `
      )
      .join("");

    // 添加点击事件追踪
    container
      .querySelectorAll("[data-analytics]")
      .forEach((el) =>
        el.addEventListener("click", () => {
          trackEvent("document-click", {
            category: el.dataset.category,
            title: el.dataset.title,
          });
        })
      );
  }
}
