import { CartContext } from "@/contexts/CartContext";
import { PromotionContext } from "@/contexts/PromotionContext";
import Header from "@/components/Header";
import { useContext, useEffect, useReducer, useState } from "react";
import { event } from "@/lib/gtag";
import axios from "axios";
import Script from 'next/script';
import { useSession } from "next-auth/react";
import { mongooseConnect } from "@/lib/mongoose"; 
import { Product } from "@/models/Product";
import CartItems from "@/components/CartItems";
import CheckOutForm from "@/components/CheckOutForm";

export default function Cart( { products } ) {
    const { cart, clearCart} = useContext(CartContext);
    const { appliedPromotions, discounts } = useContext(PromotionContext);
    const [isLoading, setIsLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    
    const initialState = {
      name: "",
      phone: "",
      address: "",
      city: "",
      governorate: "",
      paymentMethod: "Paymob",
      shippingOptions: [],
      shippingCost: 0,
      estimatedDelivery: "",
    };
    function formReducer(state, action) {
      if (action.type === "SET_FIELD") {
        return {
          ...state,
          [action.field]: action.value,
        };
      } else {
        return state;
      }
    }
    const [state, dispatch] = useReducer(formReducer, initialState);
    const { data: session } = useSession();
    const user = session?.user || null;





    // Fetch shipping options once
    useEffect(() => {
      axios.get("/api/shipping").then(res => dispatch({type: "SET_FIELD", field: "shippingOptions", value: res.data}));
    }, []);

    useEffect(() => {
      if (couponCode.trim()) {
        applyCouponSilently();
      }
    }, [cart]);


    useEffect(() => {
      if (cart.length === 0) {
        removeCoupon();
      }
    }, [cart]);
    

    const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    let discountAmount = discounts.reduce((acc, discount) => acc + discount.discountAmount, 0);
    const couponDiscount = appliedCoupon 
    ? appliedCoupon.discountType === "percentage"
      ? subtotal * (appliedCoupon.discountValue / 100)
      : appliedCoupon.discountValue
    : 0; 
    const totalBeforeDiscount = subtotal + state.shippingCost;
    const total = Math.max(0, subtotal - (couponDiscount || discountAmount) + state.shippingCost);

    const goToPayment = async () => {
      if (!state.name || !state.phone || !state.address || !state.city || !state.governorate) {
        alert("يرجى ملء جميع الحقول");
        return;
      }
      let token = "";
      if (!user) {
        if (typeof grecaptcha !== "undefined") {
          token = grecaptcha.getResponse();
          if (!token) {
            alert("يرجى تأكيد أنك لست روبوت");
            return;
          }
        } else {
          alert("reCAPTCHA لم يتم تحميلها بعد، يرجى الانتظار");
          return;
        }
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
            ...appliedPromotions?.map(promotion => promotion._id),
            ...(appliedCoupon ? [appliedCoupon._id] : []),
          ],
          discount: couponDiscount || discountAmount,
          total,
          paymentMethod: state.paymentMethod,
          couponCode,
          recaptchaToken: token ,
        });
        
        

        if (state.paymentMethod === "Pay on Delivery") {
          window.location.href = "/thank-you";
          clearCart();
        } else if (res.data.url) {
          window.location = res.data.url;
        }
      } catch (error) {
        alert("حدث خطأ أثناء معالجة الطلب");
        console.error(error);
      } finally {
        setIsLoading(false);
        if (!user) {
          if (typeof grecaptcha !== "undefined") {
            grecaptcha.reset();
          }
        }
        
      }
    };
    const applyCouponSilently = async () => {
      if (!couponCode.trim()) return;
      setIsApplyingCoupon(true);
      try {
        const res = await axios.post("/api/promotions/applycode", { code: couponCode.trim() });
        setAppliedCoupon(res.data)
        setCouponError("");
      } catch (err) {
        setCouponError(err.response?.data?.error || "حدث خطأ ما");
      } finally {
        setIsApplyingCoupon(false);
      }
    }
    const applyCoupon = async () => {
      if (!couponCode.trim()) return;
      setIsApplyingCoupon(true);
      try {
        const res = await axios.post("/api/promotions/applycode", { code: couponCode.trim() });
        setAppliedCoupon(res.data)
        setCouponError("");
      } catch (err) {
        setCouponError(err.response?.data?.error || "حدث خطأ ما");
      } finally {
        setIsApplyingCoupon(false);
      }
    };
    const removeCoupon = () => {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");
    }
    return (
      <>
        <Header />
        {cart.length === 0 ? (
          <div className="flex items-center justify-center h-72 text-2xl text-gray-500">
            لا توجد منتجات في السلة
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 p-6">
            {/* Cart Items */}
            <div className="bg-white shadow rounded-lg p-6 text-right space-y-6">
              <h1 className="text-3xl font-bold mb-4">المشتريات</h1>
              <CartItems products={products} />
    
              {/* Totals */}
              <div className="space-y-3 border-t pt-4">
                {!appliedCoupon && appliedPromotions.length > 0 && (
                  <div className="bg-green-50 border border-green-300 p-4 rounded mt-4">
                    <h2 className="font-bold text-green-800 mb-2">Applied Promotions</h2>
                    <ul className="list-disc ml-6 text-green-700">
                      {appliedPromotions.map(promo => (
                        <li key={promo._id}>
                          {promo.title} — {promo.promotionType === 'bogo'
                            ? `Buy ${promo.buyQty} Get ${promo.getQty} Free`
                            : `${promo.discountValue}${promo.discountType === 'percentage' ? '%' : ' EGP'} off`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-between text-lg">
                  <span>{subtotal} L.E</span>
                  <span>مجموع ({cart.length}) منتجات</span>
                </div>
                {state.shippingCost > 0 && (
                  <div className="flex justify-between text-lg">
                    <span>{state.shippingCost} L.E</span>
                    <span>تكلفة الشحن</span>
                  </div>
                )}
                {state.estimatedDelivery && (
                  <div className="flex justify-between text-lg">
                    <span>{state.estimatedDelivery}</span>
                    <span>موعد التسليم المتوقع</span>
                  </div>
                )}

                {(discountAmount + couponDiscount) > 0 && (
                  <div className="flex justify-between text-lg text-green-600">
                    <span>-{couponDiscount || discountAmount} L.E</span>
                    <span>خصم</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span>{total} L.E</span>
                  <span>الإجمالي</span>
                </div>
              </div>

            </div>
    
            {/* Checkout Form */}
            <CheckOutForm
              goToPayment={goToPayment}
              user={user}
              state={state}
              dispatch={dispatch}
              appliedCoupon={appliedCoupon}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              isApplyingCoupon={isApplyingCoupon}
              applyCoupon={applyCoupon}
              removeCoupon={removeCoupon}
              couponError={couponError}
              isLoading={isLoading}
            />
          </div>
        )}
        { !user && <Script src="https://www.google.com/recaptcha/api.js" strategy="lazyOnload" />}
      </>
    );
    
}


export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({ "variants.stock": { $gt: 0 } });
    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
      },
    };
}