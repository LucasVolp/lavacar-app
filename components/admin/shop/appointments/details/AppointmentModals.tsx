import React from "react";
import { Modal, Input, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface AppointmentModalsProps {
  cancelVisible: boolean;
  confirmVisible: boolean;
  checklistWarningVisible: boolean;
  onCancelClose: () => void;
  onConfirmClose: () => void;
  onChecklistWarningClose: () => void;
  onOpenChecklist: () => void;
  onChecklistProceed: () => void;
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
  checklistWarningVisible,
  onCancelClose,
  onConfirmClose,
  onChecklistWarningClose,
  onOpenChecklist,
  onChecklistProceed,
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
          <p className="mb-2 text-slate-600 dark:text-slate-300">Por favor, informe o motivo do cancelamento:</p>
          <Input.TextArea
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Ex: Cliente desistiu, Imprevisto na loja..."
            className="rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500"
          />
        </div>
      </Modal>

      <Modal
        title={<span className="text-amber-600 dark:text-amber-500"><ExclamationCircleOutlined /> Atenção: Data Futura</span>}
        open={confirmVisible}
        onCancel={onConfirmClose}
        onOk={onStatusConfirm}
        okText="Sim, confirmar alteração"
        cancelText="Cancelar"
        centered
      >
        <div className="py-4">
          <p className="text-slate-600 dark:text-slate-300">
            Você está tentando alterar o status deste agendamento que está marcado para uma <strong>data futura</strong> ({appointmentDate}).
          </p>
          <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">
            Tem certeza que deseja marcar como &quot;{nextStatusLabel}&quot; agora?
          </p>
        </div>
      </Modal>

      <Modal
        title={<span className="text-amber-600 dark:text-amber-500"><ExclamationCircleOutlined /> Vistoria não realizada</span>}
        open={checklistWarningVisible}
        onCancel={onChecklistWarningClose}
        footer={(
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button onClick={onOpenChecklist}>
              Adicionar Vistoria
            </Button>
            <Button type="primary" onClick={onChecklistProceed} className="bg-amber-500 hover:bg-amber-600 border-amber-500">
              Prosseguir sem vistoria
            </Button>
          </div>
        )}
        centered
      >
        <div className="py-2">
          <p className="text-slate-600 dark:text-slate-300 m-0">
            Este agendamento ainda não possui vistoria registrada. É recomendado realizar a vistoria antes de iniciar o atendimento.
          </p>
        </div>
      </Modal>
    </>
  );
};
