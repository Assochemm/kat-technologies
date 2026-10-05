# Kateta Tech Portfolio — V2

A static, GitHub-Pages-ready portfolio built with HTML, CSS and JavaScript ES modules. The visual system uses pinned GSAP/ScrollTrigger, Lenis smooth scrolling and Three.js for one signature WebGL hero scene.

## Run locally

Use any static HTTP server because ES modules and the Three.js import map should be loaded over `http://` rather than `file://`.

```powershell
py -m http.server 8080 --directory .
```

Then open `http://127.0.0.1:8080/`.

## Important asset paths

The hero video is intentionally `images/clip7.mp4`, matching the asset that was confirmed serving successfully in the local server log supplied for this revision.

The hero poster is `images/profile.png`, not the missing `images/clip4-poster.jpg`.

The About gallery image paths are rooted from `index.html` and use `images/...`; they are NOT referenced from CSS. This prevents a browser from resolving them as `/css/images/...`.

**Do not reintroduce `url('images/...')` for root-level image assets inside files under `css/`.** From CSS, root-level project images must be referenced as `../images/...`.

## 404 messages in the supplied log

- `/css/images/logo2.png` — a relative CSS asset-path bug. V2 removes that request entirely; gallery images are defined in `index.html`.
- `/images/clip4-poster.jpg` — the old poster file was missing. V2 uses the existing `images/profile.png` poster instead.
- `/.well-known/appspecific/com.chrome.devtools.json` — Chrome DevTools requests this probe in some local configurations. It is not a portfolio asset and is safe to ignore when the page itself is functioning.

## External libraries

- GSAP 3.15.0 — animation engine; GreenSock standard no-charge license.
- Three.js 0.186.1 — WebGL scene engine; MIT license.
- Lenis 1.3.26 — smooth scrolling; MIT license.
- Phosphor Icons 2.1.2 — icon set; MIT license.

Verify asset licences before using third-party imagery commercially.

## Motion inventory

Hero 3D scene, pointer-reactive camera, 3D card tilt, magnetic buttons, custom cursor, scanline, typing effect, scramble effect, marquee, scroll progress, gallery transitions, pinned service track, pinned process scene, process state choreography, horizontal portfolio scene, project-depth hover, reactive skill field, radar sweep, contact orbit, loading intro and async form progress.

## Reduced-motion and quality tiers

The page respects `prefers-reduced-motion`, offers an in-app motion toggle, adapts quality using device hints and data-saver state, disables WebGL when appropriate, and degrades to a 2D interface.
