import { Shop, ShopManager } from "./shop";

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

    createdAt: string;
    updatedAt: string;
}