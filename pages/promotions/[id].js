import { useContext, useEffect, useState } from "react";
import { PromotionDisplayContext } from "@/contexts/PromotionDisplayContext";
import ProductBox from "@/components/ProductBox";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "@/components/Header";
import { ClipLoader } from "react-spinners";

export default function PromotionPage() {
    const { promotions } = useContext(PromotionDisplayContext);
    const router = useRouter();
    const { id } = router.query;
    const [ products, setProducts ] = useState([]);
    const [loading, setLoading] = useState(true);
    const promotion = promotions.find(p => p._id === id);
    useEffect(() => {
        axios.get("/api/products").then(res => {
            setProducts(res.data);
            setLoading(false);
        })
    }, [])

    if (!promotion) return null;

    const appliesToProductIds = new Set(promotion.products.map(p => p.toString()));
    const appliesToCategoryIds = new Set(promotion.categories.map(c => c.toString()));

    const eligibleProducts = products.filter(product => {
        if (promotion.appliesTo === 'all') return true;
        if (promotion.appliesTo === 'products') return appliesToProductIds.has(product._id.toString());
        if (promotion.appliesTo === 'categories') return appliesToCategoryIds.has(product.category) || appliesToCategoryIds.has(product.parentCategory);
        return false;
    });

    return (
        <>
            <Header />
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-4">{promotion.title}</h1>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> */}
                    {loading ? (
                        <ClipLoader color="red" size={40} />
                    ) : eligibleProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {eligibleProducts.map(product => (
                                <div key={product._id}>
                                    <ProductBox {...product} />
                                </div>
                            ))}
                        </div>
                        ) : (
                        <p className="text-center py-10">No products found for this promotion.</p>
                    )}
                {/* </div> */}
            </div>
        </>
    )
}