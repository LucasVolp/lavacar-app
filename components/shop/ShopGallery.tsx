"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";

interface ShopGalleryProps {
  images: string[];
}

export function ShopGallery({ images }: ShopGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOpen = lightboxIndex !== null;
  const total = images.length;

  const prev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + total) % total));
  const next = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % total));
  const close = () => setLightboxIndex(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, total]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <section className="py-24 bg-slate-50 dark:bg-[#09090b] border-y border-zinc-200 dark:border-[#27272a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-5 border border-purple-500/20">
              <span>Portfólio</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors duration-300">
              Nosso Trabalho
            </h2>
          </div>

          {/* Mobile: snap carousel */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((url, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-[80vw] sm:w-[50vw] flex-shrink-0 snap-center aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 group
                  border border-zinc-200 dark:border-white/8
                  shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]
                  ring-1 ring-inset ring-zinc-900/5 dark:ring-white/5
                  transition-[border-color,box-shadow] duration-300"
              >
                <Image
                  src={url}
                  alt={`Portfólio ${i + 1}`}
                  fill
                  sizes="80vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/8 transition-colors duration-300" />
              </motion.button>
            ))}
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-5">
            {images.map((url, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 group
                  border border-zinc-200 dark:border-white/8
                  shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)]
                  ring-1 ring-inset ring-zinc-900/5 dark:ring-white/5
                  hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),0_0_0_1px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(168,85,247,0.2)]
                  hover:border-purple-300 dark:hover:border-purple-500/20
                  transition-[border-color,box-shadow] duration-300"
              >
                <Image
                  src={url}
                  alt={`Portfólio ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/8 transition-colors duration-300" />

                {/* expand hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="text-white/80 text-xs font-medium">Ver</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox — always dark by design */}
      <AnimatePresence>
        {isOpen && lightboxIndex !== null && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-2xl"
            onClick={close}
          >
            {/* Close */}
            <motion.button
              type="button"
              onClick={close}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-colors"
              aria-label="Fechar"
            >
              <CloseOutlined />
            </motion.button>

            {/* Counter */}
            <motion.span
              className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-zinc-400 tabular-nums bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {lightboxIndex + 1} / {total}
            </motion.span>

            {/* Prev */}
            {total > 1 && (
              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, delay: 0.12 }}
                className="absolute left-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-colors"
                aria-label="Anterior"
              >
                <LeftOutlined />
              </motion.button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
                mass: 0.9,
              }}
            >
              <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-white/8 via-transparent to-white/4 pointer-events-none z-10" />
              <div className="absolute -inset-px rounded-2xl border border-white/12 pointer-events-none z-10" />
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8),0_8px_24px_rgba(0,0,0,0.6)]">
                <Image
                  src={images[lightboxIndex]}
                  alt={`Portfólio ${lightboxIndex + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Next */}
            {total > 1 && (
              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22, delay: 0.12 }}
                className="absolute right-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-colors"
                aria-label="Próxima"
              >
                <RightOutlined />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
