import { useAuth } from "@/contexts";
import { Role } from "@/types/enums";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface RequireRoleProps {
    children: React.ReactNode;
    allowedRoles: string[];
    fallbackUrl?: string;
}

export function RequireRole({ children, allowedRoles, fallbackUrl = "/" }: RequireRoleProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace(`/auth/login?redirect=${window.location.pathname}`);
            return;
        }
        if (user && !allowedRoles.includes(user.role as Role)) {
            router.replace(fallbackUrl);
        } 
            }, [isLoading, isAuthenticated, user, allowedRoles, fallbackUrl, router]);

        if (isLoading || !user || !allowedRoles.includes(user.role as Role)) {
            return <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-gray-600">Verificando permissões...</p>
                </div>
            </div>;
        }

    return <>{children}</>;
}