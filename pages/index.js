import BranchesSection from "@/components/sections/BranchesSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import Featured from "@/components/sections/Featured";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LatestProducts from "@/components/LatestProducts";
import PromotionBanner from "@/components/sections/PromotionBanner";
import TestiSection from "@/components/sections/TestiSection";
import Error from "./_error";
import Head from "next/head";
import CategoryShowSection from "@/components/sections/CategoryShowSection";
import SubscriptionSection from "@/components/sections/SubscriptionSection";
import axiosClient from "@/lib/axiosClient";

export default function Home({ latestProducts, categoriesWithProducts, error, statusCode }) {
  if (error) {
    return <Error statusCode={statusCode || 500} />;
  }
  return (
    <>
      <Head>
        <title>
          Venus Outlet | فينوس اوتليت  
        </title>
        <meta
          name="description"
          content="Venus Outlet فينوس اوتليت تقدم تشكيلات من ملابس النساء والأطفال بعروض رائعة في فروع المنصورة والإسكندرية."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://venusoutlet.net/" />
        <meta
          property="og:title"
          content="Venus Outlet فينوس اوتليت | ملابس نسائية وأطفال"
        />
        <meta
          property="og:description"
          content="Venus Outlet فينوس اوتليت تقدم تشكيلات من ملابس النساء والأطفال بعروض رائعة في فروع المنصورة والإسكندرية."
        />
        <meta property="og:image" content="https://venusoutlet.net/og-image.jpg" />
        <meta property="og:url" content="https://venusoutlet.net/" />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <Featured />
      <ErrorBoundary>
        <LatestProducts latestProducts={latestProducts} />
      </ErrorBoundary>
      <ErrorBoundary>
        <PromotionBanner  />
      </ErrorBoundary>
      <ErrorBoundary>
        <CategoriesSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <BranchesSection />
      </ErrorBoundary>
      {categoriesWithProducts.map(({ category, products }) => (
        <ErrorBoundary key={category._id}>
          <CategoryShowSection category={category} products={products} />
        </ErrorBoundary>
      ))}
      <ErrorBoundary>
        <SubscriptionSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <TestiSection />
      </ErrorBoundary>
      <Footer />
    </>
  );
}

export async function getServerSideProps() { 
  try {
    const { data } = await axiosClient.get(`${process.env.WEBSITE_URL}/api/home`);

    return {
      props: {
        latestProducts: data.latestProducts || [],
        categoriesWithProducts: data.categoriesWithProducts || [],
        error: null,
        statusCode: null,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        latestProducts: [],
        categoriesWithProducts: [],
        error: error.message,
        statusCode: 500,
      },
    };
  }
}
