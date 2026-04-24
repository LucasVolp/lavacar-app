import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import type { BillingStatusResponse, CreateSelfCheckoutPayload, SelfCheckoutResponse } from "@/types/billing";

const base = "/billing";

export const billingService = {
    getStatus: async (): Promise<BillingStatusResponse> => {
        const response: AxiosResponse<BillingStatusResponse> = await axiosInstance.get(`${base}/status`);
        return response.data;
    },

    createSelfCheckout: async (payload: CreateSelfCheckoutPayload): Promise<SelfCheckoutResponse> => {
        const response: AxiosResponse<SelfCheckoutResponse> = await axiosInstance.post(
            `${base}/checkout/self`,
            payload,
        );
        return response.data;
    },

    // Subscription Management
    getSubscriptions: async (organizationId?: string) => {
        const params = organizationId ? { organizationId } : {};
        const response: AxiosResponse = await axiosInstance.get(`${base}/subscriptions`, { params });
        return response.data;
    },

    getSubscriptionById: async (subscriptionId: string) => {
        const response: AxiosResponse = await axiosInstance.get(`${base}/subscriptions/${subscriptionId}`);
        return response.data;
    },

    cancelSubscription: async (subscriptionId: string) => {
        const response: AxiosResponse = await axiosInstance.post(
            `${base}/subscriptions/${subscriptionId}/cancel`
        );
        return response.data;
    },

    listPayments: async (subscriptionId?: string) => {
        const params = subscriptionId ? { subscription: subscriptionId } : {};
        const response: AxiosResponse = await axiosInstance.get(`${base}/payments`, { params });
        return response.data;
    },

    getPayment: async (paymentId: string) => {
        const response: AxiosResponse = await axiosInstance.get(`${base}/payments/${paymentId}`);
        return response.data;
    },

    getPaymentPixQrCode: async (paymentId: string) => {
        const response: AxiosResponse = await axiosInstance.get(`${base}/payments/${paymentId}/pix-qrcode`);
        return response.data;
    },

    updateSubscriptionBillingType: async (subscriptionId: string, billingType: string) => {
        const response: AxiosResponse = await axiosInstance.patch(
            `${base}/${subscriptionId}/subscription`,
            { billingType }
        );
        return response.data;
    },
};

export default billingService;
