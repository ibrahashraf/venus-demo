import { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function VerifyPage() {
  const router = useRouter();
  const { email: queryEmail } = router.query;
  const [email, setEmail] = useState(queryEmail || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(()=>{ if(queryEmail) setEmail(queryEmail); },[queryEmail]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setMessage(data.message || "Invalid code");
    // verified -> redirect to sign-in (or auto-login)
    Router.push("/signin?verified=true&email="+encodeURIComponent(email));
  }

  async function resend() {
    await fetch("/api/auth/resend-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ email })});
    setMessage("OTP resent if account exists");
  }

  return ( 
    <>
      <Header />
      <div className="max-w-md mx-auto p-6 min-h-[700px] flex flex-col justify-center">
        <h1 className="text-xl font-bold mb-3 text-center">تأكيد الحساب</h1>
        <p className="mb-3">الرجاء ادخال رمز التحقق الذي تم ارساله ل <strong>{email}</strong></p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          <button disabled={loading} className="py-2 bg-primary text-white rounded">{loading ? "جاري التحقق..." : "متابعة"}</button>
        </form>
        <div className="mt-3">
          <button onClick={resend} className="text-sm text-primary">اعادة الارسال</button>
        </div>
        {message && <div className="mt-3 text-sm text-gray-600">{message}</div>}
      </div>
      <Footer />
    </>
  );
}
