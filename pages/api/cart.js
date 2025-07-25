import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "@/models/User";
import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  const userId = user._id;
  console.log(userId);

  if (method === "GET") {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    return res.json(cart || { items: [] });
  }

  if (method === "POST") {
    const { productId, title, images, selectedColor, selectedSize, quantity, price } = req.body;
    const product = await Product.findById(productId);
    if (!product) { 
      return res.status(400).json({ error: "Product not found" });
    }
    const stock = product.variants.find(
      (variant) => variant.color === selectedColor && variant.size === selectedSize
    )?.stock;
    if (stock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }
    let cartDoc = await Cart.findOne({ userId });
    if (!cartDoc) {
      cartDoc = await Cart.create({
        userId,
        items: [{ productId, title, images, selectedColor, selectedSize, quantity, stock, price }],
      });
    } else {
      const existingItem = cartDoc.items.find(
        (item) => item.productId.equals(productId) && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartDoc.items.push({ productId, title, images, selectedColor, selectedSize, quantity, price });
      }
      cartDoc.updatedAt = new Date();
      await cartDoc.save();      
    }
    return res.json(cartDoc);
  }

  if (method === "PUT") {
    const { productId, selectedColor, selectedSize, action } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find(
      (item) =>
        item.productId.equals(productId) &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      item.quantity -= 1;
      if (item.quantity < 1) {
        // Remove the item if quantity < 1
        cart.items = cart.items.filter(i => i !== item);
      }
    } else if (action === "set") {
      item.quantity = quantity;
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    cart.updatedAt = new Date();
    await cart.save();
    return res.json(cart);
  }


  if (method === "DELETE") {
    const { productId, selectedColor, selectedSize } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({error: "Cart not found"});
    }
    if (!productId) {
      await Cart.deleteOne({ userId });
      return res.json({ message: "Cart deleted successfully" });
    }
    cart.items = cart.items.filter(item => 
      !(
        item.productId.equals(productId) &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
      )
    );
    cart.updatedAt = new Date();
    await cart.save();
    return res.json({ message: "Cart item deleted successfully" });
  }

  res.status(405).json({ message: "Method not allowed" });
}