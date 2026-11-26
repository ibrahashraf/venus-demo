import Image from "next/image";
import Link from "next/link";

export default function ProductBox(product) {
  const url = "/product/" + product._id;

  const firstVariant = product.variants[0];
  const price = firstVariant?.price || 0;
  const compareAtPrice = firstVariant?.compareAtPrice || null;
  const size = firstVariant?.size || null;

  return (
    <Link
      href={url}
      className="block bg-neutral-50 rounded overflow-hidden aspect-[2/3] shadow-sm hover:shadow-md transition"
    >
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <Image
          src={product.images?.[0]}
          alt={product.title}
          width={400}
          height={600}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
          {size}
        </div>
      </div>

      <div className="p-3 flex justify-between">
        <h3 className="text-sm max-w-[45%] font-semibold truncate text-gray-800">
          {product.title}
        </h3>

        {compareAtPrice ? (
          <div className="text-sm flex gap-2" dir="ltr">
            <p className="text-accent font-bold ml-1">{price} EGP</p>
            <span className="line-through text-gray-500">{compareAtPrice} EGP</span>
          </div>
        ) : (
          <div dir="ltr" className="text-sm font-bold text-gray-700">
            {price} EGP
          </div>
        )}
      </div>
    </Link>
  );
}
