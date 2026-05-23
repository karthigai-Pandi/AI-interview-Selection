import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  advanceInterviewQuestion,
  completeInterview,
  setInterviewQuestions,
  updateInterviewAnswer,
} from '../../store/slices/workflowSlice';
import { RootState } from '../../store';
import { getInterviewQuestions } from '../../services/workflowService';

const INTERVIEW_TIME_SECONDS = 120;

const AIInterviewPage = () => {
  const dispatch = useDispatch();
  const workflow = useSelector((state: RootState) => state.workflow);
  const [stage, setStage] = useState<'prompt' | 'answer' | 'review'>('prompt');
  const [cameraActive, setCameraActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_TIME_SECONDS);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (workflow.currentStep !== 'interview' || workflow.interview.completed || workflow.interview.questions.length > 0) {
      return;
    }

    setLoadingQuestions(true);
    setQuestionsError('');

    getInterviewQuestions()
      .then((questions) => {
        dispatch(setInterviewQuestions(questions));
      })
      .catch(() => {
        setQuestionsError('Unable to load interview prompts. Refresh the page or try again later.');
      })
      .finally(() => {
        setLoadingQuestions(false);
      });
  }, [dispatch, workflow.currentStep, workflow.interview.completed, workflow.interview.questions.length]);

  useEffect(() => {
    setTimeLeft(INTERVIEW_TIME_SECONDS);
    setStage('prompt');
  }, [workflow.interview.currentQuestion]);

  useEffect(() => {
    if (!recording) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          handleStop();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      if (stream) {
        videoRef.current.play().catch(() => {
          // Ignore autoplay issues; the video preview will still show once allowed.
        });
      }
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      // Stop webcam and release media devices when unmounting (leaving the page)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  if (workflow.currentStep !== 'interview') {
    return <Navigate replace to={`/candidate/flow/${workflow.currentStep}`} />;
  }

  if (workflow.interview.completed) {
    return <Navigate replace to="/candidate/flow/performance" />;
  }

  const total = workflow.interview.questions.length || 1;
  const currentQuestion = workflow.interview.questions[workflow.interview.currentQuestion] || 'Tell us about a time you solved a hard problem under pressure.';
  const currentAnswer = workflow.interview.answers[workflow.interview.currentQuestion] || '';
  const answeredCount = workflow.interview.answers.filter(Boolean).length;
  const stageLabels = ['Prompt', 'Answer', 'Review'];
  const stageIndex = stage === 'prompt' ? 0 : stage === 'answer' ? 1 : 2;
  const progressValue = Math.round(((workflow.interview.currentQuestion + stageIndex / stageLabels.length) / total) * 100);

  const handleStartCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMediaError('Webcam is not supported in this browser.');
      return;
    }

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      setStream(userStream);
      setCameraActive(true);
      setMediaError('');
    } catch {
      setMediaError('Camera access was denied or is unavailable.');
    }
  };

  const handleStopCamera = () => {
    if (recorder) {
      recorder.stop();
      setRecording(false);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setStream(null);
    setCameraActive(false);
    setRecorder(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleStartRecording = async () => {
    if (!stream) {
      setMediaError('Start the camera first to enable recording.');
      return;
    }

    try {
      const recordingStream = new MediaStream(stream.getTracks());
      if (!recordingStream.getAudioTracks().length && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStream.getAudioTracks().forEach((track) => recordingStream.addTrack(track));
        } catch {
          setMediaError('Microphone access was denied. Recording will continue with video only.');
        }
      }

      const mediaRecorder = new MediaRecorder(recordingStream);
      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setTranscript((prev) => `${prev}\n[Recording saved: ${url.slice(0, 40)}]`);
      };
      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);
      setMediaError('');
    } catch {
      setMediaError('Unable to start recording.');
    }
  };

  const handleStop = () => {
    if (recorder) {
      recorder.stop();
    }
    setRecording(false);
  };

  const handleAnswerChange = (value: string) => {
    dispatch(updateInterviewAnswer({ index: workflow.interview.currentQuestion, answer: value }));
  };

  const handleBeginAnswer = () => {
    if (!cameraActive) {
      setMediaError('Please turn on your webcam before starting the interview answer stage.');
      return;
    }
    setStage('answer');
    setTimeLeft(INTERVIEW_TIME_SECONDS);
  };

  const handleSaveReview = () => {
    setStage('review');
  };

  const handleConfirmContinue = () => {
    if (workflow.interview.currentQuestion < total - 1) {
      dispatch(advanceInterviewQuestion());
      setStage('prompt');
      setTranscript('');
    } else {
      const confidencePoints = Math.min(95, 60 + answeredCount * 8);
      handleStopCamera(); // Stop the camera immediately when finishing the interview
      dispatch(completeInterview({ confidenceScore: confidencePoints }));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card title="AI interview" description="Multi-step candidate interview with immersive question, answer, and review stages.">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-surface/80 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Question {workflow.interview.currentQuestion + 1} / {total}</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">{currentQuestion}</h3>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Stage</p>
                <p className="mt-2 text-lg font-semibold text-white">{stageLabels[stageIndex]}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="h-3 overflow-hidden rounded-full bg-slate-900">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: `${Math.min(100, Math.max(12, progressValue))}%` }} />
              </div>
                <p className="text-sm text-slate-300">Progress through the interview flow.</p>
            </div>
          </div>

          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-surface/80 p-6"
          >
            {stage === 'prompt' && (
              <div className="space-y-5">
                <div className="rounded-3xl bg-surface/80 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Interview prompt</p>
                  <p className="mt-4 text-lg text-slate-200 leading-relaxed">Read the question carefully and plan your answer. When you feel ready, move into the answer stage.</p>
                </div>
                {loadingQuestions && <p className="text-sm text-slate-300">Loading interview prompts...</p>}
                {questionsError && <p className="text-sm text-red-400">{questionsError}</p>}
                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">What to do next</p>
                    <ul className="mt-3 space-y-2 text-slate-300 list-disc list-inside">
                      <li>Turn on your camera and keep it visible on screen.</li>
                      <li>Structure your response with context, action, and result.</li>
                      <li>Use the video preview to maintain strong delivery.</li>
                    </ul>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <Button onClick={cameraActive ? handleStopCamera : handleStartCamera}>
                      {cameraActive ? 'Stop camera' : 'Turn on camera'}
                    </Button>
                    <Button onClick={handleBeginAnswer} disabled={!cameraActive || loadingQuestions}>
                      Start answering
                    </Button>
                  </div>
                  {cameraActive && (
                    <div className="rounded-3xl border border-white/10 bg-surface/80 p-4">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Camera preview</p>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="mt-4 h-48 w-full rounded-3xl border border-white/10 bg-slate-950 object-cover"
                      />
                    </div>
                  )}
                  {!cameraActive && <p className="text-sm text-slate-300">Webcam is required to begin the answer stage.</p>}
                </div>
              </div>
            )}

            {stage === 'answer' && (
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Answer editor</p>
                      <p className="mt-2 text-sm text-slate-300">Type your response and optionally record your voice while practicing delivery.</p>
                    </div>
                    <div className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>

                <textarea
                  value={currentAnswer}
                  onChange={(event) => handleAnswerChange(event.target.value)}
                  placeholder="Type your answer here with key points and delivery notes."
                  className="min-h-[260px] w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-slate-100 outline-none focus:border-cyan-400"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Button onClick={cameraActive ? handleStopCamera : handleStartCamera}>
                    {cameraActive ? 'Stop camera' : 'Turn on camera'}
                  </Button>
                  <Button variant="secondary" onClick={recording ? handleStop : handleStartRecording} disabled={!cameraActive}>
                    {recording ? 'Stop recording' : 'Start recording'}
                  </Button>
                </div>

                {cameraActive && (
                  <div className="rounded-3xl border border-white/10 bg-surface/80 p-4">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Live preview</p>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="mt-4 h-64 w-full rounded-3xl border border-white/10 bg-surface/80 object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSaveReview} disabled={!currentAnswer.trim()}>Review answer</Button>
                  <Button variant="ghost" onClick={handleStopCamera}>End camera</Button>
                </div>
              </div>
            )}

            {stage === 'review' && (
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-900/80 p-6 border border-white/10">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Review your response</p>
                  <p className="mt-4 text-slate-300">Finalize your answer and confirm before moving to the next interview prompt.</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Your current answer</p>
                  <pre className="mt-4 whitespace-pre-wrap text-slate-200 min-h-[180px]">{currentAnswer || 'No answer recorded yet.'}</pre>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleConfirmContinue}>{workflow.interview.currentQuestion === total - 1 ? 'Finish interview' : 'Continue to next question'}</Button>
                  <Button variant="secondary" onClick={() => setStage('answer')}>Edit answer</Button>
                </div>
              </div>
            )}

            {mediaError && <p className="text-sm text-red-400">{mediaError}</p>}
          </motion.div>
        </div>
      </Card>

      <Card title="Candidate preview" description="Desktop-style candidate screen with interview progress and live status.">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 p-2">
                <div className="h-full w-full rounded-2xl bg-slate-950" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Candidate</p>
                <p className="mt-1 text-xl font-semibold text-white">Jordan Lee</p>
                <p className="text-sm text-slate-400">Frontend Engineer applicant</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-surface/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Desktop interview monitor</p>
            <div className="mt-4 rounded-3xl bg-surface/90 p-4">
              <div className="mb-4 flex items-center justify-between text-slate-300">
                <span className="text-sm">Live candidate view</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">Recording</span>
              </div>
              <div className="h-48 rounded-3xl bg-surface/80" />
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950/80 p-5 border border-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Workflow status</p>
            <div className="mt-5 space-y-3">
              {['Resume', 'Aptitude', 'Technical', 'Coding', 'Interview', 'Performance'].map((step, index) => {
                const completed = index < 4 || answeredCount > 0;
                const active = step === 'Interview';
                return (
                  <div key={step} className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${active ? 'bg-cyan-400' : completed ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                    <span className={`text-sm ${active ? 'text-white' : 'text-slate-400'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Answer review</p>
            <p className="mt-4 text-xl font-semibold text-white">{answeredCount} / {total} answers completed</p>
            <div className="mt-4 h-2 rounded-full bg-slate-900">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: `${Math.round((answeredCount / total) * 100)}%` }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIInterviewPage;
