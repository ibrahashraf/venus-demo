import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProductBox from "./ProductBox";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 

export default function ProductsSlider({ products }) {
  const sliderRef = useRef(null);
  const [sliderContainerRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1.2,
      spacing: 10,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2.2, spacing: 16 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3.2, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4.5, spacing: 24 },
      },
    },
  });

  return (
    <section className=" relative p-10 z-10 max-sm:mb-10">
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute  left-[20%] max-sm:-bottom-10 sm:left-6 sm:top-1/2 -translate-y-1/2  z-10 bg-white   rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronLeft fontSize="large"  />
        </button>
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute  right-[20%] max-sm:-bottom-10 sm:right-6 sm:top-1/2 -translate-y-1/2  z-10 bg-white  rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronRight fontSize="large"  />
        </button>
      <div className="relative">
        <div ref={sliderContainerRef} className="keen-slider">
          {products.map((product) => (
            <div key={product._id} className="keen-slider__slide">
              <ProductBox {...product} />
            </div>
          ))}
        </div>

        {/* Arrows */}
      </div>
    </section>
  );
}
