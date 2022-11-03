import { Router } from 'express';
import { login, register } from '@controllers';
import { validate } from '../middlewares/Validation';

const router = Router();
router.post('/login', validate.login, login);
router.post('/register', register);
export default router;