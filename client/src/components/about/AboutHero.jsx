import React from 'react';

// Import the new graphic you'll save in the assets folder
import aboutHeroGraphic from '../../assets/about-hero-graphic.png';

export default function AboutHero() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        
        {/* Left Column: Text Content */}
        <div className="lg:pr-4">
          <div className="relative mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            {/* Eyebrow Text */}
            <p className="text-base font-semibold leading-7 text-violet-400">Our Mission</p>
            
            {/* Main Headline */}
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
              Advancing Neuro-Oncology with{' '}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 text-transparent bg-clip-text">
                Artificial Intelligence
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="mt-6 text-lg leading-8 text-gray-300">
              We are dedicated to providing clinicians with rapid, reliable, and precise tools for brain tumor segmentation, empowering data-driven decisions for better patient outcomes.
            </p>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="relative mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
          <img
            className="w-full rounded-2xl object-cover"
            src={aboutHeroGraphic}
            alt="Abstract digital art representing neural networks"
          />
        </div>

      </div>
    </div>
  );
}