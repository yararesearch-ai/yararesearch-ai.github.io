'use client';
import { useRef, useMemo, useState, useEffect, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MouseState {
  x: number;
  y: number;
  worldX: number;
  worldY: number;
  active: boolean;
}

const MouseContext = createContext<React.MutableRefObject<MouseState>>({
  current: { x: 0, y: 0, worldX: 0, worldY: 0, active: false },
});

interface IntelligenceFieldProps {
  className?: string;
  nodeCount?: number;
  reducedMotion?: boolean;
  variant?: 'hero' | 'section' | 'mini';
}

/* =========================================================================
   Theme Detection Hook for Synchronized 3D Rendering
   ========================================================================= */
function useThemeMode(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const updateTheme = () => {
      const isLight =
        document.documentElement.getAttribute('data-theme') === 'light' ||
        document.documentElement.classList.contains('light');
      setTheme(isLight ? 'light' : 'dark');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

/* =========================================================================
   1. The Latent Manifold (Hero) — Interactive Antigravity Vector Streamlines
   ========================================================================= */
function LatentManifold({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useContext(MouseContext);
  const theme = useThemeMode();
  const isLight = theme === 'light';
  const count = 1100;

  // Initialize particle coordinates and colors
  const [positions, initialCoords, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const coords = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#5B9CFF'), // electric blue
      new THREE.Color('#56D9E8'), // intelligence cyan
      new THREE.Color('#8B83FF'), // research violet
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 11;
      const y = (Math.random() - 0.5) * 6.5;
      const z = (Math.random() - 0.5) * 5;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      coords[i * 3] = x;
      coords[i * 3 + 1] = y;
      coords[i * 3 + 2] = z;

      const color = palette[i % palette.length];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }

    return [pos, coords, cols];
  }, []);

  // Adapt particle colors in real time between Dark glow and Blueprint precision ink
  useEffect(() => {
    if (!pointsRef.current) return;
    const colorAttr = pointsRef.current.geometry.attributes.color;
    if (!colorAttr) return;

    const darkPalette = [
      new THREE.Color('#5B9CFF'),
      new THREE.Color('#56D9E8'),
      new THREE.Color('#8B83FF'),
    ];

    const lightPalette = [
      new THREE.Color('#1D4ED8'), // blueprint cobalt
      new THREE.Color('#0284C7'), // technical cyan
      new THREE.Color('#0F172A'), // precision ink
    ];

    const targetPalette = isLight ? lightPalette : darkPalette;
    const cols = colorAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const c = targetPalette[i % targetPalette.length];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    colorAttr.needsUpdate = true;
  }, [isLight]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  // shortcut: CPU vector field with cursor gravitational repulsion; upgrade to compute shader if particles > 5k
  useFrame((state, delta) => {
    if (!pointsRef.current || !groupRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const pos = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime * 0.45;
    const mouse = mouseRef.current;

    // Smooth whole-field parallax & translation tracking (antigravity style)
    const targetRotX = -mouse.y * 0.35;
    const targetRotY = mouse.x * 0.45;
    const targetPosX = mouse.x * 0.7;
    const targetPosY = mouse.y * 0.45;

    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.position.x += (targetPosX - groupRef.current.position.x) * 0.05;
    groupRef.current.position.y += (targetPosY - groupRef.current.position.y) * 0.05;

    if (!reducedMotion) {
      const step = Math.min(delta, 0.05) * 1.8;
      const mX = mouse.worldX;
      const mY = mouse.worldY;
      const hasMouse = mouse.active;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const px = pos[idx];
        const py = pos[idx + 1];
        const pz = pos[idx + 2];

        // 3D curl/divergence-free flow velocity
        let vx = Math.sin(py * 0.65 + t) * 0.8 + Math.cos(pz * 0.45 + t * 0.7) * 0.4;
        let vy = Math.cos(px * 0.65 + t) * 0.8 + Math.sin(pz * 0.55 + t * 0.5) * 0.4;
        let vz = Math.sin(px * 0.45 + py * 0.45 + t) * 0.5;

        // Antigravity cursor interaction: dynamic repulsive & tangential vortex force
        if (hasMouse) {
          const dx = px - mX;
          const dy = py - mY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 4.5) {
            const dist = Math.sqrt(distSq);
            const force = (1.0 - dist / 2.12) * 2.2;
            // Repulsive impulse + swirl
            vx += (dx / (dist + 0.01)) * force * 1.8 - dy * force * 0.9;
            vy += (dy / (dist + 0.01)) * force * 1.8 + dx * force * 0.9;
            vz += force * 0.7;
          }
        }

        pos[idx] += vx * step;
        pos[idx + 1] += vy * step;
        pos[idx + 2] += vz * step;

        // Soft volume boundaries with smooth wrapping
        if (pos[idx] > 6) pos[idx] = -6;
        if (pos[idx] < -6) pos[idx] = 6;
        if (pos[idx + 1] > 3.8) pos[idx + 1] = -3.8;
        if (pos[idx + 1] < -3.8) pos[idx + 1] = 3.8;
        if (pos[idx + 2] > 3) pos[idx + 2] = -3;
        if (pos[idx + 2] < -3) pos[idx + 2] = 3;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={isLight ? 0.08 : 0.07}
          vertexColors
          transparent
          opacity={isLight ? 0.88 : 0.82}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* =========================================================================
   2. The Loss Landscape (Closing CTA) — 3D Topographic Mathematical Surface
   ========================================================================= */
function LossLandscape({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useContext(MouseContext);
  const theme = useThemeMode();
  const isLight = theme === 'light';

  const [gridWidth, gridHeight, segX, segY] = [16, 16, 44, 44];
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(gridWidth, gridHeight, segX, segY);
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const mouse = mouseRef.current;

    // Smooth cursor tilt and slight elevation reaction
    const targetTiltX = -0.9 + -mouse.y * 0.25;
    const targetTiltZ = mouse.x * 0.25;
    const targetPosX = mouse.x * 0.5;

    groupRef.current.rotation.x += (targetTiltX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z += (targetTiltZ - groupRef.current.rotation.z) * 0.05;
    groupRef.current.position.x += (targetPosX - groupRef.current.position.x) * 0.05;

    if (!reducedMotion) {
      const t = state.clock.elapsedTime * 0.4;
      const posAttr = meshRef.current.geometry.attributes.position;
      const pos = posAttr.array as Float32Array;

      const mX = mouse.worldX * 1.5;
      const mY = mouse.worldY * 1.5;

      for (let i = 0; i < pos.length; i += 3) {
        const x = pos[i];
        const y = pos[i + 1];

        // Harmonic loss surface
        const distFromCenter = Math.sqrt(x * x + y * y);
        let z =
          Math.sin(x * 0.45 + t) * Math.cos(y * 0.45 + t * 0.8) * 0.7 +
          Math.sin(distFromCenter * 0.7 - t) * 0.35 +
          Math.cos(x * 0.25 - y * 0.25 + t * 0.5) * 0.25;

        // Pointer ripple on the loss surface
        if (mouse.active) {
          const dx = x - mX;
          const dy = y - mY;
          const distMouse = Math.sqrt(dx * dx + dy * dy);
          if (distMouse < 4.0) {
            z += Math.sin(distMouse * 2.0 - t * 2.5) * Math.exp(-distMouse * 0.6) * 0.6;
          }
        }

        pos[i + 2] = z;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, -1]} rotation={[-0.9, 0, 0]}>
      <fogExp2 attach="fog" args={[isLight ? '#F0F4F8' : '#090B10', isLight ? 0.09 : 0.11]} />

      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color={isLight ? '#1D4ED8' : '#5B9CFF'}
          wireframe
          transparent
          opacity={isLight ? 0.35 : 0.28}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* =========================================================================
   Container Component with Global Window Pointer Tracking
   ========================================================================= */
export default function IntelligenceField({
  className = '',
  reducedMotion = false,
  variant = 'hero',
}: IntelligenceFieldProps) {
  const [canRenderWebGL, setCanRenderWebGL] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseState = useRef<MouseState>({
    x: 0,
    y: 0,
    worldX: 0,
    worldY: 0,
    active: false,
  });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setCanRenderWebGL(supported);
    } catch {
      setCanRenderWebGL(false);
    }

    // Global pointer tracking (works across the entire window, even over text & buttons)
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseState.current.x = nx;
      mouseState.current.y = ny;
      // Convert to estimated 3D world coordinates on z=0 plane
      mouseState.current.worldX = nx * 5.0;
      mouseState.current.worldY = ny * 3.0;
      mouseState.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseState.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  if (!canRenderWebGL) {
    return (
      <div
        className={`intelligence-fallback ${className}`}
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 40%, rgba(91,156,255,0.08) 0%, transparent 70%)',
        }}
      />
    );
  }

  const isHero = variant === 'hero';

  return (
    <div
      ref={containerRef}
      className={`intelligence-field-root ${className}`}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <MouseContext.Provider value={mouseState}>
        <Canvas
          camera={
            isHero
              ? { position: [0, 0, 5], fov: 50 }
              : { position: [0, 2.5, 6], fov: 46 }
          }
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {isHero ? (
            <LatentManifold reducedMotion={reducedMotion} />
          ) : (
            <LossLandscape reducedMotion={reducedMotion} />
          )}
        </Canvas>
      </MouseContext.Provider>
    </div>
  );
}
