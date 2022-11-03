import { Router } from 'express';
import { validate } from '../middlewares/Validation';
import { auth } from '../middlewares/Auth';
import {
    addSensorType, listSensorType, updateSensorType,
    getSensorTypeDetails, deleteSensorType,
    addSensorSpec, listSensorSpec, updateSensorSpec,
    getSensorSpecDetails, deleteSensorSpec, listSensorSpecIds,
    listSensorTypeIds, getSensorParameters
} from '@controllers';

const router = Router();

router.post('/type', auth('Super Admin'), addSensorType);
router.get('/type', listSensorType);
router.get('/parameters', getSensorParameters);
router.get('/type/ids', listSensorTypeIds);
router.get('/type/:id', getSensorTypeDetails);
router.put('/type/:id', auth('Super Admin'), updateSensorType);
router.delete('/type/:id', auth('Super Admin'), deleteSensorType);

router.post('/spec', auth('Super Admin'), addSensorSpec);
router.get('/spec', listSensorSpec);
router.get('/spec/ids', listSensorSpecIds);
router.get('/spec/:id', getSensorSpecDetails);
router.put('/spec/:id', auth('Super Admin'), updateSensorSpec);
router.delete('/spec/:id', auth('Super Admin'), deleteSensorSpec);
export default router;