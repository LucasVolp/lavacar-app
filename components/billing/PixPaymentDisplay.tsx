"use client";

import React, { useState } from "react";
import { Button, message, Tag } from "antd";
import { CopyOutlined, CheckOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { PixData } from "@/types/billing";

interface PixPaymentDisplayProps {
    pixData: PixData;
    price: number;
}

export function PixPaymentDisplay({ pixData, price }: PixPaymentDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pixData.payload);
            setCopied(true);
            message.success("Código PIX copiado!");
            setTimeout(() => setCopied(false), 3000);
        } catch {
            message.error("Erro ao copiar código PIX");
        }
    };

    const formattedExpiry = pixData.expirationDate
        ? format(parseISO(pixData.expirationDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        : null;

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-center">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Valor a pagar
                </p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}
                </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                <Image
                    src={`data:image/png;base64,${pixData.encodedImage}`}
                    alt="QR Code PIX"
                    width={200}
                    height={200}
                    className="rounded-lg"
                    unoptimized
                />
            </div>

            <div className="w-full">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 text-center">
                    Ou copie o código PIX abaixo
                </p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 text-xs text-zinc-600 dark:text-zinc-300 font-mono break-all border border-zinc-200 dark:border-zinc-700 select-all">
                        {pixData.payload}
                    </div>
                    <Button
                        type="primary"
                        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                        onClick={handleCopy}
                        className="h-auto rounded-xl px-4"
                    >
                        {copied ? "Copiado" : "Copiar"}
                    </Button>
                </div>
            </div>

            {formattedExpiry && (
                <Tag icon={<ClockCircleOutlined />} color="orange" className="text-sm">
                    Expira em {formattedExpiry}
                </Tag>
            )}

            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
                Após o pagamento, seu acesso será liberado automaticamente em até 5 minutos.
            </p>
        </div>
    );
}
