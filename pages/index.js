import BOGOHeroBanner from "@/components/BOGOHeroBanner";
import Featured from "@/components/Featured";
import Header from "@/components/Header";
import LatestProducts from "@/components/LatestProducts";
import PromoTeaserSection from "@/components/PromoTeaserSection";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function Home({ featuredProduct, latestProducts, allProducts }) {
  return (
    <div>
      <Header />
      <Featured featuredProduct={featuredProduct} />
      <PromoTeaserSection products={allProducts}/>
      <BOGOHeroBanner  />
      <LatestProducts latestProducts={latestProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredProductId = "68068dcddd84e59882523ca6";
  await mongooseConnect();

  const featuredProduct = await Product.findById(featuredProductId);
  const allProducts = await Product.find({}, null, {
    sort: { createdAt: -1 },
  });

  const inStockProducts = allProducts.filter(product =>
    product.variants?.some(variant => variant.stock > 0)
  ).slice(0, 8);

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      latestProducts: JSON.parse(JSON.stringify(inStockProducts)),
      allProducts: JSON.parse(JSON.stringify(allProducts)),
    },
  };
}
