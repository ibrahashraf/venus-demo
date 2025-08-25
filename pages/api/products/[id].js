import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    await mongooseConnect();

    const { id } = req.query;

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const product = await Product.findById(id).lean();

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
        })
        .limit(8)
        .lean();

        return res.status(200).json({
            product,
            relatedProducts,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ error: "Failed to fetch product" });
    }
}
