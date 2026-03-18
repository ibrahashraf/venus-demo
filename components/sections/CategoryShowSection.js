import Link from "next/link";
import { useEffect, useState } from "react";
import ErrorBoundary from "../ErrorBoundary";
import ProductsSlider from "../ProductsSlider";
import Button from "../ui/Button";
import axiosClient from "@/lib/axiosClient";


export default function CategoryShowSection() {
    const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosClient.get(`/api/home`);
                setCategoriesWithProducts(data.categoriesWithProducts || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
      return (
        <div id="latest-products" className="relative h-[calc(100vh-73px)] md:h-[calc(100vh-80px)] bg-neutral-200 flex flex-col items-center justify-center"> 
          <div className="relative bg-neutral-200 h-[calc(100vh-73px)] md:h-[calc(100vh-80px)] flex flex-col items-center justify-center">
                <div className="container mx-auto text-center z-10 relative h-full flex justify-center flex-col items-center max-w-screen">
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
          <div className="bg-white z-[9] w-24 sm:w-32 md:w-40 absolute top-0 left-[20%] sm:right-[20%] h-full " />
        </div>
      );
    }


  return (
    <>
      {categoriesWithProducts.map(({ category, products }) => (
        <div id="latest-products" className="relative h-[calc(100vh-73px)] md:h-[calc(100vh-80px)] bg-neutral-200 flex flex-col items-center justify-center"> 
          <div className="container mx-auto text-center z-10  relative h-full flex justify-center flex-col items-center max-w-screen ">
            <h1 className="text-4xl font-bold text-primary">
              {category.name}
            </h1>
            <div className="w-[90%]">
              <ErrorBoundary>
                <ProductsSlider products={products} />
              </ErrorBoundary>
            </div>
            <div>
              <Link href={`/Products?category=${category._id}`}>
                <Button variant="secondary" className=" text-xl py-2 px-6 bg-transparent">
                  Shop now
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white z-[9] w-24 sm:w-32 md:w-40 absolute top-0 left-[20%] sm:right-[20%] h-full " />
        </div>
        ))}
      </>
  )
}

