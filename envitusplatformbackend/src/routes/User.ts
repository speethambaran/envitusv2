import { Router } from 'express';
import { validate } from '../middlewares/Validation';
import {
    usersList, addUser,
    editUser, updateUserDetails,
    getUserDetails, updateUserPassword,
    getUserDetailsById, getUserIds, deleteUser
} from '@controllers';
import { auth } from '../middlewares/Auth';

const router = Router();
router.get('/', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), usersList);
router.post('/', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), validate.userAdd, addUser);
router.put('/me', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), updateUserDetails);
router.get('/ids', auth('Admin', 'Super Admin'), getUserIds);
router.put('/me/password', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), validate.updateUserPassword, updateUserPassword);
router.get('/me', auth('Admin', 'Supervisor', 'Operator', 'Super Admin'), getUserDetails);
router.get('/:id', auth('Admin', 'Super Admin'), getUserDetailsById);
router.put('/:id', auth('Admin', 'Super Admin'), editUser);
router.delete('/:id', auth('Admin', 'Super Admin'), deleteUser);
export default router;