import { ChevronLeft, ChevronRight} from 'lucide-react';


const IntroSection = () => (
  <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
    <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-12 md:mb-16">
      Book a Consultation With Us
    </h1>

    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
      <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1000&auto=format&fit=crop" 
          alt="Consultation" 
          className="w-full h-64 md:h-[400px] object-cover"
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          Custom Designs for Kids That Inspires, Engages & Grows With Them
        </h2>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          From Cozy Bedrooms To Vibrant Classrooms And Adventurous Playgrounds, We Design And Build Magical Spaces Just For Kids. Book A Free Consultation Today And Let's Bring Your Vision To Life!
        </p>
      </div>
    </div>
  </section>
);

const FormSection = () => (
  <section className="max-w-4xl mx-auto px-6 md:px-12 pb-20">
    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
      Tell us about the Project
    </h2>
    
    <form className="space-y-6 md:space-y-8">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 font-medium text-lg">Full Name</label>
          <input type="text" placeholder="e.g John Doe" className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#007CA6] shadow-sm text-gray-600" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 font-medium text-lg">Email Address</label>
          <input type="email" placeholder="abc@example.com" className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#007CA6] shadow-sm text-gray-600" />
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-900 font-medium text-lg">Phone Number</label>
        <div className="relative">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 border-r border-gray-300 pr-3">+234</span>
           <input type="tel" className="w-full border border-gray-200 rounded-lg p-4 pl-20 focus:outline-none focus:border-[#007CA6] shadow-sm text-gray-600" />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 font-medium text-lg">Organization Name <span className="text-gray-500 font-normal text-sm">(Optional)</span></label>
          <input type="text" placeholder="e.g., Rainbow Primary School" className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#007CA6] shadow-sm text-gray-600" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 font-medium text-lg">Industry</label>
          <input type="text" placeholder="e.g., Education" className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#007CA6] shadow-sm text-gray-600" />
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-900 font-medium text-lg">Project Description</label>
        <textarea rows={4} placeholder='e.g., "We&#39;re redesigning our classroom interiors and need colorful wall designs and furniture recommendations."' className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#007CA6] shadow-sm text-gray-600 resize-none"></textarea>
      </div>

      {/* Row 5 */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-900 font-medium text-lg">Estimated Budget Range</label>
        <input type="text" placeholder="e.g., 800,000 - 1,200,000" className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-[#007CA6] shadow-sm text-gray-600" />
      </div>

      {/* Submit */}
      <button type="button" className="w-full bg-[#007CA6] hover:bg-[#00688d] text-white font-bold text-sm md:text-base py-4 rounded-full mt-4 transition-colors">
        Submit Request
      </button>
    </form>
  </section>
);

const PastProjects = () => (
  <section className="bg-[#F9FAFB] py-16 md:py-24 relative px-4">
    <div className="max-w-7xl mx-auto relative">
      {/* Navigation Arrows - Absolute on Desktop */}
      <button className="hidden md:flex absolute left-[-20px] lg:left-[-50px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 text-[#007CA6] border border-gray-100">
        <ChevronLeft size={24} />
      </button>
      <button className="hidden md:flex absolute right-[-20px] lg:right-[-50px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 text-[#007CA6] border border-gray-100">
        <ChevronRight size={24} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Our Past Projects
          </h2>
          <div className="h-1.5 w-24 bg-[#007CA6] rounded-full mb-6"></div>
          
          <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
            Over The Years, We've Collaborated With Schools, Hospitals, And Creative Brands To Bring Imagination Into Their Environments.
          </p>
          
          <button className="bg-[#007CA6] hover:bg-[#00688d] text-white px-8 py-3 rounded-md font-medium text-sm transition-colors">
            View More Project
          </button>
        </div>

        {/* Image Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl group mx-auto w-full max-w-lg lg:max-w-none">
          <img 
            src="https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=1000&auto=format&fit=crop" // Playground image
            alt="Project" 
            className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Floating Tags */}
          <div className="absolute top-6 left-6">
            <span className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">Education</span>
          </div>
          
          {/* Bottom Caption Box */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-xl py-3 px-4 shadow-lg text-center">
            <p className="text-[#FF9900] font-bold text-xs md:text-sm">
              Rainbow Classrooms Project – Springdale School
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Dots) */}
      <div className="flex justify-center gap-2 mt-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF9900]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
      </div>
    </div>
  </section>
);

export default function Consultation() {
  return (
    <div className="font-sans bg-white">
      <IntroSection />
      <FormSection />
      <PastProjects />
    </div>
  );
}