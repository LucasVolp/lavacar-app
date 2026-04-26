"use client";

import React from "react";
import { App, Button, Table, Popconfirm, Spin, Alert } from "antd";
import {
    ArrowRightOutlined,
    CalendarOutlined,
    CreditCardOutlined,
    DeleteOutlined,
    DollarOutlined,
    QrcodeOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useOrganizationSubscriptions, useCancelSubscription } from "@/hooks/useBilling";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";

interface SubscriptionManagementProps {
    organizationId: string;
}

interface Subscription {
    id: string;
    subscriptionId: string;
    status: "ACTIVE" | "PENDING" | "OVERDUE" | "EXPIRED" | "CANCELLED";
    plan: string;
    billingType: "PIX" | "CREDIT_CARD";
    price: number;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    nextDueDate: string;
    createdAt: string;
}

const STATUS_CONFIG: Record<
    Subscription["status"],
    { label: string; pulse?: boolean; className: string }
> = {
    ACTIVE: {
        label: "Ativa",
        pulse: true,
        className: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50",
    },
    PENDING: {
        label: "Pendente",
        className: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
    },
    OVERDUE: {
        label: "Atrasada",
        className: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50",
    },
    EXPIRED: {
        label: "Expirada",
        className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
    },
    CANCELLED: {
        label: "Cancelada",
        className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
    },
};

const BILLING_CONFIG: Record<
    Subscription["billingType"],
    { icon: React.ReactNode; label: string }
> = {
    PIX: { icon: <QrcodeOutlined />, label: "PIX" },
    CREDIT_CARD: { icon: <CreditCardOutlined />, label: "Cartão de Crédito" },
};

const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function fmtDate(d?: string | null, options?: Intl.DateTimeFormatOptions) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("pt-BR", options ?? { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: Subscription["status"] }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}>
            {cfg.pulse && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
            {cfg.label}
        </span>
    );
}

function StatCard({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-700/60">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1.5">
                {label}
            </p>
            <div className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                {value}
            </div>
            {sub && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sub}</p>
            )}
        </div>
    );
}

