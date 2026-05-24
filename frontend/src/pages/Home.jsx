import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaFootballBall, FaChartLine } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-10">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm text-cyan-100 shadow-glow">
            <FaFootballBall className="h-4 w-4 text-cyan-300" />
            Premium world cup prediction experience
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              FIFA World Cup 2026 Predictor
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Predict group winners, generate the knockout bracket, choose round-by-round winners, and crown the champion through a futuristic tournament platform.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              className="btn-primary"
              onClick={() => navigate('/groups')}
            >
              Start Prediction
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/knockout')}
            >
              View Bracket Preview
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-glass rounded-3xl border border-white/10 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Match engine</p>
              <p className="mt-4 text-2xl font-semibold text-white">Predict every round</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Fill all 12 groups and let the knockout bracket evolve automatically when winners are selected.</p>
            </div>
            <div className="bg-glass rounded-3xl border border-white/10 p-6 shadow-glow">
              <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Performance</p>
              <p className="mt-4 text-2xl font-semibold text-white">Smooth motion</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Responsive animations, neon gradients, and polished glass UI deliver a premium sports experience.</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2rem] border border-cyan-400/10 bg-[#0d1324]/80 p-8 shadow-glow"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,229,255,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.18),_transparent_25%)]" />
          <div className="relative flex min-h-[360px] flex-col justify-between gap-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Prediction Suite</p>
              <h2 className="text-4xl font-semibold text-white">Group Stage mastery meets knockout drama.</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm text-slate-300">Groups</p>
                <p className="mt-3 text-3xl font-semibold text-cyan-100">12</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm text-slate-300">Knockout stages</p>
                <p className="mt-3 text-3xl font-semibold text-violet-100">5 rounds</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              <FaChartLine className="h-5 w-5" />
              Designed for a fast, premium prediction flow with tournament-ready polish.
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Home;
