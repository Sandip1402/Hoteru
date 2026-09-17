import { useRef } from "react";
import { register } from "swiper/element/bundle";
import { Slide } from "./Slide.jsx";

register();

export const SliderBG = ({ items }) => {
  const swiperElRef = useRef(null);

  return (
    <swiper-container
      ref={swiperElRef}
      slides-per-view="1"
      pagination="true"
      speed="600"
      loop="true"
      autoplay-delay="4000"
      autoplay-disable-on-interaction="false"
      class="landing-slider"
    >
      {items.map((item, index) => (
        <swiper-slide key={index}>
          <Slide item={item} />
        </swiper-slide>
      ))}
    </swiper-container>
  );
};