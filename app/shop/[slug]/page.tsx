"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopBySlug } from "@/hooks/useShops";
import { useServicesByShop } from "@/hooks/useServices";
import { useShopSchedules } from "@/hooks/useSchedules";
import { useCuratedReviews, useEvaluationSummary } from "@/hooks/useEvaluations";
import { useShop } from "@/contexts/ShopContext";
import {
  HeroSection,
  ServicesSection,
  ReviewsSection,
  InfoSection,
  CTASection,
  ShopFooter,
} from "@/components/shop";
import { CarFilled } from "@ant-design/icons";

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export default function ShopPage({ params }: ShopPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { setShopBySlug } = useShop();

  // Fetch shop data
  const {
    data: shop,
    isLoading: shopLoading,
    error: shopError,
  } = useShopBySlug(slug);

  // Fetch services
  const { data: services = [], isLoading: servicesLoading } = useServicesByShop(
    shop?.id || null,
    !!shop
  );

  // Fetch schedules
  const { data: schedules = [], isLoading: schedulesLoading } = useShopSchedules(
    shop?.id || null,
    !!shop
  );

  // Fetch curated reviews (best reviews for display)
  const { 
    data: curatedReviews = [], 
    isLoading: reviewsLoading,
  } = useCuratedReviews(shop?.id || null, 5, !!shop);

  // Get evaluation summary
  const { data: evaluationSummary } = useEvaluationSummary(shop?.id || null, !!shop);

  // Set shop context
  useEffect(() => {
    if (slug) {
      setShopBySlug(slug);
    }
  }, [slug, setShopBySlug]);

  // Handle booking navigation
  const handleBooking = () => {
    router.push(`/shop/${slug}/booking`);
  };

  // Calculate stats
  const activeServices = services.filter((s) => s.isActive !== false);
  const averageRating = evaluationSummary?.averageRating || 0;
  const totalReviews = evaluationSummary?.totalEvaluations || 0;

  // Loading state
  if (shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <span className="block mt-4 text-slate-500 font-medium">Carregando experiência...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (shopError || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] p-4 transition-colors duration-300">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-3xl p-12 shadow-xl dark:shadow-2xl transition-colors duration-300">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
             <CarFilled className="text-4xl text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 transition-colors duration-300">
            Loja não encontrada
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed transition-colors duration-300">
            A loja que você está procurando não existe ou foi desativada temporariamente.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-black font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-white hover:scale-105 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/10"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200 transition-colors duration-300">
      {/* Hero Section */}
      <HeroSection
        shop={shop}
        averageRating={averageRating}
        totalReviews={totalReviews}
        totalServices={activeServices.length}
        onBooking={handleBooking}
      />

      {/* Services Section */}
      <ServicesSection
        services={services}
        isLoading={servicesLoading}
        onBooking={handleBooking}
      />

      {/* Info Section */}
      <InfoSection
        shop={shop}
        schedules={schedules}
        isLoading={schedulesLoading}
      />

      {/* Reviews Section */}
      <ReviewsSection
        reviews={curatedReviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
        isLoading={reviewsLoading}
      />

      {/* CTA Section */}
      <CTASection
        shopName={shop.name}
        onBooking={handleBooking}
      />

      {/* Footer */}
      <ShopFooter shopName={shop.name} />
    </div>
  );
}
