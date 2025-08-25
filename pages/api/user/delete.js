import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Cart } from "@/models/Cart";
import { WishList } from "@/models/WishList";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (user) {
      await Cart.findOneAndDelete({ userId: user._id });
      await WishList.findOneAndDelete({ userId: user._id });
      await User.findByIdAndDelete(user._id);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete account" });
  }
}
