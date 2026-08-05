import { createFileRoute } from "@tanstack/react-router";

const STATIC_PATHS = [
  "/",
  "/tentang",
  "/program",
  "/event",
  "/berita",
  "/galeri",
  "/donasi",
  "/kontak",
];

export const Route = createFileRoute("/api/public/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const urls = STATIC_PATHS.map(
          (p) =>
            `<url><loc>${origin}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`,
        ).join("");
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
          { headers: { "content-type": "application/xml; charset=utf-8" } },
        );
      },
    },
  },
});