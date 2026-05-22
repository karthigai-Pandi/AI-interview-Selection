import mongoose, { Schema, model } from 'mongoose';

export interface ICandidate {
  userId: mongoose.Types.ObjectId;
  resumeUrl?: string;
  skills: string[];
  industry: string;
  currentStage: string;
  score: number;
  activity: Array<{ date: Date; event: string }>;
}

const candidateSchema = new Schema<ICandidate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: String,
    skills: { type: [String], default: [] },
    industry: { type: String, default: 'Technology' },
    currentStage: { type: String, default: 'Applied' },
    score: { type: Number, default: 0 },
    activity: [{ date: Date, event: String }],
  },
  { timestamps: true }
);

export default model<ICandidate>('Candidate', candidateSchema);
