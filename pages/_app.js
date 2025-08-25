import { CartContextProvider } from "@/contexts/CartContext";
import { WishListContextProvider } from "@/contexts/WishListContext";
import { PromotionContextProvider } from "@/contexts/PromotionContext";
import { PromotionDisplayContextProvider } from "@/contexts/PromotionDisplayContext";
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
          <PromotionDisplayContextProvider>
            <CartContextProvider>
              <PromotionContextProvider>
                <WishListContextProvider>
                  <Toaster
                    position="top-right"
                    richColors
                    duration={3000}
                    pauseWhenPageIsHidden={false}
                    toastOptions={{
                      style: {
                        background: "#f5f5f5",
                        borderColor: "#d4d4d4",
                        fontSize: "16px",
                        color: "#111111",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontFamily: "var(--font-cairo)",
                      },
                    }}
                    icons={{
                      success: null,
                      error: null,
                      warning: null,
                      info: null,
                    }}
                  />

                  <Component {...pageProps} />
                  <WhatsAppButton />
                </WishListContextProvider>
              </PromotionContextProvider>
            </CartContextProvider>
          </PromotionDisplayContextProvider>
      </main>
    </SessionProvider>
  );
}
