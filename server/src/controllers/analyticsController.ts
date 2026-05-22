import { Request, Response, NextFunction } from 'express';
import Candidate from '../models/Candidate';
import Interview from '../models/Interview';
import { isDbConnected, fallbackCandidates, fallbackInterviews } from '../utils/fallbackDb';

export const getAnalytics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isDbConnected()) {
      const totalCandidates = fallbackCandidates.length;
      const upcomingInterviews = fallbackInterviews.filter((i) => i.status === 'scheduled').length;
      
      const counts: { [key: string]: number } = {};
      fallbackCandidates.forEach((c) => {
        counts[c.currentStage] = (counts[c.currentStage] || 0) + 1;
      });
      const topPipeline = Object.entries(counts).map(([_id, count]) => ({ _id, count }));
      
      return res.json({ data: { totalCandidates, upcomingInterviews, topPipeline } });
    }
    
    const totalCandidates = await Candidate.countDocuments();
    const upcomingInterviews = await Interview.countDocuments({ status: 'scheduled' });
    const topPipeline = await Candidate.aggregate([
      { $group: { _id: '$currentStage', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ data: { totalCandidates, upcomingInterviews, topPipeline } });
  } catch (error) {
    next(error);
  }
};
