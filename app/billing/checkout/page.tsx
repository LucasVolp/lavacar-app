"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Form, Spin, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBillingStatus, useCreateSelfCheckout } from "@/hooks/useBilling";
import { formatDocument } from "@/utils/formatters";
import { brasilApiService } from "@/services/brasilApi";
import type { BillingType, BillingCycle, SelfCheckoutResponse } from "@/types/billing";
import { PLAN_CONFIG } from "@/types/billing";

import { CheckoutLayout } from "./_components/CheckoutLayout";
import { CheckoutHeader } from "./_components/CheckoutHeader";
import { ActiveStep } from "./_components/ActiveStep";
import { PlanStep } from "./_components/PlanStep";
import { PaymentFormStep } from "./_components/PaymentFormStep";
import { AwaitingCCStep } from "./_components/AwaitingCCStep";
import { PixStep } from "./_components/PixStep";
import { PendingStep } from "./_components/PendingStep";
import { OverdueStep } from "./_components/OverdueStep";
import { CancelledStep } from "./_components/CancelledStep";
import { FailedStep } from "./_components/FailedStep";

type CheckoutStep =
    | "loading"
    | "active"
    | "plan"
    | "payment"
    | "processing"
    | "pix"
    | "awaiting_cc"
    | "pending"
    | "overdue"
    | "cancelled"
    | "failed";

const CC_POLLING_INTERVAL_MS = 5000;
const CC_MAX_POLLING_ATTEMPTS = 60;
const PIX_POLLING_INTERVAL_MS = 30000;
const PIX_MAX_POLLING_ATTEMPTS = 3;

const HEADINGS: Partial<Record<CheckoutStep, string>> = {
    pix: "Aguardando pagamento",
    pending: "Aguardando pagamento",
    awaiting_cc: "Aguardando pagamento",
    overdue: "Regularize seu pagamento",
    cancelled: "Reativar assinatura",
    processing: "Processando...",
    failed: "Pagamento não confirmado",
};

const SUBTITLES: Partial<Record<CheckoutStep, string>> = {
    active: "Gerencie sua assinatura e acesse a plataforma",
    pix: "Escaneie o QR Code ou copie o código PIX",
    awaiting_cc: "Finalize o pagamento na aba aberta e aguarde a confirmação",
    overdue: "Seu pagamento está atrasado. Regularize para continuar acessando a plataforma.",
    cancelled: "Sua assinatura foi cancelada. Assine novamente para reativar sua conta.",
    failed: "Não foi possível confirmar seu pagamento. Verifique os dados e tente novamente.",
};

