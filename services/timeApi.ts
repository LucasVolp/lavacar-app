const FALLBACK_TIMEZONE = "America/Sao_Paulo";

export const timeApiService = {
  listTimezones(): string[] {
    if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
      return Intl.supportedValuesOf("timeZone");
    }
    return [FALLBACK_TIMEZONE];
  },

  detectTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIMEZONE;
    } catch {
      return FALLBACK_TIMEZONE;
    }
  },
};
