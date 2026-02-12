"use client";

import React, { useState, useCallback } from "react";
import { Card, Input, Typography, Spin, App } from "antd";
import {
  SearchOutlined,
  CarOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { useVehicleByPlate } from "@/hooks/useVehicles";
import { sanitizePlate } from "@/lib/security";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { Appointment, AppointmentStatus } from "@/types/appointment";
import type { Vehicle } from "@/types/vehicle";
import type { User } from "@/types/user";

const { Text, Title } = Typography;

const PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

const ACTIONABLE_STATUSES: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "WAITING",
];

/**
 * The API may populate the user relation on the vehicle when fetching by plate,
 * even though the base Vehicle type does not declare it.
 * This extended type captures that optional relation safely.
 */
interface VehicleWithOwner extends Vehicle {
  user?: User | null;
}

interface QuickEntryWidgetProps {
  shopId: string;
  todayAppointments: Appointment[];
  onOpenWizard: (
    plate: string,
    vehicle: Vehicle | null,
    user: User | null,
  ) => void;
}

export const QuickEntryWidget: React.FC<QuickEntryWidgetProps> = ({
  // shopId available for future use (e.g., scoped queries)
  shopId: _shopId,
  todayAppointments,
  onOpenWizard,
}) => {
  const { message, modal } = App.useApp();

  const [plateInput, setPlateInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const debouncedPlate = useDebouncedValue(plateInput, 400);

  const sanitizedDebounced = sanitizePlate(debouncedPlate).replace(/-/g, "");
  const shouldFetchVehicle =
    sanitizedDebounced.length === 7 && PLATE_REGEX.test(sanitizedDebounced);

  const vehicleQuery = useVehicleByPlate(
    shouldFetchVehicle ? sanitizedDebounced : null,
    shouldFetchVehicle,
  );

  const updateStatus = useUpdateAppointmentStatus();

  // Reactive status update based on query state
  React.useEffect(() => {
    if (vehicleQuery.isFetching) {
      setStatusMessage("Buscando veiculo...");
      return;
    }

    const vehicleData = vehicleQuery.data as VehicleWithOwner | null | undefined;

    if (vehicleData) {
      setStatusMessage(
        `Veiculo encontrado: ${vehicleData.brand} ${vehicleData.model}`
      );
    } else if (shouldFetchVehicle && !vehicleQuery.isError) {
      // If we should have fetched but got no data (and no error yet/anymore), it likely means 404/not found
      setStatusMessage("Veiculo nao encontrado. Pressione Enter para cadastrar.");
    } else {
      setStatusMessage(null);
    }
  }, [vehicleQuery.data, vehicleQuery.isFetching, vehicleQuery.isError, shouldFetchVehicle]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
      setPlateInput(cleaned);
      // Status message will be updated by the effect
    },
    [],
  );

  const confirmExistingAppointment = useCallback(
    (appointment: Appointment) => {
      // ... (existing implementation)
      const clientName =
        appointment.shopClient?.customName ||
        appointment.user?.firstName ||
        "Cliente";
      const scheduledTime = format(
        parseISO(appointment.scheduledAt),
        "HH:mm",
        { locale: ptBR },
      );
      const servicesList = appointment.services
        .map((s) => s.serviceName)
        .join(", ");

      modal.confirm({
        title: "Agendamento Encontrado",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        content: (
          <div className="space-y-2 mt-2">
            <div>
              <Text strong>Cliente:</Text> <Text>{clientName}</Text>
            </div>
            <div>
              <Text strong>Horario:</Text> <Text>{scheduledTime}</Text>
            </div>
            <div>
              <Text strong>Servicos:</Text> <Text>{servicesList || "---"}</Text>
            </div>
            <div>
              <Text strong>Status:</Text> <Text>{appointment.status}</Text>
            </div>
          </div>
        ),
        okText: "Iniciar Atendimento",
        cancelText: "Cancelar",
        onOk: async () => {
          try {
            await updateStatus.mutateAsync({
              id: appointment.id,
              status: "IN_PROGRESS",
            });
            message.success(
              `Atendimento de ${clientName} iniciado com sucesso!`,
            );
            setPlateInput("");
            setStatusMessage(null);
          } catch {
            message.error(
              "Erro ao atualizar status do agendamento. Tente novamente.",
            );
          }
        },
      });
    },
    [modal, message, updateStatus],
  );

  const handleSearch = useCallback(
    async (value: string) => {
      const sanitized = sanitizePlate(value).replace(/-/g, "");

      if (!PLATE_REGEX.test(sanitized)) {
        message.warning(
          "Placa invalida. Use o formato brasileiro (ex: ABC1D23 ou ABC1234).",
        );
        return;
      }

      // Step A: Check for existing appointment today
      const existingAppointment = todayAppointments.find(
        (appointment) =>
          appointment.vehicle?.plate === sanitized &&
          ACTIONABLE_STATUSES.includes(appointment.status),
      );

      if (existingAppointment) {
        confirmExistingAppointment(existingAppointment);
        return;
      }

      // Step B: Use the reactive query data directly
      // If we are here, the user pressed Enter. We should use the data we have.
      // If loading, we might want to wait, or just let the effect handle it?
      // Better to check data availability.

      const vehicleData = vehicleQuery.data as VehicleWithOwner | null | undefined;

      if (vehicleData) {
        // Vehicle found - open wizard with data
        onOpenWizard(sanitized, vehicleData, vehicleData.user ?? null);
        return;
      }

      // Step C: If not found (and not loading), it's a new vehicle
      if (!vehicleQuery.isFetching) {
         // It might be that the query failed or returned null (404).
         // In either case, we proceed to registration.
         // Double check if we should refetch to be sure?
         // If `shouldFetchVehicle` is true, the query should have run.
         
         if (shouldFetchVehicle) {
             onOpenWizard(sanitized, null, null);
         } else {
             // If regex passed but length/logic in hook didn't trigger (unlikely given validation above),
             // force a fetch? No, just open wizard.
             onOpenWizard(sanitized, null, null);
         }
      } else {
          // If still fetching when user pressed enter, we should probably wait or show a message.
          // But usually the user waits for the "Loading" to finish before pressing enter if they are looking at the screen.
          // Let's assume if they press Enter they want to proceed.
          // Ideally we would wait for the promise.
          message.loading("Aguarde a busca terminar...");
      }
    },
    [
      message,
      todayAppointments,
      vehicleQuery.data,
      vehicleQuery.isFetching,
      shouldFetchVehicle,
      confirmExistingAppointment,
      onOpenWizard,
    ],
  );

  return (
    <div className="space-y-4">
      <Card
        className="w-full rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-zinc-900 dark:to-zinc-900 p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-[-20px] right-[-20px] opacity-5">
            <CarOutlined style={{ fontSize: "140px" }} />
          </div>

          {/* Header */}
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
              <SearchOutlined className="text-xl" />
            </div>
            <Title
              level={4}
              className="!m-0 text-zinc-800 dark:text-zinc-100"
            >
              Entrada Rapida
            </Title>
          </div>

          {/* Search input */}
          <div className="relative z-10">
            <Input.Search
              size="large"
              placeholder="Digitar Placa..."
              maxLength={7}
              value={plateInput}
              onChange={handleInputChange}
              onSearch={handleSearch}
              enterButton={
                <span className="flex items-center gap-1">
                  <SearchOutlined />
                  Buscar
                </span>
              }
              loading={vehicleQuery.isFetching || updateStatus.isPending}
              className="quick-entry-search"
              style={{ minHeight: 44 }}
              styles={{
                input: {
                  fontFamily: "monospace",
                  fontSize: 18,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  minHeight: 44,
                },
              }}
            />
          </div>

          {/* Loading indicator */}
          {vehicleQuery.isFetching && (
            <div className="flex items-center gap-2 mt-3 relative z-10">
              <Spin size="small" />
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                Buscando veiculo...
              </Text>
            </div>
          )}

          {/* Status message */}
          {!vehicleQuery.isFetching && statusMessage && (
            <div className="flex items-center gap-2 mt-3 relative z-10">
              {statusMessage.includes("encontrado") ? (
                <CheckCircleOutlined className="text-emerald-500" />
              ) : (
                <UserAddOutlined className="text-blue-500" />
              )}
              <Text className="text-zinc-600 dark:text-zinc-300 text-sm">
                {statusMessage}
              </Text>
            </div>
          )}

          {/* Hint text */}
          <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-600 relative z-10">
            Digite a placa e pressione Enter para buscar ou iniciar atendimento.
          </div>
        </div>
      </Card>
    </div>
  );
};
