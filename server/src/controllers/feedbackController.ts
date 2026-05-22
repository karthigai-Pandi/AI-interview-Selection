import { Request, Response, NextFunction } from 'express';
import Feedback from '../models/Feedback';
import { isDbConnected, fallbackFeedbacks } from '../utils/fallbackDb';

export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isDbConnected()) {
      const feedback = {
        _id: 'f_' + Date.now(),
        candidateId: req.body.candidateId,
        interviewerId: req.body.interviewerId,
        type: req.body.type || 'technical',
        notes: req.body.notes || '',
        score: req.body.score || 0
      };
      fallbackFeedbacks.push(feedback as any);
      return res.status(201).json({ data: feedback });
    }
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ data: feedback });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackForCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { candidateId } = req.params;
    if (!isDbConnected()) {
      const feedbacks = fallbackFeedbacks.filter((f) => f.candidateId === candidateId);
      return res.json({ data: feedbacks });
    }
    const feedback = await Feedback.find({ candidateId });
    res.json({ data: feedback });
  } catch (error) {
    next(error);
  }
};
