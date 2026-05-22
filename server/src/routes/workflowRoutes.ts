import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getAptitudeQuestions, getTechnicalQuestions, getCodingProblem, getInterviewQuestions } from '../controllers/workflowController';

const router = Router();

router.use(protect);
router.get('/aptitude', getAptitudeQuestions);
router.get('/technical', getTechnicalQuestions);
router.get('/coding', getCodingProblem);
router.get('/interview', getInterviewQuestions);

export default router;
