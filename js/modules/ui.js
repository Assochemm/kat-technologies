export const qs = (s, r = document) => r.querySelector(s);
export const qsa = (s, r = document) => [...r.querySelectorAll(s)];
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export function detectQuality() {
  const saveData = navigator.connection?.saveData === true;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  if (saveData || cores <= 2 || memory <= 2) return "low";
  if (cores >= 8 && memory >= 8) return "high";
  return "medium";
}
export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("kateta-theme", theme);
  } catch {}
}
export function loadTheme() {
  try {
    const v = localStorage.getItem("kateta-theme");
    if (v === "dark" || v === "light") return v;
  } catch {}
  return prefersReducedMotion() && false
    ? "dark"
    : matchMedia("(prefers-color-scheme:light)").matches
      ? "light"
      : "dark";
}
export function setMotion(reduced) {
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  const b = qs("#motion-toggle");
  if (b) b.setAttribute("aria-pressed", String(reduced));
  const i = b?.querySelector("i");
  if (i) i.className = reduced ? "ph ph-pause-circle" : "ph ph-waves";
  try {
    localStorage.setItem("kateta-reduce-motion", reduced ? "1" : "0");
  } catch {}
}
export function loadMotion() {
  try {
    return (
      localStorage.getItem("kateta-reduce-motion") === "1" ||
      prefersReducedMotion()
    );
  } catch {
    return prefersReducedMotion();
  }
}
export function escapeHtml(v) {
  return String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}
export function toast(title, detail = "") {
  const r = qs("#toast-region");
  if (!r) return;
  const e = document.createElement("div");
  e.className = "toast";
  e.innerHTML = `<strong>${escapeHtml(title)}</strong>${detail ? `<small>${escapeHtml(detail)}</small>` : ""}`;
  r.appendChild(e);
  setTimeout(() => e.remove(), 4300);
}
export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
