# YARA Research — Interactive 3D Animated Logo Documentation

A programmatic React Three Fiber (R3F) + Three.js implementation of the **YARA Research** identity: an isometric wireframe cube with an integrated three-dimensional beveled **Y** emerging directly from its front-facing structural edges, six luminous teal vertex nodes, and the **YARA / RESEARCH** wordmark.

---

## 1. Dependencies & Installation

Required packages (already configured in `package.json`):

```bash
npm install three @types/three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing
```

Compatible versions used in this repository:
- `react` / `react-dom` `^18.3.1`
- `three` `^0.176.0`
- `@react-three/fiber` `^8.18.0`
- `@react-three/drei` `^9.121.4`
- `@react-three/postprocessing` `^2.19.1`

---

## 2. Architecture

```text
src/
├── assets/branding/
│   └── yara-research-logo.svg          # Vector reference asset
├── components/branding/
│   ├── cubeMath.ts                     # Canonical isometric matrix, 8 vertices, 12 edges, beveled Y prism builder
│   ├── ConnectionNodes.tsx             # 6 luminous metallic-glass spheres at outer hexagon vertices
│   ├── CubeGeometry.tsx                # 12 structural wireframe rails + idle perimeter light pulse
│   ├── YGeometry.tsx                   # 3 miter-locked 3D beveled prism Y arms + convergence-to-stem pulse
│   ├── LogoLighting.tsx                # Dark-lab directional/rim/point lighting + radial floor illumination
│   ├── LogoAnimation.tsx               # 60fps ref-driven timeline & floating/parallax choreography
│   ├── LogoCamera.tsx                  # Responsive isometric-inspired perspective camera & OrbitControls
│   ├── YaraWordmark.tsx                # Accessible HTML/CSS geometric typography reveal
│   ├── YaraLogoScene.tsx               # Lazy-loaded R3F Canvas, procedural Environment, selective Bloom
│   ├── YaraLogo3D.tsx                  # Public entry component with WebGL fallback, reduced-motion & viewport pause
│   └── LogoPreviewStudio.tsx           # Interactive evaluation controls for /logo-preview
├── hooks/
│   └── useLogoAnimation.ts             # Phase timeline state machine, WebGL & prefers-reduced-motion hooks
├── styles/
│   └── yara-logo.css                   # Responsive stage, typography, controls & content-visibility rules
└── pages/
    └── logo-preview.astro              # Dedicated preview route (/logo-preview)
```

---

## 3. Geometric Construction (`cubeMath.ts`)

1. **Canonical Isometric Alignment**:
   A unit cube `[-1, 1]^3` is rotated by `Rx(atan(1/sqrt(2))) * Ry(-PI/4)`.
   - `FRONT_CENTER_VERTEX` aligns along `+Z` (`(0, 0, +sqrt(3))`).
   - `BACK_CENTER_VERTEX` aligns along `-Z` (`(0, 0, -sqrt(3))`).
   - The remaining 6 vertices (`OUTER_VERTICES[0..5]`) project into an exact regular hexagon and hold the 6 spherical connection nodes.
2. **Integrated 3D Y (`createBeveledYArmGeometry`)**:
   Instead of placing a flat or floating letter inside the cube, the **Y** is built as three watertight beveled prism beams lying directly along the cube's three front-facing edges (`Upper-Left -> FrontCenter`, `Upper-Right -> FrontCenter`, `FrontCenter -> Bottom`). Using 120-degree miter planes (`x=y`, `y=z`, `x=z`) around `(1, 1, 1)`, one shared `BufferGeometry` is instanced at `0`, `+2PI/3`, and `-2PI/3` around `+Z` for seamless 3-way miter alignment.

---

## 4. Usage & Configuration

```tsx
import YaraLogo3D from '@/components/branding/YaraLogo3D';

<YaraLogo3D
  mode="intro"
  autoPlay={true}
  interactive={true}
  showWordmark={true}
  background="#000000"
/>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'intro' \| 'idle' \| 'interactive' \| 'minimal'` | `'intro'` | Animation and interaction preset |
| `autoPlay` | `boolean` | `true` | Automatically plays the 0–8s intro sequence when `mode="intro"` |
| `interactive` | `boolean` | `true` | Enables pointer parallax, node hover response, and 3D inspect toggle |
| `showWordmark` | `boolean` | `true` | Displays the `YARA / RESEARCH` typography beneath the cube |
| `background` | `string` | `'#000000'` | Canvas and stage background color |
| `height` | `string \| number` | `'clamp(460px, 72vh, 720px)'` | Stage container height |
| `enablePostProcessing` | `boolean` | `true` | Enables selective Bloom, Vignette, and ACES Filmic tone mapping (automatically disabled on mobile or `minimal` mode) |
| `enableScrollDepth` | `boolean` | `false` | Enables subtle scroll-linked camera zoom |
| `showControls` | `boolean` | `true` | Shows subtle accessible Play/Pause, Replay, Inspect 3D, and Reset View controls |
| `compact` | `boolean` | `false` | Compact typography sizing for tighter placements |
| `reducedMotion` | `boolean` | OS preference | Overrides `prefers-reduced-motion` detection (useful for testing) |
| `onPhaseChange` | `(phase: 1\|2\|3\|4\|5\|6) => void` | — | Fires only on discrete phase transitions |
| `onReady` | `() => void` | — | Fires when the lazy WebGL scene mounts |

### Modes

- **`intro`**: Full 8-second assembly:
  - Phase 1 (`0.0–1.5s`): Central teal aura & staggered emergence of the 6 connection nodes.
  - Phase 2 (`1.5–3.5s`): Structural cube edges grow along their 3D paths from node to node.
  - Phase 3 (`3.5–5.0s`): Upper Y diagonal arms form first, followed by the vertical stem and a luminous convergence-to-stem pulse.
  - Phase 4 (`5.0–6.5s`): Slow 3D reveal rotation, camera easing to canonical isometric framing, and soft teal under-illumination.
  - Phase 5 (`6.5–8.0s`): `YARA` and `RESEARCH` wordmark reveal.
  - Phase 6 (`8.0s+`): Idle equilibrium with barely perceptible float, gentle node breathing, and occasional edge/Y pulse.
- **`idle`**: Starts in the assembled state with subtle breathing and float.
- **`interactive`**: Enables `OrbitControls` 3D inspection with damping, zoom constraints, and a **Reset View** control.
- **`minimal`**: Disables post-processing, transmission passes, and continuous rendering (`frameloop="demand"`).

---

## 5. Performance & Accessibility

- **Zero per-frame React state updates**: All 60 FPS animations mutate a `useRef` state object inside `useFrame`.
- **Shared geometries & clean disposal**: `createBeveledYArmGeometry`, unit cylinders, and spheres are shared across instances and disposed on unmount.
- **Lazy loading & WebGL fallback**: `YaraLogoScene` is dynamically loaded with `React.lazy`; devices without WebGL render a crisp static SVG fallback wrapped in an `ErrorBoundary`.
- **Viewport & tab pausing**: Uses CSS `content-visibility: auto` with `contentvisibilityautostatechange` (and `IntersectionObserver` fallback) plus `document.visibilitychange` to pause rendering when off-screen or hidden.
- **Reduced motion (`prefers-reduced-motion: reduce`)**: Skips directly to the fully visible final isometric composition with `frameloop="demand"`.
