import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DashboardShell from '../components/layout/DashboardShell';
import { motion } from 'framer-motion';

const pipelineData = [
  { stage: 'Applied', value: 42 },
  { stage: 'Screening', value: 28 },
  { stage: 'Interview', value: 16 },
  { stage: 'Offer', value: 7 },
];

const AdminDashboard = () => {
  return (
    <DashboardShell title="HR dashboard" subtitle="Recruitment analytics and hiring operations">
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Total candidates">
            <p className="text-4xl font-semibold text-white">431</p>
          </Card>
          <Card title="Today interviews">
            <p className="text-4xl font-semibold text-white">18</p>
          </Card>
          <Card title="AI Recommendations">
            <p className="text-4xl font-semibold text-white">93%</p>
          </Card>
        </div>
      </motion.div>
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1fr]">
        <Card title="Hiring pipeline" description="A pulse view of candidate flow through every stage.">
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 16, right: 10, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stage" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.16)' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Recent candidate activity" description="Live updates, interview invites, and pipeline notes.">
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white">Nina Patel</p>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">Interview</span>
              </div>
              <p className="mt-2 text-slate-400">Scheduled for March 22 at 10 AM.</p>
            </li>
            <li className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white">Gabe Rivera</p>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300">Recommended</span>
              </div>
              <p className="mt-2 text-slate-400">AI match score 94% for product role.</p>
            </li>
          </ul>
        </Card>
      </div>
      <Card title="Recruitment command center">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h3 className="text-sm uppercase tracking-[0.24em] text-slate-400">Top role</h3>
            <p className="mt-4 text-2xl font-semibold text-white">Engineering Lead</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h3 className="text-sm uppercase tracking-[0.24em] text-slate-400">Live interview rooms</h3>
            <p className="mt-4 text-2xl font-semibold text-white">6</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h3 className="text-sm uppercase tracking-[0.24em] text-slate-400">Pipeline alerts</h3>
            <p className="mt-4 text-2xl font-semibold text-white">3 new</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button>Open scheduler</Button>
          <Button variant="secondary">Export analytics</Button>
        </div>
      </Card>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboard;
