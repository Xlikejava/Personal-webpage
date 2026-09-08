/**
 * Particles — Canvas 粒子背景
 * 无 WebGL、无依赖，纯原生 Canvas
 * 粒子间有连线、鼠标可互动
 */
export class Particles {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: -999, y: -999, radius: 120 };
    this.animationId = null;
    this.resizeObserver = null;

    // 可配置参数
    this.config = {
      count: 60,
      size: { min: 1, max: 3 },
      speed: { min: 0.15, max: 0.5 },
      connectDistance: 140,
      color: "rgba(96, 165, 250, 0.5)",
      lineColor: "rgba(96, 165, 250, 0.12)",
      mouseRepel: true,
      repelForce: 0.03,
    };
  }

  init() {
    if (!this.container) return;

    this.canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0";
    this.container.style.position = "relative";
    this.container.appendChild(this.canvas);

    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * devicePixelRatio;
    this.canvas.height = this.height * devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  createParticles() {
    this.particles = [];
    const { count, size, speed } = this.config;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: size.min + Math.random() * (size.max - size.min),
        vx: (Math.random() - 0.5) * (speed.max - speed.min) * 2,
        vy: (Math.random() - 0.5) * (speed.max - speed.min) * 2,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
  }

  bindEvents() {
    const onMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      this.mouse.x = -999;
      this.mouse.y = -999;
    };

    this.container.addEventListener("mousemove", onMove);
    this.container.addEventListener("mouseleave", onLeave);

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.createParticles();
    });
    this.resizeObserver.observe(this.container);
  }

  animate() {
    const { ctx, width, height, particles, config, mouse } = this;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & draw particles
      for (const p of particles) {
        // Mouse repel
        if (config.mouseRepel) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.vx += (dx / dist) * force * config.repelForce;
            p.vy += (dy / dist) * force * config.repelForce;
          }
        }

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = config.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw connections
      ctx.strokeStyle = config.lineColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < config.connectDistance) {
            ctx.globalAlpha = 1 - dist / config.connectDistance;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.canvas.remove();
  }
}
