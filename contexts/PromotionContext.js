import { createContext, useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";

export const PromotionContext = createContext({
    discounts: [],
    bogoFreeItems: [],
    appliedPromotions: [],
});

export function PromotionContextProvider({ children }) {
    const { cart, setCart } = useContext(CartContext);
    const [ bogoFreeItems, setBogoFreeItems ] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [appliedPromotions, setAppliedPromotions] = useState([]);


    
    
    useEffect(() => {

        if (!cart || cart.length === 0) {
            setDiscounts([]);
            setBogoFreeItems([]);
            setAppliedPromotions([]);
            return;
        }

        const applyPromotions = async () => {
            console.log("⚙️ Running applyPromotions based on updated cart...");
            try {
                const { data } = await axios.post("/api/promotions/apply", {
                    cart: cart.map(item => ({
                        productId: item.product?._id || item._id || item.productId,
                        price: item.price,
                        quantity: item.quantity,
                    }))
                });

                const { discounts = [], freeItems = [], appliedPromotions = [] } = data;

                setDiscounts(discounts);
                setBogoFreeItems(freeItems); // Can be used for display if needed
                setAppliedPromotions(appliedPromotions);

                console.log("✅ Applied promotions:", appliedPromotions);
                console.log("🎁 Free items calculated:", freeItems);
                console.log("💸 Discounts:", discounts);

            } catch (error) {
                console.error("❌ Error applying promotions:", error);
            }
        };

        applyPromotions();
    }, [cart]);

    useEffect(() => {
        if (!cart || cart.length === 0) return;

        const cleanUpInvalidFreeGifts = () => {
            const newCart = [...cart];
            let changed = false;

            for (const promo of appliedPromotions.filter(p => p.promotionType === 'bogo')) {
            const buyProductIds = promo.buyProducts.map(id => id.toString());
            const totalBuyQty = cart.reduce((sum, item) => {
                const pid = (item.product?._id || item._id || item.productId)?.toString();
                return item.isFree ? sum : buyProductIds.includes(pid) ? sum + item.quantity : sum;
            }, 0);

            const stillEligible = totalBuyQty >= promo.buyQty;

            if (!stillEligible) {
                const before = newCart.length;
                // remove free items tied to this promo
                for (let i = newCart.length - 1; i >= 0; i--) {
                const item = newCart[i];
                if (item.isFree && item.promotionId?.toString() === promo._id.toString()) {
                    newCart.splice(i, 1);
                }
                }
                if (newCart.length !== before) {
                changed = true;
                }
            }
            }

            if (changed) {
            // Call your `replaceCart(newCart)` or update CartContext directly
            setCart(newCart); // <-- make sure CartContext supports this function
            }
        };

        cleanUpInvalidFreeGifts();
    }, [cart, appliedPromotions]);






    return (
        <PromotionContext.Provider 
            value={{ 
                discounts,
                bogoFreeItems,
                appliedPromotions,
            }}
        >
            {children}
        </PromotionContext.Provider>
    );
}
