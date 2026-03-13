import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import {
  ShopClient,
  CreateShopClientPayload,
  UpdateShopClientPayload,
  ShopClientFilters,
} from "../types/shopClient";
import { PaginatedResult } from "../types/pagination";

const base = "/shop-clients";

export const shopClientService = {
  create: async (payload: CreateShopClientPayload) => {
    const response: AxiosResponse<ShopClient> = await axiosInstance.post(base, payload);
    return response.data;
  },

  findAll: async (filters?: ShopClientFilters): Promise<PaginatedResult<ShopClient>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));
    if (filters?.search) params.append("search", filters.search);
    const response: AxiosResponse<PaginatedResult<ShopClient>> = await axiosInstance.get(base, { params });
    return response.data;
  },

  findByShopId: async (
    shopId: string,
    filters?: Omit<ShopClientFilters, "shopId">
  ): Promise<PaginatedResult<ShopClient>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.perPage) params.append("perPage", String(filters.perPage));
    if (filters?.search) params.append("search", filters.search);
    const response: AxiosResponse<PaginatedResult<ShopClient>> = await axiosInstance.get(
      `${base}/shop/${shopId}`,
      { params }
    );
    return response.data;
  },

  findByShopAndUser: async (shopId: string, userId: string): Promise<ShopClient | null> => {
    try {
      const response: AxiosResponse<ShopClient> = await axiosInstance.get(
        `${base}/shop-and-user`,
        { params: { shopId, userId } }
      );
      return response.data;
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  countByShopId: async (shopId: string): Promise<number> => {
    const response: AxiosResponse<number> = await axiosInstance.get(`${base}/shop/${shopId}/count`);
    return response.data;
  },

  findOne: async (id: string): Promise<ShopClient> => {
    const response: AxiosResponse<ShopClient> = await axiosInstance.get(`${base}/${id}`);
    return response.data;
  },

  update: async (id: string, payload: UpdateShopClientPayload): Promise<ShopClient> => {
    const response: AxiosResponse<ShopClient> = await axiosInstance.patch(`${base}/${id}`, payload);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${base}/${id}`);
  },
};

export default shopClientService;
