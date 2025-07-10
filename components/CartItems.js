import React, { useContext } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Image from "next/image";
import Link from "next/link";
import { CartContext } from '@/contexts/CartContext';

export default function CartItems({ products }) {
  const { cart, removeProduct, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  return (
    <>
      {cart.map(cartItem => {
        const variants = products.find(p => p._id === cartItem._id)?.variants || [];
        const stock = variants.find(v => v.size === cartItem.selectedSize && v.color === cartItem.selectedColor)?.stock || 0;
        const images = cartItem.images || products.find(p => p._id === cartItem._id)?.images || [];
        const productId = cartItem.productId || cartItem._id;
        const isFree = cartItem.isFree;
        console.log(cartItem);
        return (
          <div
            key={productId + cartItem.selectedColor + cartItem.selectedSize}
            className="flex gap-5 items-center p-4 bg-gray-50 rounded-md hover:shadow-md transition"
          >
            <Image
              alt={cartItem.title}
              src={images?.[0]}
              width={60}
              height={60}
              className="rounded-md object-cover"
            />
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{cartItem.title}</p>
                {isFree && (
                  <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    🎁 Free Gift
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-700">
                {cartItem.price} L.E
              </p>

              {!isFree && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                      onClick={() => decreaseQuantity(productId, cartItem.selectedColor, cartItem.selectedSize, stock)}
                    >
                      −
                    </button>
                    <span className="px-4">{cartItem.quantity || 1}</span>
                    <button
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                      onClick={() => increaseQuantity(productId, cartItem.selectedColor, cartItem.selectedSize, stock)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeProduct(productId, cartItem.selectedColor, cartItem.selectedSize)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteForeverIcon />
                  </button>
                </div>
              )}

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
