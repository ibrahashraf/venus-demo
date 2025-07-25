import { CartContextProvider } from "@/contexts/CartContext";
import { WishListContextProvider } from "@/contexts/WishListContext";
import { PromotionContextProvider } from "@/contexts/PromotionContext";
import { PromotionDisplayContextProvider } from "@/contexts/PromotionDisplayContext";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/WhatsIcon";
import { Cairo } from 'next/font/google';

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} >
      <main className={`${cairo.variable} font-arabic`}>
        <CheckoutProvider>
          <PromotionDisplayContextProvider>
            <CartContextProvider>
              <PromotionContextProvider>
                <WishListContextProvider>
                  <Toaster position="top-right" richColors />
                  <Component {...pageProps} />
                  <WhatsAppButton />
                </WishListContextProvider>
              </PromotionContextProvider>
            </CartContextProvider>
          </PromotionDisplayContextProvider>
        </CheckoutProvider>
      </main>
    </SessionProvider>
  );
}
