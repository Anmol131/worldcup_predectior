import { NavLink } from 'react-router-dom';
import { FaBars, FaCrown } from 'react-icons/fa';

function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#08101f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 shadow-glow">
            <FaCrown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200">World Cup 2026</p>
            <p className="text-sm text-slate-300">Predictor Arena</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-cyan-200' : 'text-slate-300 hover:text-white'}>Home</NavLink>
          <NavLink to="/groups" className={({ isActive }) => isActive ? 'text-cyan-200' : 'text-slate-300 hover:text-white'}>Groups</NavLink>
          <NavLink to="/knockout" className={({ isActive }) => isActive ? 'text-cyan-200' : 'text-slate-300 hover:text-white'}>Bracket</NavLink>
          <NavLink to="/champion" className={({ isActive }) => isActive ? 'text-cyan-200' : 'text-slate-300 hover:text-white'}>Champion</NavLink>
        </nav>

        <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-100 md:hidden">
          <FaBars className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
