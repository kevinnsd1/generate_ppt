
import express from 'express';
import {
    generatePpt,
    webhookMessageBird,
    downloadFile
} from '../controllers/custom_report_controller';

const router = express.Router();

router.post('/generate_ppt', generatePpt);
router.post('/webhook_message_bird', webhookMessageBird);
router.get('/download', downloadFile);

export default router;
