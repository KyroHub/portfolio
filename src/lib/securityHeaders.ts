type SecurityHeader = {
  key: string;
  value: string;
};

type SecurityHeadersOptions = {
  nodeEnv?: string | null;
  supabaseUrl?: string | null;
};

const APPLE_MEDIA_ORIGINS = [
  "https://tools.applemediaservices.com",
  "https://toolbox.marketingtools.apple.com",
  "https://*.mzstatic.com",
] as const;

function getSupabaseOrigin(supabaseUrl?: string | null) {
  if (!supabaseUrl) {
    return null;
  }

  try {
    return new URL(supabaseUrl).origin;
  } catch {
    return null;
  }
}

function isProductionEnvironment(nodeEnv?: string | null) {
  return nodeEnv === "production";
}

function buildSourceList(...sources: Array<string | null | undefined | false>) {
  return [...new Set(sources.filter(Boolean))].join(" ");
}

export function buildContentSecurityPolicy(options: SecurityHeadersOptions = {}) {
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  const supabaseOrigin = getSupabaseOrigin(
    options.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  const isProduction = isProductionEnvironment(nodeEnv);
  const connectSrc = buildSourceList(
    "'self'",
    supabaseOrigin,
    isProduction ? null : "http:",
    isProduction ? null : "https:",
    isProduction ? null : "ws:",
    isProduction ? null : "wss:",
  );
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "child-src 'none'",
    "object-src 'none'",
    `script-src ${buildSourceList(
      "'self'",
      "'unsafe-inline'",
      isProduction ? null : "'unsafe-eval'",
    )}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    `img-src ${buildSourceList("'self'", "data:", "blob:", supabaseOrigin, ...APPLE_MEDIA_ORIGINS)}`,
    `connect-src ${connectSrc}`,
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    isProduction ? "upgrade-insecure-requests" : null,
  ].filter(Boolean);

  return directives.join("; ");
}

export function buildSecurityHeaders(options: SecurityHeadersOptions = {}): SecurityHeader[] {
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  const headers = [
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(options),
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin",
    },
    {
      key: "Cross-Origin-Resource-Policy",
      value: "same-origin",
    },
    isProductionEnvironment(nodeEnv)
      ? {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        }
      : null,
  ].filter((header): header is SecurityHeader => Boolean(header));

  return headers;
}
