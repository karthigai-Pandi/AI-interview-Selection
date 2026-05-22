import { Request, Response, NextFunction } from 'express';
import Candidate from '../models/Candidate';
import { isDbConnected, fallbackCandidates } from '../utils/fallbackDb';

export const getCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isDbConnected()) {
      return res.json({ data: fallbackCandidates });
    }
    const candidates = await Candidate.find().limit(50);
    res.json({ data: candidates });
  } catch (error) {
    next(error);
  }
};

export const getCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!isDbConnected()) {
      let candidate = fallbackCandidates.find((c) => c.userId === req.user!.id);
      if (!candidate) {
        candidate = {
          _id: 'c_' + req.user.id,
          userId: req.user.id,
          skills: [],
          industry: 'Technology',
          currentStage: 'Applied',
          score: 0,
          activity: [{ date: new Date(), event: 'Profile Initialized (In-Memory)' }]
        };
        fallbackCandidates.push(candidate);
      }
      return res.json({ data: candidate });
    }
    const candidate = await Candidate.findOne({ userId: req.user.id });
    res.json({ data: candidate });
  } catch (error) {
    next(error);
  }
};

export const updateCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!isDbConnected()) {
      let candidate = fallbackCandidates.find((c) => c.userId === req.user!.id);
      if (!candidate) {
        candidate = {
          _id: 'c_' + req.user.id,
          userId: req.user.id,
          skills: [],
          industry: 'Technology',
          currentStage: 'Applied',
          score: 0,
          activity: [{ date: new Date(), event: 'Profile Initialized (In-Memory)' }]
        };
        fallbackCandidates.push(candidate);
      }
      Object.assign(candidate, req.body);
      if (req.body.skills) candidate.skills = req.body.skills;
      if (req.body.industry) candidate.industry = req.body.industry;
      candidate.activity.push({ date: new Date(), event: 'Profile Updated' });
      return res.json({ data: candidate });
    }
    const updated = await Candidate.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true, runValidators: true });
    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};
