
---
# 技术设计文档TECH_DESIGN.md

## 1. 架构设计概述

### 1.1 系统架构图
```
┌─────────────────────────────────────────────────────────────┐
│                    客户端浏览器                              │
├─────────────────────────────────────────────────────────────┤
│ 静态资源 (GitHub Pages / Netlify / Vercel)                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ index.html (SPA式单页应用)                          │  │
│  │  • 语义化HTML结构     • 渐进增强加载                │  │
│  │  • 动态内容注入       • 路由管理(hash-based)        │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ assets/ (静态资源)                                  │  │
│  │  ├── css/     # 样式文件                            │  │
│  │  ├── js/      # JavaScript逻辑                      │  │
│  │  ├── images/  # 图片资源(WebP+懒加载)               │  │
│  │  └── data/    # JSON配置文件                        │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 第三方服务集成                                       │  │
│  │  • Formspree/EmailJS (联系表单)                     │  │
│  │  • Google Analytics (分析)                          │  │
│  │  • GitHub API (项目数据)                            │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术选型决策
| 技术领域 | 技术选择 | 版本/配置 | 选型理由 |
|---------|---------|-----------|----------|
| **核心语言** | HTML5 / CSS3 / ES6+ | 原生实现 | 轻量、可控、无需编译 |
| **CSS架构** | BEM + CSS自定义属性 | 原生CSS | 清晰命名、主题切换支持 |
| **JavaScript** | 原生ES6+模块 | 现代浏览器支持 | 无框架依赖，性能最优 |
| **构建工具** | 可选Vite（仅开发） | 4.x+ | 开发体验好，HMR支持 |
| **图标系统** | SVG Sprite + FontAwesome | 按需使用 | 矢量、可定制、性能好 |
| **字体加载** | Google Fonts + 字体降级 | Inter字体 | 现代感、加载优化 |
| **表单处理** | Formspree免费版 | - | 简单可靠，无需后端 |
| **分析工具** | Google Analytics 4 | 最新 | 免费、功能全面 |
| **代码高亮** | Prism.js | 轻量版 | 语法高亮，定制性强 |
| **动画库** | 纯CSS动画 + 少量GSAP | GSAP 3.x | 性能优先，复杂动效补充 |

### 1.3 性能优先设计原则
1. **关键渲染路径优化**：内联关键CSS、异步非关键JS
2. **资源加载策略**：懒加载、预加载、按需加载
3. **缓存策略**：长期缓存静态资源、版本化文件名
4. **图片优化**：WebP格式、响应式图片、懒加载

## 2. 文件结构设计

```
ashen-portfolio/
├── index.html                    # 主入口文件
├── 404.html                      # 404错误页面
├── robots.txt                    # 搜索引擎爬虫配置
├── sitemap.xml                   # 网站地图（SEO）
├── .htaccess                     # Apache配置（如需）
├── CNAME                         # 自定义域名配置
│
├── assets/                       # 静态资源
│   ├── css/
│   │   ├── base.css             # 基础样式重置与变量
│   │   ├── layout.css           # 布局与网格系统
│   │   ├── components.css       # 组件样式
│   │   ├── animations.css       # 动画与过渡
│   │   ├── themes.css           # 主题样式（暗色/亮色）
│   │   └── print.css            # 打印样式
│   │
│   ├── js/
│   │   ├── modules/             # ES6模块
│   │   │   ├── core.js          # 核心功能
│   │   │   ├── animations.js    # 动画控制器
│   │   │   ├── projects.js      # 项目展示逻辑
│   │   │   ├── contact.js       # 联系表单处理
│   │   │   └── theme.js         # 主题切换
│   │   │
│   │   ├── utils/               # 工具函数
│   │   │   ├── dom.js           # DOM操作助手
│   │   │   ├── storage.js       # 本地存储
│   │   │   ├── validation.js    # 表单验证
│   │   │   └── analytics.js     # 分析事件追踪
│   │   │
│   │   └── main.js              # 主入口文件（模块导入）
│   │
│   ├── images/
│   │   ├── avatar/              # 头像相关
│   │   │   ├── avatar.webp      # 主头像(WebP)
│   │   │   ├── avatar@2x.webp   # 2x高清版
│   │   │   └── avatar.jpg       # JPEG回退
│   │   │
│   │   ├── projects/            # 项目截图
│   │   │   ├── project1/
│   │   │   │   ├── thumb.webp   # 缩略图
│   │   │   │   └── full.webp    # 详情图
│   │   │   └── ...
│   │   │
│   │   ├── icons/               # SVG图标
│   │   │   ├── sprite.svg       # SVG雪碧图
│   │   │   ├── php.svg          # PHP图标
│   │   │   ├── github.svg       # GitHub图标
│   │   │   └── ...
│   │   │
│   │   └── backgrounds/         # 背景图片
│   │       ├── grid-pattern.svg # 网格背景
│   │       └── noise.png        # 噪点纹理
│   │
│   ├── fonts/                    # 本地字体（可选）
│   │   ├── inter-var.woff2      # Inter可变字体
│   │   └── inter-subset.woff2   # 子集字体
│   │
│   └── data/                     # 静态数据
│       ├── projects.json        # 项目数据
│       ├── skills.json          # 技能数据
│       ├── timeline.json        # 时间轴数据
│       └── config.json          # 站点配置
│
├── components/                   # HTML组件（服务端包含模拟）
│   ├── header.html              # 头部导航
│   ├── hero.html                # 英雄区
│   ├── skills.html              # 技能展示
│   ├── projects-grid.html       # 项目网格
│   ├── contact-form.html        # 联系表单
│   └── footer.html              # 页脚
│
└── docs/                         # 文档
    ├── DESIGN_SYSTEM.md         # 设计系统文档
    └── DEPLOYMENT.md            # 部署指南
