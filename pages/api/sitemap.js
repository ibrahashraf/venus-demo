import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Branch } from "@/models/Branch";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    const [products, branches, categories] = await Promise.all([
      Product.find({}, "_id").lean(),
      Branch.find({}, "_id").lean(),
      Category.find({}, "_id").lean(),
    ]);

    return res.status(200).json({
      products,
      branches,
      categories,
    });
  } catch (error) {
    console.error("Error in /api/sitemap:", error);
    return res.status(500).json({ error: "Failed to fetch sitemap data" });
  }
}
