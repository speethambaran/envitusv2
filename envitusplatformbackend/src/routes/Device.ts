import { Router } from 'express';
import { validate } from '../middlewares/Validation';
import { auth } from '../middlewares/Auth';
import { dataAuth } from '../middlewares/DataAuth';
import {
    listDevice, addDevice, updateDevice,
    deleteDevice, getDeviceDetails,
    getDeviceErrors, getDeviceStatistics,
    getDeviceIds, processDeviceData,
    getLiveData, getStatistics,
    getRawData, restoreDevice, deleteDevicePermanently
} from '@controllers';

const router = Router();

router.post('/', auth('Admin', 'Super Admin'), addDevice);
router.get('/', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), listDevice);
router.get('/ids', getDeviceIds);
router.get('/statistics', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), getDeviceStatistics);
router.get('/errors', getDeviceErrors);
router.get('/:id', getDeviceDetails);
router.put('/:id', auth('Admin', 'Super Admin'), updateDevice);
router.delete('/:id', auth('Admin', 'Super Admin'), deleteDevice);
router.delete('/permanently/:id', auth('Admin', 'Super Admin'), deleteDevicePermanently);
router.put('/restore/:id', auth('Admin', 'Super Admin'), restoreDevice);

router.post('/sensor/livedata', dataAuth(), processDeviceData);
router.get('/sensor/livedata', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), getLiveData);
router.get('/sensor/statistics', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), getStatistics);
router.get('/sensor/rawdata', getRawData);

export default router;
