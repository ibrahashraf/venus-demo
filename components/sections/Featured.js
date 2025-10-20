import Link from 'next/link';
import { useEffect, useState } from 'react';


export default function Featured() {
const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <section
        className={`relative overflow-hidden flex flex-col items-center justify-center text-center text-primary bg-neutral-200 transision 
          ${isScrolled ? ' h-[calc(100vh-73px)] md:h-[calc(100vh-80px)]' : ' h-screen '}
          `}
      >
          
        <div className="relative z-[49] w-full overflow-hidden flex flex-col items-center  px-6 space-y-24">
          <div className='flex justify-between max-md:flex-col gap-6 md:gap-32 items-end'>
            <h1  
              className="animate-slideDown leading-normal text-[60px] sm:text-[72px] md:text-[84px] lg:text-[100px] md:text[96px] font-bold text-right text-primary"
              >أفضل جودة  <br />بأفضل سعر</h1>
            <Link
              href={'/Products'}
              className="animate-slideRight bg-neutral-200 text-2xl md:text-3xl rounded-es-md rounded-se-md inline-block  px-8 py-5 text-accent rounded-sm  transition border-2 border-accent  hover:bg-accent hover:text-neutral-50  "
            >
              تسوق الان
            </Link>
          </div>
          <p className="animate-slideRight text-sm sm:text-md md:text-lg lg:text-2xl w-screen bg-black text-white  py-3">ملابس حريمي، أطفال، ورجالي بتصاميم عصرية، جودة عالية، وأسعار تنافسية — لأن الأناقة تبدأ من الاختيار الذكي.</p>
        </div>

      </section>
      <div className={`animate-slideDown  bg-accent w-24 sm:w-32 md:w-40 h-[100vh] absolute top-0 z-[48] transition right-[20%]`} />
      <div className=' flex flex-col items-center justify-center text-secondary font-extralight text-center absolute top-11 max-sm:-top-10 right-0 overflow-hidden w-[98vw] h-[100vh]'>
        <div className='flex items-center leading-none -ml-[100px] sm:-ml-[100px] md:-ml-[200px] lg:-ml-[300px] '>
          <p className='font-sans tracking-widest text-[90px] sm:text-[180px] md:text-[200px]  lg:text-[300px]'>ENUS</p>
          <svg
            className={`transition  sm:mt-10 h-[70px] w-[150px] sm:h-[150px] sm:w-[300px] md:h-[180px] md:w-[360px] lg:h-[215px] lg:w-[480px] `}
            viewBox="0 0 100 1000"
            fill="none"
          >
            <g>
              <path
                className={`transition fill-secondary`}
                d="m 697.61101,27.11885 -22.59794,0.0864 c 4.59031,31.913398 -1.7116,31.256239 -1.7116,31.256239 -55.43673,14.472302 -66.38303,28.2024 -66.38303,27.83134 0,-0.371109 -0.353,0.370924 -0.353,0.370924 L 498.50923,185.27529 388.10076,87.217641 c 0,0 -0.35317,-0.74264 -0.35312,-0.37158 2e-4,0.371099 -10.94781,-13.356784 -66.38704,-27.819579 0,0 -6.46482,0.08786 -1.87953,-31.826308 l -22.43531,0.03177 c 0,0 -6.75576,46.271945 -10.6287,119.747256 0,0 3.54158,68.65009 22.96975,118.00099 l 33.90872,70.12959 c 0,0 24.01767,45.26814 26.84976,91.65311 0,0 15.54462,50.46578 -23.9889,139.53273 l -33.5428,12.9932 185.73587,388.75236 0.51588,1.07966 v 0 0 l 0.52256,-1.11363 182.74135,-389.2846 -33.5451,-12.98751 c -39.54704,-89.06047 -24.01037,-139.52836 -24.01037,-139.52836 2.82495,-46.38572 26.83541,-91.65825 26.83541,-91.65825 l 33.89779,-70.13552 c 19.42049,-49.35406 22.9516,-118.00405 22.9516,-118.00405 C 704.37475,72.933771 697.61101,27.118849 697.61101,27.11885 Z" 
              />
              <path
                className={`transition stroke-secondary`}
                strokeWidth="60"
                d="M 21.322189,13.147509 978.60091,13.101063 498.86534,970.63708 Z"
              />
            </g>
          </svg>
        </div>
        <p className=' font-sans tracking-widest text-[90px] sm:text-[180px] md:text-[200px]  lg:text-[300px]'>OUTLET</p>
      </div>
    </>
  );
}
