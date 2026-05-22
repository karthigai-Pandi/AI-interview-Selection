import { Router } from 'express';
import { authorize, protect } from '../middleware/auth';
import { createInterview, getInterviews, updateInterview } from '../controllers/interviewController';

const router = Router();

router.use(protect);
router.get('/', authorize(['admin', 'hr']), getInterviews);
router.post('/', authorize(['admin', 'hr']), createInterview);
router.put('/:id', authorize(['admin', 'hr']), updateInterview);

export default router;
