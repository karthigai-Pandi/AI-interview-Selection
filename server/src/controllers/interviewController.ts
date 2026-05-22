import { Request, Response, NextFunction } from 'express';
import Interview from '../models/Interview';
import { isDbConnected, fallbackInterviews } from '../utils/fallbackDb';

export const getInterviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isDbConnected()) {
      return res.json({ data: fallbackInterviews });
    }
    const interviews = await Interview.find().sort({ scheduledAt: -1 }).limit(50);
    res.json({ data: interviews });
  } catch (error) {
    next(error);
  }
};

export const createInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isDbConnected()) {
      const interview = {
        _id: 'i_' + Date.now(),
        candidateId: req.body.candidateId,
        interviewer: req.body.interviewer,
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : new Date(),
        status: req.body.status || 'scheduled',
        round: req.body.round || 'technical',
        feedback: req.body.feedback || '',
        score: req.body.score || 0
      };
      fallbackInterviews.push(interview as any);
      return res.status(201).json({ data: interview });
    }
    const interview = await Interview.create(req.body);
    res.status(201).json({ data: interview });
  } catch (error) {
    next(error);
  }
};

export const updateInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isDbConnected()) {
      const idx = fallbackInterviews.findIndex((i) => i._id === req.params.id);
      if (idx !== -1) {
        Object.assign(fallbackInterviews[idx], req.body);
        return res.json({ data: fallbackInterviews[idx] });
      }
      return res.status(404).json({ message: 'Interview not found' });
    }
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ data: interview });
  } catch (error) {
    next(error);
  }
};
