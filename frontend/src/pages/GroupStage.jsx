import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import groups from '../data/groups';
import usePredictionStore from '../store/predictionStore';
import { areThirdPlaceTeamsReady, getGroupProgress } from '../utils/tournament';
import GroupCard from '../components/GroupCard';
import ProgressBar from '../components/ProgressBar';

function GroupStage() {
  const navigate = useNavigate();
  const { groupSelections, selectGroupTeam, generateKnockout } = usePredictionStore();

  const progress = getGroupProgress(groupSelections);
  const progressPercent = Math.round((progress.complete / progress.total) * 100);
  const thirdPlaceReady = areThirdPlaceTeamsReady(groupSelections);
  const canGenerate = progress.complete === progress.total && thirdPlaceReady;

  const handleGenerate = () => {
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
          <p className="max-w-3xl text-base leading-7 text-slate-300">Select top two teams for every group. Once your picks are complete, the 8 best third-place teams will advance automatically, then generate the knockout bracket.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <ProgressBar value={progressPercent} label={`${progress.complete} / ${progress.total} groups complete`} />
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
    </section>
  );
}

export default GroupStage;
