import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/auth/"],
            disallow: ["/organization/", "/billing/", "/client/"],
        },
        sitemap: "https://nexocar.com.br/sitemap.xml",
    };
}
