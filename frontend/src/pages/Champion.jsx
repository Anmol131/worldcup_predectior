import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaTrophy, FaShareAlt, FaRedo } from 'react-icons/fa';
import ConfirmModal from '../components/ui/ConfirmModal';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { sessionAPI } from '../services/api';
import { useSession } from '../hooks/useSession';
import { useBracket } from '../hooks/useBracket';
import { useShare } from '../hooks/useSessionData';
import { useToast } from '../components/ui/Toast';

function Champion() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { sessionId, isReady } = useSession();
  const { bracket, isLoading, error } = useBracket(sessionId);
  const { share, shareToken, shareUrl, isSharing, shareError } = useShare(sessionId);
  const [predictorName, setPredictorName] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();

  const champion = bracket?.champion || null;

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
    if (!sessionId) {
      return;
    }

    if (!isLoading && !champion) {
      navigate('/knockout');
    }
  }, [champion, isLoading, navigate, sessionId]);

  useEffect(() => {
    if (shareToken && shareUrl) {
      setShareMessage('Share link created.');
    }
  }, [shareToken, shareUrl]);

  const handleShare = () => {
    setShareMessage('');
    share(predictorName.trim() || 'Anonymous', {
      onSuccess: () => {
        showToast('Prediction saved!', 'success');
      },
      onError: () => {
        showToast('Failed to save — retrying...', 'error');
      },
    });
  };

  const handleStartOver = async () => {
    setShowConfirm(false);

    const currentSessionId = localStorage.getItem('wc2026-session');
    console.log('[StartOver] Deleting session:', currentSessionId);

    if (!currentSessionId) {
      console.error('[StartOver] Missing current session id');
      return;
    }

    try {
      const result = await sessionAPI.resetSession(currentSessionId);
      console.log('[StartOver] Server reset result:', result);

      const { newSessionId, session: freshSession } = result;

      Object.keys(localStorage)
        .filter((key) => key.includes('wc2026'))
        .forEach((key) => localStorage.removeItem(key));

      localStorage.setItem('wc2026-session', newSessionId);
      queryClient.clear();
      queryClient.setQueryData(['groups', newSessionId], { groups: freshSession.groups });
      queryClient.setQueryData(['session', newSessionId], { session: freshSession, ...freshSession });

      window.location.href = '/groups';
    } catch (err) {
      console.error('Reset failed:', err);
      showToast('Failed to reset. Please try again.', 'error');
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Link copied! Share with friends.');
    } catch {
      setShareMessage('Copy failed.');
    }
  };

  if (!isReady || !sessionId || isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:px-10">
        <LoadingSpinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:px-10">
        <ErrorMessage message={error.message || 'Failed to load champion'} />
      </section>
    );
  }

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
              transition={{ repeat: Infinity, repeatType: 'loop', duration: piece.duration, delay: piece.delay, ease: 'linear' }}
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
            <span className="text-5xl">{champion?.flag || '🏆'}</span>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Final selection</p>
              <p className="mt-2 text-xl font-semibold text-white">{champion?.name || 'TBD'}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <button
              className="btn-primary"
              onClick={() => setShowConfirm(true)}
            >
              <FaRedo className="mr-2" /> Start Over
            </button>
            <button className="btn-secondary" onClick={handleShare} disabled={isSharing}>
              <FaShareAlt className="mr-2" /> {isSharing ? 'Creating...' : 'Generate Share Link'}
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Your name (optional)</span>
                <input
                  type="text"
                  value={predictorName}
                  onChange={(event) => setPredictorName(event.target.value)}
                  placeholder="Anonymous"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                />
              </label>
              <button className="btn-primary min-h-[48px] sm:w-[220px]" onClick={handleShare} disabled={isSharing}>
                {isSharing ? <span className="inline-flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Creating...</span> : <><FaShareAlt className="mr-2" /> Generate Share Link 🔗</>}
              </button>
            </div>

            {shareUrl && (
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-[#08111f] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Share URL</p>
                <p className="mt-2 break-all text-sm text-white">{shareUrl}</p>
                <button type="button" className="btn-secondary mt-4" onClick={handleCopy}>
                  Copy Link
                </button>
              </div>
            )}

            {(shareMessage || shareError) && <p className="mt-4 text-sm text-cyan-100">{shareMessage || shareError?.message}</p>}
          </div>
        </div>
      </motion.div>
      <ConfirmModal
        isOpen={showConfirm}
        title="Start Over?"
        message="This will permanently erase all your group picks, bracket selections, and your predicted champion. You'll start completely fresh. This cannot be undone."
        confirmLabel="Yes, erase everything"
        cancelLabel="Cancel"
        onConfirm={handleStartOver}
        onCancel={() => setShowConfirm(false)}
      />
    </section>
  );
}

export default Champion;
