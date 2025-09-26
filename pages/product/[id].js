import Header from "@/components/Header";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/contexts/CartContext";
import { WishListContext } from "@/contexts/WishListContext";
import { PromotionDisplayContext } from "@/contexts/PromotionDisplayContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { event } from "@/lib/gtag";
import SignInModal from "@/components/modals/SignInModal";
import ImageCarousel from "@/components/ImageCarousel";
import ProductsSlider from "@/components/ProductsSlider";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import Error from "../_error";
import { PuffLoader } from "react-spinners";
import Head from "next/head";
import Button from "@/components/ui/Button";
import axiosClient from "@/lib/axiosClient";

export default function ProductPage({ product, relatedProducts, error, statusCode }) {
  const { addProduct, cart, removeProduct, decreaseQuantity, increaseQuantity } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist, isLoggedIn } = useContext(WishListContext);
  const { getDiscountedPrice, getPromotionLabel, loading } = useContext(PromotionDisplayContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [price, setPrice] = useState(null); 
  const [compareAtPrice, setCompareAtPrice] = useState(null);
  const [discountedPrice, setDiscountedPrice ] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState(null);
  

  useEffect(() => {
    if (loading) return;
    if (product.variants.length) {
      const firstAvailable = product.variants.find(v => v.stock > 0);
      if (firstAvailable) {
        setSelectedSize(firstAvailable.size);
        setSelectedColor(firstAvailable.color);
        setPrice(firstAvailable.price);
        setDiscountedPrice(getDiscountedPrice(product, firstAvailable));
        setCompareAtPrice(firstAvailable.compareAtPrice || null);
      }
    }
  }, [product.variants, loading]);

  useEffect(() => {
    const selectedVariant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
    if (selectedVariant) {
      setPrice(selectedVariant.price);
      setDiscountedPrice(getDiscountedPrice(product, selectedVariant));
      setCompareAtPrice(selectedVariant.compareAtPrice || null);
    }
  }, [selectedSize, selectedColor, product.variants]);
  
  useEffect(() => {
    event({
      action: "view_item",
      params: {
        send_to: process.env.GANALYTICS_ID,
        currency: "EGP",
        value: price,
        items: [
          {
            item_id: product._id,
            item_name: product.title,
            price: price,
            item_category: product.category,
          },
        ],
      },
    });
  }, [price]);

  const variant = product.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const promotionLabel = getPromotionLabel(product);


  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor || !variant) return;

    if (variant.stock > 0) { 
      setIsAdding(true);
      addProduct({
        _id: product._id,
        images: product.images,
        title: product.title,
        selectedColor,
        selectedSize,
        stock: variant?.stock,
        price: variant?.price,
        category: product.category,
      });
      setTimeout(() => setIsAdding(false), 500);
    } else {
      alert('هذه المتغيرات غير متوفرة حالياً.');
    }
  };

  const handleWishlistClick = async () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist({ productId: product._id });
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const inWishlist = wishlist?.some(item => item.productId._id === product._id);

  const productInCart = cart.find(
    (item) =>
      item._id === product._id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
  );
  

  function deleteProduct(productId, productColor, productSize, productTitle, productCategory, productPrice) {
    removeProduct(productId, productColor, productSize, productTitle, productCategory, productPrice);
  }
  const outOfStock = product.variants.length > 0 && product.variants.every(v => v.stock < 1);

  if (error) {
    return <Error statusCode={statusCode} />;
  }

  const handleIncrease = async (productId, selectedColor, selectedSize, stock, quantity) => {
    setLoadingKey(`${productId}-${selectedColor}-${selectedSize}-inc`);
    try {
      await increaseQuantity(productId, selectedColor, selectedSize, stock, quantity);
    } finally {
      setLoadingKey(null);
    }
  }
  const handleDecrease = async (productId, selectedColor, selectedSize, quantity) => {
    setLoadingKey(`${productId}-${selectedColor}-${selectedSize}-dec`);
    try {
      if (quantity < 1) return;
      if (quantity === 1) {
        await removeProduct(productId, selectedColor, selectedSize);
        return;
      }
      await decreaseQuantity(productId, selectedColor, selectedSize);
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <>
      <Head>
        <title>
          {product.metaTitle 
            || `${product.name} | ${product.category?.metaTitle || product.category?.name}`}
        </title>
        <meta
          name="description"
          content={
            product.metaDescription 
            || `${product.name} available in ${product.category?.metaDescription || product.category?.name} at Our Store`
          }
        />
        {/* Product Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "image": product.images,
            "description": product.description,
            "sku": product._id,
            "brand": {
              "@type": "Brand",
              "name": "Venus Outlet"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://yourstore.com/product/${product._id}`,
              "priceCurrency": "EGP",
              "price": variant?.price || "",
              "availability": outOfStock 
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          })
        }} />

        {/* Product Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "image": product.images,
            "description": product.description,
            "sku": product._id,
            "brand": {
              "@type": "Brand",
              "name": "Venus Outlet"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://youurdomain/product/${product._id}`,
              "priceCurrency": "EGP",
              "price": variant?.price || "",
              "availability": outOfStock 
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          })
        }} />

        {/* Organization Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Venus Outlet",
            "url": "https://youurdomain",
            "logo": "https://youurdomain/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+20-114-7111094",
              "contactType": "Customer Service",
              "areaServed": "EG"
            }
          })
        }} />

        {/* Breadcrumb Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://youurdomain"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": product.category?.name || "Category",
                "item": `https://youurdomain/products?category=${product.category?._id}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.title,
                "item": `https://youurdomain/product/${product._id}`
              }
            ]
          })
        }} />
      </Head>

      <Header />
      <ErrorBoundary>
        <div className="bg-neutral-100 py-12 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="relative flex justify-center items-center lg:w-1/2 px-5 ">
                <ImageCarousel images={product.images} alt={product.description} />
              </div>
              <div className="w-full lg:w-2/3 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-10">
                    <h1 className="text-4xl text-gray-800 mb-4">{product.title}</h1>
                    {promotionLabel && (
                      <p className="bg-accent text-neutral-50 font-bold py-1 px-2 rounded-sm " dir='ltr'>
                        {promotionLabel}
                      </p>
                    )}
                  </div>
                  {selectedSize && selectedColor && (
                  <>
                    { variant?.stock > 0 
                      && discountedPrice 
                        ? (
                          <div className="flex items-center justify-start gap-2">
                            <p className="text-xl font-bold text-accent  mb-6" dir="ltr">
                              {discountedPrice} EGP
                            </p>
                            <p className="text-xl line-through text-neutral-800  mb-6" dir="ltr">
                              {variant?.price} EGP
                            </p>
                          </div>
                        )
                        : compareAtPrice 
                        ? (
                          <div className="flex items-center justify-start gap-2">
                            <p className="text-xl font-bold text-accent  mb-6" dir="ltr">
                              {variant?.price} EGP
                            </p>
                            <p className="text-xl line-through text-neutral-800  mb-6" dir="ltr">
                              {compareAtPrice} EGP
                            </p>
                          </div>
                        ) 
                        : (
                          <p className="text-3xl font-semibold text-gray-900 mb-6">
                            <span>{variant?.price} L.E</span>
                          </p>
                        )
                    }
                    
                  </>
                )}
                    
                    <button
                      onClick={handleWishlistClick}
                      disabled={wishlistLoading}
                      className={` transition flex items-center gap-2 ${
                        inWishlist ? "text-red-500" : "text-black hover:text-red-500"
                      } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={inWishlist ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                    >
                      { outOfStock 
                      ? (<></>)
                      : wishlistLoading ? (
                        <span className="text-sm ">... جاري التحميل</span>
                      ) : inWishlist ? (
                        <span className="text-md flex items-center gap-2">
                          <FavoriteIcon fontSize="small" /> حذف من المفضلة
                        </span>
                      ) : (
                        <span className="text-md flex items-center gap-2">
                          <FavoriteBorderIcon fontSize="small" /> إضافة إلى المفضلة
                        </span>
                      )}
                    </button>
                    {showModal && <SignInModal onClose={() => setShowModal(false)} />}
                </div>

                <div className="mb-6">
                  <label className=" text-gray-700 block mb-2"> المقاس:</label>
                  <div className="flex flex-wrap">
                    {[...new Set(product.variants.map(v => v.size))].map(size => {
                      const isAvailable = product.variants.some(v => v.size === size && v.stock > 0);
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={` px-5 py-1 relative transition-colors duration-300 ease-in-out border-l-2 border-black last:border-0 ${
                            selectedSize === size ? ' shadow-md ' : ''
                          } ${!isAvailable && 'opacity-50 '}`}
                        >
                          {!isAvailable && <div className="w-3/4 h-[1px] left-[11%] bottom-[14px] absolute  -rotate-[15deg] bg-black z-50 "></div>}
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <label className=" text-gray-700 block mb-2"> اللون:</label>
                  <div className="flex flex-wrap">
                    {[...new Set(product.variants.map(v => v.color))].map(color => {
                      const isAvailable = product.variants.some(v => v.color === color && v.stock > 0);
                      return (
                        <button
                          key={color}
                          onClick={() => isAvailable && setSelectedColor(color)}
                          disabled={!isAvailable}
                          className={`px-5 py-1 relative transition-colors duration-300 ease-in-out border-l-2 border-black last:border-0 ${
                            selectedColor === color ? 'shadow-md' : ''
                          } ${!isAvailable && 'opacity-50 '}`}
                        >
                          {!isAvailable && <div className="w-3/4 h-[1px] left-[11%] bottom-[14px] absolute  -rotate-[15deg] bg-black z-50 "></div>}
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {product.description && (
                  <div className="text-gray-700 leading-relaxed py-4 max-w-xl">
                    <p>{product.description}</p>
                  </div>
                )}

                { outOfStock 
                    ? (
                      <div className="bg-red-600 w-fit text-white py-2 px-8 rounded-sm shadow-md  ">
                        <span className="text-2xl">مَبِيع</span>
                      </div>
                    )
                    : productInCart ? (
                      <div className="w-full md:w-1/2 flex flex-col gap-2">
                        <div className="w-full flex items-center justify-between text-xl bg-neutral-200 h-10 relative">
                          <button
                            className="w-14 flex items-center justify-center bg-neutral-400 hover:bg-neutral-500 text-primary h-full"
                            onClick={() => handleDecrease(product._id, productInCart.selectedColor, productInCart.selectedSize, productInCart.quantity)}
                            disabled={loadingKey === `${product._id}-${productInCart.selectedColor}-${productInCart.selectedSize}-dec`}
                          >
                            {loadingKey === `${product._id}-${productInCart.selectedColor}-${productInCart.selectedSize}-dec`
                              ? <PuffLoader color="#ffffff" size={25} />
                              : '-'}
                          </button>
                          <span className="px-3 py-2 ">{productInCart.quantity || 1}</span>
                          <button
                            className="w-14 flex items-center justify-center bg-neutral-400 hover:bg-neutral-500 text-primary h-full"
                            onClick={() => handleIncrease(product._id, productInCart.selectedColor, productInCart.selectedSize, variant.stock, productInCart.quantity)}
                            disabled={loadingKey === `${product._id}-${productInCart.selectedColor}-${productInCart.selectedSize}-inc` || variant.stock === productInCart.quantity}
                          >
                            {loadingKey === `${product._id}-${productInCart.selectedColor}-${productInCart.selectedSize}-inc`
                              ? <PuffLoader color="#ffffff" size={25} />
                              : '+'}
                          </button>
                        </div>
                        <Button
                          variant="accent"
                          onClick={() => 
                            deleteProduct(product._id
                              , productInCart.selectedColor
                              , productInCart.selectedSize
                              , productInCart.title
                              , productInCart.category
                              , productInCart.price
                            )
                          }
                          className=""
                        >
                          حذف من السلة
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleAddToCart}
                        className={` w-full md:w-1/2  ${isAdding ? 'opacity-50 cursor-wait font-semibold' : ''} `}
                        disabled={isAdding || !selectedSize || !selectedColor}
                      >
                        {isAdding ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
                      </Button>
                    )
                  }
                  { !outOfStock && variant?.stock > 0 
                    ? (
                      <div>
                        <span className=" text-accent font-bold">
                          { variant?.stock === 1 ? " قطعة واحدة فقط " : `   متوفر ${variant?.stock} قطع `  }
                        </span>
                        من {variant?.size} - {variant?.color} 
                      </div>
                    ) : (
                      <div>
                        اللون والحجم المحددان غير متاحين حالياً
                      </div>
                    )
                  }

                
              </div>
            </div>
          </div>
          <div>
            {
              relatedProducts.length > 0
              ? (
                <div className="mt-12 container">
                  <h2 className="text-3xl text-center font-bold mb-4 ">منتجات ذات صلة</h2>
                  <ErrorBoundary>
                    <ProductsSlider products={relatedProducts}/>
                  </ErrorBoundary>
                </div>
              )
              : null
            }
            
          </div>
        </div>
      </ErrorBoundary>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { id } = context.query;
  
    const { data } = await axiosClient.get(`${process.env.WEBSITE_URL}/api/products/${id}`);
  
    return {
      props: {
        product: data.product || null,
        relatedProducts: data.relatedProducts || [],
        error: null,
        statusCode: null,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
  
    return {
      props: {
        product: null,
        relatedProducts: [],
        error: "حدث خطأ ما",
        statusCode: 500,
      },
    };
  }
}
