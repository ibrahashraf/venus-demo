import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Missing order ID" });

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  res.json({
    paid: order.paid,
    total: order.total,
    items: order.line_items.map(item => ({
      item_id: item.productId,
      item_name: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
  });
}
