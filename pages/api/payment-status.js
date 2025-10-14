export default async function handler(req, res) {
  const { success, merchant_order_id, order_id } = req.query;

  const orderId = merchant_order_id || order_id || "unknown";

  if (success === "true") {
    return res.redirect(`/payment-status?success=true&order_id=${orderId}`);
  }

  return res.redirect(`/payment-status?success=false&order_id=${orderId}`);
}
