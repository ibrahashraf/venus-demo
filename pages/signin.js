import { useState } from "react";
import { signIn } from "next-auth/react";
import Router from "next/router";
import Image from "next/image";
import GoogleLogo from "@/public/assets/google.png";
import Link from "next/link";
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
    if (res?.error && res.error === "notverified") {
      await fetch("/api/auth/resend-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ email })});
      Router.push(`/verify?email=${encodeURIComponent(email)}`);
      return;
    }
    if (res?.error) return setError(res.error);
    Router.push("/");
  }

  return (
    <>
      <div className="max-w-md mx-auto p-6 min-h-[700px] flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-10 text-center">Sign In</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full py-3 border border-primary rounded font-semibold text-lg"
        >
          <Image
            src={GoogleLogo}
            alt="Google Logo"
            width={30}
            height={30}
            className="inline-block mr-2 mb-1"
          />
          Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-500"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-gray-600">or</span>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          {error && <div className="text-red-600">{error}</div>}
          <button disabled={loading} className="py-2 bg-primary text-white rounded">
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-3 flex justify-between">
          <Link href="/reset-password" className="text-sm text-primary">Forgot Password?</Link>
          <Link href="/signup" className="text-sm text-accent">Create New Account</Link>
        </div>


      </div>
    </>
  );
}
