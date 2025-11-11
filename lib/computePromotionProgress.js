export default function computePromotionProgress(promo, cart, productMap) {
  if (!['minSubtotal', 'minQuantity'].includes(promo.promotionType)) return null;
  if (!promo.isActive || promo.requiresCode) return null;

  const cartSubtotal = cart.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);
  const cartQty = cart.reduce((s, it) => s + it.quantity, 0);

  if (promo.promotionType === 'minSubtotal') {
    if (cartSubtotal >= (promo.minSubtotal || 0)) return null;
    const remaining = Math.max(0, (promo.minSubtotal || 0) - cartSubtotal);
    return {
      promotionId: promo._id,
      title: promo.title || "",
      promotionType: promo.promotionType,
      minSubtotal: promo.minSubtotal || 0,
      remainingSubtotal: Math.round(remaining),
    };
  }

  if (promo.promotionType === 'minQuantity') {
    if (cartQty >= (promo.minQuantity || 0)) return null;
    const remaining = Math.max(0, (promo.minQuantity || 0) - cartQty);
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
