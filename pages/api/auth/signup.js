import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/sendEmail";
import { rateLimit } from "@/lib/rateLimit";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const rl = rateLimit(`signup:${ip}`, { windowMs: 60_000, max: 6 });
  if (!rl.ok) return res.status(429).json({ message: "Too many requests" });

  const { name, email, password, confirmPassword } = req.body || {};
  if (!name || !email || !password || !confirmPassword)
    return res.status(400).json({ message: "Missing fields" });

  if (password.length < 6) return res.status(400).json({ message: "Password too short" });
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

  await mongooseConnect();

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 15 * 60 * 1000; // 15 min

  await User.create({
    name,
    email,
    password: hash,
    otp,
    otpExpires,
    verified: false,
  });

  try {
    await sendEmail({
      to: email,
      subject: "Your verification code",
      html: `<div style="font-family:sans-serif;text-align:center">
              <h3>Verify your email</h3>
              <p>Use this code to finish signing up:</p>
              <div style="display:inline-block;background:#f4f4f4;padding:12px 20px;border-radius:8px;font-weight:bold;font-size:20px;letter-spacing:4px">${otp}</div>
              <p style="margin-top:10px;font-size:12px;color:#666">Expires in 10 minutes</p>
            </div>`,
      text: `Your OTP code: ${otp}. Expires in 10 minutes.`,
    });
  } catch (err) {
    console.error("sendEmail failed:", err);
    // Consider deleting created user to avoid orphan account
    await User.deleteOne({ email });
    return res.status(500).json({ message: "Failed to send OTP" });
  }

  return res.status(200).json({ ok: true, message: "OTP sent" });
}
