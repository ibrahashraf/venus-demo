import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import TestimonialModal from "@/components/TestimonialModal";

export default function ThankYouPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Header />
      <div>
        <div className="flex flex-col items-center justify-center text-center py-20 px-5">
          <h1 className="text-4xl font-bold mb-4 text-green-600">شكراً لطلبك!</h1>
          <p className="text-xl mb-6">
            تم استلام طلبك بنجاح وسنتواصل معك قريباً لتأكيد الطلب والتوصيل.
          </p>
          <Link href="/" className="text-white bg-black px-6 py-3 rounded-full hover:bg-white hover:text-black border border-black transition">
            العودة إلى الصفحة الرئيسية
          </Link>
          <div className="mt-10">
            <button
              onClick={() => setShowModal(true)}
              className="text-white bg-green-600 px-6 py-3 rounded-full hover:bg-green-700 transition"
            >
              اترك لنا تقييمك
            </button>
            <TestimonialModal isOpen={showModal} onClose={() => setShowModal(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
