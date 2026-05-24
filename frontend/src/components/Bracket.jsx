import { useMemo, useState } from 'react';
import { FaArrowRight, FaTrophy } from 'react-icons/fa';
import MatchCard from './MatchCard';

const ROUND_LABELS = {
  'Round of 32': 'R32',
  'Round of 16': 'R16',
  'Quarter Finals': 'QF',
  'Semi Finals': 'SF',
  Final: 'Final',
};

const ROUND_ORDER = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

function Bracket({ rounds, onPick, onRevealChampion }) {
  const [activeRound, setActiveRound] = useState(rounds[0]?.title || ROUND_ORDER[0]);

  const roundsByTitle = useMemo(
    () => rounds.reduce((acc, round) => ({ ...acc, [round.title]: round }), {}),
    [rounds],
  );

  const activeIndex = ROUND_ORDER.indexOf(activeRound);
  const activeRoundMatches = roundsByTitle[activeRound]?.matches || [];
  const activeComplete = activeRoundMatches.length > 0 && activeRoundMatches.every((match) => match.winner);
  const isFinalRound = activeRound === 'Final';

  const handleNextRound = () => {
    if (!activeComplete || isFinalRound) {
      return;
    }
    setActiveRound(ROUND_ORDER[Math.min(activeIndex + 1, ROUND_ORDER.length - 1)]);
  };

  const r32Matches = roundsByTitle['Round of 32']?.matches || [];
  const r16Matches = roundsByTitle['Round of 16']?.matches || [];
  const qfMatches = roundsByTitle['Quarter Finals']?.matches || [];
  const sfMatches = roundsByTitle['Semi Finals']?.matches || [];
  const finalMatch = roundsByTitle.Final?.matches?.[0];

  const pathA = r32Matches.slice(0, 8);
  const pathB = r32Matches.slice(8, 16);
  const pathA16 = r16Matches.slice(0, 4);
  const pathB16 = r16Matches.slice(4, 8);
  const pathAQf = qfMatches.slice(0, 2);
  const pathBQf = qfMatches.slice(2, 4);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto rounded-[20px] border border-[#1f2937] bg-[#111827] p-2 lg:hidden">
        {ROUND_ORDER.map((roundTitle) => (
          <button
            key={roundTitle}
            type="button"
            onClick={() => setActiveRound(roundTitle)}
            className={`whitespace-nowrap rounded-[20px] border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition duration-200 active:scale-95 ${activeRound === roundTitle ? 'border-[#10b981] text-[#d1fae5]' : 'border-transparent text-[#9ca3af]'}`}
          >
            {ROUND_LABELS[roundTitle] || roundTitle}
          </button>
        ))}
      </div>

      <div className="space-y-3 lg:hidden">
        {activeRoundMatches.map((match, index) => (
          <MatchCard
            key={match.id}
            match={match}
            onPick={onPick}
            className="w-full"
            pathLabel={index < activeRoundMatches.length / 2 ? 'Path A' : 'Path B'}
            highlightFinal={activeRound === 'Final'}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[1fr_280px_1fr] gap-5">
          <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-3">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Path A</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-2">{pathA.map((match) => <MatchCard key={match.id} match={match} onPick={onPick} compact pathLabel="Path A" />)}</div>
              <div className="space-y-6 pt-6">{pathA16.map((match) => <MatchCard key={match.id} match={match} onPick={onPick} compact pathLabel="Path A" />)}</div>
              <div className="space-y-16 pt-16">{pathAQf.map((match) => <MatchCard key={match.id} match={match} onPick={onPick} compact pathLabel="Path A" />)}</div>
              <div className="space-y-32 pt-28">{sfMatches[0] && <MatchCard match={sfMatches[0]} onPick={onPick} compact pathLabel="Path A" />}</div>
            </div>
          </div>

          <div className="relative rounded-xl border border-[#f59e0b]/50 bg-[#111827] p-4">
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 280 560" preserveAspectRatio="none" aria-hidden>
              <path d="M0,170 L70,170 L70,280 L130,280" fill="none" stroke="#1f2937" strokeWidth="1" />
              <path d="M280,390 L210,390 L210,280 L150,280" fill="none" stroke="#1f2937" strokeWidth="1" />
            </svg>
            <div className="mb-3 flex items-center justify-center gap-2 text-[#f59e0b]">
              <FaTrophy className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">Final</p>
            </div>
            {finalMatch ? <MatchCard match={finalMatch} onPick={onPick} className="mx-auto" pathLabel="Final" highlightFinal /> : null}
            {finalMatch?.winner && (
              <button type="button" onClick={onRevealChampion} className="btn-primary mt-4 w-full">
                Reveal Champion
              </button>
            )}
          </div>

          <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-3">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Path B</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-32 pt-28">{sfMatches[1] && <MatchCard match={sfMatches[1]} onPick={onPick} compact pathLabel="Path B" />}</div>
              <div className="space-y-16 pt-16">{pathBQf.map((match) => <MatchCard key={match.id} match={match} onPick={onPick} compact pathLabel="Path B" />)}</div>
              <div className="space-y-6 pt-6">{pathB16.map((match) => <MatchCard key={match.id} match={match} onPick={onPick} compact pathLabel="Path B" />)}</div>
              <div className="space-y-2">{pathB.map((match) => <MatchCard key={match.id} match={match} onPick={onPick} compact pathLabel="Path B" />)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="safe-bottom sticky bottom-0 z-30 border-t border-[#1f2937] bg-[#0a0f1e]/95 px-3 py-3 backdrop-blur-lg lg:hidden">
        {!isFinalRound ? (
          <button
            type="button"
            onClick={handleNextRound}
            disabled={!activeComplete}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition duration-200 active:scale-95 ${activeComplete ? 'bg-[#10b981] text-[#06231b]' : 'cursor-not-allowed bg-[#374151] text-[#cbd5e1]'}`}
          >
            → Next Round <FaArrowRight className="h-3 w-3" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onRevealChampion}
            disabled={!finalMatch?.winner}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition duration-200 active:scale-95 ${finalMatch?.winner ? 'bg-[#10b981] text-[#06231b]' : 'cursor-not-allowed bg-[#374151] text-[#cbd5e1]'}`}
          >
            Reveal Champion
          </button>
        )}
      </div>
    </div>
  );
}

export default Bracket;
