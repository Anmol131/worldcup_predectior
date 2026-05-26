import { motion } from 'framer-motion';
import { useToast } from './ui/Toast';

function MatchCard({
  match,
  onPick,
  className = '',
  compact = false,
  pathLabel,
  highlightFinal = false,
  isSaving = false,
}) {
  const { showToast } = useToast();
  const ready = Boolean(match.home.code) && Boolean(match.away.code);
  const winnerName = [match.home, match.away].find((team) => team.code === match.winner)?.name;
  const isTBD = (team) => !team || team.code === 'TBD' || !team.name;
  const isPlayable = !isTBD(match.home) && !isTBD(match.away);

  const getBadge = (team) => {
    if (!team.code) {
      return <span className="text-base leading-none">⚽</span>;
    }
    if (team.flag && team.flag !== '⛳') {
      return <span className="text-2xl leading-none">{team.flag}</span>;
    }
    return <span className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">{(team.code || 'TBD').slice(0, 2)}</span>;
  };

  const roundLabel = match.round === 'Round of 32'
    ? 'R32'
    : match.round === 'Round of 16'
      ? 'R16'
      : match.round === 'Quarter Finals'
        ? 'QF'
        : match.round === 'Semi Finals'
          ? 'SF'
          : 'Final';

  const waitingSelection = ready && !match.winner;

  const handlePickWinner = (winnerCode) => {
    if (!isPlayable) {
      showToast('⏳ Wait for previous round results before picking this match', 'info');
      return;
    }

    if (onPick) {
      onPick(match.id, winnerCode);
    }
  };

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.98 }}
      animate={{ scale: match.winner ? 0.985 : 1 }}
      className={`relative overflow-hidden rounded-xl border bg-[#111827] p-3 transition duration-200 ${compact ? 'w-[180px]' : 'w-full'} ${waitingSelection ? 'border-[#10b981]/70 shadow-[0_0_0_1px_rgba(16,185,129,0.4),0_0_16px_rgba(16,185,129,0.18)]' : 'border-[#1f2937]'} ${highlightFinal ? 'border-[#f59e0b] shadow-[0_0_18px_rgba(245,158,11,0.35)]' : ''} ${!isPlayable ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      {isSaving && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b1224]/80 text-sm font-semibold text-cyan-100 backdrop-blur-sm">
          Saving...
        </div>
      )}

      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
        <span>{roundLabel} · Match {match.id.slice(-2)}</span>
        <span>{pathLabel || 'Path A'}</span>
      </div>

      <div className="relative space-y-2">
        {[match.home, match.away].map((team, index) => {
          const selected = match.winner === team.code;
          const placeholder = isTBD(team);
          const loser = !!match.winner && !selected;
          const disabled = !ready || placeholder || !onPick || !isPlayable;
          const title = !ready
            ? 'Waiting for previous round results'
            : placeholder
              ? 'Previous round must be completed first'
              : undefined;

          return (
            <button
              key={`${match.id}-${index}`}
              type="button"
              disabled={disabled}
              title={title}
              onClick={() => handlePickWinner(team.code)}
              className={`group relative min-h-[56px] w-full rounded-lg border px-3 py-2 text-left transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${placeholder ? 'border-dashed border-[#374151] bg-[#0b1224] text-[#6b7280]' : selected ? 'border-[#10b981] border-l-4 bg-[#10b981]/15 text-[#d1fae5]' : 'border-[#1f2937] bg-[#0b1224] text-[#f9fafb]'} ${loser ? 'opacity-40 hover:border-[#374151] hover:bg-[#0f1720]' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f2937] bg-[#111827]">{getBadge(team)}</span>
                  <div>
                    <p className={`text-sm ${selected ? 'font-bold' : 'font-semibold'}`}>{placeholder ? 'TBD' : team.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#6b7280]">{team.code || 'TBD'}</p>
                  </div>
                </div>

                {!placeholder && !selected && isPlayable && ready && (
                  <span className="rounded-[20px] border border-[#374151] bg-[#111827] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Select ›
                  </span>
                )}

                {placeholder && (
                  <span className="rounded-[20px] border border-[#374151] bg-[#111827] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    ⏳ TBD
                  </span>
                )}

                {selected && (
                  <span className="rounded-[20px] bg-[#10b981] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#06231b]">
                    ✓ Winner
                  </span>
                )}
              </div>

              {loser && ready && !placeholder && (
                <div className="mt-2 text-[10px] text-slate-500 transition duration-200 group-hover:text-slate-300">Pick instead?</div>
              )}

              {placeholder && (
                <div className="mt-2 rounded-lg border border-dashed border-[#374151] bg-[#0a0f1e] px-2 py-1 text-[11px] text-[#6b7280]">
                  Previous round must be completed first
                </div>
              )}
            </button>
          );
        })}
      </div>

      {winnerName && (
        <div className="mt-3 rounded-lg border border-[#10b981]/50 bg-[#10b981]/15 px-3 py-2 text-xs font-semibold text-[#d1fae5]">
          Winner: {winnerName}
        </div>
      )}

      {match.round === 'Final' && (
        <div className="mt-3 rounded-lg border border-[#374151] bg-[#0b1224] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[#9ca3af]">
          FINAL · July 19 · MetLife Stadium
        </div>
      )}
    </motion.div>
  );
}

export default MatchCard;
