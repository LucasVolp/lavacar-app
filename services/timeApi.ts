import axios from "axios";

const timeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TIME_API_URL || "https://www.timeapi.io",
  timeout: 10000,
});

interface TimeApiIpResponse {
  timeZone?: string;
  timezone?: string;
}

export const timeApiService = {
  async listTimezones(): Promise<string[]> {
    const response = await timeApi.get<string[]>("/api/v1/timezone/availabletimezones");
    return response.data;
  },

  async detectTimezoneByIp(ipAddress?: string): Promise<string | null> {
    const ip = ipAddress || process.env.NEXT_PUBLIC_TIME_API_IP || "127.0.0.1";
    const response = await timeApi.get<TimeApiIpResponse>("/api/v1/time/current/ip", {
      params: { ipAddress: ip },
    });

    return response.data.timeZone || response.data.timezone || null;
  },
};

