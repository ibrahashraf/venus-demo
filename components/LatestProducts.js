import ProductBox from "./ProductBox";
import 'animate.css'; // Import animate.css

export default function LatestProducts({ latestProducts }) {
  return (
    <div id="latest-products" className="bg-gradient-to-r from-red-600 via-black to-red-800 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-red-400 mb-12 animate__animated animate__fadeIn">
          احدث المنتجات
        </h1>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {latestProducts.map(product => (
            <div
              key={product._id}
              className="bg-transparent p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate__animated animate__fadeIn animate__delay-1s"
            >
              <ProductBox {...product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
