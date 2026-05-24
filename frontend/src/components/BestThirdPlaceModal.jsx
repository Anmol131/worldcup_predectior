import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function BestThirdPlaceModal({ isOpen, thirdPlaceTeams, selectedCodes, onToggle, onClose, onConfirm }) {
  const selectedCount = selectedCodes.length;
  const isValid = selectedCount === 8;
  const selectedSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#0f172a] p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-200">Best 3rd Place Teams</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Select exactly 8 teams</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  Choose the 8 best third-place teams from all 12 groups. These teams will fill the Round of 32 third-place slots.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Selected</p>
                <p className={`mt-1 text-2xl font-semibold ${isValid ? 'text-emerald-200' : 'text-cyan-100'}`}>{selectedCount} / 8</p>
              </div>
            </div>

            <div className="grid max-h-[50vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {thirdPlaceTeams.map((entry) => {
                const checked = selectedSet.has(entry.team.code);
                const disabled = !checked && selectedCount >= 8;

                return (
                  <label
                    key={`${entry.groupId}-${entry.team.code}`}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition ${checked ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:border-cyan-400/30'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-2xl">{entry.team.flag}</span>
                      <div>
                        <p className="text-sm text-slate-400">Group {entry.groupId} - 3rd</p>
                        <p className="text-base font-semibold text-white">{entry.team.name}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => onToggle(entry.team.code)}
                      className="h-5 w-5 accent-emerald-400"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className={`btn-primary ${!isValid ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!isValid}
                onClick={onConfirm}
              >
                Confirm Best 8 Teams
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BestThirdPlaceModal;
