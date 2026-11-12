import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  PHASE_WINDOWS,
  computeAnimationSnapshot,
  type LogoAnimationState,
  type LogoMode,
  type LogoPhase,
} from '../../hooks/useLogoAnimation';
import { easeInOutCubic } from './cubeMath';

interface LogoAnimationProps {
  animRef: React.MutableRefObject<LogoAnimationState>;
  mode: LogoMode;
  autoPlay: boolean;
  interactive: boolean;
  isPaused: boolean;
  isOffscreen: boolean;
  reducedMotion: boolean;
  syncPhase: (phase: LogoPhase) => void;
  children: React.ReactNode;
}

export default function LogoAnimation({
  animRef,
  mode,
  autoPlay,
  interactive,
  isPaused,
  isOffscreen,
  reducedMotion,
  syncPhase,
  children,
}: LogoAnimationProps) {
  const rootGroupRef = useRef<THREE.Group>(null);

  useFrame((_, rawDelta) => {
    const state = animRef.current;
    // Clamp delta to avoid huge jumps when tab regains focus
    const delta = Math.min(rawDelta, 0.05);

    if (
      !reducedMotion &&
      !isPaused &&
      !isOffscreen &&
      (mode === 'intro' ? autoPlay || state.elapsed >= PHASE_WINDOWS.PHASE_5_END : mode === 'idle' || mode === 'interactive')
    ) {
      const nextElapsed = state.elapsed + delta;
      computeAnimationSnapshot(nextElapsed, state);
      syncPhase(state.phase);
    }

    const grp = rootGroupRef.current;
    if (!grp) return;

    if (reducedMotion || mode === 'minimal') {
      grp.position.set(0, 0, 0);
      grp.rotation.set(0, 0, 0);
      return;
    }

    // Phase 1-3: subtle angled orientation so 3D depth is readable during assembly
    // Phase 4 (5.0 - 6.5s): slow, deliberate 3D reveal easing into canonical isometric pose
    const revealEase = easeInOutCubic(state.p4);
    const introRotY = -0.38 * (1 - revealEase);
    const introRotX = 0.2 * (1 - revealEase);

    // Phase 6: barely perceptible floating movement + subtle pointer tilt
    const idleFloatY =
      state.phase >= 6 ? Math.sin(state.idleTime * 0.72) * 0.032 : 0;

    // Gentle pointer response (disabled during OrbitControls full inspection so controls don't fight)
    const allowPointerTilt = interactive && mode !== 'interactive';
    const targetTiltY = allowPointerTilt && state.pointerActive ? state.pointerX * 0.11 : 0;
    const targetTiltX = allowPointerTilt && state.pointerActive ? -state.pointerY * 0.08 : 0;

    grp.position.y = THREE.MathUtils.damp(grp.position.y, idleFloatY, 4, delta);

    const targetRotY = introRotY + targetTiltY;
    const targetRotX = introRotX + targetTiltX;
    grp.rotation.y = THREE.MathUtils.damp(grp.rotation.y, targetRotY, 5, delta);
    grp.rotation.x = THREE.MathUtils.damp(grp.rotation.x, targetRotX, 5, delta);
  });

  return (
    <group ref={rootGroupRef} name="yara-logo-root">
      {children}
    </group>
  );
}
