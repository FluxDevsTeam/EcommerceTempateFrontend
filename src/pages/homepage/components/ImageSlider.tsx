import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "@/types/api-types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface ImageSliderProps {
  data: Product[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ data }) => {
  const navigate = useNavigate();
  const pauseTimer = useRef<NodeJS.Timeout>();
  const sliderRef = useRef<Slider>(null);
  const [imageWidth, setImageWidth] = useState(
    window.innerWidth >= 768 ? "55%" : "90%"
  );

  useEffect(() => {
    const handleResize = () => {
      setImageWidth(window.innerWidth >= 768 ? "55%" : "90%");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CustomArrow = ({ className, style, onClick, direction }: { className?: string; style?: React.CSSProperties; onClick?: () => void; direction: 'left' | 'right'; }) => (
    <button
      className={`z-40 absolute top-1/2 transform -translate-y-1/2 ${direction === 'left' ? 'left-[-20px] md:left-[-20px]' : 'right-[-10px] md:right-[-10px]'} bg-transparent hover:bg-transparent focus:bg-transparent rounded-full flex items-center justify-center transition-all duration-200 group`}
      style={{ ...style, width: 52, height: 52 }}
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous Slide' : 'Next Slide'}
    >
      {direction === 'left' ? (
        <svg width="64" height="64" fill="none" viewBox="0 0 64 64" stroke="currentColor" className="w-16 h-16 text-gray-800 transition-all duration-200">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeOpacity="0.08" strokeWidth="4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M38 48L22 32l16-16" />
        </svg>
      ) : (
        <svg width="64" height="64" fill="none" viewBox="0 0 64 64" stroke="currentColor" className="w-16 h-16 text-gray-800 transition-all duration-200">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeOpacity="0.08" strokeWidth="4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M26 16l16 16-16 16" />
        </svg>
      )}
    </button>
  );

  const settings = {
    dots: false,
    fade: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    beforeChange: () => {
      if (pauseTimer.current) {
        clearTimeout(pauseTimer.current);
      }
      sliderRef.current?.slickPause();
      
      pauseTimer.current = setTimeout(() => {
        sliderRef.current?.slickPlay();
      }, 4000);
    },
    waitForAnimate: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth easing
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10, // More sensitive touch response
    arrows: window.innerWidth >= 768,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

  // Flatten all images into a single list
  const allImages = data.flatMap((item) => [
    { id: `${item.id}-1`, src: item.image1, alt: item.name, name: item.name },
  ]);

  const handleClick = (id: string) => {
    navigate(`/product/item/${id}`);
  };

  return (
    <div className="carousel-wrapper mx-auto my-6 md:px-4">
      <Slider ref={sliderRef} {...settings}>
        {allImages.map((image) => (
          <div key={image.id} className="slide-item relative md:px-2">
            <div 
              className="relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-50"
              onClick={() => handleClick(image.id.split("-")[0])}
            >
              <div className="flex flex-col md:flex-row items-center min-h-[300px] md:min-h-[400px]">
                {/* Mobile layout with background image */}
                <div className="md:hidden w-full aspect-square relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image.src})` }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-[7%] bg-gradient-to-b from-black/5 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-black/50 to-black/1" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold line-clamp-2 text-center capitalize">
                      {image.name.toUpperCase()}
                    </h3>
                  </div>
                </div>
                {/* Desktop text content */}
                <div className="hidden md:flex flex-col justify-center space-y-6 p-8 md:w-1/2 order-2 md:order-1">
                  <h3 className="line-clamp-3 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight pb-0 mb-0 capitalize">
                    {image.name.toUpperCase()}
                  </h3>
                  <div className="h-1 w-44 mt-0 pt-0 bg-gray-600"></div>
                  <p className="text-gray-600 text-lg lg:text-xl">
                    Discover our exclusive collection
                  </p>
                  <button
                    className="bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-700 transition-colors w-fit"
                    onClick={() => handleClick(image.id.split("-")[0])}
                  >
                    Shop Now
                  </button>
                </div>
                {/* Desktop image */}
                <div className="hidden md:flex items-center justify-center p-4 md:w-1/2 order-1 md:order-2">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-contain"
                    style={{ width: '300px', height: '300px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;