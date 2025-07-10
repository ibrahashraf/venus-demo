import axios from "axios";
import { useEffect, useState } from "react";
import { Order } from "@/models/Order";
import Header from "@/components/Header";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { mongooseConnect } from "@/lib/mongoose";



export default function OrderCancelPage({ order }) {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");



    if (!order) return <p className="text-center py-10">Order not found</p>;
    const sendRequest = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/orders/${order._id}`, { reason });
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            setLoading(false);
            toast.success("تم إرسال الطلب بنجاح");
            setTimeout(() => {
                window.location.href = "/Orders";
            }, 1000);
        }
    }
    return (
        <>
            <Header />
            <div>
                <h1 className="text-3xl font-bold mb-6 text-center">طلب إلغاء الطلب</h1>
                <div className="max-w-3xl mx-auto py-10">
                <div className="border rounded-lg p-5 mb-4 shadow-md bg-white">
                    <h2 className="text-xl font-semibold mb-2">طلب رقم #{order._id}</h2>
                    <textarea
                        className="w-full h-32 p-2 border rounded-lg mb-4"
                        placeholder="يرجى كتابة سبب إلغاء الطلب هنا..."
                        onChange={(e) => setReason(e.target.value)}
                        value={reason}
                    />
                    {loading ? (
                        <ClipLoader
                            color="#000"
                            loading={loading}
                            size={30}
                            className="mx-auto"
                        />
                    ) : (
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded"
                            onClick={sendRequest}
                        >
                            ارسال
                        </button>
                    )}
                    
                </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.params;
    const order = await Order.findById(id);
    if (!order) {
        return {
        notFound: true,
        };
    }
    return {
        props: {
        order: JSON.parse(JSON.stringify(order)),
        },
    };
}