import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaFutbol } from 'react-icons/fa';
import groups from '../data/groups';
import usePredictionStore from '../store/predictionStore';
import { areThirdPlaceTeamsReady, getAllThirdPlaceTeams, getGroupProgress, isBestThirdSelectionValid } from '../utils/tournament';
import GroupCard from '../components/GroupCard';
import ProgressBar from '../components/ProgressBar';

function GroupStage() {
  const navigate = useNavigate();
  const {
    groupSelections,
    bestThirdPlaceTeamCodes,
    selectGroupTeam,
    setBestThirdPlaceTeamCodes,
    generateKnockout,
  } = usePredictionStore();
  const [toasts, setToasts] = useState([]);
  const previousCompleteSetRef = useRef(new Set());

  const progress = getGroupProgress(groupSelections);
  const progressPercent = Math.round((progress.complete / progress.total) * 100);
  const thirdPlaceReady = areThirdPlaceTeamsReady(groupSelections);
  const allThirdPlaceTeams = useMemo(() => getAllThirdPlaceTeams(groupSelections), [groupSelections]);
  const hasBestEight = isBestThirdSelectionValid(groupSelections, bestThirdPlaceTeamCodes);
  const canGenerate = progress.complete === progress.total && thirdPlaceReady && hasBestEight;

  useEffect(() => {
    const nowCompleted = groups
      .filter((group) => {
        const selection = groupSelections[group.id] || {};
        return selection.first && selection.second && selection.third;
      })
      .map((group) => group.id);

    const prevSet = previousCompleteSetRef.current;
    nowCompleted.forEach((groupId) => {
      if (!prevSet.has(groupId)) {
        const toastId = `${Date.now()}-${groupId}`;
        setToasts((current) => [...current, { id: toastId, message: `✓ Group ${groupId} complete!` }]);
        setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== toastId));
        }, 2200);
      }
    });

    previousCompleteSetRef.current = new Set(nowCompleted);
  }, [groupSelections]);

  const handleToggleBestThird = (teamCode) => {
    const exists = bestThirdPlaceTeamCodes.includes(teamCode);
    if (exists) {
      setBestThirdPlaceTeamCodes(bestThirdPlaceTeamCodes.filter((code) => code !== teamCode));
      return;
    }

    if (bestThirdPlaceTeamCodes.length >= 8) {
      return;
    }
    setBestThirdPlaceTeamCodes([...bestThirdPlaceTeamCodes, teamCode]);
  };

  const handleGenerate = () => {
    if (!hasBestEight) {
      return;
    }
    const ok = generateKnockout();
    if (ok) {
      const toastId = `${Date.now()}-generated`;
      setToasts((current) => [...current, { id: toastId, message: '🏆 Bracket generated!' }]);
      setTimeout(() => {
        navigate('/knockout');
      }, 700);
    }
  };

  return (
    <section className="safe-bottom mx-auto w-full max-w-[1160px] px-3 pb-16 pt-4 sm:px-5">
      <div className="mx-auto mb-4 w-full max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-4 shadow-glow sm:max-w-full">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Group Stage</p>
          <h1 className="text-2xl font-bold text-[#f9fafb] sm:text-3xl">Pick all 12 groups</h1>
          <p className="text-sm leading-6 text-[#9ca3af]">Set 1st, 2nd, and 3rd for each group, then choose your best 8 third-place teams.</p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center rounded-[20px] border border-[#1f2937] bg-[#0b1224] px-4 py-2 text-sm font-semibold text-[#d1d5db]">
            {progress.complete} / {progress.total} groups
          </div>
          <ProgressBar value={progressPercent} label="Group completion" />
        </div>

        {progress.complete === progress.total && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition duration-200 active:scale-95 ${canGenerate ? 'bg-[#10b981] text-[#06231b] animate-bounce' : 'cursor-not-allowed bg-[#374151] text-[#d1d5db]'}`}
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            Generate Bracket <FaArrowRight />
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <GroupCard
              group={group}
              selection={groupSelections[group.id]}
              onSelect={selectGroupTeam}
            />
          </motion.div>
        ))}
      </div>

      {progress.complete === progress.total && thirdPlaceReady && (
        <div className="mx-auto mt-6 w-full max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-4 sm:max-w-full">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#f9fafb]">Choose 8 best 3rd-place teams to advance</h3>
              <p className="text-sm text-[#9ca3af]">{bestThirdPlaceTeamCodes.length} / 8 selected</p>
            </div>
            {hasBestEight && (
              <span className="inline-flex min-h-[32px] items-center rounded-[20px] bg-[#10b981]/20 px-3 text-xs font-semibold text-[#34d399]">
                <FaCheckCircle className="mr-1" /> Ready
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allThirdPlaceTeams.map((entry) => {
              const selected = bestThirdPlaceTeamCodes.includes(entry.team.code);
              const disabled = !selected && bestThirdPlaceTeamCodes.length >= 8;
              return (
                <button
                  key={`${entry.groupId}-${entry.team.code}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleToggleBestThird(entry.team.code)}
                  className={`wc-chip ${selected ? '!border-[#10b981] !bg-[#10b981]/20 !text-[#d1fae5]' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="text-lg leading-none">{entry.team.flag || '⚽'}</span>
                  <span>{entry.team.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50 flex max-w-[260px] flex-col gap-2">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2 text-sm text-[#e5e7eb] shadow-glow"
          >
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0b1224] text-[#10b981]">
              <FaFutbol className="h-3 w-3" />
            </span>
            {toast.message}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default GroupStage;
