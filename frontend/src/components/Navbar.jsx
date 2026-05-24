import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaCrown } from 'react-icons/fa';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/groups', label: 'Groups' },
    { to: '/knockout', label: 'Bracket' },
    { to: '/champion', label: 'Champion' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#1f2937] bg-[#0a0f1e]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 text-[#f9fafb]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1f2937] bg-[#111827] text-[#10b981] shadow-glow">
            <FaCrown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6b7280]">World Cup 2026</p>
            <p className="text-sm font-semibold text-[#f9fafb]">Predictor Arena</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `rounded-[20px] px-4 py-2 text-sm font-medium transition duration-200 ${isActive ? 'bg-[#10b981] text-[#06231b]' : 'text-[#cbd5e1] hover:bg-[#111827] hover:text-[#f9fafb]'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#1f2937] bg-[#111827] text-[#cbd5e1] transition duration-200 active:scale-95 md:hidden"
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#1f2937] bg-[#0a0f1e] px-4 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${isActive ? 'bg-[#10b981] text-[#06231b]' : 'border border-[#1f2937] bg-[#111827] text-[#e2e8f0]'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
