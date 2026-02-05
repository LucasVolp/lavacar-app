import React from "react";
import { Button, Typography } from "antd";
import { LeftOutlined, PrinterOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface AppointmentDetailHeaderProps {
  onBack: () => void;
  onPrint: () => void;
  onCancel: () => void;
  isCanceled: boolean;
}

export const AppointmentDetailHeader: React.FC<AppointmentDetailHeaderProps> = ({
  onBack,
  onPrint,
  onCancel,
  isCanceled,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={onBack}
          className="hover:bg-slate-100 dark:hover:bg-zinc-800 dark:text-zinc-300 -ml-2 sm:ml-0"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0 leading-tight">
            Detalhes do Atendimento
          </h1>
          <Text type="secondary" className="text-xs dark:text-zinc-400">
            Visualização administrativa
          </Text>
        </div>
      </div>
      <div className="flex gap-3">
        <Button icon={<PrinterOutlined />} onClick={onPrint} className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white">Imprimir</Button>
        {!isCanceled && (
          <Button danger onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
};
