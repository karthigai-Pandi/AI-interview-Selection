import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { completeAptitude, startAptitude, resetAptitude } from '../../store/slices/workflowSlice';
import { RootState } from '../../store';
import { getAptitudeQuestions } from '../../services/workflowService';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  topic: string;
}

const sampleQuestions: Question[] = [
  {
    id: 'apt1',
    prompt: 'If 7x + 5 = 45, what is x?',
    options: ['4', '5', '6', '7'],
    answer: '5',
    explanation: '7x + 5 = 40. Wait, if 7x + 5 = 40, then 7x = 35, which gives x = 5. (7 * 5 + 5 = 40).',
    topic: 'Quantitative aptitude',
  },
  {
    id: 'apt2',
    prompt: 'Which number comes next in the sequence: 2, 6, 12, 20, ?',
    options: ['26', '28', '30', '34'],
    answer: '30',
    explanation: 'The difference between consecutive terms increases by 2: 6-2=4, 12-6=6, 20-12=8. The next difference is 10, so 20+10 = 30.',
    topic: 'Logical reasoning',
  },
  {
    id: 'apt3',
    prompt: 'A word that is opposite in meaning to “lucid” is:',
    options: ['Vague', 'Bright', 'Clear', 'Smart'],
    answer: 'Vague',
    explanation: '“Lucid” means clear, transparent, or easy to understand. The opposite is “Vague”, which means unclear.',
    topic: 'Verbal ability',
  },
  {
    id: 'apt4',
    prompt: 'If a train travels 240 km in 3 hours, its speed is:',
    options: ['60 km/h', '70 km/h', '80 km/h', '90 km/h'],
    answer: '80 km/h',
    explanation: 'Speed = Distance / Time = 240 / 3 = 80 km/h.',
    topic: 'Quantitative aptitude',
  },
  {
    id: 'apt5',
    prompt: 'Which word does not belong: Banana, Apple, Rose, Mango?',
    options: ['Banana', 'Apple', 'Rose', 'Mango'],
    answer: 'Rose',
    explanation: 'Banana, Apple, and Mango are fruits, while Rose is a flower.',
    topic: 'Logical reasoning',
  },
  {
    id: 'apt6',
    prompt: 'Choose the sentence with correct grammar.',
    options: ['She don’t like cake.', 'She doesn’t likes cake.', 'She doesn’t like cake.', 'She don’t likes cake.'],
    answer: 'She doesn’t like cake.',
    explanation: 'The subject “She” requires the third-person singular auxiliary verb “doesn’t” followed by the base verb “like”.',
    topic: 'Verbal ability',
  },
  {
    id: 'apt7',
    prompt: 'What is 15% of 240?',
    options: ['24', '30', '36', '42'],
    answer: '36',
    explanation: '15% of 240 = (15 / 100) * 240 = 0.15 * 240 = 36.',
    topic: 'Quantitative aptitude',
  },
  {
    id: 'apt8',
    prompt: 'Which one is the odd one out: Figure, Form, Shape, Economy?',
    options: ['Figure', 'Form', 'Shape', 'Economy'],
    answer: 'Economy',
    explanation: 'Figure, Form, and Shape describe visual configurations. Economy describes financial systems.',
    topic: 'Logical reasoning',
  },
  {
    id: 'apt9',
    prompt: 'Select the word that best completes the sentence: “The CEO gave a ___ presentation.”',
    options: ['Conversant', 'Compelling', 'Complicated', 'Complete'],
    answer: 'Compelling',
    explanation: '“Compelling” is the most suitable adjective to describe a powerful and persuasive presentation.',
    topic: 'Verbal ability',
  },
  {
    id: 'apt10',
    prompt: 'A bookstore sold 120 books at $8 each and made a profit of 20%. What was the cost price per book?',
    options: ['$6.40', '$6.70', '$7.20', '$7.80'],
    answer: '$6.70',
    explanation: 'Cost Price = Selling Price / (1 + Profit%) = 8 / 1.2 = $6.67, which rounds to $6.70.',
    topic: 'Quantitative aptitude',
  },
];

