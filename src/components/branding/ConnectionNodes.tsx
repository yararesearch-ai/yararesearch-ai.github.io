import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  NODE_RADIUS,
  OUTER_VERTICES,
  clamp01,
  easeOutCubic,
} from './cubeMath';
import type { LogoAnimationState, LogoMode } from '../../hooks/useLogoAnimation';

interface ConnectionNodesProps {
  animRef: React.MutableRefObject<LogoAnimationState>;
  mode: LogoMode;
  minimal: boolean;
  reducedMotion: boolean;
}

const NODE_STAGGER = [0.0, 0.12, 0.24, 0.34, 0.24, 0.12];

export default function ConnectionNodes({
  animRef,
  mode,
  minimal,
  reducedMotion,
}: ConnectionNodesProps) {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const outerMatRefs = useRef<(THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial | null)[]>([]);
  const coreMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const haloMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  const geometries = useMemo(() => {
    const segs = minimal ? 20 : 36;
    return {
      outer: new THREE.SphereGeometry(NODE_RADIUS, segs, segs),
      core: new THREE.SphereGeometry(NODE_RADIUS * 0.48, 20, 20),
      halo: new THREE.SphereGeometry(NODE_RADIUS * 1.48, 20, 20),
    };
  }, [minimal]);

  // Unique per-node materials so each node can breathe/pulse independently without state updates
  const materials = useMemo(() => {
    return OUTER_VERTICES.map((_, idx) => {
      const outer = minimal
        ? new THREE.MeshStandardMaterial({
            color: new THREE.Color('#00B98F'),
            emissive: new THREE.Color('#007A5E'),
            emissiveIntensity: 0.45,
            metalness: 0.45,
            roughness: 0.18,
            transparent: true,
            opacity: 1,
          })
        : new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#00C99B'),
            emissive: new THREE.Color('#008F6E'),
            emissiveIntensity: 0.42,
            metalness: 0.3,
            roughness: 0.12,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            ior: 1.52,
            reflectivity: 0.95,
            iridescence: 0.18,
            iridescenceIOR: 1.35,
            transparent: true,
            opacity: 1,
          });

      const core = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#B8FFF0'),
        transparent: true,
        opacity: 0.88,
        toneMapped: false,
      });

      const halo = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#00E5A3'),
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      });

      return { id: idx, outer, core, halo };
    });
  }, [minimal]);

  useEffect(() => {
    return () => {
      geometries.outer.dispose();
      geometries.core.dispose();
      geometries.halo.dispose();
      materials.forEach((m) => {
        m.outer.dispose();
        m.core.dispose();
        m.halo.dispose();
      });
    };
  }, [geometries, materials]);

  useFrame((_, delta) => {
    const state = animRef.current;
    const isStatic = reducedMotion || mode === 'minimal';

    for (let i = 0; i < OUTER_VERTICES.length; i++) {
      const grp = groupRefs.current[i];
      const outerMat = outerMatRefs.current[i];
      const coreMat = coreMatRefs.current[i];
      const haloMat = haloMatRefs.current[i];
      if (!grp || !outerMat || !coreMat || !haloMat) continue;

      if (isStatic) {
        grp.scale.setScalar(1);
        grp.visible = true;
        outerMat.opacity = 1;
        outerMat.emissiveIntensity = 0.45;
        coreMat.opacity = 0.85;
        haloMat.opacity = 0.12;
        continue;
      }

      // Phase 1: staggered emergence (0 - 1.5s)
      const stagger = NODE_STAGGER[i];
      const localP = clamp01((state.p1 - stagger) / (1 - stagger * 0.65));
      const eased = easeOutCubic(localP);

      // Subtle arrival pulse peaking mid-emergence and settling cleanly
      const emergencePulse = Math.sin(localP * Math.PI) * 0.55;

      // Phase 6: gentle breathing glow
      const breath =
        state.phase >= 6
          ? 0.5 + 0.5 * Math.sin(state.idleTime * 1.4 + i * 1.05)
          : 0.4;

      // Interactive proximity/hover boost
      const isHovered = state.hoveredNodeIndex === i;
      const pointerBoost = state.pointerActive
        ? Math.max(0, 1 - Math.hypot(state.pointerX, state.pointerY) * 0.6) * 0.12
        : 0;
      const targetHoverBoost = isHovered ? 0.45 : pointerBoost;

      const scale = Math.max(0.001, eased);
      grp.visible = localP > 0.005;
      grp.scale.setScalar(scale);

      outerMat.opacity = eased;
      const targetEmissive = 0.36 + emergencePulse * 0.55 + breath * 0.18 + targetHoverBoost;
      outerMat.emissiveIntensity = THREE.MathUtils.damp(
        outerMat.emissiveIntensity,
        targetEmissive,
        8,
        delta
      );

      coreMat.opacity = eased * (0.72 + emergencePulse * 0.28 + breath * 0.16);
      haloMat.opacity = eased * (0.09 + emergencePulse * 0.16 + breath * 0.06 + targetHoverBoost * 0.2);
    }
  });

  return (
    <group name="yara-connection-nodes">
      {OUTER_VERTICES.map((pos, idx) => (
        <group
          key={idx}
          ref={(el) => {
            groupRefs.current[idx] = el;
          }}
          position={pos}
          onPointerOver={(e) => {
            e.stopPropagation();
            animRef.current.hoveredNodeIndex = idx;
          }}
          onPointerOut={() => {
            if (animRef.current.hoveredNodeIndex === idx) {
              animRef.current.hoveredNodeIndex = null;
            }
          }}
        >
          <mesh geometry={geometries.outer}>
            <primitive
              object={materials[idx].outer}
              ref={(el: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial | null) => {
                outerMatRefs.current[idx] = el;
              }}
              attach="material"
            />
          </mesh>
          <mesh geometry={geometries.core}>
            <primitive
              object={materials[idx].core}
              ref={(el: THREE.MeshBasicMaterial | null) => {
                coreMatRefs.current[idx] = el;
              }}
              attach="material"
            />
          </mesh>
          {!minimal && (
            <mesh geometry={geometries.halo}>
              <primitive
                object={materials[idx].halo}
                ref={(el: THREE.MeshBasicMaterial | null) => {
                  haloMatRefs.current[idx] = el;
                }}
                attach="material"
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
