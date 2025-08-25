import mongoose, { model, models, Schema } from "mongoose";

const CartItemSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  images: [String],
  selectedColor: String,
  selectedSize: String,
  quantity: { type: Number, default: 1 },
  stock: { type: Number, default: 1 },
  price: Number,
  promotionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: false },
});

const CartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now, expires: 2592000 },
});

export const Cart = models?.Cart || model('Cart', CartSchema);