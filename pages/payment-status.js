import Header from "@/components/Header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { event } from "@/lib/gtag";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Footer from "@/components/Footer";
import axiosClient from "@/lib/axiosClient";
import Head from "next/head";
import Link from "next/link";
import TestimonialModal from "@/components/TestimonialModal";
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

  useEffect(() => {
  if (!router.isReady || status !== "success") return;
  const fetchAndTrackOrder = async () => {
    try {
      const { order_id } = router.query;
      const response = await axiosClient.get(`/api/order-status?id=${order_id}`, {skipRedirect: true});
      const order = response.data;
      event({
        action: "purchase",
        params: {
          send_to: process.env.GANALYTICS_ID,
          transaction_id: order_id,
          value: order.total,
          currency: "EGP",
          items: order.items.map(item => ({
            item_id: item.item_id,
            item_name: item.item_name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      });
    } catch (error) {
      console.error("Failed to fetch order or send GA event:", error); 
    }
  };
  fetchAndTrackOrder();
}, [status, router.query, router.isReady]);

  const statusDetails = {
    loading: {
      message: "جارٍ التحقق...",
      icon: <HourglassEmptyIcon className="text-gray-500" style={{ fontSize: 64 }} />,
      color: "text-gray-500",
    },
    success: {
      message: "تم الدفع بنجاح, سيتم التواصل معك قريبا. شكراً لطلبك!",
      icon: <CheckCircleOutlineIcon className="text-green-500" style={{ fontSize: 64 }} />,
      color: "text-green-600",
    },
    error: {
      message: "فشل الدفع. حاول مرة أخرى.",
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
      <title>حالة الدفع | Venus Outlet فينوس اوتليت</title>
      <meta
        name="description"
        content="حالة الدفع في Venus Outlet فينوس اوتليت"
      />
    </Head>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <div className="flex flex-col items-center space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          {statusDetails[status].icon}
          <h1 className={`text-xl font-bold ${statusDetails[status].color}`}>
            {statusDetails[status].message}
          </h1>
          { status === "success" ? (
            <>
             <Link href="/Orders" className="text-white bg-black px-4 py-2 rounded-sm hover:bg-white hover:text-black border border-black transition">
                عرض الطلبات
              </Link>
              <div className="mt-5">
                <button
                  onClick={() => setShowModal(true)}
                  className="text-white bg-green-600 px-4 py-2 rounded-sm hover:bg-green-700 transition"
                >
                  اترك لنا تقييمك
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
              العودة إلى الرئيسية
            </Button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
