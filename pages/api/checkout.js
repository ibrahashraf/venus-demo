import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Promotion } from "@/models/Promotion";
import axiosClient from "@/lib/axiosClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Invalid request method' });
  }

  await mongooseConnect();

  const session = await getServerSession(req, res, authOptions);
  const userEmail = session?.user?.email;
  const user = userEmail ? await User.findOne({ email: userEmail }) : null;

  const {
    name
    , phone
    , address
    , city
    , governorate
    , cart
    , subtotal
    , shippingCost
    , totalBeforeDiscount
    , promotionIds
    , discount
    , total
    , paymentMethod
    , couponCodeId
  } = req.body;


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
    if (couponCodeId) {
      await Promotion.findOneAndUpdate(
        { _id: couponCodeId },
        { $inc: { codeUsageCount: 1 } },
      );
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
      promotionIds: promotionIds || [],
      couponCodeId: couponCodeId || null,
      discount: discount || null,
      total,
    });

    res.status(201).json({ success: true });
  }
  // === Online Payment ===
  if (paymentMethod === "Paymob") {

    const items = line_items.map(item => ({
      name: item.title,
      amount: Math.round(item.price * item.quantity * 100),
      quantity: item.quantity,
    }));

    // Add shipping as a pseudo-item (if it exists)
    if (shippingCost > 0) {
      items.push({
        name: "Shipping",
        amount: Math.round(shippingCost * 100),
        quantity: 1,
      });
    }

    // If you have a discount, represent it as a negative amount
    if (discount > 0) {
      items.push({
        name: "Discount",
        amount: -Math.round(discount * 100),
        quantity: 1,
      });
    }

// Now compute the total in cents
const totalCents = items.reduce((sum, item) => sum + item.amount, 0);
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
    // === 1. Create Intention ===
    const intentionResponse = await axiosClient.post(
      "https://accept.paymob.com/v1/intention/",
      {
        amount: totalCents,
        currency: "EGP",
        payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],
        items,
        billing_data: {
          first_name: name,
          last_name: ".",
          email: userEmail || "customer@example.com",
          phone_number: phone,
          street: address,
          building: "NA",
          floor: "NA",
          apartment: "NA",
          city,
          country: "EG",
          state: governorate,
        },
        extras: {
          merchant_order_id: "ibrahimpaymob",
        },
      },
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
        },
        skipRedirect: true,
      }
    );


    const clientSecret = intentionResponse.data.client_secret;

    // === 2. Build Unified Checkout URL ===
    const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;

    res.status(200).json({ url: paymentUrl });

  } catch (error) {
    console.error("Paymob Unified Checkout Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
}

}
