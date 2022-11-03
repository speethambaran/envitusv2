import { Router } from 'express';
import { validate } from '../middlewares/Validation';
import { auth } from '../middlewares/Auth';
import { addCalibCert, listCalibCert, deleteCalibCert, initiateDownload } from '../controllers/CalibrationController';
import { uploadDiskStorage } from '@utils'

const router = Router();
router.post('/', uploadDiskStorage.single('calibration-cert'), addCalibCert);
router.get('/', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), listCalibCert);
router.get('/download/:id', initiateDownload);
router.delete('/:id', deleteCalibCert);
export default router;
