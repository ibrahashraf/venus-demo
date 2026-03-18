import { createContext, useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import axiosClient from "@/lib/axiosClient";
 
export const PromotionContext = createContext({
    discounts: [],
    appliedPromotions: [],
    promotionProgress: [],
});

export function PromotionContextProvider({ children }) {
    const { cart } = useContext(CartContext);
    const [discounts, setDiscounts] = useState([]);
    const [appliedPromotions, setAppliedPromotions] = useState([]);
    const [promotionProgress, setPromotionProgress] = useState([]);

    // NEW: coupon state & summary
    const [code, setCode] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!cart || cart.length === 0) {
            setDiscounts([]);
            setAppliedPromotions([]);
            setPromotionProgress([]);
            setAppliedCoupon(null);
            setCouponDiscount(0);
            setCouponError(null);
            return;
        }

        const payload = {
            cart: cart.map(item => ({
                productId: item.product?._id || item._id || item.productId,
                price: item.price,
                quantity: item.quantity,
            }))
        };

        const applyPromotions = async () => {
            setLoading(true);
            setError(null);
            try {
                // If a coupon code is active, call applycode so the code gets priority
                if (code) {
                    const { data } = await axiosClient.post("/api/promotions/applycode", { ...payload, code }, { skipRedirect: true });
                    // handle response shape
                    const discountsRes = Array.isArray(data.discounts) ? data.discounts : [];
                    setDiscounts(discountsRes);
                    if (Array.isArray(data.appliedPromotions) && data.appliedPromotions.length > 0) {
                        setAppliedPromotions(data.appliedPromotions);
                    } 
                    else if (data.appliedCoupon) {
                        setAppliedPromotions([data.appliedCoupon]);
                    } else {
                        setAppliedPromotions([]);
                    }
                    setPromotionProgress(Array.isArray(data.promotionProgress) ? data.promotionProgress : []);
                    setAppliedCoupon(data.appliedCoupon || null);
                    setCouponDiscount(Number(data.couponDiscount || 0));
                    setCouponError(null);
                } else {
                    // no coupon — call regular apply
                    const { data } = await axiosClient.post("/api/promotions/apply", payload, { skipRedirect: true });
                    setDiscounts(Array.isArray(data.discounts) ? data.discounts : []);
                    setAppliedPromotions(Array.isArray(data.appliedPromotions) ? data.appliedPromotions : []);
                    setPromotionProgress(Array.isArray(data.promotionProgress) ? data.promotionProgress : []);
                    setAppliedCoupon(null);
                    setCouponDiscount(0);
                }
            } catch (err) {
                console.error(" Error applying promotions:", err);
                // on error clear promotion info to avoid stale positive discounts
                setDiscounts([]);
                setAppliedPromotions([]);
                setPromotionProgress([]);
                setAppliedCoupon(null);
                setCouponDiscount(0);

                if (code) {
                    const serverMsg = err?.response?.data?.error || err?.message || "Failed to apply coupon";
                    setCouponError(serverMsg);
                } else {
                    setError(err.response?.data?.error || err.message || "Failed to apply promotions");
                }
            } finally {
                setLoading(false);
            }
        };

        applyPromotions();
    }, [cart, code]); // <-- runs when cart or code changes

    // Minimal helper functions to control coupon from UI (exposed below)
    async function applyCode(newCode) {
        if (!newCode) return { success: false, error: "Please enter a coupon code" };
        const normalized = String(newCode).trim().toUpperCase();
        setCouponError(null);
        setCode(normalized);
        try {
            setLoading(true);
            const payload = {
                cart: cart.map(item => ({
                    productId: item.product?._id || item._id || item.productId,
                    price: item.price,
                    quantity: item.quantity,
                })),
                code: normalized,
            };
            const { data } = await axiosClient.post("/api/promotions/applycode", payload, { skipRedirect: true });
            // update state synchronously to ensure UI updates fast
            const discountsRes = Array.isArray(data.discounts) ? data.discounts : [];
            setDiscounts(discountsRes);
            if (Array.isArray(data.appliedPromotions) && data.appliedPromotions.length > 0) {
                setAppliedPromotions(data.appliedPromotions);
            } else if (data.appliedCoupon) {
                setAppliedPromotions([data.appliedCoupon]);
            } else {
                setAppliedPromotions([]);
            }
            setPromotionProgress(Array.isArray(data.promotionProgress) ? data.promotionProgress : []);
            setAppliedCoupon(data.appliedCoupon || null);
            setCouponDiscount(Number(data.couponDiscount || 0));
            setCouponError(null);
            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            const serverMsg = err?.response?.data?.error || err?.message || "Failed to apply coupon";
            setCouponError(serverMsg);
            // keep code state so user can retry or remove
            setCode(String(newCode).trim().toUpperCase());
            return { success: false, error: serverMsg };
        }
        // effect will pick it up and call applycode
        // optionally we can optimistically set loading here, but effect will handle it
    }

    async function removeCode() {
        // clear code and re-run apply (effect will run)
        setCode(null);
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponError(null);
    }

    return (
        <PromotionContext.Provider 
            value={{ 
                discounts,
                appliedPromotions,
                promotionProgress,
                // coupon helpers & state
                code,
                applyCode,
                removeCode,
                appliedCoupon,
                couponDiscount,
                couponError,
                loading,
                error,
            }}
        >
            {children}
        </PromotionContext.Provider>
    );
}
