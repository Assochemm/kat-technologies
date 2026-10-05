import {
  qs,
  qsa,
  detectQuality,
  hasWebGL,
  setTheme,
  loadTheme,
  setMotion,
  loadMotion,
  prefersReducedMotion,
  toast,
} from "./modules/ui.js";
import { createScrollEngine } from "./modules/scroll.js";
import { HeroScene } from "./modules/three-scene.js";
import { setupForm } from "./modules/forms.js";
import { setupMotion } from "./modules/motion.js";
import { portfolioData } from "./modules/dataSource.js";

const app = {
  quality: detectQuality(),
  reducedMotion: loadMotion(),
  scene: null,
  scroll: null,
  motionCleanup: null,
};

document.documentElement.dataset.quality = app.quality;

setTheme(loadTheme());
setMotion(app.reducedMotion);

const qualityLabel =
  {
    high: "HIGH",
    medium: "MED",
    low: "LOW",
  }[app.quality] || "MED";

qs("#scene-quality").textContent = qualityLabel;

function updateActiveNav() {
  const sections = qsa("main section[id]");
  const links = qsa(".nav-link");
  const y = scrollY + innerHeight * 0.32;

  let current = "home";

  sections.forEach((s) => {
    if (s.offsetTop <= y) current = s.id;
  });
  links.forEach((a) =>
    a.classList.toggle("is-active", a.getAttribute("href") === `#${current}`),
  );
}

function setupNavigation() {
  const toggle = qs("#menu-toggle");
  const nav = qs("#primary-nav");
  const header = qs("#site-header");
  let lastScrollY = 0;

  const syncHeaderState = () => {
    if (!header) return;
    const scrolled = scrollY > 18;
    header.classList.toggle("is-scrolled", scrolled);
    const isHidden = scrollY > lastScrollY && scrollY > 100;
    header.classList.toggle("is-hidden", isHidden);
    lastScrollY = scrollY;
  };

  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(open));

    const i = toggle.querySelector("i");
    if (i) i.className = open ? "ph ph-x" : "ph ph-list";
  });

  qsa(".nav-link").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");

      const i = toggle.querySelector("i");
      if (i) i.className = "ph ph-list";
    }),
  );

  addEventListener(
    "scroll",
    () => {
      updateActiveNav();
      syncHeaderState();
    },
    { passive: true },
  );
  addEventListener("resize", updateActiveNav);
  updateActiveNav();
  syncHeaderState();
}

function setupThemeMotion() {
  qs("#theme-toggle")?.addEventListener("click", () => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark",
    );
    const i = qs("#theme-toggle i");
    if (i)
      i.className =
        document.documentElement.dataset.theme === "dark"
          ? "ph ph-sun"
          : "ph ph-moon";
  });
  qs("#motion-toggle")?.addEventListener("click", () => {
    app.reducedMotion = !app.reducedMotion;
    setMotion(app.reducedMotion);
    app.motionCleanup?.();
    app.scroll?.kill();
    app.motionCleanup = setupMotion(app);
    app.scroll = createScrollEngine(app);
    if (app.reducedMotion) {
      app.scene?.destroy();
      app.scene = null;
      window.__katetaScene = null;
    } else startScene();
  });
  const i = qs("#theme-toggle i");
  if (i)
    i.className =
      document.documentElement.dataset.theme === "dark"
        ? "ph ph-sun"
        : "ph ph-moon";
}

function setupDialog() {
  const dialog = qs("#detail-dialog");
  const close = qs("#detail-close");
  const title = qs("#detail-title"),
    copy = qs("#detail-copy"),
    kicker = qs("#detail-kicker"),
    list = qs("#detail-list");
  const open = (kind, key) => {
    const data = portfolioData[kind]?.[key];
    if (!data) return;
    title.textContent = data.title;
    copy.textContent = data.copy;
    kicker.textContent = data.kicker || "DETAIL";
    list.innerHTML = (data.points || data.list || [])
      .map((x) => `<div>${x}</div>`)
      .join("");
    dialog.showModal();
  };
  qsa("[data-service-open]").forEach((b) =>
    b.addEventListener("click", () => open("services", b.dataset.serviceOpen)),
  );
  qsa("[data-project-open]").forEach((b) =>
    b.addEventListener("click", () => open("projects", b.dataset.projectOpen)),
  );
  close?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  qs("#detail-cta")?.addEventListener("click", () => dialog.close());
}

function setupLoader() {
  const loader = qs("#site-loader"),
    skip = qs("#skip-loader");
  if (!loader) return;
  document.body.classList.add("is-locked");
  const finish = () => {
    if (loader.dataset.done) return;
    loader.dataset.done = "1";
    document.body.classList.remove("is-locked");
    if (app.reducedMotion) {
      loader.remove();
      return;
    }
    gsap.to(loader, {
      autoAlpha: 0,
      duration: 0.75,
      ease: "expo.inOut",
      onComplete: () => loader.remove(),
    });
  };
  skip?.addEventListener("click", finish);
  window.addEventListener(
    "load",
    () => setTimeout(finish, app.reducedMotion ? 80 : 900),
    { once: true },
  );
  setTimeout(finish, 3800);
}

function startScene() {
  if (app.reducedMotion || !hasWebGL()) {
    qs("#scene-status").textContent = "2D fallback";
    return;
  }
  const canvas = qs("#hero-canvas");
  app.scene = new HeroScene(canvas, {
    quality: app.quality,
    reducedMotion: false,
  });
  window.__katetaScene = app.scene;
  if (!app.scene.renderer) qs("#scene-status").textContent = "2D fallback";
}

function setupFPS() {
  const out = qs("#fps-readout");
  if (!out) return;
  let frames = 0,
    last = performance.now();
  const loop = (now) => {
    frames++;
    if (now - last >= 1000) {
      out.textContent = String(frames);
      frames = 0;
      last = now;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function init() {
  setupNavigation();
  setupThemeMotion();
  setupDialog();
  setupForm(app);
  app.motionCleanup = setupMotion(app);
  app.scroll = createScrollEngine(app);
  setupFPS();
  startScene();
  qs("#year").textContent = new Date().getFullYear();
  setupLoader();
  // The gallery artwork is referenced from index.html, never from ./css/, so /css/images/logo2.png is not requested.
  if (location.hash)
    requestAnimationFrame(() =>
      document.querySelector(location.hash)?.scrollIntoView({ block: "start" }),
    );
}

init();
