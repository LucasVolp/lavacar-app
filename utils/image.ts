/**
 * Resolves an image path from the API to a full URL.
 * Storage pode retornar URL absoluta (R2/CDN) ou path relativo legado.
 */
export function getApiImageUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL ||
    "http://localhost:3000";
  return `${baseURL.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
