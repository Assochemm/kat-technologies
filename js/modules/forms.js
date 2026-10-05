import { qs, qsa, toast } from "./ui.js";
import { submitContact } from "./dataSource.js";
const schema = {
  fullname: (v) =>
    v.trim().length >= 2 ? "" : "Enter your name (at least 2 characters).",
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      ? ""
      : "Enter a valid email address.",
  mobile: (v) =>
    /^[0-9+() -]{8,}$/.test(v.trim()) ? "" : "Enter a reachable phone number.",
  subject: (v) =>
    v.trim().length >= 3 ? "" : "Give the message a clear subject.",
  message: (v) =>
    v.trim().length >= 10
      ? ""
      : "Write at least 10 characters so the request has useful context.",
};
export function setupForm({ reducedMotion = false }) {
  const form = qs("#contact-form");
  if (!form) return;
  const status = qs("#form-status");
  const submit = qs("#contact-submit");
  const msg = qs("#message");
  const count = qs("#message-count");
  const syncField = (input) => {
    const field = input.closest(".field");
    field?.classList.toggle("has-value", input.value.length > 0);
  };
  const validate = (input, force = false) => {
    const fn = schema[input.name];
    const error = fn ? fn(input.value) : "";
    const blank = input.value.trim() === "";
    const finalError =
      blank && !force && !input.required
        ? ""
        : blank && input.required
          ? error
          : error;
    const el = qs(`#${input.id}-error`);
    input.setAttribute("aria-invalid", finalError ? "true" : "false");
    if (el) el.textContent = finalError;
    return !finalError;
  };
  qsa("input,textarea", form).forEach((i) => {
    syncField(i);
    i.addEventListener("blur", () => validate(i));
    i.addEventListener("input", () => {
      syncField(i);
      if (i.getAttribute("aria-invalid") === "true") validate(i);
    });
  });
  const updateCount = () => {
    if (count) count.textContent = `${msg.value.length} / 800`;
  };
  msg?.addEventListener("input", updateCount);
  updateCount();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = qsa("input,textarea", form);
    const valid = inputs.map((i) => validate(i, true)).every(Boolean);
    if (!valid) {
      const first = inputs.find(
        (i) => i.getAttribute("aria-invalid") === "true",
      );
      first?.focus();
      announce("error", "Please correct the highlighted fields.");
      return;
    }
    submit.disabled = true;
    const original = submit.innerHTML;
    submit.innerHTML =
      '<span>Sending 0%</span><i class="ph ph-spinner-gap"></i>';
    announce("loading", "Preparing your message…");
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const result = await submitContact(payload, (p) => {
        submit.querySelector("span").textContent = `Sending ${p}%`;
      });
      announce(
        "success",
        `Message staged successfully. Reference ${result.reference}.`,
      );
      toast("Message staged", `Reference ${result.reference}`);
      form.reset();
      inputs.forEach((i) => {
        i.setAttribute("aria-invalid", "false");
        syncField(i);
      });
      updateCount();
      if (!reducedMotion)
        submit.animate(
          [
            { transform: "translateY(0) scale(1)" },
            { transform: "translateY(-3px) scale(1.02)" },
            { transform: "translateY(0) scale(1)" },
          ],
          { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" },
        );
    } catch (err) {
      announce(
        "error",
        err.message || "We could not stage the message. Please retry.",
      );
      toast(
        "Delivery error",
        "Your form data is still in place. Retry when ready.",
      );
    } finally {
      submit.disabled = false;
      submit.innerHTML = original;
    }
  });
  function announce(type, text) {
    status.textContent = text;
    status.className = `form-status is-visible${type === "error" ? " is-error" : ""}`;
  }
}
