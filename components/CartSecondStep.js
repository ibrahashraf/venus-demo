import CheckoutItems from "@/components/CheckoutItems";
import ShippingForm from "@/components/ShippingForm";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { event } from "@/lib/gtag";
import { useContext } from "react";
import { CartContext } from "@/contexts/CartContext";
import { LockIcon } from "lucide-react"; 
import { Edit, Lock } from "@mui/icons-material";

export default function CartSecondStep( { 
  products, 
  cart, 
  subtotal, 
  discountAmount, 
  total, 
  state, 
  dispatch, 
  shippingOptions, 
  setShippingOptions, 
  setCartStep, 
  editMode,
  setEditMode,
  shippingCost,
  estimatedDelivery,
  totalBeforeDiscount,
  appliedPromotions,
  appliedCoupon,
  appliedCouponDiscount,
} ) {
  
  const [rememberAddress, setRememberAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Pay on Delivery");
  const { clearCart } = useContext(CartContext);
  const hasPopulated = useRef(false);


  

  const proceedToThirdStep = async () => {
    setCartStep("third");
  };
  const submitForm = async (localState) => {
    if (
      !localState.name ||
      !localState.phone ||
      !localState.address ||
      !localState.city ||
      !localState.governorate
    ) {
      alert("يرجى ملء جميع الحقول");
      return;
    }
    try {
      await axios.put("/api/shipping-info", {
        name: localState.name,
        phone: localState.phone,
        address: localState.address,
        city: localState.city,
        governorate: localState.governorate,
      });
    } catch (err) {
      console.error("Error saving address", err);
    }
    dispatch({ type: "SET_ALL_FIELDS", payload: localState });
    setEditMode(false);
  }

  const goToPayment = async () => {
    if (!state.name || !state.phone || !state.address || !state.city || !state.governorate || editMode) {
      alert("يرجى ملء جميع الحقول");
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
      const res = await axios.post("/api/checkout", {
        name: state.name,
        phone: state.phone,
        address: state.address,
        city: state.city,
        governorate: state.governorate,
        cart,
        subtotal,
        shippingCost: state.shippingCost,
        totalBeforeDiscount,
        promotionIds: [
          ...(Array.isArray(appliedPromotions) ? appliedPromotions.map(p => p._id) : []),
          ...(appliedCoupon ? [appliedCoupon._id] : []),
        ],
        discount: appliedCouponDiscount || discountAmount,
        total,
        paymentMethod: paymentMethod,
        CouponCode: appliedCoupon,
      });
      if (paymentMethod === "Pay on Delivery") {
        window.location.href = "/thank-you";
        clearCart();
      } else if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      alert("حدث خطأ أثناء معالجة الطلب");
        console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:max-w-[85%] lg:mx-auto lg:grid-cols-[3fr_2fr] gap-8 p-6">
      {/* Cart Items */}
      <div className="bg-white shadow rounded-sm p-6 text-right space-y-6">
        <CheckoutItems products={products} />
      </div>
    
      {/* Checkout Form */}
      <div className="bg-white shadow  rounded-sm p-6 space-y-5 text-right">
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
              setShippingOptions={setShippingOptions}
              setRememberAddress={setRememberAddress}
              rememberAddress={rememberAddress}
            />
          </>
        )}

              
        {/* Totals */}
        <div className="border-y">
          <label className={`flex items-center gap-2 py-4 px-4 border-b rounded-sm ${paymentMethod === "Card" ? "bg-neutral-100" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Paymob"
              checked={paymentMethod === "Card"}
              onChange={() => setPaymentMethod("Card")}
            />
            <span>الدفع ببطاقة ائتمان</span>
          </label>
          <label className={`flex items-center gap-2 py-4 px-4 border-b rounded-sm ${paymentMethod === "Wallet" ? "bg-neutral-100" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Paymob"
              checked={paymentMethod === "Wallet"}
              onChange={() => setPaymentMethod("Wallet")}
            />
            <span>الدفع من المحفظة الالكترونية</span>
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
              <span>-{discountAmount} L.E</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold border-t pt-3">
            <span>الإجمالي</span>
            <span>{total} L.E</span>
          </div>
        </div>
        <button
          className={`w-full bg-black text-white font-bold py-3 rounded-md border-black border hover:bg-white  hover:text-black transition`}
          onClick={goToPayment}
        >
            المواصلة للدفع  
          <Lock fontSize="small" />
        </button>
                
      </div>
    </div>
  );
}