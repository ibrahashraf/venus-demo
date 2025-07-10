import { mongooseConnect } from "@/lib/mongoose";
import { Shipping } from "@/models/Shipping";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect(); 

    if (method === 'GET') {
        const shippingList = await Shipping.find();
        return res.json(shippingList);
    }

    res.status(405).json({ message: "Method not allowed" });
}
