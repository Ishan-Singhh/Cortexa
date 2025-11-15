import express from 'express';
import { createJob, getJobStatus, getSliceImage, getHistory } from '../controllers/jobController.js';
import upload from '../middlewares/multer.js';
import { requireAuth } from '@clerk/express';
const router = express.Router();

router.use(requireAuth())
router.post('/upload', upload.single('file'), createJob);

router.get('/status/:caseId', getJobStatus);

router.get('/api/results/:caseId/slice/:sliceNumber', getSliceImage);

router.get('/history',getHistory);

export default router;