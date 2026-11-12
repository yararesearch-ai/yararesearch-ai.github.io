import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easeOutCubic } from './cubeMath';
import type { LogoAnimationState, LogoMode } from '../../hooks/useLogoAnimation';

interface LogoLightingProps {
  animRef: React.MutableRefObject<LogoAnimationState>;
  mode: LogoMode;
  minimal: boolean;
  reducedMotion: boolean;
}

function createRadialGlowTexture(
  innerColor: string,
  midColor: string
): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, innerColor);
  grad.addColorStop(0.35, midColor);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function LogoLighting({
  animRef,
  mode,
  minimal,
  reducedMotion,
}: LogoLightingProps) {
  const centerLightRef = useRef<THREE.PointLight>(null);
  const centerGlowRef = useRef<THREE.Mesh>(null);
  const centerGlowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const floorGlowRef = useRef<THREE.Mesh>(null);
  const floorGlowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const glowAssets = useMemo(() => {
    const centerTex = createRadialGlowTexture(
      'rgba(0, 229, 163, 0.34)',
      'rgba(0, 185, 143, 0.11)'
    );
    const floorTex = createRadialGlowTexture(
      'rgba(0, 229, 163, 0.38)',
      'rgba(0, 185, 143, 0.10)'
    );
    const planeGeo = new THREE.PlaneGeometry(1, 1);

    const centerMat = new THREE.MeshBasicMaterial({
      map: centerTex,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const floorMat = new THREE.MeshBasicMaterial({
      map: floorTex,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { centerTex, floorTex, planeGeo, centerMat, floorMat };
  }, []);

  useEffect(() => {
    return () => {
      glowAssets.centerTex?.dispose();
      glowAssets.floorTex?.dispose();
      glowAssets.planeGeo.dispose();
      glowAssets.centerMat.dispose();
      glowAssets.floorMat.dispose();
    };
  }, [glowAssets]);

  useFrame(() => {
    const state = animRef.current;
    const isStatic = reducedMotion || mode === 'minimal';

    if (centerLightRef.current) {
      if (isStatic) {
        centerLightRef.current.intensity = 2.6;
      } else {
        const pIntro = easeOutCubic(state.p1) * 0.6 + easeOutCubic(state.p3) * 2.0;
        const idleRipple =
          state.phase >= 6 ? Math.sin(state.idleTime * 1.2) * 0.22 : 0;
        centerLightRef.current.intensity = 0.4 + pIntro + idleRipple;
      }
    }

    if (centerGlowMatRef.current && centerGlowRef.current) {
      if (isStatic) {
        centerGlowMatRef.current.opacity = 0.24;
        centerGlowRef.current.scale.set(4.2, 4.2, 1);
      } else {
        // Phase 1 center teal aura appears first in darkness
        const appear = easeOutCubic(state.p1);
        const yBoost = easeOutCubic(state.p3) * 0.12;
        const breath =
          state.phase >= 6 ? Math.sin(state.idleTime * 1.1) * 0.03 : 0;
        centerGlowMatRef.current.opacity = appear * 0.16 + yBoost + breath;
        const s = 3.2 + appear * 1.1;
        centerGlowRef.current.scale.set(s, s, 1);
      }
    }

    if (floorGlowMatRef.current && floorGlowRef.current) {
      if (isStatic) {
        floorGlowMatRef.current.opacity = 0.42;
      } else {
        // Phase 4: soft teal illumination spreads underneath the cube
        const spread = easeOutCubic(state.p4);
        const breath =
          state.phase >= 6 ? Math.sin(state.idleTime * 0.9) * 0.04 : 0;
        floorGlowMatRef.current.opacity = spread * 0.44 + breath;
        const sx = 3.2 + spread * 2.4;
        const sy = 1.4 + spread * 0.9;
        floorGlowRef.current.scale.set(sx, sy, 1);
      }
    }
  });

  return (
    <group name="yara-logo-lighting">
      {/* Subtle deep-teal ambient base */}
      <ambientLight color="#0d3b31" intensity={0.65} />

      {/* Upper-left key light for crisp sphere highlights & bevel contrast */}
      <directionalLight
        position={[-4.5, 5.5, 6.5]}
        color="#e6fff9"
        intensity={minimal ? 2.2 : 2.6}
      />

      {/* Right/rear teal rim light to sculpt the cube silhouette against #000000 */}
      <directionalLight
        position={[5.0, -1.5, -4.5]}
        color="#00c996"
        intensity={1.9}
      />

      {/* Top-back mint rim highlight (omitted in minimal mode) */}
      {!minimal && (
        <directionalLight
          position={[0.5, 4.5, -5.5]}
          color="#b8fff0"
          intensity={1.15}
        />
      )}

      {/* Central teal point light near the Y convergence hub */}
      <pointLight
        ref={centerLightRef}
        position={[0, 0.05, 2.35]}
        color="#00e5a3"
        intensity={2.6}
        distance={8}
        decay={1.8}
      />

      {/* Soft radial center backdrop glow behind the cube */}
      <mesh
        ref={centerGlowRef}
        position={[0, 0, -2.2]}
        scale={[4.2, 4.2, 1]}
        geometry={glowAssets.planeGeo}
      >
        <primitive
          object={glowAssets.centerMat}
          ref={centerGlowMatRef}
          attach="material"
        />
      </mesh>

      {/* Soft teal pool of light beneath the bottom vertex (Phase 4+) */}
      <mesh
        ref={floorGlowRef}
        position={[0, -1.96, 0.15]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[5.6, 2.3, 1]}
        geometry={glowAssets.planeGeo}
      >
        <primitive
          object={glowAssets.floorMat}
          ref={floorGlowMatRef}
          attach="material"
        />
      </mesh>
    </group>
  );
}
