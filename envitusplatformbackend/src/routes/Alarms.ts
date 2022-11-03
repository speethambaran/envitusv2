import { Router } from "express";
import { getActiveAlarms, updateAlert, getAlarmHistory, clearAllAlerts, clearAllAlertHistory } from '@controllers';

const router = Router();

router.get('/', getActiveAlarms);
router.get('/history', getAlarmHistory);
router.put('/clear', clearAllAlerts);
router.put('/history/clear', clearAllAlertHistory)
router.put('/:id', updateAlert);

export default router;