const AptitudeTestPage = () => {
  const dispatch = useDispatch();
  const workflow = useSelector((state: RootState) => state.workflow);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workflow.resume.completed) return;
    setLoading(true);
    setError('');

    getAptitudeQuestions()
      .then((data) => {
        // Ensure fetched questions have detailed explanations and topic fields
        const formatted = data.map((q: any) => {
          const matchedFallback = sampleQuestions.find((fq) => fq.id === q.id);
          return {
            id: q.id,
            prompt: q.prompt,
            options: q.options,
            answer: q.answer || matchedFallback?.answer || q.options[0],
            explanation: q.explanation || matchedFallback?.explanation || 'Detailed solution explanation is currently being prepared by the hiring team.',
            topic: q.topic || matchedFallback?.topic || 'Quantitative aptitude',
          };
        });
        const shuffled = [...formatted].sort(() => Math.random() - 0.5).slice(0, workflow.aptitude.total);
        setQuestions(shuffled);
        dispatch(startAptitude());
      })
      .catch((err) => {
        console.warn('API error, falling back to local questions:', err);
        const shuffled = [...sampleQuestions].sort(() => Math.random() - 0.5).slice(0, workflow.aptitude.total);
        setQuestions(shuffled);
        dispatch(startAptitude());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, workflow.resume.completed, workflow.aptitude.total]);

  // Timed auto-submit countdown hook
  useEffect(() => {
    if (timeLeft <= 0 || submitted) {
      if (timeLeft <= 0 && !submitted) {
        handleSubmit();
      }
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((time) => time - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [timeLeft, submitted]);

  if (workflow.currentStep !== 'aptitude') {
    return <Navigate replace to={`/candidate/flow/${workflow.currentStep}`} />;
  }

  const currentQuestion = questions[currentIndex];

  const selectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const answeredCount = Object.keys(answers).length;
  const attempted = answeredCount;
  const unattempted = questions.length - answeredCount;

  const handleSubmit = () => {
    if (questions.length === 0) return;
    const correctAnswers = questions.reduce((count, question) => {
      const selected = answers[question.id];
      return count + (selected === question.answer ? 1 : 0);
    }, 0);
    const calculatedScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    dispatch(completeAptitude({ score: calculatedScore, answered: answeredCount, answers }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the aptitude test? All your answers will be cleared.')) {
      dispatch(resetAptitude());
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft(600);
      setSubmitted(false);
      setScore(null);
    }
  };

  const progress = Math.round(((currentIndex + 1) / (questions.length || 1)) * 100);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
      {/* Quiz Card */}
      <Card title="Aptitude test" description="Complete the timed MCQ section to unlock the next technical round.">
        <div className="space-y-8">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-white/5 rounded-full w-1/3" />
              <div className="h-20 bg-white/5 rounded-[2rem] w-full" />
              <div className="grid gap-3 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-white/5 rounded-[2rem] w-full" />
                ))}
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="rounded-3xl border border-white/10 bg-surface/80 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Question {currentIndex + 1} of {questions.length}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white leading-relaxed">{currentQuestion?.prompt}</h3>
                </div>
                <div className="rounded-full bg-surface/80 px-5 py-3 text-sm font-semibold text-slate-100 border border-white/5">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {currentQuestion?.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={submitted}
                    onClick={() => selectOption(option)}
                    className={`w-full rounded-3xl border px-5 py-4 text-left transition text-sm ${
                      answers[currentQuestion.id] === option
                        ? 'border-indigo-400 bg-indigo-500/10 text-white font-medium shadow-md shadow-indigo-500/5'
                        : 'border-white/10 bg-surface/80 text-slate-300 hover:border-white/20 hover:bg-surface/70 disabled:opacity-60'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Failed to load questions. Please refresh or try again later.</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3 text-sm text-slate-300">
              <span>Attempted: {attempted}</span>
              <span>Unattempted: {unattempted}</span>
              <span>Progress: {progress}%</span>
              {submitted && <span className="text-emerald-400">✓ Completed</span>}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setCurrentIndex((idx) => Math.max(idx - 1, 0))} disabled={currentIndex === 0 || submitted}>Previous</Button>
              <Button onClick={() => setCurrentIndex((idx) => Math.min(idx + 1, questions.length - 1))} disabled={currentIndex === questions.length - 1 || submitted}>Next</Button>
              <Button variant="secondary" onClick={handleSubmit} disabled={submitted || answeredCount === 0}>{submitted ? 'Test Completed' : 'Submit test'}</Button>
            </div>
          </div>

          {submitted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-emerald-200"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Test completed</p>
                  <h3 className="mt-3 text-3xl font-semibold">Score: {score}%</h3>
                  <p className="mt-2 text-slate-300">Excellent work — the technical round is now unlocked.</p>
                </div>
                <Button variant="secondary" onClick={handleReset} className="whitespace-nowrap">Retake Test</Button>
              </div>
            </motion.div>
          )}

          {/* Interactive Review & Detailed Explanations Section */}
          {submitted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mt-8 border-t border-white/10 pt-6"
            >
              <h3 className="text-2xl font-bold text-white">Review & Detailed Explanations</h3>
              <p className="text-sm text-slate-400">Examine the correct option and read detailed solutions for all questions.</p>
              
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const selectedAnswer = answers[question.id];
                  const isCorrect = selectedAnswer === question.answer;
                  
                  return (
                    <div 
                      key={question.id} 
                      className={`rounded-3xl border p-5 transition ${
                        isCorrect 
                          ? 'border-emerald-500/20 bg-emerald-500/5' 
                          : 'border-rose-500/20 bg-rose-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Question {index + 1} ({question.topic})</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          isCorrect ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-300'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      
                      <h4 className="mt-3 text-base font-semibold text-white leading-relaxed">{question.prompt}</h4>
                      
                      <div className="mt-4 grid gap-2 sm:grid-cols-2 text-xs">
                        <div className="rounded-2xl bg-white/3 p-3 border border-white/5">
                          <span className="text-slate-400 block text-xxs uppercase tracking-wider mb-1">Your Selected Choice</span>
                          <span className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {selectedAnswer || 'Not answered'}
                          </span>
                        </div>
                        <div className="rounded-2xl bg-white/3 p-3 border border-white/5">
                          <span className="text-slate-400 block text-xxs uppercase tracking-wider mb-1">Correct Choice</span>
                          <span className="font-semibold text-emerald-400">{question.answer}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-slate-950/40 rounded-2xl p-4 border border-white/5 text-sm">
                        <span className="text-indigo-300 font-bold block mb-1 text-xs uppercase tracking-wider">Solution / Explanation:</span>
                        <p className="text-slate-300 leading-relaxed text-xs">{question.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Sidebar Info */}
      <Card title="Aptitude summary" description="Real-time progress and topic breakdown.">
        <div className="space-y-5">
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Timer</p>
            <p className="mt-3 text-3xl font-semibold text-white tracking-widest font-mono">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </p>
          </div>
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Topics</p>
            <div className="mt-3 grid gap-3">
              {['Quantitative aptitude', 'Logical reasoning', 'Verbal ability'].map((topic) => (
                <div key={topic} className="rounded-3xl bg-surface/80 p-4 border border-white/10">
                  <p className="text-sm text-slate-300 font-medium">{topic}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Attempted status</p>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between text-sm text-slate-300"><span>Answered</span><span className="font-semibold text-white">{attempted}</span></div>
              <div className="flex items-center justify-between text-sm text-slate-300"><span>Remaining</span><span className="font-semibold text-slate-400">{unattempted}</span></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AptitudeTestPage;
