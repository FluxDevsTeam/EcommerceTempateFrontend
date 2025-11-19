import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

// --- Sub-Components ---

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return (
    <div className="bg-black text-white text-xs sm:text-sm py-3 px-4 flex justify-between items-center relative">
      <div className="w-full text-center font-medium">
        Sign up and get 20% off to your first order. <a href="#" className="underline hover:text-gray-300">Sign Up Now</a>
      </div>
      <button onClick={() => setIsVisible(false)} className="absolute right-4 text-white">
        <X size={16} />
      </button>
    </div>
  );
};


interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
}

const ProjectCard = ({ image, title, description }: ProjectCardProps) => (
  <div className="bg-white flex flex-col items-center text-center mb-12">
    <div className="w-full aspect-[4/3] overflow-hidden rounded-3xl mb-6">
      <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-6 px-4">
      {description}
    </p>
    <button className="bg-white border border-[#087CA7] text-[#087CA7] px-10 py-3 rounded-full font-semibold hover:bg-[#087CA7] hover:text-white transition-all">
      See This Project
    </button>
  </div>
);

interface SectionHeaderProps {
  title: string;
  linkText?: string;
}

const SectionHeader = ({ title, linkText }: SectionHeaderProps) => (
  <div className="mb-8 mt-12">
    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">{title}</h2>
    <div className="h-1.5 w-40 bg-[#087CA7] rounded-full mb-4"></div>
    {linkText && (
      <a href="#" className="text-[#087CA7] font-medium hover:underline flex items-center gap-1">
        {linkText} <ChevronRight size={16} />
      </a>
    )}
  </div>
);


export default function Industries() {
  const classroomImg = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1000&auto=format&fit=crop"; // Generic classroom
  const roomImg = "https://images.unsplash.com/photo-1525956180549-4d511fd16f35?q=80&w=1000&auto=format&fit=crop"; // Kids room

  const commonDesc = "We design learning spaces that make curiosity fun again. From classrooms to libraries, we use color, light, and form to nurture focus and creativity.";

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-white">

      <main className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-gray-500 text-sm mb-2">Industries we Work with</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Get to Know the Industries we Design For
          </h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            From Classrooms To Hospitals And Kid Brands, Our Designs Create Colorful Spaces And Experiences Where Children Can Feel Safe, Inspired, And Free To Express Themselves.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#087CA7] hover:bg-[#066a8f] text-white px-8 py-3 rounded-md font-semibold transition-colors">
              Shop Now
            </button>
            <button className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 px-8 py-3 rounded-md font-semibold transition-colors">
              Book Consultation
            </button>
          </div>
        </div>

        {/* Education Section */}
        <SectionHeader title="Education & School" linkText="See all Education Project" />
        
        {/* Repeating Cards as per image */}
        <div className="space-y-8">
          {[1, 2, 3].map((item) => (
            <ProjectCard 
              key={`edu-${item}`}
              image={classroomImg}
              title="Rainbow Classrooms Project"
              description={commonDesc}
            />
          ))}
        </div>

        {/* Hospitals Section (Repeated block structure from image) */}
        <div className="mt-16">
           <SectionHeader title="Hospitals & Childcare Centers" linkText="See all Toy & Kids Project" />
           <div className="space-y-8">
            <ProjectCard
              key="hosp1"
              image={roomImg}
              title="Rainbow Classrooms Project"
              description={commonDesc}
            />
             <ProjectCard
               key="hosp2"
               image={classroomImg}
               title="Rainbow Classrooms Project"
               description={commonDesc}
             />
            <ProjectCard
              key="hosp3"
              image={classroomImg}
              title="Rainbow Classrooms Project"
              description={commonDesc}
            />
          </div>
        </div>

         {/* Hospitals Section (Repeated Header block again as per image artifact) */}
         <div className="mt-16">
           <SectionHeader title="Hospitals & Childcare Centers" linkText="See all Toy & Kids Project" />
           <div className="space-y-8">
             {[1, 2, 3].map((item) => (
                <ProjectCard 
                key={`hosp-${item}`}
                image={item === 1 ? roomImg : classroomImg} // Alternate image for first card
                title="Rainbow Classrooms Project"
                description={commonDesc}
                />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Let's Help you Design a World Kids Would Love
          </h2>
          <p className="text-gray-600 mb-8">
            From Cozy Corners To Creative Classrooms—Start Your Custom Journey Today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#087CA7] hover:bg-[#066a8f] text-white px-10 py-3 rounded-md font-semibold transition-colors shadow-lg">
              Shop Now
            </button>
            <button className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 px-10 py-3 rounded-md font-semibold transition-colors shadow-lg">
              Book Consultation
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}