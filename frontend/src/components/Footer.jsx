function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07111d]/80 py-6 text-sm text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>FIFA World Cup 2026 Predictor — built with React, Vite, Tailwind, Framer Motion, and React Query.</p>
        <p className="text-slate-500">Backend-owned state, MongoDB persistence, and shareable predictions.</p>
      </div>
    </footer>
  );
}

export default Footer;
