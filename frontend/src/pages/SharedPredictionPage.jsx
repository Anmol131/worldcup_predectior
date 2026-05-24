import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import { shareAPI } from '../services/api';
import Bracket from '../components/Bracket';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function toDisplayRounds(bracketSnapshot) {
  if (!bracketSnapshot?.rounds) {
    return [];
  }

  return [
    ['Round of 32', bracketSnapshot.rounds.r32 || []],
    ['Round of 16', bracketSnapshot.rounds.r16 || []],
    ['Quarter Finals', bracketSnapshot.rounds.qf || []],
    ['Semi Finals', bracketSnapshot.rounds.sf || []],
    ['Final', bracketSnapshot.rounds.final || []],
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

function SharedPredictionPage() {
  const { shareToken } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['shared-prediction', shareToken],
    queryFn: () => shareAPI.getShared(shareToken),
    enabled: !!shareToken,
  });

  const prediction = data?.prediction || null;

  const displayRounds = useMemo(() => toDisplayRounds(prediction?.bracketSnapshot), [prediction]);

  if (isLoading) {
    return (
      <section className="mx-auto flex max-w-5xl items-center justify-center px-6 py-20">
        <LoadingSpinner />
      </section>
    );
  }

  if (error || !prediction) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-20 text-center text-white">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10">
          <h1 className="text-3xl font-semibold">Prediction not found</h1>
          <p className="mt-3 text-slate-300">The share link is invalid or the prediction was removed.</p>
          <Link to="/groups" className="btn-primary mt-8 inline-flex">Make your own prediction</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-3 pb-16 pt-6 sm:px-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center text-white"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Shared prediction</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{prediction.predictorName || 'Anonymous'}'s 2026 World Cup Prediction</h1>
      </motion.div>

      <div className="mb-6 flex items-center justify-center gap-3 rounded-3xl border border-[#f59e0b]/30 bg-[#0f172a] p-5 text-center text-white">
        <FaTrophy className="h-7 w-7 text-[#f59e0b]" />
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#f59e0b]">Predicted champion</p>
          <p className="text-xl font-semibold">{prediction.champion?.name || 'TBD'}</p>
        </div>
      </div>

      <Bracket rounds={displayRounds} />

      <div className="mt-10 text-center">
        <Link to="/groups" className="btn-primary inline-flex">Make your own prediction →</Link>
      </div>
    </section>
  );
}

export default SharedPredictionPage;