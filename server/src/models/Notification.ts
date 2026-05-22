import mongoose, { Schema, model } from 'mongoose';

export interface INotification {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  read: boolean;
  category: 'system' | 'interview' | 'analytics';
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    category: { type: String, enum: ['system', 'interview', 'analytics'], default: 'system' },
  },
  { timestamps: true }
);

export default model<INotification>('Notification', notificationSchema);
