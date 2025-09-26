import { useKeenSlider } from "keen-slider/react"
import { useEffect } from "react"
import Image from "next/image"
import { Close, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"

export default function CarouselModal({ images, alt, initialIndex = 0, onClose }) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: initialIndex,
    slides: { perView: 1, spacing: 0 },
  })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handlePrev = () => instanceRef.current?.prev()
  const handleNext = () => instanceRef.current?.next()

  return (
    <div
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
        onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
        }}
    >
        {/* Close Button */}
        <div className="absolute top-4 right-4 text-white z-50">
            <button onClick={onClose}>
            <Close fontSize="large" />
            </button>
        </div>
        <div className="relative w-[90%] sm:w-[500px] rounded-sm overflow-hidden">
            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                className="absolute -left-3 sm:left-0 top-1/2 -translate-y-1/2 text-white z-50 hover:text-gray-300"
            >
                <KeyboardArrowLeft fontSize="large" />
            </button>

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                className="absolute -right-3 sm:right-0 top-1/2 -translate-y-1/2 text-white z-50 hover:text-gray-300"
            >
                <KeyboardArrowRight fontSize="large" />
            </button>

            {/* Image Carousel */}
            <div
                ref={sliderRef}
                className="keen-slider "
            >
                {images.map((src, idx) => (
                <div
                    key={idx}
                    className="keen-slider__slide flex justify-center items-center overflow-hidden"
                >
                    <Image
                        src={src}
                        alt={alt}
                        width={300}
                        height={400}
                        className="object-contain w-[300px] h-[400px] sm:w-[450px] sm:h-[600px]"
                    />
                </div>
                ))}
            </div>
        </div>
    </div>
  )
}
