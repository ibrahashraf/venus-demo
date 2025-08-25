import CheckoutItems from "@/components/CheckoutItems";
import ShippingForm from "@/components/ShippingForm";
import { useRef, useState } from "react";
import { event } from "@/lib/gtag";
import { useContext } from "react";
import { CartContext } from "@/contexts/CartContext";
import { Edit, Lock } from "@mui/icons-material";
import ErrorBoundary from "./ErrorBoundary";
import axiosClient from "@/lib/axiosClient";
import { PuffLoader } from "react-spinners";
import Button from "./ui/Button";

export default function CartSecondStep( { 
  products, 
  cart, 
  subtotal, 
  discountAmount, 
  total, 
  state, 
  dispatch, 
  shippingOptions, 
  setCartStep, 
  editMode,
  setEditMode,
  shippingCost,
  estimatedDelivery,
  totalBeforeDiscount,
  appliedPromotions,
  appliedCoupon,
  couponDiscount,
} ) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Pay on Delivery");
  const { clearCart } = useContext(CartContext);
  const hasPopulated = useRef(false);


  const proceedToThirdStep = async () => {
    setCartStep("third");
  };
  const submitForm = async (localState) => {
    try {
      await axiosClient.put("/api/shipping-info", {
        name: localState.name,
        phone: localState.phone,
        address: localState.address,
        city: localState.city,
        governorate: localState.governorate,
      }, {skipRedirect: true});
    } catch (err) {
      console.error("Error saving address", err);
      setFormError("حدث خطأ في حفظ البيانات");
      setTimeout(() => setFormError(null), 3000);
    }
    dispatch({ type: "SET_ALL_FIELDS", payload: localState });
    setEditMode(false);
  }

  const goToPayment = async () => {
    if (editMode) {
      setFormError("يرجى حفظ بيانات الشحن");
      setTimeout(() => setFormError(null), 3000);
      return;
    }
      
    setIsLoading(true);
            
    event({
      action: "begin_checkout",
      params: {
        send_to: process.env.GANALYTICS_ID,
        currency: "EGP",
        value: total,
        items: cart.map(item => ({
          item_id: item.productId || item._id,
          item_name: item.title,
          currency: "EGP",
          price: item.price,
          quantity: item.quantity || 1,
          item_category: item.category,
        })),
      },
    });
      
    try {
      const res = await axiosClient.post("/api/checkout", {
        name: state.name,
        phone: state.phone,
        address: state.address,
        city: state.city,
        governorate: state.governorate,
        cart,
        subtotal,
        shippingCost,
        totalBeforeDiscount,
        promotionIds: appliedPromotions.map(promotion => promotion._id) || [],
        discount: discountAmount,
        total,
        paymentMethod: paymentMethod,
        couponCodeId: appliedCoupon?._id || null,
      }, {skipRedirect: true});
      if (paymentMethod === "Pay on Delivery") {
        window.location.href = "/thank-you";
        clearCart();
      } else if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      setFormError("حدث خطأ في الدفع");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:max-w-[85%] lg:mx-auto lg:grid-cols-[3fr_2fr] gap-8 p-6">
      {/* Cart Items */}
      <div className="bg-secondary shadow rounded-sm p-6 text-right space-y-6">
        <ErrorBoundary>
          <CheckoutItems products={products} />
        </ErrorBoundary>
      </div>
    
      {/* Checkout Form */}
      <div className="bg-secondary shadow  rounded-sm p-6 space-y-5 text-right">
        <h2 className="text-2xl font-bold mt-0">معلومات التوصيل</h2>
        {!editMode ? (
          <div className="space-y-2 border relative rounded-sm p-4">
            <p><strong>الاسم:</strong> {state.name}</p>
            <p><strong>رقم الهاتف:</strong> {state.phone}</p>
            <p><strong>العنوان:</strong> {state.address}</p>
            <p><strong>المدينة:</strong> {state.city}</p>
            <p><strong>المحافظة:</strong> {state.governorate}</p>
            <button
              className=" text-blue-600 absolute top-4 left-4"
              onClick={() => setEditMode(true)}
            >
              تعديل <Edit fontSize="small" />
            </button>
          </div>
        ) : (
          <>
            <ShippingForm
              state={state}
              onSubmit={submitForm}
              shippingOptions={shippingOptions}
            />
          </>
        )}

              
        {/* Totals */}
        <div className="border-y">
          <label className={`flex items-center gap-2 py-4 px-4 border-b rounded-sm ${paymentMethod === "Paymob" ? "bg-neutral-100" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Paymob"
              checked={paymentMethod === "Paymob"}
              onChange={() => setPaymentMethod("Paymob")}
            />
            <span>الدفع ببطاقة ائتمان</span>
          </label>
          <label className={`flex items-center gap-2 py-4 px-4  rounded-sm ${paymentMethod === "Pay on Delivery" ? "bg-neutral-100"  : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Pay on Delivery"
              checked={paymentMethod === "Pay on Delivery"}
              onChange={() => setPaymentMethod("Pay on Delivery")}
            />
            <span>الدفع عند الاستلام</span>
          </label>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span>مجموع ({cart.length}) منتجات</span>
            <span>{subtotal} L.E</span>
          </div>
          {shippingCost > 0 && (
            <div className="flex justify-between text-lg">
              <span>تكلفة الشحن</span>
              <span>{shippingCost} L.E</span>
            </div>
          )}
          {estimatedDelivery && (
            <div className="flex justify-between text-lg">
              <span>موعد التسليم المتوقع</span>
              <span>{estimatedDelivery}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex justify-between text-lg text-green-600">
              <span>خصم</span>
              <span>{couponDiscount || discountAmount} L.E -</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold border-t pt-3">
            <span>الإجمالي</span>
            <span>{total} L.E</span>
          </div>
        </div>
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{formError}</span>
          </div>
        )}
        <Button
          variant="primary"
          className={`w-full font-semibold py-3 text-lg `}
          onClick={goToPayment}
          disabled={isLoading}
        >
          {isLoading ? (
            'جاري التحميل'
            ) : paymentMethod === 'Pay on Delivery' 
            ? 'اتمام الطلب' 
            : (<> الذهاب للدفع <Lock fontSize="small" /></>)
          }
        </Button>
      </div>
    </div>
  );
}