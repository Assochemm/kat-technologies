import { qs, qsa, clamp } from "./ui.js";
export function setupMotion({ reducedMotion = false }) {
  const { gsap } = window;
  if (!gsap) return;
  const ctx = gsap.context(() => {
    splitHero();
    setupCursor();
    setupMagnetic();
    setupTilt();
    setupSpotlights();
    setupScanline();
    setupSkillField();
    setupNavIndicator();
    setupGallery();
    setupTyped();
    setupTextScramble();
  });
  return () => ctx.revert();

  function splitHero() {
    const h = qs(".split-heading");
    if (!h || reducedMotion) return;
    const parts = [...h.querySelectorAll(".hero-name"), ...h.childNodes];
    const spans = [];
    const wrap = document.createElement("span");
    wrap.className = "split-line";
    while (h.firstChild && h.firstChild.nodeType === 3) {
      const text = h.firstChild.textContent;
      h.removeChild(h.firstChild);
      text.split("").forEach((ch) => {
        const s = document.createElement("span");
        s.textContent = ch === " " ? "\u00a0" : ch;
        s.className = "char";
        wrap.appendChild(s);
        spans.push(s);
      });
      break;
    }
    if (wrap.childNodes.length) {
      h.prepend(wrap);
    }
    qsa(".split-line .char", h).forEach((s, i) => {
      gsap.fromTo(
        s,
        { y: 30, opacity: 0, rotateX: -70 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          delay: i * 0.018,
          ease: "expo.out",
        },
      );
    });
    gsap.fromTo(
      ".hero-name",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.36, ease: "expo.out" },
    );
  }
  function setupCursor() {
    const c = qs("#cursor");
    if (!c || reducedMotion || matchMedia("(pointer:coarse)").matches) return;
    let x = innerWidth / 2,
      y = innerHeight / 2,
      tx = x,
      ty = y;
    window.addEventListener(
      "pointermove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
        c.style.opacity = "1";
      },
      { passive: true },
    );
    gsap.ticker.add(() => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      gsap.set(c, { x: x - 14, y: y - 14 });
    });
    qsa("a,button,.tilt-card,.magnetic-card").forEach((el) => {
      el.addEventListener("pointerenter", () => {
        gsap.to(c, { scale: 1.7, duration: 0.2, ease: "expo.out" });
        c.style.filter = "drop-shadow(0 0 18px rgba(77, 246, 214, 0.35))";
      });
      el.addEventListener("pointerleave", () => {
        gsap.to(c, { scale: 1, duration: 0.28, ease: "expo.out" });
        c.style.filter = "none";
      });
    });
  }
  function setupMagnetic() {
    if (reducedMotion) return;
    qsa(".magnetic").forEach((el) => {
      let r;
      const move = (e) => {
        r = r || el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        gsap.to(el, {
          x: dx * 18,
          y: dy * 12,
          duration: 0.35,
          ease: "expo.out",
        });
      };
      const leave = () => {
        r = null;
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,.55)" });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
    });
  }
  function setupTilt() {
    if (reducedMotion) return;
    qsa(".tilt-card").forEach((card) => {
      const strength = Number(card.dataset.tiltStrength || 4);
      const update = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        gsap.to(card, {
          rotateY: px * strength,
          rotateX: -py * strength,
          duration: 0.45,
          ease: "power3.out",
          transformPerspective: 900,
        });
      };
      const reset = () =>
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.7,
          ease: "expo.out",
        });
      card.addEventListener("pointermove", update);
      card.addEventListener("pointerleave", reset);
    });
  }
  function setupSpotlights() {
    qsa(".service-card").forEach((card) => {
      const glow = card.querySelector(".card-glow");
      if (!glow) return;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        glow.style.left = `${e.clientX - r.left}px`;
        glow.style.top = `${e.clientY - r.top}px`;
      });
    });
  }
  function setupScanline() {
    if (reducedMotion) return;
    qsa(".hero-media-card").forEach((el) => {
      gsap.to(el.querySelector(".scanline"), {
        yPercent: 650,
        duration: 4,
        ease: "none",
        repeat: -1,
        repeatDelay: 2,
      });
    });
  }
  function setupSkillField() {
    const cloud = qs("#skill-cloud");
    if (!cloud || reducedMotion || matchMedia("(pointer:coarse)").matches)
      return;
    const items = qsa("span", cloud);
    cloud.addEventListener("pointermove", (e) => {
      const r = cloud.getBoundingClientRect();
      items.forEach((item, i) => {
        const ir = item.getBoundingClientRect();
        const dx = e.clientX - (ir.left + ir.width / 2),
          dy = e.clientY - (ir.top + ir.height / 2);
        const d = Math.hypot(dx, dy);
        const influence = clamp(1 - d / 180, 0, 1);
        const weight = Number(item.dataset.weight || 1);
        gsap.to(item, {
          x: -dx * influence * 0.08 * weight,
          y: -dy * influence * 0.08 * weight,
          z: influence * 30 * weight,
          duration: 0.35,
          ease: "expo.out",
        });
      });
    });
    cloud.addEventListener("pointerleave", () =>
      items.forEach((item) =>
        gsap.to(item, { x: 0, y: 0, z: 0, duration: 0.55, ease: "expo.out" }),
      ),
    );
  }
  function setupNavIndicator() {
    const nav = qs("#primary-nav"),
      indicator = qs(".nav-indicator");
    if (!nav || !indicator) return;
    const sync = () => {
      const active = qs(".nav-link.is-active", nav);
      if (!active) {
        return;
      }
      const nr = nav.getBoundingClientRect(),
        r = active.getBoundingClientRect();
      gsap.set(indicator, { x: r.left - nr.left, width: r.width });
    };
    qsa(".nav-link", nav).forEach((a) =>
      a.addEventListener("click", () => {
        qsa(".nav-link", nav).forEach((x) => x.classList.remove("is-active"));
        a.classList.add("is-active");
        sync();
      }),
    );
    sync();
    addEventListener("resize", sync);
  }
  function setupGallery() {
    const slides = qsa(".circle-slide"),
      dots = qsa(".gallery-dot"),
      next = qs(".gallery-control--next"),
      prev = qs(".gallery-control--prev");
    if (!slides.length) return;
    let index = 0;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle("is-active", j === index));
      dots.forEach((d, j) => {
        d.classList.toggle("is-active", j === index);
        d.setAttribute("aria-selected", j === index ? "true" : "false");
      });
      if (!reducedMotion)
        gsap.fromTo(
          slides[index],
          { scale: 0.94, rotate: 4 },
          { scale: 1, rotate: 0, duration: 0.65, ease: "expo.out" },
        );
    };
    next?.addEventListener("click", () => show(index + 1));
    prev?.addEventListener("click", () => show(index - 1));
    dots.forEach((d, j) => d.addEventListener("click", () => show(j)));
    if (!reducedMotion) setInterval(() => show(index + 1), 5200);
  }
  function setupTyped() {
    const el = qs("#typed-role");
    if (!el) return;
    const words = [
      "web experiences",
      "software systems",
      "secure interfaces",
      "visual identities",
      "creative products",
      "High-performance code",
      "high-quality graphics design",
    ];
    if (reducedMotion) {
      el.textContent = words[0];
      return;
    }
    let wi = 0,
      ci = 0,
      deleting = false;
    const tick = () => {
      const w = words[wi];
      if (!deleting) {
        ci++;
        el.textContent = w.slice(0, ci);
        if (ci === w.length) {
          deleting = true;
          setTimeout(tick, 1150);
          return;
        }
      } else {
        ci--;
        el.textContent = w.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 38 : 72);
    };
    tick();
  }
  function setupTextScramble() {
    const el = qs(".hero-domain-row");
    if (!el || reducedMotion) return;
    const chars = "01<>[]{}$#@*";
    qsa("span", el).forEach((node, idx) => {
      const final = node.textContent;
      let frame = 0;
      const run = () => {
        if (frame < 8) {
          node.textContent = final
            .split("")
            .map((c, i) =>
              i <= frame ? c : chars[Math.floor(Math.random() * chars.length)],
            )
            .join("");
          frame++;
          requestAnimationFrame(run);
        } else node.textContent = final;
      };
      setTimeout(run, 700 + idx * 180);
    });
  }
}
