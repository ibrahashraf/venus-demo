import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <Html lang="en">
      <Head>
        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TS6L0QEVP0"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TS6L0QEVP0', {
                debug_mode: ${isDevelopment},
              });
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <div id="modal-root"></div>
        <div id="modal-root-testimonial"></div>
        <div id="search-modal-root"></div>
        <div id="user-modal-root"></div>
        <div id="delete-user-modal-root"></div>
        <div id="shipping-form-modal-root"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
