import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaShareAlt, FaRedo } from 'react-icons/fa';
import usePredictionStore from '../store/predictionStore';
import { buildKnockoutRounds } from '../utils/tournament';

function Champion() {
  const navigate = useNavigate();
  const { groupSelections, matchWinners, resetPrediction } = usePredictionStore();
  const { champion } = buildKnockoutRounds(groupSelections, matchWinners);

  useEffect(() => {
    if (!champion) {
      navigate('/knockout');
    }
  }, [champion, navigate]);

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-[2rem] border border-white/10 bg-glass p-10 text-center shadow-glow backdrop-blur-xl"
      >
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-100 shadow-neon">
          <FaTrophy className="h-20 w-20" />
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-cyan-200">Predicted Champion</p>
        <h1 className="mt-4 text-5xl font-semibold text-white">{champion?.name || 'Champion TBD'}</h1>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-left text-slate-200 shadow-glow">
          <span className="text-5xl">{champion?.flag}</span>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Final selection</p>
            <p className="mt-2 text-xl font-semibold text-white">{champion?.name}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button
            className="btn-primary"
            onClick={() => {
              resetPrediction();
              navigate('/groups');
            }}
          >
            <FaRedo className="mr-2" /> Restart Prediction
          </button>
          <button className="btn-secondary">
            <FaShareAlt className="mr-2" /> Share Prediction (Coming Soon)
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default Champion;
