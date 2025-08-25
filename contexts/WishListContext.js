import { createContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axiosClient";

export const WishListContext = createContext();

export function WishListContextProvider({ children }) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (isLoggedIn) {
      try {
        const res = await axiosClient.get("/api/wishlist", { skipRedirect: true });
        setWishlist(res.data.items || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    } else {
      setWishlist([]);
    }
  };

  const addToWishlist = async (product) => {
    if (!isLoggedIn) return false;
    try {
      await axiosClient.post("/api/wishlist", product, { skipRedirect: true });
      await fetchWishlist();
      return true;
    } catch (err) {
      console.error("Add to wishlist failed:", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axiosClient.delete("/api/wishlist", { data: { productId } }, { skipRedirect: true });
      await fetchWishlist();
    } catch (err) {
      console.error("Remove from wishlist failed:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [status]);

  return (
    <WishListContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isLoggedIn,
    }}>
      {children}
    </WishListContext.Provider>
  );
}
