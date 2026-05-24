import { useMemo, useState } from 'react';
import MatchCard from './MatchCard';

const ROUND_LABELS = {
  'Round of 32': 'Round of 32',
  'Round of 16': 'Round of 16',
  'Quarter Finals': 'Quarter-finals',
  'Semi Finals': 'Semi-finals',
  Final: 'Final',
};

const ROUND_LAYOUT = {
  'Round of 32': 'space-y-3',
  'Round of 16': 'space-y-12 pt-8',
  'Quarter Finals': 'space-y-20 pt-20',
  'Semi Finals': 'space-y-28 pt-36',
  Final: 'space-y-0 pt-[15.5rem]',
};

function Bracket({ rounds, onPick }) {
  const [activeRound, setActiveRound] = useState(rounds[0]?.title || 'Round of 32');

  const roundsByTitle = useMemo(
    () => rounds.reduce((acc, round) => ({ ...acc, [round.title]: round }), {}),
    [rounds],
  );

  const desktopRoundOrder = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];
  const r32Matches = roundsByTitle['Round of 32']?.matches || [];
  const pathA = r32Matches.slice(0, 8);
  const pathB = r32Matches.slice(8, 16);

  return (
    <>
      <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#0f172a]/70 p-2 lg:hidden">
        {rounds.map((round) => (
          <button
            key={round.title}
            type="button"
            onClick={() => setActiveRound(round.title)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${activeRound === round.title ? 'bg-cyan-500/20 text-cyan-100' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            {ROUND_LABELS[round.title] || round.title}
          </button>
        ))}
      </div>

      <div className="space-y-4 lg:hidden">
        {(roundsByTitle[activeRound]?.matches || []).map((match) => (
          <MatchCard key={match.id} match={match} onPick={onPick} className="w-full max-w-none" />
        ))}
      </div>

      <div className="hidden overflow-x-auto pb-10 lg:block">
        <div className="relative flex min-w-[1220px] gap-12 pr-10">
          {desktopRoundOrder.map((roundTitle) => {
            const round = roundsByTitle[roundTitle] || { matches: [] };
            const showConnector = roundTitle !== 'Final';
            const showIncoming = roundTitle !== 'Round of 32';

            return (
              <div key={roundTitle} className="min-w-[190px]">
                <div className="sticky top-4 z-10 mb-4 rounded-2xl border border-white/10 bg-[#0f172a]/95 px-4 py-3 text-center text-xs uppercase tracking-[0.24em] text-slate-300 shadow-glow backdrop-blur">
                  {ROUND_LABELS[roundTitle] || roundTitle}
                </div>

                {roundTitle === 'Round of 32' ? (
                  <div className="space-y-6">
                    <div>
                      <p className="mb-2 text-center text-xs uppercase tracking-[0.24em] text-cyan-200">Path A</p>
                      <div className="space-y-3">
                        {pathA.map((match) => (
                          <MatchCard key={match.id} match={match} onPick={onPick} showConnector={showConnector} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-center text-xs uppercase tracking-[0.24em] text-violet-200">Path B</p>
                      <div className="space-y-3">
                        {pathB.map((match) => (
                          <MatchCard key={match.id} match={match} onPick={onPick} showConnector={showConnector} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={ROUND_LAYOUT[roundTitle] || 'space-y-3'}>
                    {round.matches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onPick={onPick}
                        showConnector={showConnector}
                        showIncoming={showIncoming}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Bracket;
