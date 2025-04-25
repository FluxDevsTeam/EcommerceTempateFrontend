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
    cssEase: "linear"
  };

  // Flatten all image1, image2, image3 into a single list
  const allImages = data.flatMap((item) => [
    { id: `${item.id}-1`, src: item.image1, alt: item.name },
    { id: `${item.id}-2`, src: item.image2, alt: item.name },
    { id: `${item.id}-3`, src: item.image3, alt: item.name },
  ]);

  return (
    <div className="carousel-wrapper m-6">
      <Slider {...settings}>
        {allImages.map((image) => (
          <div key={image.id} className="slide-item">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto max-h-[400px] object-cover rounded-xl"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
