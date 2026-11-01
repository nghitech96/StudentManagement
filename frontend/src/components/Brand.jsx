export default function Brand({ compact = false }) {
  return (
    <div className={`brand${compact ? " brand-compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">S</span>
      <span className="brand-copy">
        <strong>Student</strong>
        {!compact && <small>MANAGEMENT</small>}
      </span>
    </div>
  );
}
