import { env } from "cloudflare:workers";

/** Typed view of the worker bindings declared in cloudflare.config.ts. */
export interface AgniEnv {
  DB: D1Database;
  LINKS_KV: KVNamespace;
  /** Undefined until Analytics Engine is enabled for the account. */
  CLICKS_ANALYTICS?: AnalyticsEngineDataset;
  ADMIN_TOKEN?: string;
  /** Email transport for milestone mails; absent = never send. */
  SEND_EMAIL?: SendEmail;
}

export function getEnv(): AgniEnv {
  return env as unknown as AgniEnv;
}
