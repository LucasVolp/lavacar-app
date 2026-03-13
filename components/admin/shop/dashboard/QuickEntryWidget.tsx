"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button, Card, Input, Typography, Spin, App } from "antd";
import {
  SearchOutlined,
  CarOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  PhoneOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { useVehicleByPlate } from "@/hooks/useVehicles";
import { useUserByPhone } from "@/hooks/useUsers";
import { sanitizePlate, sanitizePhone } from "@/lib/security";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StatusBadge } from "@/components/ui";
import { formatVehiclePlate, normalizeVehiclePlate } from "@/utils/vehiclePlate";
import { maskPhone } from "@/lib/masks";

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

interface VehicleWithOwner extends Vehicle {
  user?: User | null;
}

type SearchMode = "plate" | "phone" | "idle";

function detectSearchMode(input: string): SearchMode {
  if (!input) return "idle";
  if (/[A-Za-z]/.test(input)) return "plate";
  if (/^\d+$/.test(input)) return "phone";
  return "idle";
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
  todayAppointments,
  onOpenWizard,
}) => {
  const { message, modal } = App.useApp();

  const [rawInput, setRawInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const debouncedInput = useDebouncedValue(rawInput, 400);

  const searchMode = useMemo(() => detectSearchMode(rawInput), [rawInput]);

  const sanitizedPlate = useMemo(() => {
    if (searchMode !== "plate") return "";
    return normalizeVehiclePlate(sanitizePlate(debouncedInput));
  }, [searchMode, debouncedInput]);

  const shouldFetchVehicle =
    searchMode === "plate" &&
    sanitizedPlate.length === 7 &&
    PLATE_REGEX.test(sanitizedPlate);

  const vehicleQuery = useVehicleByPlate(
    shouldFetchVehicle ? sanitizedPlate : null,
    shouldFetchVehicle,
  );

  const sanitizedPhone = useMemo(() => {
    if (searchMode !== "phone") return "";
    return sanitizePhone(debouncedInput).replace(/\D/g, "");
  }, [searchMode, debouncedInput]);

  const shouldFetchUser = searchMode === "phone" && sanitizedPhone.length >= 10;

  const userQuery = useUserByPhone(
    shouldFetchUser ? sanitizedPhone : null,
    shouldFetchUser,
  );

  const updateStatus = useUpdateAppointmentStatus();

  const isFetching = vehicleQuery.isFetching || userQuery.isFetching;

  React.useEffect(() => {
    if (isFetching) {
      setStatusMessage(
        searchMode === "phone" ? "Buscando cliente..." : "Buscando veículo...",
      );
      return;
    }

    if (searchMode === "plate") {
      const vehicleData = vehicleQuery.data as VehicleWithOwner | null | undefined;
      if (vehicleData) {
        const ownerInfo = vehicleData.user
          ? ` — ${vehicleData.user.firstName}`
          : "";
        setStatusMessage(
          `Veículo encontrado: ${vehicleData.brand} ${vehicleData.model}${ownerInfo}`,
        );
      } else if (shouldFetchVehicle && !vehicleQuery.isError) {
        setStatusMessage("Veículo não encontrado. Pressione Enter para cadastrar.");
      } else {
        setStatusMessage(null);
      }
    } else if (searchMode === "phone") {
      const userData = userQuery.data;
      if (userData) {
        setStatusMessage(`Cliente encontrado: ${userData.firstName}`);
      } else if (shouldFetchUser && !userQuery.isError) {
        setStatusMessage("Cliente não encontrado. Pressione Enter para cadastrar.");
      } else {
        setStatusMessage(null);
      }
    } else {
      setStatusMessage(null);
    }
  }, [
    searchMode,
    vehicleQuery.data,
    vehicleQuery.isFetching,
    vehicleQuery.isError,
    userQuery.data,
    userQuery.isFetching,
    userQuery.isError,
    shouldFetchVehicle,
    shouldFetchUser,
    isFetching,
  ]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (/[A-Za-z]/.test(raw)) {
        setRawInput(raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7));
      } else {
        setRawInput(raw.replace(/\D/g, "").slice(0, 11));
      }
    },
    [],
  );

  const confirmExistingAppointment = useCallback(
    (appointment: Appointment) => {
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
              <Text strong>Horário:</Text> <Text>{scheduledTime}</Text>
            </div>
            <div>
              <Text strong>Serviços:</Text> <Text>{servicesList || "---"}</Text>
            </div>
            <div>
              <Text strong>Status:</Text> <Text>{appointment.status}</Text>
            </div>
            <div>
              <StatusBadge status={appointment.status} />
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
            setRawInput("");
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

  const canSearch = useMemo(() => {
    if (searchMode === "plate") return rawInput.length === 7 && PLATE_REGEX.test(rawInput);
    if (searchMode === "phone") return rawInput.length >= 10 && rawInput.length <= 11;
    return false;
  }, [searchMode, rawInput]);

  const handleSearch = useCallback(
    async () => {
      if (!canSearch) return;

      const mode = searchMode;

      if (mode === "plate") {
        const sanitized = normalizeVehiclePlate(sanitizePlate(rawInput));

        const existingAppointment = todayAppointments.find(
          (appointment) =>
            normalizeVehiclePlate(appointment.vehicle?.plate) === sanitized &&
            ACTIONABLE_STATUSES.includes(appointment.status),
        );

        if (existingAppointment) {
          confirmExistingAppointment(existingAppointment);
          return;
        }

        const vehicleData = vehicleQuery.data as VehicleWithOwner | null | undefined;

        if (vehicleData) {
          onOpenWizard(sanitized, vehicleData, vehicleData.user ?? null);
        } else if (!vehicleQuery.isFetching) {
          onOpenWizard(sanitized, null, null);
        } else {
          message.loading("Aguarde a busca terminar...");
        }
      } else if (mode === "phone") {
        const digits = rawInput;

        const existingAppointment = todayAppointments.find(
          (appointment) =>
            appointment.user?.phone === digits &&
            ACTIONABLE_STATUSES.includes(appointment.status),
        );

        if (existingAppointment) {
          confirmExistingAppointment(existingAppointment);
          return;
        }

        const userData = userQuery.data;

        if (userData) {
          onOpenWizard("", null, userData);
        } else if (!userQuery.isFetching) {
          const partialUser = { phone: digits } as User;
          onOpenWizard("", null, partialUser);
        } else {
          message.loading("Aguarde a busca terminar...");
        }
      }
    },
    [
      canSearch,
      searchMode,
      rawInput,
      message,
      todayAppointments,
      vehicleQuery.data,
      vehicleQuery.isFetching,
      userQuery.data,
      userQuery.isFetching,
      confirmExistingAppointment,
      onOpenWizard,
    ],
  );

  const displayValue = useMemo(() => {
    if (searchMode === "phone" && rawInput.length > 2) {
      return maskPhone(rawInput);
    }
    return rawInput;
  }, [searchMode, rawInput]);

  return (
    <div className="space-y-4">
      <Card
        className="w-full rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-zinc-900 dark:to-zinc-900 p-6 relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] opacity-5">
            <CarOutlined style={{ fontSize: "140px" }} />
          </div>

          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
              <SearchOutlined className="text-xl" />
            </div>
            <Title
              level={4}
              className="!m-0 text-zinc-800 dark:text-zinc-100"
            >
              Entrada Rápida
            </Title>
          </div>

          <div className="relative z-10 flex gap-2">
            <Input
              size="large"
              placeholder="Placa ou telefone..."
              value={displayValue}
              onChange={handleInputChange}
              onPressEnter={handleSearch}
              prefix={
                searchMode === "phone" ? (
                  <PhoneOutlined className="text-emerald-500 dark:text-emerald-400" />
                ) : searchMode === "plate" ? (
                  <CarOutlined className="text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <SearchOutlined className="text-zinc-400" />
                )
              }
              className="flex-1 !h-12 !rounded-xl !border-zinc-200 dark:!border-zinc-700 !bg-white dark:!bg-zinc-800 [&_input]:!bg-transparent"
              style={{
                fontFamily: searchMode === "plate" ? "monospace" : "inherit",
                fontSize: 18,
                letterSpacing: searchMode === "plate" ? "0.1em" : "normal",
                textTransform: searchMode === "plate" ? "uppercase" : "none",
              }}
            />
            <Button
              type="primary"
              size="large"
              icon={isFetching || updateStatus.isPending ? undefined : <ArrowRightOutlined />}
              loading={isFetching || updateStatus.isPending}
              disabled={!canSearch}
              onClick={handleSearch}
              className="!h-12 !min-w-[120px] !rounded-xl !bg-emerald-600 hover:!bg-emerald-500 !border-0 !font-semibold !shadow-lg !shadow-emerald-600/20 disabled:!bg-zinc-300 dark:disabled:!bg-zinc-700 disabled:!shadow-none"
            >
              Buscar
            </Button>
          </div>

          {isFetching && (
            <div className="flex items-center gap-2 mt-3 relative z-10">
              <Spin size="small" />
              <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                {searchMode === "phone" ? "Buscando cliente..." : "Buscando veículo..."}
              </Text>
            </div>
          )}

          {!isFetching && statusMessage && (
            <div className="flex items-center gap-2 mt-3 relative z-10">
              {statusMessage.includes("encontrado:") ? (
                <CheckCircleOutlined className="text-emerald-500" />
              ) : statusMessage.includes("não encontrado") ? (
                <UserAddOutlined className="text-blue-500" />
              ) : (
                <UserOutlined className="text-zinc-400" />
              )}
              <Text className="text-zinc-600 dark:text-zinc-300 text-sm">
                {statusMessage}
              </Text>
            </div>
          )}

          <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-600 relative z-10">
            {searchMode === "phone"
              ? `Telefone: (XX) XXXXX-XXXX — ${rawInput.length}/11 dígitos`
              : searchMode === "plate"
                ? `Placa: ${formatVehiclePlate("ABC1234")} ou ${formatVehiclePlate("ABC1D23")} — ${rawInput.length}/7 caracteres`
                : `Digite a placa (${formatVehiclePlate("ABC1234")}) ou telefone do cliente e pressione Enter.`
            }
          </div>
        </div>
      </Card>
    </div>
  );
};
