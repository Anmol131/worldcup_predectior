import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaFutbol } from 'react-icons/fa';
import GroupCard from '../components/GroupCard';
import ProgressBar from '../components/ProgressBar';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useSession } from '../hooks/useSession';
import { useGroups } from '../hooks/useGroups';
import { useBracket } from '../hooks/useBracket';
import { useSessionData } from '../hooks/useSessionData';

const POSITION_MAP = {
  '1st': 'first',
  first: 'first',
  '2nd': 'second',
  second: 'second',
  '3rd': 'third',
  third: 'third',
};

function normalizePosition(position) {
  return POSITION_MAP[position] || null;
}

function getSelection(group) {
  const selection = { first: '', second: '', third: '' };

  group?.teams?.forEach((team) => {
    const normalized = normalizePosition(team.position);
    if (normalized) {
      selection[normalized] = team.code;
    }
  });

  return selection;
}

function getThirdTeams(groups = []) {
  return groups.flatMap((group) => (group.teams || [])
    .filter((team) => normalizePosition(team.position) === 'third')
    .map((team) => ({ groupId: group.groupId, team })));
}

function GroupStage() {
  const navigate = useNavigate();
  const { sessionId, isReady } = useSession();
  const { groups, isLoading, error, pickPosition, isPicking, confirmBestThird, isConfirming } = useGroups(sessionId);
  const { bracket, generateBracket, isGenerating } = useBracket(sessionId);
  const { session, isLoading: sessionLoading } = useSessionData(sessionId);
  const [toasts, setToasts] = useState([]);
  const previousCompleteSetRef = useRef(new Set());

  const sessionBestThirdCodesKey = session?.session?.bestThirdTeams?.map((team) => team.code).filter(Boolean).join(',') || '';
  const sessionBestThirdCodes = useMemo(
    () => (sessionBestThirdCodesKey
      ? session?.session?.bestThirdTeams?.map((team) => team.code).filter(Boolean)
      : []),
    [sessionBestThirdCodesKey],
  );
  const [selectedThirdTeamCodes, setSelectedThirdTeamCodes] = useState(sessionBestThirdCodes);

  useEffect(() => {
    if (!sessionBestThirdCodesKey) {
      return;
    }

    setSelectedThirdTeamCodes((previous) => {
      const same = previous.length === sessionBestThirdCodes.length
        && previous.every((code) => sessionBestThirdCodes.includes(code));
      return same ? previous : sessionBestThirdCodes;
    });
  }, [sessionBestThirdCodesKey]);

  const progress = useMemo(() => {
    const complete = (groups || []).filter((group) => getSelection(group).first && getSelection(group).second && getSelection(group).third).length;
    return { complete, total: groups?.length || 12 };
  }, [groups]);

  const thirdPlaceReady = progress.complete === progress.total;
  const allThirdPlaceTeams = useMemo(() => getThirdTeams(groups || []), [groups]);
  const hasBestEight = selectedThirdTeamCodes.length === 8;
  const isBestThirdConfirmed = Boolean(session?.bestThirdConfirmed);
  const canGenerate = Boolean(session?.allGroupsDone && isBestThirdConfirmed && hasBestEight && bracket);

  const progressPercent = Math.round((progress.complete / progress.total) * 100);

  useEffect(() => {
    const nowCompleted = (groups || [])
      .filter((group) => getSelection(group).first && getSelection(group).second && getSelection(group).third)
      .map((group) => group.groupId);

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
  }, [groups]);

  const handleToggleBestThird = (teamCode) => {
    setSelectedThirdTeamCodes((current) => {
      const next = current.includes(teamCode)
        ? current.filter((code) => code !== teamCode)
        : [...current, teamCode];

      if (next.length > 8) {
        return current;
      }

      return next;
    });
  };

  const handleGenerate = () => {
    if (!canGenerate) {
      return;
    }

    generateBracket(undefined, {
      onSuccess: () => {
        const toastId = `${Date.now()}-generated`;
        setToasts((current) => [...current, { id: toastId, message: '🏆 Bracket generated!' }]);
        setTimeout(() => {
          navigate('/knockout');
        }, 700);
      },
    });
  };

  if (!isReady || !sessionId || isLoading || sessionLoading) {
    return (
      <section className="safe-bottom mx-auto w-full max-w-[1160px] px-3 pb-16 pt-4 sm:px-5">
        <div className="mx-auto mb-4 w-full max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-4 shadow-glow sm:max-w-full">
          <LoadingSpinner />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="safe-bottom mx-auto w-full max-w-[1160px] px-3 pb-16 pt-4 sm:px-5">
        <ErrorMessage message={error.message || 'Failed to load groups'} />
      </section>
    );
  }

  return (
    <section className="safe-bottom mx-auto w-full max-w-[1160px] px-3 pb-16 pt-4 sm:px-5">
      <div className="mx-auto mb-4 w-full max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-4 shadow-glow sm:max-w-full">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">Group Stage</p>
          <h1 className="text-2xl font-bold text-[#f9fafb] sm:text-3xl">Pick all 12 groups</h1>
          <p className="text-sm leading-6 text-[#9ca3af]">Set 1st, 2nd, and 3rd for each group, then confirm your best 8 third-place teams.</p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center rounded-[20px] border border-[#1f2937] bg-[#0b1224] px-4 py-2 text-sm font-semibold text-[#d1d5db]">
            {progress.complete} / {progress.total} groups
          </div>
          <ProgressBar value={progressPercent} label="Group completion" />
        </div>

        {session?.allGroupsDone && session?.bestThirdConfirmed && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition duration-200 active:scale-95 ${canGenerate ? 'bg-[#10b981] text-[#06231b] animate-bounce' : 'cursor-not-allowed bg-[#374151] text-[#d1d5db]'}`}
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
          >
            {isGenerating ? 'Generating...' : <>Generate Bracket <FaArrowRight /></>}
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(groups || []).map((group) => (
          <motion.div
            key={group.groupId}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
              <GroupCard
              group={group}
              selection={getSelection(group)}
              onSelect={(groupId, teamCode, rank) => pickPosition({ groupId, teamCode, position: rank })}
              disabled={isPicking || isConfirming}
            />
          </motion.div>
        ))}
      </div>

      {thirdPlaceReady && (
        <div className="mx-auto mt-6 w-full max-w-[480px] rounded-xl border border-[#1f2937] bg-[#111827] p-4 sm:max-w-full">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#f9fafb]">Choose 8 best 3rd-place teams to advance</h3>
              <p className="text-sm text-[#9ca3af]">{selectedThirdTeamCodes.length} / 8 selected</p>
            </div>
            {hasBestEight && (
              <span className="inline-flex min-h-[32px] items-center rounded-[20px] bg-[#10b981]/20 px-3 text-xs font-semibold text-[#34d399]">
                <FaCheckCircle className="mr-1" /> Ready
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allThirdPlaceTeams.map((entry) => {
              const selected = selectedThirdTeamCodes.includes(entry.team.code);
              const disabled = !selected && selectedThirdTeamCodes.length >= 8;
              return (
                <button
                  key={`${entry.groupId}-${entry.team.code}`}
                  type="button"
                  disabled={disabled || isConfirming}
                  onClick={() => handleToggleBestThird(entry.team.code)}
                  className={`wc-chip ${selected ? '!border-[#10b981] !bg-[#10b981]/20 !text-[#d1fae5]' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="text-lg leading-none">{entry.team.flag || '⚽'}</span>
                  <span>{entry.team.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#9ca3af]">Select 8 teams first, then confirm when ready.</p>
            <button
              type="button"
              className={`btn-primary ${selectedThirdTeamCodes.length !== 8 || isConfirming ? 'cursor-not-allowed opacity-60' : ''}`}
              onClick={() => confirmBestThird(selectedThirdTeamCodes)}
              disabled={selectedThirdTeamCodes.length !== 8 || isConfirming}
            >
              {isConfirming ? 'Confirming...' : 'Confirm 8 Teams'}
            </button>
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
