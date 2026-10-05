export function createScrollEngine({ reducedMotion = false }) {
  const { gsap, ScrollTrigger, Lenis } = window;
  if (!gsap || !ScrollTrigger || !Lenis) return { lenis: null, kill() {} };
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!reducedMotion) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(1000, 16);
  }
  const ctx = gsap.context(() => {
    if (reducedMotion) return;
    gsap.to(".page-progress span", {
      width: "100%",
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: true },
    });
    gsap.to(".hero-video", {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".hero-media-card", {
      yPercent: -11,
      rotateZ: -2,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => window.__katetaScene?.setScroll(self.progress),
    });
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    });
    gsap.utils.toArray("[data-count]").forEach((el) => {
      const value = Number(el.dataset.count) || 0;
      gsap.fromTo(
        el,
        { textContent: 0 },
        {
          textContent: value,
          duration: 1.4,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        },
      );
    });
    const story = gsap.utils.toArray(".story-step");
    story.forEach((step, i) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top 68%",
        end: "bottom 46%",
        onEnter: () =>
          story.forEach((x, j) => x.classList.toggle("is-active", j === i)),
        onEnterBack: () =>
          story.forEach((x, j) => x.classList.toggle("is-active", j === i)),
      }),
    );
    const about = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "top top",
        end: "+=1200",
        scrub: true,
        pin: false,
      },
    });
    about
      .to(".circle-gallery-ring--outer", { rotation: 130, ease: "none" }, 0)
      .to(".circle-gallery-ring--inner", { rotation: -100, ease: "none" }, 0)
      .to(".about-visual", { y: -30, ease: "none" }, 0);
    const services = document.querySelector("#services-track");
    if (services) {
      const getEnd = () =>
        Math.max(
          0,
          services.scrollWidth - document.documentElement.clientWidth + 60,
        );
      gsap.to(services, {
        x: () => -getEnd(),
        ease: "none",
        scrollTrigger: {
          trigger: ".services-section",
          start: "top -3%",
          end: () => `+=${Math.max(700, getEnd())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            const bar = document.querySelector(".services-progress span");
            if (bar) bar.style.width = `${s.progress * 100}%`;
          },
        },
      });
    }
    const processPanels = [...document.querySelectorAll(".process-panel")];
    const processTrigger = ScrollTrigger.create({
      trigger: ".process-pin",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(
          processPanels.length - 1,
          Math.floor(self.progress * processPanels.length),
        );
        processPanels.forEach((p, i) =>
          p.classList.toggle("is-active", i === idx),
        );
        const n = document.querySelector("#process-number");
        if (n) n.textContent = String(idx + 1).padStart(2, "0");
      },
    });
    
    const portfolio = document.querySelector("#portfolio-track");
    if (portfolio) {
      const getEnd = () =>
        Math.max(
          0,
          portfolio.scrollWidth - document.documentElement.clientWidth + 80,
        );
      gsap.to(portfolio, {
        x: () => -getEnd(),
        ease: "none",
        scrollTrigger: {
          trigger: ".portfolio-section",
          start: "top -5%",
          end: () => `+=${Math.max(900, getEnd())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            const bar = document.querySelector(".portfolio-progress span");
            if (bar) bar.style.width = `${s.progress * 100}%`;
          },
        },
      });
    }
    gsap.to(".radar-sweep", {
      rotate: 360,
      duration: 4,
      ease: "none",
      repeat: -1,
    });
  });
  const kill = () => {
    ctx.revert();
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
  return { lenis, kill };
}
