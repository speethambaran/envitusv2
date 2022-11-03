import { Router } from 'express';
import { auth } from '../middlewares/Auth';
import {
    dashboardStatistics
} from '@controllers';

const router = Router();
router.get('/statistics/:deviceId', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), dashboardStatistics);

export default router;