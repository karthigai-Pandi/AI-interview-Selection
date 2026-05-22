import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { completeTechnical, setTechnicalDifficulty } from '../../store/slices/workflowSlice';
import { RootState } from '../../store';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  category: string;
}

const questionBank: Question[] = [
  {
    id: 'tech1',
    prompt: 'Which of these is a React hook for managing side effects?',
    options: ['useState', 'useMemo', 'useEffect', 'useContext'],
    answer: 'useEffect',
    category: 'React.js',
  },
  {
    id: 'tech2',
    prompt: 'In JavaScript, which keyword declares a block-scoped variable?',
    options: ['var', 'let', 'const', 'both let and const'],
    answer: 'both let and const',
    category: 'JavaScript',
  },
  {
    id: 'tech3',
    prompt: 'What is the default port for MongoDB?',
    options: ['3306', '27017', '8080', '5432'],
    answer: '27017',
    category: 'MongoDB',
  },
  {
    id: 'tech4',
    prompt: 'Which CSS property controls the spacing between letters?',
    options: ['line-height', 'letter-spacing', 'word-spacing', 'text-indent'],
    answer: 'letter-spacing',
    category: 'HTML/CSS',
  },
  {
    id: 'tech5',
    prompt: 'A class in OOP is best described as:',
    options: ['A method', 'A blueprint', 'A variable', 'A function call'],
    answer: 'A blueprint',
    category: 'OOPs',
  },
  {
    id: 'tech6',
    prompt: 'Which Node.js module is commonly used to create a web server?',
    options: ['fs', 'http', 'path', 'crypto'],
    answer: 'http',
    category: 'Node.js',
  },
  {
    id: 'tech7',
    prompt: 'In React, which hook should be used for memoizing expensive computations?',
    options: ['useState', 'useEffect', 'useCallback', 'useMemo'],
    answer: 'useMemo',
    category: 'React.js',
  },
  {
    id: 'tech8',
    prompt: 'Which statement is true about MongoDB?',
    options: ['It is relational', 'It uses collections', 'It requires SQL', 'It cannot scale horizontally'],
    answer: 'It uses collections',
    category: 'MongoDB',
  },
];

const TechnicalTestPage = () => {
  const dispatch = useDispatch();
  const workflow = useSelector((state: RootState) => state.workflow);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!workflow.aptitude.completed) return;
    const selected = [...questionBank].sort(() => Math.random() - 0.5).slice(0, workflow.technical.total);
    setQuestions(selected);
  }, [workflow.aptitude.completed, workflow.technical.total]);

  if (!workflow.aptitude.completed) {
    return <Navigate replace to="/candidate/aptitude" />;
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleSubmit = () => {
    const correct = questions.reduce((count, question) => {
      const selected = answers[question.id];
      return count + (selected === question.answer ? 1 : 0);
    }, 0);
    const normalized = Math.round((correct / questions.length) * 100);
    setScore(normalized);
    setSubmitted(true);
    dispatch(completeTechnical({ score: normalized, answered: Object.keys(answers).length, answers }));
  };

  const difficultyOptions: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
      <Card title="Technical MCQ round" description="Answer domain-specific questions across JavaScript, React, Node, MongoDB, CSS, DBMS and OOPs.">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Difficulty</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {difficultyOptions.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => dispatch(setTechnicalDifficulty(level))}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      workflow.technical.difficulty === level
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
              {submitted ? 'Assessment submitted' : `${questions.length} questions ready`}
            </div>
          </div>

          {currentQuestion && (
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Category: {currentQuestion.category}</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{currentQuestion.prompt}</h3>
              <div className="mt-6 grid gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    className={`w-full rounded-3xl border px-5 py-4 text-left transition ${
                      answers[currentQuestion.id] === option
                        ? 'border-cyan-400 bg-cyan-500/10 text-white'
                        : 'border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20 hover:bg-slate-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3">
              <Button onClick={() => setCurrentIndex((idx) => Math.max(idx - 1, 0))} disabled={currentIndex === 0}>Previous</Button>
              <Button onClick={() => setCurrentIndex((idx) => Math.min(idx + 1, questions.length - 1))} disabled={currentIndex === questions.length - 1}>Next</Button>
            </div>
            <Button variant="secondary" onClick={handleSubmit} disabled={submitted || Object.keys(answers).length === 0}>Submit answers</Button>
          </div>

          {submitted && score !== null && (
            <div className="rounded-3xl border border-sky-500/20 bg-sky-500/5 p-6 text-slate-100">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Technical score</p>
              <h3 className="mt-3 text-3xl font-semibold">{score}%</h3>
              <p className="mt-2 text-slate-300">This score unlocks the coding assessment stage.</p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Review panel" description="Overview of your MCQ progress and category mix.">
        <div className="space-y-5">
          <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Answered</p>
            <p className="mt-3 text-2xl font-semibold text-white">{Object.keys(answers).length} / {questions.length}</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current difficulty</p>
            <p className="mt-3 text-xl font-semibold text-white">{workflow.technical.difficulty}</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Progress</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" style={{ width: `${Math.round((Object.keys(answers).length / questions.length) * 100)}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-300">{Math.round((Object.keys(answers).length / questions.length) * 100)}% complete</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TechnicalTestPage;
