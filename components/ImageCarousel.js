import { useKeenSlider } from 'keen-slider/react'
import { useState } from 'react'
import Image from 'next/image'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import CarouselModal from './CarouselModal'
import 'keen-slider/keen-slider.min.css'

export default function ImageCarousel({ images = [], alt = '' }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 0 },
    slideChanged(slider) {
      setSelectedIndex(slider.track.details.rel)
    },
  })

  const scrollPrev = () => instanceRef.current?.prev()
  const scrollNext = () => instanceRef.current?.next()
  const scrollTo = (index) => instanceRef.current?.moveToIdx(index)

  return (
    <>
      <div className="relative w-[300px] sm:w-[450px] rounded-sm overflow-hidden">
        <div ref={sliderRef} className="keen-slider">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="keen-slider__slide flex justify-center items-center overflow-hidden"
              onClick={() => setIsModalOpen(true)}
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

        {/* Prev */}
        <button
          onClick={scrollPrev}
          className="absolute top-1/2 left-4 sm:left-6 -translate-y-1/2  z-10 text-white hover:text-black"
        >
          <KeyboardArrowLeft fontSize="large" />
        </button>

        {/* Next */}
        <button
          onClick={scrollNext}
          className="absolute top-1/2 right-4 sm:right-6 -translate-y-1/2  z-10 text-white hover:text-black"
        >
          <KeyboardArrowRight fontSize="large" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10" dir='ltr'>
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                idx === selectedIndex ? 'bg-black' : 'bg-white'
              }`}
            />
          ))}
        </div>
      </div>
      {/* Modal */}
      { isModalOpen && (
        <CarouselModal images={images} alt={alt} initialIndex={selectedIndex} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}
