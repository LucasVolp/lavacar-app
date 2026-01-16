import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users";
import { User, UpdateUserPayload } from "@/types/user";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  byEmail: (email: string) => [...userKeys.all, "email", email] as const,
};

/**
 * Hook para buscar todos os usuários
 */
export function useUsers(enabled = true) {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => usersService.findAll(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para buscar um usuário específico
 */
export function useUser(id: string | null, enabled = true) {
  return useQuery({
    queryKey: userKeys.detail(id || ""),
    queryFn: () => usersService.findOne(id!),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para buscar usuário por email
 */
export function useUserByEmail(email: string | null, enabled = true) {
  return useQuery({
    queryKey: userKeys.byEmail(email || ""),
    queryFn: () => usersService.findByEmail(email!),
    enabled: enabled && !!email,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar um usuário
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<User>) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Hook para atualizar um usuário
 */
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

/**
 * Hook para deletar um usuário
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Hook para atualizar a senha do usuário
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({
      id,
      newPassword,
    }: {
      id: string;
      newPassword: string;
    }) => {
      // This would need a specific endpoint in the backend
      // For now, we'll use the update endpoint with password
      return usersService.update(id, { password: newPassword });
    },
  });
}
