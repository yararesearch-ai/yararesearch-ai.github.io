interface YaraWordmarkProps {
  revealed: boolean;
  reducedMotion: boolean;
  compact?: boolean;
}

export default function YaraWordmark({
  revealed,
  reducedMotion,
  compact = false,
}: YaraWordmarkProps) {
  const isVisible = revealed || reducedMotion;

  return (
    <div
      className={[
        'yara-wordmark',
        isVisible ? 'is-visible' : '',
        reducedMotion ? 'is-reduced-motion' : '',
        compact ? 'is-compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="YARA Research"
    >
      <div className="yara-wordmark-title">YARA</div>

      <div className="yara-wordmark-sub-row">
        <span className="yara-wordmark-line yara-wordmark-line--left" aria-hidden="true" />
        <span className="yara-wordmark-sub">RESEARCH</span>
        <span className="yara-wordmark-line yara-wordmark-line--right" aria-hidden="true" />
      </div>

      <div className="yara-wordmark-underglow" aria-hidden="true" />
    </div>
  );
}
