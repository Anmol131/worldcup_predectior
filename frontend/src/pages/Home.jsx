import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaChartLine, FaFootballBall, FaGlobe, FaTrophy, FaUsers } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();

  const particles = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
  }));

  return (
    <main className="home-page relative mx-auto w-full max-w-[1440px] overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-10 lg:pb-20">
      <div className="home-ambient" aria-hidden="true">
        <div className="home-ambient__image" />
        <div className="home-ambient__glow" />
        <div className="home-ambient__particles">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="home-particle"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}vw`,
                top: `${particle.top}vh`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:min-h-[calc(100vh-9rem)]">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              THE WORLD CUP IS YOURS TO <span className="text-[#05ff91]">PREDICT</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Step into the arena. Build your bracket, forecast the group stages, and claim your spot on the global leaderboard with a cinematic tournament experience.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button className="btn-primary gap-2 px-6 py-3 text-base" onClick={() => navigate('/groups')}>
              Enter Arena
              <FaArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Match engine</p>
              <p className="mt-4 text-2xl font-semibold text-white">Predict every round</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Fill the 12 groups, then let the knockout bracket resolve as winners are selected.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-[#5cfbff]">Performance</p>
              <p className="mt-4 text-2xl font-semibold text-white">Smooth motion</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">A polished glass UI, layered glow, and subtle motion keep the page feeling alive.</p>
            </div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1324]/80 p-5 shadow-glow backdrop-blur-2xl sm:p-7"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(5,255,145,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(71,214,255,0.16),_transparent_28%)]" />

          <div className="relative space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Prediction suite</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Group stage mastery meets knockout drama.</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-cyan-100">
                  <FaGlobe className="h-5 w-5 text-cyan-300" />
                  <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Nations</span>
                </div>
                <p className="mt-4 text-4xl font-semibold text-white">211</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-[#5cfbff]">
                  <FaUsers className="h-5 w-5 text-[#5cfbff]" />
                  <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Teams</span>
                </div>
                <p className="mt-4 text-4xl font-semibold text-white">48</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-[#05ff91]/10 p-4 text-sm text-cyan-100 sm:p-5">
              <div className="flex items-start gap-3">
                <FaChartLine className="mt-0.5 h-5 w-5 shrink-0" />
                <p>Designed for a fast, premium prediction flow with tournament-ready polish.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl">
                <FaTrophy className="mx-auto h-5 w-5 text-[#ffd700]" />
                <p className="mt-3 text-2xl font-semibold text-white">1</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">Champion</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-center backdrop-blur-xl sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Live flow</p>
                <p className="mt-3 text-lg font-medium text-white">Pick groups, build the bracket, and crown the winner.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Home;
