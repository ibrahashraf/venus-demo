import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, otp, newPassword, confirmPassword } = req.body || {};
  if (!email || !otp || !newPassword || !confirmPassword) return res.status(400).json({ message: "Missing fields" });
  if (newPassword.length < 6) return res.status(400).json({ message: "Password too short" });
  if (newPassword !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

  await mongooseConnect();
  const user = await User.findOne({ email }).select("+otp +otpExpires +password");
  if (!user) return res.status(400).json({ message: "Invalid request" });
  if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) return res.status(400).json({ message: "Invalid or expired code" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  return res.status(200).json({ ok: true });
}
