import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/courier/", "/dashboard/"],
    },
    sitemap: "https://courier-frontend-steel.vercel.app/sitemap.xml",
  };
}
