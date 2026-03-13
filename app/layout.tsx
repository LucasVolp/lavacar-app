import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeAwareConfigProvider, { Providers } from "./providers";
import ptBR from "antd/locale/pt_BR";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexoCar - Sistema de Gestão de Agendamentos",
  description: "NexoCar - Sistema SaaS de gestão de agendamentos para estética automotiva",
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
      </body>
    </html>
  );
}
