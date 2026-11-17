import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "@/lib/axiosClient";
import Image from "next/image";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/api/allcategories")
      .then((res) => {
        const allCategories = res.data;
        const filteredCategories = allCategories.filter((cat) => cat.showOnBanner === true);
        setCategories(filteredCategories);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-neutral-50 min-h-[calc(100vh-73px)] md:min-h-[calc(100vh-80px)] py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-[49]">

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="relative h-64 rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%] mx-auto">
            {categories.length > 0 && categories.map((category) => (
              <div
                key={category._id}
                onClick={() => router.push(`/Products?category=${category._id}`)}
                className="relative h-[500px] rounded-lg overflow-hidden cursor-pointer group transition-all duration-500  hover:shadow-xl"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white drop-shadow-md">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`  bg-white w-24 sm:w-32 md:w-40 h-full absolute top-0 z-[48] transition left-[20%] sm:right-[20%]`} />
    </div>
  );
}
