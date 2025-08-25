import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const latestProducts = await Product.find(
      { "variants.stock": { $gt: 0 } },
      null,
      { sort: { createdAt: -1 }, limit: 8 }
    );

    const showCategories = await Category.find({ showOnHome: true });

    const categoriesWithProducts = await Promise.all(
      showCategories.map(async (cat) => {
        const products = await Product.find({
          $or: [{ category: cat._id }, { parentCategory: cat._id }],
          "variants.stock": { $gt: 0 }
        }).limit(8);

        return { category: cat, products };
      })
    );

    res.status(200).json({
      latestProducts,
      categoriesWithProducts,
    });
  } catch (err) {
    console.error("Error in /api/home:", err);
    res.status(500).json({ error: err.message });
  }
}
