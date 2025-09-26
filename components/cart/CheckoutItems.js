import React, { useContext } from 'react'
import Image from "next/image";
import { CartContext } from '@/contexts/CartContext';

export default function CheckoutItems({ products }) {
  const { cart } = useContext(CartContext);

  return (
    <>
      {cart.map(cartItem => {
        const variants = products.find(p => p._id === cartItem._id)?.variants || [];
        const stock = variants.find(v => v.size === cartItem.selectedSize && v.color === cartItem.selectedColor)?.stock || 0;
        const description = products.find(p => p._id === cartItem._id)?.description || '';
        const images = cartItem.images || products.find(p => p._id === cartItem._id)?.images || [];
        const productId = cartItem.productId || cartItem._id;
        return (
          <div
            key={productId + cartItem.selectedColor + cartItem.selectedSize}
            className="flex gap-5 items-center"
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
              <p className="text-lg font-bold text-gray-700">
                {cartItem.price} L.E
              </p>

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
            </div>
          </div>
        );
      })}
    </>
  );
}
