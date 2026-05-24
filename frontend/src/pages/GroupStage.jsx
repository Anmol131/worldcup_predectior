import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import groups from '../data/groups';
import usePredictionStore from '../store/predictionStore';
import { areThirdPlaceTeamsReady, getAllThirdPlaceTeams, getGroupProgress, isBestThirdSelectionValid } from '../utils/tournament';
import GroupCard from '../components/GroupCard';
import ProgressBar from '../components/ProgressBar';
import BestThirdPlaceModal from '../components/BestThirdPlaceModal';

function GroupStage() {
  const navigate = useNavigate();
  const {
    groupSelections,
    bestThirdPlaceTeamCodes,
    selectGroupTeam,
    setBestThirdPlaceTeamCodes,
    generateKnockout,
  } = usePredictionStore();
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
  const [hasAutoOpenedThirdModal, setHasAutoOpenedThirdModal] = useState(false);

  const progress = getGroupProgress(groupSelections);
  const progressPercent = Math.round((progress.complete / progress.total) * 100);
  const thirdPlaceReady = areThirdPlaceTeamsReady(groupSelections);
  const allThirdPlaceTeams = useMemo(() => getAllThirdPlaceTeams(groupSelections), [groupSelections]);
  const hasBestEight = isBestThirdSelectionValid(groupSelections, bestThirdPlaceTeamCodes);
  const canGenerate = progress.complete === progress.total && thirdPlaceReady && hasBestEight;

  useEffect(() => {
    if (progress.complete !== progress.total) {
      setHasAutoOpenedThirdModal(false);
      return;
    }

    if (!hasBestEight && !hasAutoOpenedThirdModal) {
      setIsThirdModalOpen(true);
      setHasAutoOpenedThirdModal(true);
    }
  }, [progress.complete, progress.total, hasBestEight, hasAutoOpenedThirdModal]);

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
      setIsThirdModalOpen(true);
      return;
    }
    const ok = generateKnockout();
    if (ok) {
      navigate('/knockout');
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:px-10">
      <div className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-glass p-8 shadow-glow backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Group Stage Predictor</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Build your 2026 World Cup group winners.</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-300">Select 1st, 2nd, and 3rd for every group. Once all groups are complete, choose the best 8 third-place teams before generating the knockout bracket.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
          <ProgressBar value={progressPercent} label={`${progress.complete} / ${progress.total} groups complete`} />
          <button
            className={`btn-secondary w-full md:w-auto ${!(progress.complete === progress.total) ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => setIsThirdModalOpen(true)}
            disabled={progress.complete !== progress.total}
          >
            Best 3rd Place Teams ({bestThirdPlaceTeamCodes.length}/8)
          </button>
          <button
            className={`btn-primary w-full md:w-auto ${!canGenerate ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            Generate Knockout Stage
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <GroupCard
              group={group}
              selection={groupSelections[group.id]}
              onSelect={selectGroupTeam}
            />
          </motion.div>
        ))}
      </div>

      <BestThirdPlaceModal
        isOpen={isThirdModalOpen}
        thirdPlaceTeams={allThirdPlaceTeams}
        selectedCodes={bestThirdPlaceTeamCodes}
        onToggle={handleToggleBestThird}
        onClose={() => setIsThirdModalOpen(false)}
        onConfirm={() => setIsThirdModalOpen(false)}
      />
    </section>
  );
}

export default GroupStage;
