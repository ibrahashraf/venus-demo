import { useState } from "react";
import Router from "next/router";
import { signIn } from "next-auth/react";
import GoogleLogo from "@/public/assets/google.png";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.message || "Error");
    // redirect to verify page with email in query
    Router.push(`/verify?email=${encodeURIComponent(form.email)}`);
  }

  return (
    <>
      <div className="max-w-md mx-auto p-6 min-h-[700px] flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          <input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          <input required type="password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} placeholder="Confirm Password" className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black" />
          {error && <div className="text-red-600">{error}</div>}
          <button disabled={loading} className="py-2 bg-primary text-white rounded">{loading ? "Creating account..." : "Create Account"}</button>
        </form>
                <p className="mt-4 text-sm">Already have an account? <Link href="/signin" className="text-accent">Sign In</Link></p>
        <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-500"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-gray-600">or</span>
                  </div>
                </div>
        
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
      </div>
    </>
  );
}
