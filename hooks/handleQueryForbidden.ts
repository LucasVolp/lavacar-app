import axios from "axios";

export function handleQueryForbidden(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return;
  }

  if (error.response?.status !== 403) {
    return;
  }

  if (typeof window !== "undefined") {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/auth/login?reason=forbidden&redirect=${redirect}`;
  }
}
