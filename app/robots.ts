import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep account/checkout/staff pages out of search results — nothing
        // there is useful to index, and staff pages shouldn't be discoverable.
        disallow: ["/account", "/cart", "/checkout", "/orders", "/staff"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
