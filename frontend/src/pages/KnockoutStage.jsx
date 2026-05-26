import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { FaRedo, FaTrophy } from 'react-icons/fa';
import Bracket from '../components/Bracket';
import ConfirmModal from '../components/ui/ConfirmModal';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { sessionAPI } from '../services/api';
import { useSession } from '../hooks/useSession';
import { useBracket } from '../hooks/useBracket';
import { useSessionData } from '../hooks/useSessionData';

function toDisplayRounds(bracket) {
  if (!bracket?.rounds) {
    return [];
  }

  return [
    ['Round of 32', bracket.rounds.r32 || []],
    ['Round of 16', bracket.rounds.r16 || []],
    ['Quarter Finals', bracket.rounds.qf || []],
    ['Semi Finals', bracket.rounds.sf || []],
    ['Final', bracket.rounds.final || []],
  ].map(([title, matches]) => ({
    title,
    matches: matches.map((match) => ({
      id: match.matchId,
      round: title,
      home: match.teamA || { code: '', name: 'TBD', flag: '' },
      away: match.teamB || { code: '', name: 'TBD', flag: '' },
      winner: match.winner?.code || null,
    })),
  }));
}

function KnockoutStage() {
  const navigate = useNavigate();
  const { sessionId, isReady } = useSession();
  const queryClient = useQueryClient();
  const { bracket, isLoading, error, pickWinner, isPicking } = useBracket(sessionId);
  const { session, isLoading: sessionLoading } = useSessionData(sessionId);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pendingMatchId, setPendingMatchId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const rounds = useMemo(() => toDisplayRounds(bracket), [bracket]);
  const champion = bracket?.champion || null;

  const matchRoundMap = useMemo(() => rounds.reduce((acc, round) => {
    round.matches.forEach((match) => {
      acc[match.id] = round.title;
    });
    return acc;
  }, {}), [rounds]);

  const roundOrder = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];
  const firstIncompleteRound = roundOrder.find((title) => {
    const matches = rounds.find((round) => round.title === title)?.matches || [];
    return matches.length > 0 && matches.some((match) => !match.winner);
  }) || 'Final';

  const activeRoundMatches = rounds.find((round) => round.title === firstIncompleteRound)?.matches || [];
  const decidedCount = activeRoundMatches.filter((match) => match.winner).length;

  useEffect(() => {
    if (!champion) {
      return;
    }

    setShowCelebration(true);
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.65 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#94a3b8'],
    });
  }, [champion]);

  const handlePickWinner = (matchId, winnerCode) => {
    const roundTitle = matchRoundMap[matchId];
    const roundMap = {
      'Round of 32': 'r32',
      'Round of 16': 'r16',
      'Quarter Finals': 'qf',
      'Semi Finals': 'sf',
      Final: 'final',
    };
    const roundKey = roundMap[roundTitle];

    if (!roundKey) {
      console.error('Unable to resolve round for match:', matchId, roundTitle);
      return;
    }

    setPendingMatchId(matchId);
    pickWinner(
      { round: roundKey, matchId, winnerCode },
      {
        onSettled: () => setPendingMatchId(null),
      },
    );
  };

  const handleStartOver = async () => {
    setShowConfirm(false);

    const currentSessionId = localStorage.getItem('wc2026-session');
    console.log('[StartOver] Deleting session:', currentSessionId);

    if (!currentSessionId) {
      console.error('[StartOver] Missing current session id');
      return;
    }

    try {
      const result = await sessionAPI.resetSession(currentSessionId);
      console.log('[StartOver] Server reset result:', result);

      const { newSessionId, session: freshSession } = result;

      Object.keys(localStorage)
        .filter((key) => key.includes('wc2026'))
        .forEach((key) => localStorage.removeItem(key));

      localStorage.setItem('wc2026-session', newSessionId);
      queryClient.clear();
      queryClient.setQueryData(['groups', newSessionId], { groups: freshSession.groups });
      queryClient.setQueryData(['session', newSessionId], { session: freshSession, ...freshSession });

      window.location.href = '/groups';
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  if (!isReady || !sessionId || isLoading || sessionLoading) {
    return (
      <section className="mx-auto max-w-full px-4 pb-16 pt-8 sm:px-6">
        <LoadingSpinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-[1160px] px-4 pb-16 pt-8 sm:px-6">
        <ErrorMessage message={error.message || 'Failed to load bracket'} />
      </section>
    );
  }

  if (!bracket) {
    return (
      <section className="mx-auto max-w-[1160px] px-4 pb-16 pt-8 sm:px-6">
        <div className="mx-auto max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-8 text-center shadow-glow sm:max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Bracket unavailable</p>
          <h1 className="mt-3 text-2xl font-bold text-[#f9fafb]">Finish groups first</h1>
          <p className="mt-2 text-sm text-[#9ca3af]">Complete all 12 groups and confirm the 8 best third-place teams.</p>
          <button className="btn-primary mt-8" onClick={() => navigate('/groups')}>
            Complete Groups
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="safe-bottom mx-auto max-w-full px-3 pb-16 pt-4 sm:px-5">
      <div className="mx-auto mb-4 w-full max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-4 shadow-glow sm:max-w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Knockout Stage</p>
            <h1 className="mt-1 text-2xl font-bold text-[#f9fafb] sm:text-3xl">Pick each round winner</h1>
            <p className="mt-1 text-sm text-[#9ca3af]">{firstIncompleteRound} · {decidedCount}/{activeRoundMatches.length || 0} matches decided</p>
          </div>
          <div className="rounded-lg border border-[#1f2937] bg-[#0b1224] p-3 text-left">
            <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">Groups ready</p>
            <p className="mt-1 text-lg font-bold text-[#d1fae5]">{session?.groupsComplete || 0} / 12</p>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1f2937]">
          <motion.div
            className="h-full rounded-full bg-[#10b981]"
            animate={{ width: `${activeRoundMatches.length ? Math.round((decidedCount / activeRoundMatches.length) * 100) : 0}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>
      </div>

      <Bracket
        rounds={rounds}
        pendingMatchId={pendingMatchId}
        onPick={isPicking ? undefined : handlePickWinner}
        onRevealChampion={() => navigate('/champion')}
        onEditGroups={() => navigate('/groups')}
      />

      {pendingMatchId && (
        <div className="mx-auto mt-4 max-w-[1160px] rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          Saving match {pendingMatchId}...
        </div>
      )}

      <div className="mt-10 hidden items-center justify-between gap-4 md:flex">
        <button className="btn-secondary" onClick={() => navigate('/groups')}>
          Edit Groups
        </button>
        <div className="flex items-center gap-4">
          <button className="text-xs text-gray-500 underline transition hover:text-red-400" onClick={() => setShowConfirm(true)}>
            Start over
          </button>
          {champion && (
            <button className="btn-primary" onClick={() => navigate('/champion')}>
              Reveal Champion
            </button>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        title="Start Over?"
        message="This will permanently erase all your group picks, bracket selections, and your predicted champion. You'll start completely fresh. This cannot be undone."
        confirmLabel="Yes, erase everything"
        cancelLabel="Cancel"
        onConfirm={handleStartOver}
        onCancel={() => setShowConfirm(false)}
      />

      {showCelebration && champion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b16]/95 p-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-xl border border-[#f59e0b]/50 bg-[#111827] p-6 text-center shadow-[0_0_40px_rgba(245,158,11,0.25)]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f59e0b]/20 text-[#f59e0b]">
              <FaTrophy className="h-8 w-8" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#9ca3af]">Champion reveal</p>
            <h2 className="mt-2 text-4xl font-bold text-[#f9fafb]">{champion.flag} {champion.name}</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setShowCelebration(false);
                  navigate('/champion');
                }}
              >
                View Champion Page
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleStartOver}
              >
                <FaRedo className="mr-2" /> Start Over
              </button>
            </div>

            <button type="button" className="mt-4 text-xs uppercase tracking-[0.15em] text-[#6b7280]" onClick={() => setShowCelebration(false)}>
              Close
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}

export default KnockoutStage;
