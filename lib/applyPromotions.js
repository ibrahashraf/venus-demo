// lib/applyPromotions.js
import computePromotionProgress from "./computePromotionProgress";

/**
 * Helper: shallow clone promotion objects so we can attach computed fields
 */
function clonePromotions(promotions) {
  return promotions.map((p) => ({ ...p }));
}

/**
 * applySingleDiscount(promo, amount, quantity = 1)
 *
 * - amount is the line total (price * quantity)
 * - quantity is the line quantity (used when fixed discount is "per-item")
 *
 * Behavior:
 * - percentage: amount * (value/100)
 * - fixed:
 *    - if quantity provided and promo is considered per-item (the caller decides),
 *      fixed discount is interpreted as fixed-per-item and we multiply by quantity.
 *    - clamp to the line amount
 */
export function applySingleDiscount(promo, amount, quantity = 1) {
  if (promo.discountType === "percentage") {
    return amount * (Number(promo.discountValue || 0) / 100);
  }
  if (promo.discountType === "fixed") {
    const fixedPerItem = Number(promo.discountValue || 0);
    const totalFixed = fixedPerItem * Number(quantity || 1); // per-item * qty
    return Math.min(amount, totalFixed);
  }
  return 0;
}

export function buildEligibleSets(cart, productMap, promotions) {
  const cloned = clonePromotions(promotions);
  cloned.forEach((p) => {
    p.eligibleIndices = [];
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const productId = String(item.productId || item._id);
      const product = productMap[productId];
      if (!product) continue;

      const appliesToThis =
        p.appliesTo === "all" ||
        (p.appliesTo === "products" && Array.isArray(p.products) && p.products.map(String).includes(productId)) ||
        (p.appliesTo === "categories" &&
          Array.isArray(p.categories) &&
          (p.categories.map(String).includes(String(product.category)) ||
            p.categories.map(String).includes(String(product.parentCategory))));

      if (appliesToThis) p.eligibleIndices.push(i);
    }

    p.eligibleSubtotal = p.eligibleIndices.reduce((s, idx) => {
      const it = cart[idx];
      return s + Number(it.price || 0) * Number(it.quantity || 0);
    }, 0);

    p.eligibleQty = p.eligibleIndices.reduce((s, idx) => s + Number(cart[idx].quantity || 0), 0);

    p.hasEligibleItems = p.eligibleIndices.length > 0;
  });

  return cloned;
}

/**
 * Evaluate trigger conditions for promotions (code check + type triggers)
 * - uses cartSubtotal for minSubtotal thresholds by default (change to eligibleSubtotal if desired)
 */
export function evaluateTriggers(promotions, cartSubtotal, cartTotalQty, codeUpper = null) {
  promotions.forEach((p) => {
    // code requirement check
    if (p.requiresCode) {
      if (!codeUpper || String(p.code).toUpperCase() !== codeUpper) {
        p.triggerOk = false;
        return;
      }
    }

    if (!p.hasEligibleItems) {
      p.triggerOk = false;
      return;
    }

    switch (p.promotionType) {
      case "auto":
        p.triggerOk = true;
        p.timesTriggered = 0;
        break;
      case "minSubtotal":
        p.triggerOk = Number(p.minSubtotal || 0) > 0 && cartSubtotal >= Number(p.minSubtotal || 0);
        // how many full discount units the cart qualifies for
        p.timesTriggered = p.triggerOk ? Math.floor(cartSubtotal / Number(p.minSubtotal || 0)) : 0;
        break;
      case "minQuantity":
        p.triggerOk = Number(p.minQuantity || 0) > 0 && p.eligibleQty >= Number(p.minQuantity || 0);
        p.timesTriggered = p.triggerOk ? Math.floor(p.eligibleQty / Number(p.minQuantity || 0)) : 0;
        break;
      default:
        p.triggerOk = false;
        p.timesTriggered = 0;
    }
  });
}

/**
 * Order promotions into final processing order:
 * 1) matching code promos
 * 2) min-type: products -> categories -> all
 * 3) other (auto) promos: products -> categories -> all
 */
