import { Router } from 'express';
import { validate } from '../middlewares/Validation';
import { auth } from '../middlewares/Auth';
import { addApiKey, updateApiKey, listApiKey, getApiKeyDetails, deleteApiKey } from '@controllers';

const router = Router();

router.post('/', auth('Super Admin', 'Admin'), validate.apikeyAdd, addApiKey);
router.get('/', auth('Super Admin', 'Admin', 'Supervisor'), listApiKey);
router.get('/:id', auth('Super Admin', 'Admin', 'Supervisor'), getApiKeyDetails);
router.put('/:id', auth('Super Admin', 'Admin'), updateApiKey);
router.delete('/:id', auth('Super Admin', 'Admin'), deleteApiKey);
export default router;