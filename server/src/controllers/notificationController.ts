import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import { isDbConnected, fallbackNotifications } from '../utils/fallbackDb';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!isDbConnected()) {
      const notifications = fallbackNotifications
        .filter((n) => n.userId === req.user!.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return res.json({ data: notifications });
    }
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!isDbConnected()) {
      const notification = fallbackNotifications.find((n) => n._id === req.params.id && n.userId === req.user!.id);
      if (notification) {
        notification.read = true;
        return res.json({ data: notification });
      }
      return res.status(404).json({ message: 'Notification not found' });
    }
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    res.json({ data: notification });
  } catch (error) {
    next(error);
  }
};
