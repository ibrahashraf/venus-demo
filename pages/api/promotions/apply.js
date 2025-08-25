import { mongooseConnect } from "@/lib/mongoose";
import { Promotion } from "@/models/Promotion";
import { Product } from "@/models/Product";
import applyPromotions from "@/lib/applyPromotions";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    await mongooseConnect();
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart)) {
        return res.status(400).json({error: "Invalid cart data"});
    }
    try {
        const now = new Date();
        const promotions = await Promotion.find({
            isActive: true,
            $or: [
                {startsAt: {$lte: now}}, 
                {startsAt: {$exists: false}},
            ], 
            $or: [
                {endsAt: {$gte: now}},
                {endsAt: {$exists: false}}
            ],
        }).lean();
        const productIds = cart.map(item => item.productId || item._id);
        const products = await Product.find({ _id: { $in: productIds } });
        const productMap = {};
        products.forEach(product => {
            productMap[product._id.toString()] = product;
        });
        const { discounts, appliedPromotions, promotionProgress } = applyPromotions(cart, productMap, promotions);
        console.log("discounts", discounts, "appliedPromotions", appliedPromotions, "promotionProgress", promotionProgress);
        return res.json({ discounts, appliedPromotions, promotionProgress });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}