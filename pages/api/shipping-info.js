import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "@/models/User";

export default async function handler(req, res) {
    await mongooseConnect();
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Not authenticated" });
    const userEmail = session?.user?.email;
    if (!userEmail) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.method === "GET") {
        try {
            const user = await User.findOne({ email: userEmail });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({ shippingInfo: user.shippingInfo || null });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "PUT") {
        const { name, phone, address, city, governorate } = req.body;
        if (!name || !phone || !address || !city || !governorate) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        try {
            const updatedUser = await User.findOneAndUpdate(
                { email: userEmail },
                {
                    $set: {
                        shippingInfo: {
                            name,
                            phone,
                            address,
                            city,
                            governorate,
                        },
                    },
                },
                { new: true }
            );
            res.status(200).json({ message: "Shipping info updated successfully", user: updatedUser });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
