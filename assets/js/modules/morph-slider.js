import { qs, qsa } from "../utils/dom.js";

export class MorphSlider {
  constructor() {
    this.words = [];
    this.dots = [];
    this.currentIndex = 0;
    this.total = 0;
    this.autoTimer = null;
    this.autoInterval = 4000;
    this.isDragging = false;
  }

  init() {
    this.words = qsa("[data-morph]");
    this.dots = qsa("[data-morph-dot]");
    this.track = qs("[data-morph-track]");
    this.fill = qs("[data-morph-fill]");
    this.thumb = qs("[data-morph-thumb]");
    this.total = this.words.length;

    if (this.total === 0) return;

    this.setupDrag();
    this.setupDots();
    this.startAuto();
  }

  goTo(index) {
    if (index === this.currentIndex || index < 0 || index >= this.total) return;

    // Exit current
    const current = this.words[this.currentIndex];
    current.classList.remove("is-active");
    current.classList.add("is-exiting");

    // Enter next
    const next = this.words[index];
    next.classList.remove("is-exiting");
    next.classList.add("is-active");

    // Clean up exit class after transition
    setTimeout(() => {
      current.classList.remove("is-exiting");
    }, 600);

    // Update dots
    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.remove("is-active");
    }
    if (this.dots[index]) {
      this.dots[index].classList.add("is-active");
    }

    // Update slider position
    const percent = (index / (this.total - 1)) * 100;
    if (this.fill) this.fill.style.width = percent + "%";
    if (this.thumb) this.thumb.style.left = percent + "%";

    this.currentIndex = index;
  }

  next() {
    this.goTo((this.currentIndex + 1) % this.total);
  }

  startAuto() {
    this.autoTimer = setInterval(() => {
      if (!this.isDragging) this.next();
    }, this.autoInterval);
  }

  stopAuto() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  setupDots() {
    this.dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        this.goTo(i);
        this.stopAuto();
        this.startAuto();
      });
    });
  }

  setupDrag() {
    if (!this.track) return;

    const onMove = (clientX) => {
      const rect = this.track.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = x / rect.width;
      const index = Math.round(percent * (this.total - 1));
      this.goTo(index);
    };

    // Mouse events
    this.thumb?.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.isDragging = true;
      this.stopAuto();

      const onMoveHandler = (ev) => onMove(ev.clientX);
      const onUpHandler = () => {
        this.isDragging = false;
        this.startAuto();
        document.removeEventListener("mousemove", onMoveHandler);
        document.removeEventListener("mouseup", onUpHandler);
      };

      document.addEventListener("mousemove", onMoveHandler);
      document.addEventListener("mouseup", onUpHandler);
    });

    // Touch events
    this.thumb?.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      this.stopAuto();

      const onMoveHandler = (ev) => {
        ev.preventDefault();
        onMove(ev.touches[0].clientX);
      };
      const onEndHandler = () => {
        this.isDragging = false;
        this.startAuto();
        document.removeEventListener("touchmove", onMoveHandler);
        document.removeEventListener("touchend", onEndHandler);
      };

      document.addEventListener("touchmove", onMoveHandler, { passive: false });
      document.addEventListener("touchend", onEndHandler);
    });

    // Click on track
    this.track.addEventListener("click", (e) => {
      onMove(e.clientX);
      this.stopAuto();
      this.startAuto();
    });
  }
}
