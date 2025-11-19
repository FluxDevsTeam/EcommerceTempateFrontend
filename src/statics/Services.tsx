import React, { useState, useEffect } from "react";
import firstServiceBaby from "../assets/firstServiceBaby.png";
import serviceHeroImage from "../assets/serviceHeroImage.png";
// import Header from "./Header";

import service1Pic from "../assets/service1Pic.png";
import service2Pic from "../assets/service2Pic.png";
import service3Pic from "../assets/service3Pic.png";
import service4Pic from "../assets/service4Pic.png";
import service5Pic from "../assets/service5Pic.png";
import service6Pic from "../assets/service6Pic.png";

import whyChooseUs from "../assets/whyChooseUs.png";

import pastProjectImg from "../assets/pastProjectImg.png";

const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const Services = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const services = [
    {
      image: service1Pic,
      title: "Kids Interior Design",
      description:
        "We design bedrooms, nurseries, playrooms, and study areas that are safe, engaging, and built around your child's personality.",
    },
    {
      image: service2Pic,
      title: "Custom Kids Furniture",
      description:
        "We design and fabricate furniture that's safe, durable, and age-appropriate — from study desks and toy storage to themed beds and reading nooks.",
    },
    {
      image: service3Pic,
      title: "Learning Space Design",
      description:
        "We create learning environments that encourage creativity, focus, and collaboration — from classrooms to libraries, daycares, and activity zones.",
    },
    {
      image: service4Pic,
      title: "Play & Experience Zones",
      description:
        "From indoor play centers to museum corners and brand activations, we design interactive spaces where children can explore, touch, and imagine freely.",
    },
    {
      image: service5Pic,
      title: "Wall Art & Decor Styling",
      description:
        "We create playful wall illustrations, name signage, decals, and color accents that complete the look and feel of your child's world.",
    },
    {
      image: service6Pic,
      title: "Consultation & Space Planning",
      description:
        "Book a session with our design team to review your space, layout ideas, or renovation goals — we'll help you visualize and plan every detail.",
    },
  ];

  const whyChooseUsItems = [
    {
      title: "Child-safe materials & finishes",
      description:
        "We use non-toxic paints, smooth edges, and durable finishes to keep every child's space safe and worry-free.",
    },
    {
      title: "Custom-built furniture that grows with your child",
      description:
        "Our designs evolve with your child's needs — adjustable, modular, and made to last through every stage.",
    },
    {
      title: "Designed by child-focused interior specialists",
      description:
        "Every layout, color choice, and texture is thoughtfully planned by experts who understand how kids play, learn, and explore.",
    },
  ];

  return (
    <div className="bg-white font-sans">
      {/* <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} /> */}

      {/* Hero Section */}
      <section className="relative bg-gray-200">
        <img
          src={serviceHeroImage}
          alt="Playroom with colorful shapes"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Bringing Creativity
              <br />
              And Colour To Life.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg">
              From Classrooms And Hospitals To Kid-Focused Brands, Our Designs
              Build Worlds Where Children Can Learn, Grow, And Play Freely.
            </p>
          </div>
        </div>
      </section>

      {/* Furnish with Fun Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src={firstServiceBaby}
              alt="Child playing with a whale toy on a bed"
              className="rounded-2xl"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-800 leading-tight">
              Furnish with Fun, Discover What Your Little Ones Love!
            </h2>
            <p className="mt-4 text-gray-600">
              We Design With Purpose, Emotion, And Imagination — Creating Spaces
              And Brands That Speak To Children's Hearts And Inspire The Adults
              Who Guide Them.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <a
                href="#"
                className="bg-[#0080A0] text-white font-bold py-3 px-3 rounded-lg text-sm"
              >
                Shop Now
              </a>
              <a
                href="#"
                className="bg-[#F9A826] text-white font-bold py-3 px-3 rounded-lg text-sm"
              >
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="bg-[#F9FAFB] py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800">Our Services</h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-600">
            We Design With Purpose, Emotion, And Imagination — Creating Spaces
            And Brands That Speak To Children's Hearts And Inspire The Adults
            Who Guide Them.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm text-left"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#F9A826]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 flex items-center gap-3">
            <span className="text-[#F9A826]">✨</span> Why Choose Us
          </h2>
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 space-y-8">
              {whyChooseUsItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-800 transform -rotate-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
              <div className="pt-8 flex gap-4">
                <a
                  href="#"
                  className="bg-[#0080A0] text-white font-bold py-3 px-4 rounded-lg text-sm"
                >
                  Shop Now
                </a>
                <a
                  href="#"
                  className="bg-[#F9A826] text-white font-bold py-3 px-4 rounded-lg text-sm"
                >
                  Book Consultation
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex items-center justify-center">
              <div className="bg-gradient-to-br from-teal-100 to-orange-100 p-4 rounded-3xl transform -rotate-3">
                <div className="bg-gradient-to-br from-teal-200 to-orange-200 p-2 rounded-2xl">
                  <img
                    src={whyChooseUs}
                    alt="Stylized living room"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Past Projects Section */}
      <section className="bg-[#F9FAFB] py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            Our Past Projects
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-600">
            Over The Years, We've Collaborated With Schools, Hospitals, And
            Creative Brands To Bring Imagination Into Their Environments.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="bg-[#0080A0] text-white font-bold py-3 px-8 rounded-lg text-sm inline-block"
            >
              View More Project
            </a>
          </div>
          <div className="mt-12 relative">
            <div className="flex justify-center items-center">
              <button className="absolute left-0 md:left-20 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10">
                <ChevronLeft />
              </button>
              <div className="w-full max-w-2xl mx-auto overflow-hidden">
                <div className="relative">
                  <img
                    src={pastProjectImg}
                    alt="Rainbow Classrooms Project"
                    className="rounded-2xl w-full"
                  />
                  <div className="absolute top-4 left-4 bg-white text-gray-800 text-sm font-semibold px-4 py-1 rounded-full">
                    Education
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5">
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl text-center">
                      <p className="text-[#F9A826] font-bold">
                        Rainbow Classrooms Project –
                      </p>
                      <p className="text-gray-700 font-semibold">
                        Springdale School
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="absolute right-0 md:right-20 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10">
                <ChevronRight />
              </button>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              <span className="w-3 h-3 bg-[#F9A826] rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
