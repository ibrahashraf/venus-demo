import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProductBox from "./ProductBox";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsSlider({ products }) {
  const sliderRef = useRef(null);
  const [sliderContainerRef, instanceRef] = useKeenSlider({
    loop: false,
    slides: {
      perView: 1.5,
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
        slides: { perView: 4, spacing: 24 },
      },
    },
  });

  return (
    <section className=" relative p-10">
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronRight size={20} />
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
