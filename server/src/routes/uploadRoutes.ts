import { Router } from 'express';
import { protect } from '../middleware/auth';
import { uploadResume } from '../controllers/uploadController';
import { resumeUpload } from '../utils/upload';

const router = Router();

// Allow public resume uploads for initial onboarding (no auth required)
router.post('/resume', resumeUpload.single('resume'), uploadResume);

export default router;
