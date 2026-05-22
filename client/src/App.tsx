import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const location = useLocation();
  const { themeClass, toggleTheme } = useDarkMode();
  const pageTransition = useMemo(
    () => ({
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -16 },
      transition: { duration: 0.45, ease: 'easeOut' },
    }),
    []
  );

  return (
    <div className={`${themeClass} min-h-screen bg-slate-950 text-slate-100`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={location.pathname} {...pageTransition} className="min-h-screen">
          <div className="mx-auto max-w-[1400px] px-5 py-4">
            <button
              onClick={toggleTheme}
              className="mb-4 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/20"
            >
              Toggle theme
            </button>
            <Routes location={location} key={location.pathname}>
              <Route path="/*" element={<AppRoutes />} />
            </Routes>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
