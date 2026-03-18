import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, otp } = req.body || {};
  if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

  await mongooseConnect();

  const user = await User.findOne({ email }).select("+otp +otpExpires");
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.verified) return res.status(400).json({ message: "Already verified" });

  if (!user.otp || user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > user.otpExpires)
    return res.status(400).json({ message: "OTP has expired" });

  user.verified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  return res.status(200).json({ ok: true });
}
