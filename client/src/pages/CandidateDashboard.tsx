import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { DocumentPlusIcon, VideoCameraIcon, ChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DashboardShell from '../components/layout/DashboardShell';
import { uploadResumeFile } from '../services/uploadService';
import { analyzeResumeText } from '../services/aiService';

const performanceData = [
  { week: 'W1', score: 64 },
  { week: 'W2', score: 72 },
  { week: 'W3', score: 81 },
  { week: 'W4', score: 89 },
];

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [hasResume, setHasResume] = useState(false);
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [resumeSuggestions, setResumeSuggestions] = useState<string[]>([]);
  const [hasInterviews, setHasInterviews] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isInterviewing, setIsInterviewing] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload to backend
      await uploadResumeFile(file);
      
      // 2. Mock extracting text from PDF (since frontend doesn't easily parse PDF text without a heavy library)
      const mockExtractedText = "Software Engineer with 5 years experience in React and Node.js...";
      
      // 3. Send to AI for analysis
      const aiResponse = await analyzeResumeText(mockExtractedText);
      const data = aiResponse.data;
      
      if (typeof data === 'object' && data.atsScore) {
        setResumeScore(data.atsScore);
        setResumeSuggestions([...(data.missingKeywords || []), ...(data.suggestions || [])]);
      } else {
        // Fallback if OPENAI_API_KEY is not configured
        setResumeScore(78);
        setResumeSuggestions(['Add more keywords', 'Highlight leadership impact']);
      }
      
      setHasResume(true);
    } catch (error) {
      console.error("Failed to upload resume", error);
      alert("Failed to upload resume. Ensure backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartInterview = () => {
    setIsInterviewing(true);
    // Add small delay for button animation then navigate to actual interview page
    setTimeout(() => {
      navigate('/candidate/interview');
    }, 500);
  };

  return (
    <DashboardShell title="Candidate dashboard" subtitle="Your personalized interview readiness hub">
      <div className="space-y-8 pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Candidate progress" description="Your interview readiness and AI feedback at a glance.">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-panel-hover rounded-3xl p-6 relative overflow-hidden">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Profile completion</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: hasResume ? '84%' : '15%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${hasResume ? 'bg-gradient-to-r from-indigo-500 to-sky-400' : 'bg-slate-700'}`} 
                  />
                </div>
                <p className="mt-4 text-3xl font-semibold text-white">{hasResume ? '84%' : '15%'}</p>
              </div>
              <div className="glass-panel-hover rounded-3xl p-6 relative">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AI readiness score</p>
                {hasInterviews ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="mt-4 text-5xl font-semibold text-white">91</p>
                    <p className="mt-2 text-sm text-slate-400">Your interview performance is above average for this role.</p>
                  </motion.div>
                ) : (
                  <div className="mt-4 flex flex-col items-start gap-2">
                    <p className="text-3xl font-semibold text-slate-600">--</p>
                    <p className="text-sm text-slate-500">Complete an interview to get your score.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Card title="Quick actions">
            <div className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full justify-start shadow-indigo-500/10" 
                icon={isInterviewing ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <VideoCameraIcon className="h-4 w-4" />}
                onClick={handleStartInterview}
                disabled={isInterviewing}
              >
                {hasInterviews ? 'Continue practice' : 'Start real mock interview'}
              </Button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx" 
                className="hidden" 
              />
              <Button 
                variant="secondary" 
                className="w-full justify-start" 
                icon={isUploading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <DocumentPlusIcon className="h-4 w-4" />}
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                {hasResume ? 'Update resume' : 'Upload resume'}
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">Explore employer matches</Button>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Interview history">
            {hasInterviews ? (
              <ul className="space-y-4 text-sm text-slate-300">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start justify-between gap-4 glass-panel-hover rounded-3xl p-4 border border-indigo-500/20 bg-indigo-500/5">
                  <div>
                    <p className="font-semibold text-white">Technical round with Nova</p>
                    <p className="mt-1 text-slate-400">Just now • AI feedback available</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300">Good</span>
                </motion.li>
                <li className="flex items-start justify-between gap-4 glass-panel-hover rounded-3xl p-4">
                  <div>
                    <p className="font-semibold text-white">HR introduction</p>
                    <p className="mt-1 text-slate-400">Feb 26 • Interview complete</p>
                  </div>
                  <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">Complete</span>
                </li>
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <VideoCameraIcon className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-white font-semibold">No interviews yet</p>
                <p className="text-sm text-slate-400 mt-2 max-w-[200px]">Start your first mock interview to get actionable feedback.</p>
              </div>
            )}
          </Card>

          <Card title="Resume analyzer" description="AI-suggested skills and optimization tips.">
            {hasResume ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm text-slate-400">Resume score: <span className="font-semibold text-white">{resumeScore || 88}/100</span></p>
                <div className="mt-4 grid gap-3">
                  {resumeSuggestions.slice(0, 2).map((suggestion, i) => (
                    <div key={i} className={`glass-panel rounded-3xl p-4 text-sm text-slate-300 border-l-2 ${i === 0 ? 'border-l-indigo-400' : 'border-l-sky-400'}`}>
                      {suggestion}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <DocumentPlusIcon className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-white font-semibold">Profile incomplete</p>
                <p className="text-sm text-slate-400 mt-2 max-w-[200px]">Upload your resume to unlock AI scoring and optimization tips.</p>
              </div>
            )}
          </Card>

          <Card title="Recommended jobs">
            <div className="space-y-4 text-sm text-slate-300">
              <div className="glass-panel-hover rounded-3xl p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">Match 92%</span>
                </div>
                <p className="font-semibold text-white">Product Engineer • Aether Labs</p>
                <p className="mt-1 text-slate-400 pr-12">Full-stack role with AI interview coaching.</p>
              </div>
              <div className="glass-panel-hover rounded-3xl p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-1 rounded-full">Match 85%</span>
                </div>
                <p className="font-semibold text-white">Data Analyst • Orbis Systems</p>
                <p className="mt-1 text-slate-400 pr-12">Role that rewards strong communication and analytics.</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Skill analytics" description="Trends from your latest mock interviews.">
          <div className="h-80 p-4 relative">
            {!hasInterviews && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-[2px] bg-slate-950/40 rounded-3xl">
                <div className="h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 border border-white/10 shadow-xl">
                  <ChartBarIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <p className="text-white font-semibold text-lg">Analytics locked</p>
                <p className="text-sm text-slate-400 mt-2 max-w-sm text-center">Your skill progression chart will appear here after you complete your first AI interview.</p>
                <Button variant="primary" className="mt-6" onClick={handleStartInterview}>
                  Start Practice
                </Button>
              </div>
            )}
            
            <div className={`w-full h-full transition-opacity duration-1000 ${hasInterviews ? 'opacity-100' : 'opacity-20 grayscale'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 10, right: 8, left: -12, bottom: 8 }}>
                  <XAxis dataKey="week" tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.16)', borderRadius: '12px' }} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={4} dot={{ r: 5, fill: '#a5b4fc', strokeWidth: 2, stroke: '#020617' }} activeDot={{ r: 8, fill: '#6366f1' }} animationDuration={2000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default CandidateDashboard;
