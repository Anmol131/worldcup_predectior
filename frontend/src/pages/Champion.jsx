import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaShareAlt, FaRedo } from 'react-icons/fa';
import usePredictionStore from '../store/predictionStore';
import { buildKnockoutRounds } from '../utils/tournament';

function Champion() {
  const navigate = useNavigate();
  const [shareMessage, setShareMessage] = useState('');
  const { groupSelections, bestThirdPlaceTeamCodes, matchWinners, resetPrediction } = usePredictionStore();
  const { champion } = buildKnockoutRounds(groupSelections, matchWinners, bestThirdPlaceTeamCodes);

  const confettiPieces = useMemo(
    () => Array.from({ length: 36 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 1.2,
      duration: 2.8 + Math.random() * 2,
      color: ['#22d3ee', '#34d399', '#a78bfa', '#facc15'][index % 4],
    })),
    [],
  );

  useEffect(() => {
    if (!champion) {
      navigate('/knockout');
    }
  }, [champion, navigate]);

  const handleShare = async () => {
    const text = `My World Cup 2026 champion prediction: ${champion?.name}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'World Cup 2026 Predictor',
          text,
        });
        setShareMessage('Shared successfully.');
        return;
      }

      await navigator.clipboard.writeText(text);
      setShareMessage('Prediction copied to clipboard.');
    } catch {
      setShareMessage('Sharing was cancelled.');
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-glass p-10 text-center shadow-glow backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-0 opacity-90">
          {confettiPieces.map((piece) => (
            <motion.span
              key={piece.id}
              className="absolute top-0 h-3 w-2 rounded-sm"
              style={{ left: piece.left, backgroundColor: piece.color }}
              initial={{ y: -40, rotate: 0, opacity: 0 }}
              animate={{ y: 620, rotate: 340, opacity: [0, 1, 1, 0] }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                duration: piece.duration,
                delay: piece.delay,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
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
            <button className="btn-secondary" onClick={handleShare}>
              <FaShareAlt className="mr-2" /> Share your prediction
            </button>
          </div>

          {shareMessage && <p className="mt-4 text-sm text-cyan-100">{shareMessage}</p>}
        </div>
      </motion.div>
    </section>
  );
}

export default Champion;
