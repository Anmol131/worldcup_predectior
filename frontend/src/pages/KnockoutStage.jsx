import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { FaShareAlt, FaRedo, FaTrophy } from 'react-icons/fa';
import usePredictionStore from '../store/predictionStore';
import { buildKnockoutRounds, getGroupProgress } from '../utils/tournament';
import Bracket from '../components/Bracket';

const roundOrder = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

function KnockoutStage() {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const { groupSelections, bestThirdPlaceTeamCodes, matchWinners, setMatchWinner, generated, resetPrediction } = usePredictionStore();
  const { rounds, champion } = useMemo(
    () => buildKnockoutRounds(groupSelections, matchWinners, bestThirdPlaceTeamCodes),
    [groupSelections, matchWinners, bestThirdPlaceTeamCodes],
  );

  const progress = getGroupProgress(groupSelections);
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

  const handleSharePrediction = async () => {
    if (!champion?.name) {
      return;
    }
    const text = `My World Cup 2026 champion prediction: ${champion.name}`;
    try {
      await navigator.clipboard.writeText(text);
      setShareMessage('Prediction copied to clipboard.');
    } catch {
      setShareMessage('Could not copy prediction.');
    }
  };

  if (!generated) {
    return (
      <section className="mx-auto max-w-[1160px] px-4 pb-16 pt-8 sm:px-6">
        <div className="mx-auto max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-8 text-center shadow-glow sm:max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Bracket unavailable</p>
          <h1 className="mt-3 text-2xl font-bold text-[#f9fafb]">Finish groups first</h1>
          <p className="mt-2 text-sm text-[#9ca3af]">Complete all 12 groups and select the 8 best third-place teams.</p>
          <button className="btn-primary mt-8" onClick={() => navigate('/groups')}>
            Complete Groups
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="safe-bottom mx-auto max-w-[1160px] px-3 pb-16 pt-4 sm:px-5">
      <div className="mx-auto mb-4 w-full max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-4 shadow-glow sm:max-w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Knockout Stage</p>
            <h1 className="mt-1 text-2xl font-bold text-[#f9fafb] sm:text-3xl">Pick each round winner</h1>
            <p className="mt-1 text-sm text-[#9ca3af]">{firstIncompleteRound} · {decidedCount}/{activeRoundMatches.length || 0} matches decided</p>
          </div>
          <div className="rounded-lg border border-[#1f2937] bg-[#0b1224] p-3 text-left">
            <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">Groups ready</p>
            <p className="mt-1 text-lg font-bold text-[#d1fae5]">{progress.complete} / {progress.total}</p>
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

      <Bracket rounds={rounds} onPick={setMatchWinner} onRevealChampion={() => setShowCelebration(true)} />

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <button className="btn-secondary" onClick={() => navigate('/groups')}>
          Edit Groups
        </button>
        {champion && (
          <button className="btn-primary" onClick={() => navigate('/champion')}>
            Reveal Champion
          </button>
        )}
      </div>

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
              <button type="button" className="btn-primary" onClick={handleSharePrediction}>
                <FaShareAlt className="mr-2" /> Share Prediction
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  resetPrediction();
                  setShowCelebration(false);
                  navigate('/groups');
                }}
              >
                <FaRedo className="mr-2" /> Start Over
              </button>
            </div>

            {shareMessage && <p className="mt-4 text-sm text-[#d1fae5]">{shareMessage}</p>}
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
