import React from "react";
import { Input, Modal } from "antd";

const { TextArea } = Input;

interface AppointmentCancelModalProps {
  open: boolean;
  reason: string;
  loading: boolean;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AppointmentCancelModal({
  open,
  reason,
  loading,
  onReasonChange,
  onCancel,
  onConfirm,
}: AppointmentCancelModalProps) {
  return (
    <Modal
      title="Cancelar Agendamento"
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Confirmar Cancelamento"
      cancelText="Voltar"
      okButtonProps={{
        danger: true,
        loading,
      }}
    >
      <p className="mb-4 text-zinc-600 dark:text-zinc-300">
        Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita e
        liberará o horário para outros clientes.
      </p>
      <TextArea
        placeholder="Motivo do cancelamento (opcional)"
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        rows={3}
        className="dark:bg-zinc-800 dark:border-zinc-700"
      />
    </Modal>
  );
}
