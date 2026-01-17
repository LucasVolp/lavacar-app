"use client";

import React from "react";
import { Modal, Typography, Input } from "antd";

const { Text } = Typography;

interface AppointmentCancelModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  reason: string;
  setReason: (reason: string) => void;
  loading: boolean;
}

export const AppointmentCancelModal: React.FC<AppointmentCancelModalProps> = ({
  open,
  onCancel,
  onConfirm,
  reason,
  setReason,
  loading,
}) => {
  return (
    <Modal
      title="Cancelar Agendamento"
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Confirmar Cancelamento"
      okButtonProps={{ danger: true, loading }}
      cancelText="Voltar"
    >
      <div className="space-y-4">
        <Text>Tem certeza que deseja cancelar este agendamento?</Text>
        <Input.TextArea
          placeholder="Motivo do cancelamento (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
        />
      </div>
    </Modal>
  );
};
