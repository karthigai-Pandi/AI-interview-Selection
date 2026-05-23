import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { completeAptitude, startAptitude } from '../../store/slices/workflowSlice';
import { RootState } from '../../store';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  topic: string;
}

const sampleQuestions: Question[] = [
  {
    id: 'apt1',
    prompt: 'If 7x + 5 = 45, what is x?',
    options: ['4', '5', '6', '7'],
    answer: '5',
    topic: 'Quantitative aptitude',
  },
  {
    id: 'apt2',
    prompt: 'Which number comes next in the sequence: 2, 6, 12, 20, ?',
    options: ['26', '28', '30', '34'],
    answer: '30',
    topic: 'Logical reasoning',
  },
  {
    id: 'apt3',
    prompt: 'A word that is opposite in meaning to “lucid” is:',
    options: ['Vague', 'Bright', 'Clear', 'Smart'],
    answer: 'Vague',
    topic: 'Verbal ability',
  },
  {
    id: 'apt4',
    prompt: 'If a train travels 240 km in 3 hours, its speed is:',
    options: ['60 km/h', '70 km/h', '80 km/h', '90 km/h'],
    answer: '80 km/h',
    topic: 'Quantitative aptitude',
  },
  {
    id: 'apt5',
    prompt: 'Which word does not belong: Banana, Apple, Rose, Mango?',
    options: ['Banana', 'Apple', 'Rose', 'Mango'],
    answer: 'Rose',
    topic: 'Logical reasoning',
  },
  {
    id: 'apt6',
    prompt: 'Choose the sentence with correct grammar.',
    options: ['She don’t like cake.', 'She doesn’t likes cake.', 'She doesn’t like cake.', 'She don’t likes cake.'],
    answer: 'She doesn’t like cake.',
    topic: 'Verbal ability',
  },
  {
    id: 'apt7',
    prompt: 'What is 15% of 240?',
    options: ['24', '30', '36', '42'],
    answer: '36',
    topic: 'Quantitative aptitude',
  },
  {
    id: 'apt8',
    prompt: 'Which one is the odd one out: Figure, Form, Shape, Economy?',
    options: ['Figure', 'Form', 'Shape', 'Economy'],
    answer: 'Economy',
    topic: 'Logical reasoning',
  },
  {
    id: 'apt9',
    prompt: 'Select the word that best completes the sentence: “The CEO gave a ___ presentation.”',
    options: ['Conversant', 'Compelling', 'Complicated', 'Complete'],
    answer: 'Compelling',
    topic: 'Verbal ability',
  },
  {
    id: 'apt10',
    prompt: 'A bookstore sold 120 books at $8 each and made a profit of 20%. What was the cost price per book?',
    options: ['$6.40', '$6.70', '$7.20', '$7.80'],
    answer: '$6.40',
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

  useEffect(() => {
    if (!workflow.resume.completed) return;
    const shuffled = [...sampleQuestions].sort(() => Math.random() - 0.5).slice(0, workflow.aptitude.total);
    setQuestions(shuffled);
    dispatch(startAptitude());
  }, [dispatch, workflow.resume.completed, workflow.aptitude.total]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
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
    const correctAnswers = questions.reduce((count, question) => {
      const selected = answers[question.id];
      return count + (selected === question.answer ? 1 : 0);
    }, 0);
    const calculatedScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    dispatch(completeAptitude({ score: calculatedScore, answered: answeredCount, answers }));
  };

  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
      <Card title="Aptitude test" description="Complete the timed MCQ section to unlock the next technical round.">
        <div className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-surface/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Question {currentIndex + 1} of {questions.length}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{currentQuestion?.prompt}</h3>
              </div>
              <div className="rounded-full bg-surface/80 px-5 py-3 text-sm font-semibold text-slate-100">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {currentQuestion?.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={`w-full rounded-3xl border px-5 py-4 text-left transition ${
                    answers[currentQuestion.id] === option
                      ? 'border-indigo-400 bg-indigo-500/10 text-white'
                      : 'border-white/10 bg-surface/80 text-slate-300 hover:border-white/20 hover:bg-surface/70'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3 text-sm text-slate-300">
              <span>Attempted: {attempted}</span>
              <span>Unattempted: {unattempted}</span>
              <span>Progress: {progress}%</span>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setCurrentIndex((idx) => Math.max(idx - 1, 0))} disabled={currentIndex === 0}>Previous</Button>
              <Button onClick={() => setCurrentIndex((idx) => Math.min(idx + 1, questions.length - 1))} disabled={currentIndex === questions.length - 1}>Next</Button>
              <Button variant="secondary" onClick={handleSubmit} disabled={submitted || answeredCount === 0}>Submit test</Button>
            </div>
          </div>

          {submitted && (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-emerald-200">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Test completed</p>
              <h3 className="mt-3 text-3xl font-semibold">{score}%</h3>
              <p className="mt-2 text-slate-300">Excellent work — the technical round is now unlocked.</p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Aptitude summary" description="Real-time progress and topic breakdown.">
        <div className="space-y-5">
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Timer</p>
            <p className="mt-3 text-3xl font-semibold text-white">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          </div>
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Topics</p>
            <div className="mt-3 grid gap-3">
              {['Quantitative aptitude', 'Logical reasoning', 'Verbal ability'].map((topic) => (
                <div key={topic} className="rounded-3xl bg-surface/80 p-4 border border-white/10">
                  <p className="text-sm text-slate-300">{topic}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Attempted status</p>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between text-sm text-slate-300"><span>Answered</span><span>{attempted}</span></div>
              <div className="flex items-center justify-between text-sm text-slate-300"><span>Remaining</span><span>{unattempted}</span></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AptitudeTestPage;
