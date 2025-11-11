import { useEffect, useState, useContext } from "react";
import { PromotionContext } from "@/contexts/PromotionContext";
import CartItems from "./CartItems";
import SignInModal from "../modals/SignInModal";
import ErrorBoundary from "../ErrorBoundary";
import Button from "../ui/Button";

export default function CartFirstStep(
    {   
        products
        ,productsLoading
        ,appliedCoupon
        ,setAppliedCoupon 
        ,appliedPromotions
        ,promotionProgress
        ,subtotal
        ,cart
        ,discountAmount 
        ,couponDiscount
        ,setCouponDiscount
        ,totalBeforeShipping
        ,user
        ,proceedToSecondStep
        ,setShowModal
        ,showModal 
    }
) {
    const {
        applyCode: contextApplyCode,
        removeCode: contextRemoveCode,
        appliedCoupon: ctxAppliedCoupon,
        couponDiscount: ctxCouponDiscount,
        couponError : couponError,
        loading: couponLoading
    } = useContext(PromotionContext);
    const [couponCode, setCouponCode] = useState("");
    const [showForm, setShowForm] = useState(false);
    useEffect(() => {
        if (cart.length === 0) removeCoupon();
    }, [cart]);
    useEffect(() => {
        if (couponCode.trim()) {
          applyCouponSilently();
        }
      }, [cart]);
      
    const applyCoupon = async () => {
         if (!couponCode.trim()) return;
        try {
            await contextApplyCode(couponCode.trim());
            // read appliedCoupon & couponDiscount from context if you need to set local UI
            setAppliedCoupon(ctxAppliedCoupon || null); // optional: keep local state in sync
            setCouponDiscount(ctxCouponDiscount || 0);
        } catch (err) {
            // context handles errors; but fallback client-side
        }
    };
    
    const applyCouponSilently = async () => {
        if (!couponCode.trim()) return;
        try {
            await contextApplyCode(couponCode.trim());
            // silent: do not set error on failure
            setAppliedCoupon(ctxAppliedCoupon || null);
            setCouponDiscount(ctxCouponDiscount || 0);
        } catch (err) {
            console.log("silent coupon apply error", err);
        } 
    };
    
      const removeCoupon = () => {
        contextRemoveCode();
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode("");
      };
      const prog = promotionProgress[0];
    
    return (
            <div className="grid grid-cols-1 lg:max-w-[85%] lg:mx-auto lg:grid-cols-[3fr_2fr] gap-8 p-6">
                {/* Cart Items */}
                <div className="bg-white shadow rounded-lg p-6 text-right space-y-6">
                    <h1 className="text-3xl font-bold mb-4">المشتريات</h1>
                    { productsLoading 
                        ? (
                            <>
                                <div className="flex gap-5 items-center h-48 w-full">
                                    <div className="relative h-48 aspect-[3/4] skeleton rounded-sm" />
                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="h-6 w-40 skeleton rounded" />
                                        <div className="h-5 w-24 skeleton rounded" />
                                        <div className="h-4 w-28 skeleton rounded" />
                                        <div className="h-4 w-20 skeleton rounded" />
                                        <div className="flex items-center gap-3 mt-2">
                                        <div className="h-8 w-24 skeleton rounded" />
                                        </div>
                                        <div className="h-4 w-28 skeleton rounded mt-2" />
                                    </div>
                                </div>
                                <div className="flex gap-5 items-center h-48 w-full">
                                    <div className="relative h-48 aspect-[3/4] skeleton rounded-sm" />
                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="h-6 w-40 skeleton rounded" />
                                        <div className="h-5 w-24 skeleton rounded" />
                                        <div className="h-4 w-28 skeleton rounded" />
                                        <div className="h-4 w-20 skeleton rounded" />
                                        <div className="flex items-center gap-3 mt-2">
                                        <div className="h-8 w-24 skeleton rounded" />
                                        </div>
                                        <div className="h-4 w-28 skeleton rounded mt-2" />
                                    </div>
                                </div>
                            </>

                        ) : (
                            <ErrorBoundary>
                                <CartItems products={products} />
                            </ErrorBoundary>
                        )
                    } 
                </div>

                {/* Summary */}
                <div className="bg-white shadow rounded-lg p-6 space-y-5 text-right">
                    {!ctxAppliedCoupon ? (
                    <div>
                        {!showForm ? (
                            <button
                            onClick={() => setShowForm(true)}
                            className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-3 rounded hover:bg-gray-200 transition"
                            >
                            هل تملك كود خصم؟
                            </button>
                        ) : (
                            <div>
                            <label className="font-medium block mb-1">أدخل كود الخصم</label>
                            <div className="space-y-2">
                                <input
                                type="text"
                                placeholder="أدخل كود الخصم"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="w-full rounded-sm p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
                                />
                                <button
                                onClick={applyCoupon}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={couponLoading || !couponCode.trim()}
                                >
                                {couponLoading ? "جاري التحقق..." : "تفعيل الكوبون"}
                                </button>
                                {couponError && <p className="text-red-500">{couponError}</p>}
                                <button
                                onClick={() => setShowForm(false)}
                                className="text-sm text-gray-500 underline"
                                >
                                إخفاء
                                </button>
                            </div>
                            </div>
                        )}
                        </div>
                    ) : (
                    <div className="flex items-center justify-between bg-green-100 text-green-800 px-4 py-2 rounded">
                        <span>تم تطبيق الكوبون: {ctxAppliedCoupon.code}</span>
                        <button onClick={removeCoupon} className="text-red-500 hover:underline">
                            إزالة   
                        </button>
                    </div>
                    )}

                    {/* Totals */}
                    <div className="space-y-3 border-t pt-4">
                        { appliedPromotions.length > 0 && (
                            <div className="bg-green-50 border border-green-300 p-4 rounded mt-4">
                                <h2 className="font-bold text-green-800 mb-2">خصومات مفعلة</h2>
                                <ul className=" ml-6 text-green-700">
                                    {appliedPromotions.map((promo) => (
                                    <li className="mb-2 text-sm " key={promo._id}>
                                        {promo.title} —{" "}
                                        { `${promo.discountValue}${
                                            promo.discountType === "percentage" ? "%" : " جنيه " } خصم`}
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {/* progress */}
                        {!ctxAppliedCoupon && appliedPromotions.length === 0 && prog && (
                            <div className="bg-blue-50 border border-blue-300 p-4 rounded mt-4">

                                <div className="mb-4 text-md text-blue-700">
                                {prog.promotionType === "minSubtotal" ? (
                                    <>أضف <span className="font-bold text-blue-800">{prog.remainingSubtotal} جنيه</span> للوصول إلى عرض <span className="font-semibold">{prog.title}</span></>
                                ) : (
                                    <>أضف <span className="font-bold text-blue-800">{prog.remainingQuantity}</span> منتجات للوصول إلى عرض <span className="font-semibold">{prog.title}</span></>
                                )}
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-3 transition-all duration-500"
                                    style={{
                                    width: `${
                                        prog.promotionType === "minSubtotal"
                                        ? ((prog.minSubtotal - prog.remainingSubtotal) / prog.minSubtotal) * 100
                                        : ((prog.minQuantity - prog.remainingQuantity) / prog.minQuantity) * 100
                                    }%`
                                    }}
                                />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between text-lg">
                            <span>{subtotal} L.E</span>
                            <span>مجموع ({cart.length}) منتجات</span>
                        </div>

                        {(discountAmount + couponDiscount) > 0 && (
                            <div className="flex justify-between text-lg text-green-600">
                                <span>{ discountAmount} - L.E </span> 
                                <span>خصم</span>
                            </div>
                        )}

                        <div className="flex justify-between text-xl font-bold border-t pt-3">
                            <span>{totalBeforeShipping} L.E</span>
                            <span>الإجمالي</span>
                        </div>
                        <div>باستثناء الشحن</div>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full  font-semibold py-3 rounded-md"
                        onClick={() => (user ? proceedToSecondStep() : setShowModal(true))}
                    >
                        الذهاب للدفع
                    </Button>
                </div>
                {showModal && <SignInModal onClose={() => setShowModal(false)} />}
            </div>
    );
}