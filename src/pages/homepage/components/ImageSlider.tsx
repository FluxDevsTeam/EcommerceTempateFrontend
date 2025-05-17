import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductItem } from "../types/data-types";
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

interface ImageSliderProps {
  data: ProductItem[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ data }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    waitForAnimate: true,
    cssEase: "linear",
  };

  // Flatten all image1, image2, image3 into a single list
  const allImages = data.flatMap((item) => [
    { id: `${item.id}-1`, src: item.image1, alt: item.name, name: item.name },
  ]);

  const handleClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="carousel-wrapper m-6">
      <Slider {...settings}>
        {allImages.map((image) => (
          <div key={image.id} className="slide-item relative">
            {isMobile ? (
              <div 
                className="relative w-full aspect-[4/3] flex justify-center cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => handleClick(image.id.split('-')[0])}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="w-full absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl">
                  <h3 className="text-white uppercase text-2xl font-medium line-clamp-2">
                    {image.name}
                  </h3>
                </div>
              </div>
            ) : (
              <div 
                className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleClick(image.id.split('-')[0])}
              >
                <div className="relative w-full max-w-6xl px-8 py-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="w-full md:w-1/2">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full max-h-[400px] object-contain filter drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="w-full md:w-1/2 text-center md:text-left">
                      <h3 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                        {image.name}
                      </h3>
                      <div className="h-1 w-20 bg-blue-500 mx-auto md:mx-0 mb-6"></div>
                      <p className="text-gray-600 text-lg">
                        Discover our exclusive collection
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
