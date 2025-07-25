import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { CartContext } from "@/contexts/CartContext";
import { PromotionContext } from "@/contexts/PromotionContext";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import CartFirstStep from "@/components/CartFirstStep";
import CartSecondStep from "@/components/CartSecondStep";

export default function Cart({ products }) {
  const [ cartStep, setCartStep ] = useState("first");
  const { cart } = useContext(CartContext);
  const { appliedPromotions, discounts } = useContext(PromotionContext);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const [shippingInfo, setShippingInfo] = useState(null);
  const [ shippingOptions, setShippingOptions ] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [shippingLoading, setShippingLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const user = session?.user;

  const initialState = {
    name: "",
    phone: "",
    address: "",
    city: "",
    governorate: "",
    shippingCost: 0,
    estimatedDelivery: "",
  };
  function formReducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };
      case "SET_ALL_FIELDS":
        return {
          ...state,
          ...action.payload, // renamed for consistency
        };
      default:
        return state; // ensure stability on unknown actions
    }
  }

  const [state, dispatch] = useReducer(formReducer, initialState);
  
  
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  
  const discountAmount = discounts.reduce(
    (acc, discount) => acc + discount.discountAmount,
    0
  );
  
  const couponDiscount = appliedCoupon
  ? appliedCoupon.discountType === "percentage"
  ? subtotal * (appliedCoupon.discountValue / 100)
  : appliedCoupon.discountValue
  : 0;
  
  const totalBeforeShipping = Math.max(0, subtotal - (couponDiscount || discountAmount));
  const totalBeforeDiscount = subtotal + shippingCost;
  const total = totalBeforeShipping + shippingCost;

  const proceedToSecondStep = () => {
    setCartStep("second");
  };

  useEffect(() => {
    if (!state.governorate) return;
    setShippingCost(shippingOptions.find((option) => option.governorate === state.governorate)?.cost || 0);
    setEstimatedDelivery(shippingOptions.find((option) => option.governorate === state.governorate)?.estimatedDelivery || '');
  }, [state.governorate, shippingOptions]);

  useEffect(() => {
    axios.get("/api/shipping").then(res => setShippingOptions(res.data));
  }, []);

  useEffect(() => {
    if (!user || shippingInfo) return; // prevent unnecessary fetch

    const fetchShippingInfo = async () => {
      try {
        const res = await axios.get("/api/shipping-info");
        const info = res.data.shippingInfo;

        const hasInfo = info && Object.keys(info).length > 0;

        if (hasInfo) {
          setShippingInfo(info);
          dispatch({
            type: "SET_ALL_FIELDS",
            payload: info, // or use forEach if no batch dispatch
          });
          setEditMode(false); // show summary
        } else {
          setShippingInfo(null);
          setEditMode(true); // show form
        }
      } catch (err) {
        console.error("Error fetching shipping info", err);
        setShippingInfo(null);
        setEditMode(true);
      } finally {
        setShippingLoading(false);
      }
    };

    fetchShippingInfo();
  }, [user]);


  const CartDisplay = () => {
    switch (cartStep) {
      case "first":
        return (
          <CartFirstStep
            products={products}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            isApplyingCoupon={isApplyingCoupon}
            setIsApplyingCoupon={setIsApplyingCoupon}
            couponError={couponError}
            setCouponError={setCouponError}
            appliedPromotions={appliedPromotions}
            subtotal={subtotal}
            cart={cart}
            discountAmount={discountAmount}
            couponDiscount={couponDiscount}
            totalBeforeShipping={totalBeforeShipping}
            user={user}
            proceedToSecondStep={proceedToSecondStep}
            setShowModal={setShowModal}
            showModal={showModal} 
          />
        );
      case "second":
        return (
          <CartSecondStep 
            products={products} 
            cart={cart} 
            subtotal={subtotal} 
            discountAmount={discountAmount} 
            total={total} 
            state={state} 
            dispatch={dispatch} 
            setCartStep={setCartStep}
            shippingOptions={shippingOptions}
            setShippingOptions={setShippingOptions}
            editMode={editMode}
            setEditMode={setEditMode}
            shippingCost={shippingCost}
            estimatedDelivery={estimatedDelivery}
          />
        ) ;
      default:
        return null;
    }
  };
  return (
    <>
      <Header />
      {cart.length === 0 ? (
        <div className="flex items-center justify-center h-72 text-2xl text-gray-500">
          لا توجد منتجات في السلة
        </div>
      ) : (
        <CartDisplay />
      )}
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
