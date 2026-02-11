import { Organization } from "./organization";
import { Shop } from "./shop";

export type GoalPeriod = 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

export interface SalesGoal {
    id: string;
    amount: number;
    period: GoalPeriod;
    startDate: string;
    endDate: string;
    
    shopId?: string;
    organizationId?: string;

    shop?: Shop;
    organization?: Organization;

    currentSales?: number;

    createdAt: string;
    updatedAt: string;
}

export interface CreateSalesGoalPayload {
    amount: number;
    period: GoalPeriod;
    startDate: string;
    endDate: string;
    shopId?: string;
    organizationId?: string;
}

export interface UpdateSalesGoalPayload {
    amount?: number;
    period?: GoalPeriod;
    startDate?: string;
    endDate?: string;
}
