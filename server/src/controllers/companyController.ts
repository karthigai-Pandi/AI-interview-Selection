import { Request, Response, NextFunction } from 'express';
import Company from '../models/Company';
import { isDbConnected, fallbackCompanies } from '../utils/fallbackDb';

export const getCompanies = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isDbConnected()) {
      return res.json({ data: fallbackCompanies });
    }
    const companies = await Company.find().limit(50);
    res.json({ data: companies });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isDbConnected()) {
      const company = {
        _id: 'com_' + Date.now(),
        name: req.body.name,
        industry: req.body.industry || 'Technology',
        website: req.body.website || ''
      };
      fallbackCompanies.push(company);
      return res.status(201).json({ data: company });
    }
    const company = await Company.create(req.body);
    res.status(201).json({ data: company });
  } catch (error) {
    next(error);
  }
};
