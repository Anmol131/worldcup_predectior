import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import MatchCard from './MatchCard';

const ROUND_LABELS = {
  'Round of 32': 'R32',
  'Round of 16': 'R16',
  'Quarter Finals': 'QF',
  'Semi Finals': 'SF',
  Final: 'Final',
};

const ROUND_ORDER = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

const DESKTOP_HEADERS = {
  'Round of 32': 'Round of 32',
  'Round of 16': 'Round of 16',
  'Quarter Finals': 'Quarter-finals',
  'Semi Finals': 'Semi-finals',
  Final: 'Final',
};

const DESKTOP_LAYOUT = {
  baseGap: 8,
  cardHeight: 108,
  finalCardHeight: 132,
};

const CONNECTION_PAIRS = [
  ['Round of 32', 'Round of 16'],
  ['Round of 16', 'Quarter Finals'],
  ['Quarter Finals', 'Semi Finals'],
  ['Semi Finals', 'Final'],
];

function getRoundLayout(roundTitle, previousRoundLayout) {
  const isFinal = roundTitle === 'Final';
  const height = isFinal ? DESKTOP_LAYOUT.finalCardHeight : DESKTOP_LAYOUT.cardHeight;

  if (!previousRoundLayout) {
    return {
      height,
      offset: 0,
      gap: DESKTOP_LAYOUT.baseGap,
    };
  }

  const step = 2 * (previousRoundLayout.height + previousRoundLayout.gap);
  const offset =
    previousRoundLayout.offset
    + previousRoundLayout.height
    + previousRoundLayout.gap / 2
    - height / 2;

  return {
    height,
    offset,
    gap: isFinal ? 0 : step - height,
  };
}

function getMatchLabel(roundTitle, index) {
  const short = ROUND_LABELS[roundTitle] || roundTitle;
  return `${short} · M${String(index + 1).padStart(2, '0')}`;
}

function DesktopTeamRow({ team, isWinner, isLoser, rowHeight, showSelect, onSelect }) {
  const isTbd = !team?.code;

  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-2 ${isTbd ? 'border-dashed border-[#374151] text-[#4b5563]' : 'border-transparent'} ${isWinner ? 'border-l-[3px] border-l-[#10b981] bg-[#0b1224] text-white' : 'text-[#d1d5db]'} ${isLoser ? 'opacity-40' : ''}`}
      style={{ height: `${rowHeight}px` }}
    >
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f2937] text-[11px] font-bold text-[#d1d5db]">
        {isTbd ? 'TD' : team.code.slice(0, 2)}
      </span>

      <span className={`max-w-[120px] truncate text-[13px] ${isWinner ? 'font-bold text-white' : 'font-medium'}`}>
        {isTbd ? 'TBD' : team.name}
      </span>

      {showSelect ? (
        <button
          type="button"
            disabled={!onSelect}
          onClick={onSelect}
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded bg-[#1f2937] text-xs text-[#e5e7eb] transition duration-200 hover:bg-[#10b981] hover:text-[#06231b]"
          aria-label={`Select ${team.name}`}
        >
          ▶
        </button>
      ) : (
        <span className="ml-auto h-7 w-7" />
      )}
    </div>
  );
}

function DesktopMatchCard({ match, roundTitle, index, isFinal, setCardRef, onPick, isSaving = false }) {
  const resolved = Boolean(match.winner);
  const rowHeight = isFinal ? 42 : 36;
  const homeIsWinner = resolved && match.winner === match.home.code;
  const awayIsWinner = resolved && match.winner === match.away.code;
  const homeIsLoser = resolved && !homeIsWinner;
  const awayIsLoser = resolved && !awayIsWinner;

  return (
    <div
      ref={setCardRef(roundTitle, match.id)}
      className={`relative ${isFinal ? 'w-[240px]' : 'w-[210px]'}`}
    >
      <p className={`mb-1 text-[10px] uppercase tracking-[0.14em] ${isFinal ? 'text-[#f59e0b]' : 'text-[#6b7280]'}`}>
        {getMatchLabel(roundTitle, index)}
      </p>

      <div
        className={`rounded-[10px] border bg-[#111827] p-[10px] ${isFinal ? 'border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'border-[#1f2937]'}`}
      >
        {isSaving && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[10px] bg-[#0b1224]/80 text-xs font-semibold text-cyan-100 backdrop-blur-sm">
            Saving...
          </div>
        )}

        {isFinal && (
          <div className="mb-2 text-center">
            <p className="text-2xl">🏆</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f59e0b]">
              FINAL · JULY 19 · METLIFE STADIUM
            </p>
          </div>
        )}

        <DesktopTeamRow
          team={match.home}
          isWinner={homeIsWinner}
          isLoser={homeIsLoser}
          rowHeight={rowHeight}
          showSelect={!resolved && Boolean(match.home.code) && Boolean(onPick)}
          onSelect={onPick ? () => onPick(match.id, match.home.code) : undefined}
        />

        <div className="my-1 h-px bg-[#1f2937]" />

        <DesktopTeamRow
          team={match.away}
          isWinner={awayIsWinner}
          isLoser={awayIsLoser}
          rowHeight={rowHeight}
          showSelect={!resolved && Boolean(match.away.code) && Boolean(onPick)}
          onSelect={onPick ? () => onPick(match.id, match.away.code) : undefined}
        />
      </div>
    </div>
  );
}

