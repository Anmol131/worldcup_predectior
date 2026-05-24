import { motion } from 'framer-motion';

function MatchCard({ match, onPick }) {
  const ready = match.home.code && match.away.code;

  return (
    <motion.div
      layout
      className="group rounded-[2rem] border border-white/10 bg-[#111827]/90 p-4 shadow-glow transition hover:-translate-y-1 hover:border-cyan-400/30"
    >
      <div className="mb-4 flex items-center justify-between text-sm uppercase tracking-[0.24em] text-slate-500">
        <span>{match.id.replace('-', ' ').toUpperCase()}</span>
        <span>{match.round}</span>
      </div>

      <div className="space-y-3">
        {[match.home, match.away].map((team, index) => {
          const selected = match.winner === team.code;
          const placeholder = !team.code;
          return (
            <button
              key={`${match.id}-${index}`}
              type="button"
              disabled={!ready}
              onClick={() => onPick(match.id, team.code)}
              className={`w-full rounded-3xl border px-4 py-3 text-left transition ${placeholder ? 'cursor-not-allowed border-white/5 bg-white/5 text-slate-500' : selected ? 'border-cyan-400/90 bg-cyan-500/10 text-cyan-100 shadow-glow' : 'border-white/10 bg-white/5 text-slate-100 hover:border-cyan-400/40 hover:bg-cyan-500/5'}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{team.flag}</span>
                <div>
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{team.code || 'TBD'}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default MatchCard;
