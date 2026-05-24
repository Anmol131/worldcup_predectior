import TeamCard from './TeamCard';

function GroupCard({ group, selection = {}, onSelect }) {
  return (
    <div className="bg-glass rounded-[2rem] border border-white/10 p-6 shadow-glow transition hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">{group.title}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Pick top 2 + 3rd place</h2>
        </div>
        <div className="rounded-3xl bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">Select order</div>
      </div>

      <div className="space-y-3">
        {group.teams.map((team) => (
          <TeamCard
            key={team.code}
            team={team}
            selectedRank={
              selection.first === team.code
                ? 'first'
                : selection.second === team.code
                  ? 'second'
                  : selection.third === team.code
                    ? 'third'
                    : null
            }
            onSelect={(rank) => onSelect(group.id, team.code, rank)}
          />
        ))}
      </div>
    </div>
  );
}

export default GroupCard;
