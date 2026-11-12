import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import CubeGeometry from './CubeGeometry';
import YGeometry from './YGeometry';
import ConnectionNodes from './ConnectionNodes';
import LogoLighting from './LogoLighting';
import LogoAnimation from './LogoAnimation';
import LogoCamera from './LogoCamera';
import type {
  LogoAnimationState,
  LogoMode,
  LogoPhase,
} from '../../hooks/useLogoAnimation';

export interface YaraLogoSceneProps {
  animRef: React.MutableRefObject<LogoAnimationState>;
  mode: LogoMode;
  autoPlay: boolean;
  interactive: boolean;
  inspectEnabled: boolean;
  background: string;
  enablePostProcessing: boolean;
  isMobile: boolean;
  isPaused: boolean;
  isOffscreen: boolean;
  reducedMotion: boolean;
  resetSignal: number;
  replaySignal: number;
  syncPhase: (phase: LogoPhase) => void;
  onReady?: () => void;
}

function SceneLifecycleHelper({
  mode,
  reducedMotion,
  replaySignal,
  onReady,
}: {
  mode: LogoMode;
  reducedMotion: boolean;
  replaySignal: number;
  onReady?: () => void;
}) {
  const { invalidate } = useThree();

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    invalidate();
  }, [mode, reducedMotion, replaySignal, invalidate]);

  return null;
}

export default function YaraLogoScene({
  animRef,
  mode,
  autoPlay,
  interactive,
  inspectEnabled,
  background,
  enablePostProcessing,
  isMobile,
  isPaused,
  isOffscreen,
  reducedMotion,
  resetSignal,
  replaySignal,
  syncPhase,
  onReady,
}: YaraLogoSceneProps) {
  const isMinimal = mode === 'minimal';
  const usePostProcessing = enablePostProcessing && !isMinimal && !isMobile;

  // Pause continuous rendering when offscreen, paused, reduced-motion, or minimal static mode
  const continuousLoop =
    !reducedMotion &&
    !isPaused &&
    !isOffscreen &&
    (!isMinimal || inspectEnabled);

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      frameloop={continuousLoop ? 'always' : 'demand'}
      camera={{ fov: 28, near: 0.1, far: 100, position: [0, 0, 11.2] }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        localClippingEnabled: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      onPointerMove={(e) => {
        if (!interactive) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        animRef.current.pointerX = THREE.MathUtils.clamp(nx, -1, 1);
        animRef.current.pointerY = THREE.MathUtils.clamp(ny, -1, 1);
        animRef.current.pointerActive = true;
      }}
      onPointerLeave={() => {
        animRef.current.pointerActive = false;
        animRef.current.hoveredNodeIndex = null;
      }}
    >
      <color attach="background" args={[background]} />

      <SceneLifecycleHelper
        mode={mode}
        reducedMotion={reducedMotion}
        replaySignal={replaySignal}
        onReady={onReady}
      />

      {/* Procedural dark-lab studio reflections (zero external HDRI requests) */}
      {!isMinimal && (
        <Environment resolution={128} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.4}
            color="#eafffa"
            scale={[6, 2.5, 1]}
            position={[-4, 4, 4]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            color="#00e5a3"
            scale={[5, 4, 1]}
            position={[5, -1, 2]}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="ring"
            intensity={1.1}
            color="#b8fff0"
            scale={3}
            position={[0, 5, -4]}
            target={[0, 0, 0]}
          />
        </Environment>
      )}

      <LogoCamera
        animRef={animRef}
        mode={mode}
        interactive={interactive}
        inspectEnabled={inspectEnabled}
        resetSignal={resetSignal}
        reducedMotion={reducedMotion}
      />

      <LogoLighting
        animRef={animRef}
        mode={mode}
        minimal={isMinimal}
        reducedMotion={reducedMotion}
      />

      <LogoAnimation
        animRef={animRef}
        mode={mode}
        autoPlay={autoPlay}
        interactive={interactive}
        isPaused={isPaused}
        isOffscreen={isOffscreen}
        reducedMotion={reducedMotion}
        syncPhase={syncPhase}
      >
        <CubeGeometry
          animRef={animRef}
          mode={mode}
          minimal={isMinimal}
          reducedMotion={reducedMotion}
        />
        <YGeometry
          animRef={animRef}
          mode={mode}
          minimal={isMinimal}
          reducedMotion={reducedMotion}
        />
        <ConnectionNodes
          animRef={animRef}
          mode={mode}
          minimal={isMinimal}
          reducedMotion={reducedMotion}
        />
      </LogoAnimation>

      {usePostProcessing && (
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.9}
            luminanceSmoothing={0.22}
            intensity={0.42}
            radius={0.62}
          />
          <Vignette eskil={false} offset={0.28} darkness={0.48} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
