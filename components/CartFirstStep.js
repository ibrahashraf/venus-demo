import { useEffect } from "react";
import CartItems from "./CartItems";
import SignInModal from "./SignInModal";

export default function CartFirstStep(
    {   
        products
        ,appliedCoupon
        ,setAppliedCoupon
        ,couponCode
        ,setCouponCode
        ,isApplyingCoupon
        ,setIsApplyingCoupon
        ,couponError
        ,setCouponError
        ,appliedPromotions
        ,subtotal
        ,cart
        ,discountAmount
        ,couponDiscount
        ,totalBeforeShipping
        ,user
        ,proceedToSecondStep
        ,setShowModal
        ,showModal 
    }
) {
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
        setIsApplyingCoupon(true);
        try {
          const res = await axios.post("/api/promotions/applycode", {
            code: couponCode.trim(),
          });
          setAppliedCoupon(res.data);
          setCouponError("");
        } catch (err) {
          setCouponError(err.response?.data?.error || "حدث خطأ ما");
        } finally {
          setIsApplyingCoupon(false);
        }
      };
    
      const applyCouponSilently = async () => {
        if (!couponCode.trim()) return;
        try {
          const res = await axios.post("/api/promotions/applycode", {
            code: couponCode.trim(),
          });
          setAppliedCoupon(res.data);
          setCouponError("");
        } catch {
          // silent fail
        }
      };
    
      const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError("");
      };
    
  return (
        <div className="grid grid-cols-1 lg:max-w-[85%] lg:mx-auto lg:grid-cols-[3fr_2fr] gap-8 p-6">
            {/* Cart Items */}
            <div className="bg-white shadow rounded-lg p-6 text-right space-y-6">
                <h1 className="text-3xl font-bold mb-4">المشتريات</h1>
                <CartItems products={products} />
            </div>

            {/* Summary */}
            <div className="bg-white shadow rounded-lg p-6 space-y-5 text-right">
                {!appliedCoupon ? (
                <>
                    <label className="font-medium block mb-1">هل تملك كود خصم؟</label>
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
                            disabled={isApplyingCoupon || !couponCode.trim()}
                        >
                            {isApplyingCoupon ? "جاري التحقق..." : "تفعيل الكوبون"}
                        </button>
                        {couponError && <p className="text-red-500">{couponError}</p>}
                    </div>
                </>
                ) : (
                <div className="flex items-center justify-between bg-green-100 text-green-800 px-4 py-2 rounded">
                    <span>تم تطبيق الكوبون: {couponCode}</span>
                    <button onClick={removeCoupon} className="text-red-500 hover:underline">
                        إزالة   
                    </button>
                </div>
                )}

                {/* Totals */}
                <div className="space-y-3 border-t pt-4">
                    {!appliedCoupon && appliedPromotions.length > 0 && (
                        <div className="bg-green-50 border border-green-300 p-4 rounded mt-4">
                            <h2 className="font-bold text-green-800 mb-2">خصومات مفعلة</h2>
                            <ul className=" ml-6 text-green-700">
                                {appliedPromotions.map((promo) => (
                                <li className="mb-2 text-sm " key={promo._id}>
                                    {promo.title} —{" "}
                                    {promo.promotionType === "bogo"
                                    ? `اشترِ ${promo.buyQty} واحصل على ${promo.getQty}`
                                    : `${promo.discountValue}${
                                        promo.discountType === "percentage" ? "%" : " جنيه"
                                        } خصم`}
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-between text-lg">
                        <span>{subtotal} L.E</span>
                        <span>مجموع ({cart.length}) منتجات</span>
                    </div>

                    {(discountAmount + couponDiscount) > 0 && (
                        <div className="flex justify-between text-lg text-green-600">
                            <span>-{couponDiscount || discountAmount} L.E</span>
                            <span>خصم</span>
                        </div>
                    )}

                    <div className="flex justify-between text-xl font-bold border-t pt-3">
                        <span>{totalBeforeShipping} L.E</span>
                        <span>الإجمالي</span>
                    </div>
                    <div>باستثناء الشحن</div>
                </div>

                <button
                    className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-white hover:text-black hover:border hover:border-black transition"
                    onClick={() => (user ? proceedToSecondStep() : setShowModal(true))}
                >
                    الذهاب للدفع
                </button>
            </div>
            {showModal && <SignInModal onClose={() => setShowModal(false)} />}
        </div>
  );
}