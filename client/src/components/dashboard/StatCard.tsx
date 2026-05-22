import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-glass backdrop-blur-xl">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      </div>
      {icon && <div className="rounded-2xl bg-white/5 p-3 text-slate-200">{icon}</div>}
    </div>
    {description && <p className="text-sm text-slate-400">{description}</p>}
  </div>
);

export default StatCard;
