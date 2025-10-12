import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Promotion } from "@/models/Promotion";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Invalid request method" });
  }

  await mongooseConnect();

  const session = await getServerSession(req, res, authOptions);
  const userEmail = session?.user?.email;
  const user = userEmail ? await User.findOne({ email: userEmail }) : null;

  const {
    name,
    phone,
    address,
    city,
    governorate,
    cart,
    subtotal,
    shippingCost,
    totalBeforeDiscount,
    promotionIds,
    discount,
    total,
    paymentMethod,
    couponCodeId,
  } = req.body;

  if (
    !name ||
    !phone ||
    !address ||
    !city ||
    !governorate ||
    !cart?.length ||
    !paymentMethod
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const productIds = cart.map((item) => item._id);
  const productsInfo = await Product.find({ _id: { $in: productIds } });

  const line_items = cart.map((item) => {
    const product = productsInfo.find((p) => p._id.toString() === item._id);
    return {
      productId: product._id.toString(),
      title: product.title,
      price: item.price,
      quantity: item.quantity || 1,
      color: item.selectedColor,
      size: item.selectedSize,
    };
  });

  // === Pay on Delivery ===
  if (paymentMethod === "Pay on Delivery") {
    // check stock + deduct logic same as before...
    // (keep your existing "Pay on Delivery" block unchanged)
  }

  // === Paymob Online Payment ===
  if (paymentMethod === "Paymob") {
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
      promotionIds: promotionIds || [],
      couponCodeId: couponCodeId || null,
      discount: discount || null,
      total,
    });

    try {
      // ✅ Create payment intention
      const intention = await axios.post(
        "https://accept.paymob.com/v1/intention/",
        {
          amount: total * 100, // in cents (EGP)
          currency: "EGP",
          payment_methods: [parseInt(process.env.PAYMOB_INTEGRATION_ID)], // specify integration
          items: line_items.map((item) => ({
            name: item.title,
            amount_cents: item.price * 100,
            quantity: item.quantity,
          })),
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
          extras: {
            order_id: orderDoc._id.toString(),
          },
          success_url: `${process.env.WEBSITE_URL}/api/paymob-callback?status=success`,
          failure_url: `${process.env.WEBSITE_URL}/api/paymob-callback?status=failed`,
        },
        {
          headers: {
            Authorization: `Token ${process.env.PAYMOB_API_KEY}`,
          },
        }
      );

      // ✅ Redirect or return the hosted checkout URL
      const checkoutUrl = intention.data.redirect_url;
      res.status(200).json({ url: checkoutUrl });
    } catch (error) {
      console.error("Paymob Intention Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Payment initialization failed" });
    }
  }
}
