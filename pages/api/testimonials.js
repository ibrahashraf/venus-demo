import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Testimonial } from "@/models/Testimonial";



export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    const session = await getServerSession(req, res, authOptions);
    const userEmail = session?.user?.email;
    const user = userEmail ? await User.findOne({ email: userEmail }) : null;
    if (method === "POST") {
        const { name, rating, comment } = req.body;
        if (!name || !rating || !comment) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const testimonial = new Testimonial({
            user: user?._id || null,
            name,
            rating,
            comment,
        });
        await testimonial.save();
        return res.status(201).json(testimonial);
    }
    if (method === "GET") {
        const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
        return res.status(200).json(testimonials);
    }
}