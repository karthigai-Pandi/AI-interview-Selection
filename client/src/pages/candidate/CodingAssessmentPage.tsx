import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { completeCoding, setCodingLanguage, setCodingResult, updateCodingCode } from '../../store/slices/workflowSlice';
import { RootState } from '../../store';
import { getCodingProblem } from '../../services/workflowService';

const defaultTemplate: Record<string, string> = {
  JavaScript: `function solve(input) {\n  // return formatted result here\n  return input;\n}\n`,
  Python: `def solve(input):\n    # return formatted result here\n    return input\n`,
  Java: `public class Solution {\n    public static String solve(String input) {\n        return input;\n    }\n}\n`,
  'C++': `#include <string>\nusing namespace std;\nstring solve(string input) {\n    return input;\n}\n`,
};

const CodingAssessmentPage = () => {
  const dispatch = useDispatch();
  const workflow = useSelector((state: RootState) => state.workflow);
  const [problem, setProblem] = useState<{ title: string; description: string; tests: Array<{ input: string; expected: string }> } | null>(null);
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const loadProblem = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await getCodingProblem();
      setProblem(data);
      if (!workflow.coding.code) {
        dispatch(updateCodingCode(defaultTemplate[workflow.coding.selectedLanguage]));
      }
    } catch (error) {
      setFetchError('Unable to load the coding challenge. Please refresh or try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!workflow.technical.completed) return;
    loadProblem();
  }, [workflow.technical.completed]);

  useEffect(() => {
    if (!workflow.coding.code) {
      dispatch(updateCodingCode(defaultTemplate[workflow.coding.selectedLanguage]));
    }
  }, [dispatch, workflow.coding.selectedLanguage, workflow.coding.code]);

  if (workflow.currentStep !== 'coding') {
    return <Navigate replace to={`/candidate/flow/${workflow.currentStep}`} />;
  }

  const handleRun = () => {
    if (!problem) return;
    if (workflow.coding.selectedLanguage !== 'JavaScript') {
      setFeedback('Run is only supported for JavaScript in this browser demo. Submit to validate logic manually.');
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('input', `${workflow.coding.code}\nreturn solve(input);`);
      const results = problem.tests.map((test) => {
        const value = fn(test.input);
        return `Input: ${test.input}\nExpected: ${test.expected}\nOutput: ${String(value)}\n${String(value) === test.expected ? '✔ Pass' : '✘ Fail'}\n`;
      });
      setOutput(results.join('\n'));
      setFeedback('Run completed. Review the output above.');
      dispatch(setCodingResult(results.join('\n')));
    } catch (error: any) {
      setFeedback(error?.message || 'Code execution failed.');
    }
  };

  const handleSubmit = () => {
    if (!problem) return;
    if (workflow.coding.selectedLanguage === 'JavaScript') {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('input', `${workflow.coding.code}\nreturn solve(input);`);
        const passCount = problem.tests.reduce((count, test) => {
          const actual = String(fn(test.input));
          return count + (actual === test.expected ? 1 : 0);
        }, 0);
        const grade = Math.round((passCount / problem.tests.length) * 100);
        setCompleted(true);
        setFeedback(`Submission scored ${grade}%. ${passCount}/${problem.tests.length} passed.`);
        dispatch(completeCoding({ score: grade, runResult: output || 'Code submitted.' }));
      } catch (error: any) {
        setFeedback(error?.message || 'Submission failed due to code error.');
      }
      return;
    }

    setCompleted(true);
    setFeedback('Submission received. Coding logic is evaluated as part of the hiring workflow demo.');
    dispatch(completeCoding({ score: 84, runResult: workflow.coding.code }));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_0.7fr]">
      <Card title="Coding assessment" description="Choose a language, implement the solution, run tests, and submit your code.">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-surface/80 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Problem</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{problem?.title || 'Loading challenge...'}</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['JavaScript', 'Python', 'Java', 'C++'] as const).map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => dispatch(setCodingLanguage(language))}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      workflow.coding.selectedLanguage === language
                        ? 'bg-indigo-500 text-white'
                        : 'bg-surface/80 text-slate-300 hover:bg-surface/70'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4 text-slate-300">
              <p>{problem?.description || (loading ? 'Fetching a coding challenge from the AI workflow engine.' : 'Unable to load the challenge right now.')}</p>
              {problem && (
                <div className="rounded-3xl border border-white/10 bg-surface/80 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Test cases</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {problem.tests.map((test, index) => (
                      <li key={index}>Input: <span className="text-white">{test.input}</span> → Expected: <span className="text-cyan-300">{test.expected}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-surface/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Code editor</p>
            <textarea
              value={workflow.coding.code}
              onChange={(event) => dispatch(updateCodingCode(event.target.value))}
              className="mt-4 h-[420px] w-full rounded-3xl border border-white/10 bg-surface/80 p-4 font-mono text-sm text-slate-100 outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleRun} disabled={!problem || loading}>Run code</Button>
            <Button variant="secondary" onClick={handleSubmit} disabled={completed || !problem || loading}>Submit solution</Button>
            <Button variant="ghost" onClick={() => dispatch(updateCodingCode(defaultTemplate[workflow.coding.selectedLanguage]))}>Reset</Button>
            {fetchError && (
              <Button variant="ghost" onClick={loadProblem}>Retry</Button>
            )}
          </div>
          {fetchError && <p className="text-sm text-red-400">{fetchError}</p>}

          <div className="rounded-3xl border border-white/10 bg-surface/80 p-6 text-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Result output</p>
            <pre className="mt-4 max-h-72 whitespace-pre-wrap overflow-y-auto text-sm text-slate-200">{output || 'Run your code to preview test results here.'}</pre>
            <p className="mt-4 text-slate-300">{feedback}</p>
          </div>
        </div>
      </Card>

      <Card title="Assessment summary" description="Instant feedback and scoring for the coding stage.">
        <div className="space-y-5">
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Language</p>
            <p className="mt-3 text-xl font-semibold text-white">{workflow.coding.selectedLanguage}</p>
          </div>
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Current status</p>
            <p className="mt-3 text-xl font-semibold text-white">{completed ? 'Submitted' : 'In progress'}</p>
          </div>
          <div className="rounded-3xl bg-surface/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Progress</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface/80">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" style={{ width: completed ? '100%' : '55%' }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CodingAssessmentPage;
