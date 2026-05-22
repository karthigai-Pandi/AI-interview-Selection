import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { RootState } from '../../store';

const PerformanceAnalysisPage = () => {
  const workflow = useSelector((state: RootState) => state.workflow);

  if (!workflow.interview.completed) {
    return <Navigate replace to="/candidate/interview" />;
  }

  const data = [
    { name: 'Resume', score: workflow.resume.atsScore ?? 0 },
    { name: 'Aptitude', score: workflow.aptitude.score ?? 0 },
    { name: 'Technical', score: workflow.technical.score ?? 0 },
    { name: 'Coding', score: workflow.coding.score ?? 0 },
    { name: 'Interview', score: workflow.interview.confidenceScore ?? 0 },
  ];

  const totalScore = Math.round((data.reduce((sum, item) => sum + item.score, 0) / (data.length * 100)) * 100);

  return (
    <div className="space-y-6">
      <Card title="Performance analysis" description="Final candidate scoring, ranking, and AI feedback after all rounds.">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl bg-surface/80 p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Overall score</p>
            <p className="mt-4 text-5xl font-semibold text-white">{totalScore}%</p>
          </div>
          <div className="rounded-3xl bg-surface/80 p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Candidate ranking</p>
            <p className="mt-4 text-5xl font-semibold text-white">Top 12%</p>
          </div>
          <div className="rounded-3xl bg-surface/80 p-6 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Confidence analysis</p>
            <p className="mt-4 text-5xl font-semibold text-white">{workflow.interview.confidenceScore}%</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card title="Score breakdown" description="Individual stage component performance.">
          <div className="grid gap-4">
            {data.map((item) => (
              <div key={item.name} className="rounded-3xl border border-white/10 bg-surface/80 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm uppercase tracking-[0.18em] text-slate-300">{item.name}</span>
                  <span className="text-xl font-semibold text-white">{item.score}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface/80">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Performance graph" description="Visual career readiness indicator.">
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.16)' }} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="AI feedback report" description="Actionable recommendations for hiring managers and candidates.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <h3 className="text-lg font-semibold text-white">Resume</h3>
            <p className="mt-3 text-slate-300">Improve keyword density for React and Node.js experience. Add measurable delivery achievements.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <h3 className="text-lg font-semibold text-white">Interview</h3>
            <p className="mt-3 text-slate-300">Focus on structured answers, maintain pace, and mention impact metrics. Use confident language.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <h3 className="text-lg font-semibold text-white">Coding</h3>
            <p className="mt-3 text-slate-300">Optimize edge-case handling and add thorough input validation for production readiness.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <h3 className="text-lg font-semibold text-white">Next step</h3>
            <p className="mt-3 text-slate-300">Ready for a live hiring review. Schedule the final round with your recruiter.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PerformanceAnalysisPage;