export function orderPromotions(promotions, codeUpper = null) {
  const codePromos = [];
  const minPromosProduct = [];
  const minPromosCategory = [];
  const minPromosAll = [];
  const otherPromosProduct = [];
  const otherPromosCategory = [];
  const otherPromosAll = [];

  promotions.forEach((p) => {
    if (!p.triggerOk) return;
    const isCodeMatch = codeUpper && p.requiresCode && String(p.code).toUpperCase() === codeUpper;
    if (isCodeMatch) {
      codePromos.push(p);
      return;
    }

    const isMinType = p.promotionType === "minSubtotal" || p.promotionType === "minQuantity";
    if (isMinType) {
      if (p.appliesTo === "products") minPromosProduct.push(p);
      else if (p.appliesTo === "categories") minPromosCategory.push(p);
      else minPromosAll.push(p);
      return;
    }

    if (p.appliesTo === "products") otherPromosProduct.push(p);
    else if (p.appliesTo === "categories") otherPromosCategory.push(p);
    else otherPromosAll.push(p);
  });

  return [
    ...codePromos,
    ...minPromosProduct,
    ...minPromosCategory,
    ...minPromosAll,
    ...otherPromosProduct,
    ...otherPromosCategory,
    ...otherPromosAll,
  ];
}

/**
 * Distribute rounding remainder — not used for discrete per-unit allocation,
 * but kept for other promo types.
 */
function adjustRoundingRemainder(discountsMap, eligibleIndices, fixedTotalForPromo) {
  let allocatedSum = eligibleIndices.reduce((s, i) => s + (discountsMap[i]?.discountAmount || 0), 0);
  const diff = Math.round((fixedTotalForPromo - allocatedSum) * 100) / 100;
  if (Math.abs(diff) < 0.005) return;
  let maxIdx = null;
  let maxAmount = -Infinity;
  for (const i of eligibleIndices) {
    if (!discountsMap[i]) continue;
    if (discountsMap[i].discountAmount > maxAmount) {
      maxAmount = discountsMap[i].discountAmount;
      maxIdx = i;
    }
  }
  if (maxIdx !== null) {
    discountsMap[maxIdx].discountAmount = Math.round((discountsMap[maxIdx].discountAmount + diff) * 100) / 100;
  }
}

/**
 * Apply ordered promotions to cart using rules:
 * - code promos first (overrides)
 * - min-type promos override (atomic) previously assigned promos on their eligible items
 * - non-min promos apply only to unassigned indices
 * - each cart index receives at most one promo per unit (discrete allocation treats quantity as units)
 * - fixed min-type promos are allocated as full discount units to item-units up to timesTriggered
 */
