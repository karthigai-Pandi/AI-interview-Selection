import { Router } from 'express';
import { authorize, protect } from '../middleware/auth';
import { generateInterviewQuestions, analyzeResume, rankCandidates } from '../controllers/aiController';

const router = Router();

router.use(protect);
router.post('/mock-interview', authorize(['admin', 'hr', 'candidate']), generateInterviewQuestions);
router.post('/generate-questions', authorize(['admin', 'hr', 'candidate']), generateInterviewQuestions);
router.post('/resume-analyze', authorize(['admin', 'hr', 'candidate']), analyzeResume);
router.post('/analyze-resume', authorize(['admin', 'hr', 'candidate']), analyzeResume);
router.get('/rank', authorize(['admin', 'hr']), rankCandidates);

export default router;
