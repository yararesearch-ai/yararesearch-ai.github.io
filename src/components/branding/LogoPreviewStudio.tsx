'use client';

import { useCallback, useState } from 'react';
import YaraLogo3D from './YaraLogo3D';
import type { LogoPaletteName } from './cubeMath';
import type { LogoMode, LogoPhase } from '../../hooks/useLogoAnimation';

const PHASE_LABELS: Record<LogoPhase, { time: string; title: string }> = {
  1: { time: '0.0–1.5s', title: 'Nodes Emerge' },
  2: { time: '1.5–3.5s', title: 'Cube Assembly' },
  3: { time: '3.5–5.0s', title: 'Y Formation' },
  4: { time: '5.0–6.5s', title: '3D Reveal' },
  5: { time: '6.5–8.0s', title: 'Wordmark Reveal' },
  6: { time: '8.0s+', title: 'Idle Equilibrium' },
};

const MODES: { id: LogoMode; label: string; desc: string }[] = [
  { id: 'intro', label: 'Intro', desc: 'Full 8s assembly sequence' },
  { id: 'idle', label: 'Idle', desc: 'Assembled breathing state' },
  { id: 'interactive', label: 'Interactive', desc: 'OrbitControls 3D inspection' },
  { id: 'minimal', label: 'Minimal', desc: 'Lightweight low-power presentation' },
];

export default function LogoPreviewStudio() {
  const [mode, setMode] = useState<LogoMode>('intro');
  const [palette, setPalette] = useState<LogoPaletteName>('brand');
  const [phase, setPhase] = useState<LogoPhase>(1);
  const [showWordmark, setShowWordmark] = useState(true);
  const [enablePostProcessing, setEnablePostProcessing] = useState(true);
  const [simulateReducedMotion, setSimulateReducedMotion] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);

  const handlePhaseChange = useCallback((nextPhase: LogoPhase) => {
    setPhase(nextPhase);
  }, []);

  const handleSelectMode = (nextMode: LogoMode) => {
    setMode(nextMode);
    if (nextMode === 'intro') {
      setPhase(1);
      setInstanceKey((k) => k + 1);
    } else {
      setPhase(6);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#F4F7F6] pt-16">
      {/* Primary 3D Evaluation Stage */}
      <div className="relative border-b border-white/10">
        <YaraLogo3D
          key={instanceKey}
          mode={mode}
          palette={palette}
          autoPlay={true}
          interactive={true}
          showWordmark={showWordmark}
          background="#000000"
          height="clamp(480px, 74vh, 760px)"
          enablePostProcessing={enablePostProcessing}
          reducedMotion={simulateReducedMotion ? true : undefined}
          onPhaseChange={handlePhaseChange}
        />
      </div>

      {/* Independent Evaluation Controls & Phase Inspector */}
      <section
        aria-label="Logo evaluation controls"
        className="mx-auto max-w-6xl px-5 py-8 space-y-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#00E5A3]">
              YARA Research · Identity Evaluation Studio
            </p>
            <h1 className="mt-1 font-display text-2xl font-light tracking-tight text-white">
              Interactive 3D Cube &amp; Integrated Y Mark
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('intro');
                setPhase(1);
                setInstanceKey((k) => k + 1);
              }}
              className="rounded-md border border-[#00E5A3]/40 bg-[#00E5A3]/10 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#B8FFF0] transition hover:bg-[#00E5A3]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00E5A3]"
            >
              Restart 8s Intro
            </button>
          </div>
        </div>

        {/* Phase Timeline Strip */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {([1, 2, 3, 4, 5, 6] as LogoPhase[]).map((p) => {
            const active = phase === p;
            const completed = phase > p;
            return (
              <div
                key={p}
                className={[
                  'rounded-lg border px-3 py-2.5 transition-colors',
                  active
                    ? 'border-[#00E5A3] bg-[#00E5A3]/10'
                    : completed
                    ? 'border-[#00B98F]/35 bg-[#001812]'
                    : 'border-white/10 bg-[#050808]',
                ].join(' ')}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                  <span className={active ? 'text-[#00E5A3]' : 'text-white/50'}>
                    Phase {p}
                  </span>
                  <span className="text-white/40">{PHASE_LABELS[p].time}</span>
                </div>
                <div className="mt-1 text-xs font-medium text-white/90">
                  {PHASE_LABELS[p].title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mode & Configuration Controls */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#050808] p-4 lg:col-span-2">
            <div className="font-mono text-xs uppercase tracking-wider text-white/60">
              Component Mode
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {MODES.map((m) => {
                const selected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMode(m.id)}
                    aria-pressed={selected}
                    className={[
                      'rounded-lg border px-3.5 py-2.5 text-left transition',
                      selected
                        ? 'border-[#00E5A3] bg-[#00E5A3]/10'
                        : 'border-white/10 bg-black/50 hover:border-white/25',
                    ].join(' ')}
                  >
                    <div className="font-mono text-xs uppercase tracking-wider text-[#00E5A3]">
                      {m.label}
                    </div>
                    <div className="mt-0.5 text-xs text-white/70">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#050808] p-4 space-y-3">
            <div className="font-mono text-xs uppercase tracking-wider text-white/60">
              Scene Options
            </div>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-xs">
              <span>Website Brand Palette (Blue / Cyan)</span>
              <input
                type="checkbox"
                checked={palette === 'brand'}
                onChange={(e) => setPalette(e.target.checked ? 'brand' : 'teal')}
                className="accent-[#5B9CFF]"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-xs">
              <span>Show Wordmark</span>
              <input
                type="checkbox"
                checked={showWordmark}
                onChange={(e) => setShowWordmark(e.target.checked)}
                className="accent-[#00E5A3]"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-xs">
              <span>Selective Bloom &amp; Postprocessing</span>
              <input
                type="checkbox"
                checked={enablePostProcessing}
                onChange={(e) => setEnablePostProcessing(e.target.checked)}
                className="accent-[#00E5A3]"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-xs">
              <span>Simulate Reduced Motion</span>
              <input
                type="checkbox"
                checked={simulateReducedMotion}
                onChange={(e) => setSimulateReducedMotion(e.target.checked)}
                className="accent-[#00E5A3]"
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
