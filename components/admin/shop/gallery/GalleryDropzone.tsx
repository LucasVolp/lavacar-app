"use client";

import React, { useRef, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";

interface GalleryDropzoneProps {
  onFiles: (files: FileList | File[]) => void;
}

export const GalleryDropzone: React.FC<GalleryDropzoneProps> = ({ onFiles }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) onFiles(e.dataTransfer.files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 ${
        isDragOver
          ? "border-purple-500 bg-purple-500/5 scale-[1.01]"
          : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:border-purple-400 dark:hover:border-purple-500/60 hover:bg-purple-50 dark:hover:bg-purple-500/5"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="bg-zinc-200 dark:bg-zinc-800 p-4 rounded-2xl transition-colors duration-300">
        <InboxOutlined className="text-4xl text-zinc-500 dark:text-zinc-400" />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200 m-0">
          Arraste fotos aqui ou clique para selecionar
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1 m-0">
          PNG, JPG, WEBP — múltiplos arquivos suportados
        </p>
      </div>
    </div>
  );
};
