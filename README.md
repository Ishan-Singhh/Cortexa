# Cortexa: AI-Powered Brain Tumor Segmentation

Cortexa is a full-stack web application designed to assist neuro-oncologists and clinicians by providing rapid, reliable, and precise AI-driven segmentation of brain tumors from MRI scans. Leveraging a state-of-the-art 3D U-Net model, Cortexa processes multi-modal MRI data (T1, T1ce, T2, FLAIR) to delineate tumor subregions, empowering data-driven decisions for better patient outcomes.

## Features

**Frontend (React.js)**
* **Intuitive User Interface:** A clean, responsive design for seamless navigation and interaction.
* **Secure Authentication:** User management and authentication powered by Clerk.js, featuring a smooth in-app sign-in/sign-up experience.
* **MRI Scan Upload:** Easy upload of NIfTI MRI files (.nii.gz).
* **Real-time Processing Status:** Track the status of your uploaded scans (pending, processing, completed, failed).
* **Interactive 3D Visualization:** View processed MRI scans with overlaid, color-coded tumor segmentation masks slice by slice in a dedicated 3D viewer.
* **Scan History:** A personalized dashboard showing all past uploaded scans and their results.

**Backend (Node.js/Express.js)**
* **RESTful API:** Manages job submissions, status tracking, and retrieval of processed results.
* **Secure Endpoints:** All sensitive API routes are protected using Clerk.js middleware, ensuring only authenticated users can submit or view data.
* **File Management:** Handles secure storage of uploaded MRI scans and processed output.
* **Scalable Architecture:** Designed to communicate asynchronously with the AI Inference Service.
* **Database:** PostgreSQL for persistent storage of job metadata, user IDs, and results.

**AI Inference Service (Python/FastAPI)**
* **3D U-Net Model:** Utilizes a custom 3D U-Net architecture built with TensorFlow/Keras for volumetric brain tumor segmentation.
    * **Architecture:** Features **Residual Blocks**, **Attention Gates**, and **Squeeze-and-Excitation (SE) Blocks** for enhanced feature learning and context awareness.
    * **Input:** Processes 4-channel MRI data (T1, T1ce, T2, FLAIR).
    * **Loss Function:** Optimized with a **combined Tversky and Categorical Crossentropy loss** for robust segmentation of imbalanced classes.
    * **Training:** Leverages **mixed-precision (`mixed_float16`) training** for faster convergence and reduced memory footprint on GPUs.
* **Data Preprocessing:** Implements a `tf.data` pipeline for efficient **3D patch extraction**, normalization, and augmentation.
* **Sliding-Window Inference:** Deploys a **sliding-window technique** for robust full-volume segmentation from patches, mitigating boundary artifacts.
* **FastAPI:** Provides a lightweight, asynchronous API for receiving MRI files, running inference, and returning results.

## Technologies Used

* **Frontend:** `React.js`, `Tailwind CSS`, `React Router DOM`, `Headless UI`, `Clerk.js`
* **Backend:** `Node.js`, `Express.js`, `PostgreSQL` (`pg`), `Clerk.js (@clerk/express)`, `Multer`, `uuid`
* **AI Inference Service:** `Python`, `FastAPI`, `TensorFlow/Keras`, `NumPy`, `SciPy`, `NiBabel`
* **Database:** `PostgreSQL`
* **Deployment:** (Planned: Vercel for Frontend & Backend, Render/Fly.io for Inference)

## Architecture
1.  **Frontend (React.js):** Users interact with the application, upload MRI files, and view results. Clerk.js handles client-side authentication.
2.  **Backend (Express.js):** Serves as the API gateway. It receives requests from the frontend, authenticates them via Clerk.js middleware, manages file uploads, records job data in PostgreSQL, and orchestrates calls to the AI Inference Service.
3.  **AI Inference Service (FastAPI):** A dedicated Python service that performs the actual brain tumor segmentation using the TensorFlow 3D U-Net model. It's isolated and only accepts requests from the Express backend.
