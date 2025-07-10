import { useContext } from "react";
import { PromotionDisplayContext } from "@/contexts/PromotionDisplayContext";
import ProductBox from "./ProductBox";
import Link from "next/link";

export default function PromoTeaserSection({ products }) {
  const { promotions } = useContext(PromotionDisplayContext);

  const promo = promotions.find(p =>
    ['minSubtotal', 'minQuantity'].includes(p.promotionType) &&
    p.isActive && !p.requiresCode
  );

  if (!promo) return null;

  const appliesToProductIds = new Set(
    promo.products?.map(p => p.toString()) || []
  );
  const appliesToCategoryIds = new Set(
    promo.categories?.map(c => c.toString()) || []
  );

  const eligibleProducts = products.filter(product => {
    if (promo.appliesTo === 'all') return true;
    if (promo.appliesTo === 'products') return appliesToProductIds.has(product._id);
    if (promo.appliesTo === 'categories') {
      return appliesToCategoryIds.has(product.category) || appliesToCategoryIds.has(product.parentCategory);
    }
    return false;
  });

  const headline =
    promo.promotionType === 'minSubtotal'
      ? `🛒 Spend ${promo.minSubtotal} EGP and get ${promo.discountValue}${promo.discountType === 'percentage' ? '%' : ' EGP'} off`
      : `📦 Buy ${promo.minQuantity} items and get ${promo.discountValue}${promo.discountType === 'percentage' ? '%' : ' EGP'} off`;

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-4">{headline}</h2>
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-4">
        {eligibleProducts.slice(0, 4).map(product => (
            <div
              key={product._id}
              className="bg-transparent p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate__animated animate__fadeIn animate__delay-1s"
            >
                <ProductBox {...product} />
            </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <Link
          href={`/promotions/${promo._id}`}
          className="text-blue-600 font-medium hover:underline"
        >
          View all eligible items →
        </Link>
      </div>
    </section>
  );
}
