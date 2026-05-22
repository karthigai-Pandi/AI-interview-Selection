import mongoose from 'mongoose';

export const isDbConnected = () => mongoose.connection.readyState === 1;

// Memory storage for Fallback databases when MongoDB is offline
export const fallbackCandidates: Array<{
  _id: string;
  userId: string;
  resumeUrl?: string;
  skills: string[];
  industry: string;
  currentStage: string;
  score: number;
  activity: Array<{ date: Date; event: string }>;
  name?: string;
  email?: string;
}> = [
  {
    _id: 'c1',
    userId: '507f1f77bcf86cd799439011',
    resumeUrl: '',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'TailwindCSS'],
    industry: 'Technology',
    currentStage: 'Applied',
    score: 85,
    activity: [
      { date: new Date(), event: 'Profile Created (In-Memory Fallback)' }
    ],
    name: 'Jane Candidate',
    email: 'candidate@example.com'
  }
];

export const fallbackInterviews: Array<{
  _id: string;
  candidateId: string;
  interviewer: string;
  scheduledAt: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  round: 'technical' | 'hr' | 'final';
  feedback: string;
  score: number;
}> = [
  {
    _id: 'i1',
    candidateId: 'c1',
    interviewer: 'John Recruiter',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    status: 'scheduled',
    round: 'technical',
    feedback: 'Scheduled technical round mock assessment',
    score: 0
  }
];

export const fallbackFeedbacks: Array<{
  _id: string;
  candidateId: string;
  interviewerId: string;
  type: 'technical' | 'communication' | 'confidence';
  notes: string;
  score: number;
}> = [];

export const fallbackCompanies: Array<{
  _id: string;
  name: string;
  industry: string;
  website?: string;
}> = [
  { _id: 'com1', name: 'TechInc', industry: 'Software' }
];

export const fallbackNotifications: Array<{
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: Date;
}> = [
  {
    _id: 'n1',
    userId: '507f1f77bcf86cd799439011',
    title: 'Welcome!',
    message: 'Welcome to the AI hiring selection platform.',
    read: false,
    type: 'info',
    createdAt: new Date()
  }
];
