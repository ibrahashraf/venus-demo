import { useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import ProductsSlider from "./ProductsSlider";
import Link from "next/link";
import Button from "./ui/Button";
import axiosClient from "@/lib/axiosClient";


export default function LatestProducts() {

  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get(`/api/home`);
        setLatestProducts(data.latestProducts || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching latest products:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return (
    <div id="latest-products" className="relative h-[calc(100vh-73px)] md:h-[calc(100vh-80px)]  flex flex-col items-center justify-center"> 
      <div className="relative bg-neutral-200 h-[calc(100vh-73px)] md:h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="container mx-auto z-10 relative h-full flex justify-center flex-col items-center max-w-screen">
          <div className="skeleton h-10 w-1/3 mb-8 rounded"></div>
          <div className="w-full sm:w-[90%] mb-8">
            <div className="flex gap-4 overflow-hidden">
              <div className="skeleton h-64 w-1/4 rounded-lg flex-shrink-0"></div>
              <div className="skeleton h-64 w-1/4 rounded-lg flex-shrink-0"></div>
              <div className="skeleton h-64 w-1/4 rounded-lg flex-shrink-0"></div>
            </div>
          </div>
          <div className="skeleton h-12 w-32 rounded-full"></div>
        </div>
      </div>
      <div className="bg-accent z-[9] w-24 sm:w-32 md:w-40 absolute top-0 left-[20%] sm:right-[20%] h-full " />
      <div className="absolute w-full h-full overflow-hidden z-[8]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 560"
          preserveAspectRatio="none"
          className=" absolute top-0 left-0 w-full h-full hidden md:block"
        >
          <g mask="url(#SvgjsMask1000)" fill="none">
            <rect x="0" y="0" className="fill-neutral-200 w-full h-full"></rect>
            <path
              d="M 0,97 C 57.6,112.2 172.8,183 288,173 C 403.2,163 460.8,29.6 576,47 C 691.2,64.4 748.8,248 864,260 C 979.2,272 1036.8,125.4 1152,107 C 1267.2,88.6 1382.4,155.8 1440,168L1440 560L0 560z"
              className="fill-secondary"
            ></path>
            <path
              d="M 0,405 C 96,420.4 288,488.4 480,482 C 672,475.6 768,367 960,373 C 1152,379 1344,484.2 1440,512L1440 560L0 560z"
              className="fill-neutral-200"
            ></path>
          </g>
          <defs>
            <mask id="SvgjsMask1000">
              <rect width="1440" height="560" fill="#ffffff"></rect>
            </mask>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="none"
          viewBox="0 0 350 560"
          className="absolute top-0 left-0 w-full h-full block md:hidden"
        >
          <g mask="url(#SvgjsMask1025)" fill="none">
            <rect x="0" y="0" className="fill-neutral-200 w-full h-full"></rect>
            <path
              d="M 0,196 C 35,179.2 105,110.4 175,112 C 245,113.6 315,185.6 350,204L350 560L0 560z"
              className="fill-secondary" 
            ></path>
            <path
              d="M 0,512 C 35,470.8 105,320.8 175,306 C 245,291.2 315,411.6 350,438L350 560L0 560z"
              className="fill-neutral-200" 
            ></path>
          </g>
          <defs>
            <mask id="SvgjsMask1025">
              <rect width="350" height="560" fill="#ffffff"></rect>
            </mask>
          </defs>
        </svg>
      </div>
    </div>
  );
  }

  return (
    <div id="latest-products" className="relative h-[calc(100vh-73px)] md:h-[calc(100vh-80px)] bg-neutral-200  flex flex-col items-center justify-center"> 
      <div className="container mx-auto text-center z-10  relative h-full flex justify-center flex-col items-center max-w-screen ">
        <h1 className="text-4xl font-bold text-primary">
          Latest Products
        </h1>
        <div className="w-[90%]">
          <ErrorBoundary>
            <ProductsSlider products={latestProducts} />
          </ErrorBoundary>
        </div>
        <div>
          <Link href="/Products">
            <Button variant="secondary" className="text-xl py-2 px-6 bg-transparent">
              Shop now
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white z-[9] w-24 sm:w-32 md:w-40 absolute top-0 left-[20%] sm:right-[20%] h-full " />
    </div>
  );
}
