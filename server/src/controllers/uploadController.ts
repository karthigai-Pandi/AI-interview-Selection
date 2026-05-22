import { Request, Response, NextFunction } from 'express';

export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }
    const fileUrl = `/uploads/${req.file.originalname}`;
    res.status(201).json({ data: { fileUrl, filename: req.file.originalname } });
  } catch (error) {
    next(error);
  }
};
