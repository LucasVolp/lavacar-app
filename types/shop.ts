export interface Shop {
    id: string;
    name: string;
    slug: string;
    description?: string;
    document?: string;
    phone: string;
    email?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;

    slotInterval: number;
    bufferBetweenSlots: number;
    maxAdvanceDays: number;
    minAdvanceMinutes: number;

    organizationId: string;
    ownerId?: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateShopPayload {
    name: string;
    description?: string;
    document?: string;
    phone: string;
    email?: string;

    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;

    slotInterval?: number;
    bufferBetweenSlots?: number;
    maxAdvanceDays?: number;
    minAdvanceMinutes?: number;

    organizationId: string;
    ownerId?: string;
}

export interface UpdateShopPayload {
    name?: string;
    description?: string;
    document?: string;
    phone?: string;
    email?: string;

    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;

    slotInterval?: number;
    bufferBetweenSlots?: number;
    maxAdvanceDays?: number;
    minAdvanceMinutes?: number;

    ownerId?: string;
    organizationId?: string;
}

export interface ShopFilter {
    name?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    organizationId?: string;
}

export interface ShopManager {
    id: string;
    shopId: string;
    memberId: string;
    
    createdAt: string;
    updatedAt: string;
}