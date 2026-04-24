import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeAwareConfigProvider, { Providers } from "./providers";
import ptBR from "antd/locale/pt_BR";
import { BRAND_CONFIG } from "@/config/constants";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.COMPANY_NAME} - Sistema de Gestão de Agendamentos`,
  description: `${BRAND_CONFIG.COMPANY_NAME} - Sistema SaaS de gestão de agendamentos para estética automotiva`,
  icons: {
    icon: [
      {
        url: BRAND_CONFIG.FAVICON_URL,
        type: "image/png",
      },
      {
        url: BRAND_CONFIG.LOGO_LARGE_URL,
        type: "image/png",
        sizes: "any",
      },
    ],
    apple: BRAND_CONFIG.FAVICON_URL,
  },
  openGraph: {
    title: `${BRAND_CONFIG.COMPANY_NAME}`,
    description: `Sistema SaaS de gestão de agendamentos para estética automotiva`,
    images: [
      {
        url: BRAND_CONFIG.LOGO_LARGE_URL,
        width: 1200,
        height: 630,
        alt: BRAND_CONFIG.COMPANY_NAME,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <ThemeAwareConfigProvider locale={ptBR} fontFamily={geistSans.style.fontFamily}>
            {children}
          </ThemeAwareConfigProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
