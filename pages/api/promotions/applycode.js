// pages/api/promotions/applycode.js
import { mongooseConnect } from "@/lib/mongoose";
import { Promotion } from "@/models/Promotion";
import { Product } from "@/models/Product";
import applyPromotions from "@/lib/applyPromotions";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    await mongooseConnect();

    const { cart, code } = req.body;
    if (!cart || !Array.isArray(cart)) {
        return res.status(400).json({ error: "Invalid cart data" });
    }
    if (!code) {
        return res.status(400).json({ error: "Missing Code" });
    }

    try {
        const now = new Date();
        // First verify there exists at least one matching coupon promo that can be used
        const codeUpper = String(code).toUpperCase();
        const matchingCodePromo = await Promotion.findOne({
        requiresCode: true,
        code: codeUpper,
        isActive: true,
        $and: [
            { $or: [{ startsAt: { $lte: now } }, { startsAt: { $exists: false } }] },
            { $or: [{ endsAt: { $gte: now } }, { endsAt: { $exists: false } }] },
        ],
        $expr: { $lt: ["$codeUsageCount", "$codeUsageLimit"] },
        }).lean();

        if (!matchingCodePromo) {
        return res.status(404).json({ error: "Invalid or expired coupon code" });
        }

        // Fetch all active promotions (auto + code ones). applyPromotions will prioritize matching code promos.
        const promotions = await Promotion.find({
        isActive: true,
        $and: [
            { $or: [{ startsAt: { $lte: now } }, { startsAt: { $exists: false } }] },
            { $or: [{ endsAt: { $gte: now } }, { endsAt: { $exists: false } }] },
        ],
        }).lean();

        const productIds = cart.map((item) => item.productId || item._id);
        const products = await Product.find({ _id: { $in: productIds } }).lean();

        const productMap = {};
        products.forEach((p) => {
        productMap[String(p._id)] = p;
        });

        const result = applyPromotions(cart, productMap, promotions, codeUpper);

        // verify that some applied promo matches the code
        const appliedCodePromo = result.appliedPromotions.find(
        (p) => p.requiresCode && String(p.code).toUpperCase() === codeUpper
        );
        if (!appliedCodePromo) {
        return res.status(404).json({ error: "This coupon code is not applicable to your order" });
        }

        // compute coupon-specific summary if needed
        const couponDiscount = result.discounts
        .filter((d) => String(d.promotionId) === String(appliedCodePromo._id))
        .reduce((s, d) => s + Number(d.discountAmount || 0), 0);

        return res.json({ couponDiscount, appliedCoupon: appliedCodePromo, discounts: result.discounts, appliedPromotions: result.appliedPromotions });
    } catch (err) {
        console.error("Error in applycode endpoint:", err);
        return res.status(500).json({ error: err.message });
    }
}
 