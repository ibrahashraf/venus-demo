import CategoriesSection from "@/components/sections/CategoriesSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import Featured from "@/components/sections/Featured";
import LatestProducts from "@/components/LatestProducts";
import PromotionBanner from "@/components/sections/PromotionBanner";
import TestiSection from "@/components/sections/TestiSection";
import Error from "./_error";
import Head from "next/head";
import CategoryShowSection from "@/components/sections/CategoryShowSection";
import SubscriptionSection from "@/components/sections/SubscriptionSection";
import axiosClient from "@/lib/axiosClient";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Venus Outlet  
        </title>
        <meta
          name="description"
          content="فينوس أوتلت متجر رائد للأزياء يقدم أحدث صيحات ملابس النساء والأطفال عبر فروعنا في المنصورة والإسكندرية."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://venusoutlet.net/" />
        <meta
          property="og:title"
          content="فينوس أوتلت | أزياء النساء والأطفال"
        />
        <meta
          property="og:description"
          content="فينوس أوتلت يقدم أحدث صيحات ملابس النساء والأطفال عبر فروعنا في المنصورة والإسكندرية."
        />
        <meta property="og:image" content="https://venusoutlet.net/og-image.jpg" />
        <meta property="og:url" content="https://venusoutlet.net/" />
        <meta property="og:type" content="website" />
      </Head>
      <Featured />
      {/* <ErrorBoundary>
        <CategoriesSection />
      </ErrorBoundary> */}
      <ErrorBoundary>
        <PromotionBanner  />
      </ErrorBoundary>
      <ErrorBoundary>
        <LatestProducts />
      </ErrorBoundary>
      <ErrorBoundary>
        <CategoryShowSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <SubscriptionSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <TestiSection />
      </ErrorBoundary>
    </>
  );
}

