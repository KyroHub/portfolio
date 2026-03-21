import { createHash } from "crypto";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  identifier: string;
  limit: number;
  namespace: string;
  windowMs: number;
};

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
  resetAt: number;
};

declare global {
  var __appRateLimitStore: Map<string, RateLimitBucket> | undefined;
  var __appRateLimitLastPruneAt: number | undefined;
}

const rateLimitStore = globalThis.__appRateLimitStore ?? new Map<string, RateLimitBucket>();
globalThis.__appRateLimitStore = rateLimitStore;

function getStoreKey(namespace: string, identifier: string) {
  return `${namespace}:${identifier}`;
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function pruneExpiredBuckets(now: number) {
  const lastPruneAt = globalThis.__appRateLimitLastPruneAt ?? 0;
  if (now - lastPruneAt < 60_000) {
    return;
  }

  for (const [key, bucket] of rateLimitStore.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  globalThis.__appRateLimitLastPruneAt = now;
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Cache map for ratelimiters so we don't recreate them every request
const upstashRateLimiters = new Map<string, Ratelimit>();
const ratelimitCache = new Map<string, number>();

export async function consumeRateLimit({
  identifier,
  limit,
  namespace,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();

  if (redis) {
    // Upstash Ratelimit implementation
    const cacheKey = `${namespace}-${limit}-${windowMs}`;
    let upstashLimiter = upstashRateLimiters.get(cacheKey);

    if (!upstashLimiter) {
      // Create a fixed window limiter
      upstashLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(limit, `${windowMs} ms`),
        ephemeralCache: ratelimitCache, 
        prefix: `ratelimit:${namespace}`,
      });
      upstashRateLimiters.set(cacheKey, upstashLimiter);
    }

    const { success, remaining, reset } = await upstashLimiter.limit(identifier);
    return {
      ok: success,
      remaining,
      retryAfterMs: Math.max(reset - now, 0),
      resetAt: reset,
    };
  }

  // Fallback to in-memory implementation for local dev
  pruneExpiredBuckets(now);
  const key = getStoreKey(namespace, identifier);
  const existingBucket = rateLimitStore.get(key);
  const activeBucket =
    existingBucket && existingBucket.resetAt > now
      ? existingBucket
      : { count: 0, resetAt: now + windowMs };

  if (activeBucket.count >= limit) {
    rateLimitStore.set(key, activeBucket);
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: Math.max(activeBucket.resetAt - now, 0),
      resetAt: activeBucket.resetAt,
    };
  }

  activeBucket.count += 1;
  rateLimitStore.set(key, activeBucket);

  return {
    ok: true,
    remaining: Math.max(limit - activeBucket.count, 0),
    retryAfterMs: Math.max(activeBucket.resetAt - now, 0),
    resetAt: activeBucket.resetAt,
  };
}

export async function getClientRateLimitIdentifier() {
  const headerList = await headers();
  const forwardedFor =
    headerList.get("x-forwarded-for") ??
    headerList.get("x-real-ip") ??
    headerList.get("cf-connecting-ip") ??
    headerList.get("x-vercel-forwarded-for") ??
    "";
  const ip = forwardedFor.split(",")[0]?.trim() ?? "";
  const userAgent = headerList.get("user-agent") ?? "unknown";
  const acceptLanguage = headerList.get("accept-language") ?? "unknown";

  return hashValue(`${ip}|${userAgent}|${acceptLanguage}`);
}

export function getUserRateLimitIdentifier(userId: string) {
  return hashValue(userId);
}
