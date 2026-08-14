import { createFileRoute } from "@tanstack/react-router";

const ONE_YEAR = 60 * 60 * 24 * 365;

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) return new Response("Storage not configured", { status: 500 });

        const upstream = await fetch(
          `${url}/storage/v1/object/media/${path.split("/").map(encodeURIComponent).join("/")}`,
          { headers: { apikey: key } },
        );
        if (!upstream.ok || !upstream.body) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(upstream.body, {
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
            "cache-control": `public, max-age=${ONE_YEAR}, immutable`,
          },
        });
      },
    },
  },
});