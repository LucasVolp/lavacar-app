import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users";
import { User, UpdateUserPayload, ShadowUser, CreateUserPayload } from "@/types/user";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  byEmail: (email: string) => [...userKeys.all, "email", email] as const,
  byPhone: (phone: string) => [...userKeys.all, "phone", phone] as const,
  publicByPhone: (phone: string) => [...userKeys.all, "public", "phone", phone] as const,
};

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => usersService.findAll(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUser(id: string | null, enabled = true) {
  return useQuery({
    queryKey: userKeys.detail(id || ""),
    queryFn: () => usersService.findOne(id!),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserByEmail(email: string | null, enabled = true) {
  return useQuery({
    queryKey: userKeys.byEmail(email || ""),
    queryFn: () => usersService.findByEmail(email!),
    enabled: enabled && !!email,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicUserByPhone(phone: string | null, enabled = true) {
  return useQuery<ShadowUser | null>({
    queryKey: userKeys.publicByPhone(phone || ""),
    queryFn: () => usersService.findPublicUser(phone!),
    enabled: enabled && !!phone,
    staleTime: 0,
    retry: false,
  });
}

export function useUserByPhone(phone: string | null, enabled = true) {
  return useQuery<User | null>({
    queryKey: userKeys.byPhone(phone || ""),
    queryFn: () => usersService.findByPhone(phone!),
    enabled: enabled && !!phone && phone.length >= 10,
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({
      id,
      newPassword,
    }: {
      id: string;
      newPassword: string;
    }) => {
      return usersService.update(id, { password: newPassword });
    },
  });
}
