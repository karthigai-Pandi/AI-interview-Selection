import { Router } from 'express';
import { authorize, protect } from '../middleware/auth';
import { createFeedback, getFeedbackForCandidate } from '../controllers/feedbackController';

const router = Router();

router.use(protect);
router.post('/', authorize(['admin', 'hr']), createFeedback);
router.get('/candidate/:candidateId', authorize(['admin', 'hr', 'candidate']), getFeedbackForCandidate);

export default router;
