import React from 'react';
import Hero from '../components/Hero';
import Background from '../components/BackGround';
import Avatar from '../components/Avatar';

export default function Home() {
  return (
    <div className="relative isolate bg-gray-900 min-h-screen px-6 pt-14 lg:px-8 text-white">
      
      
      <Background />
      
      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          
          <Hero />

          {/* Social Proof Section with animation classes added back */}
          <div className="mt-16 flow-root opacity-0 [animation:fadeInUp_1s_ease-out_0.6s_forwards]">
            <div className="-mt-4 sm:-ml-8 flex flex-wrap justify-center lg:-ml-4">
              <div className="mt-4 ml-8 flex flex-shrink-0 flex-grow lg:ml-4 lg:flex-grow-0">
                <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold leading-6 text-gray-400 mb-4">Trusted by thousands of doctors worldwide</p>
                    <Avatar />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}