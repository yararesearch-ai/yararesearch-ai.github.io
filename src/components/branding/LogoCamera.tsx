import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { easeInOutCubic } from './cubeMath';
import type { LogoAnimationState, LogoMode } from '../../hooks/useLogoAnimation';

interface LogoCameraProps {
  animRef: React.MutableRefObject<LogoAnimationState>;
  mode: LogoMode;
  interactive: boolean;
  inspectEnabled: boolean;
  resetSignal: number;
  reducedMotion: boolean;
}

const CAMERA_FOV = 28;
const FOV_RAD = THREE.MathUtils.degToRad(CAMERA_FOV);
const TAN_HALF_FOV = Math.tan(FOV_RAD / 2);

export default function LogoCamera({
  animRef,
  mode,
  interactive,
  inspectEnabled,
  resetSignal,
  reducedMotion,
}: LogoCameraProps) {
  const { camera, size, invalidate } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const resettingRef = useRef(false);

  const baseZ = useMemo(() => {
    const aspect = Math.max(0.4, size.width / Math.max(1, size.height));
    const widthFitZ = 3.24 / (0.68 * aspect * 2 * TAN_HALF_FOV);
    const heightFitZ = 11.2;
    return Math.max(heightFitZ, widthFitZ);
  }, [size.width, size.height]);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = CAMERA_FOV;
      camera.near = 0.1;
      camera.far = 100;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Trigger smooth reset when user clicks Reset Camera
  useEffect(() => {
    if (resetSignal === 0) return;
    resettingRef.current = true;
    invalidate();
  }, [resetSignal, invalidate]);

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const origin = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const state = animRef.current;

    if (inspectEnabled && controlsRef.current) {
      if (resettingRef.current) {
        targetPos.set(0, 0, baseZ);
        camera.position.lerp(targetPos, 1 - Math.exp(-8 * delta));
        controlsRef.current.target.lerp(origin, 1 - Math.exp(-8 * delta));
        controlsRef.current.update();
        if (camera.position.distanceTo(targetPos) < 0.015) {
          camera.position.copy(targetPos);
          controlsRef.current.target.copy(origin);
          controlsRef.current.update();
          resettingRef.current = false;
        }
      }
      return;
    }

    if (reducedMotion || mode === 'minimal') {
      camera.position.set(0, 0, baseZ);
      camera.lookAt(origin);
      return;
    }

    // Smooth camera transition from initial slightly closer/angled framing to isometric pose (Phase 4)
    const settle = easeInOutCubic(state.p4);
    const startOffsetX = 0.75 * (1 - settle);
    const startOffsetY = 0.38 * (1 - settle);
    const startZoom = -1.25 * (1 - settle);

    // Subtle pointer parallax
    const parallaxX =
      interactive && state.pointerActive ? state.pointerX * 0.28 : 0;
    const parallaxY =
      interactive && state.pointerActive ? state.pointerY * 0.18 : 0;

    // Optional subtle scroll progression (zoom closer slightly if host page sets scrollProgress)
    const scrollZoom = -state.scrollProgress * 1.4;

    targetPos.set(
      startOffsetX + parallaxX,
      startOffsetY + parallaxY,
      baseZ + startZoom + scrollZoom
    );

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, 5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, 5, delta);
    camera.lookAt(origin);
  });

  if (!inspectEnabled) return null;

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom={true}
      enableDamping={true}
      dampingFactor={0.07}
      rotateSpeed={0.7}
      zoomSpeed={0.75}
      minDistance={6.0}
      maxDistance={18.0}
      onStart={() => {
        resettingRef.current = false;
      }}
    />
  );
}
