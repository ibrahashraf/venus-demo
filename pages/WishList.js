import React, { useContext, useEffect, useState } from "react";
import { WishListContext } from "@/contexts/WishListContext";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { HeartOff } from "lucide-react";
import { ClipLoader } from "react-spinners";
import ProductBox from "@/components/ProductBox";

export default function WishListPage() {
    const { wishlist, removeFromWishlist } = useContext(WishListContext);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [wishlist]);

    return (
        <>
        <Header />
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
                <ClipLoader color="#3b82f6" size={48} aria-label="جاري التحميل..." />
            </div>
            ) : wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 mt-12">
                <HeartOff className="w-16 h-16 mb-4" />
                <p className="text-lg">لا توجد منتجات في قائمة المفضلة.</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
                {wishlist.map((item) => (
                <ProductBox {...item.productId} key={item.productId._id} />
                ))}
            </div>
            )}
        </main>
        )}
        </>
    );
}
