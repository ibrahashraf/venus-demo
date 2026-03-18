import Head from "next/head";

export default function TermsOfService() {
    return (
      <>
      <Head>
        <title>Terms of Service | Venus Outlet</title>
        <meta
          name="description"
          content="Contact Venus Outlet for inquiries, complaints, or collaboration. Visit our branches in Mansoura and Alexandria."
        />
      </Head>
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="mb-4">
            Welcome to Venus Outlet! By using our website, you agree to the following terms and conditions.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Orders</h2>
          <p className="mb-4">
            All orders are subject to availability and confirmation. We reserve the right to cancel any order at our discretion.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Pricing</h2>
          <p className="mb-4">
            All prices are listed in Egyptian Pounds (EGP). Prices may change without notice.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Shipping</h2>
          <p className="mb-4">
            We currently ship only within Egypt. Shipping fees and estimated delivery times will be shown during checkout.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Returns & Refunds</h2>
          <p className="mb-4">
            You may return items within 14 days of receiving your order. Items must be unused and in original condition. Please contact us to initiate a return.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">5. User Conduct</h2>
          <p className="mb-4">
            You agree not to misuse our site, attempt to hack it, or violate any laws in connection with its use.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Limitation of Liability</h2>
          <p className="mb-4">
            Venus Outlet is not liable for any indirect or consequential damages resulting from the use of our services.
          </p>
    
          <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
          <p className="mb-4">
            For any questions, please email us at: <strong>support@venusoutlet.com</strong>
          </p>
        </div>
      </>
    );
  }
  