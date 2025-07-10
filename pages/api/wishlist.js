import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "@/models/User";
import { WishList } from "@/models/WishList";

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  const userId = user._id;  

  if (method === "GET") {
    const wishlist = await WishList.findOne({ userId }).populate("items.productId");
    return res.json(wishlist || { userId, items: [] });
  }

  if (method === "POST") {
    const { productId } = req.body;

    let list = await WishList.findOne({ userId });

    if (!list) {
      list = await WishList.create({
        userId,
        items: [{ productId }],
      });
    } else {
      const exists = list.items.find((item) => item.productId.equals(productId));
      if (!exists) {
        list.items.push({ productId });
        list.updatedAt = new Date();
        await list.save();
      }
    }

    const fullList = await WishList.findOne({ userId }).populate("items.productId");
    return res.json(fullList);
  }

  if (method === "DELETE") {
    const { productId: removeId } = req.body;

    await WishList.findOneAndUpdate(
      { userId },
      {
        $pull: { items: { productId: removeId } },
        $set: { updatedAt: new Date() },
      }
    );

    const fullList = await WishList.findOne({ userId }).populate("items.productId");
    return res.json(fullList);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
