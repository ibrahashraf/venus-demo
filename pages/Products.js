import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { ArrowForward, ArrowBack, Close, FilterList, Sort } from "@mui/icons-material";
import axios from "axios";
import {  useEffect, useRef, useState } from "react";
import ReactSlider from 'react-slider';
import { useRouter } from "next/router";


export default function Products({ products }) {
  const [ categories, setCategories ] = useState([]);
  const [ selectedCategories, setSelectedCategories ] = useState([]);
  const [ selectedSizes, setSelectedSizes ] = useState([]);
  const [ selectedColors, setSelectedColors ] = useState([]);
  const [ priceRange, setPriceRange ] = useState([0, 0]);
  const [ minPrice, setMinPrice ] = useState(0);
  const [ maxPrice, setMaxPrice ] = useState(0);
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


  useEffect(() => {
    const { category } = router.query;
    if (category) {
      setSelectedCategories(
        categories.find((c) => c._id === category)
      );
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
    axios.get("/api/categories").then(res => {
      setCategories(res.data);
    })
    const uniqueSizes = [
      ...new Set(products.flatMap((product) => product.variants.map((v) => v.size))),
    ];
    const uniqueColors = [
      ...new Set(products.flatMap((product) => product.variants.map((v) => v.color))),
    ];

    setSizes(uniqueSizes);
    setColors(uniqueColors);
    const allPrices = products.flatMap(p =>
      p.variants?.map(v => v.price).filter(p => typeof p === 'number') || []
    );
  
    if (allPrices.length > 0) {
      const min = Math.min(...allPrices);
      const max = Math.max(...allPrices);
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }

  }, [products]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      const selectedAndChildCategoryIds = selectedCategories.flatMap(category => {
        const ids = [category._id];
        if (Array.isArray(category.children)) {
          ids.push(...category.children.map(child => child._id));
        }
        return ids;
      })
    
      filtered = filtered.filter(product =>
        selectedAndChildCategoryIds.includes(product.category)
      );
    }
    

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => product.variants.some(variant => selectedSizes.includes(variant.size)));
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => product.variants.some(variant => selectedColors.includes(variant.color)));
    }

    if (priceRange) {
      filtered = filtered.filter(product => product.variants.some(variant => variant.price >= priceRange[0] && variant.price <= priceRange[1]));
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
    
  }, [selectedCategories, selectedSizes, selectedColors, priceRange, products, sortOption]);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c._id !== category._id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
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
      }
    };

  const FilterButton = ({ title, onClick }) => (
    <button 
      onClick={onClick}
      className="flex justify-between items-center text-2xl  text-gray-800 bg-neutral-100 px-4 py-3 rounded-sm shadow hover:bg-neutral-200"
    >
      <span>{title}</span>
      <ArrowBack className="text-xl" />
    </button>
  )

  const FilterOverlay = ({children}) => (
    <div className=" w-full h-full p-4 flex flex-col space-y-5 overflow-y-auto flex-grow ">
      {children}
    </div>
  );

  return (
    <>
      <Header />
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
                  <FilterButton title={`الفئات ${selectedCategories.length > 0 ? `(${selectedCategories.length})` : ""}`} onClick={() => setActiveFilter("category")} />
                  <FilterButton title={`الحجم ${selectedSizes.length > 0 ? `(${selectedSizes.length})` : ""}`} onClick={() => setActiveFilter("size")} />
                  <FilterButton title={`اللون ${selectedColors.length > 0 ? `(${selectedColors.length})` : ""}`} onClick={() => setActiveFilter("color")} />
                  <FilterButton title={"السعر"} onClick={() => setActiveFilter("price")} />
                </div>
              )} 
              { activeFilter === "category" && (
                  <FilterOverlay title={"الفئات"}>
                    {categories.map((category) => (
                      <>
                        <label key={category._id} className="flex items-center gap-5 text-lg">
                          <input 
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="w-5 h-5"
                            hidden
                          />
                          <div className="w-6 h-6 bg-white border border-neutral-500 rounded-sm p-1">
                            {selectedCategories.includes(category) && 
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
                                  checked={selectedCategories.includes(child)}
                                  onChange={() => handleCategoryChange(child)}
                                  className="w-5 h-5"
                                  hidden
                                />
                                <div className="w-6 h-6 bg-white border border-neutral-500 rounded-sm p-1">
                                  {selectedCategories.includes(child) && 
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
              { activeFilter === "price" && (
                  <FilterOverlay title={"السعر"}>
                    {/* <div className="relative"> */}
                      <ReactSlider
                        className="w-full h-2  rounded-full mt-10"
                        thumbClassName="h-5 -top-1.5 w-5 bg-black border-2 border-white rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform duration-200"
                        trackClassName="bg-black h-2 rounded-full"
                        min={minPrice}
                        max={maxPrice}
                        value={priceRange}
                        onChange={setPriceRange}
                        pearling
                        minDistance={10}
                        renderThumb={(props, state) => (
                          <div {...props}>
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 border border-neutral-500 text-sm font-semibold px-2 py-1 rounded-sm shadow">
                              {state.valueNow} EGP
                            </div>
                          </div>
                        )}
                      />
                    {/* </div> */}
                  </FilterOverlay>
                )
              }
                {/* Reset Filters Button */}
                <div className="flex flex-col justify-center w-full">
                  <button
                    onClick={() => {
                      setSelectedSizes([]);
                      setSelectedColors([]);
                      setPriceRange([minPrice, maxPrice]);
                      setSelectedCategories([]);
                    }}
                    className="w-full bg-accent hover:bg-red-700 text-white py-2 rounded-sm font-bold shadow-md transition-all"
                    disabled={!selectedSizes.length && !selectedColors.length && !selectedCategories.length && priceRange[0] === minPrice && priceRange[1] === maxPrice}
                  >
                    تصفية الكل
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setOpenFilters(false);
                    }}
                    className="w-full bg-primary hover:bg-neutral-800 text-white py-2 rounded-sm font-bold shadow-md transition-all"
                  >
                    عرض النتائج
                  </button>
                </div>
            </div>
          </aside>
          </div>
        )}
  
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/*  mobile Filter button */}
          <div className="sticky top-16 sm:top-20 w-full z-30 bg-neutral-50 py-2 flex justify-between items-center  ">
            <button
              className=" flex gap-2 items-center font-semibold py-3 px-1 underline text-md md:text-xl"
              onClick={() => setOpenFilters(true)}
            >
              خيارات التصفية
              {selectedCategories.length + selectedSizes.length + selectedColors.length > 0 && (
                ` ( ${selectedCategories.length + selectedSizes.length + selectedColors.length} )`
              )}
              <FilterList />
            </button>
            <div>

            <button
              className=" flex gap-2 items-center font-semibold py-3 px-1 underline text-md md:text-xl"
              onClick={() => setOpenSort(!openSort)}
              ref={sortButtonRef}
            >
              ترتيب حسب
              <Sort />
            </button>
            {openSort && (
              <div ref={sortRef} className="absolute top-16 left-0 w-60 z-30 bg-neutral-50 flex flex-col shadow-md border border-gray-200">
                <button 
                  onClick={() => {setOpenSort(false); setSortOption("newest")}}
                  className={`w-full border-b border-gray-200 text-lg text-right p-2 ${sortOption === "newest" ? " bg-neutral-200" : ""}`}
                >
                  الأحدث
                </button>
                <button 
                  onClick={() => {setOpenSort(false); setSortOption("price-highest")}}
                  className={`w-full border-b border-gray-200 text-lg text-right p-2 ${sortOption === "price-highest" ? " bg-neutral-200" : ""}`}
                >
                  السعر: الأقل أولاً
                </button>
                <button 
                  onClick={() => {setOpenSort(false); setSortOption("price-lowest")}}
                  className={`w-full text-lg text-right p-2 ${sortOption === "price-lowest" ? " bg-neutral-200" : ""}`}
                >
                  السعر: الأعلى أولاً
                </button>
              </div>
            )}
            </div>
          </div>
  
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 mt-20">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
              >
                <ProductBox {...product} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
  
  
  
}

export async function getServerSideProps() {
  await mongooseConnect();

  const products = await Product.find({}, null, { sort: { _id: -1 } });


  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    }
  };
}

