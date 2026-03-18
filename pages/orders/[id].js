import { useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import Error from "../_error";
import axiosClient from "@/lib/axiosClient";
import Head from "next/head";



export default function OrderCancelPage({ order, error, statusCode }) {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");


    if (error) return <Error statusCode={statusCode || 500} />;
    if (!order) return <p className="text-center py-10">Order not found</p>;
    const sendRequest = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post(`/api/orders/${order._id}`, { reason });
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            setLoading(false);
            toast.success("Cancellation request sent successfully");
            setTimeout(() => {
                window.location.href = "/Orders";
            }, 1000);
        }
    }
    return (
        <>
        <Head>
            <title>Request Cancellation | Venus Outlet</title>
            <meta
                name="description"
                content="Request cancellation for your order at Venus Outlet."
            />
        </Head>
            <ErrorBoundary>
                <div>
                    <h1 className="text-3xl font-bold my-6 text-center">Request Cancellation</h1>
                    <div className="max-w-3xl mx-auto py-10">
                    <div className="border rounded-lg p-5 mb-4 shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-2">Order Number #{order._id}</h2>
                        <textarea
                            className="w-full h-32 p-2 border rounded-lg mb-4 outline-none"
                            placeholder="Please write the reason for cancellation here..."
                            onChange={(e) => setReason(e.target.value)}
                            value={reason}
                        />
                        {loading ? (
                            <PuffLoader
                                color="#000"
                                loading={loading}
                                size={50}
                                className="mx-auto"
                            />
                        ) : (
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded"
                                onClick={sendRequest}
                            >
                                Send Request
                            </button>
                        )}
                        
                    </div>
                    </div>
                </div>
            </ErrorBoundary>
        </>
    );
}

export async function getServerSideProps(context) {
    try {
        const { id } = context.params;
        const { data } = await axiosClient.get(`${process.env.WEBSITE_URL}/api/orders/${id}`); 
        return {
            props: {
                order: data || null,
                error: null,
                statusCode: null,
            },
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            props: {
                order: null,
                error: "An error occurred",
                statusCode: 500,
            },
        };
    }
}