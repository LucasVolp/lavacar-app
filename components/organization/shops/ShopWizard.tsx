"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Steps, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCreateShop } from "@/hooks/shop/useCreateShop";
import { useCreateSchedule } from "@/hooks/shop/useCreateSchedule";
import { useCreateService } from "@/hooks/shop/useCreateService";
import { shopService } from "@/services/shop";
import { StepIdentity } from "./wizard/StepIdentity";
import { StepSchedule, type ScheduleRow } from "./wizard/StepSchedule";
import { StepServices, type ServiceRow } from "./wizard/StepServices";
import { StepSuccess } from "./wizard/StepSuccess";
import { CreateShopDto } from "@/types/shop";
import { CreateSchedulePayload } from "@/types/schedule";

interface ShopWizardProps {
  organizationId: string;
  ownerId?: string;
}

const SECTION_CONTAINER_CLASS =
  "bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-200";

export const ShopWizard: React.FC<ShopWizardProps> = ({ organizationId, ownerId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStep = Number(searchParams.get("step") || 0);
  const initialShopId = searchParams.get("shopId") || "";

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [shopId, setShopId] = useState(initialShopId);
  const [shopSlug, setShopSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createShop = useCreateShop();
  const createSchedule = useCreateSchedule();
  const createService = useCreateService();

  // Validate persisted shopId on mount
  useEffect(() => {
    if (!initialShopId || initialStep < 1) return;

    shopService.findOne(initialShopId)
      .then((shop) => {
        setShopSlug(shop.slug);
      })
      .catch(() => {
        message.warning("Loja não encontrada. Reiniciando o cadastro.");
        setCurrentStep(0);
        setShopId("");
        updateUrl(0, "");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUrl = useCallback((step: number, id: string) => {
    const params = new URLSearchParams();
    if (step > 0) params.set("step", String(step));
    if (id) params.set("shopId", id);
    const query = params.toString();
    router.replace(`?${query}`, { scroll: false });
  }, [router]);

  // Step 1: Create shop
  const handleCreateShop = async (
    payload: CreateShopDto,
    logoFile: File | null,
    bannerFile: File | null,
  ) => {
    setIsSubmitting(true);
    try {
      const createdShop = await createShop.mutateAsync({
        ...payload,
        organizationId,
        ownerId,
      });

      const uploadErrors: string[] = [];

      if (logoFile) {
        try { await shopService.uploadLogo(createdShop.id, logoFile); }
        catch { uploadErrors.push("logo"); }
      }
      if (bannerFile) {
        try { await shopService.uploadBanner(createdShop.id, bannerFile); }
        catch { uploadErrors.push("banner"); }
      }

      if (uploadErrors.length) {
        message.warning(`Loja criada, mas houve erro no upload de: ${uploadErrors.join(", ")}.`);
      } else {
        message.success("Loja criada com sucesso!");
      }

      setShopId(createdShop.id);
      setShopSlug(createdShop.slug);
      setCurrentStep(1);
      updateUrl(1, createdShop.id);
    } catch (error: unknown) {
      const axiosErr = error as { response?: { data?: { message?: string | string[] } } };
      const dataMessage = axiosErr.response?.data?.message;
      if (Array.isArray(dataMessage) && dataMessage.length) {
        message.error("Revise os campos obrigatórios e tente novamente.");
      } else {
        message.error(String(dataMessage || "Erro ao criar estabelecimento."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Create schedules
  const handleCreateSchedules = async (rows: ScheduleRow[]) => {
    setIsSubmitting(true);
    try {
      const enabledDays = rows.filter((r) => r.isOpen);

      const promises = enabledDays.map((row) => {
        const payload: CreateSchedulePayload = {
          weekday: row.weekday,
          isOpen: "ACTIVE",
          startTime: row.startTime,
          endTime: row.endTime,
          shopId,
          ...(row.hasBreak && {
            breakStartTime: row.breakStartTime,
            breakEndTime: row.breakEndTime,
          }),
        };
        return createSchedule.mutateAsync(payload);
      });

      await Promise.all(promises);
      message.success("Horários salvos com sucesso!");
      setCurrentStep(2);
      updateUrl(2, shopId);
    } catch {
      message.error("Erro ao salvar horários. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Create services
  const handleCreateServices = async (services: ServiceRow[]) => {
    if (services.length === 0) {
      setCurrentStep(3);
      updateUrl(3, shopId);
      return;
    }

    setIsSubmitting(true);
    try {
      const promises = services.map((s) =>
        createService.mutateAsync({
          name: s.name,
          price: s.price,
          duration: s.duration,
          description: s.description,
          shopId,
        })
      );

      await Promise.all(promises);
      message.success("Serviços cadastrados com sucesso!");
      setCurrentStep(3);
      updateUrl(3, shopId);
    } catch {
      message.error("Erro ao cadastrar serviços. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipServices = () => {
    setCurrentStep(3);
    updateUrl(3, shopId);
  };

  const stepItems = useMemo(
    () => [
      { title: "Identidade" },
      { title: "Horários" },
      { title: "Serviços" },
      { title: "Concluído" },
    ],
    []
  );

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-1">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="pl-0 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center mb-1"
            onClick={() => router.back()}
          >
            Voltar para listagem
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Novo Estabelecimento
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-2xl">
            Configure sua loja passo a passo. Vamos guiar você em cada etapa.
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className={SECTION_CONTAINER_CLASS}>
        <div className="p-6">
          <Steps current={currentStep} items={stepItems} />
        </div>
      </div>

      {/* Step content */}
      {currentStep === 0 && (
        <StepIdentity
          organizationId={organizationId}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateShop}
          onCancel={() => router.back()}
        />
      )}

      {currentStep === 1 && (
        <StepSchedule
          isSubmitting={isSubmitting}
          onSubmit={handleCreateSchedules}
          onBack={() => {
            setCurrentStep(0);
            updateUrl(0, shopId);
          }}
        />
      )}

      {currentStep === 2 && (
        <StepServices
          shopId={shopId}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateServices}
          onSkip={handleSkipServices}
          onBack={() => {
            setCurrentStep(1);
            updateUrl(1, shopId);
          }}
        />
      )}

      {currentStep === 3 && (
        <StepSuccess
          organizationId={organizationId}
          shopSlug={shopSlug}
        />
      )}
    </div>
  );
};
