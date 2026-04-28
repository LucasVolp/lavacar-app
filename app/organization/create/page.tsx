"use client";

import React, { useEffect } from "react";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrganization, useOrganizationByOwner } from "@/hooks/useOrganizations";
import { CreateOrgHeader } from "@/components/organization/create/CreateOrgHeader";
import { CreateOrgForm } from "@/components/organization/create/CreateOrgForm";

export default function CreateOrganizationPage() {
    const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
    const router = useRouter();
    const createOrganization = useCreateOrganization();
    const { data: organizations, isLoading: isLoadingOrgs } = useOrganizationByOwner(user?.id);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth/login?redirect=/organization/create");
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated && !isLoadingOrgs && organizations && organizations.length > 0) {
            message.info("Você já possui uma organização. Redirecionando...");
            router.replace(`/organization/${organizations[0].id}`);
        }
    }, [isAuthenticated, isLoadingOrgs, organizations, router]);

    const handleSubmit = async (values: { name: string; document: string }) => {
        if (!user) return;

        try {
            const newOrg = await createOrganization.mutateAsync({
                name: values.name,
                document: values.document.replace(/\D/g, ""),
                ownerId: user.id,
            });
            await refreshUser();
            message.success("Organização criada com sucesso!");
            router.push(`/organization/${newOrg.id}`);
        } catch {
            message.error("Erro ao criar organização. Tente novamente.");
        }
    };

    if (isLoading || (isAuthenticated && isLoadingOrgs)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Spin size="large" tip="Verificando acesso..." />
            </div>
        );
    }

    if (organizations && organizations.length > 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Spin size="large" tip="Redirecionando..." />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <CreateOrgHeader />
                <CreateOrgForm onFinish={handleSubmit} isLoading={createOrganization.isPending} />

                <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Precisa de ajuda?{" "}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Fale com o suporte
                    </a>
                </p>
            </div>
        </div>
    );
}
