import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FaCheckCircle } from 'react-icons/fa';
import GroupCard from '../components/GroupCard';
import ProgressBar from '../components/ProgressBar';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useSession } from '../hooks/useSession';
import { useGroups } from '../hooks/useGroups';
import { useBracket } from '../hooks/useBracket';
import { useSessionData } from '../hooks/useSessionData';
import { useToast } from '../components/ui/Toast';
import { sessionAPI } from '../services/api';

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
  const queryClient = useQueryClient();
  const { sessionId, isReady } = useSession();
  const { groups, isLoading, error, pickPosition, confirmBestThird, isConfirming, resetBestThird, isResetting } = useGroups(sessionId);
  const { generateBracket, isGenerating } = useBracket(sessionId);
  const { session, isLoading: sessionLoading } = useSessionData(sessionId);
  const [generateError, setGenerateError] = useState('');
  const { showToast } = useToast();

  const sessionBestThirdCodesKey = session?.session?.bestThirdTeams?.map((team) => team.code).filter(Boolean).join(',') || '';
  const sessionBestThirdCodes = useMemo(
    () => (sessionBestThirdCodesKey
      ? session?.session?.bestThirdTeams?.map((team) => team.code).filter(Boolean)
      : []),
    [sessionBestThirdCodesKey],
  );
  const [selectedThirdTeamCodes, setSelectedThirdTeamCodes] = useState(sessionBestThirdCodes);
  const confirmedSnapshot = useMemo(() => {
    try {
      const raw = localStorage.getItem('wc2026-groups-confirmed');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.groups)) return null;
      return parsed;
    } catch {
      return null;
    }
  }, [session?.session?.bestThirdTeams]);

  useEffect(() => {
    setSelectedThirdTeamCodes((previous) => {
      const same = previous.length === sessionBestThirdCodes.length
        && previous.every((code) => sessionBestThirdCodes.includes(code));
      return same ? previous : sessionBestThirdCodes;
    });
  }, [sessionBestThirdCodesKey]);

  const isConfirmed = Boolean(session?.bestThirdConfirmed);
  const needsReconfirm = Boolean(confirmedSnapshot && !isConfirmed);
  const displayGroups = groups;

  const progress = useMemo(() => {
    const complete = (displayGroups || []).filter((group) => getSelection(group).first && getSelection(group).second && getSelection(group).third).length;
    return { complete, total: displayGroups?.length || 12 };
  }, [displayGroups]);

  const thirdPlaceReady = progress.complete === progress.total;
  const allThirdPlaceTeams = useMemo(() => getThirdTeams(displayGroups || []), [displayGroups]);
  const hasBestEight = selectedThirdTeamCodes.length === 8;
  const canGenerate = Boolean(session?.allGroupsDone && isConfirmed && hasBestEight);

  const progressPercent = Math.round((progress.complete / progress.total) * 100);

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

    setGenerateError('');
    generateBracket(undefined, {
      onSuccess: () => {
        showToast('✓ Bracket generated!', 'success');
        navigate('/knockout');
      },
      onError: (err) => {
        setGenerateError(err?.message || 'Failed to generate bracket. Please try again.');
      },
    });
  };

  const handleConfirmBestThird = () => {
    setGenerateError('');
    confirmBestThird(selectedThirdTeamCodes, {
      onSuccess: () => {
        showToast('✓ Groups confirmed!', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        setGenerateError(err?.message || 'Failed to confirm selection.');
      },
    });
  };

  const handleEditGroups = () => {
    setGenerateError('');
    resetBestThird(undefined, {
      onSuccess: () => {
        showToast('Confirmation cleared.', 'success');
      },
      onError: (err) => {
        setGenerateError(err?.message || 'Failed to reset confirmation.');
      },
    });
  };

  const handleResetGroups = async () => {
    const currentSessionId = sessionId || localStorage.getItem('wc2026-session');

    if (!currentSessionId) {
      showToast('No active session found.', 'error');
      return;
    }

    try {
      const result = await sessionAPI.resetSession(currentSessionId);
      const { newSessionId } = result;

      Object.keys(localStorage)
        .filter((key) => key.includes('wc2026'))
        .forEach((key) => localStorage.removeItem(key));

      localStorage.setItem('wc2026-session', newSessionId);
      queryClient.clear();
      window.location.href = '/groups';
    } catch (err) {
      console.error('Group reset failed:', err);
      showToast('Failed to reset groups. Please try again.', 'error');
    }
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

  if (!groups || groups.length === 0) {
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
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-semibold text-[#ef4444] underline transition hover:text-[#f87171]"
              onClick={handleResetGroups}
            >
              Reset groups
            </button>
          </div>
        </div>

        {isConfirmed && (
          <div className="mt-4 rounded-3xl border border-[#10b981]/20 bg-[#0f3d2f] p-5 text-[#ecfdf5] shadow-glow sm:flex sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-[#a7f3d0]">Ready to generate</p>
              <h2 className="text-xl font-bold text-white">All groups confirmed!</h2>
              <p className="max-w-2xl text-sm text-[#d9fddf]">Your 8 third-place teams are locked in. Ready to generate your bracket?</p>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
              <button
                type="button"
                className={`btn-primary inline-flex items-center justify-center gap-2 ${!canGenerate || isGenerating ? 'cursor-not-allowed opacity-70' : ''}`}
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Bracket →'}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-[#d1fae5]/25 bg-[#0b291e] px-4 py-3 text-sm font-semibold text-[#d1fae5] transition duration-200 hover:border-[#a7f3d0]"
                onClick={handleEditGroups}
                disabled={isResetting}
              >
                {isResetting ? 'Resetting...' : 'Edit Groups'}
              </button>
            </div>
          </div>
        )}

        {needsReconfirm && !isConfirmed && (
          <div className="mt-4 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-amber-50 shadow-glow sm:flex sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Selection updated</p>
              <h2 className="text-xl font-bold text-white">Groups updated — re-confirm your 8 third-place teams</h2>
              <p className="max-w-2xl text-sm text-amber-100/90">Your group picks changed, so the previous confirmation is no longer valid.</p>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
              <button
                type="button"
                className="btn-primary inline-flex items-center justify-center gap-2"
                onClick={handleConfirmBestThird}
                disabled={selectedThirdTeamCodes.length !== 8 || isConfirming}
              >
                {isConfirming ? 'Confirming...' : 'Update Selection'}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-[#d1fae5]/25 bg-[#0b291e] px-4 py-3 text-sm font-semibold text-[#d1fae5] transition duration-200 hover:border-[#a7f3d0]"
                onClick={handleEditGroups}
                disabled={isResetting}
              >
                {isResetting ? 'Resetting...' : 'Edit Groups'}
              </button>
            </div>
          </div>
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
              onClick={handleConfirmBestThird}
              disabled={selectedThirdTeamCodes.length !== 8 || isConfirming}
            >
              {isConfirming ? 'Confirming...' : session?.session?.bestThirdTeams?.length === 8 ? 'Update Selection' : 'Confirm 8 Teams'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default GroupStage;
