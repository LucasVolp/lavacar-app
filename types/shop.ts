// Types baseados no schema Prisma

export type ShopStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface ShopSocialLinks {
  instagram?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  whatsapp?: string | null;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  document?: string | null;
  phone: string;
  email?: string | null;
  status: ShopStatus;
  logoUrl?: string | null;
  bannerUrl?: string | null;

  // Endereço
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  timeZone?: string | null;
  socialLinks?: ShopSocialLinks | string | null;

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
  description?: string | null;
  document?: string | null;
  phone: string;
  email?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  timeZone?: string | null;
  socialLinks?: ShopSocialLinks | string | null;
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
