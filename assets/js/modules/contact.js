import { qs } from "../utils/dom.js";
import { validateField } from "../utils/validation.js";
import { trackEvent } from "../utils/analytics.js";

export class Contact {
  init() {
    this.setupForm();
    this.setupEmailCopy();
  }

  setupForm() {
    const form = qs("#contact-form");
    if (!form) return;

    const status = qs("[data-form-status]");
    const submitBtn = form.querySelector("button[type='submit']");

    const showStatus = (message, isError = false) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("error", isError);
      status.classList.add("is-visible");
      window.setTimeout(() => status.classList.remove("is-visible"), 2600);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let hasError = false;
      form
        .querySelectorAll("input[required], textarea[required]")
        .forEach((field) => {
          const msg = validateField(field);
          const errorEl = form.querySelector(
            `[data-error-for='${field.name}']`
          );
          if (msg) {
            hasError = true;
            field.classList.add("invalid");
            if (errorEl) errorEl.textContent = msg;
          } else {
            field.classList.remove("invalid");
            if (errorEl) errorEl.textContent = "";
          }
        });

      if (hasError) {
        showStatus("请先修正表单中的错误", true);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "发送中...";
      }

      try {
        const formData = new FormData(form);
        const resp = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (!resp.ok) throw new Error("Network error");

        form.reset();
        showStatus("消息已发送，我会尽快回复你。");
        trackEvent("contact-submit");
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("提交失败", err);
        showStatus("发送失败，请稍后重试或直接发邮件至 zzwr_01@163.com", true);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "发送消息";
        }
      }
    });
  }

  setupEmailCopy() {
    const btn = qs("[data-copy-email]");
    const status = qs("[data-copy-status]");
    if (!btn) return;

    btn.addEventListener("click", async () => {
      const email = btn.dataset.email || "zzwr_01@163.com";
      try {
        await navigator.clipboard.writeText(email);
        if (status) {
          status.textContent = "已复制到剪贴板";
          status.classList.add("is-visible");
          window.setTimeout(
            () => status.classList.remove("is-visible"),
            2000
          );
        }
        trackEvent("email-copy");
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("复制失败", err);
      }
    });
  }
}

