import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import axios from "axios";
import { Promotion } from "@/models/Promotion";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Invalid request method' });
  }

  await mongooseConnect();

  const session = await getServerSession(req, res, authOptions);
  const userEmail = session?.user?.email;
  const user = userEmail ? await User.findOne({ email: userEmail }) : null;

  const {
    name, phone, address, city, governorate, cart, subtotal, shippingCost,
    totalBeforeDiscount, promotionIds, discount, total, paymentMethod, couponCode, recaptchaToken
  } = req.body;

   if ( !user ) {
     if (!recaptchaToken) {
       return res.status(400).json({ error: 'reCAPTCHA token is required' });
     }
  }

  try {
    if ( !user ) {    
      const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
      const response = await axios.post(
        recaptchaVerifyUrl,
        new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { success, score, action } = response.data;

      if (!success || (score !== undefined && score < 0.5)) {
        return res.status(400).json({ error: 'reCAPTCHA verification failed' });
      }
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error.response?.data || error.message);
    return res.status(500).json({ error: 'reCAPTCHA verification error' });
  }

  if (!name || !phone || !address || !city || !governorate || !cart?.length || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const productIds = cart.map(item => item._id);
  const productsInfo = await Product.find({ _id: { $in: productIds } });

  const line_items = cart.map(item => {
    const product = productsInfo.find(p => p._id.toString() === item._id);
    return {
      productId: product._id.toString(),
      title: product.title,
      price: item.price,
      quantity: item.quantity || 1,
      color: item.selectedColor,
      size: item.selectedSize,
    };
  });

  if (paymentMethod === "Pay on Delivery") {
    // Check stock availability
    for (const item of line_items) {
      const product = productsInfo.find(p => p._id.toString() === item.productId);
      const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.title} (${item.size}, ${item.color})` });
      }
    }
    // Deduct stock
    for (const item of line_items) {
      const product = productsInfo.find(p => p._id.toString() === item.productId);
      const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.title} (${item.size}, ${item.color})` });
      }
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { "variants.$[variant].stock": -item.quantity } },
        {
          arrayFilters: [
            { "variant.size": item.size, "variant.color": item.color }
          ]
        }
      );
    }
    // update coupon usage limit
    if (couponCode) {
      await Promotion.findOneAndUpdate(
        { code: couponCode },
        { $inc: { codeUsageCount: 1 } },
      );
    }


    res.status(201).json({ success: true });
  }
  const orderDoc = await Order.create({
    user: user?._id || null,
    line_items,
    name,
    phone,
    address,
    city,
    governorate,
    paid: false,
    paymentMethod,
    subtotal,
    shippingCost,
    totalBeforeDiscount,
    discount: discount || null,
    total,
  });
  // === Online Payment ===
  if ( paymentMethod === "Paymob" ) {
    try {
      const auth = await axios.post("https://accept.paymob.com/api/auth/tokens", {
        api_key: process.env.PAYMOB_API_KEY,
      });

      const token = auth.data.token;

      const paymobOrder = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
        auth_token: token,
        delivery_needed: false,
        amount_cents: total * 100,
        currency: "EGP",
        items: [],
        merchant_order_id: orderDoc._id,
        coupon_code: couponCode || null,
      });


      const paymentKey = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
        auth_token: token,
        amount_cents: total * 100,
        expiration: 3600,
        order_id: paymobOrder.data.id,
        billing_data: {
          apartment: "NA",
          email: userEmail || "customer@example.com",
          floor: "NA",
          first_name: name,
          street: address,
          building: "NA",
          phone_number: phone,
          shipping_method: "UNK",
          postal_code: "NA",
          city,
          country: "EG",
          last_name: ".",
          state: governorate,
        },
        currency: "EGP",
        integration_id: process.env.PAYMOB_INTEGRATION_ID,
        callback_url: `${process.env.NGROK_URL}/api/paymob-callback`,
        return_url: `${process.env.NGROK_URL}/api/payment-status`,
      });
      

      const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey.data.token}`;

      res.status(200).json({ url: paymentUrl });

    } catch (error) {
      console.error("Paymob Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Payment initialization failed" });
    }
  }
}
