"use client";

import React, { useState } from "react";
import { Modal, Rate, Input, message, Button, Image, Upload } from "antd";
import { StarFilled, PlusOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { evaluationService } from "@/services/evaluation";

interface ReviewModalProps {
  open: boolean;
  appointmentId: string;
  serviceName: string;
  onSubmit: (data: { appointmentId: string; rating: number; comment?: string; photos?: string[] }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ratingLabels: Record<number, string> = {
  1: "Péssimo",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

const MAX_PHOTOS = 5;

export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  appointmentId,
  serviceName,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleOk = () => {
    if (rating === 0) {
      message.warning("Selecione uma nota para continuar.");
      return;
    }

    const validPhotos = photoUrls.filter((url) => url.trim().length > 0);

    onSubmit({
      appointmentId,
      rating,
      comment: comment.trim() || undefined,
      photos: validPhotos.length > 0 ? validPhotos : undefined,
    });
  };

  const handleAfterClose = () => {
    setRating(0);
    setComment("");
    setPhotoUrls([]);
  };

  const handlePhotoUpload: UploadProps["beforeUpload"] = async (file) => {
    if (photoUrls.length >= MAX_PHOTOS) {
      message.warning(`Máximo de ${MAX_PHOTOS} fotos permitidas.`);
      return false;
    }

    const isImage = String(file.type || "").startsWith("image/");
    if (!isImage) {
      message.warning("Apenas imagens são permitidas.");
      return false;
    }

    try {
      setIsUploadingPhoto(true);
      const { urls } = await evaluationService.uploadPhotos([file as File], appointmentId);
      if (urls?.length) {
        setPhotoUrls((prev) => [...prev, ...urls]);
      }
    } catch {
      message.error("Erro ao enviar imagem.");
    } finally {
      setIsUploadingPhoto(false);
    }
    return false;
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <StarFilled className="text-amber-500" />
          <span>Avaliar Serviço</span>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      afterClose={handleAfterClose}
      okText="Enviar Avaliação"
      cancelText="Cancelar"
      confirmLoading={loading}
      okButtonProps={{ disabled: rating === 0 }}
      destroyOnClose
      width={560}
    >
      <div className="flex flex-col gap-5 py-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Serviço</p>
          <p className="font-semibold text-zinc-800 dark:text-zinc-100 m-0">
            {serviceName}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            Como você avalia o serviço?
          </p>
          <div className="flex items-center gap-3">
            <Rate
              value={rating}
              onChange={setRating}
              className="text-amber-400 text-2xl"
            />
            {rating > 0 && (
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {ratingLabels[rating]}
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            Deixe um comentário <span className="text-zinc-400 dark:text-zinc-500">(opcional)</span>
          </p>
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte como foi sua experiência..."
            rows={4}
            maxLength={500}
            showCount
            className="rounded-xl"
          />
        </div>

        {/* Photo URLs section */}
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            <PictureOutlined className="mr-1" />
            Fotos do serviço <span className="text-zinc-400 dark:text-zinc-500">(opcional, máx. {MAX_PHOTOS})</span>
          </p>

          {photoUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              <Image.PreviewGroup>
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={url}
                      alt={`Foto ${index + 1}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                      fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNjY2MiIGZvbnQtc2l6ZT0iMTIiPkVycm88L3RleHQ+PC9zdmc+"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <DeleteOutlined className="text-[10px]" />
                    </button>
                  </div>
                ))}
              </Image.PreviewGroup>
            </div>
          )}

          {photoUrls.length < MAX_PHOTOS && (
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handlePhotoUpload}
            >
              <Button icon={<PlusOutlined />}>
                {isUploadingPhoto ? "Enviando..." : "Adicionar Foto"}
              </Button>
            </Upload>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
