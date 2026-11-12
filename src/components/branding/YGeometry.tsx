import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  FRONT_CENTER_VERTEX,
  OUTER_VERTICES,
  clamp01,
  createBeveledYArmGeometry,
  easeInOutCubic,
  easeOutCubic,
  type LogoPalette,
} from './cubeMath';
import type { LogoAnimationState, LogoMode } from '../../hooks/useLogoAnimation';

interface YGeometryProps {
  animRef: React.MutableRefObject<LogoAnimationState>;
  mode: LogoMode;
  minimal: boolean;
  palette: LogoPalette;
  transparentBg?: boolean;
  reducedMotion: boolean;
}

const ARM_ROTATIONS = {
  // Note: canonical arm in cubeMath points down (-Y), i.e. FRONT_CENTER -> BOTTOM (0 rad)
  // Rotating +2*PI/3 around +Z maps BOTTOM -> UPPER_RIGHT
  // Rotating -2*PI/3 around +Z maps BOTTOM -> UPPER_LEFT
  left: -(2 * Math.PI) / 3,
  right: +(2 * Math.PI) / 3,
  stem: 0,
} as const;

export default function YGeometry({
  animRef,
  mode,
  minimal,
  palette,
  transparentBg = false,
  reducedMotion,
}: YGeometryProps) {
  const leftMeshRef = useRef<THREE.Mesh>(null);
  const rightMeshRef = useRef<THREE.Mesh>(null);
  const stemMeshRef = useRef<THREE.Mesh>(null);

  const leftRidgeRef = useRef<THREE.Mesh>(null);
  const rightRidgeRef = useRef<THREE.Mesh>(null);
  const stemRidgeRef = useRef<THREE.Mesh>(null);

  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const sharedGeometries = useMemo(() => {
    const bevelArm = createBeveledYArmGeometry();
    // Thin luminous spine along the central outer ridge of the Y arm (canonical stem)
    const ridgeStart = FRONT_CENTER_VERTEX.clone().add(new THREE.Vector3(0, 0, 0.095));
    const ridgeEnd = OUTER_VERTICES[3].clone().lerp(FRONT_CENTER_VERTEX, 0.14).add(new THREE.Vector3(0, 0, 0.075));
    const ridgeVec = new THREE.Vector3().subVectors(ridgeEnd, ridgeStart);
    const ridgeLen = ridgeVec.length();
    const ridgeMid = new THREE.Vector3().lerpVectors(ridgeStart, ridgeEnd, 0.5);
    const ridgeQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      ridgeVec.clone().normalize()
    );

    const ridgeGeo = new THREE.CylinderGeometry(0.012, 0.008, ridgeLen, 10, 1);
    const pulseGeo = new THREE.SphereGeometry(0.058, 16, 16);

    return {
      bevelArm,
      ridgeGeo,
      ridgeMid,
      ridgeQuat,
      pulseGeo,
    };
  }, []);

  // World-space clipping planes updated each frame from local sweep progress
  const clipPlanes = useMemo(
    () => ({
      left: new THREE.Plane(),
      right: new THREE.Plane(),
      stem: new THREE.Plane(),
    }),
    []
  );

  // Local arm sweep vectors (defined in the parent cube group's coordinate frame)
  const sweepSpecs = useMemo(() => {
    const leftDir = new THREE.Vector3()
      .subVectors(FRONT_CENTER_VERTEX, OUTER_VERTICES[5])
      .normalize();
    const rightDir = new THREE.Vector3()
      .subVectors(FRONT_CENTER_VERTEX, OUTER_VERTICES[1])
      .normalize();
    const stemDir = new THREE.Vector3()
      .subVectors(OUTER_VERTICES[3], FRONT_CENTER_VERTEX)
      .normalize();

    return {
      left: {
        start: OUTER_VERTICES[5].clone().addScaledVector(leftDir, 0.12),
        end: FRONT_CENTER_VERTEX.clone().addScaledVector(leftDir, 0.35),
        normal: leftDir.clone().negate(),
      },
      right: {
        start: OUTER_VERTICES[1].clone().addScaledVector(rightDir, 0.12),
        end: FRONT_CENTER_VERTEX.clone().addScaledVector(rightDir, 0.35),
        normal: rightDir.clone().negate(),
      },
      stem: {
        start: FRONT_CENTER_VERTEX.clone().addScaledVector(stemDir, -0.15),
        end: OUTER_VERTICES[3].clone().addScaledVector(stemDir, 0.2),
        normal: stemDir.clone().negate(),
      },
    };
  }, []);

  const materials = useMemo(() => {
    const makeArmMaterial = (clipPlane: THREE.Plane) => {
      if (minimal) {
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color('#00E5A3'),
          emissive: new THREE.Color('#00A87E'),
          emissiveIntensity: 0.72,
          metalness: 0.25,
          roughness: 0.16,
          transparent: true,
          opacity: 0.92,
          flatShading: true,
        });
      }
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#00E5A3'),
        emissive: new THREE.Color('#00B98F'),
        emissiveIntensity: 0.78,
        metalness: 0.12,
        roughness: 0.09,
        transmission: 0.42,
        thickness: 0.32,
        ior: 1.54,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        attenuationColor: new THREE.Color('#007D66'),
        attenuationDistance: 0.7,
        reflectivity: 0.98,
        transparent: true,
        opacity: 0.94,
        flatShading: true,
        clippingPlanes: [clipPlane],
        clipShadows: false,
      });
    };

    const leftMat = makeArmMaterial(clipPlanes.left);
    const rightMat = makeArmMaterial(clipPlanes.right);
    const stemMat = makeArmMaterial(clipPlanes.stem);

    const ridgeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#B8FFF0'),
      transparent: true,
      opacity: 0.75,
      blending: transparentBg ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    const pulseMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#D8FFF7'),
      transparent: true,
      opacity: 0,
      blending: transparentBg ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    return { leftMat, rightMat, stemMat, ridgeMat, pulseMat };
  }, [minimal, transparentBg, clipPlanes]);

  useEffect(() => {
    const arms = [materials.leftMat, materials.rightMat, materials.stemMat];
    arms.forEach((m) => {
      m.color.set(palette.yColor);
      m.emissive.set(palette.yEmissive);
      if (m instanceof THREE.MeshPhysicalMaterial) {
        m.attenuationColor.set(palette.yAttenuation);
      }
    });
    materials.ridgeMat.color.set(palette.yRidge);
    materials.pulseMat.color.set(palette.pulseColor);
  }, [palette, materials]);

  useEffect(() => {
    return () => {
      sharedGeometries.bevelArm.dispose();
      sharedGeometries.ridgeGeo.dispose();
      sharedGeometries.pulseGeo.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [sharedGeometries, materials]);

  const pulseSpan = useMemo(
    () => ({
      start: FRONT_CENTER_VERTEX.clone().add(new THREE.Vector3(0, 0, 0.08)),
      end: OUTER_VERTICES[3]
        .clone()
        .lerp(FRONT_CENTER_VERTEX, 0.16)
        .add(new THREE.Vector3(0, 0, 0.05)),
    }),
    []
  );

  const tmpPoint = useMemo(() => new THREE.Vector3(), []);
  const tmpLocalPlane = useMemo(() => new THREE.Plane(), []);
  const tmpParentInv = useMemo(() => new THREE.Matrix4(), []);

  useFrame(() => {
    const state = animRef.current;
    const isStatic = reducedMotion || mode === 'minimal';

    const updateArm = (
      mesh: THREE.Mesh | null,
      ridge: THREE.Mesh | null,
      mat: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial,
      plane: THREE.Plane,
      spec: { start: THREE.Vector3; end: THREE.Vector3; normal: THREE.Vector3 },
      progress: number,
      pulseBoost: number
    ) => {
      if (!mesh) return;
      if (isStatic) {
        mesh.visible = true;
        mat.opacity = 0.94;
        mat.emissiveIntensity = 0.78;
        if (!minimal) {
          tmpLocalPlane.set(new THREE.Vector3(0, 0, 1), 100);
          plane.copy(tmpLocalPlane);
        }
        if (ridge) ridge.visible = true;
        return;
      }

      const eased = easeOutCubic(progress);
      mesh.visible = eased > 0.005;
      if (ridge) ridge.visible = eased > 0.15;

      mat.opacity = eased * 0.94;
      mat.emissiveIntensity = 0.55 + eased * 0.25 + pulseBoost * 0.45;

      if (!minimal && mesh.parent) {
        if (eased >= 0.999) {
          // Far away so the fully assembled arm is never clipped
          plane.set(new THREE.Vector3(0, 0, 1), 100);
        } else {
          tmpPoint.lerpVectors(spec.start, spec.end, eased);
          tmpLocalPlane.setFromNormalAndCoplanarPoint(spec.normal, tmpPoint);
          // Transform local group plane into world space
          tmpParentInv.copy(mesh.parent.matrixWorld);
          plane.copy(tmpLocalPlane).applyMatrix4(tmpParentInv);
        }
      }
    };

    // Phase 3 (3.5 - 5.0s):
    // Upper diagonals first (0.0 -> 0.55 of p3), then central stem (0.38 -> 0.85 of p3)
    const armsP = clamp01(state.p3 / 0.55);
    const stemP = clamp01((state.p3 - 0.36) / 0.48);

    // Phase 3 light pulse traveling down stem (0.68 -> 1.0 of p3)
    const introPulseT = clamp01((state.p3 - 0.65) / 0.35);
    const introPulseActive = !isStatic && state.p3 > 0.65 && state.p3 < 1.0;

    // Phase 6 occasional idle energy pulse down stem (every 7s, offset from perimeter pulse)
    const idleCycle = (state.idleTime + 3.5) % 7.0;
    const idlePulseActive = !isStatic && state.phase >= 6 && idleCycle < 1.4;
    const idlePulseT = idlePulseActive ? easeInOutCubic(idleCycle / 1.4) : 0;

    const activePulseT = introPulseActive
      ? easeInOutCubic(introPulseT)
      : idlePulseActive
      ? idlePulseT
      : -1;

    const stemPulseBoost =
      activePulseT >= 0 ? Math.sin(activePulseT * Math.PI) * 0.65 : 0;

    const idleStableBreath =
      state.phase >= 6
        ? 0.08 * Math.sin(state.idleTime * 1.1)
        : 0;

    updateArm(
      leftMeshRef.current,
      leftRidgeRef.current,
      materials.leftMat,
      clipPlanes.left,
      sweepSpecs.left,
      armsP,
      idleStableBreath
    );
    updateArm(
      rightMeshRef.current,
      rightRidgeRef.current,
      materials.rightMat,
      clipPlanes.right,
      sweepSpecs.right,
      armsP,
      idleStableBreath
    );
    updateArm(
      stemMeshRef.current,
      stemRidgeRef.current,
      materials.stemMat,
      clipPlanes.stem,
      sweepSpecs.stem,
      stemP,
      stemPulseBoost + idleStableBreath
    );

    materials.ridgeMat.opacity = isStatic
      ? 0.72
      : 0.72 * easeOutCubic(clamp01(state.p3 / 0.85)) + stemPulseBoost * 0.3;

    if (pulseRef.current && pulseMatRef.current) {
      if (activePulseT >= 0) {
        tmpPoint.lerpVectors(pulseSpan.start, pulseSpan.end, activePulseT);
        pulseRef.current.visible = true;
        pulseRef.current.position.copy(tmpPoint);
        const s = 0.75 + Math.sin(activePulseT * Math.PI) * 0.55;
        pulseRef.current.scale.set(s, s * 1.75, s);
        pulseMatRef.current.opacity = Math.sin(activePulseT * Math.PI) * 0.85;
      } else {
        pulseRef.current.visible = false;
        pulseMatRef.current.opacity = 0;
      }
    }
  });

  return (
    <group name="yara-internal-y">
      {/* Left upper diagonal Y structural beam */}
      <mesh
        ref={leftMeshRef}
        geometry={sharedGeometries.bevelArm}
        material={materials.leftMat}
        rotation={[0, 0, ARM_ROTATIONS.left]}
      />
      {/* Right upper diagonal Y structural beam */}
      <mesh
        ref={rightMeshRef}
        geometry={sharedGeometries.bevelArm}
        material={materials.rightMat}
        rotation={[0, 0, ARM_ROTATIONS.right]}
      />
      {/* Central vertical stem Y structural beam */}
      <mesh
        ref={stemMeshRef}
        geometry={sharedGeometries.bevelArm}
        material={materials.stemMat}
        rotation={[0, 0, ARM_ROTATIONS.stem]}
      />

      {/* Crisp luminous central ridge spines */}
      <group rotation={[0, 0, ARM_ROTATIONS.left]}>
        <mesh
          ref={leftRidgeRef}
          geometry={sharedGeometries.ridgeGeo}
          material={materials.ridgeMat}
          position={sharedGeometries.ridgeMid}
          quaternion={sharedGeometries.ridgeQuat}
        />
      </group>
      <group rotation={[0, 0, ARM_ROTATIONS.right]}>
        <mesh
          ref={rightRidgeRef}
          geometry={sharedGeometries.ridgeGeo}
          material={materials.ridgeMat}
          position={sharedGeometries.ridgeMid}
          quaternion={sharedGeometries.ridgeQuat}
        />
      </group>
      <group rotation={[0, 0, ARM_ROTATIONS.stem]}>
        <mesh
          ref={stemRidgeRef}
          geometry={sharedGeometries.ridgeGeo}
          material={materials.ridgeMat}
          position={sharedGeometries.ridgeMid}
          quaternion={sharedGeometries.ridgeQuat}
        />
      </group>

      {/* Convergence-to-stem traveling luminous pulse */}
      {!minimal && (
        <mesh ref={pulseRef} geometry={sharedGeometries.pulseGeo} visible={false}>
          <primitive object={materials.pulseMat} ref={pulseMatRef} attach="material" />
        </mesh>
      )}
    </group>
  );
}
