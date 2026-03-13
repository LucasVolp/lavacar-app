"use client";

import React, { useMemo, useState } from "react";
import {
  Col,
  Empty,
  Row,
  Spin,
  Tabs,
  message,
} from "antd";
import {
  HistoryOutlined,
  HeartOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useShopClient, useUpdateShopClient } from "@/hooks/useShopClients";
import { useShopAppointments } from "@/hooks/useAppointments";
import { getChecklistByAppointment } from "@/services/checklist";
import type { Appointment } from "@/types/appointment";
import type { Checklist } from "@/types/checklist";
import {
  ClientDetailHeader,
  ClientEditCard,
  ClientLtvCard,
  ClientPreferencesTab,
  ClientQuickInfoCard,
  ClientTimelineTab,
  ClientVistoriasTab,
} from "@/components/admin/shop/clients/dossier";

const TIMELINE_PAGE_SIZE = 5;
const GALLERY_PAGE_SIZE = 12;

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { shopId } = useShopAdmin();
  const clientId = params.clientId as string;
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "timeline");

  const { data: client, isLoading: isLoadingClient } = useShopClient(clientId, !!clientId);
  const updateClient = useUpdateShopClient();
  const [preferencesNotes, setPreferencesNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [timelinePage, setTimelinePage] = useState(1);
  const [timelinePageSize, setTimelinePageSize] = useState(TIMELINE_PAGE_SIZE);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryPageSize, setGalleryPageSize] = useState(GALLERY_PAGE_SIZE);

  const userId = client?.user?.id || null;
  const phone = client?.customPhone || client?.user?.phone || "";
  const email = client?.customEmail || client?.user?.email || "";

  const { data: appointmentsData, isLoading: isLoadingAppointments } = useShopAppointments(
    shopId,
    { userId: userId || undefined, perPage: timelinePageSize, page: timelinePage, sortOrder: "desc" },
    !!shopId && !!userId
  );

  const { data: allAppointmentsData } = useShopAppointments(
    shopId,
    { userId: userId || undefined, perPage: 500, sortOrder: "desc" },
    !!shopId && !!userId
  );

  const appointments = useMemo<Appointment[]>(
    () => appointmentsData?.data ?? [],
    [appointmentsData]
  );

  const allAppointments = useMemo<Appointment[]>(
    () => allAppointmentsData?.data ?? [],
    [allAppointmentsData]
  );

  const totalAppointments = appointmentsData?.meta?.total ?? 0;

  React.useEffect(() => {
    setPreferencesNotes(client?.notes || "");
  }, [client?.notes]);

  const checklistQueries = useQueries({
    queries: appointments.map((appointment) => ({
      queryKey: ["checklist", "appointment", appointment.id],
      queryFn: async () => {
        try {
          return await getChecklistByAppointment(appointment.id, { silentNotFound: true });
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
          }
          throw error;
        }
      },
      enabled: !!appointment.id,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoadingChecklists = checklistQueries.some((query) => query.isLoading);
  const checklistByAppointmentId = useMemo<Record<string, Checklist | null>>(
    () =>
      Object.fromEntries(
        appointments.map((appointment, index) => [
          appointment.id,
          checklistQueries[index]?.data ?? null,
        ])
      ),
    [appointments, checklistQueries]
  );

  const completedAppointments = useMemo(
    () => allAppointments.filter((appointment) => appointment.status === "COMPLETED"),
    [allAppointments]
  );

  const ltv = useMemo(
    () =>
      completedAppointments.reduce(
        (total, appointment) => total + parseFloat(appointment.totalPrice || "0"),
        0
      ),
    [completedAppointments]
  );

  const avgTicket = useMemo(() => {
    if (completedAppointments.length === 0) return 0;
    return ltv / completedAppointments.length;
  }, [completedAppointments, ltv]);

  const avgReturnDays = useMemo(() => {
    if (completedAppointments.length < 2) return 15;

    const asc = [...completedAppointments].sort(
      (a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf()
    );

    const intervals: number[] = [];
    for (let i = 1; i < asc.length; i += 1) {
      intervals.push(
        Math.max(1, dayjs(asc[i].scheduledAt).diff(dayjs(asc[i - 1].scheduledAt), "day"))
      );
    }

    return Math.round(intervals.reduce((sum, value) => sum + value, 0) / intervals.length);
  }, [completedAppointments]);

  const lastVisitDate = completedAppointments[0]?.scheduledAt
    ? dayjs(completedAppointments[0].scheduledAt)
    : null;
  const daysSinceLastVisit = lastVisitDate ? dayjs().diff(lastVisitDate, "day") : 0;
  const isOverdue = !!lastVisitDate && daysSinceLastVisit > avgReturnDays;

  const vistoriaGallery = useMemo(() => {
    return appointments.flatMap((appointment) => {
      const checklist = checklistByAppointmentId[appointment.id];
      if (!checklist?.photos?.length) return [];

      return checklist.photos.map((photo: string, index: number) => ({
        key: `${appointment.id}-${index}`,
        photo,
        appointment,
      }));
    });
  }, [appointments, checklistByAppointmentId]);

  const fullName = client?.customName ||
    `${client?.user?.firstName || ""} ${client?.user?.lastName || ""}`.trim() ||
    "Cliente";

  const memberSince = client?.createdAt
    ? dayjs(client.createdAt).format("MMM [de] YYYY")
    : undefined;

  const handleSavePreferences = async () => {
    if (!client) return;

    try {
      await updateClient.mutateAsync({
        id: client.id,
        payload: { notes: preferencesNotes.trim() || "" },
      });
      message.success("Preferências atualizadas com sucesso.");
    } catch {
      message.error("Erro ao atualizar preferências.");
    }
  };

  const rescueMessage = encodeURIComponent(
    `Oi ${fullName}, tudo bem? Faz ${daysSinceLastVisit} dias que não te vejo aqui. ` +
      `Quer reservar um horário para cuidar do seu carro?`
  );
  const whatsappUrl = phone
    ? `https://wa.me/55${phone.replace(/\D/g, "")}?text=${rescueMessage}`
    : "";

  if (isLoadingClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin size="large" tip="Carregando detalhamento do cliente..." />
      </div>
    );
  }

  if (!client || !client.user) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Empty
          description="Cliente não encontrado"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <ClientDetailHeader
        fullName={fullName}
        picture={client.user.picture}
        email={email}
        phone={phone}
        memberSince={memberSince}
        totalAppointments={totalAppointments}
        onBack={() => router.push(`/admin/shop/${shopId}/clients`)}
        onEdit={() => setIsEditing(true)}
      />

      <ClientEditCard
        client={client}
        open={isEditing}
        onClose={() => setIsEditing(false)}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <div className="space-y-4">
            <ClientLtvCard
              ltv={ltv}
              avgReturnDays={avgReturnDays}
              avgTicket={avgTicket}
              isOverdue={isOverdue}
              daysSinceLastVisit={daysSinceLastVisit}
              whatsappUrl={whatsappUrl}
              completedCount={completedAppointments.length}
            />
          </div>
        </Col>

        <Col xs={24} lg={16}>
          <ClientQuickInfoCard
            phone={phone}
            email={email}
            vehicles={client.user.vehicles || []}
          />
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="[&_.ant-tabs-nav]:!mb-4"
        items={[
          {
            key: "timeline",
            label: (
              <span className="flex items-center gap-2">
                <HistoryOutlined />
                Linha do Tempo
              </span>
            ),
            children: (
              <Spin spinning={isLoadingAppointments || isLoadingChecklists} tip="Carregando...">
                <ClientTimelineTab
                  appointments={appointments}
                  checklistByAppointmentId={checklistByAppointmentId}
                  currentPage={timelinePage}
                  totalItems={totalAppointments}
                  pageSize={timelinePageSize}
                  onPageChange={(page, size) => {
                    setTimelinePage(page);
                    setTimelinePageSize(size);
                  }}
                  onAppointmentClick={(appointmentId) =>
                    router.push(`/admin/shop/${shopId}/appointments/${appointmentId}`)
                  }
                />
              </Spin>
            ),
          },
          {
            key: "preferences",
            label: (
              <span className="flex items-center gap-2">
                <HeartOutlined />
                Preferências e Manhas
              </span>
            ),
            children: (
              <ClientPreferencesTab
                value={preferencesNotes}
                onChange={setPreferencesNotes}
                onSave={handleSavePreferences}
                saving={updateClient.isPending}
              />
            ),
          },
          {
            key: "vistorias",
            label: (
              <span className="flex items-center gap-2">
                <CameraOutlined />
                Galeria de Vistorias
              </span>
            ),
            children: (
              <Spin spinning={isLoadingAppointments || isLoadingChecklists} tip="Carregando...">
                <ClientVistoriasTab
                  items={vistoriaGallery}
                  currentPage={galleryPage}
                  totalItems={vistoriaGallery.length}
                  pageSize={galleryPageSize}
                  onPageChange={(page, size) => {
                    setGalleryPage(page);
                    setGalleryPageSize(size);
                  }}
                />
              </Spin>
            ),
          },
        ]}
      />
    </div>
  );
}
