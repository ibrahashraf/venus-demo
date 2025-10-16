export default async function handler(req, res) {
  const { success } = req.query;

  if (success === "true") {
    return res.redirect(`/payment-status?success=true`);
  }

  return res.redirect(`/payment-status?success=false`);
}
