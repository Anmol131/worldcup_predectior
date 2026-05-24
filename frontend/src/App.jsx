import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import GroupStage from './pages/GroupStage';
import KnockoutStage from './pages/KnockoutStage';
import Champion from './pages/Champion';
import SharedPredictionPage from './pages/SharedPredictionPage';
import { useSession } from './hooks/useSession';
import { sessionAPI } from './services/api';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<GroupStage />} />
          <Route path="/knockout" element={<KnockoutStage />} />
          <Route path="/champion" element={<Champion />} />
          <Route path="/p/:shareToken" element={<SharedPredictionPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const sessionId = useSession();

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    sessionAPI.getOrCreate(sessionId).catch(() => {});
  }, [sessionId]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell bg-[#0a0f1e] text-[#f9fafb]">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;