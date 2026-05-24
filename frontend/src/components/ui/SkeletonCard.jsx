function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-[#1f2937] bg-[#111827] p-4 shadow-glow">
      <div className="mb-4 h-4 w-24 rounded bg-white/10" />
      <div className="mb-3 h-6 w-40 rounded bg-white/10" />
      <div className="space-y-3">
        <div className="h-16 rounded-lg bg-white/10" />
        <div className="h-16 rounded-lg bg-white/10" />
        <div className="h-16 rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

export default SkeletonCard;