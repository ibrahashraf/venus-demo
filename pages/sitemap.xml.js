import axiosClient from "@/lib/axiosClient";

const BASE_URL = "https://yourdomain.com"; // Change to your real domain

function generateSiteMap({ products, branches, categories }) {
  const staticPages = [
    "",
    "Cart",
    "ContactUs",
    "delete-data",
    "network-error",
    "Orders",
    "payment-status",
    "privacy-policy",
    "Products",
    "terms",
    "thank-you",
    "WishList",
  ]
    .map((path) => `<url><loc>${BASE_URL}/${path}</loc></url>`)
    .join("");

  const productUrls = products
    .map((p) => `<url><loc>${BASE_URL}/product/${p._id}</loc></url>`)
    .join("");

  const branchUrls = branches
    .map((br) => `<url><loc>${BASE_URL}/branch/${br._id}</loc></url>`)
    .join("");

  const categoryUrls = categories
    .map((c) => `<url><loc>${BASE_URL}/Products?category=${c._id}</loc></url>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages}
      ${productUrls}
      ${branchUrls}
      ${categoryUrls}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  try {

    const { data } = await axiosClient.get(`${process.env.NEXTAUTH_URL}/api/sitemap`); 
  
    const sitemap = generateSiteMap(data);
  
    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
  
    return {
      props: {},
    };
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return {
      props: {},
    };
  }
}

export default function Sitemap() {
  return null;
}
