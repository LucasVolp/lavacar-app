"use client";

import React from "react";
import { Navbar, HeroSection, VitrineComparison, FeaturesGrid, Footer, OwnerBenefits, PricingSection } from "@/components/landing";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-base-100 font-sans selection:bg-blue-500/30 selection:text-blue-200 transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <VitrineComparison />
      <OwnerBenefits />
      <FeaturesGrid />
      <PricingSection />
      <Footer />
    </main>
  );
}
