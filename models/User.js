import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    image: String,
    shippingInfo: {
      name: { type: String, required: false },
      phone: { type: String, required: false },
      address: { type: String, required: false },
      city: { type: String, required: false },
      governorate: { type: String, required: false },
    },
  },
  { timestamps: true }
);

export const User = models?.User || model("User", UserSchema);
