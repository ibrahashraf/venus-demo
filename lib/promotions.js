function checkIfAppliesToCart(promo, cart, productMap) {
    if ( promo.appliesTo === 'all') return true;
    for ( const item of cart) {
        const product = productMap[item.productId || item._id];
        if (!product) continue;
        if( 
            (promo.appliesTo === 'products' && promo.products?.some(id => id.toString() === product._id.toString())) ||
            (promo.appliesTo === 'categories' && (
                promo.categories?.includes(product.category?.toString()) ||
                promo.categories?.includes(product.parentCategory?.toString())
            ))
        ) {
            return true;
        }
    }
    return false;
}

function calculateDiscount(promo, cart, productMap) {
    let discount = 0;

    const subTotal = cart.reduce((sum, item) => {
        const price = item.price;
        return sum + (price || 0) * item.quantity;
    }, 0);

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    for (const item of cart) {
        const product = productMap[item.productId || item._id];
        if (!product) continue;

        const matches = promo.appliesTo === 'all' ||
            (promo.appliesTo === 'products' && promo.products?.some(id => id.toString() === product._id.toString())) ||
            (promo.appliesTo === 'categories' && (
                promo.categories?.includes(product.category?.toString()) ||
                promo.categories?.includes(product.parentCategory?.toString())
            ));
        if (!matches) continue;

        const price = item.price;

        if (promo.promotionType === 'auto') {
            discount += applySingleDiscount(promo, price * item.quantity);
        }

        if (promo.promotionType === 'minSubtotal' && subTotal >= promo.minSubtotal) {
            discount += applySingleDiscount(promo, price * item.quantity);
        }

        if (promo.promotionType === 'minQuantity' && totalQty >= promo.minQuantity) {
            discount += applySingleDiscount(promo, price * item.quantity);
        }
    }

    return Math.round(discount);
}


function applySingleDiscount(promo, amount) {
    if (promo.discountType === 'percentage') {
        return amount * (promo.discountValue / 100);
    }
    if (promo.discountType === 'fixed') {
        return Math.min(amount, promo.discountValue)
    }
    return 0;
}

export { checkIfAppliesToCart, calculateDiscount };