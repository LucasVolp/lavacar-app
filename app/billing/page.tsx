"use client";

import React, { useEffect } from "react";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBillingStatus } from "@/hooks/useBilling";
import type { BillingStatusResponse } from "@/types/billing";

type BillingState =
    | "loading"
    | "active"
    | "no_org"
    | "trial_active"
    | "trial_expired"
    | "payment_issue";

function deriveState(
    authLoading: boolean,
    statusLoading: boolean,
    data: BillingStatusResponse | undefined,
): BillingState {
    if (authLoading || statusLoading || !data) return "loading";

    if (data.canAccessOrganization && data.hasOrganization) return "active";

    if (!data.hasOrganization) return "no_org";

    if (!data.subscription) {
        return data.trial?.isActive ? "trial_active" : "trial_expired";
    }

    if (data.subscription.status === "OVERDUE" || data.subscription.status === "PENDING") {
        return "payment_issue";
    }

    return data.canAccessOrganization ? "active" : "trial_expired";
}

export default function BillingPage() {
    const router = useRouter();
    const { isLoading: authLoading } = useAuth();
    const { data, isLoading: statusLoading } = useBillingStatus(!authLoading);

    const state = deriveState(authLoading, statusLoading, data);

    useEffect(() => {
        if (state === "active" && data?.organization?.id) {
            router.replace(`/organization/${data.organization.id}`);
        }
    }, [state, data?.organization?.id, router]);

    if (state === "loading" || state === "active") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {state === "no_org" && <NoOrgState />}
                {state === "trial_active" && (
                    <TrialActiveState
                        daysRemaining={data?.trial?.daysRemaining ?? 0}
                        endsAt={data?.trial?.endsAt ?? ""}
                        orgId={data?.organization?.id}
                    />
                )}
                {state === "trial_expired" && <TrialExpiredState />}
                {state === "payment_issue" && (
                    <PaymentIssueState status={data?.subscription?.status} />
                )}
            </div>
        </div>
    );
}

function NoOrgState() {
    const router = useRouter();
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Nenhuma organização encontrada
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Crie sua organização e comece seu período de 15 dias grátis, sem precisar de cartão.
            </p>
            <button
                onClick={() => router.push("/organization/create")}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
                Criar minha organização
            </button>
        </div>
    );
}

function TrialActiveState({
    daysRemaining,
    endsAt,
    orgId,
}: {
    daysRemaining: number;
    endsAt: string;
    orgId?: string;
}) {
    const router = useRouter();
    const endsDate = endsAt ? new Date(endsAt).toLocaleDateString("pt-BR") : "";
    const isUrgent = daysRemaining <= 3;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isUrgent ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
                <svg className={`w-6 h-6 ${isUrgent ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                Trial ativo
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                {daysRemaining > 0
                    ? `${daysRemaining} dia${daysRemaining !== 1 ? "s" : ""} restante${daysRemaining !== 1 ? "s" : ""}`
                    : "Último dia de trial"}
                {endsDate && ` — expira em ${endsDate}`}
            </p>
            {isUrgent && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
                    Assine agora para não perder o acesso.
                </p>
            )}
            <div className="flex flex-col gap-3 mt-6">
                <button
                    onClick={() => router.push("/billing/checkout")}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                >
                    Assinar agora
                </button>
                {orgId && (
                    <button
                        onClick={() => router.push(`/organization/${orgId}`)}
                        className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium transition-colors"
                    >
                        Continuar usando
                    </button>
                )}
            </div>
        </div>
    );
}

function TrialExpiredState() {
    const router = useRouter();
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Trial expirado
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Seu período de avaliação gratuita chegou ao fim. Assine um plano para continuar usando o NexoCar.
            </p>
            <button
                onClick={() => router.push("/billing/checkout")}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
                Ver planos e assinar
            </button>
        </div>
    );
}

function PaymentIssueState({ status }: { status?: string }) {
    const router = useRouter();
    const isPending = status === "PENDING";

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            </div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {isPending ? "Pagamento pendente" : "Pagamento em atraso"}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                {isPending
                    ? "Seu pagamento está sendo processado. Assim que confirmado, o acesso será liberado automaticamente."
                    : "Há um pagamento em aberto na sua assinatura. Regularize para continuar usando o NexoCar."}
            </p>
            <button
                onClick={() => router.push("/billing/checkout")}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
                {isPending ? "Ver status do pagamento" : "Regularizar assinatura"}
            </button>
        </div>
    );
}
