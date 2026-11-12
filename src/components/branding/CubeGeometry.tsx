import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BACK_CENTER_VERTEX,
  CUBE_EDGES,
  OUTER_VERTICES,
  clamp01,
  easeInOutCubic,
  type LogoPalette,
} from './cubeMath';
import type { LogoAnimationState, LogoMode } from '../../hooks/useLogoAnimation';

interface CubeGeometryProps {
  animRef: React.MutableRefObject<LogoAnimationState>;
  mode: LogoMode;
  minimal: boolean;
  palette: LogoPalette;
  transparentBg?: boolean;
  reducedMotion: boolean;
}

const UP_AXIS = new THREE.Vector3(0, 1, 0);

// Perimeter circuit vertices for the occasional idle light pulse
const PERIMETER_LOOP: readonly THREE.Vector3[] = [
  OUTER_VERTICES[0],
  OUTER_VERTICES[1],
  OUTER_VERTICES[2],
  OUTER_VERTICES[3],
  OUTER_VERTICES[4],
  OUTER_VERTICES[5],
  OUTER_VERTICES[0],
];

export default function CubeGeometry({
  animRef,
  mode,
  minimal,
  palette,
  transparentBg = false,
  reducedMotion,
}: CubeGeometryProps) {
  const edgeGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const backHubRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const edgeConfigs = useMemo(() => {
    return CUBE_EDGES.map((spec) => {
      const dir = new THREE.Vector3().subVectors(spec.end, spec.start);
      const length = dir.length();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        UP_AXIS,
        dir.clone().normalize()
      );
      return { ...spec, length, quat };
    });
  }, []);

  const sharedGeometries = useMemo(() => {
    const radialSegs = minimal ? 10 : 16;
    return {
      perimeterTube: new THREE.CylinderGeometry(0.031, 0.031, 1, radialSegs, 1),
      perimeterCore: new THREE.CylinderGeometry(0.011, 0.011, 1, 8, 1),
      backTube: new THREE.CylinderGeometry(0.015, 0.015, 1, 10, 1),
      frontCore: new THREE.CylinderGeometry(0.013, 0.013, 1, 8, 1),
      backHub: new THREE.SphereGeometry(0.032, 14, 14),
      pulseBead: new THREE.SphereGeometry(0.042, 14, 14),
    };
  }, [minimal]);

  const sharedMaterials = useMemo(() => {
    const perimeterOuter = minimal
      ? new THREE.MeshStandardMaterial({
          color: new THREE.Color('#00B98F'),
          emissive: new THREE.Color('#006E55'),
          emissiveIntensity: 0.4,
          metalness: 0.45,
          roughness: 0.22,
          transparent: true,
          opacity: 0.88,
        })
      : new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#00D8A4'),
          emissive: new THREE.Color('#008264'),
          emissiveIntensity: 0.42,
          metalness: 0.25,
          roughness: 0.14,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          transmission: 0.35,
          thickness: 0.12,
          ior: 1.48,
          transparent: true,
          opacity: 0.9,
        });

    const perimeterCore = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#9CFFEE'),
      transparent: true,
      opacity: 0.65,
      toneMapped: false,
    });

    const backEdge = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#008F72'),
      emissive: new THREE.Color('#005E4C'),
      emissiveIntensity: 0.25,
      metalness: 0.3,
      roughness: 0.3,
      transparent: true,
      opacity: 0.34,
    });

    const frontCore = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#66FFD9'),
      transparent: true,
      opacity: 0.48,
      toneMapped: false,
    });

    const pulse = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#B8FFF0'),
      transparent: true,
      opacity: 0,
      blending: transparentBg ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    return { perimeterOuter, perimeterCore, backEdge, frontCore, pulse };
  }, [minimal, transparentBg]);

  useEffect(() => {
    sharedMaterials.perimeterOuter.color.set(palette.perimeterColor);
    sharedMaterials.perimeterOuter.emissive.set(palette.perimeterEmissive);
    sharedMaterials.perimeterCore.color.set(palette.perimeterCore);
    sharedMaterials.backEdge.color.set(palette.backEdgeColor);
    sharedMaterials.backEdge.emissive.set(palette.backEdgeEmissive);
    sharedMaterials.frontCore.color.set(palette.frontCoreColor);
    sharedMaterials.pulse.color.set(palette.pulseColor);
  }, [palette, sharedMaterials]);

  useEffect(() => {
    return () => {
      Object.values(sharedGeometries).forEach((g) => g.dispose());
      Object.values(sharedMaterials).forEach((m) => m.dispose());
    };
  }, [sharedGeometries, sharedMaterials]);

  const tmpMid = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const state = animRef.current;
    const isStatic = reducedMotion || mode === 'minimal';

    for (let i = 0; i < edgeConfigs.length; i++) {
      const cfg = edgeConfigs[i];
      const grp = edgeGroupRefs.current[i];
      if (!grp) continue;

      if (isStatic) {
        tmpMid.lerpVectors(cfg.start, cfg.end, 0.5);
        grp.position.copy(tmpMid);
        grp.scale.set(1, cfg.length, 1);
        grp.visible = true;
        continue;
      }

      // Phase 2: progressive structural growth along actual 3D edge vector
      const localP = clamp01((state.p2 - cfg.phaseDelay) / (1 - cfg.phaseDelay * 0.72));
      const growth = easeInOutCubic(localP);

      if (growth <= 0.002) {
        grp.visible = false;
        continue;
      }

      grp.visible = true;
      tmpMid.lerpVectors(cfg.start, cfg.end, growth * 0.5);
      grp.position.copy(tmpMid);
      grp.scale.set(1, Math.max(0.001, growth * cfg.length), 1);
    }

    if (backHubRef.current) {
      if (isStatic) {
        backHubRef.current.visible = true;
        backHubRef.current.scale.setScalar(1);
      } else {
        const hubP = clamp01((state.p2 - 0.55) / 0.35);
        backHubRef.current.visible = hubP > 0.01;
        backHubRef.current.scale.setScalar(Math.max(0.001, easeInOutCubic(hubP)));
      }
    }

    // Phase 6: occasional subtle traveling light pulse along outer hexagon rails
    if (pulseRef.current && pulseMatRef.current) {
      if (isStatic || state.phase < 6) {
        pulseRef.current.visible = false;
        pulseMatRef.current.opacity = 0;
      } else {
        const cycle = state.idleTime % 7.0;
        if (cycle < 2.2) {
          const t = cycle / 2.2;
          const totalSegs = PERIMETER_LOOP.length - 1;
          const scaled = t * totalSegs;
          const segIdx = Math.min(totalSegs - 1, Math.floor(scaled));
          const segFrac = scaled - segIdx;
          tmpMid.lerpVectors(
            PERIMETER_LOOP[segIdx],
            PERIMETER_LOOP[segIdx + 1],
            segFrac
          );
          pulseRef.current.visible = true;
          pulseRef.current.position.copy(tmpMid);
          pulseMatRef.current.opacity = Math.sin(t * Math.PI) * 0.65;
        } else {
          pulseRef.current.visible = false;
          pulseMatRef.current.opacity = 0;
        }
      }
    }
  });

  return (
    <group name="yara-cube-structure">
      {edgeConfigs.map((cfg, idx) => (
        <group
          key={cfg.id}
          ref={(el) => {
            edgeGroupRefs.current[idx] = el;
          }}
          quaternion={cfg.quat}
        >
          {cfg.kind === 'perimeter' && (
            <>
              <mesh
                geometry={sharedGeometries.perimeterTube}
                material={sharedMaterials.perimeterOuter}
              />
              <mesh
                geometry={sharedGeometries.perimeterCore}
                material={sharedMaterials.perimeterCore}
              />
            </>
          )}
          {cfg.kind === 'back' && (
            <mesh
              geometry={sharedGeometries.backTube}
              material={sharedMaterials.backEdge}
            />
          )}
          {cfg.kind === 'front-core' && (
            <mesh
              geometry={sharedGeometries.frontCore}
              material={sharedMaterials.frontCore}
            />
          )}
        </group>
      ))}

      {/* Subtle junction hub at the rear vertex */}
      <mesh
        ref={backHubRef}
        position={BACK_CENTER_VERTEX}
        geometry={sharedGeometries.backHub}
        material={sharedMaterials.backEdge}
      />

      {/* Occasional idle traveling perimeter light pulse */}
      {!minimal && (
        <mesh ref={pulseRef} geometry={sharedGeometries.pulseBead} visible={false}>
          <primitive object={sharedMaterials.pulse} ref={pulseMatRef} attach="material" />
        </mesh>
      )}
    </group>
  );
}
