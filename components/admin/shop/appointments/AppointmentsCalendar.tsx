"use client";

import React from "react";
import { Card, Calendar, Typography, Empty, Tag, type CalendarProps } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { Appointment } from "@/types/appointment";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

const { Title, Text } = Typography;

interface AppointmentsCalendarProps {
  appointmentsByDate: Record<string, Appointment[]>;
  statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode; bgColor: string }>;
  shopId: string;
}

export const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({
  appointmentsByDate,
  statusConfig,
  shopId,
}) => {
  const router = useRouter();
  const [calendarDate, setCalendarDate] = React.useState<Dayjs>(dayjs());

  const dateCellRender = (value: Dayjs) => {
    // Ant Design Calendar uses Dayjs, so we convert to Date for date-fns if needed, 
    // or just use format from date-fns on the JS Date object.
    const dateKey = format(value.toDate(), "yyyy-MM-dd");
    const dayAppointments = appointmentsByDate[dateKey] || [];

    if (dayAppointments.length === 0) return null;

    return (
      <div className="space-y-1">
        {dayAppointments.slice(0, 3).map((apt) => (
          <div
            key={apt.id}
            className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: statusConfig[apt.status].bgColor }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/shop/${shopId}/appointments/${apt.id}`);
            }}
          >
            <span className="font-medium">{format(parseISO(apt.scheduledAt), "HH:mm")}</span>
            <span className="ml-1 text-gray-600">
              {apt.services[0]?.serviceName.slice(0, 8)}...
            </span>
          </div>
        ))}
        {dayAppointments.length > 3 && (
          <div className="text-xs text-gray-500 text-center">+{dayAppointments.length - 3} mais</div>
        )}
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <Card className="calendar-appointments">
      <Calendar
        value={calendarDate}
        onChange={setCalendarDate}
        cellRender={cellRender}
        onSelect={(date, { source }) => {
          if (source === "date") {
            setCalendarDate(date);
          }
        }}
      />

      {/* Lista do dia selecionado */}
      <div className="mt-6 pt-6 border-t">
        <Title level={5} className="mb-4">
          <CalendarOutlined className="mr-2" />
          Agendamentos em {format(calendarDate.toDate(), "dd/MM/yyyy")}
        </Title>

        {(() => {
          const dateKey = format(calendarDate.toDate(), "yyyy-MM-dd");
          const dayAppts = appointmentsByDate[dateKey] || [];
          if (dayAppts.length === 0) {
            return <Empty description="Nenhum agendamento nesta data" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
          }

          return (
            <div className="space-y-3">
              {dayAppts
                .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                .map((apt) => (
                  <Card
                    key={apt.id}
                    size="small"
                    hoverable
                    className="cursor-pointer"
                    style={{
                      borderLeft: `4px solid ${
                        statusConfig[apt.status].color === "default" ? "#d9d9d9" : statusConfig[apt.status].color
                      }`,
                    }}
                    onClick={() => router.push(`/admin/shop/${shopId}/appointments/${apt.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <Text strong className="text-lg block">
                            {format(parseISO(apt.scheduledAt), "HH:mm")}
                          </Text>
                          <Text type="secondary" className="text-xs">
                            {apt.totalDuration} min
                          </Text>
                        </div>
                        <div>
                          <Text strong>{apt.services.map((s) => s.serviceName).join(", ")}</Text>
                          <div className="text-green-600 font-medium">
                            R$ {parseFloat(apt.totalPrice).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <Tag color={statusConfig[apt.status].color} icon={statusConfig[apt.status].icon}>
                        {statusConfig[apt.status].label}
                      </Tag>
                    </div>
                  </Card>
                ))}
            </div>
          );
        })()}
      </div>
    </Card>
  );
};