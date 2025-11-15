import React from "react";
import { Brain, ActivitySquare, Cpu } from "lucide-react";

const technologyData = [
  {
    name: "Multi-Modal Analysis",
    description:
      "Our model simultaneously processes four complementary MRI modalities — T1, T1ce, T2, and FLAIR — to capture a comprehensive view of brain anatomy and pathology. This multi-channel approach enables a nuanced understanding of tumor heterogeneity, enhancing precision in identifying and segmenting key subregions.",
    icon: Brain,
  },
  {
    name: "Proven Performance",
    description:
      "Trained on a curated, multi-institutional dataset of annotated glioma MRI scans provided through an international collaboration of leading medical imaging centers, the model demonstrates exceptional reliability across diverse patient populations. Extensive validation confirms its strong capability in accurately delineating tumor boundaries and subcomponents with high spatial fidelity.",
    icon: ActivitySquare,
  },
  {
    name: "3D U-Net Architecture",
    description:
      "Built upon an advanced 3D U-Net framework, the model employs volumetric convolutions and deep encoder–decoder pathways to capture intricate spatial dependencies within MRI volumes. With more than 23 million optimized parameters, it achieves high-resolution segmentation through a patch-based training and sliding-window inference strategy tailored for robust performance on full 3D brain scans.",
    icon: Cpu,
  },
];

export default function TechnologySection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Our Technology: Advanced 3D Glioma Segmentation Model
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto">
          Our core technology is a state-of-the-art 3D U-Net architecture
          trained on a large-scale, multi-institutional dataset of annotated
          brain tumor MRI scans. Leveraging a sliding-window volumetric
          inference approach, the model analyzes entire 3D MRI volumes across
          multiple modalities, ensuring that every anatomical and pathological
          detail is precisely captured.
        </p>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {technologyData.map((item) => (
          <div
            key={item.name}
            className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 backdrop-blur-xl ring-1 ring-white/10 hover:ring-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white group-hover:scale-105 transition-transform duration-300">
              <item.icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">
              {item.name}
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
