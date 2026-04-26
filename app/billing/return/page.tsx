"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Button, Result, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { billingService } from "@/services/billing";

type ReturnState = "checking" | "success" | "pending" | "failed";

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 8000;

function BillingReturnContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();
    const statusParam = searchParams.get("status");
    const [state, setState] = useState<ReturnState>(() => statusParam === "failed" ? "failed" : "checking");
    const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
    const attemptRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pollRef = useRef<(() => Promise<void>) | null>(null);

    const poll = useCallback(async () => {
        if (attemptRef.current >= MAX_ATTEMPTS) {
            setState("pending");
            return;
        }

        try {
            const status = await billingService.getStatus();
            if (status.canAccessOrganization) {
                await refreshUser();
                setState("success");
                setTimeout(() => router.replace("/organization"), 1500);
                return;
            }
        } catch {
        }

        attemptRef.current += 1;
        setAttemptsLeft(MAX_ATTEMPTS - attemptRef.current);

        if (attemptRef.current >= MAX_ATTEMPTS) {
            setState("pending");
            return;
        }

        const delay = Math.min(BASE_DELAY_MS * 2 ** (attemptRef.current - 1), 30000);
        timerRef.current = setTimeout(() => pollRef.current?.(), delay);
    }, [refreshUser, router]);

    useEffect(() => {
        pollRef.current = poll;
        if (statusParam === "failed") return;

        timerRef.current = setTimeout(() => pollRef.current?.(), 0);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [poll, statusParam]);

    const handleGoToCheckout = () => router.replace("/billing/checkout");
    const handleRetryNow = () => {
        attemptRef.current = 0;
        setAttemptsLeft(MAX_ATTEMPTS);
        setState("checking");
        poll();
    };

    if (state === "checking") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <Spin size="large" />
                <div className="text-center">
                    <p className="text-lg font-medium text-zinc-900 dark:text-white">Confirmando seu pagamento...</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {attemptsLeft > 0
                            ? `Verificando automaticamente (${MAX_ATTEMPTS - attemptsLeft + 1}/${MAX_ATTEMPTS})`
                            : "Aguarde..."}
                    </p>
                </div>
            </div>
        );
    }

    if (state === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Result
                    status="success"
                    title="Pagamento confirmado!"
                    subTitle="Sua conta foi ativada. Redirecionando..."
                />
            </div>
        );
    }

    if (state === "failed") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Result
                    status="error"
                    title="Pagamento não concluído"
                    subTitle="Ocorreu um problema com seu pagamento. Tente novamente."
                    extra={[
                        <Button type="primary" key="checkout" onClick={handleGoToCheckout}>
                            Tentar novamente
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Result
                status="info"
                title="Aguardando confirmação"
                subTitle="Seu pagamento ainda não foi confirmado. Isso pode levar alguns minutos."
                extra={[
                    <Button type="primary" key="retry" onClick={handleRetryNow}>
                        Verificar novamente
                    </Button>,
                    <Button key="checkout" onClick={handleGoToCheckout}>
                        Voltar ao checkout
                    </Button>,
                ]}
            />
        </div>
    );
}

export default function BillingReturnPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Spin size="large" />
                </div>
            }
        >
            <BillingReturnContent />
        </Suspense>
    );
}
