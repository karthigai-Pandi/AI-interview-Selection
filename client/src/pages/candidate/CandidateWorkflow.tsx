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
    <div className="space-y-7">
      <Card title="Candidate workflow" description="Complete the hiring pipeline one stage at a time.">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current stage</p>
            <p className="mt-3 text-2xl font-semibold text-white">{workflow.currentStep}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Resume ATS</p>
            <p className="mt-3 text-3xl font-semibold text-white">{workflow.resume.atsScore ?? '--'}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Progress</p>
            <p className="mt-3 text-3xl font-semibold text-white">{Math.min((currentStepIndex + 1) * 17, 100)}%</p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Workflow steps</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Follow the candidate journey</h2>
          </div>
          <div className="hidden gap-2 xl:flex">
            {stepConfig.map((step, index) => {
              const isActive = step.key === workflow.currentStep;
              const isAvailable = index <= currentStepIndex + 1;
              return (
                <NavLink
                  key={step.key}
                  to={`/candidate/${step.path}`}
                  className={({ isActive: isNavActive }) =>
                    `rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isNavActive || isActive
                        ? 'border-indigo-400 bg-indigo-500/10 text-white'
                        : isAvailable
                        ? 'border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                        : 'pointer-events-none border-white/5 text-slate-600'
                    }`
                  }
                >
                  {step.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </Card>

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
