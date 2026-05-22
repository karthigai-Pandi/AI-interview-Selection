import { Router } from 'express';
import { authorize, protect } from '../middleware/auth';
import { getCompanies, createCompany } from '../controllers/companyController';

const router = Router();

router.use(protect);
router.get('/', authorize(['admin', 'hr']), getCompanies);
router.post('/', authorize(['admin']), createCompany);

export default router;
