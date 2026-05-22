import mongoose, { Schema, model } from 'mongoose';

export interface IFeedback {
  candidateId: mongoose.Types.ObjectId;
  interviewerId: mongoose.Types.ObjectId;
  type: 'technical' | 'communication' | 'confidence';
  notes: string;
  score: number;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
    interviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['technical', 'communication', 'confidence'], default: 'technical' },
    notes: String,
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IFeedback>('Feedback', feedbackSchema);
