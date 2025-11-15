import React from "react";

const legendData = [
  { color: "bg-red-500", label: "Necrotic tumor core" },
  { color: "bg-pink-400", label: "Peritumoral invaded tissue" },
  { color: "bg-cyan-400", label: "GD-enhancing tumor" },
  { color: "bg-blue-600", label: "Background" },
];

export default function VisualizationSection({ visualizationImage }) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-7 lg:gap-x-16">
        <div className="lg:col-span-3 text-center lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            From Data to Diagnosis
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            The model's output is a detailed segmentation mask overlaid on the
            FLAIR scan. We use a clear color-coded legend to help clinicians
            immediately identify the different tumor subregions.
          </p>
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-white">Legend</h3>
            <ul role="list" className="mt-6 space-y-4 inline-block text-left">
              {legendData.map((item) => (
                <li key={item.label} className="flex items-center gap-x-4">
                  <div
                    className={`flex-none w-5 h-5 rounded-md border border-white/20 ${item.color}`}
                  ></div>
                  <span className="text-sm leading-6 text-gray-300">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-center">
          <img
            src={visualizationImage}
            alt="Model segmentation output"
            className="w-full max-w-md lg:max-w-full h-auto rounded-2xl ring-1 ring-white/10 object-contain shadow-2xl shadow-violet-500/20 
             lg:transition-transform lg:duration-500 lg:ease-out lg:hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
}
