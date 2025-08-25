import { mongooseConnect } from "@/lib/mongoose";
import { Branch } from "@/models/Branch";

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    try {
        const { id } = req.query;
        if (id) {
            const branch = await Branch.findById(id);
            if (!branch) {
                return res.status(404).json({ error: "Branch not found" });
            }
            return res.json(JSON.parse(JSON.stringify(branch)));
        }
        const branches = await Branch.find();
        return res.json(branches);
    } catch (error) {
        console.error("Error fetching branches", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
} 