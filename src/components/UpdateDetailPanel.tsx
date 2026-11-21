import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Film,
  Heart,
  Image as ImageIcon,
  Maximize2,
  Share2,
  Users,
  X,
} from 'lucide-react';
import { UpdatePanel } from '../types/platform';

interface UpdateDetailPanelProps {
  panel: UpdatePanel;
  onClose: () => void;
  onOpenSupport: (panel: UpdatePanel) => void;
  onOpenImageLightbox: (panel: UpdatePanel, initialIndex?: number) => void;
  onToggleLike: (panelId: string) => void;
  onOpenShare: (panel: UpdatePanel) => void;
}

const AVATAR_TONES = [
  'bg-blue-600 text-white',
  'bg-slate-700 text-white',
  'bg-sky-700 text-white',
  'bg-indigo-600 text-white',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export const UpdateDetailPanel: React.FC<UpdateDetailPanelProps> = ({
  panel,
  onClose,
  onOpenSupport,
  onOpenImageLightbox,
  onToggleLike,
  onOpenShare,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [mediaTab, setMediaTab] = useState<'photos' | 'video'>('photos');
  const [slideIndex, setSlideIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const photos = panel.images && panel.images.length > 0 ? panel.images : [panel.imageUrl];
  const hasVideo = Boolean(panel.videoUrl && panel.videoUrl.trim() !== '');

  useEffect(() => {
    setSlideIndex(0);
    setMediaTab('photos');
    setExpanded(false);
  }, [panel.id]);

  const safeSlideIndex = Math.min(slideIndex, Math.max(0, photos.length - 1));
  const goal = panel.goalAmount > 0 ? panel.goalAmount : 1000;
  const pct = Math.min(100, Math.round((panel.totalRaised / goal) * 100));
  const sponsorsList = (panel.sponsors ?? []).slice(0, 4);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || photos.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 36) {
      if (diff > 0) {
        setSlideIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      } else {
        setSlideIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
  };

  return (
    <aside
      aria-label={`Detalhes de ${panel.headerLabel}`}
      className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-md sm:p-6 dark:rounded-[6px] dark:border-[#24344c] dark:bg-[#0d131f]/95 dark:shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
    >
      {/* Panel Top Header */}
      <div className="mb-4 flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 pb-3.5 dark:border-[#1c283b]">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="rounded-md bg-blue-50 px-2.5 py-1 font-display text-sm font-bold tracking-wide text-blue-700 uppercase dark:bg-[#182942] dark:text-[#7db3ed]">
            {panel.headerLabel}
          </span>
          <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
            {panel.date}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenShare(panel)}
            title="Compartilhar atualização"
            aria-label="Compartilhar atualização"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:rounded-[4px] dark:border-[#24344c] dark:bg-[#111927] dark:text-slate-200 dark:hover:text-white"
          >
            <Share2 className="h-4 w-4" />
            <span>Compartilhar</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel de atualização"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:text-slate-400 dark:hover:bg-[#162133] dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-5">
        {/* Title & Explanatory Text */}
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 uppercase sm:text-3xl dark:text-white">
            {panel.title}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
            {expanded ? panel.fullDescription : panel.shortDescription}
          </p>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-[#7db3ed] dark:hover:text-white"
          >
            <span>{expanded ? 'Ver resumo' : 'Ler descrição completa'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Media Switcher when Video exists */}
        {hasVideo && (
          <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-[#090e17]">
            <button
              type="button"
              onClick={() => setMediaTab('photos')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition-colors ${
                mediaTab === 'photos'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-[#1e3150] dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Fotos ({photos.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setMediaTab('video')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition-colors ${
                mediaTab === 'video'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-[#1e3150] dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Film className="h-4 w-4" />
              <span>Vídeo</span>
            </button>
          </div>
        )}

        {/* Photo Carousel (object-contain so nothing is ever cropped) or Video Player */}
        {mediaTab === 'video' && hasVideo ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-black dark:rounded-[4px] dark:border-[#273852]">
            <video
              src={panel.videoUrl}
              controls
              playsInline
              preload="metadata"
              className="aspect-[16/10] w-full bg-black object-contain"
            />
          </div>
        ) : (
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="group relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-xs dark:rounded-[4px] dark:border-[#273852] dark:bg-[#060910]"
          >
            {/* Sliding track */}
            <div
              className="flex h-full w-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${safeSlideIndex * 100}%)` }}
            >
              {photos.map((src, idx) => (
                <button
                  key={`${panel.id}-photo-${idx}`}
                  type="button"
                  onClick={() => onOpenImageLightbox(panel, idx)}
                  className="relative flex h-full w-full shrink-0 items-center justify-center bg-slate-950 focus-visible:outline-none"
                >
                  <img
                    src={src}
                    alt={`${panel.title} - foto ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Expand button top-right */}
            <button
              type="button"
              onClick={() => onOpenImageLightbox(panel, safeSlideIndex)}
              title="Ampliar imagem"
              aria-label="Ampliar imagem"
              className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/65 text-white transition-colors hover:bg-black/90"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Carousel Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Foto anterior"
                  className="absolute top-1/2 left-2.5 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow transition-colors hover:bg-black/90"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Próxima foto"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow transition-colors hover:bg-black/90"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Bottom Carousel Dots & Counter */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pt-6 pb-2.5">
              <span className="font-display text-xs font-semibold tracking-[0.14em] text-slate-100 uppercase">
                {panel.subtitle || panel.category}
              </span>
              <div className="pointer-events-auto flex items-center gap-2">
                {photos.length > 1 && (
                  <div className="flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1">
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlideIndex(idx);
                        }}
                        aria-label={`Ir para foto ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          idx === safeSlideIndex ? 'w-5 bg-white' : 'w-2 bg-white/45'
                        }`}
                      />
                    ))}
                  </div>
                )}
                <span className="rounded bg-black/70 px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-white">
                  {safeSlideIndex + 1}/{photos.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Implementation Checklist (Prominent & Easy to Read) */}
        {panel.implementations && panel.implementations.length > 0 && (
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:rounded-[4px] dark:border-[#243652] dark:bg-[#090f1a]">
            <div className="mb-3 flex items-center justify-between border-b border-blue-100 pb-2 dark:border-[#1c2a40]">
              <span className="font-display text-base font-bold tracking-wide text-slate-900 uppercase dark:text-white">
                Lista de Implementações
              </span>
              <span className="rounded-md bg-white px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-blue-700 shadow-2xs dark:bg-[#15243b] dark:text-[#7db3ed]">
                {panel.implementations.filter((i) => i.done).length}/{panel.implementations.length}
              </span>
            </div>
            <ul className="space-y-2.5">
              {panel.implementations.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      item.done
                        ? 'border-blue-600 bg-blue-600 text-white dark:border-[#5a92cf] dark:bg-[#2a4970]'
                        : 'border-slate-300 bg-white text-transparent dark:border-[#374d6e] dark:bg-[#0f1624]'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                  <span className="text-sm leading-snug font-medium text-slate-800 dark:text-slate-100">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Individual Amount Raised + Progress */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:rounded-[4px] dark:border-[#1c283b] dark:bg-[#0a0f19]">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Arrecadado nesta atualização
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold tabular-nums text-blue-600 dark:text-[#7db3ed]">
                R$ {panel.totalRaised.toLocaleString('pt-BR')}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                de R$ {goal.toLocaleString('pt-BR')}
              </span>
            </div>
            <span className="font-mono text-sm font-bold tabular-nums text-slate-800 dark:text-slate-200">
              {pct}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#1a2538]">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300 dark:bg-[#5a92cf]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Sponsors Icons + Views & Likes */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Patrocinado por
            </div>
            <div className="mt-1.5 flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {sponsorsList.map((sponsor, idx) => (
                  <span
                    key={`${sponsor}-${idx}`}
                    title={sponsor}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-xs dark:border-[#0d131f] ${
                      AVATAR_TONES[idx % AVATAR_TONES.length]
                    }`}
                  >
                    {getInitials(sponsor)}
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                +{panel.supportCount} apoiadores
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 font-mono text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
                <Eye className="h-4 w-4 text-slate-500" />
                <span>{panel.views.toLocaleString('pt-BR')}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Visualizações</div>
            </div>

            <button
              type="button"
              onClick={() => onToggleLike(panel.id)}
              aria-pressed={Boolean(panel.likedByMe)}
              title={panel.likedByMe ? 'Remover curtida' : 'Curtir atualização'}
              className={`group rounded-lg border px-3 py-1.5 text-right transition-colors ${
                panel.likedByMe
                  ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/30 dark:text-rose-300'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50/70 dark:border-[#24344c] dark:bg-[#111927] dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-end gap-1.5 font-mono text-sm font-bold tabular-nums">
                <Heart
                  className={`h-4 w-4 ${
                    panel.likedByMe
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-slate-500 group-hover:text-rose-500'
                  }`}
                />
                <span>{panel.likes.toLocaleString('pt-BR')}</span>
              </div>
              <div className="text-xs opacity-85">Curtidas</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Primary Boost CTA + Visible Supporters Count */}
      <div className="mt-5 shrink-0 border-t border-slate-200 pt-4 dark:border-[#1c283b]">
        <div className="mb-2.5 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 font-semibold tabular-nums text-slate-700 dark:text-slate-200">
            <Users className="h-4 w-4 text-blue-600 dark:text-[#7db3ed]" />
            <span>{panel.supportCount} apoiadores já impulsionaram</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenSupport(panel)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border dark:border-[#5483ba]/60 dark:bg-[#2a4970] dark:font-display dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#365d8f]"
        >
          <span>Dar Impulso</span>
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
};
