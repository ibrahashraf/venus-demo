import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function TestimonialSlider({ testimonials }) {
  const sliderRef = useRef(null);
  const [sliderContainerRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 33,
    },
  });

  return (
    <section className="relative w-full py-16 px-6 max-sm:mb-10">
      {/* Navigation Buttons */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-[20%] max-sm:-bottom-10 sm:left-6 sm:top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-sm bg-primary/50 "
      >
        <ChevronLeft fontSize="large" />
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-[20%] max-sm:-bottom-10 sm:right-6 sm:top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-sm bg-primary/50 "
      >
        <ChevronRight fontSize="large" />
      </button>

      {/* Slider */}
      <div ref={sliderContainerRef} className="keen-slider">
        {testimonials.map((t) => (
          <div key={t._id} className="keen-slider__slide flex justify-center">
            <div className="bg-primary/50 shadow-lg rounded-sm p-10 max-w-3xl w-full text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    fontSize="large"
                    className={
                      idx < t.rating ? "text-yellow-500" : "text-neutral-50"
                    }
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-xl italic text-secondary mb-6 leading-relaxed">
                {t.comment}
              </p>

              {/* Name */}
              <h3 className="text-2xl font-bold text-primary">{t.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
