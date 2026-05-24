import { motion } from 'framer-motion';

function MatchCard({ match, onPick, showConnector = false, showIncoming = false, className = '' }) {
  const ready = match.home.code && match.away.code;

  const getBadge = (team) => {
    if (team.flag && team.flag !== '⛳') {
      return <span className="text-lg leading-none">{team.flag}</span>;
    }
    return <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-300">{(team.code || 'TBD').slice(0, 2)}</span>;
  };

  return (
    <motion.div
      layout
      className={`group relative w-[190px] rounded-3xl border border-white/10 bg-[#111827]/90 p-3 shadow-glow transition hover:border-cyan-400/30 ${className}`}
    >
      {showIncoming && (
        <div className="pointer-events-none absolute -left-5 top-1/2 h-12 w-5 -translate-y-1/2 border-l border-t border-b border-slate-500/40" />
      )}
      {showConnector && <div className="pointer-events-none absolute -right-6 top-1/2 h-px w-6 -translate-y-1/2 bg-slate-500/50" />}

      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-500">
        <span>{match.id.toUpperCase()}</span>
        <span>{match.round.replace('Round of ', 'R')}</span>
      </div>

      <div className="space-y-2">
        {[match.home, match.away].map((team, index) => {
          const selected = match.winner === team.code;
          const placeholder = !team.code;
          const loser = !!match.winner && !selected;
          return (
            <button
              key={`${match.id}-${index}`}
              type="button"
              disabled={!ready || placeholder}
              onClick={() => onPick(match.id, team.code)}
              className={`relative w-full rounded-2xl border px-3 py-2 text-left transition ${placeholder ? 'cursor-not-allowed border-dashed border-white/20 bg-white/5 text-slate-500' : selected ? 'border-emerald-400/80 bg-emerald-500/15 text-emerald-100 shadow-glow' : 'border-white/10 bg-white/5 text-slate-100 hover:border-cyan-400/40 hover:bg-cyan-500/5'} ${loser ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">{getBadge(team)}</span>
                <div>
                  <p className={`text-sm ${selected ? 'font-bold' : 'font-medium'}`}>{placeholder ? 'TBD' : team.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{team.code || 'TBD'}</p>
                </div>
              </div>
              {!placeholder && ready && !selected && (
                <span className="pointer-events-none absolute right-2 top-2 text-[9px] uppercase tracking-[0.16em] text-emerald-200 opacity-0 transition group-hover:opacity-100">
                  Select winner
                </span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default MatchCard;
