import axios, { AxiosResponse } from "axios";
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

    // Content-Type é gerenciado automaticamente pelo interceptor do axiosInstance
    // quando detecta FormData — não definir manualmente.
    const response: AxiosResponse<Checklist> = await axiosInstance.post(base, payload);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error(`Erro ao criar checklist (${status || "desconhecido"}):`, message);
    } else {
      console.error("Erro desconhecido ao criar checklist:", error);
    }
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
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (status === 404 && options?.silentNotFound) {
        throw error;
      }

      console.error(
        `Erro ao buscar checklist do agendamento ${normalizedAppointmentId} (${status || "desconhecido"}):`,
        message
      );
    } else {
      console.error(
        `Erro desconhecido ao buscar checklist do agendamento ${normalizedAppointmentId}:`,
        error
      );
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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao buscar checklist ${id} (${status || "desconhecido"}):`, message);
      } else {
        console.error(`Erro desconhecido ao buscar checklist ${id}:`, error);
      }
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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao atualizar checklist ${id} (${status || "desconhecido"}):`, message);
      } else {
        console.error(`Erro desconhecido ao atualizar checklist ${id}:`, error);
      }
      throw error;
    }
  },

  remove: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`${base}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`Erro ao deletar checklist ${id} (${status || "desconhecido"}):`, message);
      } else {
        console.error(`Erro desconhecido ao deletar checklist ${id}:`, error);
      }
      throw error;
    }
  },
};

export default checklistService;
