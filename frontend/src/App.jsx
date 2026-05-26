import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer, ToastProvider, useToast } from './components/ui/Toast';
import Home from './pages/Home';
import GroupStage from './pages/GroupStage';
import KnockoutStage from './pages/KnockoutStage';
import Champion from './pages/Champion';
import SharedPredictionPage from './pages/SharedPredictionPage';
import { SessionProvider } from './hooks/useSession';

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

function AppShell() {
  const { toasts } = useToast();

  return (
    <BrowserRouter>
      <SessionProvider>
        <ScrollToTop />
        <div className="app-shell bg-[#0a0f1e] text-[#f9fafb]">
          <Navbar />
          <AnimatedRoutes />
          <Footer />
          <ToastContainer toasts={toasts} />
        </div>
      </SessionProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}

export default App;