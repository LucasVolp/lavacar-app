import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billing";
import type { CreateSelfCheckoutPayload } from "@/types/billing";

export function useBillingStatus(enabled = true) {
    return useQuery({
        queryKey: ["billing", "status"],
        queryFn: billingService.getStatus,
        enabled,
        staleTime: 30 * 1000,
        retry: 1,
    });
}

export function useCreateSelfCheckout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSelfCheckoutPayload) =>
            billingService.createSelfCheckout(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["billing"] });
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
        },
    });
}

export function usePaymentReturn() {
    return useQuery({
        queryKey: ["billing", "return"],
        queryFn: billingService.getStatus,
        enabled: true,
        staleTime: 0,
        retry: 5,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    });
}

// Subscription Management Hooks

export function useOrganizationSubscriptions(organizationId?: string) {
    return useQuery({
        queryKey: ["subscriptions", organizationId],
        queryFn: () => billingService.getSubscriptions(organizationId),
        enabled: !!organizationId,
        staleTime: 60 * 1000,
        retry: 1,
    });
}

export function useSubscriptionById(subscriptionId?: string) {
    return useQuery({
        queryKey: ["subscriptions", subscriptionId],
        queryFn: () => billingService.getSubscriptionById(subscriptionId!),
        enabled: !!subscriptionId,
        staleTime: 60 * 1000,
        retry: 1,
    });
}

export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (subscriptionId: string) =>
            billingService.cancelSubscription(subscriptionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            queryClient.invalidateQueries({ queryKey: ["billing"] });
        },
    });
}

export function useSubscriptionPayments(subscriptionId?: string) {
    return useQuery({
        queryKey: ["payments", subscriptionId],
        queryFn: () => billingService.listPayments(subscriptionId),
        enabled: !!subscriptionId,
        staleTime: 60 * 1000,
        retry: 1,
    });
}

export function useUpdateSubscriptionBillingType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ subscriptionId, billingType }: { subscriptionId: string; billingType: string }) =>
            billingService.updateSubscriptionBillingType(subscriptionId, billingType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            queryClient.invalidateQueries({ queryKey: ["billing"] });
        },
    });
}
