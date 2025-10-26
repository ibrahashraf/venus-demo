import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Close, Search } from "@mui/icons-material";
import ProductBox from "../ProductBox";
import ProductSkeleton from "../ProductSkeleton";
import axiosClient from "@/lib/axiosClient";

export default function SearchModal({ onClose }) {
    const [products, setProducts] = useState([]); 
    const [categories, setCategories] = useState([]); 
    const [ searchTerm, setSearchTerm ] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchModalRef = useRef();

    useEffect(() => {
        setLoading(true);
        Promise.all([
          axiosClient.get('/api/products'),
          axiosClient.get('/api/categories')
        ])
          .then(([productsRes, categoriesRes]) => {
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
          })
          .finally(() => setLoading(false)); 
    }, []);

    useEffect(() => {
      let filtered = products
      if (searchTerm.trim().length < 3) {
        setFilteredProducts([]);
        return;
      }
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        const category = categories.find(c => c._id.toString() === product.category.toString()) ||
        categories.map(c => c.children).flat().find(c => c._id.toString() === product.category.toString());
        const parentCategory = categories.find(c => c._id.toString() === product.parentCategory?.toString());
        const categoryName = category?.name || "";
        const parentCategoryName = parentCategory?.name || "";
        return (
          product.title?.toLowerCase().includes(lowerSearch) ||
          product.description?.toLowerCase().includes(lowerSearch) ||
          categoryName.includes(lowerSearch) ||
          parentCategoryName.includes(lowerSearch)
        );
      });
      setFilteredProducts(filtered);
    }, [searchTerm, products, categories]);

    const handleBackgroundClick = (e) => {
      if (e.target.id === "searchModalBackground") {
        onClose();
      }
    };
  const LatestProducts = products.filter(product =>
      product.variants?.some(variant => variant.stock > 0))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8);
  const modalContent = (
    <div
        id='searchModalBackground'
        className="fixed inset-0 z-[51]  flex items-center justify-center bg-black/50"
        
        onClick={handleBackgroundClick}
    >
      <div
        ref={searchModalRef}
        className="bg-white z-[1000] overflow-y-auto animate-slideFromLeft  shadow-lg border-neutral-200 fixed  py-6 h-screen w-screen md:w-1/2   top-0 right-0   "
      >
        <div className="flex items-center gap-2 px-2 relative ">
          <Search className="absolute top-4 right-4 text-neutral-500 text-2xl z-10"  />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative  rounded-sm shadow-md focus:shadow-xl transition-shadow w-full px-5 py-3 pr-10 border-b border-neutral-600  focus:outline-none  "
          />
          { searchTerm.trim().length > 0 && (
            <button
              onClick={() => {setSearchTerm("");}}
              
            >
              <Close className=" absolute top-4 left-16 text-neutral-700 text-2xl z-10 " />
            </button>
          )}
          <button
            onClick={onClose}
            
          >
            <Close className=" text-primary text-4xl " />
          </button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto mt-3">

          {searchTerm.trim().length > 3 
            && (
              <>
                <div className="p-4 mt-8">
                  <h2 className="text-xl font-bold mb-4">
                    {filteredProducts.length > 0 ?
                  ` نتائج البحث عن  
                    "${searchTerm}"`
                    :
                    " لا توجد نتائج مطابقة"
                    }
                  </h2>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {filteredProducts.map(product => (
                      <div key={product._id}>
                        <ProductBox {...product} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          }
          <div className="p-4 mt-8">
            <h2 className="text-xl font-bold mb-4">احدث الاضافات</h2>
            {loading 
              ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {LatestProducts.map(product => (
                    <div key={product._id}>
                      <ProductBox {...product} />
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      </div>

    </div>
  );

  return createPortal(modalContent, document.getElementById('search-modal-root'));
}