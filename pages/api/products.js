import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { page, limit } = req.query;

    try {
        if (!page || !limit) {
            const products = await Product.find({}).sort({ createdAt: -1 });
            return res.status(200).json(products);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [products, total] = await Promise.all([
            Product.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Product.countDocuments(),
        ]);

        return res.status(200).json({
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Failed to fetch products" });
    }
}
