import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface DashboardShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const DashboardShell = ({ title, subtitle, children }: DashboardShellProps) => (
  <div className="space-y-8">
    <Navbar />
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="rounded-[2.5rem] border border-white/10 bg-surface/80 p-8 shadow-glass backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary-100">{title}</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{subtitle}</h1>
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  </div>
);

export default DashboardShell;
