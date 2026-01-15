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
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
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
      `$router->group('/api', function (Router $r) {
  $r->get('/health', [HealthController::class, 'check']);
  $r->group('/v1', function (Router $v1) {
    $v1->get('/orders/{id}', [OrderController::class, 'show']);
  });
});`,
      `class OrderRepository
{
  public function findActiveByUser(int $userId): Collection
  {
    return Order::query()
      ->where('user_id', $userId)
      ->where('status', 'paid')
      ->where('paid_at', '>=', now()->subDays(30))
      ->orderByDesc('paid_at')
      ->get();
  }
}`,
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

