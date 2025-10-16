import crypto from "crypto";

export function verifyPaymobHmac(queryHmac, obj) {
    if (!queryHmac || !obj) return false;

    const secret = process.env.PAYMOB_HMAC_SECRET;
    if (!secret) throw new Error("Missing PAYMOB_HMAC_SECRET in environment");

    // Ensure we safely access nested fields to avoid crashes
    const get = (path, defaultValue = "") =>
        path.split(".").reduce((acc, key) => acc?.[key] ?? defaultValue, obj);

    // Concatenate fields in EXACT order per Paymob docs
    const concatenatedString =
        get("amount_cents") +
        get("created_at") +
        get("currency") +
        get("error_occured") +
        get("has_parent_transaction") +
        get("id") + 
        get("integration_id") +
        get("is_3d_secure") +
        get("is_auth") +
        get("is_capture") +
        get("is_refunded") +
        get("is_standalone_payment") +
        get("is_voided") +
        get("order.id") +
        get("owner") +
        get("pending") +
        get("source_data.pan") +
        get("source_data.sub_type") +
        get("source_data.type") +
        get("success");

    const generatedHmac = crypto
        .createHmac("sha512", secret)
        .update(concatenatedString)
        .digest("hex");
        
    return generatedHmac === queryHmac;
}
