import { Router } from 'express';
import { authorize, protect } from '../middleware/auth';
import { getAnalytics } from '../controllers/analyticsController';

const router = Router();

router.use(protect);
router.get('/', authorize(['admin', 'hr']), getAnalytics);

export default router;
