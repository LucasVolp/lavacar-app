import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import {
  Checklist,
  CreateChecklistDTO,
  UpdateChecklistPayload,
} from "@/types/checklist";
import { PaginatedResult } from "@/types/pagination";
import { validateUUID } from "@/utils/validators";

const base = "/checklist";

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

const assertValidAppointmentId = (value: unknown): string => {
  if (typeof value !== "string") {
    throw new Error("appointmentId deve ser uma string.");
  }

  const normalized = value.trim();

  if (!validateUUID(normalized)) {
    throw new Error("appointmentId invalido para checklist.");
  }

  return normalized;
};

const toFormData = (payload: CreateChecklistDTO): FormData => {
  const formData = new FormData();
  formData.append("appointmentId", assertValidAppointmentId(payload.appointmentId));

  if (payload.description?.trim()) {
    formData.append("description", payload.description.trim());
  }

  payload.photos?.forEach((file) => {
    formData.append("photos", file);
  });

  return formData;
};

export const createChecklist = async (
  data: FormData | CreateChecklistDTO
): Promise<Checklist> => {
  try {
    const payload = isFormData(data) ? data : toFormData(data);
    assertValidAppointmentId(payload.get("appointmentId"));

    const response: AxiosResponse<Checklist> = await axiosInstance.post(base, payload);

    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getChecklistByAppointment = async (
  appointmentId: string,
  options?: { silentNotFound?: boolean }
): Promise<Checklist> => {
  const normalizedAppointmentId = assertValidAppointmentId(appointmentId);

  try {
    const response: AxiosResponse<Checklist> = await axiosInstance.get(
      `${base}/appointment/${normalizedAppointmentId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (options?.silentNotFound) {
      const axiosErr = error as { response?: { status?: number } };
      if (axiosErr.response?.status === 404) {
        return null as unknown as Checklist;
      }
    }
    throw error;
  }
};

export const checklistService = {
  create: createChecklist,

  findByUser: async (userId: string, page = 1, perPage = 10): Promise<PaginatedResult<Checklist>> => {
    const response: AxiosResponse<PaginatedResult<Checklist>> = await axiosInstance.get(
      `${base}/user/${userId}`,
      { params: { page, perPage } }
    );
    return response.data;
  },

  findOne: async (id: string) => {
    try {
      const response: AxiosResponse<Checklist> = await axiosInstance.get(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  findByAppointment: getChecklistByAppointment,

  update: async (id: string, payload: UpdateChecklistPayload) => {
    try {
      const response: AxiosResponse<Checklist> = await axiosInstance.patch(
        `${base}/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  remove: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },
};

export default checklistService;
