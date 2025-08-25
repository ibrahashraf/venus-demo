import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";

export default function PrivacyPolicy() {
    return (
      <>
        <Head>
          <title>سياسة الخصوصية | Venus Outlet فينوس اوتليت</title>
          <meta
            name="description"
            content="اطلع على سياسة الخصوصية الخاصة بـ Venus Outlet فينوس اوتليت لمعرفة كيفية حماية بياناتك واستخدامها."
          />
        </Head>
        <Header />
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="mb-4">
            At Venus Outlet, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Personal information (e.g., name, email, phone number, shipping address)</li>
            <li>Payment details (processed securely via third-party gateways)</li>
            <li>Usage data (pages visited, time spent, etc.)</li>
          </ul>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To process and fulfill your orders</li>
            <li>To improve our website and services</li>
            <li>To communicate with you about your orders or promotions</li>
          </ul>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing Your Information</h2>
          <p className="mb-4">
            We do not sell or rent your personal information. We may share it with trusted third parties like payment processors and delivery services to complete your orders.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies</h2>
          <p className="mb-4">
            We use cookies to enhance your experience, analyze site traffic, and serve personalized content.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
          <p className="mb-4">
            You may request access to, update, or delete your personal information by contacting us.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions, please email us at: <strong>support@venusoutlet.com</strong>
          </p>
        </div>
        <Footer />
      </>
    );
  }
  