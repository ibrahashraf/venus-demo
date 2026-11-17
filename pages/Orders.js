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
      <p className="text-center py-10">جاري التحميل...</p>
    </>
  );
  if (status === "unauthenticated") return (
    <>
      <p className="text-center py-10">يرجى تسجيل الدخول لعرض طلباتك.</p>
    </>
  );

  return (
    <>
    <Head>
      <title>الطلبات السابقة | Venus Outlet</title>
      <meta
        name="description"
        content="قائمة الطلبات السابقة للمستخدم"
      />
    </Head>
      <ErrorBoundary>
        <div className="max-w-3xl mx-auto py-10 min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-6 text-center">الطلبات السابقة</h1>
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
              <p className="text-center text-gray-600">لا توجد طلبات.</p>
            ) : (
              orders.map((order, i) => (
                <div key={order._id} className="border rounded-lg p-10 mb-4 shadow-md bg-white">
                  <h2 className="text-xl font-semibold mb-2 text-left" dir="ltr">{new Date(order.createdAt).toLocaleTimeString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</h2>
                  <p><strong>الحالة</strong> : {({ Pending: "قيد الانتظار", Confirmed: "مؤكد", Cancelled: "ملغي", Shipped: "تم الشحن", Delivered: "تم التوصيل" }[order.status] || order.status)}</p>
                  <p><strong>الاسم</strong> : {order.name}</p>
                  <p><strong>رقم الهاتف:</strong> {order.phone}</p>
                  <p><strong>العنوان</strong> : {order.address}, {order.city}, {order.governorate}</p>
                  <p><strong>طريقة الدفع</strong> : {order.paymentMethod === "Pay on Delivery" ? "الدفع عند الاستلام" : order.paymentMethod === "Paymob" ? "بطاقة ائتمان" : order.paymentMethod}</p>
                  <p><strong>الإجمالي</strong> : {order.total} جنيه</p>
                  <p><strong>حالة الدفع</strong> : {order.paid ? "مدفوع" : "غير مدفوع"}</p>
                  { ( order.status === "Pending" || order.status === "Confirmed") && 
                  ( order.cancellationRequest.status === "none" ) ? (
                    <Link 
                      href={`/orders/${order._id}`}
                      className=" text-accent block text-start w-fit mt-4"
                    >
                      طلب إلغاء
                    </Link>
                  ) : (order.cancellationRequest.status === "requested") ? (
                    <p className="mt-4 text-yellow-500">تم إرسال طلب الإلغاء.</p>
                  ) : (order.cancellationRequest.status === "approved") ? (
                    <p className="mt-4 text-green-500">تم إلغاء الطلب.</p>
                  ) : (order.cancellationRequest.status === "denied") ? (
                    <p className="mt-4 text-red-500">تم رفض طلب الإلغاء.</p>
                  ) : null
                  }
                  <div className="font-bold text-primary">
                  { order.paid && order.status !== "Cancelled" && (<PDFDownloadLink document={<InvoicePDF order={order} />} fileName={`invoice${order._id}.pdf`}>
                      {({ loading }) => (loading ? "...." : "تحميل الفاتورة")}
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
