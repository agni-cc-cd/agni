import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersCacheConfig } from "@vinext/cloudflare/cache/config";

const cache = await createWorkersCacheConfig();

export default defineConfig({
  accountId: "71dc3968083b6823af6948ec00ea4b41",
  worker: defineWorker({
    ...cache,
    name: "agni",
    entrypoint: "vinext/server/fetch-handler",
    // Production custom domain (zone agni.cc.cd is on this Cloudflare account).
    domains: [{ hostname: "agni.cc.cd", production: true, previews: false }],
    compatibilityDate: "2026-10-30",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ...cache.env,
      ASSETS: bindings.assets(),
      VINEXT_KV_CACHE: bindings.kv({ id: "392e2501042144d3aa366125f9a2791b" }),
      // Link shortener storage: D1 is the source of truth, LINKS_KV the hot cache.
      DB: bindings.d1({ name: "agni", id: "40f616d9-802f-404d-b320-ce6cadb71a50" }),
      LINKS_KV: bindings.kv({ id: "4b4838e7e85f48ab826c52c1ea8eb299" }),
      // Raw click stream for rich analytics (D1 rollups power the dashboard).
      CLICKS_ANALYTICS: bindings.analyticsEngineDataset({ name: "agni_clicks" }),
      // Set with: cf secret put ADMIN_TOKEN (empty = open mode, for demos).
      ADMIN_TOKEN: bindings.secret(),
    },
  }),
});
