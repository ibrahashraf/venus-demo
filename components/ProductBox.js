import Image from "next/image";
import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "@/contexts/CartContext";
import { PromotionDisplayContext } from "@/contexts/PromotionDisplayContext";
import { WishListContext } from "@/contexts/WishListContext";
import { ShoppingCart, Trash } from "lucide-react";
import Link from "next/link";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import 'animate.css';
import { ClipLoader } from "react-spinners";
import SignInModal from "./SignInModal";

export default function ProductBox( product ) {
  const firstAvailableVariant = product.variants.find(v => v.stock > 0);
  const { addProduct, removeProduct, cart } = useContext(CartContext);
  const { getDiscountedPrice, getPromotionLabel, loading } = useContext(PromotionDisplayContext);
  const { wishlist, addToWishlist, removeFromWishlist, isLoggedIn } = useContext(WishListContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(firstAvailableVariant?.size || product.variants[0]?.size || "");
  const [selectedColor, setSelectedColor] = useState(firstAvailableVariant?.color || product.variants[0]?.color || "");
  const [price, setPrice] = useState(firstAvailableVariant?.price || 0);
  const [discountedPrice, setDiscountedPrice ] = useState(null)
  const [isAdded, setIsAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [cartStep, setCartStep] = useState("idle");
  const [showActions, setShowActions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const boxRef = useRef();
  const groupedVariants = product.variants.reduce((acc, variant) => {
    const { color, size } = variant;
    if (!acc[color]) acc[color] = {};
    acc[color][size] = variant;
    return acc;
  }, {});
  const availableColors = Object.keys(groupedVariants);
  const availableSizes = selectedColor ? Object.keys(groupedVariants[selectedColor]) : [];



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && boxRef.current && !boxRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const productInCart = cart.some(
      (item) =>
        item._id === product._id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    setIsAdded(productInCart);

    
  }, [cart, product._id, selectedSize, selectedColor]);

  useEffect(() => {
    if (!selectedColor) return;
    const sizes = Object.keys(groupedVariants[selectedColor] || {});
    const firstAvailable = sizes.find(size => isSizeInStock(size, selectedColor));
    if (firstAvailable) setSelectedSize(firstAvailable);
  }, [selectedColor]);
  
  useEffect(() => {
    if (loading) return;
    const selectedVariant = groupedVariants[selectedColor]?.[selectedSize];
    if (selectedVariant) {
      setPrice(selectedVariant.price);
      setDiscountedPrice(getDiscountedPrice(product, selectedVariant))
    }
  }, [selectedSize, selectedColor, product.variants, loading]);

  

  
  const promotionLabel = getPromotionLabel(product);

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
  

  const handleAdd = () => { 
    const selectedVariant = groupedVariants[selectedColor]?.[selectedSize];
    
    if (!selectedVariant || selectedVariant.stock < 1 || isAdded) {
      return;
    }
    setIsAdding(true);

    addProduct({
      _id: product._id,
      images: product.images,
      title: product.title,
      selectedColor,
      selectedSize,
      stock: selectedVariant.stock,
      price: selectedVariant.price,
      category: product.category,
    });
    setTimeout(() => {
      setIsAdded(true);
      setIsAdding(false);
    }, 500);
  };


  const handleRemove = () => {
    const selectedVariant = groupedVariants[selectedColor]?.[selectedSize];
    setIsAdding(true);
    if (selectedVariant) {
      removeProduct(
        product._id,
        selectedVariant.color,
        selectedVariant.size,
        product.title,
        product.category,
        selectedVariant.price
      );
      setTimeout(() => {
        setIsAdded(false);
        setIsAdding(false);
      }, 500);
    }
  };

  const url = '/product/' + product._id;
  const outOfStock = product.variants.length > 0 && product.variants.every(v => v.stock < 1);
  const isSizeInStock = (size, color) => {
    const variant = groupedVariants[color]?.[size];
    return variant && variant.stock > 0;
  };


  
  
  return (
    <div ref={boxRef} className="bg-neutral-50 rounded overflow-hidden shadow-sm hover:shadow-md transition border border-neutral-100">
      <div className="block relative aspect-[3/4]  overflow-hidden   bg-gray-100 group">
        {!outOfStock && 
          ( <div
              className={`absolute inset-0 flex flex-col bg-black/5 backdrop-blur-sm justify-between z-10 transition-opacity duration-300 
                ${isMobile ? (showActions ? "opacity-100" : "opacity-0") : "opacity-0 group-hover:opacity-100"}
              `}
              onClick={(e) => {
                if (isMobile) {
                  e.stopPropagation();
                  if (cartStep === "idle") setShowActions(!showActions);
                }
              }}
            >
            <div className="text-left p-2">
              <Link href={url} >
                <OpenInNewIcon className="text-[34px] text-neutral-50 bg-primary rounded" />
              </Link>
            </div>
            <div className={`flex justify-between h-[13%] relative z-20 transition duration-300
              ${isMobile
                ? showActions
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
                : "translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100"}
              `}
            >
              { isAdding
                ? 
                <button
                  onClick={isAdded ? handleRemove : handleAdd}
                  disabled={isAdding}
                  className={`flex items-center justify-center w-4/5 h-full transition bg-primary text-neutral-50`}
                >
                  <ClipLoader color="#ffffff" size={16} />
                </button> 
                : isAdded ?
                  <button
                    onClick={isAdded ? handleRemove : handleAdd}
                    disabled={isAdding}
                    className={`flex items-center justify-center w-4/5 h-full transition bg-accent text-neutral-50 animate-slideUpFade`}
                  >
                    <Trash size={20} />
                  </button> 
                : <div 
                  className="w-4/5 h-full bg-primary text-neutral-50 flex items-center justify-center relative overflow-hidden"
                  onMouseEnter={() => cartStep === "idle" && !isMobile && setCartStep("size")}
                  onMouseLeave={() => setTimeout(() => setCartStep("idle"), 300)}
                  onClick={(e) => {cartStep === "idle" && isMobile && setCartStep("size"); e.stopPropagation()}}
                >
                  {cartStep === 'idle' && (<ShoppingCart size={20} />)}
                  {cartStep === 'size' && (
                    <div 
                      className={`absolute inset-0  flex gap-2 justify-center items-center bg-neutral-600  animate-slideUpFade
                      `}
                    >
                      {availableSizes.map((size) => {
                        const out = !isSizeInStock(size, selectedColor);
                        return (
                          <button
                            key={size}
                            disabled={out}
                            onClick={() => {
                              setSelectedSize(size);
                              setCartStep("color");
                            }}
                            className={`px-2 py-1 text-xs rounded border ${
                              selectedSize === size ? "bg-white text-black" : "bg-black text-white"
                            } ${out ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:text-black"}`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {cartStep === 'color' && (
                    <div className="absolute inset-0 flex gap-2 justify-center items-center bg-black/90  animate-slideUpFade">
                      {availableColors.map((color) => {
                        const out = !isSizeInStock(selectedSize, color);
                        return (
                          <button
                            key={color}
                            disabled={out}
                            onClick={() => {
                              setSelectedColor(color);
                              setCartStep("idle");
                              isAdded ? handleRemove() : handleAdd();
                            }}
                            className={`px-2 py-1 text-xs rounded border ${
                              selectedColor === color ? "bg-white text-black" : "bg-black text-white"
                            } ${out ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:text-black"}`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                </div>
              }
               <button
                onClick={handleWishlistClick}
                disabled={wishlistLoading}
                className={`flex items-center justify-center w-1/5 bg-neutral-100 hover:bg-neutral-200 transition ${
                  inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }
                ${wishlistLoading ? "text-red-500" : ""}`}
                title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                { wishlistLoading ? (
                  <ClipLoader
                    color="#000000"
                    loading={wishlistLoading}
                    size={16}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : inWishlist ? (
                    <FavoriteIcon size={20} />
                ) : (
                    <FavoriteBorderIcon size={20} />
                )}
              </button>
              {showModal && <SignInModal onClose={() => setShowModal(false)} />}
            </div>
          </div>)
        }
        <Image
          src={product.images?.[0]}
          alt={product.title}
          width={400}
          height={600}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        { !outOfStock && promotionLabel && (
          <div dir="ltr" className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded shadow-md z-10">
            {promotionLabel}
          </div>
        )}

        {outOfStock && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded shadow-md z-10">
            مَبِيع
          </div>
        )}
      </div>



      <Link href={url} className=" flex justify-between p-3">
        <h3 className="text-sm font-semibold truncate text-gray-800">{product.title}</h3>
        {!outOfStock && (
          discountedPrice ? (
            <div className="text-md flex gap-2" dir="ltr">
              <p className="text-accent font-bold ml-1"> {discountedPrice} LE</p>
              <span className="line-through text-gray-500"> {price} LE</span>
            </div>
          ) : (
            <div  dir="ltr" className="text-sm font-bold text-gray-700">{price} LE</div>
          )
        )}
      </Link>

      
    </div>
  );
}
