import mongoose, { model, models, Schema } from "mongoose";

const WishListItemSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

const WishListSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [WishListItemSchema],
  updatedAt: { type: Date, default: Date.now, expires: 2592000 },
});

export const WishList = models?.WishList || model('WishList', WishListSchema);