import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface ReceiptShop {
  name: string;
  logoUrl?: string;
  phone?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface ReceiptService {
  id: string;
  serviceName: string;
  servicePrice: string;
  duration: number;
}

export interface ReceiptVehicle {
  brand: string;
  model: string;
  plate?: string;
  color?: string;
}

export interface ReceiptData {
  id: string;
  scheduledAt: string;
  endTime?: string;
  totalPrice: string;
  totalDuration: number;
  notes?: string;
  shop: ReceiptShop;
  vehicle?: ReceiptVehicle;
  services: ReceiptService[];
  clientName?: string;
}

interface AppointmentReceiptProps {
  data: ReceiptData;
}

function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export const AppointmentReceipt = React.forwardRef<HTMLDivElement, AppointmentReceiptProps>(
  ({ data }, ref) => {
    const scheduledDate = new Date(data.scheduledAt);
    const receiptNumber = data.id.slice(0, 8).toUpperCase();

    const shopAddress = [
      data.shop.street && data.shop.number
        ? `${data.shop.street}, ${data.shop.number}`
        : data.shop.street,
      data.shop.neighborhood,
      data.shop.city && data.shop.state
        ? `${data.shop.city} - ${data.shop.state}`
        : data.shop.city,
    ]
      .filter(Boolean)
      .join(" — ");

    return (
      <div
        ref={ref}
        style={{
          fontFamily: "Arial, sans-serif",
          color: "#1a1a1a",
          backgroundColor: "#ffffff",
          padding: "40px",
          maxWidth: "600px",
          margin: "0 auto",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          {data.shop.logoUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={data.shop.logoUrl}
              alt={data.shop.name}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "12px",
                objectFit: "cover",
                marginBottom: "12px",
              }}
            />
          )}
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>
            {data.shop.name}
          </div>
          {shopAddress && (
            <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>
              {shopAddress}
            </div>
          )}
          {data.shop.phone && (
            <div style={{ color: "#6b7280", fontSize: "12px" }}>{data.shop.phone}</div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2px dashed #e5e7eb", marginBottom: "24px" }} />

        {/* Receipt Title */}
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#374151",
            marginBottom: "24px",
          }}
        >
          Comprovante de Agendamento
        </div>

        {/* Receipt Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "600" }}>
              Nº do Recibo
            </div>
            <div style={{ fontWeight: "700", color: "#111827" }}>#{receiptNumber}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "600" }}>
              Emissão
            </div>
            <div style={{ fontWeight: "600" }}>
              {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontWeight: "700", color: "#374151", marginBottom: "12px", fontSize: "13px" }}>
            Detalhes do Agendamento
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ color: "#6b7280", paddingBottom: "6px", width: "40%" }}>Data</td>
                <td style={{ fontWeight: "600", paddingBottom: "6px" }}>
                  {format(scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </td>
              </tr>
              <tr>
                <td style={{ color: "#6b7280", paddingBottom: "6px" }}>Horário</td>
                <td style={{ fontWeight: "600", paddingBottom: "6px" }}>
                  {format(scheduledDate, "HH:mm")}
                  {data.endTime && ` — ${format(new Date(data.endTime), "HH:mm")}`}
                  {" "}({formatDuration(data.totalDuration)})
                </td>
              </tr>
              {data.clientName && (
                <tr>
                  <td style={{ color: "#6b7280", paddingBottom: "6px" }}>Cliente</td>
                  <td style={{ fontWeight: "600", paddingBottom: "6px" }}>{data.clientName}</td>
                </tr>
              )}
              {data.vehicle && (
                <>
                  <tr>
                    <td style={{ color: "#6b7280", paddingBottom: "6px" }}>Veículo</td>
                    <td style={{ fontWeight: "600", paddingBottom: "6px" }}>
                      {data.vehicle.brand} {data.vehicle.model}
                      {data.vehicle.color && ` — ${data.vehicle.color}`}
                    </td>
                  </tr>
                  {data.vehicle.plate && (
                    <tr>
                      <td style={{ color: "#6b7280", paddingBottom: "6px" }}>Placa</td>
                      <td style={{ fontWeight: "600", paddingBottom: "6px" }}>
                        {data.vehicle.plate}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Services */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontWeight: "700", color: "#374151", marginBottom: "12px", fontSize: "13px" }}>
            Serviços
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", paddingBottom: "8px" }}>
                  Descrição
                </th>
                <th style={{ textAlign: "right", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", paddingBottom: "8px" }}>
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {data.services.map((service) => (
                <tr key={service.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "8px 0", color: "#374151" }}>
                    {service.serviceName}
                    <span style={{ color: "#9ca3af", fontSize: "11px", marginLeft: "8px" }}>
                      ({formatDuration(service.duration)})
                    </span>
                  </td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600" }}>
                    {formatCurrency(service.servicePrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#111827",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "14px 16px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontWeight: "700", fontSize: "15px" }}>Total</span>
          <span style={{ fontWeight: "700", fontSize: "18px" }}>
            {formatCurrency(data.totalPrice)}
          </span>
        </div>

        {/* Notes */}
        {data.notes && (
          <div
            style={{
              backgroundColor: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ fontWeight: "700", color: "#92400e", marginBottom: "4px", fontSize: "12px" }}>
              Observações
            </div>
            <div style={{ color: "#78350f", fontSize: "12px" }}>{data.notes}</div>
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: "2px dashed #e5e7eb", marginBottom: "20px" }} />

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "11px" }}>
          <div>Obrigado pela preferência!</div>
          <div style={{ marginTop: "4px" }}>
            Comprovante gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>
      </div>
    );
  }
);

AppointmentReceipt.displayName = "AppointmentReceipt";
