function TeamCard({ team, selectedRank, onSelect }) {
  const isFirst = selectedRank === 'first';
  const isSecond = selectedRank === 'second';

  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-[#0f172a]/70 p-4 transition hover:border-cyan-400/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-2xl">
            {team.flag}
          </div>
          <div>
            <p className="text-base font-semibold text-white">{team.name}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{team.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`btn-secondary ${isFirst ? 'border-cyan-400/70 bg-cyan-500/15 text-cyan-100' : ''}`}
            onClick={() => onSelect('first')}
          >
            1st
          </button>
          <button
            className={`btn-secondary ${isSecond ? 'border-violet-400/70 bg-violet-500/15 text-violet-100' : ''}`}
            onClick={() => onSelect('second')}
          >
            2nd
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
