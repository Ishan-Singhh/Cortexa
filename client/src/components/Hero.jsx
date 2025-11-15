import React from "react";
import { Link } from "react-router-dom";
export default function Hero() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl opacity-0 [animation:fadeInUp_1s_ease-out_forwards]">
        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 text-transparent bg-clip-text">
          AI-Powered Clarity
        </span>{" "}
        in Neuro-Diagnostics
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto opacity-0 [animation:fadeInUp_1s_ease-out_0.2s_forwards]">
        Our advanced segmentation model provides rapid and accurate delineation
        of brain tumors from MRI scans, helping you make clinical decisions with
        greater confidence.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6 opacity-0 [animation:fadeInUp_1s_ease-out_0.4s_forwards]">
        <Link
          to="/upload"
          className="rounded-md bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 transition-colors"
        >
          Get Started
        </Link>
        <Link
          to="/about"
          className="text-sm font-semibold leading-6 text-white"
        >
          Learn more <span aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}
