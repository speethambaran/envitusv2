import { Router } from "express";
import {
    addAlarmRule, listAlarmRule, editAlarmRule, deleteAlarmRule, getAlarmRuleDetails
} from '@controllers';
import { auth } from '../middlewares/Auth';

const router = Router();

router.post('/', addAlarmRule);
router.get('/', listAlarmRule);
router.get('/:id', getAlarmRuleDetails);
router.put('/:id', editAlarmRule);
router.delete('/:id', deleteAlarmRule);

export default router;