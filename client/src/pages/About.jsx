import React from 'react';
import Background from '../components/BackGround';

// Import the new section components
import AboutHero from '../components/about/AboutHero';
import TechnologySection from '../components/about/TechnologySection';
import TeamSection from '../components/about/TeamSection';
import VisualizationSection from '../components/about/VisualizationSection';
import visualizationImage from '../assets/visualization-output.png';

// --- Data for the "Meet the Team" section ---
const teamData = [
  {
    name: 'Dr. Evelyn Reed',
    role: 'Founder & CEO',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Dr. Alex Chen',
    role: 'Lead ML Engineer',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Dr. Maria Garcia',
    role: 'Chief Medical Officer',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export default function About() {
  return (
    <div className="relative isolate bg-gray-900 min-h-screen text-white">
      <Background />

      <main className="relative z-10 py-14 sm:py-20 lg:py-30">
        <AboutHero />
        <TechnologySection />
        <VisualizationSection visualizationImage={visualizationImage} />

      </main>
    </div>
  );
}