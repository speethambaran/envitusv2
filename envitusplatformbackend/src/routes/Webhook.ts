import { Router } from 'express';
import { validate } from '../middlewares/Validation';
import { auth } from '../middlewares/Auth';
import { addWebhook, listWebhook, deleteWebhook, getWebhookDetails, updateWebhook } from '../controllers/WebhookController'

const router = Router();
router.post('/', auth('Super Admin', 'Admin'),validate.webhookAdd, addWebhook);
router.get('/', auth('Super Admin', 'Admin', 'Supervisor'), listWebhook);
router.delete('/:id', auth('Super Admin'), deleteWebhook);
router.get('/:id', auth('Super Admin', 'Admin'), getWebhookDetails);
router.put('/:id', auth('Super Admin', 'Admin'), updateWebhook);

export default router;
