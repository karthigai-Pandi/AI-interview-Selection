import { motion } from 'framer-motion';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Navbar from '../../components/layout/Navbar';

const stepConfig = [
  { key: 'resume', label: 'Resume Upload', path: 'resume' },
  { key: 'aptitude', label: 'Aptitude Test', path: 'aptitude' },
  { key: 'technical', label: 'Technical MCQ', path: 'technical' },
  { key: 'coding', label: 'Coding Assessment', path: 'coding' },
  { key: 'interview', label: 'AI Interview', path: 'interview' },
  { key: 'performance', label: 'Performance', path: 'performance' },
] as const;

const CandidateWorkflow = () => {
  const location = useLocation();
  const workflow = useSelector((state: RootState) => state.workflow);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentStepIndex = stepConfig.findIndex((step) => step.key === workflow.currentStep);

  return (
    <div className="relative space-y-8 min-h-screen pb-10">
      {/* Decorative Glow Blobs for premium aesthetic attraction */}
      <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[128px] pointer-events-none" />
      <div className="absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[128px] pointer-events-none" />

      {/* Navbar rendered on all flow pages */}
      <Navbar />

      {/* Back to Dashboard Navigation Row */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center"
      >
        <Link 
          to="/candidate" 
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-slate-900 hover:text-white"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
      </motion.div>

      {/* Grid wrapper for Welcome Banner and Steps */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
      >
        {/* Personalized Welcome Banner */}
        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 p-8 shadow-soft-xl relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Hello {user?.name || 'Candidate'}, welcome to our community!
              </p>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl leading-tight">
                Master your hiring journey with AI-led practice
              </h1>
              <p className="max-w-2xl text-slate-300 leading-relaxed text-sm sm:text-base">
                Build momentum through resume, aptitude, technical, coding, and AI interview stages with guidance designed for modern candidates.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface/80 p-6 text-center lg:min-w-[200px]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current stage</p>
              <p className="mt-3 text-3xl font-semibold text-white capitalize">{workflow.currentStep}</p>
              <p className="mt-2 text-xs text-slate-300">Stay on track as you progress through the next milestone.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Resume ATS</p>
              <p className="mt-3 text-3xl font-semibold text-white">{workflow.resume.atsScore ?? '--'}</p>
              <p className="mt-2 text-xs text-slate-400">AI score based on match and keyword strength.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Workflow progress</p>
              <p className="mt-3 text-3xl font-semibold text-white">{Math.min((currentStepIndex + 1) * 17, 100)}%</p>
              <p className="mt-2 text-xs text-slate-400">Your current position in the hiring pipeline.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Next milestone</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stepConfig[currentStepIndex + 1]?.label ?? 'Final review'}</p>
              <p className="mt-2 text-xs text-slate-400">Prepare for the next phase with targeted guidance.</p>
            </div>
          </div>
        </div>

        {/* Step Guide Sidebar */}
        <div className="rounded-[2.5rem] border border-white/10 bg-surface/80 p-8 shadow-soft-xl backdrop-blur-md">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Step guide</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">A learning-first experience</h2>
          <p className="mt-4 text-slate-400 text-sm">Each stage is designed to feel like an interactive learning module, with clear progress, practice tasks, and feedback built in.</p>

          <div className="mt-8 space-y-4">
            {stepConfig.map((step, index) => {
              const isActive = step.key === workflow.currentStep;
              const isCompleted = index < currentStepIndex;
              const isLocked = index > currentStepIndex + 1;

              return (
                <motion.div 
                  key={step.key} 
                  whileHover={isLocked ? {} : { scale: 1.02, x: 4 }}
                  whileTap={isLocked ? {} : { scale: 0.98 }}
                  className={`rounded-3xl border px-5 py-4 transition ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-400/5'
                      : isCompleted
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-400/5'
                      : isLocked
                      ? 'border-white/10 bg-slate-950/40 text-slate-500 cursor-not-allowed'
                      : 'border-white/10 bg-slate-900/70 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Step {index + 1}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{step.label}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      isActive
                        ? 'bg-cyan-400/10 text-cyan-300'
                        : isCompleted
                        ? 'bg-emerald-400/10 text-emerald-300'
                        : 'bg-white/5 text-slate-400'
                    }`}>
                      {isActive ? 'Current' : isCompleted ? 'Done' : isLocked ? 'Locked' : 'Ready'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Outlet with custom animated transition wrapper */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-6"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default CandidateWorkflow;
