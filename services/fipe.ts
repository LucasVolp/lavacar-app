import axios, { AxiosResponse } from 'axios';
import { FipeBrand, FipeModel, VehicleType } from '../types/fipe';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const fipeApi = axios.create({
  baseURL: `${API_URL}/fipe-api`,
});

export const fipeService = {
  getBrands: async (type: VehicleType): Promise<FipeBrand[]> => {
    try {
      const response: AxiosResponse<FipeBrand[]> = await fipeApi.get(`/brands/${type}`);
      return response.data;
    } catch {
      return [];
    }
  },

  getModels: async (brandId: number): Promise<FipeModel[]> => {
    try {
      const response: AxiosResponse<FipeModel[]> = await fipeApi.get(`/models/${brandId}`);
      return response.data;
    } catch {
      return [];
    }
  },
};
