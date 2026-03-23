import { useContext, useEffect, useReducer, useState } from "react";
import { CartContext } from "@/contexts/CartContext";
import { PromotionContext } from "@/contexts/PromotionContext";
import { useSession } from "next-auth/react";
import CartFirstStep from "@/components/cart/CartFirstStep";
import CartSecondStep from "@/components/cart/CartSecondStep";
import { ArrowForward, RemoveShoppingCart } from "@mui/icons-material";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";
import axiosClient from "@/lib/axiosClient";
import Head from "next/head";

export default function Cart() {
  const [ cartStep, setCartStep ] = useState("first");
  const { cart } = useContext(CartContext);
  const { appliedPromotions, discounts, promotionProgress } = useContext(PromotionContext);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const [shippingInfo, setShippingInfo] = useState(null);
  const [ shippingOptions, setShippingOptions ] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [shippingLoading, setShippingLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
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
  ).toFixed(2);
  
  const discountAmount = discounts.reduce(
    (acc, discount) => acc + discount.discountAmount,
    0
  );
  
  
  const totalBeforeShipping = Math.max(0, subtotal - (couponDiscount || discountAmount));
  const totalBeforeDiscount = subtotal + shippingCost;
  const total = (totalBeforeShipping + shippingCost);

  const proceedToSecondStep = () => {
    setCartStep("second");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!state.governorate) return;
    setShippingCost(shippingOptions.find((option) => option.governorate === state.governorate)?.cost || 0);
    setEstimatedDelivery(shippingOptions.find((option) => option.governorate === state.governorate)?.estimatedDelivery || '');
  }, [state.governorate, shippingOptions]);

  useEffect(() => {
    setProductsLoading(true);
    axiosClient.get("/api/products").then(res => setProducts(res.data)).catch(err => console.error(err)).finally(() => setProductsLoading(false));
  }, [])

  useEffect(() => {
    axiosClient.get("/api/shipping").then(res => setShippingOptions(res.data)).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!user || shippingInfo) return; // prevent unnecessary fetch

    const fetchShippingInfo = async () => {
      try {
        const res = await axiosClient.get("/api/shipping-info");
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
          <ErrorBoundary>
            <CartFirstStep
              products={products}
              productsLoading={productsLoading}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              appliedPromotions={appliedPromotions}
              promotionProgress={promotionProgress}
              subtotal={subtotal}
              cart={cart}
              discountAmount={discountAmount}
              couponDiscount={couponDiscount}
              setCouponDiscount={setCouponDiscount}
              totalBeforeShipping={totalBeforeShipping}
              user={user}
              proceedToSecondStep={proceedToSecondStep}
              setShowModal={setShowModal}
              showModal={showModal} 
            />
          </ErrorBoundary>
        );
      case "second":
        return (
          <ErrorBoundary>
            <CartSecondStep 
              products={products} 
              cart={cart} 
              subtotal={subtotal} 
              discountAmount={discountAmount} 
              total={total} 
              state={state} 
              dispatch={dispatch} 
              shippingOptions={shippingOptions}
              setCartStep={setCartStep}
              editMode={editMode}
              setEditMode={setEditMode}
              shippingCost={shippingCost}
              estimatedDelivery={estimatedDelivery}
              totalBeforeDiscount={totalBeforeDiscount}
              appliedPromotions={appliedPromotions}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
            />
          </ErrorBoundary>
        ) ;
      default:
        return null;
    }
  };
  return (
    <>
    <Head>
      <title>Cart | Venus Outlet</title>
      <meta
        name="description"
        content="View and edit your selected products from Venus Outlet before completing the purchase."
      />
    </Head>
      {cartStep === 'second' && 
      <div className="w-full flex  items-center justify-end lg:max-w-[85%] lg:mx-auto px-6">
        <button onClick={() => setCartStep('first')} className=" text-2xl pt-6  flex items-center gap-1 text-gray-600 hover:text-gray-800 transition ">
        back <ArrowForward /> 
        </button>
      </div>
      }
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 my-40">
          <RemoveShoppingCart className="w-16 h-16 mb-4" />
          <p className="text-lg">There are no products in the cart</p>
          <Link href="/Products" className="text-primary bg-neutral-50 rounded-sm px-5 py-2 mt-4 border border-primary hover:bg-primary hover:text-neutral-50 transition">Browse Store</Link>
        </div>
      ) : (
        <CartDisplay />
      )}
    </>
  );
}