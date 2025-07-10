import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const PromotionDisplayContext = createContext({
    promotions: [],
    loading: true,
    getPromotionLabel: () => {},
    getDiscountedPrice: () => {},
    getPromotionForProduct: () => {},
    getBOGODetails: async () => null,
});

export function PromotionDisplayContextProvider({ children }) {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
        try {
            const { data } = await axios.get('/api/promotions');
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

        if (!promo.isActive || promo.requiresCode || !startsOk || !endsOk) return false;


        const applies = promo.appliesTo === 'all' ||
            promo.products?.some(id => id.toString() === product._id?.toString()) ||
            promo.categories?.includes(product.category) ||
            promo.categories?.includes(product.parentCategory);

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
        return ` ${promotion.discountValue}  ${promotion.discountType === 'percentage' ? '%' : ' EGP'} off`;
        }
        return null;
    };

    const getBOGODetails = async () => {
        try {
        const now = new Date();

        const bogoPromo = promotions.find(p =>
            p.promotionType === 'bogo' &&
            p.isActive &&
            (!p.startsAt || new Date(p.startsAt) <= now) &&
            (!p.endsAt || new Date(p.endsAt) >= now)
        );

        if (!bogoPromo) return null;

        const { data: allProducts } = await axios.get('/api/products');
        const buyProducts = allProducts.filter(p =>
            bogoPromo.buyProducts.some(id => id.toString() === p._id.toString())
        );
        const getProducts = allProducts.filter(p =>
            bogoPromo.getProducts.some(id => id.toString() === p._id.toString())
        );

        const isBuyStockValid = buyProducts.some(p =>
            p.variants?.some(v => v.stock > 0)
        );
        const isGetStockValid = getProducts.some(p =>
            p.variants?.some(v => v.stock > 0)
        );

        if (!isBuyStockValid || !isGetStockValid) return null;

        return {
            promo: bogoPromo,
            buyProducts,
            getProducts,
        };
        } catch (error) {
        console.error("Error fetching BOGO details", error);
        return null;
        }
    };

    return (
        <PromotionDisplayContext.Provider
            value={{
                promotions,
                loading,
                getPromotionLabel,
                getDiscountedPrice,
                getPromotionForProduct,
                getBOGODetails,
            }}
        >
            {children}
        </PromotionDisplayContext.Provider>
    );
}
