import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon, ChartBarIcon, VideoCameraIcon, DocumentTextIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';

const featureCards = [
  { title: 'AI Mock Interviews', description: 'Real-time evaluation, dynamic difficulty, and actionable feedback.', icon: VideoCameraIcon },
  { title: 'Resume Intelligence', description: 'Upload, scan, and optimize resumes with ATS scoring.', icon: DocumentTextIcon },
  { title: 'Smart Hiring Pipeline', description: 'Candidate ranking, scheduling and team collaboration.', icon: CalendarDaysIcon },
  { title: 'Advanced Analytics', description: 'Deep insights into candidate performance and hiring metrics.', icon: ChartBarIcon },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-24">
      <Navbar />

      <section className="relative px-6 sm:px-10">
        <div className="absolute inset-x-0 -top-44 h-[580px] w-full bg-gradient-to-b from-slate-900 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center mt-12">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-sm text-indigo-200 backdrop-blur-md">
              <SparklesIcon className="h-5 w-5 text-indigo-400" />
              <span>Enterprise hiring intelligence with real candidate momentum</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-7xl leading-tight">
              Build the ideal hiring workflow with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400">AI-powered candidate journeys</span>.
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-xl text-lg text-slate-400 leading-relaxed">
              From resume upload to mock interviews and performance analytics, manage every stage in one polished platform with live coaching, predictive scoring, and immersive candidate experiences.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-5 pt-4">
              <Button className="shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                Explore the workflow
              </Button>
              <Button variant="ghost" icon={<ArrowRightIcon className="h-4 w-4" />} className="hover:bg-white/5">
                Schedule a demo
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:max-w-md pt-6">
              <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Trusted by</p>
                <p className="mt-3 text-2xl font-semibold text-white">Recruiters & Teams</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Performance gain</p>
                <p className="mt-3 text-2xl font-semibold text-white">+32% faster hiring cycles</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-indigo-500/20 to-purple-500/20 rounded-[3rem] blur-3xl opacity-50" />
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Company dashboard</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Horizon Talent</h2>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">Hiring in progress</div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] bg-slate-900/90 p-6 border border-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Open roles tracked</p>
                      <p className="mt-2 text-3xl font-bold text-white">14</p>
                    </div>
                    <div className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">+18% QoQ</div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[2rem] bg-slate-900/90 p-4 border border-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mock interviews</p>
                    <p className="mt-3 text-2xl font-semibold text-white">82</p>
                  </div>
                  <div className="rounded-[2rem] bg-slate-900/90 p-4 border border-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Resume score</p>
                    <p className="mt-3 text-2xl font-semibold text-white">91%</p>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-gradient-to-br from-slate-900/90 via-indigo-950/90 to-slate-900/90 p-5 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Candidate progress</span>
                    <span className="text-sm text-cyan-300">Live results</span>
                  </div>
                  <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 sm:px-10 grid gap-6 lg:grid-cols-2 mt-12">
        <div className="glass-panel space-y-8 rounded-[2.5rem] p-10 bg-slate-950/80 border border-white/10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Platform highlights</p>
            <h2 className="mt-4 text-4xl font-bold text-white leading-tight">Your next-gen hiring stack.</h2>
          </div>
          <p className="max-w-xl text-slate-400 text-lg">
            From AI mock interviews to resume analysis, candidate ranking, and real-time collaboration — every tool is designed for enterprise talent teams.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 pt-4">
            <div className="glass-panel-hover rounded-3xl bg-slate-900/50 p-6 border border-white/5">
              <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <VideoCameraIcon className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Interview AI</h3>
              <p className="mt-2 text-sm text-slate-400">Adaptive questioning and instant coaching feedback.</p>
            </div>
            <div className="glass-panel-hover rounded-3xl bg-slate-900/50 p-6 border border-white/5">
              <div className="h-10 w-10 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                <ChartBarIcon className="w-5 h-5 text-cyan-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Pipeline visibility</h3>
              <p className="mt-2 text-sm text-slate-400">See every stage and health score in a single dashboard.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
            <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group bg-slate-950/80 border border-white/10">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-colors" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Analytics</p>
              <p className="mt-4 text-6xl font-bold text-white tracking-tighter">78<span className="text-indigo-400">%</span></p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">Average candidate response improvement after AI coaching.</p>
            </div>
            <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group bg-slate-950/80 border border-white/10">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-cyan-500/30 transition-colors" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Availability</p>
              <p className="mt-4 text-6xl font-bold text-white tracking-tighter">24<span className="text-cyan-400">/7</span></p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">Interview automation and analytics available worldwide.</p>
            </div>
          </div>
        </section>
      </div>
    );
  };

export default LandingPage;
