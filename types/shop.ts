// Types baseados no schema Prisma

export type ShopStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  document?: string;
  phone: string;
  email?: string;
  status: ShopStatus;

  // Endereço
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;

  // Configurações
  slotInterval: number;
  bufferBetweenSlots: number;
  maxAdvanceDays: number;
  minAdvanceMinutes: number;

  // Relacionamentos
  organizationId: string;
  ownerId?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateShopDto {
  name: string;
  slug: string;
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

export type UpdateShopDto = Partial<CreateShopDto>;

export interface FindAllShopDto {
  city?: string;
  state?: string;
  status?: ShopStatus;
  search?: string;
}

// Helpers para status
export const SHOP_STATUS_MAP: Record<ShopStatus, { label: string; color: string; badgeClass: string }> = {
  ACTIVE: { label: 'Ativo', color: '#52c41a', badgeClass: 'badge-success' },
  INACTIVE: { label: 'Inativo', color: '#faad14', badgeClass: 'badge-warning' },
  SUSPENDED: { label: 'Suspenso', color: '#ff4d4f', badgeClass: 'badge-error' },
};
