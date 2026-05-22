import mongoose, { Schema, model } from 'mongoose';

export interface ICompany {
  name: string;
  domain: string;
  website?: string;
  description?: string;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    website: String,
    description: String,
  },
  { timestamps: true }
);

export default model<ICompany>('Company', companySchema);
