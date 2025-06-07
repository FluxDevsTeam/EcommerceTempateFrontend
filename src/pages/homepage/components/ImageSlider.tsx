import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductItem } from "../types/data-types";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

interface ImageSliderProps {
  data: ProductItem[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ data }) => {
  const navigate = useNavigate();
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

  const settings = {
    dots: false,
    fade: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    waitForAnimate: true,
    cssEase: "ease-in-out",
    arrows: true,
  };

  // Flatten all images into a single list
  const allImages = data.flatMap((item) => [
    { id: `${item.id}-1`, src: item.image1, alt: item.name, name: item.name },
  ]);

  const handleClick = (id: string) => {
    navigate(`/product/item/${id}`);
  };

  return (
    <div className="carousel-wrapper mx-auto my-4 px-4 max-w-[1920px]">
      <Slider {...settings}>
        {allImages.map((image) => (
          <div key={image.id} className="slide-item relative px-2">
            <div 
              className="relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-50"
              onClick={() => handleClick(image.id.split("-")[0])}
            >
              <div className="flex flex-col md:flex-row items-center min-h-[300px] md:min-h-[400px]">
                {/* Mobile text overlay */}{" "}
                <div className="absolute bottom-5 left-0 h-1/3 right-0 md:hidden z-10 rounded-b-lg bg-gradient-to-b from-white/0 to-black/80">
                  <h3 className="text-xl leading-8 text-white line-clamp-2 text-center capitalize">
                    {image.name.toUpperCase()}
                  </h3>
                </div>
                {/* Desktop text content */}
                <div className="hidden md:flex flex-col justify-center space-y-6 p-8 md:w-1/2 order-2 md:order-1">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight line-clamp-3">
                    {image.name}
                  </h3>
                  <div className="h-1 w-24 bg-blue-600"></div>
                  <p className="text-gray-600 text-lg lg:text-xl">
                    Discover our exclusive collection
                  </p>
                  {/* <Link to="/new-arrivals"> */}
                  <button
                    className="bg-customBlue text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors w-fit"
                    onClick={() => handleClick(image.id.split("-")[0])}
                  >
                    Shop Now
                  </button>
                  {/* </Link> */}
                </div>
                <div className="flex items-center justify-center p-4 md:w-1/2 order-1 md:order-2">
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{ width: imageWidth }}
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
