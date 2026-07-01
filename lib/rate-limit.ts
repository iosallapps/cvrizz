import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting is optional: when Upstash env vars are absent (local/dev, or not
// yet provisioned) it is skipped entirely so nothing breaks. Set
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable it.
const isConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const redis = isConfigured ? Redis.fromEnv() : null;

// Per-action sliding-window limits (requests per window, keyed by user id).
const LIMITS = {
  checkout: { tokens: 10, window: "1 m" },
  export: { tokens: 20, window: "1 m" },
  createResume: { tokens: 15, window: "1 m" },
} as const;

type LimitKind = keyof typeof LIMITS;

const limiters = {} as Record<LimitKind, Ratelimit | null>;

for (const kind of Object.keys(LIMITS) as LimitKind[]) {
  const { tokens, window } = LIMITS[kind];
  limiters[kind] = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(tokens, window),
        prefix: `cvrizz:${kind}`,
      })
    : null;
}

/**
 * Returns true if the request is allowed. When Upstash is not configured,
 * always returns true (rate limiting disabled).
 */
export async function checkRateLimit(
  kind: LimitKind,
  identifier: string
): Promise<boolean> {
  const limiter = limiters[kind];
  if (!limiter) return true;
  const { success } = await limiter.limit(identifier);
  return success;
}
