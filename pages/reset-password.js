import Footer from "@/components/Footer";
import Header from "@/components/Header";
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

    if (!res.ok) return toast.error(data.message || "حدث خطأ ما");

    if (res.ok) {
      toast.success("تم تغيير كلمة المرور بنجاح");
      router.push("/signin");
    }
  }

  return (
    <>
    <Header />
      <div className="max-w-md mx-auto p-6 min-h-[700px] flex flex-col justify-center">
        <h1 className="text-xl text-center font-bold mb-4">اعادة تعيين كلمه المرور</h1>

        {step === 1 && (
          <form onSubmit={sendEmail} className="flex flex-col gap-3">
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="البريد الالكتروني"
              className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
            />
            <button disabled={loading} className="py-2 bg-primary text-white rounded">
              {loading ? "جاري الارسال..." : "ارسال رمز التحقق"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="flex flex-col gap-3">
            <p className="text-sm">ادخل الرمز المرسل الى {email}</p>
            <input
              required
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
            />
            <button className="py-2 bg-primary text-white rounded">تأكيد</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={reset} className="flex flex-col gap-3">
            <input
              required
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="كلمة المرور الجديدة"
              className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
            />
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="تأكيد كلمة المرور الجديدة"
              className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
            />
            <button disabled={loading} className="py-2 bg-primary text-white rounded">
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-green-700">{msg}</div>
        )}

        {msg && step !== 4 && <div className="mt-3 text-sm text-red-600">{msg}</div>}
      </div>
      <Footer />
    </>
  );
}
