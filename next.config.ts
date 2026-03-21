import type { NextConfig } from "next";

function getSupabaseOrigin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return null;
  }

  try {
    return new URL(supabaseUrl).origin;
  } catch {
    return null;
  }
}

function buildContentSecurityPolicy() {
  const supabaseOrigin = getSupabaseOrigin();
  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    supabaseOrigin,
    "https://tools.applemediaservices.com",
    "https://toolbox.marketingtools.apple.com",
    "https://*.mzstatic.com",
  ]
    .filter(Boolean)
    .join(" ");
  const connectSrc = ["'self'", supabaseOrigin].filter(Boolean).join(" ");
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    `img-src ${imgSrc}`,
    `connect-src ${connectSrc}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    process.env.NODE_ENV === "production" ? "upgrade-insecure-requests" : "",
  ].filter(Boolean);

  return directives.join("; ");
}

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: buildContentSecurityPolicy(),
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
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tools.applemediaservices.com",
      },
      {
        protocol: "https",
        hostname: "toolbox.marketingtools.apple.com",
      },
    ],
  },
};

export default nextConfig;
