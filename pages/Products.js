import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { ArrowForward, ArrowBack, Close, FilterList, Sort } from "@mui/icons-material";
import {  useEffect, useRef, useState } from "react";
import ReactSlider from 'react-slider';
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import ProductSkeleton from "@/components/ProductSkeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import axiosClient from "@/lib/axiosClient";
import Head from "next/head";


export default function Products({  }) {
  const [ products, setProducts ] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ pages, setPages ] = useState(1);
  const [ loading, setLoading ] = useState(false);

  const [ categories, setCategories ] = useState([]);
  const [ selectedCategory, setSelectedCategory ] = useState(null);
  const [ selectedSizes, setSelectedSizes ] = useState([]);
  const [ selectedColors, setSelectedColors ] = useState([]);
  const [ filteredProducts, setFilteredProducts ] = useState(products);
  const [ sizes, setSizes ] = useState([]);
  const [ colors, setColors ] = useState([]);
  const [ openFilters, setOpenFilters ] = useState(false);
  const [ activeFilter, setActiveFilter ] = useState(null);
  const [ sortOption, setSortOption ] = useState('');
  const [ openSort, setOpenSort] = useState(false);
  const router = useRouter();
  const sortRef = useRef();
  const sortButtonRef = useRef();
  const limit = 32  ;
  
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/api/products?page=${page}&limit=${limit}`);

        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }

        setPages(data.pages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [ page ]);

  useEffect(() => {
    const { category } = router.query;
    if (!category || !categories.length) return;

    const Wantedcategory = categories.reduce((found, c) => {
      if (found) return found;

      if (String(c._id) === String(category)) {
        return c; // ✅ parent match
      }

      const child = c.children?.find(child => String(child._id) === String(category));
      if (child) {
        return child; // ✅ child match
      }

      return null;
    }, null);

    if (Wantedcategory) {
      setSelectedCategory(Wantedcategory);
    }
  }, [router.query, categories]);



  useEffect(() => {
    if (openFilters) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [openFilters]);

  useEffect(() => {
    const handleClickOutSide = (e) => {
      const path = e.composedPath();
      if (!path.includes(sortRef.current) && !path.includes(sortButtonRef.current)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, [openSort]);

  useEffect(() => {
    axiosClient.get("/api/categories").then(res => {
      setCategories(res.data);
    }).catch(err => console.log(err));
    const uniqueSizes = [
      ...new Set(products.flatMap((product) => product.variants.map((v) => v.size))),
    ];
    const uniqueColors = [
      ...new Set(products.flatMap((product) => product.variants.map((v) => v.color))),
    ];

    setSizes(uniqueSizes);
    setColors(uniqueColors);
  
  }, [products]);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      let selectedAndChildCategoryIds = [selectedCategory._id];

      if (Array.isArray(selectedCategory.children)) {
        selectedAndChildCategoryIds.push(...selectedCategory.children.map(child => child._id));
      }

      filtered = filtered.filter(product =>
        selectedAndChildCategoryIds.includes(product.category?.toString())
      );
    }
    

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => product.variants.some(variant => selectedSizes.includes(variant.size)));
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => product.variants.some(variant => selectedColors.includes(variant.color)));
    }

    if (sortOption === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortOption === 'price-highest') {
      filtered.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }

    if (sortOption === 'price-lowest') {
      filtered.sort((a, b) => a.variants[0].price - b.variants[0].price);
    }

    setFilteredProducts(filtered);
    
  }, [selectedCategory, selectedSizes, selectedColors, products, sortOption]);

  const handleCategoryChange = (category) => {
    if (selectedCategory?._id === category._id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSizeChange = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleColorChange = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  const handleBackgroundClick = (e) => {
      if (e.target.id === "sideBarBackground") {
        setOpenFilters(false);
        setActiveFilter(null);
      }
    };

  const FilterButton = ({ title, onClick }) => (
    <button 
      onClick={onClick}
      className="flex justify-between items-center text-2xl  text-neutral-800 px-4 py-3 rounded-sm shadow-sm border-b hover:bg-neutral-100"
    >
      <span>{title}</span>
      <ArrowBack className="text-xl" />
    </button>
  )

  const FilterOverlay = ({children}) => (
    <div className=" w-full overflow-y-auto h-[60vh] p-4 flex flex-col space-y-5  flex-grow ">
      {children}
    </div>
  );

  return (
    <>
      <Head>
        <title>المتجر | Venus Outlet فينوس اوتليت</title>
        <meta
          name="description"
          content="استكشف أحدث تشكيلات الملابس النسائية وملابس الأطفال من Venus Outlet فينوس اوتليت، تسوق أونلاين واستفد من العروض المميزة في مصر."
        />
      </Head>
      <Header />
      <ErrorBoundary>
        <div className=" min-h-screen bg-neutral-50">
          {/* Overlay when filters are open */}
          {openFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />
          )}

          {/* Sidebar */}
          {openFilters && (
            <div onClick={handleBackgroundClick} id="sideBarBackground" className="fixed inset-0 z-[51]  flex items-center justify-center bg-black/50">
            <aside className={"bg-neutral-50  shadow-lg border-neutral-200 fixed  py-6 h-screen w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 top-0 right-0 z-50 animate-slideFromLeft"}>
              <div className="flex items-center justify-between p-4 ">
                <button onClick={() => setActiveFilter(null)}>
                  {activeFilter !== null && (
                    <ArrowForward className="text-3xl" />
                  )}
                </button>
                <h2 className="text-2xl font-bold">
                  {activeFilter === null && "خيارات التصفية"}
                  {activeFilter === "category" && "الفئات"}
                  {activeFilter === "size" && "الحجم"}
                  {activeFilter === "color" && "اللون"}
                  {activeFilter === "price" && "السعر"}
                </h2>
                <button onClick={() => {setOpenFilters(false); setActiveFilter(null);}}>
                  <Close className="text-4xl" />
                </button>
              </div>
              <div className="flex flex-col gap-6   p-6 w-full ">
                {activeFilter === null && (
                  <div className="flex flex-col gap-4">
                    <FilterButton title={`الفئات ${selectedCategory ? `(${selectedCategory.name})` : ""}`} onClick={() => setActiveFilter("category")} />
                    <FilterButton title={`الحجم ${selectedSizes.length > 0 ? `(${selectedSizes.length})` : ""}`} onClick={() => setActiveFilter("size")} />
                    <FilterButton title={`اللون ${selectedColors.length > 0 ? `(${selectedColors.length})` : ""}`} onClick={() => setActiveFilter("color")} />
                  </div>
                )} 
                { activeFilter === "category" && (
                    <FilterOverlay title={"الفئات"}>
                      {categories.map((category) => (
                        <>
                          <label key={category._id} className="flex items-center gap-5 text-lg">
                            <input 
                              type="checkbox"
                              checked={selectedCategory?._id === category._id}
                              onChange={() => handleCategoryChange(category)}
                              className="w-5 h-5"
                              hidden
                            />
                            <div className="w-6 h-6 bg-white border border-neutral-500 rounded-sm p-1">
                              {selectedCategory?._id === category._id && 
                                <div className="bg-accent w-full h-full z-10 rounded-sm"></div>
                              }
                            </div>
                            <span>{category.name}</span>
                          </label>
                          {category.children.length > 0 && (
                            <>
                              {category.children.map((child) => (
                                <label key={child._id} className="flex items-center gap-5 text-lg">
                                  <input 
                                    type="checkbox"
                                    checked={selectedCategory?._id === child._id}
                                    onChange={() => handleCategoryChange(child)}
                                    className="w-5 h-5"
                                    hidden
                                  />
                                  <div className="w-6 h-6 bg-white border border-neutral-500 rounded-sm p-1">
                                    {selectedCategory?._id === child._id && 
                                      <div className="bg-accent w-full h-full z-10 rounded-sm"></div>
                                    }
                                  </div>
                                  <span>{child.name}</span>
                                </label>
                              ))}
                            </>
                          )}
                        </>
                      ))}
                    </FilterOverlay>
                  )
                }
                { activeFilter === "size" && (
                    <FilterOverlay title={"الحجم"}>
                      {sizes.map((size) => (
                        <label key={size} className="flex items-center gap-5 text-lg">
                          <input 
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => handleSizeChange(size)}
                            className="w-5 h-5"
                            hidden
                          />
                          <div className="w-6 h-6 bg-white border border-neutral-500 rounded-sm p-1">
                            {selectedSizes.includes(size) && 
                              <div className="bg-accent w-full h-full z-10 rounded-sm"></div>
                            }
                          </div>
                          <span>{size}</span>
                        </label>
                      ))}
                    </FilterOverlay>
                  )
                }
                { activeFilter === "color" && (
                    <FilterOverlay title={"اللون"}>
                      {colors.map((color) => (
                        <label key={color} className="flex items-center gap-5 text-lg">
                          <input 
                            type="checkbox"
                            checked={selectedColors.includes(color)}
                            onChange={() => handleColorChange(color)}
                            className="w-5 h-5"
                            hidden
                          />
                          <div className="w-6 h-6 bg-white border border-neutral-500 rounded-sm p-1">
                            {selectedColors.includes(color) && 
                              <div className="bg-accent w-full h-full z-10 rounded-sm"></div>
                            }
                          </div>
                          <span>{color}</span>
                        </label>
                      ))}
                    </FilterOverlay>
                  )
                }
                  {/* Reset Filters Button */}
                  <div className="flex flex-col gap-5 absolute bottom-16 sm:bottom-4 w-full p-6 right-0">
                    <div className="flex flex-col justify-center w-full ">
                      <button
                        onClick={() => {
                          setSelectedSizes([]);
                          setSelectedColors([]);
                          setSelectedCategory(null);
                        }}
                        className="w-full bg-accent hover:bg-red-700 text-white py-2 rounded-sm font-bold shadow-md transition-all"
                        disabled={!selectedSizes.length && !selectedColors.length && !selectedCategory}
                      >
                        تصفية الكل
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setOpenFilters(false);
                          setActiveFilter(null);
                        }}
                        className="w-full bg-primary hover:bg-neutral-800 text-white py-2 rounded-sm font-bold shadow-md transition-all"
                      >
                        عرض النتائج
                      </button>
                    </div>
                  </div>
              </div>
            </aside>
            </div>
          )}
    
          {/* Main Content */}
          <main className="flex-1 p-8">
            {/*  mobile Filter button */}
            <div className="sticky top-16 sm:top-20 w-full z-30 bg-neutral-50 py-2  ">
              <div className="  flex justify-between items-center">
                <button
                  className=" flex sm:gap-2 items-center font-semibold py-3 px-1 underline text-md md:text-xl"
                  onClick={() => setOpenFilters(true)}
                >
                  خيارات التصفية
                  {  selectedSizes.length + selectedColors.length + Boolean(selectedCategory) > 0 && (
                    ` ( ${ selectedSizes.length + selectedColors.length + Boolean(selectedCategory)} )`
                  )}
                  <FilterList />
                </button>
                <div>

                  <button
                    className=" flex sm:gap-2 items-center font-semibold py-3 px-1 underline text-md md:text-xl"
                    onClick={() => setOpenSort(!openSort)}
                    ref={sortButtonRef}
                  >
                    ترتيب حسب
                    <Sort />
                  </button>
                  {openSort && (
                    <div ref={sortRef} className="absolute top-16 left-0 w-60 z-30  flex flex-col  bg-white text-black shadow-lg rounded-sm border ">
                      <button 
                        onClick={() => {setOpenSort(false); setSortOption("newest")}}
                        className={`block w-full px-4 py-2 hover:bg-gray-100 hover:text-red-500 rounded-b-lg transition text-right ${sortOption === "newest" ? " bg-neutral-200" : ""}`}
                      >
                        الأحدث
                      </button>
                      <button 
                        onClick={() => {setOpenSort(false); setSortOption("price-highest")}}
                        className={`block w-full px-4 py-2 hover:bg-gray-100 hover:text-red-500 rounded-b-lg transition text-right ${sortOption === "price-highest" ? " bg-neutral-200" : ""}`}
                      >
                        السعر: الأقل أولاً
                      </button>
                      <button 
                        onClick={() => {setOpenSort(false); setSortOption("price-lowest")}}
                        className={`block w-full px-4 py-2 hover:bg-gray-100 hover:text-red-500 rounded-b-lg transition text-right ${sortOption === "price-lowest" ? " bg-neutral-200" : ""}`}
                      >
                        السعر: الأعلى أولاً
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* breadcrumbs */}
              { selectedCategory && (<div className="justify-self-start max-sm:text-md mt-2 pb-2">
                 <button className="text-neutral-500 hover:text-primary" onClick={() => setSelectedCategory(null)}>الكل</button>
                {
                  selectedCategory?.parentCategory ? (
                    <>
                      <button className="text-neutral-500 hover:text-primary" onClick={() => setSelectedCategory(categories.find((c) => c._id === selectedCategory?.parentCategory))}> / {categories.find((c) => c._id === selectedCategory?.parentCategory)?.name}</button>
                      <span> / {selectedCategory?.name}</span>
                    </>
                  ) : (
                    <span> / {selectedCategory?.name}</span>
                  ) 
                  
                }
              </div>)}
            </div>
    
            {/* Products Grid */}
            { loading 
              ? (
                <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 mt-20">
                  {[...Array(8)].map((_, index) => (
                    <div key={index}>
                      <ProductSkeleton />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 mt-20">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                    >
                      <ProductBox {...product} />
                    </div>
                  ))}
                </div>
              )
            }

            {page < pages && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white rounded-lg"
                >
                  {loading ? "جار التحميل..." : "تحميل المزيد"}
                </button>
              </div>
            )}

          </main>
        </div>
      </ErrorBoundary>
      <Footer />
    </>
  );
  
  
  
}


