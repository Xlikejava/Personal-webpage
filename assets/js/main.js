import { Core } from "./modules/core.js";
import { ThemeManager } from "./modules/theme.js";
import { ProjectManager } from "./modules/projects.js";
import { Skills } from "./modules/skills.js";
import { Timeline } from "./modules/timeline.js";
import { Animations } from "./modules/animations.js";
import { Contact } from "./modules/contact.js";
import { Documents } from "./modules/documents.js";

window.addEventListener("DOMContentLoaded", async () => {
  const core = new Core();
  core.init();

  const theme = new ThemeManager();
  theme.init();

  const skills = new Skills();
  skills.init();

  const animations = new Animations();
  animations.init();

  const projects = new ProjectManager();
  projects.init();

  const timeline = new Timeline();
  timeline.init();

  const documents = new Documents();
  documents.init();

  const contact = new Contact();
  contact.init();

  // 从配置注入静态信息（可选）
  try {
    const resp = await fetch("assets/data/config.json");
    const cfg = await resp.json();
    if (cfg?.social) {
      const github = document.querySelector("[data-social='github']");
      if (github && cfg.social.github) {
        github.href = cfg.social.github;
      }
      const linkedin = document.querySelector("[data-social='linkedin']");
      if (linkedin && cfg.social.linkedin) {
        linkedin.href = cfg.social.linkedin;
      }
      const blog = document.querySelector("[data-social='blog']");
      if (blog && cfg.social.blog) {
        blog.href = cfg.social.blog;
      }
    }
  } catch {
    // 安静失败
  }
});

