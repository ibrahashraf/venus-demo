export default function computePromotionProgress(promo, cart, productMap) {
    if (!['minSubtotal', 'minQuantity'].includes(promo.promotionType)) return null;
    if (!promo.isActive) return null;
    if (promo.requiresCode) return null;

    let matchedSubtotal = 0;
    let matchedQuantity = 0;

    for (const item of cart) {
        const product = productMap[item.productId || item._id];
        if (!product) continue;

        const matches = promo.appliesTo === 'all' ||
            (promo.appliesTo === 'products' && promo.products?.some(id => id.toString() === product._id.toString())) ||
            (promo.appliesTo === 'categories' && (
                promo.categories?.some(category => category.toString() === product.category?.toString()) ||
                promo.categories?.some(category => category.toString() === product.parentCategory?.toString())
            ));

        if (!matches) continue; 

        matchedSubtotal += (item.price || 0) * item.quantity;
        matchedQuantity += item.quantity;
    }

    if (matchedSubtotal === 0 && matchedQuantity === 0) return null;

    if (promo.promotionType === 'minSubtotal') {
        if (matchedSubtotal >= (promo.minSubtotal || 0)) {
            return null;
        }
        const remaining = Math.max(0, (promo.minSubtotal || 0) - matchedSubtotal);
        return {
            promotionId: promo._id,
            title: promo.title || "",
            promotionType: promo.promotionType,
            minSubtotal: promo.minSubtotal || 0,
            remainingSubtotal: Math.round(remaining),
        };
    }

    if (promo.promotionType === 'minQuantity') {
        if (matchedQuantity >= (promo.minQuantity || 0)) {
            return null;
        }
        const remaining = Math.max(0, (promo.minQuantity || 0) - matchedQuantity);
        return {
            promotionId: promo._id,
            title: promo.title || "",
            promotionType: promo.promotionType,
            minQuantity: promo.minQuantity || 0,
            remainingQuantity: remaining,
        };
    }

    return null;
}
