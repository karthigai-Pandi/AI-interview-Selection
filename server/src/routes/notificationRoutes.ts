import { Router } from 'express';
import { authorize, protect } from '../middleware/auth';
import { getNotifications, markNotificationRead } from '../controllers/notificationController';

const router = Router();

router.use(protect);
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);

export default router;
