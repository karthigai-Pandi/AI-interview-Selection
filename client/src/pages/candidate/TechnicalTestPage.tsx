import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { completeTechnical, setTechnicalDifficulty, resetTechnical } from '../../store/slices/workflowSlice';
import { RootState } from '../../store';
import { getTechnicalQuestions } from '../../services/workflowService';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const questionBank: Question[] = [
  // EASY
  {
    id: 'tech_e1',
    prompt: 'Which of these is a React hook for managing side effects?',
    options: ['useState', 'useMemo', 'useEffect', 'useContext'],
    answer: 'useEffect',
    explanation: 'useEffect is the built-in React hook designed specifically to run side effects in functional components.',
    category: 'React.js',
    difficulty: 'easy',
  },
  {
    id: 'tech_e2',
    prompt: 'In JavaScript, which keyword declares a block-scoped variable that cannot be reassigned?',
    options: ['var', 'let', 'const', 'both let and const'],
    answer: 'const',
    explanation: 'The const keyword creates a block-scoped reference to a value that cannot be reassigned.',
    category: 'JavaScript',
    difficulty: 'easy',
  },
  {
    id: 'tech_e3',
    prompt: 'What is the default port for MongoDB?',
    options: ['3306', '27017', '8080', '5432'],
    answer: '27017',
    explanation: 'MongoDB instances use port 27017 as their default communication port.',
    category: 'MongoDB',
    difficulty: 'easy',
  },
  {
    id: 'tech_e4',
    prompt: 'Which CSS property controls the spacing between letters?',
    options: ['line-height', 'letter-spacing', 'word-spacing', 'text-indent'],
    answer: 'letter-spacing',
    explanation: 'The letter-spacing property adds or subtracts space between characters in a text block.',
    category: 'HTML/CSS',
    difficulty: 'easy',
  },
  {
    id: 'tech_e5',
    prompt: 'A class in Object-Oriented Programming (OOP) is best described as:',
    options: ['An instance of a method', 'A reusable blueprint', 'A dynamic variable', 'A function invocation'],
    answer: 'A reusable blueprint',
    explanation: 'A class is a structural template or blueprint from which individual objects (instances) are created.',
    category: 'OOPs',
    difficulty: 'easy',
  },
  
  // MEDIUM
  {
    id: 'tech_m1',
    prompt: 'Which React hook should be used for memoizing expensive computations?',
    options: ['useState', 'useEffect', 'useCallback', 'useMemo'],
    answer: 'useMemo',
    explanation: 'useMemo returns a memoized value of a function execution, preventing recalculations on every render unless dependencies change.',
    category: 'React.js',
    difficulty: 'medium',
  },
  {
    id: 'tech_m2',
    prompt: 'Which statement is true about MongoDB?',
    options: ['It is a relational database', 'It stores data in dynamic JSON-like documents', 'It relies strictly on SQL queries', 'It cannot scale horizontally'],
    answer: 'It stores data in dynamic JSON-like documents',
    explanation: 'MongoDB is a document-oriented NoSQL database that stores data in flexible BSON documents.',
    category: 'MongoDB',
    difficulty: 'medium',
  },
  {
    id: 'tech_m3',
    prompt: 'In Node.js, which built-in module is commonly used to create web servers?',
    options: ['fs', 'http', 'path', 'crypto'],
    answer: 'http',
    explanation: 'The native http module provides tools to establish a basic web server.',
    category: 'Node.js',
    difficulty: 'medium',
  },
  {
    id: 'tech_m4',
    prompt: 'What is the database ACID property that guarantees that all transactions are committed or none are?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    answer: 'Atomicity',
    explanation: 'Atomicity ensures that a transaction is treated as a single, indivisible unit of work: either all updates are committed, or none are.',
    category: 'DBMS',
    difficulty: 'medium',
  },
  {
    id: 'tech_m5',
    prompt: 'Which of the following describes the OOP principle of Encapsulation?',
    options: ['Defining a child class from a parent', 'Hiding implementation details and exposing only safe methods', 'Overloading a function name', 'Resolving function signatures at runtime'],
    answer: 'Hiding implementation details and exposing only safe methods',
    explanation: 'Encapsulation restricts direct access to some of an object’s components, packaging variables and methods together.',
    category: 'OOPs',
    difficulty: 'medium',
  },

  // HARD
  {
    id: 'tech_h1',
    prompt: 'In JavaScript Event Loop, which of the following queues are executed first after the current execution context completes?',
    options: ['Task Queue (Macrotasks)', 'Microtask Queue (Promises, queueMicrotask)', 'Animation Frame Callback Queue', 'RequestIdleCallback Queue'],
    answer: 'Microtask Queue (Promises, queueMicrotask)',
    explanation: 'Microtasks are processed immediately after the call stack clears and before rendering or proceeding to the next event loop tick.',
    category: 'JavaScript',
    difficulty: 'hard',
  },
  {
    id: 'tech_h2',
    prompt: 'What is React Fiber?',
    options: ['A new library for building animations', 'A complete rewrite of React core algorithm for virtual DOM reconciliation', 'A state management library similar to Redux', 'A lightweight CSS grid framework'],
    answer: 'A complete rewrite of React core algorithm for virtual DOM reconciliation',
    explanation: 'React Fiber is the implementation of React’s core reconciliation algorithm, enabling incremental rendering.',
    category: 'React.js',
    difficulty: 'hard',
  },
  {
    id: 'tech_h3',
    prompt: 'What DBMS concept refers to a database lock where transactions can read data but cannot modify it?',
    options: ['Shared Lock (S-Lock)', 'Exclusive Lock (X-Lock)', 'Intent Lock (I-Lock)', 'Optimistic Lock'],
    answer: 'Shared Lock (S-Lock)',
    explanation: 'A Shared Lock permits concurrent transactions to read a resource, preventing modifications until all shared locks are released.',
    category: 'DBMS',
    difficulty: 'hard',
  },
  {
    id: 'tech_h4',
    prompt: 'In OOP, resolving a virtual function call at runtime is an example of which of the following?',
    options: ['Static binding', 'Compile-time polymorphism', 'Dynamic binding / Runtime polymorphism', 'Data hiding'],
    answer: 'Dynamic binding / Runtime polymorphism',
    explanation: 'Dynamic binding defers the resolution of method signatures until execution time, enabling override polymorphism.',
    category: 'OOPs',
    difficulty: 'hard',
  },
];

