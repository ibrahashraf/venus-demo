import { checkIfAppliesToCart, calculateDiscount } from "@/lib/promotions";

export function applyPromotions(cart, productMap, promotions) {
    const freeItems = [];
    const appliedPromotions = [];

    const subTotal = cart.reduce((sum, item) => {
        const price = item.price;
        return sum + (price || 0) * item.quantity;
    }, 0);

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    let bestDiscount = null;
    let bestPromotion = null;
    for ( const promo of promotions) {
        const type = promo.promotionType;
        if (promo.requiresCode) continue;
        if (type === 'auto' || type === 'minSubtotal' || type === 'minQuantity') {
            const applies = checkIfAppliesToCart(promo, cart, productMap);
            if (!applies) continue;
            const discount = calculateDiscount(promo, cart, productMap);
            if (discount > 0) {
                if (!bestDiscount || discount > bestDiscount.discountAmount) {
                    bestDiscount = {
                        promotionId: promo._id,
                        type,
                        discountAmount: discount,
                    };
                    bestPromotion = promo;
                }
            }
        }
        if (type === 'bogo') {
            const buyIds = promo.buyProducts.map(id => id.toString());
            const matchingQty = cart.reduce((sum, item) => (
                buyIds.includes(item.productId || item._id) ? sum + item.quantity : sum
            ), 0);
            const times = Math.floor(matchingQty / promo.buyQty);
            if ( times > 0) {
                for (let i = 0; i < times * promo.getQty; i++) {
                    promo.getProducts.forEach(getId => {
                        freeItems.push({
                            productId: getId.toString(),
                            promotionId: promo._id,
                            quantity: 1,
                            isFree: true,
                        });
                    });
                }
                appliedPromotions.push(promo);
            }
        }
    }
    const discounts = bestDiscount ? [bestDiscount] : [];
    if (bestPromotion) {
        appliedPromotions.push(bestPromotion);
    }

    return { discounts, freeItems, appliedPromotions };
}
