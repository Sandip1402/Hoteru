import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

const FALLBACK_IMAGE = "/images/room-placeholder.jpg";

export const RoomImageSlider = ({
    images = [],
    roomName,
    link,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartX = useRef(null);

    const imageList = images?.length
        ? images
        : [{ imageUrl: FALLBACK_IMAGE }];

    const hasMultipleImages = imageList.length > 1;

    const nextImage = () => {
        setActiveIndex((current) =>
            (current + 1) % imageList.length
        );
    };

    const previousImage = () => {
        setActiveIndex((current) =>
            (current - 1 + imageList.length) % imageList.length
        );
    };

    // Auto slide
    useEffect(() => {
        if (!hasMultipleImages) return;

        const interval = setInterval(() => {
            nextImage();
        }, 3500);

        return () => clearInterval(interval);
    }, [imageList.length, hasMultipleImages]);

    // Reset index if image list changes
    useEffect(() => {
        setActiveIndex(0);
    }, [images]);

    // Touch swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null || !hasMultipleImages) return;

        const touchEndX = e.changedTouches[0].clientX;
        const difference = touchStartX.current - touchEndX;

        const SWIPE_THRESHOLD = 50;

        if (Math.abs(difference) >= SWIPE_THRESHOLD) {
            if (difference > 0) {
                nextImage();
            } else {
                previousImage();
            }
        }

        touchStartX.current = null;
    };

    return (
        <div
            className="group relative aspect-[4/3] w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: "pan-y" }}
        >
            <Link
                to={link}
                className="block h-full w-full"
            >
                <img
                    src={imageList[activeIndex]?.imageUrl || FALLBACK_IMAGE}
                    alt={
                        imageList[activeIndex]?.altText ||
                        roomName
                    }
                    className="h-full w-full object-cover transition-opacity duration-300"
                />
            </Link>

            {hasMultipleImages && (
                <>
                    {/* Previous */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            previousImage();
                        }}
                        aria-label="Previous image"
                        className="
                            absolute left-2 top-1/2 z-10
                            flex h-8 w-8 -translate-y-1/2
                            items-center justify-center
                            rounded-full bg-white/90
                            text-text shadow-md
                            transition
                            opacity-100 
                            sm:opacity-0 
                            sm:group-hover:opacity-100
                            hover:bg-white
                            sm:h-9 sm:w-9
                        "
                    >
                        <FaChevronLeft className="text-xs" />
                    </button>

                    {/* Next */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            nextImage();
                        }}
                        aria-label="Next image"
                        className="
                            absolute right-2 top-1/2 z-10
                            flex h-8 w-8 -translate-y-1/2
                            items-center justify-center
                            rounded-full bg-white/90
                            text-text shadow-md
                            transition
                            opacity-100 
                            sm:opacity-0 
                            sm:group-hover:opacity-100
                            hover:bg-white
                            sm:h-9 sm:w-9
                        "
                    >
                        <FaChevronRight className="text-xs" />
                    </button>

                    {/* Dots */}
                    <div
                        className="
                            absolute bottom-3 left-1/2
                            z-10 flex -translate-x-1/2
                            items-center gap-1.5
                        "
                    >
                        {imageList.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveIndex(index);
                                }}
                                aria-label={`Go to image ${index + 1}`}
                                className={`
                                    h-1.5 rounded-full
                                    transition-all duration-300
                                    ${index === activeIndex
                                        ? "w-3 bg-white"
                                        : "w-1.5 bg-white/70"
                                    }
                                `}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};