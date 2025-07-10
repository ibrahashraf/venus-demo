import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import crypto from "crypto";

// Optional: Protect with your HMAC secret key from Paymob dashboard
const PAYMOB_HMAC = process.env.PAYMOB_HMAC;

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const event = req.body;

  // Optional: Validate HMAC signature (recommended)
  const receivedHmac = req.headers.hmac || req.headers["x-hmac-signature"];
  const calculatedHmac = crypto
    .createHmac("sha512", PAYMOB_HMAC)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (receivedHmac !== calculatedHmac) {
    return res.status(403).json({ error: "Invalid HMAC signature" });
  }

  // Check if payment is successful
  if (event.type === "TRANSACTION" && event.obj.success) {
    const orderId = event.obj.order.id; // Paymob Order ID (not your DB's _id)

    // Option 1: If you passed a custom order reference to Paymob (like DB order _id), use that to update
    // Option 2: Or you can match by amount, phone, or metadata if needed

    const reference = event.obj.order.merchant_order_id; // You must send this when creating Paymob order
    if (!reference) return res.status(400).json({ error: "No reference found" });

    const updatedOrder = await Order.findByIdAndUpdate(reference, {
      paid: true,
    });

    return res.json({ success: true, order: updatedOrder });
  }

  return res.json({ received: true });
}
