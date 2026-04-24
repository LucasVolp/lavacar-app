"use client";

import React from "react";
import { BRAND_CONFIG } from "@/config/constants";

interface NexoLogoProps {
  size?: number;
  className?: string;
}

export const NexoLogo: React.FC<NexoLogoProps> = ({ size = 40, className }) => {
  const logoUrl = size >= 64 ? BRAND_CONFIG.LOGO_LARGE_URL : BRAND_CONFIG.LOGO_SMALL_URL;

  return (
    <img
      // eslint-disable-next-line @next/next/no-img-element
      src={logoUrl}
      alt={BRAND_CONFIG.COMPANY_NAME}
      width={size}
      height={size}
      className={`object-contain block ${className || ""}`}
    />
  );
};
