import { Shop } from "./shop";
import { Vehicle } from "./vehicle";

export interface ShopClientUser {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  picture?: string;
  vehicles?: Vehicle[];
  appointments?: ShopClientAppointment[];
  evaluations?: ShopClientEvaluation[];
}

export interface ShopClientAppointment {
  id: string;
  scheduledAt: string;
  status: string;
  totalPrice: string;
  services: { serviceName: string }[];
}

export interface ShopClientEvaluation {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ShopClient {
  id: string;
  shopId: string;
  userId: string;
  customName?: string;
  customPhone?: string;
  customEmail?: string;
  notes?: string;
  shop?: Shop;
  user?: ShopClientUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopClientPayload {
  shopId: string;
  userId: string;
  customName?: string;
  customPhone?: string;
  customEmail?: string;
  notes?: string;
}

export interface UpdateShopClientPayload {
  customName?: string;
  customPhone?: string;
  customEmail?: string;
  notes?: string;
}

export interface ShopClientFilters {
  shopId?: string;
  search?: string;
  page?: number;
  perPage?: number;
}
