import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductItem } from "../types/data-types";

interface ImageSliderProps {
  data: ProductItem[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ data }) => {
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

  return (
    <div className="carousel-wrapper m-6">
      <Slider {...settings}>
        {allImages.map((image) => (
          <div key={image.id} className="slide-item relative">
            <div className="flex flex-col items-center gap-6 p-4">
              {/* Square image container */}
              <div className="relative w-full h-[300px] md:h-[300px] rounded-xl flex items-center justify-center px-5">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="max-w-80 max-h-[90%] object-contain"
                />

                {/* Text below image */}
                <div className="w-full text-center px-4">
                  <h3 className="text-gray-900 text-2xl md:text-3xl font-medium">
                    {image.name}
                  </h3>
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
