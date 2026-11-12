'use client';

import React, {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import YaraWordmark from './YaraWordmark';
import {
  useLogoAnimation,
  usePrefersReducedMotion,
  useWebGLAvailable,
  type LogoMode,
  type LogoPhase,
} from '../../hooks/useLogoAnimation';
import '../../styles/yara-logo.css';

const LazyYaraLogoScene = lazy(() => import('./YaraLogoScene'));

export interface YaraLogo3DProps {
  mode?: LogoMode;
  autoPlay?: boolean;
  interactive?: boolean;
  showWordmark?: boolean;
  background?: string;
  className?: string;
  height?: string | number;
  enablePostProcessing?: boolean;
  enableScrollDepth?: boolean;
  showControls?: boolean;
  compact?: boolean;
  reducedMotion?: boolean;
  onPhaseChange?: (phase: LogoPhase) => void;
  onReady?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function StaticLogoFallback({
  showWordmark,
  compact,
}: {
  showWordmark: boolean;
  compact: boolean;
}) {
  return (
    <div className="yara-logo-fallback" role="img" aria-label="YARA Research 3D Cube Logo">
      <svg
        className="yara-logo-fallback-svg"
        viewBox="460 120 616 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="yaraFallbackEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8ffff0" />
            <stop offset="0.45" stopColor="#00e5a3" />
            <stop offset="1" stopColor="#008e78" />
          </linearGradient>
          <linearGradient id="yaraFallbackY" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#bafff2" stopOpacity="0.96" />
            <stop offset="0.35" stopColor="#00f0bd" stopOpacity="0.92" />
            <stop offset="1" stopColor="#007366" stopOpacity="0.86" />
          </linearGradient>
          <radialGradient id="yaraFallbackNode" cx="32%" cy="25%" r="78%">
            <stop offset="0" stopColor="#e2fff9" />
            <stop offset="0.3" stopColor="#55ffe0" />
            <stop offset="0.7" stopColor="#00dca8" />
            <stop offset="1" stopColor="#008b78" />
          </radialGradient>
        </defs>
        <path
          d="M768 174 L582 277 L768 382 L954 277 Z"
          stroke="url(#yaraFallbackEdge)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M582 277 L585 478 L768 572 L951 478 L954 277"
          stroke="url(#yaraFallbackEdge)"
          strokeOpacity="0.78"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M768 174 L768 382"
          stroke="#00b995"
          strokeOpacity="0.28"
          strokeWidth="2.5"
        />
        <path
          d="M600 286 L659 284 L768 352 L877 284 L936 286 L789 390 L789 540 L747 540 L747 390 Z"
          fill="url(#yaraFallbackY)"
          stroke="#75ffe4"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        {[
          [768, 174, 28],
          [582, 277, 28],
          [954, 277, 28],
          [585, 478, 25],
          [951, 478, 25],
          [768, 572, 29],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="url(#yaraFallbackNode)" />
        ))}
      </svg>
      {showWordmark && <YaraWordmark revealed={true} reducedMotion={true} compact={compact} />}
    </div>
  );
}

export default function YaraLogo3D({
  mode = 'intro',
  autoPlay = true,
  interactive = true,
  showWordmark = true,
  background = '#000000',
  className = '',
  height = 'clamp(460px, 72vh, 720px)',
  enablePostProcessing = true,
  enableScrollDepth = false,
  showControls = true,
  compact = false,
  reducedMotion: reducedMotionProp,
  onPhaseChange,
  onReady,
}: YaraLogo3DProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);
  const [inspectEnabled, setInspectEnabled] = useState(mode === 'interactive');
  const [resetSignal, setResetSignal] = useState(0);
  const [replaySignal, setReplaySignal] = useState(0);

  const reducedMotion = usePrefersReducedMotion(reducedMotionProp);
  const webglAvailable = useWebGLAvailable();

  const {
    animRef,
    wordmarkRevealed,
    isPaused,
    togglePause,
    replay,
    syncPhase,
  } = useLogoAnimation({
    mode,
    autoPlay,
    reducedMotion,
    onPhaseChange,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setInspectEnabled(mode === 'interactive');
  }, [mode]);

  // Responsive mobile detection
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Efficient background processing: pause offscreen WebGL loop & hidden tab
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let skippedByViewport = false;
    let hiddenByTab = typeof document !== 'undefined' ? document.hidden : false;

    const syncOffscreen = () => {
      setIsOffscreen(skippedByViewport || hiddenByTab);
    };

    const onVisibility = () => {
      hiddenByTab = document.hidden;
      syncOffscreen();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const hasContentVisibility =
      typeof document !== 'undefined' &&
      'contentVisibility' in document.documentElement.style;

    let observer: IntersectionObserver | null = null;

    const onContentVisibilityChange = (event: Event) => {
      const cvEvent = event as Event & { skipped?: boolean };
      if (typeof cvEvent.skipped === 'boolean') {
        skippedByViewport = cvEvent.skipped;
        syncOffscreen();
      }
    };

    if (hasContentVisibility) {
      el.addEventListener(
        'contentvisibilityautostatechange',
        onContentVisibilityChange
      );
    } else if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            skippedByViewport = !entry.isIntersecting;
            syncOffscreen();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(el);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (hasContentVisibility) {
        el.removeEventListener(
          'contentvisibilityautostatechange',
          onContentVisibilityChange
        );
      }
      observer?.disconnect();
    };
  }, []);

  // Optional scroll-driven depth transition
  useEffect(() => {
    if (!enableScrollDepth || reducedMotion || typeof window === 'undefined') {
      animRef.current.scrollProgress = 0;
      return;
    }

    const onScroll = () => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, rect.height * 0.75))
      );
      animRef.current.scrollProgress = progress;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [enableScrollDepth, reducedMotion, animRef]);

  const handleReplay = useCallback(() => {
    setInspectEnabled(mode === 'interactive');
    replay();
    setReplaySignal((s) => s + 1);
  }, [mode, replay]);

  const handleResetCamera = useCallback(() => {
    setResetSignal((s) => s + 1);
  }, []);

  const canAnimate = !reducedMotion && mode !== 'minimal';
  const showPersistentControls =
    showControls && (interactive || canAnimate);

  const stageStyle = {
    '--yara-logo-bg': background,
    height: typeof height === 'number' ? `${height}px` : height,
  } as React.CSSProperties;

  const fallbackUI = (
    <StaticLogoFallback showWordmark={showWordmark} compact={compact} />
  );

  return (
    <section
      ref={stageRef}
      className={['yara-logo-stage', className].filter(Boolean).join(' ')}
      style={stageStyle}
      aria-label="YARA Research interactive 3D identity"
    >
      <div className="yara-logo-canvas-wrap">
        {!mounted || webglAvailable === null ? (
          <div className="yara-logo-loading" role="status" aria-label="Loading 3D logo">
            <span className="yara-logo-loading-dot" />
          </div>
        ) : webglAvailable === false ? (
          fallbackUI
        ) : (
          <WebGLErrorBoundary fallback={fallbackUI}>
            <Suspense
              fallback={
                <div className="yara-logo-loading" role="status" aria-label="Loading 3D scene">
                  <span className="yara-logo-loading-dot" />
                </div>
              }
            >
              <LazyYaraLogoScene
                animRef={animRef}
                mode={mode}
                autoPlay={autoPlay}
                interactive={interactive}
                inspectEnabled={interactive && inspectEnabled}
                background={background}
                enablePostProcessing={enablePostProcessing}
                isMobile={isMobile}
                isPaused={isPaused}
                isOffscreen={isOffscreen}
                reducedMotion={reducedMotion}
                resetSignal={resetSignal}
                replaySignal={replaySignal}
                syncPhase={syncPhase}
                onReady={onReady}
              />
            </Suspense>
          </WebGLErrorBoundary>
        )}
      </div>

      {showWordmark && webglAvailable !== false && (
        <YaraWordmark
          revealed={wordmarkRevealed || mode !== 'intro'}
          reducedMotion={reducedMotion}
          compact={compact}
        />
      )}

      {showPersistentControls && webglAvailable !== false && (
        <div className="yara-logo-controls" role="toolbar" aria-label="3D logo controls">
          {canAnimate && (
            <button
              type="button"
              className="yara-logo-btn"
              onClick={togglePause}
              title={isPaused ? 'Resume animation' : 'Pause animation'}
            >
              {isPaused ? 'Play' : 'Pause'}
            </button>
          )}
          {mode === 'intro' && !reducedMotion && (
            <button
              type="button"
              className="yara-logo-btn"
              onClick={handleReplay}
              title="Replay intro sequence"
            >
              Replay
            </button>
          )}
          {interactive && (
            <button
              type="button"
              className="yara-logo-btn"
              data-active={inspectEnabled ? 'true' : 'false'}
              aria-pressed={inspectEnabled}
              onClick={() => setInspectEnabled((v) => !v)}
              title="Toggle 3D orbit inspection"
            >
              {inspectEnabled ? 'Inspecting 3D' : 'Inspect 3D'}
            </button>
          )}
          {interactive && inspectEnabled && (
            <button
              type="button"
              className="yara-logo-btn"
              onClick={handleResetCamera}
              title="Reset camera to default isometric view"
            >
              Reset View
            </button>
          )}
        </div>
      )}
    </section>
  );
}
