import Link from 'next/link';
import 'animate.css';
import backGround from '@/public/assets/background.jpg';

export default function Featured({ featuredProduct }) {
  return (
    <div className="relative bg-white text-black overflow-hidden">
      {/* White base + soft red/black accent */}
      <div className="h-screen max-w-screen-xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center relative z-10 text-center">
        
        <h1 className="text-7xl sm:text-8xl font-extrabold tracking-wider leading-tight mb-6 animate__animated animate__fadeIn animate__delay-1s animate__bounceInUp">
          <span className="block text-5xl sm:text-6xl text-black ">
            مرحباً في
          </span>
          <span className="mt-4 block text-transparent bg-gradient-to-r from-red-500 via-black to-red-600 bg-clip-text text-8xl sm:text-9xl leading-tight">
            Venus Outlet
          </span>
        </h1>

        <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-700 animate__animated animate__fadeIn animate__delay-2s animate__slideInUp">
          اكتشف أحدث صيحات الموضة بأفضل الأسعار. استمتع بتجربة تسوق لا مثيل لها مع تشكيلة من المنتجات التي لا يمكن مقاومتها.
        </p>

        <div className="flex flex-wrap justify-center gap-6 animate__animated animate__fadeIn animate__delay-3s">
          <a
            href="#latest-products"
            className="inline-block text-white bg-red-600 text-lg font-semibold py-4 px-12 rounded-full border-2 border-red-600 hover:bg-white hover:text-red-600 transition transform hover:scale-110 hover:shadow-xl hover:opacity-90 animate__pulse animate__infinite animate__delay-1s"
          >
            أحدث الإضافات
          </a>
          <Link
            href="/Products"
            className="inline-block bg-black text-white text-lg font-semibold py-4 px-12 rounded-full border-2 border-black hover:bg-white hover:text-black transition transform hover:scale-110 hover:shadow-xl hover:opacity-90 animate__pulse animate__infinite animate__delay-1s"
          >
            تسوق الآن
          </Link>
        </div>
      </div>

      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 bg-fixed"
        style={{ backgroundImage: `url(${backGround.src})` }}
        alt="Stylish background showcasing products"
      ></div>
    </div>
  );
}
