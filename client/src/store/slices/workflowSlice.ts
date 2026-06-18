import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkflowState {
  currentStep: 'resume' | 'aptitude' | 'technical' | 'coding' | 'interview' | 'performance';
  resume: {
    uploaded: boolean;
    filename: string;
    atsScore: number | null;
    extracted: { name: string; role: string; summary: string } | null;
    uploadProgress: number;
    completed: boolean;
  };
  aptitude: {
    started: boolean;
    completed: boolean;
    score: number | null;
    total: number;
    answered: number;
    answers: Record<string, string>;
  };
  technical: {
    started: boolean;
    completed: boolean;
    score: number | null;
    total: number;
    answered: number;
    answers: Record<string, string>;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  coding: {
    selectedLanguage: 'JavaScript' | 'Java' | 'Python' | 'C++';
    code: string;
    runResult: string;
    score: number | null;
    completed: boolean;
  };
  interview: {
    questions: string[];
    answers: string[];
    currentQuestion: number;
    completed: boolean;
    confidenceScore: number | null;
  };
}

const workflowStateFromStorage = typeof window !== 'undefined' ? window.localStorage.getItem('workflowState') : null;
const initialState: WorkflowState = workflowStateFromStorage
  ? JSON.parse(workflowStateFromStorage)
  : {
      currentStep: 'resume',
      resume: {
        uploaded: false,
        filename: '',
        atsScore: null,
        extracted: null,
        uploadProgress: 0,
        completed: false,
      },
      aptitude: {
        started: false,
        completed: false,
        score: null,
        total: 10,
        answered: 0,
        answers: {},
      },
      technical: {
        started: false,
        completed: false,
        score: null,
        total: 8,
        answered: 0,
        answers: {},
        difficulty: 'medium',
      },
      coding: {
        selectedLanguage: 'JavaScript',
        code: '',
        runResult: '',
        score: null,
        completed: false,
      },
      interview: {
        questions: [],
        answers: [],
        currentQuestion: 0,
        completed: false,
        confidenceScore: null,
      },
    };

const persistWorkflowState = (state: WorkflowState) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('workflowState', JSON.stringify(state));
  }
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setResumeProgress(state, action: PayloadAction<number>) {
      state.resume.uploadProgress = action.payload;
      persistWorkflowState(state);
    },
    completeResumeUpload(
      state,
      action: PayloadAction<{ filename: string; atsScore: number; extracted: { name: string; role: string; summary: string } }>
    ) {
      state.resume.uploaded = true;
      state.resume.filename = action.payload.filename;
      state.resume.atsScore = action.payload.atsScore;
      state.resume.extracted = action.payload.extracted;
      state.resume.completed = true;
      state.currentStep = 'aptitude';
      persistWorkflowState(state);
    },
    startAptitude(state) {
      state.aptitude.started = true;
      persistWorkflowState(state);
    },
    completeAptitude(state, action: PayloadAction<{ score: number; answered: number; answers: Record<string, string> }>) {
      state.aptitude.completed = true;
      state.aptitude.score = action.payload.score;
      state.aptitude.answered = action.payload.answered;
      state.aptitude.answers = action.payload.answers;
      state.currentStep = 'technical';
      persistWorkflowState(state);
    },
    setTechnicalDifficulty(state, action: PayloadAction<'easy' | 'medium' | 'hard'>) {
      state.technical.difficulty = action.payload;
      persistWorkflowState(state);
    },
    completeTechnical(state, action: PayloadAction<{ score: number; answered: number; answers: Record<string, string> }>) {
      state.technical.completed = true;
      state.technical.score = action.payload.score;
      state.technical.answered = action.payload.answered;
      state.technical.answers = action.payload.answers;
      state.currentStep = 'coding';
      persistWorkflowState(state);
    },
    setCodingLanguage(state, action: PayloadAction<'JavaScript' | 'Java' | 'Python' | 'C++'>) {
      state.coding.selectedLanguage = action.payload;
      persistWorkflowState(state);
    },
    updateCodingCode(state, action: PayloadAction<string>) {
      state.coding.code = action.payload;
      persistWorkflowState(state);
    },
    setCodingResult(state, action: PayloadAction<string>) {
      state.coding.runResult = action.payload;
      persistWorkflowState(state);
    },
    completeCoding(state, action: PayloadAction<{ score: number; runResult: string }>) {
      state.coding.completed = true;
      state.coding.score = action.payload.score;
      state.coding.runResult = action.payload.runResult;
      state.currentStep = 'interview';
      persistWorkflowState(state);
    },
    setInterviewQuestions(state, action: PayloadAction<string[]>) {
      state.interview.questions = action.payload;
      state.interview.answers = Array(action.payload.length).fill('');
      state.interview.currentQuestion = 0;
      persistWorkflowState(state);
    },
    updateInterviewAnswer(state, action: PayloadAction<{ index: number; answer: string }>) {
      state.interview.answers[action.payload.index] = action.payload.answer;
      persistWorkflowState(state);
    },
    advanceInterviewQuestion(state) {
      if (state.interview.currentQuestion < state.interview.questions.length - 1) {
        state.interview.currentQuestion += 1;
      }
      persistWorkflowState(state);
    },
    completeInterview(state, action: PayloadAction<{ confidenceScore: number }>) {
      state.interview.completed = true;
      state.interview.confidenceScore = action.payload.confidenceScore;
      state.currentStep = 'performance';
      persistWorkflowState(state);
    },
    goBackInterviewQuestion(state) {
      if (state.interview.currentQuestion > 0) {
        state.interview.currentQuestion -= 1;
      }
      persistWorkflowState(state);
    },
    resetAptitude(state) {
      state.aptitude = {
        started: false,
        completed: false,
        score: null,
        total: 10,
        answered: 0,
        answers: {},
      };
      persistWorkflowState(state);
    },
    resetTechnical(state) {
      state.technical = {
        started: false,
        completed: false,
        score: null,
        total: 8,
        answered: 0,
        answers: {},
        difficulty: 'medium',
      };
      persistWorkflowState(state);
    },
    resetCoding(state) {
      state.coding = {
        selectedLanguage: 'JavaScript',
        code: '',
        runResult: '',
        score: null,
        completed: false,
      };
      persistWorkflowState(state);
    },
    resetWorkflow(state) {
      state.currentStep = 'resume';
      state.resume = {
        uploaded: false,
        filename: '',
        atsScore: null,
        extracted: null,
        uploadProgress: 0,
        completed: false,
      };
      state.aptitude = {
        started: false,
        completed: false,
        score: null,
        total: 10,
        answered: 0,
        answers: {},
      };
      state.technical = {
        started: false,
        completed: false,
        score: null,
        total: 8,
        answered: 0,
        answers: {},
        difficulty: 'medium',
      };
      state.coding = {
        selectedLanguage: 'JavaScript',
        code: '',
        runResult: '',
        score: null,
        completed: false,
      };
      state.interview = {
        questions: [],
        answers: [],
        currentQuestion: 0,
        completed: false,
        confidenceScore: null,
      };
      persistWorkflowState(state);
    },
  },
});

export const {
  setResumeProgress,
  completeResumeUpload,
  startAptitude,
  completeAptitude,
  setTechnicalDifficulty,
  completeTechnical,
  setCodingLanguage,
  updateCodingCode,
  setCodingResult,
  completeCoding,
  setInterviewQuestions,
  updateInterviewAnswer,
  advanceInterviewQuestion,
  goBackInterviewQuestion,
  completeInterview,
  resetAptitude,
  resetTechnical,
  resetCoding,
  resetWorkflow,
} = workflowSlice.actions;

export default workflowSlice.reducer;
