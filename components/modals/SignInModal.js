import { getProviders, signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BarLoader } from "react-spinners";

export default function SignInModal({ onClose }) {
  const [providers, setProviders] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
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

  const modalContent = (
    <div
      id="modalBackground"
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        ref={modalRef}
        className="bg-white px-6 py-10 rounded-lg w-full max-w-md text-center relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
        >
          &times;
        </button>

        {loading || signingIn ? (
          <div className="w-full py-3">

            <BarLoader color="#dc133f" height={5} width="100%" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            { !signingIn && providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleSignIn(provider.id)}
                  disabled={signingIn}
                  className={`w-full py-3 border border-red-600 text-black font-bold rounded flex items-center justify-center hover:bg-red-600 hover:text-white transition ${
                    signingIn ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                         تسجيل الدخول بواسطة  <span className="text-2xl mr-1">{provider.name}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.getElementById("modal-root"));
}
