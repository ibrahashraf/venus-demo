import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";
export default function ResetPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function sendEmail(e) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setStep(2);
  }

  function verifyOtp(e) {
    e.preventDefault();
    // no backend call here — backend verifies OTP in final step
    if (!otp.trim()) return;
    setStep(3);
  }

  async function reset(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) return toast.error(data.message || "An error occurred");

    if (res.ok) {
      toast.success("Password changed successfully");
      router.push("/signin");
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto p-6 min-h-[700px] flex flex-col justify-center">
        <h1 className="text-xl text-center font-bold mb-4">Reset Password</h1>

        {step === 1 && (
          <form onSubmit={sendEmail} className="flex flex-col gap-3">
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
            />
            <button disabled={loading} className="py-2 bg-primary text-white rounded">
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="flex flex-col gap-3">
            <p className="text-sm">Enter the code sent to {email}</p>
            <input
              required
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
            />
            <button className="py-2 bg-primary text-white rounded">Confirm</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={reset} className="flex flex-col gap-3">
            <input
              required
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
            />
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
            />
            <button disabled={loading} className="py-2 bg-primary text-white rounded">
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-green-700">{msg}</div>
        )}

        {msg && step !== 4 && <div className="mt-3 text-sm text-red-600">{msg}</div>}
      </div>
    </>
  );
}
