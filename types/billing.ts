export type SubscriptionStatus = "ACTIVE" | "PENDING" | "OVERDUE" | "EXPIRED" | "CANCELLED";
export type BillingCycle = "MONTHLY" | "ANNUALLY";
export type BillingType = "CREDIT_CARD" | "PIX" | "BOLETO";

export interface PixData {
    encodedImage: string;
    payload: string;
    expirationDate: string;
}

export interface SubscriptionInfo {
    id: string;
    status: SubscriptionStatus;
    billingType: BillingType;
    price: number;
    nextDueDate?: string;
    currentPeriodEnd: string;
    checkoutUrl?: string;
    pixData?: PixData;
}

export interface TrialInfo {
    isActive: boolean;
    endsAt: string;
    daysRemaining: number;
}

export interface BillingStatusResponse {
    userRole: string;
    canAccessOrganization: boolean;
    hasOrganization: boolean;
    organization?: {
        id: string;
        name: string;
        isActive: boolean;
        createdAt?: string;
        document?: string;
    };
    subscription?: SubscriptionInfo;
    trial?: TrialInfo;
}

export interface CreateSelfCheckoutPayload {
    orgName: string;
    document: string;
    billingType: BillingType;
    cycle: BillingCycle;
}

export interface SelfCheckoutResponse {
    checkoutUrl?: string;
    encodedImage?: string;
    payload?: string;
    expirationDate?: string;
    organizationId?: string;
    subscriptionId?: string;
}

export const PLAN_CONFIG = {
    MONTHLY: {
        label: "Mensal",
        price: 99.90,
        cycle: "MONTHLY" as BillingCycle,
    },
    ANNUALLY: {
        label: "Anual",
        price: 79.90,
        cycle: "ANNUALLY" as BillingCycle,
        savings: "Economize 2 meses",
    },
} as const;
