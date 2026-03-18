import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Head from "next/head";
import Link from "next/link";
import TestimonialModal from "@/components/modals/TestimonialModal";
import Button from "@/components/ui/Button";

export default function PaymentStatus() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!router.isReady) return;
    const { success } = router.query;
    if (success === "true") {
      setStatus("success");
    } else if (success === "false") {
      setStatus("error");
    }
  }, [router.query, router.isReady]);


  const statusDetails = {
    loading: {
      message: "Verifying payment...",
      icon: <HourglassEmptyIcon className="text-gray-500" style={{ fontSize: 64 }} />,
      color: "text-gray-500",
    },
    success: {
      message: "Payment successful, we will contact you soon. Thank you for your order!",
      icon: <CheckCircleOutlineIcon className="text-green-500" style={{ fontSize: 64 }} />,
      color: "text-green-600",
    },
    error: {
      message: "Payment failed. Please try again.",
      icon: <HighlightOffIcon className="text-red-500" style={{ fontSize: 64 }} />,
      color: "text-red-600",
    },
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <>
    <Head>
      <title>Payment Status | Venus Outlet</title>
      <meta
        name="description"
        content="Payment status in Venus Outlet"
      />
    </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <div className="flex flex-col items-center space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          {statusDetails[status].icon}
          <h1 className={`text-xl font-bold ${statusDetails[status].color}`}>
            {statusDetails[status].message}
          </h1>
          { status === "success" ? (
            <>
             <Link href="/Orders" className="text-white bg-black px-4 py-2 rounded-sm hover:bg-white hover:text-black border border-black transition">
                View My Orders
              </Link>
              <div className="mt-5">
                <button
                  onClick={() => setShowModal(true)}
                  className="text-white bg-green-600 px-4 py-2 rounded-sm hover:bg-green-700 transition"
                >
                  Leave Feedback
                </button>
                <TestimonialModal isOpen={showModal} onClose={() => setShowModal(false)} />
              </div>
            </>
          ) : (

            <Button
              onClick={handleBackHome}
              variant="secondary"
              className="mt-6 px-6 py-3 "
            >
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
