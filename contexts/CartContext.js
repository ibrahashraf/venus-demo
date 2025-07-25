import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { event } from "@/lib/gtag";

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
                await axios.post("/api/cart", {
                  productId: item._id,
                  title: item.title,
                  images: item.images,
                  selectedColor: item.selectedColor,
                  selectedSize: item.selectedSize,
                  quantity: item.quantity,
                  stock: item.stock,
                  price: item.price,
                  isFree: item.isFree || false,
                  promotionId: item.promotionId || null
                });
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
      const res = await axios.get("/api/cart");
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
        isFree: item.isFree,
        promotionId: item.promotionId
      })));
    } catch (error) {
      console.error("Error fetching Cart", error);
    }
  };



  const addProduct = async (product) => {
    const { _id, images, title, selectedColor, selectedSize ,stock , price, category, isFree, promotionId} = product;
    if (isLoggedIn) {
      if (stock < 1) {
          toast.warning(`${title} غير متوفر حاليا بالمخزن`);
          return;
        }
      try {
        await axios.post("/api/cart", {
          productId: _id,
          title,
          images,
          selectedColor,
          selectedSize,
          quantity: 1,
          price,
          category,
          isFree: isFree || false,
          promotionId: promotionId || null,
        });
        toast.success(`الى المشتريات ${title} تمت اضافه`);
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
          toast.warning(`${title} نفذت الكميه المتاحه من `);
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
            isFree: isFree || false ,
            promotionId: promotionId || null,
          },
        ]);
      }
      toast.success(`الي المشتريات ${title} تمت اضافه`);
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


  const removeProduct = async (productId, selectedColor, selectedSize, title, category, price) => {
    if (isLoggedIn) {
      try {
        await axios.delete("/api/cart", {
          data: {productId, selectedColor, selectedSize },
        });
        fetchServerCart();
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
    event({
      action: "remove_from_cart",
      params: {
        send_to: process.env.GANALYTICS_ID,
        currency: "EGP",
        value: price,
        items: [
          {
            item_name: title,
            item_id: productId,
            price: price,
            quantity: 1,
            item_category: category,
          },
        ],
      },
    });
  };


  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await axios.delete("/api/cart", {data: {}});
        fetchServerCart();
      } catch (error) {
        console.error("Failed to clear cart", error);
      }
    } else {
      setCart([]);
      if (ls) ls.removeItem("cart");
    }
  };


  const increaseQuantity = (productId, selectedColor, selectedSize, stock) => {
    if (isLoggedIn) {
      if (stock < 1) {
        toast.warning("الكميه المطلوبه غير متوفره في المخزن");
        return;
      }
      axios.put("/api/cart", {
        productId,
        selectedColor,
        selectedSize,
        action: "increase",
      });
      fetchServerCart();
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


  const decreaseQuantity = (productId, selectedColor, selectedSize) => {
    if (isLoggedIn) {
      axios.put("/api/cart", {
        productId,
        selectedColor,
        selectedSize,
        action: "decrease",
      });
      fetchServerCart();
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
