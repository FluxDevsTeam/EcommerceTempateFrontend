import React, { useState, useEffect } from 'react';
import { IoLogoWhatsapp } from 'react-icons/io';

const WhatsAppFloat = () => {
  const [opacity, setOpacity] = useState(0.8); // Changed default opacity

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newOpacity = Math.max(0.6, 0.8 - scrollPosition / 1000); // Adjusted formula
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href="https://wa.me/message/IJCGAQKFVMKUB1 "
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-all duration-200 cursor-pointer whatsapp-float"
      style={{ opacity }}
      aria-label="Chat with us on WhatsApp"
    >
      <IoLogoWhatsapp size={28} className="text-white" />
      <style>{`
        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        
        .whatsapp-float {
          animation: floatAnimation 3s ease-in-out infinite;
        }
      `}</style>
    </a>
  );
};

export default WhatsAppFloat;
