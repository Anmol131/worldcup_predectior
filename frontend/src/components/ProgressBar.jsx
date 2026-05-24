function ProgressBar({ value, label }) {
  return (
    <div className="rounded-xl border border-[#1f2937] bg-[#0b1224] p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-[#9ca3af]">
        <span className="font-semibold uppercase tracking-[0.14em]">{label}</span>
        <span className="text-[#d1fae5]">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#1f2937]">
        <div
          className="h-full rounded-full bg-[#10b981] transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
