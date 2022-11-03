import { Router } from 'express';

import { getServerPreferences } from '../controllers/ServerController';

const router = Router();
router.get('/preferences', getServerPreferences);

export default router;