export default async function handler(req, res) {
  console.log("req.query", req.query);
  const { success, merchant_order_id } = req.query;

  if (success === "true") {
    return res.redirect(`/payment-status?success=true&order_id=${merchant_order_id}`);
  }

  return res.redirect(`/payment-status?success=false&order_id=${merchant_order_id}`);
}