```

## 3. 核心模块技术设计

### 3.1 主题切换系统
```css
/* assets/css/base.css - CSS自定义属性定义 */
:root {
  /* 亮色主题 */
  --color-primary: #2a6bc9;
  --color-primary-dark: #1a4a9c;
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #0f172a;
  --color-text-secondary: #475569;
  --color-border: #e2e8f0;
  
  /* 间距系统 */
  --space-unit: 0.25rem;
  --space-xs: calc(var(--space-unit) * 1);  /* 4px */
  --space-sm: calc(var(--space-unit) * 2);  /* 8px */
  --space-md: calc(var(--space-unit) * 4);  /* 16px */
  --space-lg: calc(var(--space-unit) * 8);  /* 32px */
  
  /* 阴影系统 */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.2);
  
  /* 动画曲线 */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}

[data-theme="dark"] {
  /* 暗色主题覆盖 */
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-border: #334155;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
}
```

```javascript
// assets/js/modules/theme.js
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('portfolio-theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }
  
  init() {
    this.applyTheme();
    this.setupListeners();
  }
  
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('portfolio-theme', this.theme);
  }
  
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    
    // 触发动画过渡
    document.documentElement.style.transition = 'background-color 0.3s var(--ease-in-out)';
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  }
  
  setupListeners() {
    // 主题切换按钮
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio-theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }
}
```

### 3.2 响应式图片加载策略
```html
<!-- 图片组件示例 -->
<picture>
  <!-- WebP格式（现代浏览器） -->
  <source 
    srcset="assets/images/avatar/avatar.webp 1x,
            assets/images/avatar/avatar@2x.webp 2x"
    type="image/webp">
  
  <!-- JPEG回退 -->
  <source 
    srcset="assets/images/avatar/avatar.jpg 1x,
            assets/images/avatar/avatar@2x.jpg 2x"
    type="image/jpeg">
  
  <!-- 最终回退 -->
  <img 
    src="assets/images/avatar/avatar.jpg"
    alt="阿绅的头像"
    loading="lazy"
    width="320"
    height="320"
    class="avatar-image">
</picture>
```

### 3.3 项目数据管理
```javascript
// assets/data/projects.json
{
  "projects": [
    {
      "id": "ecommerce-microservices",
      "title": "电商微服务平台",
      "slug": "ecommerce-microservices",
      "shortDescription": "基于Go和微服务的电商平台，支持日订单100万+",
      "fullDescription": "完整项目描述...技术挑战、解决方案、成果数据等详细内容。",
      "techStack": ["PHP", "Laravel", "MySQL", "Redis", "Docker", "Kubernetes"],
      "completionDate": "2023-12",
      "githubUrl": "https://github.com/example/ecommerce",
      "demoUrl": "https://demo.example.com",
      "image": {
        "thumb": "assets/images/projects/ecommerce/thumb.webp",
        "full": "assets/images/projects/ecommerce/full.webp"
      },
      "metrics": {
        "orders": "100万+/日",
        "responseTime": "<100ms",
        "availability": "99.99%"
      },
      "featured": true,
      "category": ["backend", "architecture"]
    }
  ],
  "categories": [
    { "id": "backend", "name": "后端开发", "count": 4 },
    { "id": "architecture", "name": "系统架构", "count": 3 }
  ]
}
```

```javascript
// assets/js/modules/projects.js
class ProjectManager {
  constructor() {
    this.projects = [];
    this.filters = new Set();
    this.init();
  }
  
  async init() {
    await this.loadProjects();
    this.renderProjects();
    this.setupFiltering();
  }
  
  async loadProjects() {
    try {
      const response = await fetch('assets/data/projects.json');
      const data = await response.json();
      this.projects = data.projects;
    } catch (error) {
      console.error('加载项目数据失败:', error);
      this.projects = [];
    }
  }
  
  renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    const filteredProjects = this.filterProjects();
    
    container.innerHTML = filteredProjects.map(project => `
      <article class="project-card" data-id="${project.id}">
        <div class="card-header">
          <div class="project-badge">${project.category[0]}</div>
          <h3 class="project-title">${project.title}</h3>
          <time class="project-date">${project.completionDate}</time>
        </div>
        
        <div class="project-content">
          <p class="project-description">${project.shortDescription}</p>
          
          <div class="tech-tags">
            ${project.techStack.map(tech => `
              <span class="tech-tag" data-tech="${tech.toLowerCase()}">${tech}</span>
            `).join('')}
          </div>
          
          ${project.metrics ? `
          <div class="project-metrics">
            ${Object.entries(project.metrics).map(([key, value]) => `
              <div class="metric">
                <span class="metric-value">${value}</span>
                <span class="metric-label">${key}</span>
              </div>
            `).join('')}
          </div>` : ''}
        </div>
        
        <div class="card-actions">
          ${project.githubUrl ? `
          <a href="${project.githubUrl}" class="btn btn-secondary" target="_blank" rel="noopener">
            <svg class="icon"><use href="assets/images/icons/sprite.svg#github"></use></svg>
            查看代码
          </a>` : ''}
          
          <button class="btn btn-primary view-details" data-project="${project.id}">
            查看详情
          </button>
        </div>
      </article>
    `).join('');
    
    this.attachDetailHandlers();
  }
  
  filterProjects() {
    if (this.filters.size === 0) return this.projects;
    
    return this.projects.filter(project => 
      Array.from(this.filters).some(filter => 
        project.techStack.some(tech => 
          tech.toLowerCase().includes(filter.toLowerCase())
        ) || 
        project.category.includes(filter)
      )
    );
  }
  
  setupFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        if (this.filters.has(filter)) {
          this.filters.delete(filter);
          btn.classList.remove('active');
        } else {
          this.filters.add(filter);
          btn.classList.add('active');
        }
        
        this.renderProjects();
      });
    });
  }
  
  attachDetailHandlers() {
    document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = e.target.dataset.project;
        this.showProjectDetails(projectId);
      });
    });
  }
  
  showProjectDetails(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    
    // 创建并显示模态框
    const modal = this.createDetailModal(project);
    document.body.appendChild(modal);
    modal.showModal();
  }
}
```

### 3.4 联系表单集成
```html
<!-- 联系表单组件 -->
<form id="contact-form" class="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
  <!-- Honeypot防垃圾 -->
  <input type="text" name="_gotcha" style="display:none">
  
  <!-- CSRF保护（Formspree自动处理） -->
  <input type="hidden" name="_subject" value="阿绅个人网站 - 新消息">
  <input type="hidden" name="_language" value="zh">
  
  <div class="form-group">
    <label for="name">姓名 *</label>
    <input type="text" id="name" name="name" required minlength="2" maxlength="50">
    <div class="error-message" data-for="name"></div>
  </div>
  
  <div class="form-group">
    <label for="email">邮箱 *</label>
    <input type="email" id="email" name="email" required>
    <div class="error-message" data-for="email"></div>
  </div>
  
  <div class="form-group">
    <label for="message">消息内容 *</label>
    <textarea id="message" name="message" rows="5" required minlength="10" maxlength="1000"></textarea>
    <div class="error-message" data-for="message"></div>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="btn btn-primary">
      <span class="btn-text">发送消息</span>
      <span class="btn-loading" style="display:none">
        <span class="spinner"></span> 发送中...
      </span>
    </button>
  </div>
  
  <div class="form-success" style="display:none">
    <div class="success-icon">✓</div>
    <p>消息已发送！我会尽快回复您。</p>
  </div>
</form>
```

```javascript
// assets/js/modules/contact.js
class ContactFormHandler {
  constructor() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;
    
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupValidation();
    this.setupEmailCopy();
  }
  
  setupValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }
  
  validateField(field) {
    const errorElement = this.form.querySelector(`[data-for="${field.id}"]`);
    if (!errorElement) return;
    
    let error = '';
    
    if (field.validity.valueMissing) {
      error = '此项为必填项';
    } else if (field.type === 'email' && field.validity.typeMismatch) {
      error = '请输入有效的邮箱地址';
    } else if (field.validity.tooShort) {
      error = `至少需要${field.minLength}个字符`;
    } else if (field.validity.tooLong) {
      error = `不能超过${field.maxLength}个字符`;
    }
    
    if (error) {
      field.classList.add('invalid');
      errorElement.textContent = error;
    }
  }
  
  clearError(field) {
    field.classList.remove('invalid');
    const errorElement = this.form.querySelector(`[data-for="${field.id}"]`);
    if (errorElement) errorElement.textContent = '';