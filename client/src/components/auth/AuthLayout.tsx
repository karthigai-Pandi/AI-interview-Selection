import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const highlights = [
  { icon: SparklesIcon, text: 'AI-powered mock interviews and scoring' },
  { icon: ShieldCheckIcon, text: 'Secure, role-based access for teams' },
  { icon: UserGroupIcon, text: 'End-to-end candidate hiring workflow' },
];

const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl flex-col justify-center py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-white transition hover:text-primary-100">
          AIVentures
        </Link>
        <Link to="/" className="text-sm text-slate-400 transition hover:text-slate-200">
          Back to home
        </Link>
      </div>

      <div className="grid overflow-hidden rounded-[2rem] border border-white/8 bg-surface/40 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_1.1fr]">
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden flex-col justify-between border-r border-white/6 bg-gradient-to-br from-primary/20 via-slate-900/80 to-accent/10 p-10 lg:flex"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_55%)]" />
          <div className="relative space-y-6">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-100">
              Hiring intelligence
            </p>
            <h1 className="max-w-sm text-3xl font-bold leading-tight text-white">
              Hire smarter with structured AI assessments.
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-slate-300">
              Sign in to continue your interview journey or create an account to start uploading resumes, taking tests, and receiving feedback.
            </p>
          </div>

          <ul className="relative space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 text-primary-100">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-center p-8 sm:p-10"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          </div>

          {children}

          <div className="mt-8 border-t border-white/6 pt-6 text-center text-sm text-slate-400">{footer}</div>
        </motion.section>
      </div>
    </div>
  );
};

export default AuthLayout;
