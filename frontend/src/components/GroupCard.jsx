const RANKS = [
  { key: 'first', label: '1', badgeClass: 'bg-[#f59e0b] text-[#111827]' },
  { key: 'second', label: '2', badgeClass: 'bg-[#94a3b8] text-[#111827]' },
  { key: 'third', label: '3', badgeClass: 'bg-[#b45309] text-[#f9fafb]' },
];

function GroupCard({ group, selection = {}, onSelect }) {
  const groupId = group?.groupId || group?.id || '';
  const groupTitle = group?.title || `Group ${groupId || '?'}`;
  const teams = Array.isArray(group?.teams) ? group.teams : [];
  const pickedCount = [selection.first, selection.second, selection.third].filter(Boolean).length;
  const isComplete = pickedCount === 3;
  const topBorderColor = isComplete ? '#10b981' : '#334155';

  const getSelectedRank = (teamCode) => {
    if (selection.first === teamCode) return RANKS[0];
    if (selection.second === teamCode) return RANKS[1];
    if (selection.third === teamCode) return RANKS[2];
    return null;
  };

  const handleTeamClick = (teamCode) => {
    onSelect(groupId, teamCode);
  };

  return (
    <div
      className="rounded-[1.5rem] border border-white/10 bg-[#0d1324]/90 p-4 shadow-glow backdrop-blur-xl transition duration-200"
      style={{ borderTopColor: topBorderColor, borderTopWidth: 4 }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">Group {groupId || '?'}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{groupTitle}</h2>
        </div>

        <span className={`inline-flex min-h-[32px] items-center rounded-full px-3 text-xs font-semibold uppercase tracking-[0.18em] ${isComplete ? 'bg-[#10b981]/20 text-[#34d399]' : 'bg-white/5 text-[#cbd5e1]'}`}>
          {isComplete ? 'Locked' : 'Pending'}
        </span>
      </div>

      <div className="space-y-2">
        {teams.map((team) => {
          const selectedRank = getSelectedRank(team.code);
          const canSelect = Boolean(selectedRank) || pickedCount < 3;

          return (
            <button
              key={team.code}
              type="button"
              onClick={() => handleTeamClick(team.code)}
              disabled={!canSelect}
              className={`flex w-full items-center justify-between gap-2.5 rounded-[1rem] border px-2.5 py-2.5 text-left transition duration-200 active:scale-[0.99] ${selectedRank ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/8 bg-white/[0.03] hover:border-cyan-300/25 hover:bg-white/[0.06]'} ${!canSelect ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#111827] text-[1.45rem] leading-none shadow-sm" aria-label={team.name} title={team.name}>
                  {team.flag || '⚽'}
                </span>
                <div>
                  <p className="text-[0.94rem] font-semibold text-white sm:text-sm">{team.name}</p>
                </div>
              </div>

              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${selectedRank ? `${selectedRank.badgeClass} border-transparent` : 'border-white/15 text-[#64748b]'}`}
              >
                {selectedRank ? selectedRank.label : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GroupCard;
