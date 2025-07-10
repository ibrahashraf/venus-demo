import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export const WishListContext = createContext();

export function WishListContextProvider({ children }) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (isLoggedIn) {
      try {
        const res = await axios.get("/api/wishlist");
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
      await axios.post("/api/wishlist", product);
      await fetchWishlist();
      return true;
    } catch (err) {
      console.error("Add to wishlist failed:", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete("/api/wishlist", { data: { productId } });
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
