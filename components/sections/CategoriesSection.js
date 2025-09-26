import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axiosClient from "@/lib/axiosClient";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axiosClient.get("/api/categories").then((res) => {
      setCategories(res.data);
    }).then((res) => {setCategories(prev => prev.filter(cat => cat.showOnBanner === true));})
    .catch((err) => console.log(err)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-neutral-200 min-h-[calc(100vh-73px)] md:min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Accent Background */}
      <div className="bg-accent w-24 sm:w-32 md:w-40 z-[9] h-full absolute top-0 right-[20%] transition" />

      <div className="container h-full mx-auto text-center relative z-10 flex flex-col justify-center py-10">
        {/* Headline */}
        <div className="mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-neutral-900 leading-snug">
            إطلالتك تبدأ من هنا
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-neutral-700 max-w-2xl mx-auto leading-relaxed">
            اكتشف أحدث صيحات الموضة في أزياء النساء والرجال والأطفال.
          </p>
        </div>

        {/* Categories Grid */}
        { loading 
          ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${categories.length} gap-6 sm:gap-8 px-4 sm:px-8 md:px-16`}>
              {[...Array(categories.length)].map((index) => (
                <div
                  key={index}
                  className="relative h-[150px] sm:h-[320px] md:h-[400px] rounded-sm skeleton border border-neutral-400"
                />
              ))}
            </div>
          ) : ( 
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${categories.length} gap-6 sm:gap-8 px-4 sm:px-8 md:px-16`}>
              {categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => router.push(`/Products?category=${category._id}`)}
                  className="relative h-[150px] sm:h-[320px] md:h-[400px] rounded-sm overflow-hidden cursor-pointer group transition-all duration-500 ease-in-out   "
                >

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-200 via-neutral-100 to-neutral-200  group-hover:bg-neutral-50 transition duration-500" />

                  {/* Category Text */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center transform group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-2xl z-10  md:text-4xl font-bold text-accent drop-shadow-lg">
                      {category.name} 
                    </h3>
                    <div className="absolute flex justify-center items-center">
                      <ArrowBackIcon className=" text-[150px] sm:text-[200px] text-primary/5"/>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
