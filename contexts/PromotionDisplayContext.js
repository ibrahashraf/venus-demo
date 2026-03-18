import { createContext, useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";

export const PromotionDisplayContext = createContext({
    promotions: [],
    loading: true,
    getPromotionLabel: () => {},
    getDiscountedPrice: () => {},
    getPromotionForProduct: () => {},
    getBannerPromotion: () => {},
});

export function PromotionDisplayContextProvider({ children }) {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        const fetchPromotions = async () => {
        try {
            const { data } = await axiosClient.get('/api/promotions', {skipRedirect: true});
            const now = new Date();

            const validPromotions = data.filter(promo => {
                const startsOk = !promo.startsAt || new Date(promo.startsAt) <= now;
                const endsOk = !promo.endsAt || new Date(promo.endsAt) >= now;
                return promo.isActive && startsOk && endsOk;
            });

            setPromotions(validPromotions);
        } catch (error) {
            console.error("Error fetching promotions", error);
        } finally {
            setLoading(false);
        }
        };

        fetchPromotions();
    }, []);

    const getPromotionForProduct = (product) => {
        const now = new Date();

        return promotions.find(promo => {
            const startsOk = !promo.startsAt || new Date(promo.startsAt) <= now;
            const endsOk = !promo.endsAt || new Date(promo.endsAt) >= now;
            const auto = promo.promotionType === "auto";

            if (!promo.isActive || promo.requiresCode || !startsOk || !endsOk || !auto) return false;


            const applies =
                (promo.appliesTo === "products" && Array.isArray(promo.products) && promo.products.map(String).includes(String(product._id))) ||
                (promo.appliesTo === "categories" &&
                    Array.isArray(promo.categories) &&
                    (promo.categories.map(String).includes(String(product.category)) ||
                        promo.categories.map(String).includes(String(product.parentCategory))))
                ||  promo.appliesTo === "all" ;
            return applies;
        });
    };

    const getDiscountedPrice = (product, variant) => {
        if (!variant?.price) return null;
        const promotion = getPromotionForProduct(product);
        if (!promotion || promotion.promotionType !== 'auto') return null;
        const price = variant.price;

        if (promotion.discountType === 'percentage') {
            return Math.round(price - price * (promotion.discountValue / 100));
        }
        if (promotion.discountType === 'fixed') {
            return Math.max(0, price - promotion.discountValue);
        }
        return null;
    };

    const getPromotionLabel = (product) => {
        const promotion = getPromotionForProduct(product);
        if (!promotion) return null;
        if (promotion.promotionType === 'auto') {
        return ` ${promotion.discountValue}  ${promotion.discountType === 'percentage' ? '%' : ' USD'} off`;
        }
        return null;
    };

    const getBannerPromotion = () => {
        return promotions.find(promo => {
            if (!promo.isActive || promo.requiresCode) return false;
            if (promo.showOnHome === true) return true;
            return false;
        }) || null;
    }

    return (
        <PromotionDisplayContext.Provider
            value={{
                promotions,
                loading,
                getPromotionLabel,
                getDiscountedPrice,
                getPromotionForProduct,
                getBannerPromotion,
            }}
        >
            {children}
        </PromotionDisplayContext.Provider>
    );
}
