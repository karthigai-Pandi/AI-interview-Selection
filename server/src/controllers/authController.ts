import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';

const signToken = (id: string) => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign({ id }, secret, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') } as jwt.SignOptions);
};

export const fallbackUsers: Array<{ id: string; name: string; email: string; password: string; role: 'candidate' | 'admin' | 'hr'; verified: boolean }> = [
  {
    id: '507f1f77bcf86cd799439011',
    name: 'Jane Candidate',
    email: 'candidate@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'candidate',
    verified: true,
  },
  {
    id: '507f1f77bcf86cd799439012',
    name: 'John Recruiter',
    email: 'hr@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'hr',
    verified: true,
  },
  {
    id: '507f1f77bcf86cd799439013',
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    verified: true,
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (isDbConnected()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) return res.status(409).json({ message: 'Email already in use' });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({ name, email: normalizedEmail, password: hashedPassword, role: role || 'candidate' });
      const token = signToken(user._id.toString());

      return res.status(201).json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, token });
    }

    const existing = fallbackUsers.find((u) => u.email === normalizedEmail);
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = new mongoose.Types.ObjectId().toString();
    const user = { id, name, email: normalizedEmail, password: hashedPassword, role: role || 'candidate', verified: false };
    fallbackUsers.push(user);
    const token = signToken(id);

    return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

      const token = signToken(user._id.toString());
      return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    }

    const user = fallbackUsers.find((u) => u.email === normalizedEmail);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user.id);
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' });
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    const newToken = signToken(decoded.id);
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
