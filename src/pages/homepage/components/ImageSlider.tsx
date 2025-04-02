import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function ImageSlider() {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 1000, // Slower transition for better fade effect
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // 3 seconds between slides
    waitForAnimate: true,
    cssEase: 'linear' // Smoother fade transition
  };

  return (
    <div className="carousel-wrapper m-6">
      <Slider {...settings}>
        <div className="slide-item">
          <img src='https://picsum.photos/400/300' alt="Slide 1" />
        </div>
        <div className="slide-item">
          <img src='https://picsum.photos/200/400' alt="Slide 2" />
        </div>
        <div className="slide-item">
          <img src='https://picsum.photos/340/230' alt="Slide 3" />
        </div>
      </Slider>
    </div>
  );
}

export default ImageSlider;