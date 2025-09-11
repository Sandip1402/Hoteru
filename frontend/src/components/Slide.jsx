import Slider from "react-slick";
import { Card } from "./Card";

function PrevArrow({ className, style, onClick }){
  return(
    <div
      className={className}
      style={{ ...style, display: "block", background: "red", color: "brown"}}
      onClick={onClick}
    />
  )
}


function NextArrow({ className, style, onClick }) {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green", color: "brown" }}
      onClick={onClick}
    />
  );
}


export const Slide = ({ items }) => {


  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: false
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
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {items.map((item) =>
          <div key={item._id}>
            <Card item={item} />
          </div>
        )}
      </Slider>
    </div>
  )
}
