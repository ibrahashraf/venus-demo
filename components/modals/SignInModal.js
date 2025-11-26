import { getProviders, signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BarLoader } from "react-spinners";
import Image from "next/image";
import GoogleLogo from "@/public/assets/google.png";

export default function SignInModal({ onClose }) {
  const [providers, setProviders] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef();
  const { update } = useSession(); // allows refreshing the session

  useEffect(() => {
    getProviders().then((data) => {
      setProviders(data);
      setLoading(false);
    });
    setMounted(true);
  }, []);

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modalBackground") {
      onClose();
    }
  };

  const handleSignIn = async (providerId) => {
    setSigningIn(true);

    const result = await signIn(providerId, { redirect: false });

    if (!result?.error) {
      await update(); // refresh session so checkout can see new user
      onClose(); // close modal
    } else {
      console.error(result.error);
    }

    setSigningIn(false);
  };

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setSigningIn(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) setError(result.error);
    else {
      await update();
      onClose();
    }

    setSigningIn(false);
  };


  const modalContent = (
    <div
      id="modalBackground"
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        ref={modalRef}
        className="bg-white px-6 py-10 rounded-lg w-full max-w-md max-sm:max-w-sm text-center relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
        >
          &times;
        </button>

        {loading || signingIn ? (
          <div className="w-full py-3">

            <BarLoader color="#dc133f" height={5} width="100%" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-10 text-center">تسجيل الدخول</h1>
            {providers &&
              Object.values(providers)
                .filter((p) => p.id !== "credentials")
                .map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleSignIn(provider.id)}
                    disabled={signingIn}
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
                ))}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-500"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-gray-600">أو</span>
              </div>
            </div>
            <form onSubmit={handleCredentialsSignIn} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                required
                className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                required
                className="w-full rounded-sm p-3 mt-3 focus:outline-none border-b transition border-gray-400 focus:border-black"
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={signingIn}
                className="py-2 bg-primary text-white font-bold rounded hover:bg-primary/70 transition"
              >
                {signingIn ? "جاري التسجيل..." : "تسجيل الدخول"}
              </button>
            </form>
            <div className=" flex justify-between">
              <a href="/reset-password" className="text-sm text-primary">نسيت كلمه المرور ؟</a>
              <a href="/signup" className="text-sm text-accent">انشاء حساب جديد</a>
            </div>

          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.getElementById("modal-root"));
}
