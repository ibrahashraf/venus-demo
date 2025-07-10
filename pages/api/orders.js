import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

  res.json(orders);
}
