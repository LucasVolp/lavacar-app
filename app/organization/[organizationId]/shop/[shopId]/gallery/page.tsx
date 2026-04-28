"use client";

import React, { useCallback, useState } from "react";
import { message } from "antd";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAuth } from "@/contexts/AuthContext";
import { useShopById, useUploadGalleryImage, useDeleteGalleryImage } from "@/hooks/useShops";
import { EmployeeAccessDenied } from "@/components/layout/EmployeeAccessDenied";
import {
  GalleryHeader,
  GalleryDropzone,
  GalleryUploadQueue,
  GalleryGrid,
  type UploadingFile,
} from "@/components/admin/shop/gallery";

export default function GalleryPage() {
  const { shopId, organizationId, shop: contextShop } = useShopAdmin();
  const { user } = useAuth();

  const isEmployee = (() => {
    if (!user || !organizationId) return false;
    if (user.id === contextShop?.ownerId) return false;
    if (user.role === "ADMIN") return false;
    if (user.organizations?.some((org: { id: string }) => org.id === organizationId)) return false;
    const membership = user.organizationMembers?.find(
      (m: { organizationId: string; role: string }) => m.organizationId === organizationId
    );
    return membership?.role === "EMPLOYEE";
  })();

  const { data: shop, isLoading } = useShopById(shopId);
  const uploadMutation = useUploadGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [deletingUrls, setDeletingUrls] = useState<Set<string>>(new Set());

  const gallery: string[] = shop?.gallery ?? [];

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const accepted = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (accepted.length === 0) {
        message.warning("Apenas arquivos de imagem são permitidos.");
        return;
      }
      for (const file of accepted) {
        const id = `${Date.now()}-${Math.random()}`;
        setUploading((prev) => [...prev, { id, name: file.name, progress: "uploading" }]);
        try {
          await uploadMutation.mutateAsync({ id: shopId, file });
          setUploading((prev) =>
            prev.map((u) => (u.id === id ? { ...u, progress: "done" } : u))
          );
          setTimeout(() => setUploading((prev) => prev.filter((u) => u.id !== id)), 1200);
          message.success(`"${file.name}" adicionada ao portfólio.`);
        } catch {
          setUploading((prev) =>
            prev.map((u) => (u.id === id ? { ...u, progress: "error" } : u))
          );
          setTimeout(() => setUploading((prev) => prev.filter((u) => u.id !== id)), 3000);
          message.error(`Erro ao enviar "${file.name}". Tente novamente.`);
        }
      }
    },
    [shopId, uploadMutation]
  );

  const handleDelete = async (url: string) => {
    setDeletingUrls((prev) => new Set(prev).add(url));
    try {
      await deleteMutation.mutateAsync({ id: shopId, url });
      message.success("Foto removida do portfólio.");
    } catch {
      message.error("Erro ao remover a foto. Tente novamente.");
    } finally {
      setDeletingUrls((prev) => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
    }
  };

  if (isEmployee) {
    return <EmployeeAccessDenied shopId={shopId} organizationId={organizationId} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <GalleryHeader count={gallery.length} />
      <GalleryDropzone onFiles={processFiles} />
      <GalleryUploadQueue items={uploading} />
      <GalleryGrid
        images={gallery}
        deletingUrls={deletingUrls}
        isLoading={isLoading}
        hasUploading={uploading.length > 0}
        onDelete={handleDelete}
      />
    </div>
  );
}
