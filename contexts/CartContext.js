import { createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { event } from "@/lib/gtag";
import axiosClient from "@/lib/axiosClient";
import { ShoppingCart } from "@mui/icons-material";
import Link from "next/link";

export const CartContext = createContext({
  cart: [],
  addProduct: () => {},
  removeProduct: () => {},
  setCart: () => {},
  clearCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  fetchServerCart: () => {},
});

export function CartContextProvider({ children }) {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [cart, setCart] = useState([]);
  const ls = typeof window !== 'undefined' ? window.localStorage : null;


  useEffect(() => {
    if (isLoggedIn) {
      const migrateLocalCart = async () => {
        if (ls) {
          const saved = ls.getItem("cart");
          if (saved) {
            try {
              const localCart = JSON.parse(saved);
              for (const item of localCart) {
                await axiosClient.post("/api/cart", {
                  productId: item._id,
                  title: item.title,
                  images: item.images,
                  selectedColor: item.selectedColor,
                  selectedSize: item.selectedSize,
                  quantity: item.quantity,
                  stock: item.stock,
                  price: item.price,
                  promotionId: item.promotionId || null
                }, { skipRedirect: true });
              }
              ls.removeItem("cart");
              ls.setItem("cartMigrated", "true");
              toast.success("تم حفظ المشتريات في حساب المستخدم")
            } catch (error) {
              console.error("failed to migrate local cart", error);
            }
          }
        }
      }
      migrateLocalCart().then(() => {
        fetchServerCart();
      });
    } else {
      if (ls?.getItem("cartMigrated") !== "true") {
        const saved = ls.getItem("cart");
        if (saved) {
          try {
            setCart(JSON.parse(saved));
          } catch (error) {
            console.error("Error loading cart from localStorage", error);
          }
        }
      }
    }
  }, [isLoggedIn]);



  useEffect(() => {
    if (!isLoggedIn && ls) {
      if (cart.length > 0) {
        ls.setItem("cart", JSON.stringify(cart));
      } else {
        ls.removeItem("cart");
      }
    }
  }, [cart, isLoggedIn]);




  const fetchServerCart = async () => {
    try {
      const res = await axiosClient.get("/api/cart", { skipRedirect: true });
      const serverCart = res.data?.items || [];
      setCart(serverCart.map((item) => ({
        _id: item.productId._id,
        images: item.productId.images,
        title: item.productId.title,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        stock: item.stock,
        price: item.price,
        promotionId: item.promotionId
      })));
    } catch (error) {
      console.error("Error fetching Cart", error);
    }
  };



  const addProduct = async (product) => {
    const { _id, images, title, selectedColor, selectedSize ,stock , price, category, promotionId} = product;
    if (isLoggedIn) {
      if (stock < 1) {
          toast.warning(`غير متوفر حاليا بالمخزن ${title}`);
          return;
        }
      try {
        await axiosClient.post("/api/cart", {
          productId: _id,
          title,
          images,
          selectedColor,
          selectedSize,
          quantity: 1,
          price,
          category,
          promotionId: promotionId || null,
        }, { skipRedirect: true });
        toast.success(
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            <div>تمت اضافه {title} للمشتريات</div>
            <Link href="/Cart" className=" w-full border border-accent text-accent hover:bg-accent hover:text-white transition  text-center py-2">عرض المشتريات  <ShoppingCart sx={{ fontSize: "16px" }} /></Link>
          </div>
        );
        fetchServerCart();
      } catch (error) {
        console.error("Failed to add product", error);
        toast.error(error);
      }
    } else {
      const existingIndex = cart.findIndex(
        (item) => 
          item._id === _id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
      );
      if (existingIndex !== -1) {
        const updated = [...cart];
        if (updated[existingIndex].quantity >= stock) {
          toast.warning(` نفذت الكميه المتاحه من ${title}`);
          return;
        }
        updated[existingIndex].quantity += 1;
        setCart(updated);
      } else {
        setCart(prev => [
          ...prev,
          { 
            _id,
            images,
            title,
            selectedColor,
            selectedSize, 
            quantity: 1,
            stock,
            price, 
            category,
            promotionId: promotionId || null,
          },
        ]);
      }
      toast.success(
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <div>تمت اضافه {title} للمشتريات</div>
          <Link href="/Cart" className=" w-full border border-accent text-accent hover:bg-accent hover:text-white transition text-center py-2">عرض المشتريات  <ShoppingCart sx={{ fontSize: "16px" }} /></Link>
        </div>
      , {
        pauseOnHover: false
      });
    }
    event({
      action: "add_to_cart",
      params: {
        send_to: process.env.GANALYTICS_ID,
        currency: "EGP",
        value: price,
        items: [
          {
            item_name: title,
            item_id: _id,
            price: price,
            quantity: 1,
            item_category: category,
          },
        ],
      },
    });
  };


  const removeProduct = async (productId, selectedColor, selectedSize) => {
    if (isLoggedIn) {
      try {
        await axiosClient.delete("/api/cart", {
          data: {productId, selectedColor, selectedSize },
        }, { skipRedirect: true });
        await fetchServerCart();
        toast.error("تم حذف المنتج من المشتريات");
      } catch (error) {
        console.error("falied to remove product", error);
        toast.error("حدث خطأ أثناء حذف المنتج");
      }
    } else {
      setCart(prev => 
        prev.filter(
          (item) =>
            !(
              item._id === productId && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize
            )
        )
      );
      toast.error("تم حذف المنتج من المشتريات");
    }
  };


  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await axiosClient.delete("/api/cart", {data: {}}, { skipRedirect: true });
        fetchServerCart();
      } catch (error) {
        console.error("Failed to clear cart", error);
      }
    } else {
      setCart([]);
      if (ls) ls.removeItem("cart");
    }
  };


  const increaseQuantity = async (productId, selectedColor, selectedSize, stock, quantity) => {
    if (isLoggedIn) {
      if (quantity >= stock) {
        toast.warning("الكميه المطلوبه غير متوفره في المخزن");
        return;
      }
      try {
        
        await axiosClient.put("/api/cart", {
          productId,
          selectedColor,
          selectedSize,
          action: "increase",
        }, { skipRedirect: true });
        await fetchServerCart();
      } catch (error) {
        console.error("Failed to increase quantity", error);
      }
    } else {
      setCart( prev => 
        prev.map(item => {
          if (
            (item._id || item.productId) === productId && 
            item.selectedColor === selectedColor && 
            item.selectedSize === selectedSize
          ) {
            if ((item.quantity || 1) < (stock || Infinity)) {
              return { ...item, quantity: (item.quantity || 1) + 1};
            } else {
              toast.warning("الكميه المطلوبه غير متوفره في المخزن");
            }
          }
          return item;
        })
      );
    }
  };


  const decreaseQuantity = async (productId, selectedColor, selectedSize) => {
    if (isLoggedIn) {
      try {
        await axiosClient.put("/api/cart", {
          productId,
          selectedColor,
          selectedSize,
          action: "decrease",
        }, { skipRedirect: true });
        await  fetchServerCart();
      } catch (error) {
        console.error("Failed to decrease quantity", error);
      }
    } else {
      setCart( prev => 
        prev.map(item => {
          if (
            (item._id || item.productId) === productId && 
            item.selectedColor === selectedColor && 
            item.selectedSize === selectedSize
          ) {
            const newQty = (item.quantity || 1) - 1;
            return newQty > 0 ? { ...item, quantity: newQty } : 0;
          }
          return item;
        }).filter(item => item.quantity > 0)
      );
    }
  };


  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      addProduct,
      removeProduct,
      clearCart,
      increaseQuantity,
      decreaseQuantity,
      fetchServerCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}
