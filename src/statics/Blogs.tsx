import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const HeroSection = () => (
  <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-gray-100 flex items-center justify-center">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2000&auto=format&fit=crop" 
        alt="Creative Desk" 
        className="w-full h-full object-cover opacity-30 grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* Artistic "BLOGGING" Text Background Effect */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full justify-center items-center opacity-20 select-none pointer-events-none">
            <span className="text-[150px] font-black text-[#007CA6]">B</span>
            <span className="text-[150px] font-black text-[#FDB043]">L</span>
            <span className="text-[150px] font-black text-red-500">O</span>
            <span className="text-[150px] font-black text-green-500">G</span>
            <span className="text-[150px] font-black text-purple-500">G</span>
            <span className="text-[150px] font-black text-[#007CA6]">I</span>
            <span className="text-[150px] font-black text-orange-500">N</span>
            <span className="text-[150px] font-black text-red-500">G</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md mb-4 relative">
          Our Blogs: Creative Stories <br className="hidden md:block"/> & Design Inspiration
        </h1>
        <p className="text-white font-medium text-sm md:text-base drop-shadow-md max-w-2xl mx-auto">
          Explore How Color, Imagination, And Storytelling Shape Every Project We Create. 
          Discover Ideas, Case Studies, And Behind-The-Scenes Moments From The Kids Design Company Team.
        </p>
    </div>
  </div>
);

const MainArticle = () => (
  <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
    {/* Header Block */}
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-12">
        <div className="w-full md:w-1/2">
            <img 
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" 
                alt="Consultant" 
                className="rounded-2xl shadow-lg w-full h-64 md:h-72 object-cover"
            />
        </div>
        <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Bringing Creativity and Colour to Life.
            </h2>
            <div className="text-gray-500 text-sm md:text-base font-medium">
                Posted &nbsp;•&nbsp; April 30, 2025
            </div>
        </div>
    </div>

    {/* Content Block */}
    <div className="prose max-w-none text-gray-600 leading-relaxed text-sm md:text-base">
        <p className="mb-6">
            A behind-the-scenes look at how we transformed Springdale School's classrooms into vibrant, functional spaces for learning.
        </p>
        <p className="mb-6">
            When we first walked into Springdale Primary School, the classrooms looked like most we'd seen, plain white walls, dull desks, and fluorescent lighting. The teachers were passionate, the children were curious, but the space itself wasn't helping either of them thrive.
            That's when the school reached out to us at Kids Design Company to help reimagine their learning spaces. Their request was simple but powerful:
            <br/>
            <span className="italic font-medium text-gray-800">“We want a classroom that makes learning feel exciting again.”</span>
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Designing for Emotion, Not Just Aesthetics</h3>
        
        <p className="mb-4">
            We believe that children's spaces should feel as alive as they are — warm, imaginative, and safe. So we built the entire project around the idea of color psychology, using colors to influence mood, focus, and creativity.
        </p>
        <p className="mb-4">Each classroom became its own mood zone inspired by the rainbow:</p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
            <li><span className="font-medium text-gray-800">Red Room</span> – energy and confidence</li>
            <li><span className="font-medium text-gray-800">Yellow Room</span> – curiosity and creativity</li>
            <li><span className="font-medium text-gray-800">Green Room</span> – calm and connection</li>
            <li><span className="font-medium text-gray-800">Blue Room</span> – focus and trust</li>
        </ul>
        <p>
            We carefully selected materials that were non-toxic, easy to clean, and child-safe. Every corner, from the reading nooks to the art shelves, was designed to encourage movement, play, and collaboration.
        </p>
    </div>
  </section>
);

interface BlogCardProps {
    image: string;
    tag: string;
    date: string;
    title: string;
    excerpt: string;
}

const BlogCard = ({ image, tag, date, title, excerpt }: BlogCardProps) => (
    <div className="flex flex-col">
        <div className="relative h-48 rounded-xl overflow-hidden mb-4">
            <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex justify-between items-center text-xs mb-3">
            <span className="bg-[#007CA6] text-white px-3 py-1 rounded-full">{tag}</span>
            <span className="text-gray-500">{date}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
    </div>
);

const SimilarBlogs = () => {
    const blogs = [
        {
            image: "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=1000&auto=format&fit=crop",
            tag: "Education and Schools",
            date: "April 11, 2025",
            title: "Designing for Curious Minds",
            excerpt: "Actionable insights on how businesses can use technology to grow, scale, and stay competitive."
        },
        {
            image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000&auto=format&fit=crop",
            tag: "Hospitals and ChildCare",
            date: "April 11, 2025",
            title: "Playful Environments in Hospitals",
            excerpt: "Actionable insights on how businesses can use technology to grow, scale, and stay competitive."
        },
        {
            image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=1000&auto=format&fit=crop",
            tag: "Museums, Events & Nonprofits",
            date: "April 11, 2025",
            title: "How to Build a Future-Proof Digital Strategy",
            excerpt: "Actionable insights on how businesses can use technology to grow, scale, and stay competitive."
        }
    ];

    return (
        <section className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
            <div className="mb-8">
                 <h2 className="text-3xl font-bold text-gray-800">Similar Blogs</h2>
            </div>
            
            <div className="relative">
                {/* Navigation Arrows (Desktop) */}
                <button className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center border border-gray-100 text-[#007CA6] hover:bg-gray-50 z-10">
                    <ChevronLeft size={24}/>
                </button>
                <button className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center border border-gray-100 text-[#007CA6] hover:bg-gray-50 z-10">
                    <ChevronRight size={24}/>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <BlogCard key={index} {...blog} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => (
    <section className="bg-[#F9FAFB] py-16 md:py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Let's Help you Design a World Kids Would Love
            </h2>
            <p className="text-gray-600 mb-8 text-sm md:text-base">
                From Cozy Corners To Creative Classrooms—Start Your Custom Journey Today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-[#007CA6] hover:bg-[#00688d] text-white px-8 py-3 rounded-md font-semibold text-sm transition-colors shadow-sm">
                    Start Shopping Now
                </button>
                <button className="bg-[#FDB043] hover:bg-[#e59b32] text-gray-900 px-8 py-3 rounded-md font-semibold text-sm transition-colors shadow-sm">
                    Book Consultation
                </button>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function Blogs() {
  return (
    <div className="font-sans min-h-screen bg-white">
      <HeroSection />
      <MainArticle />
      <SimilarBlogs />
      <CTASection />
    </div>
  );
}