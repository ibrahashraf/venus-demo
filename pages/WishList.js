import React, { useContext, useEffect, useState } from "react";
import { WishListContext } from "@/contexts/WishListContext";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { HeartOff } from "lucide-react";
import { PuffLoader } from "react-spinners";
import ProductBox from "@/components/ProductBox";
import Footer from "@/components/Footer";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";
import Head from "next/head";

export default function WishListPage() {
    const { wishlist } = useContext(WishListContext);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [wishlist]);

    return (
        <>
        <Head>
            <title>فينوس اوتليت | قائمة المفضلة</title>
            <meta
                name="description"
                content="قائمة المفضلة في فينوس اوتليت"
            />
        </Head>
            <Header />
            <ErrorBoundary>
                {!isAuthenticated ? (
                    <>
                    <main className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
                        <h1 className="text-3xl font-bold text-center mb-8">قائمة المفضلة</h1>
                        <div className="flex flex-col items-center justify-center text-gray-500 mt-12">
                            <HeartOff className="w-16 h-16 mb-4" />
                            <p className="text-lg">يرجى تسجيل الدخول لرؤية قائمة المفضلة.</p>
                        </div>
                    </main>
                    </>
                ) 
                :(
                <main className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
                    <h1 className="text-3xl font-bold text-center mb-8">قائمة المفضلة</h1>

                    {loading ? (
                        <div className="flex justify-center items-center mt-20">
                            <PuffLoader color="#3b82f6" size={48} aria-label="جاري التحميل..." />
                        </div>
                        ) : wishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 text-gray-500 mt-12">
                            <HeartOff className="w-16 h-16 mb-4" />
                            <p className="text-lg">لا توجد منتجات في قائمة المفضلة</p>
                            <Link href="/Products" className="text-primary  rounded-sm px-5 py-2 mt-4 border border-primary hover:bg-primary hover:text-neutral-50 transition">تصفح المتجر</Link>
                        </div>
                        ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6" role="list">
                            {wishlist.map((item) => (
                            <ProductBox {...item.productId} key={item.productId._id} />
                            ))}
                        </div>
                    )}
                </main>
                )}
            </ErrorBoundary>
            <Footer />
        </>
    );
}
