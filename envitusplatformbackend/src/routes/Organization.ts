import { Router } from 'express';
import { validate } from '../middlewares/Validation';
import { auth } from '../middlewares/Auth';
import {
    listOrganization, addOrganization, updateOrganization,
    deleteOrganization, getOrganizationDetails, getOrganizationIds

} from '@controllers';

const router = Router();

router.post('/', auth('Super Admin', 'Admin'), addOrganization);
router.get('/', listOrganization);
router.get('/ids', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), getOrganizationIds);
router.get('/:id', getOrganizationDetails);
router.put('/:id', auth('Super Admin', 'Admin'), updateOrganization);
router.delete('/:id', auth('Super Admin', 'Admin'), deleteOrganization);
export default router;