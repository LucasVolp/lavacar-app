import { Shop } from "./shop";

export interface ShopManager {
    id: string;
    shopId: string;
    memberId: string;
    createdAt: string;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    document?: string;
    logoUrl?: string;
    ownerId: string;
    isActive?: boolean;
    shops: Shop[];
    members: OrganizationMember[];

    createdAt: string;
    updatedAt: string;
}

export interface CreateOrganizationPayload {
    name: string;
    document?: string;
    logoUrl?: string;
    ownerId: string;
    isActive?: boolean;
}

export interface UpdateOrganizationPayload {
    name?: string;
    document?: string;
    logoUrl?: string;
    isActive?: boolean;
}

export interface OrganizationMember {
    id: string;
    userId: string;
    organizationId: string;
    role: 'ADMIN' | 'OWNER' | 'EMPLOYEE' | 'USER' | 'MANAGER';
    isActive: boolean;
    managedShops: ShopManager[];
    user?: {
        id: string;
        firstName: string;
        lastName?: string;
        email: string;
        picture?: string;
    };

    createdAt: string;
    updatedAt: string;
}

export type OrganizationInsightsPeriod = "7d" | "30d" | "90d" | "lifetime";

export interface OrganizationShopOverview {
    id: string;
    name: string;
    slug: string;
    status: Shop["status"];
    logoUrl?: string;
    bannerUrl?: string;
    phone: string;
    email?: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    timeZone: string;
    appointmentsToday: number;
    inProgressNow: number;
    totalAppointments: number;
    completedAppointments: number;
    revenue: number;
    isOpenNow: boolean;
}

export interface OrganizationRevenueSeriesPoint {
    dateKey: string;
    label: string;
    revenue: number;
    appointments: number;
}

export interface OrganizationDashboardMetrics {
    organization: {
        id: string;
        name: string;
        logoUrl?: string;
    };
    period: OrganizationInsightsPeriod;
    range: {
        startDate?: string;
        endDate?: string;
    };
    summary: {
        totalRevenue: number;
        totalAppointments: number;
        completedAppointments: number;
        canceledAppointments: number;
        inProgressNow: number;
        averageTicket: number;
        uniqueClients: number;
        newClients: number;
        recurringClients: number;
    };
    shops: OrganizationShopOverview[];
    ranking: {
        rank: number;
        shopId: string;
        name: string;
        revenue: number;
        completedAppointments: number;
    }[];
    topServices: {
        serviceId: string;
        serviceName: string;
        count: number;
        revenue: number;
    }[];
    revenueSeries: OrganizationRevenueSeriesPoint[];
}
