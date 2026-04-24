import React from "react";
import ThemeAwareConfigProvider from "@/app/providers";

export default function BillingLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeAwareConfigProvider>
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                {children}
            </div>
        </ThemeAwareConfigProvider>
    );
}
