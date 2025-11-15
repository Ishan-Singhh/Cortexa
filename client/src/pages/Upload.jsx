// src/pages/Upload.jsx
import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import Background from "../components/BackGround";
import api from "../api";
import { useNavigate } from "react-router-dom";
// A simple SVG icon for the upload area
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
  >
    <path
      strokeLine
      cap="round"
      strokeLinejoin="round"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate(); // 2. Initialize the navigate function

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file drag
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  // Handle file selection via click
  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Trigger the hidden file input click
  const onButtonClick = () => {
    inputRef.current.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      // Use the 'api' instance. The URL is now just '/upload'
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // The navigation logic remains the same
      navigate(`/results/${res.data.caseId}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate bg-gray-900 min-h-screen px-6 text-white">
      <Background />
      <div className="mx-auto max-w-2xl py-48 sm:py-40 lg:py-48">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Upload MRI Scan
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Select or drag your scan file onto the area below. The analysis will
            begin after you submit.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col items-center gap-y-8"
          >
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              accept=".zip"
              className="hidden"
            />
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`flex flex-col items-center justify-center w-full max-w-lg p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-violet-400 bg-violet-500/10"
                    : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
                }`}
            >
              <UploadIcon />
              <p className="mt-4 text-sm text-gray-400">
                <span className="font-semibold text-violet-400">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">Supports: .zip</p>
            </div>

            {file && (
              <p className="text-md text-gray-300">
                Selected file:{" "}
                <span className="font-medium text-white">{file.name}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="rounded-md bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing..." : "Submit for Analysis"}
            </button>
          </form>
          <p className="mt-6 text-sm leading-8 text-gray-200">
            Upload a .zip file containing the t1, t1ce, t2, and flair scans in
            .nii.gz format (e.g., case_id_t1.nii.gz).
          </p>
        </div>
      </div>
    </div>
  );
}
