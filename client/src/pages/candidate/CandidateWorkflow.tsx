import { motion } from 'framer-motion';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Card from '../../components/ui/Card';

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
  const currentStepIndex = stepConfig.findIndex((step) => step.key === workflow.currentStep);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 p-8 shadow-soft-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Interview readiness</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Master your hiring journey with AI-led practice</h1>
              <p className="mt-5 max-w-2xl text-slate-300 leading-relaxed">Build momentum through resume, aptitude, technical, coding, and AI interview stages with guidance designed for modern candidates.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface/80 p-6 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current stage</p>
              <p className="mt-3 text-4xl font-semibold text-white capitalize">{workflow.currentStep}</p>
              <p className="mt-2 text-sm text-slate-300">Stay on track as you progress through the next milestone.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Resume ATS</p>
              <p className="mt-3 text-3xl font-semibold text-white">{workflow.resume.atsScore ?? '--'}</p>
              <p className="mt-2 text-sm text-slate-400">AI score based on match and keyword strength.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Workflow progress</p>
              <p className="mt-3 text-3xl font-semibold text-white">{Math.min((currentStepIndex + 1) * 17, 100)}%</p>
              <p className="mt-2 text-sm text-slate-400">Your current position in the hiring pipeline.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Next milestone</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stepConfig[currentStepIndex + 1]?.label ?? 'Final review'}</p>
              <p className="mt-2 text-sm text-slate-400">Prepare for the next phase with targeted guidance.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-surface/80 p-8 shadow-soft-xl">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Step guide</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">A learning-first hiring experience</h2>
          <p className="mt-4 text-slate-400">Each stage is designed to feel like an interactive learning module, with clear progress, practice tasks, and feedback built in.</p>

          <div className="mt-8 space-y-4">
            {stepConfig.map((step, index) => {
              const isActive = step.key === workflow.currentStep;
              const isCompleted = index < currentStepIndex;
              const isLocked = index > currentStepIndex + 1;

              return (
                <div key={step.key} className={`rounded-3xl border px-5 py-4 transition ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : isCompleted
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : isLocked
                    ? 'border-white/10 bg-slate-950/40 text-slate-500'
                    : 'border-white/10 bg-slate-900/70'
                }`}>
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <motion.div
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
