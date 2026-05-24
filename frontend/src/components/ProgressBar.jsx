function ProgressBar({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glow">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
        <span className="font-medium text-white">Progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default ProgressBar;
