import { Router } from 'express';
import { getCandidates, getCandidateProfile, updateCandidateProfile } from '../controllers/candidateController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/', authorize(['admin', 'hr']), getCandidates);
router.get('/me', getCandidateProfile);
router.put('/me', updateCandidateProfile);

export default router;
