import { useRef, useEffect } from 'react';
import { register } from 'swiper/element/bundle';
import { Slide } from './Slide';

register();

// using swiper element instead of swiper react component as it is to be removed in future as per official
export const SliderBG = ({ items }) => {
    const swiperElRef = useRef(null);

    // useEffect(() => {
    //     // listen for Swiper events using addEventListener
    //     swiperElRef.current.addEventListener('swiperprogress', (e) => {
    //         const [swiper, progress] = e.detail;
    //         console.log(progress);
    //     });

    //     swiperElRef.current.addEventListener('swiperslidechange', (e) => {
    //         console.log('slide changed');
    //     });
    // }, []);

    return (
        <swiper-container
            ref={swiperElRef}
            slides-per-view="1"
            pagination="true"
            // pagination-el=".swiper-pagination"
            // pagination-clickable="true"
            // pagination-dynamicBullets="true"
            speed="800"
            loop="true"
            // autoplay="true"
            // autoplay-wait-for-transition="false"
            // autoplay-pause-on-mouse-enter="true"
            // loopAddBlankSlides="false"
        >
            {items.map((item) => {
                return <swiper-slide key={items.indexOf(item)}><Slide item={item} /></swiper-slide>
            })}
        </swiper-container>
    )
}

// const swiper = Swiper({
//   speed: 800,
//   loop: true,
//   loopAddBlankSlides: false,
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//     dynamicBullets: true
//   },
//   autoplay: {
//     waitForTransition: false,
//     pauseOnMouseEnter: true
//   }
// });