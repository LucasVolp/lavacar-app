import axios from "axios";

export function handleQueryForbidden(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return;
  }

  if (error.response?.status !== 403) {
    return;
  }

  if (typeof window !== "undefined") {
    window.location.href = "/auth/login?reason=forbidden";
  }
}
