import { useState } from "react";
import Link from "next/link";
import TestimonialModal from "@/components/modals/TestimonialModal";
import Head from "next/head";

export default function ThankYouPage() {
  const [showModal, setShowModal] = useState(false); 
  return (
    <>
    <Head>
      <title>شكراً لك | Venus Outlet</title>
      <meta
        name="description"
        content="شكراً لطلبك! تم استلام طلبك بنجاح وسنتواصل معك قريباً."
      />
    </Head>
      <div>
        <div className="flex flex-col items-center justify-center text-center py-20 px-5">
          <h1 className="text-4xl font-bold mb-4 text-green-600">شكراً لطلبك!</h1>
          <p className="text-xl mb-6">
            تم استلام طلبك بنجاح وسنتواصل معك قريباً.
          </p>
          <Link href="/Orders" className="text-white bg-black px-4 py-2 rounded-sm hover:bg-white hover:text-black border border-black transition">
            عرض الطلبات
          </Link>
          <div className="mt-5">
            <button
              onClick={() => setShowModal(true)}
              className="text-white bg-green-600 px-4 py-2 rounded-sm hover:bg-green-700 transition"
            >
              اترك لنا تقييماً
            </button>
            <TestimonialModal isOpen={showModal} onClose={() => setShowModal(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