function Bracket({ rounds, onPick, onRevealChampion, pendingMatchId = null }) {
  const [activeRound, setActiveRound] = useState(rounds[0]?.title || ROUND_ORDER[0]);
  const contentRef = useRef(null);
  const cardRefs = useRef(new Map());
  const [connectorPaths, setConnectorPaths] = useState([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const roundsByTitle = useMemo(
    () => rounds.reduce((acc, round) => ({ ...acc, [round.title]: round }), {}),
    [rounds],
  );

  const roundLayout = useMemo(() => {
    const layout = {};
    ROUND_ORDER.forEach((title, index) => {
      layout[title] = getRoundLayout(title, index > 0 ? layout[ROUND_ORDER[index - 1]] : null);
    });
    return layout;
  }, []);

  const setCardRef = useCallback(
    (roundTitle, matchId) => (node) => {
      const key = `${roundTitle}:${matchId}`;
      if (node) {
        cardRefs.current.set(key, node);
      } else {
        cardRefs.current.delete(key);
      }
    },
    [],
  );

  const recomputeConnectors = useCallback(() => {
    const contentNode = contentRef.current;
    if (!contentNode) {
      return;
    }

    const contentRect = contentNode.getBoundingClientRect();
    const paths = [];

    CONNECTION_PAIRS.forEach(([sourceRound, targetRound]) => {
      const sourceMatches = roundsByTitle[sourceRound]?.matches || [];
      const targetMatches = roundsByTitle[targetRound]?.matches || [];

      targetMatches.forEach((targetMatch, index) => {
        const targetNode = cardRefs.current.get(`${targetRound}:${targetMatch.id}`);
        const firstSource = sourceMatches[index * 2];
        const secondSource = sourceMatches[index * 2 + 1];
        const firstSourceNode = firstSource ? cardRefs.current.get(`${sourceRound}:${firstSource.id}`) : null;
        const secondSourceNode = secondSource ? cardRefs.current.get(`${sourceRound}:${secondSource.id}`) : null;

        if (!targetNode || !firstSourceNode || !secondSourceNode) {
          return;
        }

        const targetRect = targetNode.getBoundingClientRect();
        const targetX = targetRect.left - contentRect.left;
        const targetY = targetRect.top - contentRect.top + targetRect.height / 2;

        [firstSourceNode, secondSourceNode].forEach((sourceNode) => {
          const sourceRect = sourceNode.getBoundingClientRect();
          const sourceX = sourceRect.right - contentRect.left;
          const sourceY = sourceRect.top - contentRect.top + sourceRect.height / 2;
          const midX = sourceX + (targetX - sourceX) / 2;

          paths.push(`M ${sourceX} ${sourceY} H ${midX} V ${targetY} H ${targetX}`);
        });
      });
    });

    setSvgSize({ width: contentNode.scrollWidth, height: contentNode.scrollHeight });
    setConnectorPaths(paths);
  }, [roundsByTitle]);

  useLayoutEffect(() => {
    const recalc = () => {
      window.requestAnimationFrame(() => {
        recomputeConnectors();
      });
    };

    recalc();
    window.addEventListener('resize', recalc);

    const observer = new ResizeObserver(recalc);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      window.removeEventListener('resize', recalc);
      observer.disconnect();
    };
  }, [recomputeConnectors]);

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

  const finalMatch = roundsByTitle.Final?.matches?.[0];

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
            isSaving={pendingMatchId === match.id}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="px-6">
          <div className="bracket-scrollbar overflow-x-auto rounded-xl desktop-bracket-bg p-4">
            <div ref={contentRef} className="relative inline-flex min-w-max gap-8 pb-6 pr-6 pt-2">
              <svg
                className="pointer-events-none absolute left-0 top-0 z-0"
                width={svgSize.width}
                height={svgSize.height}
                viewBox={`0 0 ${Math.max(svgSize.width, 1)} ${Math.max(svgSize.height, 1)}`}
                aria-hidden
              >
                {connectorPaths.map((path, idx) => (
                  <path key={`${path}-${idx}`} d={path} fill="none" stroke="#1f2937" strokeWidth="1" />
                ))}
              </svg>

              {ROUND_ORDER.map((roundTitle) => {
                const matches = roundsByTitle[roundTitle]?.matches || [];
                const layout = roundLayout[roundTitle];
                const isFinal = roundTitle === 'Final';

                return (
                  <div key={roundTitle} className="relative z-10 min-w-[220px]">
                    <div className="sticky top-3 z-20 mb-4 flex justify-center">
                      <span className="rounded-full bg-[#1f2937] px-4 py-2 text-center text-xs font-semibold text-white">
                        {DESKTOP_HEADERS[roundTitle]}
                      </span>
                    </div>

                    <div
                      className="flex flex-col"
                      style={{
                        paddingTop: `${layout.offset}px`,
                        rowGap: `${layout.gap}px`,
                      }}
                    >
                      {matches.map((match, index) => (
                        <DesktopMatchCard
                          key={match.id}
                          match={match}
                          roundTitle={roundTitle}
                          index={index}
                          isFinal={isFinal}
                          setCardRef={setCardRef}
                          onPick={onPick}
                          isSaving={pendingMatchId === match.id}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="safe-bottom sticky bottom-0 z-30 border-t border-[#1f2937] bg-[#0a0f1e]/95 px-3 py-3 backdrop-blur-lg lg:hidden">
        {!isFinalRound && onRevealChampion ? (
          <button
            type="button"
            onClick={handleNextRound}
            disabled={!activeComplete}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition duration-200 active:scale-95 ${activeComplete ? 'bg-[#10b981] text-[#06231b]' : 'cursor-not-allowed bg-[#374151] text-[#cbd5e1]'}`}
          >
            → Next Round <FaArrowRight className="h-3 w-3" />
          </button>
        ) : isFinalRound && onRevealChampion ? (
          <button
            type="button"
            onClick={onRevealChampion}
            disabled={!finalMatch?.winner}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition duration-200 active:scale-95 ${finalMatch?.winner ? 'bg-[#10b981] text-[#06231b]' : 'cursor-not-allowed bg-[#374151] text-[#cbd5e1]'}`}
          >
            Reveal Champion
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Bracket;
