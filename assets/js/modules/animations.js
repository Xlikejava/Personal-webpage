import { qsa } from "../utils/dom.js";

export class Animations {
  init() {
    this.setupReveal();
    this.setupSkillBars();
    this.setupNumberCounters();
    this.setupTypewriter();
  }

  setupReveal() {
    const elements = qsa(".fade-up, .scale-in");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // 交错延迟：同级兄弟元素依次出现
          const parent = entry.target.parentElement;
          const siblings = parent ? Array.from(parent.querySelectorAll(".fade-up, .scale-in")) : [];
          const index = siblings.indexOf(entry.target);
          const delay = index >= 0 ? index * 80 : 0;

          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  setupSkillBars() {
    const bars = qsa("[data-skill-level]");
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const level = Number(entry.target.dataset.skillLevel || "0");
          entry.target.style.transform = `scaleX(${Math.max(
            0,
            Math.min(1, level / 100)
          )})`;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  setupNumberCounters() {
    const els = qsa("[data-count-to]");
    if (!els.length) return;

    const animate = (el) => {
      const target = Number(el.dataset.countTo || "0");
      const duration = 900;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const value = Math.floor(target * progress);
        el.textContent = value.toLocaleString("zh-CN");
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    els.forEach((el) => observer.observe(el));
  }

  setupTypewriter() {
    const el = document.getElementById("code-typewriter");
    if (!el) return;

    const snippets = [
      `// MCP 工具注册 —— 统一元数据与入参 Schema
interface McpToolDef {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  handler: (params: unknown) => Promise<ToolResult>;
}

registry.register({
  name: "query_vehicle_records",
  description: "查询车辆档案与维保记录",
  inputSchema: z.object({ plateNo: z.string(), tenantCode: z.string() }),
  handler: async ({ plateNo, tenantCode }) => {
    const records = await db.vehicleRecord.findMany({
      where: { plateNo, tenantCode },
      orderBy: { serviceDate: "desc" },
    });
    return { content: [{ type: "text", text: JSON.stringify(records) }] };
  },
});`,
      `// Agent 工作流编排 —— 变量-LLM-工具-结构化输出
const workflow = new AgentWorkflow("maintenance-advisor");

workflow
  .input("vehicleInfo", z.object({ plateNo: z.string() }))
  .step("fetchRecords", tool("query_vehicle_records"))
  .step("analyzeLLM", llm({
    model: "deepseek-chat",
    systemPrompt: "你是汽修顾问，根据车辆档案推荐维保方案",
    context: { records: step("fetchRecords") },
    responseFormat: z.object({
      recommendation: z.string(),
      urgency: z.enum(["low", "medium", "high"]),
      estimatedCost: z.number(),
    }),
  }))
  .output(step("analyzeLLM"));`,
    ];

    let idx = 0;

    const typeSnippet = () => {
      const text = snippets[idx];
      idx = (idx + 1) % snippets.length;
      let i = 0;
      el.textContent = "";

      const tick = () => {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i += 2;
          window.setTimeout(tick, 18);
        } else {
          window.setTimeout(typeSnippet, 2200);
        }
      };

      tick();
    };

    typeSnippet();
  }
}

