import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import usePredictionStore from '../store/predictionStore';
import { buildKnockoutRounds, getGroupProgress } from '../utils/tournament';
import Bracket from '../components/Bracket';

function KnockoutStage() {
  const navigate = useNavigate();
  const { groupSelections, bestThirdPlaceTeamCodes, matchWinners, setMatchWinner, generated } = usePredictionStore();
  const { rounds, champion } = useMemo(
    () => buildKnockoutRounds(groupSelections, matchWinners, bestThirdPlaceTeamCodes),
    [groupSelections, matchWinners, bestThirdPlaceTeamCodes],
  );

  const progress = getGroupProgress(groupSelections);

  if (!generated) {
    return (
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center sm:px-10">
        <div className="bg-glass rounded-[2rem] border border-white/10 p-10 shadow-glow">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Bracket unavailable</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Finish the group stage first.</h1>
          <p className="mt-3 text-slate-300">Your knockout stage will populate once all group predictions are complete.</p>
          <button className="btn-primary mt-8" onClick={() => navigate('/groups')}>
            Complete Groups
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:px-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-glass p-8 shadow-glow backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Knockout Stage</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Tournament bracket action</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">Choose winners round-by-round and watch the bracket evolve into your predicted champion.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-glow">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Group progress</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-100">{progress.complete} / {progress.total}</p>
          </div>
        </div>
      </div>

      <Bracket rounds={rounds} onPick={setMatchWinner} />

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
    </section>
  );
}

export default KnockoutStage;
