import { Organization } from "./organization";
import { Shop } from "./shop";

export type GoalPeriod = 'WEEKLY' | 'MONTHLY';

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
