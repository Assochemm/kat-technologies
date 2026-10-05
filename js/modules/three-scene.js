import * as THREE from "three";

export class HeroScene {
  constructor(canvas, { quality = "medium", reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.quality = quality;
    this.reducedMotion = reducedMotion;
    this.pointer = new THREE.Vector2();
    this.target = new THREE.Vector2();
    this.scrollProgress = 0;
    this.clock = new THREE.Clock();
    this.destroyed = false;
    if (!canvas || reducedMotion) return;
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: quality !== "low",
        powerPreference: "high-performance",
      });
    } catch {
      this.renderer = null;
      return;
    }
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(
      Math.min(devicePixelRatio, quality === "high" ? 2 : 1.35),
    );
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x061018, 0.055);
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    this.camera.position.set(0, 0.2, 7.4);
    this.root = new THREE.Group();
    this.scene.add(this.root);
    const ambient = new THREE.HemisphereLight(0x83cdd0, 0x071018, 1.5);
    this.scene.add(ambient);
    const key = new THREE.DirectionalLight(0x8afff6, 3.1);
    key.position.set(4, 5, 6);
    this.scene.add(key);
    const rim = new THREE.PointLight(0xffc247, 14, 18, 2);
    rim.position.set(-3, 1, 4);
    this.scene.add(rim);
    this.makeCore();
    this.makeParticles();
    this.makeRings();
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas.parentElement || canvas);
    this.onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      this.target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      this.target.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", this.onMove, { passive: true });
    this.renderer.setAnimationLoop(() => this.render());
  }
  makeCore() {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x0fd9ce,
      metalness: 0.82,
      roughness: 0.18,
      emissive: 0x023c3a,
      emissiveIntensity: 0.7,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    });
    const group = new THREE.Group();
    const barA = new THREE.Mesh(new THREE.BoxGeometry(0.46, 3.15, 0.44), mat);
    barA.rotation.z = -0.46;
    barA.position.x = -0.64;
    const barB = new THREE.Mesh(new THREE.BoxGeometry(0.46, 3.15, 0.44), mat);
    barB.rotation.z = 0.46;
    barB.position.x = 0.64;
    const mid = new THREE.Mesh(new THREE.BoxGeometry(0.46, 2.55, 0.44), mat);
    mid.rotation.z = 1.1;
    mid.position.set(0.02, 0, 0.02);
    mid.scale.x = 0.72;
    group.add(barA, barB, mid);
    group.rotation.set(0.13, -0.24, -0.04);
    this.core = group;
    this.root.add(group);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00e0d3,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.13, 12, 96),
      glowMat,
    );
    glow.rotation.x = Math.PI / 2.6;
    this.root.add(glow);
    this.glow = glow;
  }
  makeRings() {
    this.rings = [];
    const specs = [
      [2.55, 0.018, 0.4, 0xffc247],
      [3.05, 0.012, -0.7, 0x00e0d3],
      [3.55, 0.008, 0.22, 0x79a7ff],
    ];
    specs.forEach(([r, t, s, c]) => {
      const m = new THREE.MeshBasicMaterial({
        color: c,
        transparent: true,
        opacity: 0.48,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, t, 8, 128), m);
      ring.rotation.set(Math.PI * 0.5 + s, 0.12, 0);
      this.scene.add(ring);
      this.rings.push({ ring, speed: s || 0.2 });
    });
  }
  makeParticles() {
    const count =
      this.quality === "high" ? 850 : this.quality === "medium" ? 450 : 180;
    const p = new Float32Array(count * 3);
    const a = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = THREE.MathUtils.randFloat(2.3, 6.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = radius * Math.cos(phi);
      p[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      a[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(a, 1));
    const m = new THREE.PointsMaterial({
      color: 0x74fff2,
      size: this.quality === "high" ? 0.025 : 0.032,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.particles = new THREE.Points(g, m);
    this.scene.add(this.particles);
  }
  setScroll(progress) {
    this.scrollProgress = progress;
  }
  resize() {
    if (!this.renderer || !this.canvas) return;
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, r.width),
      h = Math.max(1, r.height);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }
  render() {
    if (this.destroyed || !this.renderer) return;
    const dt = Math.min(0.05, this.clock.getDelta());
    const t = this.clock.elapsedTime;
    this.pointer.lerp(this.target, 0.055);
    this.root.rotation.y += dt * 0.08;
    this.root.rotation.x = Math.sin(t * 0.7) * 0.05;
    this.core.rotation.y += dt * (0.28 + 0.1 * this.scrollProgress);
    this.core.position.y = Math.sin(t * 1.4) * 0.11;
    this.core.position.z = this.scrollProgress * 0.45;
    this.core.rotation.x = 0.12 + this.scrollProgress * 0.18;
    this.glow.rotation.z -= dt * 0.18;
    this.rings.forEach((o, i) => {
      o.ring.rotation.z += dt * (i % 2 ? -0.13 : 0.09);
      o.ring.rotation.y += dt * (i % 2 ? 0.06 : -0.04);
    });
    this.particles.rotation.y = t * 0.018;
    if (!this.reducedMotion) {
      this.root.rotation.y += this.pointer.x * 0.002;
      this.camera.position.x = THREE.MathUtils.lerp(
        this.camera.position.x,
        this.pointer.x * 0.55,
        0.035,
      );
      this.camera.position.y = THREE.MathUtils.lerp(
        this.camera.position.y,
        0.2 + this.pointer.y * 0.35,
        0.035,
      );
      this.camera.lookAt(0, 0, 0);
    } else this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }
  destroy() {
    this.destroyed = true;
    window.removeEventListener("pointermove", this.onMove);
    this.ro?.disconnect();
    this.renderer?.setAnimationLoop(null);
    this.scene?.traverse((o) => {
      if (o.geometry) o.geometry.dispose?.();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose?.());
      }
    });
    this.renderer?.dispose();
  }
}
