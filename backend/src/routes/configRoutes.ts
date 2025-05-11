import express from 'express';
import { updateApiKey, getConfigStatus, testApiKey } from '../controllers/configController';

const router = express.Router();

// Config routes
router.get('/status', getConfigStatus);
router.get('/test', testApiKey);
router.put('/api-key', updateApiKey);

export default router;
