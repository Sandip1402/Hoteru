import Slider from "react-slick";
import { Card } from "./Card";


export const Slide = ({ items }) => {


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {items.map((item) =>
                    <div key={item._id} >
                        <Card item={item} />
                    </div>
                )}
            </Slider>
        </div>
    )
}
