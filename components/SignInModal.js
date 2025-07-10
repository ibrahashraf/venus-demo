import { getProviders, signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function SignInModal({ onClose }) {
  const [providers, setProviders] = useState(null);
  const [mounted, setMounted] = useState(false); 
  const modalRef = useRef();

  useEffect(() => {
    getProviders().then(setProviders);
    setMounted(true);
  }, []);

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modalBackground") {
      onClose();
    }
  };
  const modalContent = (
    <div
      id="modalBackground"
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" // just a semi-transparent dark bg
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-full max-w-md text-center relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold mb-6 text-black">
          <span className="text-red-600 text-4xl font-bold">Venus Outlet</span> تسجيل الدخول إلى
        </h1>

        <div className="flex flex-col gap-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className="w-full py-3 border border-red-600 text-black font-bold rounded hover:bg-red-600 hover:text-white"
              >
                <span className="text-2xl mr-1">{provider.name}</span> تسجيل الدخول بواسطة
              </button>
            ))}
        </div>
      </div>
    </div>
  )
  if (!mounted) return null;
  
  return createPortal(modalContent, document.getElementById("modal-root"))
}
