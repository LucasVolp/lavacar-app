import React from "react";
import { Modal, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface AppointmentModalsProps {
  cancelVisible: boolean;
  confirmVisible: boolean;
  onCancelClose: () => void;
  onConfirmClose: () => void;
  onCancelConfirm: () => void;
  onStatusConfirm: () => void;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  loading: boolean;
  nextStatusLabel?: string;
  appointmentDate?: string;
}

export const AppointmentModals: React.FC<AppointmentModalsProps> = ({
  cancelVisible,
  confirmVisible,
  onCancelClose,
  onConfirmClose,
  onCancelConfirm,
  onStatusConfirm,
  cancelReason,
  setCancelReason,
  loading,
  nextStatusLabel,
  appointmentDate,
}) => {
  return (
    <>
      <Modal
        title="Cancelar Agendamento"
        open={cancelVisible}
        onCancel={onCancelClose}
        onOk={onCancelConfirm}
        okText="Confirmar Cancelamento"
        okButtonProps={{ danger: true, loading }}
        cancelText="Voltar"
        centered
      >
        <div className="py-4">
          <p className="mb-2 text-slate-600">Por favor, informe o motivo do cancelamento:</p>
          <Input.TextArea
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Ex: Cliente desistiu, Imprevisto na loja..."
            className="rounded-xl"
          />
        </div>
      </Modal>

      <Modal
        title={<span className="text-amber-600"><ExclamationCircleOutlined /> Atenção: Data Futura</span>}
        open={confirmVisible}
        onCancel={onConfirmClose}
        onOk={onStatusConfirm}
        okText="Sim, confirmar alteração"
        cancelText="Cancelar"
        centered
      >
        <div className="py-4">
          <p className="text-slate-600">
            Você está tentando alterar o status deste agendamento que está marcado para uma <strong>data futura</strong> ({appointmentDate}).
          </p>
          <p className="text-slate-600 font-medium mt-2">
            Tem certeza que deseja marcar como &quot;{nextStatusLabel}&quot; agora?
          </p>
        </div>
      </Modal>
    </>
  );
};
