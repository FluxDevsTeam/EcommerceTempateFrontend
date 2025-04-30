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
    { id: `${item.id}-1`, src: item.image1, alt: item.name ,name: item.name,},
    { id: `${item.id}-2`, src: item.image2, alt: item.name , name: item.name },
    { id: `${item.id}-3`, src: item.image3, alt: item.name , name: item.name },
  ]);

  return (
    <div className="carousel-wrapper m-6">
      <Slider {...settings}>
        {allImages.map((image) => (
         <div key={image.id} className="slide-item relative">
         {/* Image container with relative positioning */}
         <div className="relative w-full h-auto max-h-[400px]">
           <img
             src={image.src}
             alt={image.alt}
             className="w-full h-full object-cover rounded-xl"
           />
           
           {/* Text overlay */}
           <div className="w-[45%] absolute bottom-10 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl">
             <h3 className="text-white uppercase text-3xl md:text-5xl font-medium">{image.name}</h3>
             {/* You can add more text elements here */}
           </div>
         </div>
       </div>
          
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
