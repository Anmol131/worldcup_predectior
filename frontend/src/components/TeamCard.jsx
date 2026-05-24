const rankStyles = {
  first: 'bg-[#f59e0b] text-[#111827] border-[#f59e0b]',
  second: 'bg-[#94a3b8] text-[#111827] border-[#94a3b8]',
  third: 'bg-[#b45309] text-[#f9fafb] border-[#b45309]',
};

function TeamCard({ team, selectedRank, onSelect }) {
  const isFirst = selectedRank === 'first';
  const isSecond = selectedRank === 'second';
  const isThird = selectedRank === 'third';
  const rowAccent = isFirst ? 'border-l-[#f59e0b]' : isSecond ? 'border-l-[#94a3b8]' : isThird ? 'border-l-[#b45309]' : 'border-l-transparent';

  const rankButtonClass = (rank, selected) => {
    if (selected) {
      return `min-h-[44px] rounded-[20px] border px-3 text-xs font-semibold uppercase tracking-wide transition duration-200 active:scale-95 ${rankStyles[rank]}`;
    }
    return 'min-h-[44px] rounded-[20px] border border-[#374151] bg-[#0b1224] px-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af] transition duration-200 hover:border-[#4b5563] active:scale-95';
  };

  return (
    <div className={`rounded-xl border border-[#1f2937] border-l-4 ${rowAccent} bg-[#0c1426] p-3 transition duration-200`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#1f2937] bg-[#111827] text-[28px] leading-none">
            {team.flag}
          </div>
          <div>
            <p className="text-base font-bold text-[#f9fafb]">{team.name}</p>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6b7280]">{team.code}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className={rankButtonClass('first', isFirst)}
            onClick={() => onSelect('first')}
          >
            1st
          </button>
          <button
            type="button"
            className={rankButtonClass('second', isSecond)}
            onClick={() => onSelect('second')}
          >
            2nd
          </button>
          <button
            type="button"
            className={rankButtonClass('third', isThird)}
            onClick={() => onSelect('third')}
          >
            3rd
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
