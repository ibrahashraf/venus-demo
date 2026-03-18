import { useState } from "react";
import Link from "next/link";
import TestimonialModal from "@/components/modals/TestimonialModal";
import Head from "next/head";

export default function ThankYouPage() {
  const [showModal, setShowModal] = useState(false); 
  return (
    <>
    <Head>
      <title>Thank You | Venus Outlet</title>
      <meta
        name="description"
        content="Thank you for your order! Your order has been received successfully and we will contact you soon."
      />
    </Head>
      <div>
        <div className="flex flex-col items-center justify-center text-center py-20 px-5">
          <h1 className="text-4xl font-bold mb-4 text-green-600">Thank You for Your Order!</h1>
          <p className="text-xl mb-6">
            Your order has been received successfully and we will contact you soon.
          </p>
          <Link href="/Orders" className="text-white bg-black px-4 py-2 rounded-sm hover:bg-white hover:text-black border border-black transition">
            View Orders
          </Link>
          <div className="mt-5">
            <button
              onClick={() => setShowModal(true)}
              className="text-white bg-green-600 px-4 py-2 rounded-sm hover:bg-green-700 transition"
            >
              Leave Us a Review
            </button>
            <TestimonialModal isOpen={showModal} onClose={() => setShowModal(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
