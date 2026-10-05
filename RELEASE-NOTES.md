# Kateta Tech Portfolio V2 — Release Notes

## 404 fixes

1. Removed the missing `images/clip4-poster.jpg` reference.
   - Hero poster now uses the existing `images/profile.png`.
   - Hero video now uses `images/clip7.mp4`, matching the local server asset reported as HTTP 200.

2. Removed the `/css/images/logo2.png` resolution bug.
   - Gallery image URLs live in `index.html`, where `images/logo2.png` resolves from the project root.
   - No CSS file contains `url('images/...')` root-image references.
   - Rule: from `css/*.css`, a root-level image must be `../images/...`.

3. Chrome's `/.well-known/appspecific/com.chrome.devtools.json` probe is not a page asset. A 404 for that probe is unrelated to the portfolio.

## Motion additions

- Intro loader with orbit choreography and skip control.
- Split-character hero entrance.
- Typed role cycling with accessible static fallback.
- Hero video parallax.
- Hero 3D WebGL K-form, orbit rings and GPU point field.
- Pointer-reactive 3D camera and scene depth.
- Card tilt and magnetic controls.
- Custom pointer cursor.
- Hero profile scanline sweep.
- Capability marquee.
- About circular gallery transitions and rotating rings.
- Scroll-activated story steps.
- Animated metric counters.
- Pinned horizontal services sequence.
- Scroll-scrubbed four-stage process sequence.
- Horizontal portfolio sequence with image scale/depth.
- Pointer-reactive capability field.
- Radar sweep visualization.
- Animated contact orbit.
- Form focus elevation, live character count and async progress.
- Animated toasts and success feedback.
- Footer scan sweep.

## Accessibility / performance

- Skip link and visible focus.
- Keyboard-operable buttons and dialog.
- `prefers-reduced-motion` support plus persistent in-app motion switch.
- Data-saver / CPU / memory quality detection for the 3D scene.
- Three.js pixel-ratio cap.
- WebGL detection with 2D fallback state.
- 3D resources disposed on teardown.
- Responsive 360–1536px-oriented layout using fluid sizing.
