import { mongooseConnect } from "@/lib/mongoose";
import { Promotion } from "@/models/Promotion";

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    try {
        const promotions = await Promotion.find();
        return res.json(promotions);

    } catch (error) {
        console.error("Error fetching promotions", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}