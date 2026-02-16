"use client";

import React from "react";
import { Avatar, Row, Col, Tooltip } from "antd";
import {
  UserOutlined,
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  SwapOutlined
} from "@ant-design/icons";
import { Appointment } from "@/types/appointment";
import { sanitizeText } from "@/lib/security";
import { maskPhone } from "@/lib/masks";
import { formatVehiclePlate } from "@/utils/vehiclePlate";
import { getApiImageUrl } from "@/utils/image";

interface AppointmentClientVehicleProps {
  appointment: Appointment;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isOverride?: boolean;
  className?: string;
}

/**
 * InfoItem component with optional override indicator
 * Shows a subtle badge when displaying override data from ShopClient
 */
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, isOverride = false, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0">{label}</p>
        {isOverride && (
          <Tooltip title="Dado personalizado pela loja">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              <SwapOutlined className="text-[8px]" />
              Override
            </span>
          </Tooltip>
        )}
      </div>
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-0 truncate">
        {value}
      </p>
    </div>
  </div>
);

/**
 * Helper to get contact data with fallback to shopClient override
 * Priority: user data > shopClient custom data
 */
function getContactWithFallback(
  userData: string | null | undefined,
  overrideData: string | null | undefined
): { value: string | null; isOverride: boolean } {
  if (userData && userData.trim()) {
    return { value: userData, isOverride: false };
  }
  if (overrideData && overrideData.trim()) {
    return { value: overrideData, isOverride: true };
  }
  return { value: null, isOverride: false };
}

export const AppointmentClientVehicle: React.FC<AppointmentClientVehicleProps> = ({
  appointment
}) => {
  const shopClient = appointment.shopClient;

  // Client name with fallback
  const clientNameData = getContactWithFallback(
    appointment.user
      ? `${appointment.user.firstName} ${appointment.user.lastName || ''}`.trim()
      : null,
    shopClient?.customName
  );
  const clientName = clientNameData.value
    ? sanitizeText(clientNameData.value)
    : "Cliente Visitante";

  // Phone with fallback to shopClient.customPhone
  const phoneData = getContactWithFallback(
    appointment.user?.phone,
    shopClient?.customPhone
  );
  const clientPhone = phoneData.value ? maskPhone(phoneData.value) : null;

  // Email with fallback to shopClient.customEmail
  const emailData = getContactWithFallback(
    appointment.user?.email,
    shopClient?.customEmail
  );
  const clientEmail = emailData.value ? sanitizeText(emailData.value) : null;

  // Vehicle data
  const vehicleBrand = appointment.vehicle?.brand
    ? sanitizeText(appointment.vehicle.brand)
    : null;

  const vehicleModel = appointment.vehicle?.model
    ? sanitizeText(appointment.vehicle.model)
    : null;

  const vehiclePlate = appointment.vehicle?.plate
    ? formatVehiclePlate(appointment.vehicle.plate)
    : null;

  const vehicleColor = appointment.vehicle?.color
    ? sanitizeText(appointment.vehicle.color)
    : null;

  return (
    <Row gutter={[24, 24]}>
      {/* Card do Cliente */}
      <Col xs={24} md={12}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 h-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide m-0">
              Cliente
            </h3>
          </div>

          <div className="flex items-start gap-4">
            <Avatar
              size={64}
              src={appointment.user?.picture ? getApiImageUrl(appointment.user.picture) : undefined}
              icon={!appointment.user?.picture ? <UserOutlined /> : undefined}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-0 truncate max-w-[180px]">
                  {clientName}
                </h4>
                {clientNameData.isOverride && (
                  <Tooltip title="Nome personalizado pela loja">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                      <SwapOutlined className="text-[8px]" />
                    </span>
                  </Tooltip>
                )}
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mt-1">
                Cliente Recorrente
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            {clientPhone && (
              <InfoItem
                icon={<PhoneOutlined />}
                label="Telefone"
                value={clientPhone}
                isOverride={phoneData.isOverride}
              />
            )}
            {clientEmail && (
              <InfoItem
                icon={<MailOutlined />}
                label="Email"
                value={clientEmail}
                isOverride={emailData.isOverride}
              />
            )}
            {!clientPhone && !clientEmail && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
                Contato não informado
              </p>
            )}
          </div>
        </div>
      </Col>

      {/* Card do Veículo */}
      <Col xs={24} md={12}>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 h-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide m-0">
              Veículo
            </h3>
          </div>

          <div className="flex items-start gap-4">
            <Avatar
              size={64}
              icon={<CarOutlined />}
              className="bg-gradient-to-br from-purple-500 to-pink-600 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              {vehicleBrand && vehicleModel ? (
                <>
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 truncate">
                    {vehicleBrand} {vehicleModel}
                  </h4>
                  {vehiclePlate && (
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-mono tracking-wider">
                      {vehiclePlate}
                    </span>
                  )}
                </>
              ) : (
                <h4 className="text-xl font-bold text-zinc-400 dark:text-zinc-500">
                  Veículo não identificado
                </h4>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            {vehiclePlate && (
              <InfoItem
                icon={<IdcardOutlined />}
                label="Placa"
                value={vehiclePlate}
              />
            )}
            {vehicleColor && (
              <InfoItem
                icon={<div className="w-4 h-4 rounded-full bg-gradient-to-r from-zinc-300 to-zinc-500" />}
                label="Cor"
                value={vehicleColor}
              />
            )}
            {!vehiclePlate && !vehicleColor && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
                Detalhes não informados
              </p>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};
