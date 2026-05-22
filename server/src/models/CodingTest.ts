import mongoose, { Schema, model } from 'mongoose';

export interface ICodingTest {
  candidateId: mongoose.Types.ObjectId;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'running' | 'completed';
  score: number;
  reportUrl?: string;
}

const codingTestSchema = new Schema<ICodingTest>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
    language: { type: String, default: 'javascript' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    status: { type: String, enum: ['pending', 'running', 'completed'], default: 'pending' },
    score: { type: Number, default: 0 },
    reportUrl: String,
  },
  { timestamps: true }
);

export default model<ICodingTest>('CodingTest', codingTestSchema);
