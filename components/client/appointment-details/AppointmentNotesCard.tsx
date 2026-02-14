import React from "react";
import { Card } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface AppointmentNotesCardProps {
  notes: string;
}

export function AppointmentNotesCard({ notes }: AppointmentNotesCardProps) {
  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30 shadow-none rounded-2xl">
      <h4 className="font-medium text-yellow-800 dark:text-yellow-500 mb-2 flex items-center gap-2">
        <ExclamationCircleOutlined /> Observações
      </h4>
      <p className="text-yellow-700 dark:text-yellow-400/80 m-0 text-sm">{notes}</p>
    </Card>
  );
}
