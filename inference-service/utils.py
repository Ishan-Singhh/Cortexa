import numpy as np
import tensorflow as tf
import nibabel as nib
import os
import imageio
from tensorflow_addons.layers import GroupNormalization

# ------------------------
# Preprocess 4 MRI modalities (No changes here)
# ------------------------
def load_case_modalities(file_dict):
    """
    Load and stack 4 MRI modalities into shape (H, W, D, 4).
    """
    vols = []
    affine = None # Store the affine matrix to use it later if needed
    for i, key in enumerate(["t1", "t1ce", "t2", "flair"]):
        nii = nib.load(file_dict[key])
        if i == 0:
            affine = nii.affine # Save affine from one of the scans
        vol = nii.get_fdata()
        vol = normalize_volume(vol)
        vols.append(vol)

    X = np.stack(vols, axis=-1)
    return X.astype(np.float32), affine


def normalize_volume(vol):
    """Z-score normalize non-zero voxels only (same as training)."""
    mask = vol > 0
    if np.any(mask):
        mean = vol[mask].mean()
        std = vol[mask].std() + 1e-8
        vol = (vol - mean) / std
    else:
        vol = (vol - np.mean(vol)) / (np.std(vol) + 1e-8)
    return vol



# ------------------------
# Sliding window prediction 
# ------------------------
def predict_full_volume(model, X, patch_size=(80,80,80), overlap=32):
    h, w, d, c = X.shape
    ph, pw, pd = patch_size
    stride = (ph - overlap, pw - overlap, pd - overlap)

    prob_map = np.zeros((h, w, d, 4), dtype=np.float32)
    count_map = np.zeros((h, w, d, 4), dtype=np.float32)

    for z in range(0, h - ph + 1, stride[0]):
        for y in range(0, w - pw + 1, stride[1]):
            for x in range(0, d - pd + 1, stride[2]):
                patch = X[z:z+ph, y:y+pw, x:x+pd, :]
                patch = np.expand_dims(patch, 0)
                pred = model.predict(patch, verbose=0)[0]

                prob_map[z:z+ph, y:y+pw, x:x+pd, :] += pred
                count_map[z:z+ph, y:y+pw, x:x+pd, :] += 1

    prob_map /= np.maximum(count_map, 1e-8)
    return np.argmax(prob_map, axis=-1)


# ---------------------------------------------
# Convert Prediction to PNG Slices
# ---------------------------------------------
def save_slices_as_png(prediction_volume, flair_volume, output_dir):
    """
    Saves each 2D slice of the 3D prediction volume as a PNG file.
    An overlay is created on top of the FLAIR sequence for better visualization.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Define a colormap for the tumor classes (RGBA)
    # Class 0: Transparent, 1: Red, 2: Green, 3: Blue
    colormap = np.array([
        [0, 0, 0, 0],       # Background
        [255, 0, 0, 128],   # Necrotic tumor core (Red, semi-transparent)
        [0, 255, 0, 128],   # Peritumoral invaded tissue (Green, semi-transparent)
        [0, 0, 255, 128],   # GD-enhancing tumor (Blue, semi-transparent)
    ], dtype=np.uint8)

    # Normalize FLAIR to 0-255 for grayscale background
    flair_norm = (flair_volume - flair_volume.min()) / (flair_volume.max() - flair_volume.min())
    flair_norm = (flair_norm * 255).astype(np.uint8)

    num_slices = prediction_volume.shape[2]

    for i in range(num_slices):
        # Get the prediction slice and map it to colors
        pred_slice = prediction_volume[:, :, i]
        colored_mask = colormap[pred_slice]

        # Get the FLAIR slice and convert it to RGBA
        flair_slice = np.stack([flair_norm[:, :, i]]*4, axis=-1)
        flair_slice[:, :, 3] = 255 # Full alpha for background
        
        # Combine FLAIR and the colored mask
        # Simple alpha blending: output = alpha * overlay + (1 - alpha) * background
        alpha = colored_mask[:, :, 3, np.newaxis] / 255.0
        combined_slice = (alpha * colored_mask[:, :, :3] + (1 - alpha) * flair_slice[:, :, :3]).astype(np.uint8)
        
        # Save the combined slice
        slice_filename = os.path.join(output_dir, f"slice_{i}.png")
        imageio.imwrite(slice_filename, combined_slice)
    
    return num_slices