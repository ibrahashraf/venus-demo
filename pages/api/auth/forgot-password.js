import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";
import { rateLimit } from "@/lib/rateLimit";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const rl = rateLimit(`forgot:${ip}`, { windowMs: 60_000, max: 5 });
  if (!rl.ok) return res.status(429).json({ message: "Too many requests" });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: "Missing email" });

  await mongooseConnect();
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ ok: true }); // don't reveal existence

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  try {
    await sendEmail({
      to: email,
      subject: "Password reset code",
      html: `<div style="font-family:sans-serif;text-align:center">
              <p>Use this code to reset your password:</p>
              <div style="display:inline-block;background:#f4f4f4;padding:12px 20px;border-radius:8px;font-weight:bold;font-size:20px">${otp}</div>
              <p style="margin-top:10px;font-size:12px;color:#666">Expires in 10 minutes</p>
            </div>`,
      text: `Your password reset code: ${otp}. Expires in 10 minutes.`,
    });
  } catch (err) {
    console.error("forgot-email failed:", err);
  }

  return res.status(200).json({ ok: true });
}
