import MatchCard from './MatchCard';

function Bracket({ rounds, onPick }) {
  return (
    <div className="overflow-x-auto pb-10">
      <div className="grid gap-6 lg:grid-cols-5">
        {rounds.map((round) => (
          <div key={round.title} className="space-y-5 min-w-[280px]">
            <div className="rounded-[2rem] bg-glass p-5 text-center text-sm uppercase tracking-[0.28em] text-slate-400 shadow-glow">
              {round.title}
            </div>
            <div className="space-y-5">
              {round.matches.map((match) => (
                <MatchCard key={match.id} match={match} onPick={onPick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bracket;
