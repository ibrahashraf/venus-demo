import React, { useContext, useState } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from "next/image";
import Link from "next/link";
import { CartContext } from '@/contexts/CartContext';
import { PuffLoader } from 'react-spinners';
import { PromotionDisplayContext } from '@/contexts/PromotionDisplayContext';

export default function CartItems({ products }) {
  const { cart, increaseQuantity, decreaseQuantity, removeProduct } = useContext(CartContext);
  const { getDiscountedPrice } = useContext(PromotionDisplayContext);
  const [loadingKey, setLoadingKey] = useState(null);


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
      {cart.map(cartItem => {
        const variants = products.find(p => p._id === cartItem._id)?.variants || [];
        const discountedPrice = getDiscountedPrice(products.find(p => p._id === cartItem._id), variants.find(v => v.size === cartItem.selectedSize && v.color === cartItem.selectedColor));
        const compareAtPrice = variants.find(v => v.size === cartItem.selectedSize && v.color === cartItem.selectedColor)?.compareAtPrice || 0;
        const description = products.find(p => p._id === cartItem._id)?.description || '';
        const stock = variants.find(v => v.size === cartItem.selectedSize && v.color === cartItem.selectedColor)?.stock || 0;
        const images = cartItem.images || products.find(p => p._id === cartItem._id)?.images || [];
        const productId = cartItem.productId || cartItem._id;
        return (
          <div
            key={productId + cartItem.selectedColor + cartItem.selectedSize}
            className="flex gap-5 items-center h-48 w-full"
          >
            <div className='relative h-48 aspect-[3/4]'>
              <Image
                alt={description}
                src={images?.[0]}
                fill
                className="rounded-sm object-cover"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex items-center gap-2">
                <p className="font-light text-2xl">{cartItem.title}</p>
              </div>
              { compareAtPrice ?
                (
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-accent">
                      {cartItem.price} L.E
                    </p>
                    <p className="text-lg line-through text-gray-700">
                      {compareAtPrice} L.E
                    </p>
                  </div>
                )
                :
                (
                  <p className="text-lg font-bold text-gray-700">
                    {cartItem.price} L.E
                  </p>
                )
              }

              {cartItem.selectedColor && (
                <p className="text-sm text-gray-600">
                  اللون: {cartItem.selectedColor}
                </p>
              )}
              {cartItem.selectedSize && (
                <p className="text-sm text-gray-600">
                  المقاس: {cartItem.selectedSize}
                </p>
              )}

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border rounded-md overflow-hidden h-8">
                  <button
                    className="w-7 flex items-center justify-center h-full bg-gray-200 hover:bg-gray-300"
                    onClick={() => handleDecrease(productId, cartItem.selectedColor, cartItem.selectedSize, cartItem.quantity)}
                    disabled={loadingKey === `${productId}-${cartItem.selectedColor}-${cartItem.selectedSize}-dec`}
                  >
                    {loadingKey === `${productId}-${cartItem.selectedColor}-${cartItem.selectedSize}-dec`
                      ? <PuffLoader color="#111111" size={23} />
                      : cartItem.quantity > 1 ? '-' : <DeleteIcon fontSize="small" />
                    }
                  </button>
                  <span className="px-4">{cartItem.quantity || 1}</span>
                  <button
                    className="w-7 flex items-center justify-center h-full bg-gray-200 hover:bg-gray-300"
                    onClick={() => handleIncrease(productId, cartItem.selectedColor, cartItem.selectedSize, stock, cartItem.quantity)}
                    disabled={loadingKey === `${productId}-${cartItem.selectedColor}-${cartItem.selectedSize}-inc` || cartItem.quantity === stock}
                  >
                    {loadingKey === `${productId}-${cartItem.selectedColor}-${cartItem.selectedSize}-inc`
                      ? <PuffLoader color="#111111" size={23} />
                      : '+'}
                  </button>
                </div>
              </div>

              <Link href={`/product/${productId}`} className="text-blue-500 hover:text-blue-700 mt-2 inline-flex items-center gap-1">
                <OpenInNewIcon fontSize="small" />
                عرض المنتج
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}