export function SubscriptionManagement({ organizationId }: SubscriptionManagementProps) {
    const router = useRouter();
    const { message } = App.useApp();
    const { data: subscriptionsData, isLoading, refetch } = useOrganizationSubscriptions(organizationId);
    const cancelSubscription = useCancelSubscription();

    const subscriptions = (subscriptionsData as unknown as { data?: Subscription[] })?.data ?? [];
    const current = subscriptions[0];

    const handleCancel = async (id: string) => {
        try {
            await cancelSubscription.mutateAsync(id);
            message.success("Assinatura cancelada com sucesso");
            refetch();
        } catch {
            message.error("Erro ao cancelar assinatura");
        }
    };

    const columns: ColumnsType<Subscription> = [
        {
            title: "Plano",
            dataIndex: "plan",
            key: "plan",
            render: (v: string) => (
                <span className="font-medium text-zinc-900 dark:text-white">{v}</span>
            ),
        },
        {
            title: "Pagamento",
            dataIndex: "billingType",
            key: "billingType",
            render: (v: Subscription["billingType"]) => (
                <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                    {BILLING_CONFIG[v]?.icon}
                    {BILLING_CONFIG[v]?.label}
                </span>
            ),
        },
        {
            title: "Valor",
            dataIndex: "price",
            key: "price",
            render: (v: number) => (
                <span className="font-semibold text-zinc-900 dark:text-white">{fmt.format(v)}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (v: Subscription["status"]) => <StatusBadge status={v} />,
        },
        {
            title: "Próx. cobrança",
            dataIndex: "nextDueDate",
            key: "nextDueDate",
            render: (v: string) => (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{fmtDate(v)}</span>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 48,
            render: (_, record) =>
                record.status === "ACTIVE" ? (
                    <Popconfirm
                        title="Cancelar assinatura?"
                        description="Você perderá acesso às funcionalidades premium."
                        onConfirm={() => handleCancel(record.id)}
                        okText="Cancelar"
                        cancelText="Manter"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            loading={cancelSubscription.isPending}
                        />
                    </Popconfirm>
                ) : null,
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <Spin size="large" />
            </div>
        );
    }

    if (!current) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                    <CreditCardOutlined className="text-2xl text-zinc-400" />
                </div>
                <div>
                    <p className="text-base font-semibold text-zinc-900 dark:text-white">
                        Nenhuma assinatura ativa
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Assine o NexoCar para acessar todas as funcionalidades.
                    </p>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={() => router.push("/billing/checkout")}
                    className="h-12 rounded-xl mt-2"
                >
                    Assinar agora
                </Button>
            </div>
        );
    }

    const isCancelledOrExpired = current.status === "CANCELLED" || current.status === "EXPIRED";

    return (
        <div className="flex flex-col gap-5">
            {/* Status alerts */}
            {current.status === "OVERDUE" && (
                <Alert
                    message="Pagamento atrasado"
                    description="Regularize seu pagamento para manter o acesso à plataforma."
                    type="warning"
                    showIcon
                    className="rounded-2xl"
                />
            )}
            {current.status === "PENDING" && (
                <Alert
                    message="Aguardando confirmação de pagamento"
                    description="Sua assinatura será ativada assim que o pagamento for confirmado."
                    type="info"
                    showIcon
                    className="rounded-2xl"
                />
            )}

            {/* Subscription summary card */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                            Plano atual
                        </p>
                        <p className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            {current.plan}
                        </p>
                    </div>
                    <StatusBadge status={current.status} />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatCard
                        label="Mensalidade"
                        value={fmt.format(current.price)}
                        sub="por mês"
                    />
                    <StatCard
                        label="Pagamento"
                        value={
                            <span className="flex items-center gap-1.5 text-base">
                                {BILLING_CONFIG[current.billingType]?.icon}
                                {BILLING_CONFIG[current.billingType]?.label}
                            </span>
                        }
                    />
                    <StatCard
                        label="Próx. cobrança"
                        value={
                            current.nextDueDate
                                ? new Date(current.nextDueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
                                : "—"
                        }
                        sub={
                            current.nextDueDate
                                ? String(new Date(current.nextDueDate).getFullYear())
                                : undefined
                        }
                    />
                </div>

                {/* Period details */}
                <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-1 sm:gap-4">
                        <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 shrink-0">
                            <CalendarOutlined />
                            Período atual
                        </span>
                        <span className="font-medium text-zinc-900 dark:text-white sm:text-right">
                            {fmtDate(current.currentPeriodStart)} → {fmtDate(current.currentPeriodEnd)}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-1 sm:gap-4">
                        <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 shrink-0">
                            <DollarOutlined />
                            ID da assinatura
                        </span>
                        <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 truncate min-w-0">
                            {current.subscriptionId}
                        </span>
                    </div>
                </div>
            </div>

            {/* History — only when there's more than the current subscription */}
            {subscriptions.length > 1 && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                            Histórico de assinaturas
                        </p>
                        <Button
                            type="text"
                            size="small"
                            icon={<ReloadOutlined />}
                            onClick={() => refetch()}
                            loading={isLoading}
                            className="text-zinc-400"
                        />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={subscriptions}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                        scroll={{ x: 560 }}
                        className="[&_.ant-table]:bg-transparent [&_.ant-table-cell]:border-zinc-100 [&_.ant-table-cell]:dark:border-zinc-800"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col gap-4">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                    Gerenciar assinatura
                </p>

                {isCancelledOrExpired ? (
                    <Button
                        type="primary"
                        size="large"
                        icon={<ArrowRightOutlined />}
                        onClick={() => router.push("/billing/checkout")}
                        className="h-12 rounded-xl"
                        block
                    >
                        Reativar assinatura
                    </Button>
                ) : (
                    <>
                        <Popconfirm
                            title="Cancelar assinatura?"
                            description={
                                <span className="text-sm text-zinc-500 dark:text-zinc-400 block max-w-xs">
                                    Sua assinatura permanece ativa até o fim do período atual. Após isso, o acesso será bloqueado.
                                </span>
                            }
                            onConfirm={() => handleCancel(current.id)}
                            okText="Confirmar cancelamento"
                            cancelText="Manter"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                block
                                danger
                                icon={<DeleteOutlined />}
                                size="large"
                                loading={cancelSubscription.isPending}
                                className="h-12 rounded-xl"
                            >
                                Cancelar assinatura
                            </Button>
                        </Popconfirm>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                            O cancelamento é imediato. Você mantém acesso até {fmtDate(current.currentPeriodEnd)}.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
