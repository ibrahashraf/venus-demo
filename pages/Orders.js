// pages/orders.js
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Link from "next/link";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (status === "authenticated") {
      axios.get("/api/orders").then(res => {
        setOrders(res.data);
      });
    }
  }, [status]);

  if (status === "loading") return (
    <>
      <Header />
      <p className="text-center py-10">Loading...</p>
    </>
  );
  if (status === "unauthenticated") return (
    <>
      <Header />
      <p className="text-center py-10">يرجى تسجيل الدخول لعرض الطلبات</p>
    </>
  );

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">الطلبات السابقة</h1>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">لا توجد طلبات حتى الآن</p>
        ) : (
          orders.map((order, i) => (
            <div key={order._id} className="border rounded-lg p-5 mb-4 shadow-md bg-white">
              <h2 className="text-xl font-semibold mb-2">طلب رقم #{i + 1}</h2>
              <p> {order.status} :<strong>الحالة</strong></p>
              <p> {order.name} :<strong>الإسم</strong></p>
              <p><strong>رقم الهاتف:</strong> {order.phone}</p>
              <p> {order.address}, {order.city}, {order.governorate} :<strong>العنوان</strong></p>
              <p> {order.paymentMethod} :<strong>طريقة الدفع</strong></p>
              <p> EGP {order.subtotal} :<strong>الإجمالي</strong></p>
              <p><strong>تم الدفع:</strong> {order.paid ? "نعم" : "لا"}</p>
              { ( order.status === "Pending" || order.status === "Confirmed") && 
              ( order.cancellationRequest.status === "none" ) ? (
                <Link 
                  href={`/orders/${order._id}`}
                  className=" bg-red-500 text-white py-2 px-4 rounded"
                >
                  طلب إلغاء الطلب
                </Link>
              ) : (order.cancellationRequest.status === "requested") ? (
                <p className="mt-4 text-yellow-500">تم إرسال طلب الإلغاء.</p>
              ) : (order.cancellationRequest.status === "approved") ? (
                <p className="mt-4 text-green-500">تم الغاء الطلب.</p>
              ) : (order.cancellationRequest.status === "denied") ? (
                <p className="mt-4 text-red-500">تم رفض طلب الإلغاء.</p>
              ) : null
              }
            </div>
          ))
        )}
      </div>
    </>
  );
}
