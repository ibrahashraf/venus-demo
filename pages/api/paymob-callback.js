import { mongooseConnect } from "@/lib/mongoose";
import { Promotion } from "@/models/Promotion";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Cart } from "@/models/Cart";

export default async function handler(req, res) {
  await mongooseConnect();

  // Support both old & new Paymob formats
  const data = req.body.obj || req.body;

  const orderId = data?.order?.merchant_order_id;
  const success = data?.success === true || data?.success === "true";

  if (!orderId) {
    console.error("Order ID missing in Paymob callback:", data);
    return res.status(400).json({ error: "Order ID not found" });
  }

  if (!success) {
    await Order.findByIdAndDelete(orderId);
    return res.status(400).json({ error: "Payment failed" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.paid = true;
    await order.save();

    for (const item of order.line_items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const variant = product.variants.find(
          (v) => v.size === item.size && v.color === item.color
        );
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
        await product.save();
      }
    }

    if (order.couponCodeId) {
      await Promotion.findOneAndUpdate(
        { _id: order.couponCodeId },
        { $inc: { codeUsageCount: 1 } }
      );
    }

    await Cart.deleteOne({ userId: order.user });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
