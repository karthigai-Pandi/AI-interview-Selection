import { Request, Response, NextFunction } from 'express';
import { OpenAI } from 'openai';
import Candidate from '../models/Candidate';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const requireOpenAI = () => {
  if (!openai) {
    throw new Error('OPENAI_API_KEY is not configured. Set OPENAI_API_KEY in .env to use AI features.');
  }
  return openai;
};

export const generateInterviewQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!openai) {
      return res.json({
        data: [
          'Describe a time when you solved a complex technical problem.',
          'How do you balance product requirements with technical debt?',
          'Explain how you would architect a scalable interview platform.',
          'Tell us about a time you handled a difficult stakeholder or team conflict.',
          'What metrics do you monitor to ensure engineering quality?',
        ],
      });
    }

    const { role, difficulty = 'medium' } = req.body;
    const prompt = `Generate five ${difficulty} level interview questions for a ${role} position with a mix of technical and behavioral prompts.`;
    const completion = await requireOpenAI().responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    res.json({ data: completion.output_text || 'AI question set generated' });
  } catch (error) {
    next(error);
  }
};

export const analyzeResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!openai) {
      return res.json({
        data: {
          atsScore: 78,
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
          missingKeywords: ['REST API', 'GraphQL', 'AWS'],
          suggestions: ['Add more measurable achievements', 'Highlight cloud deployment experience'],
        },
      });
    }

    const { text } = req.body;
    const prompt = `Analyze this resume text and return a JSON summary with ATS score, skills, missing keywords, and improvement suggestions.\n\nRESUME:\n${text}`;
    const completion = await requireOpenAI().responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    res.json({ data: completion.output_text || 'Resume analysis generated' });
  } catch (error) {
    next(error);
  }
};

export const rankCandidates = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { isDbConnected, fallbackCandidates } = require('../utils/fallbackDb');
    if (!isDbConnected()) {
      const candidates = [...fallbackCandidates].sort((a, b) => b.score - a.score).slice(0, 20);
      return res.json({ data: candidates });
    }
    const candidates = await Candidate.find().sort({ score: -1 }).limit(20);
    res.json({ data: candidates });
  } catch (error) {
    next(error);
  }
};
