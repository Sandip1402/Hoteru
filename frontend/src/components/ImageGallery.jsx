import { useEffect, useState, useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaImages,
} from "react-icons/fa";

const FALLBACK_IMAGE = "/images/room-placeholder.jpg";

export const ImageGallery = ({ images = [], title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartX = useRef(null);

  const galleryImages =
    images?.length > 0
      ? images.map((image) => image.imageUrl)
      : [FALLBACK_IMAGE];

  const totalImages = galleryImages.length;

  const openGallery = (index = 0) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const showPrevious = (event) => {
    event?.stopPropagation();

    setActiveIndex((current) =>
      current === 0 ? totalImages - 1 : current - 1
    );
  };

  const showNext = (event) => {
    event?.stopPropagation();

    setActiveIndex((current) =>
      current === totalImages - 1 ? 0 : current + 1
    );
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;

    if (Math.abs(distance) < 50) {
      touchStartX.current = null;
      return;
    }

    if (distance > 0) {
      showNext();
    } else {
      showPrevious();
    }

    touchStartX.current = null;
  };

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, totalImages]);

  return (
    <>
      {/* =========================
          Gallery Preview
      ========================== */}
      <div className="relative">
        {/* Mobile */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => openGallery(0)}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl"
          >
            <img
              src={galleryImages[0]}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden h-[440px] gap-2 overflow-hidden rounded-xl md:grid md:grid-cols-2">
          {/* Main image */}
          <button
            type="button"
            onClick={() => openGallery(0)}
            className="group relative min-h-0 overflow-hidden"
          >
            <img
              src={galleryImages[0]}
              alt={`${title} - 1`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>

          {/* Secondary images */}
          <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-2">
            {[1, 2, 3, 4].map((index) => {
              const image = galleryImages[index];

              if (!image) {
                return <div key={index} className="bg-gray-100" />;
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => openGallery(index)}
                  className="group relative min-h-0 overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${title} - ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* View all photos */}
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="
            absolute bottom-4 right-4
            flex items-center gap-2
            rounded-lg bg-white px-4 py-2.5
            text-sm font-semibold text-text
            shadow-md transition
            hover:bg-gray-50
          "
        >
          <FaImages className="text-sm" />
          <span>View all photos</span>
          <span className="text-text-muted">({totalImages})</span>
        </button>
      </div>

      {/* =========================
          Gallery Modal
      ========================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="
            fixed inset-0 z-[100]
            flex flex-col
            bg-black/80
          "
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeGallery();
            }
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <p className="text-sm font-medium text-white">
              {activeIndex + 1} / {totalImages}
            </p>

            <button
              type="button"
              onClick={closeGallery}
              aria-label="Close gallery"
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full bg-white/10
                text-white transition
                hover:bg-white/20
              "
            >
              <FaTimes />
            </button>
          </div>

          {/* Main image */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: "pan-y" }}
          >
            {/* Previous */}
            {totalImages > 1 && (
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous image"
                className="
                  absolute left-3 z-10
                  flex h-10 w-10 items-center justify-center
                  rounded-full bg-white/10
                  text-white transition
                  hover:bg-white/20
                  sm:left-6 sm:h-12 sm:w-12
                "
              >
                <FaChevronLeft />
              </button>
            )}

            <img
              src={galleryImages[activeIndex]}
              alt={`${title} - ${activeIndex + 1}`}
              className="
                max-h-full max-w-full
                rounded-lg object-contain
              "
            />

            {/* Next */}
            {totalImages > 1 && (
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="
                  absolute right-3 z-10
                  flex h-10 w-10 items-center justify-center
                  rounded-full bg-white/10
                  text-white transition
                  hover:bg-white/20
                  sm:right-6 sm:h-12 sm:w-12
                "
              >
                <FaChevronRight />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {totalImages > 1 && (
            <div className="px-4 pb-5 pt-4 sm:px-6">
              <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1">
                {galleryImages.map((image, index) => (
                  <button
                    key={image + index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`
                      h-16 w-20 shrink-0 overflow-hidden rounded-md
                      transition sm:h-20 sm:w-24
                      ${activeIndex === index
                        ? "ring-2 ring-white"
                        : "opacity-60 hover:opacity-100"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};