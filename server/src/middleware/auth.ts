import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import mongoose from 'mongoose';
import { fallbackUsers } from '../controllers/authController';

interface JwtPayload {
  id: string;
}

const isDbConnected = () => mongoose.connection.readyState === 1;

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token = '';
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    
    if (isDbConnected()) {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: 'Unauthorized access' });
      req.user = { id: user._id.toString(), role: user.role } as any;
    } else {
      const user = fallbackUsers.find((u) => u.id === decoded.id);
      if (!user) return res.status(401).json({ message: 'Unauthorized access' });
      req.user = { id: user.id, role: user.role } as any;
    }
    
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
