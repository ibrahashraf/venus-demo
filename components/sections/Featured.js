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
        className={`relative overflow-hidden flex flex-col items-center justify-center text-center text-primary bg-neutral-200 transition h-[calc(100vh-73px)] md:h-[calc(100vh-80px)]
          `}
      >
          
        <div className="relative z-[49] w-full overflow-hidden flex flex-col items-center  px-6 space-y-24">
          <div className='flex justify-between max-md:flex-col gap-10 md:gap-32 items-end'>
            <h1  
              className="animate-slideDown leading-normal text-[60px] sm:text-[72px] md:text-[84px] lg:text-[100px] md:text[96px] font-bold text-left text-primary"
              >Venus Outlet <br />Live Demo</h1>
            <Link
              href={'/Products'}
              className="animate-slideRight bg-neutral-200/60  text-[27px] md:text-3xl md:mb-6 rounded-es-xl rounded-se-xl inline-block  px-8 py-5 text-accent rounded-sm  transition border-2 border-accent  hover:bg-accent hover:text-neutral-50  "
            >
              Shop now
            </Link>
          </div>
          <p className="animate-slideRight text-sm leading-relaxed max-sm:px-4 font-semibold  sm:text-md md:text-lg lg:text-2xl w-screen  bg-primary text-secondary   py-3">
            Explore our demo e-commerce site showcasing modern clothing collections for women, children, and men.
          </p>
        </div>

      </section>
      <div className={`  bg-white w-24 sm:w-32 md:w-40 h-full absolute top-0 z-[48] transition left-[20%] sm:right-[20%]`} />
      <div className=' flex flex-col items-center justify-center text-secondary font-extralight text-center absolute top-11 max-sm:-top-10 right-0 overflow-hidden w-[98vw] h-[100vh]'>
      </div>
    </>
  );
}
