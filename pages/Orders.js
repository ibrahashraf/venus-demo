import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import ErrorBoundary from "@/components/ErrorBoundary";
import axiosClient from "@/lib/axiosClient";
import Head from "next/head";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      axiosClient.get("/api/orders").then(res => {
        setOrders(res.data);
      }).catch(err => console.log(err)).finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading") return (
    <>
      <p className="text-center py-10">Loading...</p>
    </>
  );
  if (status === "unauthenticated") return (
    <>
      <p className="text-center py-10">Please log in to view your orders.</p>
    </>
  );

  return (
    <>
    <Head>
      <title>Previous Orders | Venus Outlet</title>
      <meta
        name="description"
        content="List of previous orders for the user"
      />
    </Head>
      <ErrorBoundary>
        <div className="max-w-3xl mx-auto py-10 min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-6 text-center">Previous Orders</h1>
          {loading 
            ? (
            
              <div className="border rounded-lg p-10 mb-4 shadow-md bg-white">
                <div className="h-6 w-32 bg-gray-300 rounded skeleton"></div>
                <div className="flex gap-2 mt-2">
                  <div className="h-4 w-16 bg-gray-300 rounded skeleton"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded skeleton"></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-4 w-16 bg-gray-300 rounded skeleton"></div>
                  <div className="h-4 w-28 bg-gray-300 rounded skeleton"></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-4 w-20 bg-gray-300 rounded skeleton"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded skeleton"></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-4 w-16 bg-gray-300 rounded skeleton"></div>
                  <div className="h-4 w-40 bg-gray-300 rounded skeleton"></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-4 w-20 bg-gray-300 rounded skeleton"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded skeleton"></div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="h-4 w-16 bg-gray-300 rounded skeleton"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded skeleton"></div>
                </div>
                <div className="flex gap-2 mt-2 mb-4">
                  <div className="h-4 w-20 bg-gray-300 rounded skeleton"></div>
                  <div className="h-4 w-8 bg-gray-300 rounded skeleton"></div>
                </div>
                <div className="h-5 w-28 bg-gray-300 rounded skeleton"></div>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-600">No orders found.</p>
            ) : (
              orders.map((order, i) => (
                <div key={order._id} className="border rounded-lg p-10 mb-4 shadow-md bg-white">
                  <h2 className="text-xl font-semibold mb-2 text-left" dir="ltr">{new Date(order.createdAt).toLocaleTimeString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</h2>
                  <p><strong>Status</strong> : {order.status}</p>
                  <p><strong>Name</strong> : {order.name}</p>
                  <p><strong>Phone Number:</strong> {order.phone}</p>
                  <p><strong>Address</strong> : {order.address}, {order.city}, {order.governorate}</p>
                  <p><strong>Payment Method</strong> : {order.paymentMethod}</p>
                  <p><strong>Total</strong> : EGP {order.total}</p>
                  <p><strong>Payment Status</strong> : {order.paid ? "Paid" : "Not Paid"}</p>
                  { ( order.status === "Pending" || order.status === "Confirmed") && 
                  ( order.cancellationRequest.status === "none" ) ? (
                    <Link 
                      href={`/orders/${order._id}`}
                      className=" text-accent block text-start w-fit mt-4"
                    >
                      Request Cancellation
                    </Link>
                  ) : (order.cancellationRequest.status === "requested") ? (
                    <p className="mt-4 text-yellow-500">Cancellation request submitted.</p>
                  ) : (order.cancellationRequest.status === "approved") ? (
                    <p className="mt-4 text-green-500">Order cancelled.</p>
                  ) : (order.cancellationRequest.status === "denied") ? (
                    <p className="mt-4 text-red-500">Cancellation request denied.</p>
                  ) : null
                  }
                  <div className="font-bold text-primary">
                  { order.paid && order.status !== "Cancelled" && (<PDFDownloadLink document={<InvoicePDF order={order} />} fileName={`invoice${order._id}.pdf`}>
                      {({ loading }) => (loading ? "...." : "Download Invoice")}
                    </PDFDownloadLink>)}
                  </div>
                </div>
              ))
            )
          }
        </div>
      </ErrorBoundary>
    </>
  );
}
