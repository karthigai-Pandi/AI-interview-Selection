import { Router } from 'express';
import { protect } from '../middleware/auth';
import { uploadResume } from '../controllers/uploadController';
import { resumeUpload } from '../utils/upload';

const router = Router();

router.use(protect);
router.post('/resume', resumeUpload.single('resume'), uploadResume);

export default router;
