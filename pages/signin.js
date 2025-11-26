import { useState } from "react";
import { signIn } from "next-auth/react";
import Router from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import GoogleLogo from "@/public/assets/google.png";
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) return setError(res.error);
    Router.push("/");
  }

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto p-6 min-h-[700px] flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-10 text-center">تسجيل الدخول</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full py-3 border border-primary rounded font-semibold"
        >
          <Image
            src={GoogleLogo}
            alt="Google Logo"
            width={30}
            height={30}
            className="inline-block ml-2 mb-1"
          />
          المتابعه باستخدام
          <span className="font-bold text-xl mr-2">Google</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-500"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-gray-600">أو</span>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="البريد الالكتروني" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="كلمه المرور" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          {error && <div className="text-red-600">{error}</div>}
          <button disabled={loading} className="py-2 bg-primary text-white rounded">
            {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
          </button>
        </form>
        <div className="mt-3 flex justify-between">
          <a href="/reset-password" className="text-sm text-primary">نسيت كلمه المرور ؟</a>
          <a href="/signup" className="text-sm text-accent">انشاء حساب جديد</a>
        </div>


      </div>
      <Footer />
    </>
  );
}
