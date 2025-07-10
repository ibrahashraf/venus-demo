import Header from "@/components/Header";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "@/contexts/CartContext";
import axios from "axios";
import { event } from "@/lib/gtag";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export default function PaymentStatus() {
  const { clearCart } = useContext(CartContext);
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    if (!router.isReady) return;
    console.log("Router query:", router.query); // Debugging line
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
      const response = await axios.get(`/api/order-status?id=${order_id}`);
      const order = response.data;
      clearCart();
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
      message: "تم الدفع بنجاح. شكراً لطلبك!",
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
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <div className="flex flex-col items-center space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          {statusDetails[status].icon}
          <h1 className={`text-3xl font-bold ${statusDetails[status].color}`}>
            {statusDetails[status].message}
          </h1>
          <button
            onClick={handleBackHome}
            className="mt-6 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold rounded-full transition shadow-md"
          >
            العودة إلى الرئيسية
          </button>
        </div>
      </div>
    </>
  );
}
