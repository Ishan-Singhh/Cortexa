import { v4 as uuidv4 } from 'uuid';
import pool from '../configs/db.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 


const INFERENCE_SERVICE_URL = process.env.INFERENCE_SERVICE_URL;

async function runInference(filePath, caseId, originalFilename) {
  try {
    await pool.query('UPDATE jobs SET status = $1 WHERE case_id = $2', ['processing', caseId]);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), originalFilename);
    formData.append('case_id', caseId);


    console.log(`Sending job ${caseId} to inference service...`);
    const response = await axios.post(INFERENCE_SERVICE_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 600000, // 10 minute timeout
    });

    if (response.data.status === 'success') {
      await pool.query(
        'UPDATE jobs SET status = $1, results = $2 WHERE case_id = $3',
        ['completed', response.data.results, caseId]
      );
      console.log(`Job ${caseId} completed successfully.`);
    } else {
      throw new Error(response.data.error || 'Inference service returned an error.');
    }
  } catch (error) {
    console.error(`Inference failed for ${caseId}:`, error.message);
    await pool.query('UPDATE jobs SET status = $1 WHERE case_id = $2', ['error', caseId]);
  } finally {
    // Clean up the uploaded file from the 'uploads' directory
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Failed to delete temporary upload file: ${filePath}`, err);
    });
  }
}

// Controller for the /upload route
export const createJob = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const caseId = uuidv4();
    const { path: filePath, originalname } = req.file;
    const {userId}=req.auth;
    await pool.query(
      'INSERT INTO jobs (case_id, status, file_path, user_id) VALUES ($1, $2, $3, $4)',
      [caseId, 'pending', filePath, userId]
    );

    // Respond to the frontend immediately
    res.status(202).json({ caseId });

    // Start the background task
    runInference(filePath, caseId, originalname);

  } catch (error) {
    console.error('Upload processing failed:', error);
    res.status(500).json({ error: 'Failed to start upload process.' });
  }
};

// Controller for the /status/:caseId route
export const getJobStatus = async (req, res) => {
  const { caseId } = req.params;
  const { userId } = req.auth;  
  try {
    const result = await pool.query('SELECT status, results FROM jobs WHERE case_id = $1 AND user_id=$2', [caseId,userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found or access denied' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error.' });
  }
};

export const getHistory = async (req,res)=>{
  try{
    const { userId } = req.auth;
    const result = await pool.query(
      'SELECT case_id, status, results, created_at FROM jobs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId] 
    );
    res.json(result.rows);
  }
  catch(error){
    console.error('Failed to fetch history:', error);
    res.status(500).json({ error: 'Database error while fetching history.' });
  }
}

// Controller for the /api/results/:caseId/slice/:sliceNumber route
export const getSliceImage = (req, res) => {
  const { caseId, sliceNumber } = req.params;
  const { userId } = req.auth();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);


  const imagePath = path.resolve(
    __dirname,
    '..', 
    '..', 
    'inference-service',
    'results',
    caseId,
    `slice_${sliceNumber}.png`
  );


  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    console.error(`Slice not found at path: ${imagePath}`); 
    res.status(404).json({ error: 'Slice not found' });
  }
};