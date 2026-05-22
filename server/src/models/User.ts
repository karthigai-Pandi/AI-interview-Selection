import mongoose, { Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'candidate' | 'admin' | 'hr';
  verified: boolean;
  companyId?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['candidate', 'admin', 'hr'], default: 'candidate' },
    verified: { type: Boolean, default: false },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
