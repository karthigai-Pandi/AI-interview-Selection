import mongoose, { Schema, model } from 'mongoose';

export interface IInterview {
  candidateId: mongoose.Types.ObjectId;
  interviewer: string;
  scheduledAt: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  round: 'technical' | 'hr' | 'final';
  feedback: string;
  score: number;
}

const interviewSchema = new Schema<IInterview>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
    interviewer: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    round: { type: String, enum: ['technical', 'hr', 'final'], default: 'technical' },
    feedback: String,
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IInterview>('Interview', interviewSchema);
