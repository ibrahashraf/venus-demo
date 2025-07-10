import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    const products = await Product.find();
    res.status(200).json(products);
}