function useBeforeUnload(active: boolean) {
    useEffect(() => {
        if (!active) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [active]);
}

export default function CheckoutPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
    const [form] = Form.useForm<{ orgName: string; document: string }>();

    const [step, setStep] = useState<CheckoutStep>("loading");
    const [selectedCycle, setSelectedCycle] = useState<BillingCycle>("MONTHLY");
    const [selectedBillingType, setSelectedBillingType] = useState<BillingType>("PIX");
    const [checkoutResult, setCheckoutResult] = useState<SelfCheckoutResponse | null>(null);
    const [loadingCnpj, setLoadingCnpj] = useState(false);
    const [pollingActive, setPollingActive] = useState(false);
    const [isResubscribeFlow, setIsResubscribeFlow] = useState(false);

    const pollingIntervalMsRef = useRef(PIX_POLLING_INTERVAL_MS);
    const maxPollingAttemptsRef = useRef(PIX_MAX_POLLING_ATTEMPTS);
    const pollingAttemptsRef = useRef(0);
    const checkoutTypeRef = useRef<BillingType>("PIX");

    const { data: billingStatus, isLoading: statusLoading, refetch: refetchStatus } = useBillingStatus(isAuthenticated);
    const createSelfCheckout = useCreateSelfCheckout();

    const isInActiveCheckout = step === "awaiting_cc" || step === "pix";
    useBeforeUnload(isInActiveCheckout);

    const checkPaymentConfirmed = useCallback(async () => {
        const result = await refetchStatus();

        if (result.data?.canAccessOrganization) {
            setPollingActive(false);
            setIsResubscribeFlow(false);
            await refreshUser();
            setStep("active");
            message.success("Pagamento confirmado! Bem-vindo ao NexoCar.");
            return;
        }

        // Webhook marked intent as FAILED — backend returns no subscription
        if (!result.data?.subscription && !result.data?.hasOrganization) {
            setPollingActive(false);
            setStep("failed");
            return;
        }

        pollingAttemptsRef.current += 1;
        if (pollingAttemptsRef.current >= maxPollingAttemptsRef.current) {
            setPollingActive(false);
            // Only auto-fail for credit card; PIX user can verify manually
            if (checkoutTypeRef.current === "CREDIT_CARD") {
                setStep("failed");
            }
        }
    }, [refetchStatus, refreshUser]);

    useEffect(() => {
        if (!pollingActive) return;
        const interval = setInterval(checkPaymentConfirmed, pollingIntervalMsRef.current);
        return () => clearInterval(interval);
    }, [pollingActive, checkPaymentConfirmed]);

    useEffect(() => {
        if (authLoading || statusLoading) return;

        if (!isAuthenticated) {
            router.replace("/auth/login?redirect=/billing/checkout");
            return;
        }

        if (billingStatus?.canAccessOrganization) {
            setIsResubscribeFlow(false);
            setStep("active");
            return;
        }

        // Guard: don't override state while user is mid-checkout
        if (
            step === "awaiting_cc" ||
            step === "pix" ||
            step === "failed" ||
            step === "payment" ||
            step === "processing" ||
            (isResubscribeFlow && step === "plan")
        ) {
            return;
        }

        if (!billingStatus?.subscription) {
            setStep("plan");
            return;
        }

        const status = billingStatus.subscription.status;

        if (status === "PENDING") {
            if (billingStatus.subscription.pixData) {
                setCheckoutResult({
                    encodedImage: billingStatus.subscription.pixData.encodedImage,
                    payload: billingStatus.subscription.pixData.payload,
                    expirationDate: billingStatus.subscription.pixData.expirationDate,
                });
                if (!pollingActive) {
                    checkoutTypeRef.current = "PIX";
                    pollingIntervalMsRef.current = PIX_POLLING_INTERVAL_MS;
                    maxPollingAttemptsRef.current = PIX_MAX_POLLING_ATTEMPTS;
                    pollingAttemptsRef.current = 0;
                    setPollingActive(true);
                }
                setStep("pix");
            } else if (billingStatus.subscription.checkoutUrl) {
                setStep("pending");
            } else {
                setStep("plan");
            }
            return;
        }

        if (status === "OVERDUE") { setStep("overdue"); return; }
        if (status === "CANCELLED" || status === "EXPIRED") { setStep("cancelled"); return; }

        setStep("plan");
    }, [authLoading, statusLoading, isAuthenticated, billingStatus, router, step, pollingActive, isResubscribeFlow]);

    const startCCPolling = () => {
        checkoutTypeRef.current = "CREDIT_CARD";
        pollingIntervalMsRef.current = CC_POLLING_INTERVAL_MS;
        maxPollingAttemptsRef.current = CC_MAX_POLLING_ATTEMPTS;
        pollingAttemptsRef.current = 0;
        setPollingActive(true);
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setFieldValue("document", formatDocument(e.target.value));
    };

    const handleDocumentBlur = async () => {
        const doc = String(form.getFieldValue("document") || "");
        const digits = doc.replace(/\D/g, "");
        if (digits.length !== 14) return;
        setLoadingCnpj(true);
        try {
            const company = await brasilApiService.findCompanyByCnpj(digits);
            if (!form.getFieldValue("orgName")) {
                form.setFieldValue("orgName", company.nome_fantasia || company.razao_social || "");
            }
        } catch {
        } finally {
            setLoadingCnpj(false);
        }
    };

    const handleSubmitCheckout = async (values: { orgName: string; document: string }) => {
        setStep("processing");
        try {
            const result = await createSelfCheckout.mutateAsync({
                orgName: values.orgName,
                document: values.document.replace(/\D/g, ""),
                billingType: selectedBillingType,
                cycle: selectedCycle,
            });
            setCheckoutResult(result);

            if (selectedBillingType === "CREDIT_CARD" && result.checkoutUrl) {
                window.open(result.checkoutUrl, "_blank");
                startCCPolling();
                setStep("awaiting_cc");
                return;
            }

            if (selectedBillingType === "PIX" && result.encodedImage) {
                checkoutTypeRef.current = "PIX";
                pollingIntervalMsRef.current = PIX_POLLING_INTERVAL_MS;
                maxPollingAttemptsRef.current = PIX_MAX_POLLING_ATTEMPTS;
                pollingAttemptsRef.current = 0;
                setPollingActive(true);
                setStep("pix");
                return;
            }

            setStep("plan");
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
                "Erro ao processar o checkout. Tente novamente.";
            message.error(errorMessage);
            setStep("payment");
        }
    };

    const handlePayExistingOverdue = () => {
        const url = billingStatus?.subscription?.checkoutUrl;
        if (!url) return;
        window.open(url, "_blank");
        startCCPolling();
        setStep("awaiting_cc");
    };

    const handlePayPending = () => {
        window.open(billingStatus!.subscription!.checkoutUrl!, "_blank");
        startCCPolling();
        setStep("awaiting_cc");
    };

    const handleRetryAfterFailure = () => {
        setCheckoutResult(null);
        setIsResubscribeFlow(true);
        setStep("plan");
    };

    const handleResubscribe = () => {
        setCheckoutResult(null);
        setPollingActive(false);
        setIsResubscribeFlow(true);
        setStep("plan");
    };

    if (step === "loading" || authLoading || statusLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Spin size="large" tip="Verificando sua conta..." />
            </div>
        );
    }

    const heading = step === "active"
        ? (billingStatus?.organization?.name ?? "Sua organização")
        : (HEADINGS[step] ?? null);

    const subtitle = SUBTITLES[step] ?? "Gerencie seu lavacar com o melhor sistema do mercado";

    return (
        <CheckoutLayout>
            <CheckoutHeader isActive={step === "active"} heading={heading} subtitle={subtitle} />

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-black/20 border border-zinc-100 dark:border-zinc-800">
                {step === "active" && (
                    <ActiveStep
                        subscription={billingStatus?.subscription}
                        onNavigate={() => router.push(`/organization/${billingStatus?.organization?.id}`)}
                    />
                )}

                {step === "plan" && (
                    <PlanStep
                        selectedCycle={selectedCycle}
                        onCycleChange={setSelectedCycle}
                        onContinue={() => setStep("payment")}
                    />
                )}

                {step === "payment" && (
                    <PaymentFormStep
                        form={form}
                        selectedBillingType={selectedBillingType}
                        selectedCycle={selectedCycle}
                        loadingCnpj={loadingCnpj}
                        onBillingTypeChange={setSelectedBillingType}
                        onDocumentChange={handleDocumentChange}
                        onDocumentBlur={handleDocumentBlur}
                        onBack={() => setStep("plan")}
                        onSubmit={handleSubmitCheckout}
                    />
                )}

                {step === "processing" && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Spin size="large" />
                        <p className="text-base font-medium text-zinc-500 dark:text-zinc-400">
                            Criando seu checkout...
                        </p>
                    </div>
                )}

                {step === "awaiting_cc" && (
                    <AwaitingCCStep
                        checkoutUrl={checkoutResult?.checkoutUrl}
                        onVerify={checkPaymentConfirmed}
                    />
                )}

                {step === "pix" && checkoutResult?.encodedImage && checkoutResult.payload && (
                    <PixStep
                        pixData={{
                            encodedImage: checkoutResult.encodedImage,
                            payload: checkoutResult.payload,
                            expirationDate: checkoutResult.expirationDate ?? "",
                        }}
                        price={PLAN_CONFIG[selectedCycle].price}
                        onVerify={checkPaymentConfirmed}
                    />
                )}

                {step === "pending" && (
                    <PendingStep onPay={handlePayPending} />
                )}

                {step === "overdue" && (
                    <OverdueStep
                        checkoutUrl={billingStatus?.subscription?.checkoutUrl}
                        pixData={billingStatus?.subscription?.pixData}
                        price={billingStatus?.subscription?.price}
                        onPayCard={handlePayExistingOverdue}
                        onRefresh={refetchStatus}
                    />
                )}

                {step === "cancelled" && (
                    <CancelledStep onResubscribe={handleResubscribe} />
                )}

                {step === "failed" && (
                    <FailedStep onRetry={handleRetryAfterFailure} />
                )}
            </div>

            {step !== "active" && (
                <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
                    Pagamento processado com segurança pela{" "}
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400">Asaas</span>
                    {" "}· Protegido por SSL
                </p>
            )}
        </CheckoutLayout>
    );
}
