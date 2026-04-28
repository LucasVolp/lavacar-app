"use client";

import React from "react";
import Image from "next/image";
import { Spin } from "antd";
import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";

interface GalleryGridProps {
  images: string[];
  deletingUrls: Set<string>;
  isLoading: boolean;
  hasUploading: boolean;
  onDelete: (url: string) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  deletingUrls,
  isLoading,
  hasUploading,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spin size="large" tip="Carregando portfólio…" />
      </div>
    );
  }

  if (images.length === 0 && !hasUploading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-6 rounded-3xl mb-4 transition-colors duration-300">
          <PictureOutlined className="text-5xl text-zinc-400 dark:text-zinc-600" />
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
          Nenhuma foto ainda. Adicione imagens para exibir na vitrine digital.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((url, i) => {
        const isDeleting = deletingUrls.has(url);
        return (
          <div
            key={url}
            className={`group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 ${
              isDeleting ? "opacity-40 scale-95" : "opacity-100"
            }`}
          >
            <Image
              src={url}
              alt={`Portfólio ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => onDelete(url)}
              disabled={isDeleting}
              aria-label="Remover foto"
              className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:cursor-not-allowed min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              {isDeleting ? <Spin size="small" /> : <DeleteOutlined />}
            </button>
          </div>
        );
      })}
    </div>
  );
};
