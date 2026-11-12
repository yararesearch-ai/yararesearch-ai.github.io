import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp01 } from '../components/branding/cubeMath';

export type LogoMode = 'intro' | 'idle' | 'interactive' | 'minimal';
export type LogoPhase = 1 | 2 | 3 | 4 | 5 | 6;

export const PHASE_WINDOWS = {
  PHASE_1_END: 1.5, // Nodes emerge
  PHASE_2_END: 3.5, // Cube edges assemble
  PHASE_3_END: 5.0, // Y arms + stem + pulse
  PHASE_4_END: 6.5, // 3D reveal rotation + camera settle + floor glow
  PHASE_5_END: 8.0, // Wordmark reveal
} as const;

export interface LogoAnimationState {
  elapsed: number;
  phase: LogoPhase;
  /** 0..1 progress within each discrete phase */
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  idleTime: number;
  pointerX: number;
  pointerY: number;
  pointerActive: boolean;
  hoveredNodeIndex: number | null;
  scrollProgress: number;
}

export function getPhaseFromElapsed(elapsed: number): LogoPhase {
  if (elapsed < PHASE_WINDOWS.PHASE_1_END) return 1;
  if (elapsed < PHASE_WINDOWS.PHASE_2_END) return 2;
  if (elapsed < PHASE_WINDOWS.PHASE_3_END) return 3;
  if (elapsed < PHASE_WINDOWS.PHASE_4_END) return 4;
  if (elapsed < PHASE_WINDOWS.PHASE_5_END) return 5;
  return 6;
}

export function computeAnimationSnapshot(
  elapsed: number,
  state: LogoAnimationState
): void {
  state.elapsed = elapsed;
  state.phase = getPhaseFromElapsed(elapsed);
  state.p1 = clamp01(elapsed / PHASE_WINDOWS.PHASE_1_END);
  state.p2 = clamp01(
    (elapsed - PHASE_WINDOWS.PHASE_1_END) /
      (PHASE_WINDOWS.PHASE_2_END - PHASE_WINDOWS.PHASE_1_END)
  );
  state.p3 = clamp01(
    (elapsed - PHASE_WINDOWS.PHASE_2_END) /
      (PHASE_WINDOWS.PHASE_3_END - PHASE_WINDOWS.PHASE_2_END)
  );
  state.p4 = clamp01(
    (elapsed - PHASE_WINDOWS.PHASE_3_END) /
      (PHASE_WINDOWS.PHASE_4_END - PHASE_WINDOWS.PHASE_3_END)
  );
  state.p5 = clamp01(
    (elapsed - PHASE_WINDOWS.PHASE_4_END) /
      (PHASE_WINDOWS.PHASE_5_END - PHASE_WINDOWS.PHASE_4_END)
  );
  state.idleTime = Math.max(0, elapsed - PHASE_WINDOWS.PHASE_5_END);
}

/**
 * Detects OS/browser `prefers-reduced-motion: reduce` reactively on the client.
 */
export function usePrefersReducedMotion(override?: boolean): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(Boolean(override));

  useEffect(() => {
    if (typeof override === 'boolean') {
      setPrefersReduced(override);
      return;
    }
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [override]);

  return prefersReduced;
}

/**
 * Checks WebGL availability safely on the client.
 */
export function useWebGLAvailable(): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false });
      setAvailable(Boolean(gl));
    } catch {
      setAvailable(false);
    }
  }, []);

  return available;
}

/**
 * Tracks site dark/light theme from `<html data-theme>` and `.light` class.
 */
export function useLogoThemeMode(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sync = () => {
      const isLight =
        document.documentElement.getAttribute('data-theme') === 'light' ||
        document.documentElement.classList.contains('light');
      setTheme(isLight ? 'light' : 'dark');
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export interface UseLogoAnimationOptions {
  mode: LogoMode;
  autoPlay: boolean;
  reducedMotion: boolean;
  onPhaseChange?: (phase: LogoPhase) => void;
}

export function useLogoAnimation({
  mode,
  autoPlay,
  reducedMotion,
  onPhaseChange,
}: UseLogoAnimationOptions) {
  const skipToFinal = reducedMotion || mode !== 'intro' || !autoPlay;
  const initialElapsed = skipToFinal ? PHASE_WINDOWS.PHASE_5_END : 0;

  const animRef = useRef<LogoAnimationState>({
    elapsed: initialElapsed,
    phase: skipToFinal ? 6 : 1,
    p1: skipToFinal ? 1 : 0,
    p2: skipToFinal ? 1 : 0,
    p3: skipToFinal ? 1 : 0,
    p4: skipToFinal ? 1 : 0,
    p5: skipToFinal ? 1 : 0,
    idleTime: 0,
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
    hoveredNodeIndex: null,
    scrollProgress: 0,
  });

  const [currentPhase, setCurrentPhase] = useState<LogoPhase>(
    skipToFinal ? 6 : 1
  );
  const [wordmarkRevealed, setWordmarkRevealed] = useState<boolean>(skipToFinal);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const syncPhase = useCallback(
    (nextPhase: LogoPhase) => {
      setCurrentPhase((prev) => {
        if (prev === nextPhase) return prev;
        onPhaseChange?.(nextPhase);
        return nextPhase;
      });
      if (nextPhase >= 5) {
        setWordmarkRevealed(true);
      }
    },
    [onPhaseChange]
  );

  // Reset timeline cleanly when mode / reducedMotion / autoPlay changes
  useEffect(() => {
    const shouldSkip = reducedMotion || mode !== 'intro' || !autoPlay;
    const startAt = shouldSkip ? PHASE_WINDOWS.PHASE_5_END : 0;
    computeAnimationSnapshot(startAt, animRef.current);
    const nextPhase = animRef.current.phase;
    setCurrentPhase(nextPhase);
    setWordmarkRevealed(shouldSkip);
    onPhaseChange?.(nextPhase);
  }, [mode, autoPlay, reducedMotion, onPhaseChange]);

  const replay = useCallback(() => {
    if (reducedMotion) {
      computeAnimationSnapshot(PHASE_WINDOWS.PHASE_5_END, animRef.current);
      setCurrentPhase(6);
      setWordmarkRevealed(true);
      onPhaseChange?.(6);
      return;
    }
    setIsPaused(false);
    setWordmarkRevealed(false);
    computeAnimationSnapshot(0, animRef.current);
    setCurrentPhase(1);
    onPhaseChange?.(1);
  }, [reducedMotion, onPhaseChange]);

  const jumpToFinal = useCallback(() => {
    computeAnimationSnapshot(PHASE_WINDOWS.PHASE_5_END, animRef.current);
    setCurrentPhase(6);
    setWordmarkRevealed(true);
    onPhaseChange?.(6);
  }, [onPhaseChange]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  return {
    animRef,
    currentPhase,
    wordmarkRevealed,
    isPaused,
    setIsPaused,
    togglePause,
    replay,
    jumpToFinal,
    syncPhase,
  };
}