const TechnicalTestPage = () => {
  const dispatch = useDispatch();
  const workflow = useSelector((state: RootState) => state.workflow);
  const [dbQuestions, setDbQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes technical timer
  const [loading, setLoading] = useState(false);

  // Fetch questions from the backend API on mount
  useEffect(() => {
    if (!workflow.aptitude.completed) return;
    setLoading(true);
    getTechnicalQuestions()
      .then((data) => {
        // Ensure fetched questions have answer, explanation, and difficulty fields
        const formatted = data.map((q: any) => {
          const matchedFallback = questionBank.find((fq) => fq.id === q.id);
          return {
            id: q.id,
            prompt: q.prompt,
            options: q.options,
            answer: q.answer || matchedFallback?.answer || q.options[0],
            explanation: q.explanation || matchedFallback?.explanation || 'Detailed solution explanation is currently being prepared by the hiring team.',
            category: q.category || matchedFallback?.category || 'General CS',
            difficulty: q.difficulty || matchedFallback?.difficulty || 'medium',
          };
        });
        setDbQuestions(formatted);
      })
      .catch((err) => {
        console.warn('API error, falling back to local questions:', err);
        setDbQuestions(questionBank);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [workflow.aptitude.completed]);

  // Dynamically filter and randomize questions based on chosen difficulty
  const questions = useMemo(() => {
    const pool = dbQuestions.length > 0 ? dbQuestions : questionBank;
    return [...pool]
      .filter((q) => q.difficulty === workflow.technical.difficulty)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(workflow.technical.total, 8));
  }, [dbQuestions, workflow.technical.difficulty, workflow.technical.total]);

  // Technical countdown timer hook
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

  // Reset index if filtered questions change
  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
  }, [workflow.technical.difficulty]);

  if (workflow.currentStep !== 'technical') {
    return <Navigate replace to={`/candidate/flow/${workflow.currentStep}`} />;
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleSubmit = () => {
    if (questions.length === 0) return;
    const correct = questions.reduce((count, question) => {
      const selected = answers[question.id];
      return count + (selected === question.answer ? 1 : 0);
    }, 0);
    const normalized = Math.round((correct / questions.length) * 100);
    setScore(normalized);
    setSubmitted(true);
    dispatch(completeTechnical({ score: normalized, answered: Object.keys(answers).length, answers }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the technical test? All your answers will be cleared.')) {
      dispatch(resetTechnical());
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft(480);
      setSubmitted(false);
      setScore(null);
    }
  };

  const difficultyOptions: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / (questions.length || 1)) * 100);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr] relative">
      {/* Quiz Card */}
      <Card title="Technical MCQ round" description="Answer domain-specific questions across JavaScript, React, Node, MongoDB, HTML/CSS, DBMS and OOPs.">
        <div className="space-y-8">
          {/* Difficulty & Counter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Select Difficulty Level</p>
              <div className="mt-3 flex gap-2 flex-wrap bg-slate-950/60 p-1 rounded-full border border-white/5 max-w-max">
                {difficultyOptions.map((level) => (
                  <button
                    key={level}
                    type="button"
                    disabled={submitted}
                    onClick={() => dispatch(setTechnicalDifficulty(level))}
                    className={`rounded-full px-5 py-2 text-xs font-bold uppercase transition ${
                      workflow.technical.difficulty === level
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-transparent text-slate-400 hover:text-white disabled:opacity-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-surface/80 px-4 py-3 text-xs text-slate-300 border border-white/5">
              {submitted ? 'Assessment submitted' : `${questions.length} questions loaded`}
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-white/5 rounded-full w-1/4" />
                <div className="h-20 bg-white/5 rounded-[2rem] w-full" />
                <div className="grid gap-3 mt-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 bg-white/5 rounded-[2rem] w-full" />
                  ))}
                </div>
              </div>
            ) : currentQuestion ? (
              <motion.div 
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-white/10 bg-surface/80 p-6 relative overflow-hidden"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300 font-semibold">Category: {currentQuestion.category}</p>
                <h3 className="mt-4 text-xl font-semibold text-white leading-relaxed">{currentQuestion.prompt}</h3>
                
                <div className="mt-6 grid gap-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleAnswer(option)}
                      className={`w-full rounded-3xl border px-5 py-4 text-left transition text-sm ${
                        answers[currentQuestion.id] === option
                          ? 'border-cyan-400 bg-cyan-500/10 text-white font-medium shadow-md shadow-cyan-500/5'
                          : 'border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20 hover:bg-slate-800 disabled:opacity-60'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <p className="text-slate-400 text-sm">No questions found for this difficulty. Please select another difficulty.</p>
            )}
          </AnimatePresence>

          {/* Nav Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
            <div className="flex gap-3">
              <Button onClick={() => setCurrentIndex((idx) => Math.max(idx - 1, 0))} disabled={currentIndex === 0 || submitted}>Previous</Button>
              <Button onClick={() => setCurrentIndex((idx) => Math.min(idx + 1, questions.length - 1))} disabled={currentIndex === questions.length - 1 || submitted}>Next</Button>
            </div>
            <Button variant="secondary" onClick={handleSubmit} disabled={submitted || answeredCount === 0}>{submitted ? 'Test Completed' : 'Submit answers'}</Button>
          </div>

          {/* Scoring Banner */}
          {submitted && score !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-slate-100"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-300 font-bold">Round Completed successfully!</p>
                  <h3 className="mt-3 text-4xl font-semibold text-white">Score: {score}%</h3>
                  <p className="mt-2 text-sm text-slate-300">Great job! The Coding Assessment round is now unlocked.</p>
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
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Question {index + 1} ({question.category})</p>
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

      {/* Review Side Panel */}
      <Card title="Review panel" description="Overview of your MCQ progress and active timer.">
        <div className="space-y-5">
          {/* Active Timer */}
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10 relative overflow-hidden">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold mb-2">Time Remaining</p>
            <p className="text-3xl font-semibold text-white tracking-widest font-mono">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold">Answered</p>
            <p className="mt-3 text-2xl font-bold text-white">{answeredCount} / {questions.length}</p>
          </div>
          
          <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold">Selected difficulty</p>
            <p className="mt-3 text-lg font-bold text-white capitalize">{workflow.technical.difficulty}</p>
          </div>

          <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold">Progress</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <p className="mt-3 text-xs text-slate-400">{progressPercent}% complete</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TechnicalTestPage;
