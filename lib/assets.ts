const DEFAULT_ASSET_KEY = "system/assets/car-outlined.png";

function normalizePublicOrigin(raw?: string): string {
  const value = (raw || "").trim();
  if (!value) return "";

  try {
    const parsed = new URL(value);
    if (!["https:", "http:"].includes(parsed.protocol)) return "";
    return parsed.origin.replace(/\/+$/, "");
  } catch {
    return "";
  }
}

const r2PublicOrigin = normalizePublicOrigin(process.env.NEXT_PUBLIC_R2_PUBLIC_URL);
const apiOrigin = normalizePublicOrigin(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");
const r2Host = r2PublicOrigin ? new URL(r2PublicOrigin).hostname.toLowerCase() : "";
const isS3ApiEndpoint = r2Host.endsWith(".r2.cloudflarestorage.com");

export const DEFAULT_SERVICE_IMAGE = r2PublicOrigin && !isS3ApiEndpoint
  ? `${r2PublicOrigin}/${DEFAULT_ASSET_KEY}`
  : `${apiOrigin}/storage/object?key=${encodeURIComponent(DEFAULT_ASSET_KEY)}`;
