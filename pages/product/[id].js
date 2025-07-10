import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/contexts/CartContext";
import { WishListContext } from "@/contexts/WishListContext";
import { PromotionDisplayContext } from "@/contexts/PromotionDisplayContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from "@/models/Product";
import { event } from "@/lib/gtag";
import 'animate.css';
import Image1 from '@/public/assets/image1.jpg';
import Image2 from '@/public/assets/image2.jpg';
import Image3 from '@/public/assets/image3.jpg';
import Image4 from '@/public/assets/image4.jpg';
import SignInModal from "@/components/SignInModal";
import ImageCarousel from "@/components/ImageCarousel";

export default function ProductPage({ product }) {
  const { addProduct, cart, removeProduct } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist, isLoggedIn } = useContext(WishListContext);
  const { getDiscountedPrice, getPromotionLabel, loading } = useContext(PromotionDisplayContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [price, setPrice] = useState(null); 
  const [discountedPrice, setDiscountedPrice ] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const images = [Image1, Image2, Image3, Image4];
  

  useEffect(() => {
    if (loading) return;
    if (product.variants.length) {
      const firstAvailable = product.variants.find(v => v.stock > 0);
      if (firstAvailable) {
        setSelectedSize(firstAvailable.size);
        setSelectedColor(firstAvailable.color);
        setPrice(firstAvailable.price);
        setDiscountedPrice(getDiscountedPrice(product, firstAvailable));
      }
    }
  }, [product.variants, loading]);

  useEffect(() => {
    const selectedVariant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
    if (selectedVariant) {
      setPrice(selectedVariant.price);
      setDiscountedPrice(getDiscountedPrice(product, selectedVariant))
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
        stock: variant.stock,
        price: variant.price,
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

  return (
    <>
      <Header />

      <div className="bg-neutral-100 py-12 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="relative flex justify-center items-center lg:w-1/2 px-5 ">
              <ImageCarousel images={images} alt={product.title} />
            </div>
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="animate__animated animate__fadeIn animate__delay-2s">
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
                    ? discountedPrice 
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
                      : (
                        <p className="text-3xl font-semibold text-gray-900 mb-6">
                          <span>{variant?.price} L.E</span>
                        </p>
                      ) : null
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
                      <span className="text-sm animate-pulse">... جاري التحميل</span>
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
              { outOfStock 
                  ? (
                    <div className="bg-red-600 w-fit text-white py-2 px-8 rounded-sm shadow-md  ">
                      <span className="text-2xl">مَبِيع</span>
                    </div>
                  )
                  : productInCart ? (
                    <button
                      onClick={() => 
                        deleteProduct(product._id
                          , productInCart.selectedColor
                          , productInCart.selectedSize
                          , productInCart.title
                          , productInCart.category
                          , productInCart.price
                        )
                      }
                      className="bg-accent w-full md:w-1/2 text-neutral-50 py-2 px-8 rounded-sm hover:bg-red-500"
                    >
                      حذف من السلة
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className={`bg-primary w-full md:w-1/2 text-neutral-50 py-2 px-8 rounded-sm hover:bg-neutral-500 transition ${isAdding ? 'opacity-50 cursor-wait' : ''} animate__animated animate__fadeIn`}
                      disabled={isAdding || !selectedSize || !selectedColor}
                    >
                      {isAdding ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
                    </button>
                  )
                }

              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id).lean();
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}