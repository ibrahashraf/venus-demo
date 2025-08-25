import { Order } from "@/models/Order";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
    await mongooseConnect();
    const { reason } = req.body;
    const { id } = req.query;
    const method = req.method;
    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    if (method === "POST") {
        if (order.status === 'Shipped' || order.status === 'Delivered') {
            return res.status(400).json({ message: "Order cannot be cancelled" });
        }
        if (order.cancellationRequest.status !== "none") {
            return res.status(400).json({ message: "Cancellation request already sent" });
        }
        order.cancellationRequest = {
            status: "requested",
            reason,
            requestedAt: new Date(),
        };
        await order.save();
        return res.status(200).json({ message: "Cancellation request sent" });
    }
    if (method === "GET") {
        const order = await Order.findById(id).lean();
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json(JSON.parse(JSON.stringify(order)));
    }

    return res.status(405).json({ message: "Method not allowed" });
} 