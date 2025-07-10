import { mongooseConnect } from "@/lib/mongoose";
import { Promotion } from "@/models/Promotion";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    await mongooseConnect();
    const { code } = req.body;
    
    if ( !code ) {
        return res.status(400).json({ error: 'Missing Code' });
    }

    const now = new Date();

    const promo = await Promotion.findOne({
        requiresCode: true,
        code: code.toUpperCase(),
        isActive: true,
        $or: [{ startsAt: { $lte: now } }, { startsAt: { $exists: false } }],
        $or: [{ endsAt: { $gte: now } }, { endsAt: { $exists: false } }],
        $expr: {
            $lt: ["$codeUsageCount", "$codeUsageLimit"],
        },
    });
    if (!promo) {
        return res.status(404).json({ error: "Invalid Or Expired Code"});
    }

    return res.json(promo);
}