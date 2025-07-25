import { createContext, useContext, useState, useEffect } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutDataRaw] = useState({
    cartItems: [],
    subtotal: 0,
    coupon: null,
    discountAmount: 0,
    totalBeforeShipping: 0,
  });

  // Load from sessionStorage on first mount
  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutData");
    if (stored) {
      setCheckoutDataRaw(JSON.parse(stored));
    }
  }, []);

  // Save to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  }, [checkoutData]);

  const setCheckoutData = (data) => {
    setCheckoutDataRaw(data);
  };

  return (
    <CheckoutContext.Provider value={{ checkoutData, setCheckoutData }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