export function applyOrderedPromotions(cart, promotionsOrdered) {
  const assigned = {}; // assigned[index] = { promotionId, promotionTitle, discountAmount }
  const discountsMap = {}; // for building result
  const appliedPromotionIds = new Set();

  // helpers
  function unassignIndices(indices) {
    for (const i of indices) {
      if (assigned[i]) {
        delete assigned[i];
        delete discountsMap[i];
      }
    }
  }
  function recomputeAppliedPromotionIds() {
    appliedPromotionIds.clear();
    for (const k of Object.keys(assigned)) {
      const a = assigned[k];
      if (a && a.promotionId) appliedPromotionIds.add(String(a.promotionId));
    }
  }

  // apply a single promo
  function applyPromo(promo) {
    if (!promo.triggerOk) return false;
    const isMinType = promo.promotionType === "minSubtotal" || promo.promotionType === "minQuantity";

    // working copy of eligible indices
    let eligible = promo.eligibleIndices.slice();
    if (eligible.length === 0) return false;

    // min-type: override previous assignments for these indices (atomic)
    if (isMinType) {
      unassignIndices(eligible);
    } else {
      eligible = eligible.filter((i) => !assigned[i]);
    }

    if (eligible.length === 0) return false;

    // prepare line amounts & totalEligibleAmount
    const lineAmounts = eligible.map((i) => {
      const it = cart[i];
      return Number(it.price || 0) * Number(it.quantity || 0);
    });
    const totalEligibleAmount = lineAmounts.reduce((s, v) => s + v, 0);

    // --- DISCRETE per-unit allocation for min-type fixed promos ---
    if (promo.discountType === "fixed" && isMinType) {
      const requested = Number(promo.discountValue || 0);
      const times = Math.max(0, Number(promo.timesTriggered || 0));
      if (times <= 0) return false;

      // Build unit-level list: one entry per product unit (handles quantity)
      const units = []; // { idx, unitPrice }
      for (let k = 0; k < eligible.length; k++) {
        const idx = eligible[k];
        const it = cart[idx];
        const unitPrice = Number(it.price || 0);
        const qty = Math.max(0, Math.floor(Number(it.quantity || 1)));
        for (let q = 0; q < qty; q++) units.push({ idx, unitPrice });
      }

      if (units.length === 0) return false;

      // sort units by unitPrice desc to favor highest-priced item-units
      units.sort((a, b) => b.unitPrice - a.unitPrice);

      const applications = Math.min(times, units.length);

      // allocate applications to units, aggregating per line index
      for (let j = 0; j < applications; j++) {
        const { idx, unitPrice } = units[j];
        const it = cart[idx];
        const take = Math.min(unitPrice, requested); // clamp per-unit discount to unit price
        const discountAmount = Math.round(take * 100) / 100;
        if (!Number.isFinite(discountAmount) || discountAmount <= 0) continue;

        if (!discountsMap[idx]) {
          discountsMap[idx] = {
            cartIndex: idx,
            productId: String(it.productId || it._id),
            promotionId: String(promo._id),
            promotionTitle: promo.title || "",
            discountAmount: 0,
          };
        }
        discountsMap[idx].discountAmount = Math.round((discountsMap[idx].discountAmount + discountAmount) * 100) / 100;
      }

      // reflect into assigned
      for (const i of Object.keys(discountsMap)) {
        const dm = discountsMap[i];
        assigned[i] = {
          promotionId: dm.promotionId,
          promotionTitle: dm.promotionTitle,
          discountAmount: dm.discountAmount,
        };
      }

      recomputeAppliedPromotionIds();
      return true; // done for this promo
    }

    // --- fallback: percentage or non-min fixed per-item behavior (existing logic) ---
    for (let k = 0; k < eligible.length; k++) {
      const i = eligible[k];
      const item = cart[i];
      const productId = String(item.productId || item._id);
      const lineAmount = lineAmounts[k];

      let discountAmount = 0;
      if (promo.discountType === "percentage") {
        discountAmount = lineAmount * (Number(promo.discountValue || 0) / 100);
      } else if (promo.discountType === "fixed") {
        // automatic (non-min) promos: fixed is treated as per-item amount,
        // multiplied by quantity.
        const fixedPerItem = Number(promo.discountValue || 0);
        const qty = Number(item.quantity || 1);
        discountAmount = Math.min(lineAmount, fixedPerItem * qty);
      }

      if (!Number.isFinite(discountAmount) || discountAmount <= 0) continue;
      discountAmount = Math.min(lineAmount, discountAmount);
      discountAmount = Math.round(discountAmount * 100) / 100;

      assigned[i] = {
        promotionId: String(promo._id),
        promotionTitle: promo.title || "",
        discountAmount,
      };
      discountsMap[i] = {
        cartIndex: i,
        productId,
        promotionId: String(promo._id),
        promotionTitle: promo.title || "",
        discountAmount,
      };
    }

    // adjust rounding remainder for min-type fixed if it ever applies (kept for safety)
    if (isMinType && promo.discountType === "fixed") {
      const fixedTotalForPromo = null; // not applicable for discrete allocation
      // adjustRoundingRemainder(discountsMap, eligible, fixedTotalForPromo);
      // no-op
    }

    recomputeAppliedPromotionIds();
    return true;
  }

  // run through ordered promotions
  for (const p of promotionsOrdered) {
    applyPromo(p);
  }

  const discounts = Object.values(discountsMap).sort((a, b) => a.cartIndex - b.cartIndex);
  return {
    discounts,
    appliedPromotionIds: Array.from(appliedPromotionIds),
  };
}

/**
 * applyPromotions - main exported function
 *
 * - cart: array of cart items
 * - productMap: { productId: productDoc }
 * - promotions: array of promotion docs (date-filtered recommended)
 * - code: optional code string
 *
 * Returns { discounts, appliedPromotions, promotionProgress }
 */
export default function applyPromotions(cart, productMap, promotionsInput, code = null) {
  const promotions = buildEligibleSets(cart, productMap, promotionsInput);
  const cartSubtotal = cart.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
  const cartTotalQty = cart.reduce((s, it) => s + Number(it.quantity || 0), 0);
  const codeUpper = code ? String(code).toUpperCase() : null;

  evaluateTriggers(promotions, cartSubtotal, cartTotalQty, codeUpper);
  const promotionProgress = [];
  for (const p of promotionsInput) {
    const prog = computePromotionProgress(p, cart, productMap);
    if (prog) promotionProgress.push(prog);
  }

  const ordered = orderPromotions(promotions, codeUpper);
  const { discounts, appliedPromotionIds } = applyOrderedPromotions(cart, ordered);

  const appliedPromotions = promotionsInput.filter((p) => appliedPromotionIds.includes(String(p._id)));

  return { discounts, appliedPromotions, promotionProgress };
}
