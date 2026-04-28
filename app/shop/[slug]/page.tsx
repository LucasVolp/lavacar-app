"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopBySlug } from "@/hooks/useShops";
import { usePublicServicesByShop } from "@/hooks/useServices";
import { usePublicShopSchedules } from "@/hooks/useSchedules";
import { usePublicCuratedReviews, usePublicEvaluationSummary } from "@/hooks/useEvaluations";
import { useShop } from "@/contexts/ShopContext";
import {
  HeroSection,
  ServicesSection,
  ReviewsSection,
  InfoSection,
  CTASection,
  ShopFooter,
  ShopGallery,
} from "@/components/shop";
import { CarFilled, WhatsAppOutlined } from "@ant-design/icons";
import { Services } from "@/types/services";
import { ShopSocialLinks } from "@/types/shop";

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

const ensureSocialUrl = (platform: "instagram" | "youtube" | "tiktok" | "whatsapp", raw?: string | null): string | null => {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  if (platform === "instagram") return `https://instagram.com/${value.replace(/^@/, "")}`;
  if (platform === "youtube") return value.startsWith("@") ? `https://youtube.com/${value}` : `https://youtube.com/${value.replace(/^\/+/, "")}`;
  if (platform === "tiktok") return `https://www.tiktok.com/@${value.replace(/^@/, "")}`;
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
};

const parseSocialLinks = (socialLinks: unknown): ShopSocialLinks => {
  if (!socialLinks) return {};
  if (typeof socialLinks === "string") {
    try {
      const parsed = JSON.parse(socialLinks) as ShopSocialLinks;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return socialLinks as ShopSocialLinks;
};

export default function ShopPage({ params }: ShopPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { setShopBySlug } = useShop();

  const {
    data: shop,
    isLoading: shopLoading,
    error: shopError,
  } = useShopBySlug(slug);

  const { data: servicesData, isLoading: servicesLoading } = usePublicServicesByShop(
    shop?.id || null,
    { isActive: true },
    !!shop
  );

  const services: Services[] = servicesData?.data ?? [];

  const { data: schedules = [], isLoading: schedulesLoading } = usePublicShopSchedules(
    shop?.id || null,
    !!shop
  );

  const { 
    data: curatedReviews = [], 
    isLoading: reviewsLoading,
  } = usePublicCuratedReviews(shop?.id || null, 5, !!shop);

  const { data: evaluationSummary } = usePublicEvaluationSummary(shop?.id || null, !!shop);

  useEffect(() => {
    if (slug) {
      setShopBySlug(slug);
    }
  }, [slug, setShopBySlug]);

  const handleBooking = () => {
    router.push(`/shop/${slug}/booking`);
  };

  const activeServices = services.filter((s) => s.isActive !== false);
  const averageRating = evaluationSummary?.averageRating || 0;
  const totalReviews = evaluationSummary?.totalEvaluations || 0;
  const socialLinks = parseSocialLinks(shop?.socialLinks);
  const instagramUrl = ensureSocialUrl("instagram", socialLinks.instagram);
  const youtubeUrl = ensureSocialUrl("youtube", socialLinks.youtube);
  const tiktokUrl = ensureSocialUrl("tiktok", socialLinks.tiktok);
  const whatsappUrl = ensureSocialUrl("whatsapp", socialLinks.whatsapp || shop?.phone || null);

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

  if (shopError || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b] p-4 transition-colors duration-300">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-xl dark:shadow-2xl transition-colors duration-300">
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
      <HeroSection
        shop={shop}
        schedules={schedules}
        averageRating={averageRating}
        totalReviews={totalReviews}
        totalServices={activeServices.length}
        onBooking={handleBooking}
        instagramUrl={instagramUrl}
        youtubeUrl={youtubeUrl}
        tiktokUrl={tiktokUrl}
        whatsappUrl={whatsappUrl}
      />

      <ServicesSection
        services={services}
        isLoading={servicesLoading}
        onBooking={handleBooking}
      />

      <ShopGallery images={shop.gallery ?? []} />

      <InfoSection
        shop={shop}
        schedules={schedules}
        isLoading={schedulesLoading}
      />

      <ReviewsSection
        reviews={curatedReviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
        isLoading={reviewsLoading}
      />

      <CTASection
        shopName={shop.name}
        onBooking={handleBooking}
      />

      <ShopFooter shopName={shop.name} />

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center w-16 h-16 rounded-full !bg-[#25D366] dark:!bg-[#25D366] !text-white shadow-2xl shadow-[#25D366]/40 ring-4 ring-white/80 dark:ring-zinc-900/80 animate-pulse hover:animate-none hover:scale-110 active:scale-95 transition-transform"
          aria-label="Conversar no WhatsApp"
        >
          <WhatsAppOutlined className="text-3xl !text-white" />
        </a>
      )}
    </div>
  );
}
