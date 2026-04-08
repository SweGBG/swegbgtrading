import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/konto", "/kassa", "/api"],
    },
    sitemap: "https://swegbg.com/sitemap.xml",
  };
}