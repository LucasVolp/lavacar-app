"use client";

import React, { useState } from "react";
import { Modal, Rate, Input, message } from "antd";
import { StarFilled } from "@ant-design/icons";

interface ReviewModalProps {
  open: boolean;
  appointmentId: string;
  serviceName: string;
  onSubmit: (data: { appointmentId: string; rating: number; comment?: string }) => void;
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

  const handleOk = () => {
    if (rating === 0) {
      message.warning("Selecione uma nota para continuar.");
      return;
    }

    onSubmit({
      appointmentId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  const handleAfterClose = () => {
    setRating(0);
    setComment("");
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
      </div>
    </Modal>
  );
};

export default ReviewModal;
