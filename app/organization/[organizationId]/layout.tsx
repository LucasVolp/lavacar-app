import type React from "react";

/**
 * Layout da Organization
 * 
 * Layout simples para páginas de organization.
 * Não possui sidebar pois organization é apenas um agrupador.
 */
export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
