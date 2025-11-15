from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import os
import tempfile
import zipfile
import shutil
import tensorflow as tf
import nibabel as nib
import numpy as np
from utils import load_case_modalities, predict_full_volume, save_slices_as_png

# --- Configuration ---
MODEL_PATH = "model/brats_unet_modelv6.h5"
RESULTS_DIR = "results"

# --- Load Model ---
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
print("Model loaded successfully.")

app = FastAPI(title="Cortexa Brain Tumor Inference Service")


@app.post("/predict")
async def predict(file: UploadFile = File(...), case_id: str = Form(...)):
    temp_req_dir = tempfile.mkdtemp()
    
    try:
        zip_path = os.path.join(temp_req_dir, file.filename)
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extract_dir = os.path.join(temp_req_dir, "extracted")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        # =========================================================================
        # MODIFICATION START: The following logic is simplified
        # =========================================================================

        # The 'scan_dir' is now the same as the 'extract_dir'
        # This handles cases where files are at the root of the zip
        scan_dir = extract_dir

        # Check if the extracted files are in a sub-directory
        if len(os.listdir(extract_dir)) == 1 and os.path.isdir(os.path.join(extract_dir, os.listdir(extract_dir)[0])):
             scan_dir = os.path.join(extract_dir, os.listdir(extract_dir)[0])

        # Map modality files from the correct directory
        file_dict = {}
        for key in ["t1", "t1ce", "t2", "flair"]:
            candidates = [f for f in os.listdir(scan_dir) if f"_{key}.nii.gz" in f.lower()]
            if not candidates:
                return JSONResponse(
                    content={"error": f"Missing '{key}' modality in the zip file."},
                    status_code=400,
                )
            file_dict[key] = os.path.join(scan_dir, candidates[0])
            
        # =========================================================================
        # MODIFICATION END
        # =========================================================================

        # --- Preprocess & Predict ---
        X, affine = load_case_modalities(file_dict)
        y_pred = predict_full_volume(model, X)
        
        # --- Post-process and Save Results ---
        output_slice_dir = os.path.join(RESULTS_DIR, case_id)

        flair_vol = nib.load(file_dict["flair"]).get_fdata()
        total_slices = save_slices_as_png(y_pred, flair_vol, output_slice_dir)

        # --- Prepare JSON Response ---
        findings = "Tumor Detected" if np.any(y_pred > 0) else "No Anomalies Found"
        
        
        results_payload = {
            "finding": findings,
            "total_slices": total_slices
        }

        return JSONResponse(content={"status": "success", "results": results_payload})

    except Exception as e:
        print(f"An error occurred: {e}")
        return JSONResponse(content={"error": "An internal error occurred during processing."}, status_code=500)
    finally:
        shutil.rmtree(temp_req_dir)