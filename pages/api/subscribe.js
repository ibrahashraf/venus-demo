import { mongooseConnect } from "@/lib/mongoose";
import { Subscription } from "@/models/Subscription";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === "POST") {
        try {
            const { phone } = req.body;

            if (!phone || !/^\d+$/.test(phone) || phone.length < 11) {
                return res
                .status(400)
                .json({ success: false, message: "رقم الهاتف غير صحيح" });
            }

            const exists = await Subscription.findOne({ phone });
            if (exists) {
                return res.status(400).json({ success: false, message: "رقم الهاتف مشترك بالفعل" });
            }

            const subscription = await Subscription.create({ phone });

            return res.status(201).json({ success: true, subscription });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "حدث خطأ" });
        }
    } else {
        res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
