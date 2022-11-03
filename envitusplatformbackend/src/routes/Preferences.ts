import { Router } from 'express';
import { validate } from '../middlewares/Validation';
import { auth } from '../middlewares/Auth';
import {
    getPreferences, addPreferences, updatePreferences

} from '@controllers';

const router = Router();

router.post('/', auth('Admin', 'Super Admin'), validate.addPreference, addPreferences);
router.get('/', auth('Admin', 'Super Admin'), validate.getPreference, getPreferences);
router.put('/:id', auth('Admin', 'Super Admin'), updatePreferences);
export default router;