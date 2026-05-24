import { useMemo, useState } from 'react';
import TeamCard from './TeamCard';

function GroupCard({ group, selection = {}, onSelect, disabled = false }) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [draftOrder, setDraftOrder] = useState([]);
  const pickedCount = [selection.first, selection.second, selection.third].filter(Boolean).length;
  const isComplete = pickedCount === 3;
  const accentColors = ['#10b981', '#6366f1', '#f59e0b', '#22c55e'];
  const topBorderColor = accentColors[group.id.charCodeAt(0) % accentColors.length];

  const selectedTeams = useMemo(
    () => [
      group.teams.find((team) => team.code === selection.first),
      group.teams.find((team) => team.code === selection.second),
      group.teams.find((team) => team.code === selection.third),
    ],
    [group.teams, selection.first, selection.second, selection.third],
  );

  const toggleDraftTeam = (teamCode) => {
    if (draftOrder.includes(teamCode)) {
      setDraftOrder(draftOrder.filter((code) => code !== teamCode));
      return;
    }
    if (draftOrder.length >= 3) {
      return;
    }
    setDraftOrder([...draftOrder, teamCode]);
  };

  const applyDraftOrder = () => {
    if (draftOrder.length !== 3) {
      return;
    }
    const rankOrder = ['first', 'second', 'third'];
    draftOrder.forEach((teamCode, index) => {
      onSelect(group.id, teamCode, rankOrder[index]);
    });
    setIsSelectorOpen(false);
  };

  const selectorContent = (
    <>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9ca3af]">Quick select 1st/2nd/3rd</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {group.teams.map((team) => {
          const idx = draftOrder.indexOf(team.code);
          return (
            <button
              key={`${group.id}-${team.code}-order`}
              type="button"
              onClick={() => toggleDraftTeam(team.code)}
                disabled={disabled}
              className={`min-h-[44px] rounded-lg border px-3 py-2 text-left transition duration-200 active:scale-95 ${idx >= 0 ? 'border-[#10b981] bg-[#10b981]/15 text-[#d1fae5]' : 'border-[#374151] bg-[#111827] text-[#e5e7eb]'}`}
            >
              <span className="mr-2 text-lg leading-none">{team.flag}</span>
              {team.name}
              {idx >= 0 && <span className="ml-2 rounded-full bg-[#10b981] px-2 py-0.5 text-xs font-bold text-[#06231b]">{idx + 1}</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={() => setIsSelectorOpen(false)}>
          Close
        </button>
        <button
          type="button"
          className={`btn-primary ${draftOrder.length !== 3 ? 'cursor-not-allowed opacity-60' : ''}`}
          onClick={applyDraftOrder}
          disabled={draftOrder.length !== 3 || disabled}
        >
          Apply Order
        </button>
      </div>
    </>
  );

  return (
    <div
      className="rounded-xl border border-[#1f2937] bg-[#111827] p-4 shadow-glow transition duration-200"
      style={{ borderTopColor: topBorderColor, borderTopWidth: 4 }}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#6b7280]">GROUP {group.id}</p>
          <h2 className="mt-1 text-2xl font-bold text-[#f9fafb]">{group.title}</h2>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => {
              if (!isSelectorOpen) {
                setDraftOrder([selection.first, selection.second, selection.third].filter(Boolean));
              }
              setIsSelectorOpen((prev) => !prev);
            }}
            className="min-h-[44px] rounded-lg border border-[#374151] bg-[#0b1224] px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#d1d5db] transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
          >
            Select Order
          </button>

          {isComplete ? (
            <span className="inline-flex min-h-[32px] items-center rounded-[20px] bg-[#10b981]/20 px-3 text-xs font-semibold text-[#34d399]">
              ✓ Complete
            </span>
          ) : (
            <span className="inline-flex min-h-[32px] items-center rounded-[20px] border border-[#374151] bg-[#0b1224] px-3 text-xs font-semibold text-[#9ca3af]">
              {pickedCount}/3 picked
            </span>
          )}
        </div>
      </div>

      {isSelectorOpen && <div className="relative z-10 mb-4 hidden rounded-xl border border-[#1f2937] bg-[#0b1224] p-3 sm:block">{selectorContent}</div>}

      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-3 sm:hidden">
          <div className="w-full rounded-t-2xl border border-[#1f2937] bg-[#0b1224] p-4 shadow-2xl">
            {selectorContent}
          </div>
        </div>
      )}

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
              disabled={disabled}
              isSaving={disabled}
          />
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-[#1f2937] bg-[#0b1224] p-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="wc-chip">🥇 {selectedTeams[0]?.name || 'TBD'}</span>
          <span className="wc-chip">🥈 {selectedTeams[1]?.name || 'TBD'}</span>
          <span className="wc-chip">🥉 {selectedTeams[2]?.name || 'TBD'}</span>
        </div>
      </div>
    </div>
  );
}

export default GroupCard;
