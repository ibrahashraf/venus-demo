import { mongooseConnect } from "@/lib/mongoose";
import { Promotion } from "@/models/Promotion";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Cart } from "@/models/Cart";

export default async function handler(req, res) {
  await mongooseConnect();

  // Debug log (remove in production or keep behind env flag)
  console.log("Paymob webhook body:", JSON.stringify(req.body, null, 2));

  // Support both old & new shapes
  const data = req.body.obj || req.body;
  // Paymob uses `success` boolean on obj
  const success = data?.success === true || data?.success === "true";

  // Primary: merchant_order_id (your DB order id) — if you passed it in extras
  let orderId = data?.order?.merchant_order_id;

  // Secondary: Paymob's internal order id (obj.order.id)
  const paymobInternalOrderId = data?.order?.id || data?.id;

  if (!orderId && !paymobInternalOrderId) {
    console.error("Missing both merchant_order_id and paymob order id in webhook:", data);
    return res.status(400).json({ error: "Order ID not found" });
  }

  // Find the DB order:
  let order;
  if (orderId) {
    order = await Order.findById(orderId);
  } else {
    // fallback: try to find by the paymob internal id saved on your Order document
    order = await Order.findOne({ paymob_order_id: String(paymobInternalOrderId) });
  }

  if (!order) {
    console.error("Order not found in DB for merchant_order_id / paymob id:", { orderId, paymobInternalOrderId });
    return res.status(404).json({ error: "Order not found" });
  }

  if (!success) {
    // Payment failed — optionally delete order or mark failed
    await Order.findByIdAndDelete(order._id);
    return res.status(400).json({ error: "Payment failed" });
  }

  try {
    order.paid = true;
    await order.save();

    // decrement stock
    for (const item of order.line_items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
        await product.save();
      }
    }

    // coupon usage
    if (order.couponCodeId) {
      await Promotion.findOneAndUpdate(
        { _id: order.couponCodeId },
        { $inc: { codeUsageCount: 1 } }
      );
    }

    // clear cart
    await Cart.deleteOne({ userId: order.user });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing Paymob webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
