import React, { useState } from 'react';
import {
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Share2,
  X,
} from 'lucide-react';
import { UpdatePanel } from '../types/platform';

interface ImageLightboxProps {
  panel: UpdatePanel;
  initialIndex?: number;
  onClose: () => void;
  onOpenSupport: (panel: UpdatePanel) => void;
  onOpenShare: (panel: UpdatePanel) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  panel,
  initialIndex = 0,
  onClose,
  onOpenSupport,
  onOpenShare,
}) => {
  const photos = panel.images && panel.images.length > 0 ? panel.images : [panel.imageUrl];
  const hasVideo = Boolean(panel.videoUrl && panel.videoUrl.trim() !== '');

  const [currentIdx, setCurrentIdx] = useState(
    Math.min(initialIndex, Math.max(0, photos.length - 1))
  );
  const [viewMode, setViewMode] = useState<'photos' | 'video'>('photos');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização ampliada: ${panel.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-3 backdrop-blur-sm sm:p-5 dark:bg-black/85"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:rounded-[6px] dark:border-[#2b3f5e] dark:bg-[#0b101b]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5 dark:border-[#1c283b]">
          <div className="flex items-center gap-2.5">
            <span className="rounded bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-[#182942] dark:text-[#7db3ed]">
              v{panel.version}
            </span>
            <span className="font-display text-2xl font-bold tracking-wide text-slate-900 uppercase dark:tracking-[0.1em] dark:text-white">
              {panel.title}
            </span>
            <span className="hidden font-mono text-xs text-slate-400 sm:inline">
              · {panel.date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasVideo && (
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-[#111927]">
                <button
                  type="button"
                  onClick={() => setViewMode('photos')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
                    viewMode === 'photos'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-[#243b5e] dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Fotos ({photos.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('video')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
                    viewMode === 'video'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-[#243b5e] dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Film className="h-4 w-4" />
                  <span>Vídeo</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenShare(panel);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:border-[#24344c] dark:bg-[#111927] dark:text-slate-200"
            >
              <Share2 className="h-4 w-4" />
              <span>Compartilhar</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar visualização"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:rounded-[4px] dark:hover:bg-[#172236] dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Spacious Media Viewport */}
        <div className="relative h-[320px] w-full shrink-0 bg-slate-950 sm:h-[460px] dark:bg-[#060910]">
          {viewMode === 'video' && hasVideo ? (
            <video
              src={panel.videoUrl}
              controls
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <>
              <img
                src={photos[currentIdx]}
                alt={`${panel.title} - foto ${currentIdx + 1}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
                    }
                    aria-label="Foto anterior"
                    className="absolute top-1/2 left-4 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white shadow-lg hover:bg-black/90"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
                    }
                    aria-label="Próxima foto"
                    className="absolute top-1/2 right-4 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white shadow-lg hover:bg-black/90"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <span className="absolute right-4 bottom-3 rounded-md bg-black/75 px-2.5 py-1 font-mono text-xs font-semibold tabular-nums text-white">
                    {currentIdx + 1} / {photos.length}
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {viewMode === 'photos' && photos.length > 1 && (
          <div className="flex shrink-0 items-center gap-2.5 overflow-x-auto border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-[#1c283b] dark:bg-[#080c14]">
            {photos.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-14 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                  idx === currentIdx
                    ? 'border-blue-600 opacity-100 shadow-xs'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={src}
                  alt={`Miniatura ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Details + Implementation List + Action */}
        <div className="noir-scroll flex flex-col justify-between gap-4 overflow-y-auto border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-start dark:border-[#1c283b]">
          <div className="flex-1 space-y-3">
            <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200">
              {panel.fullDescription}
            </p>
            {panel.implementations && panel.implementations.length > 0 && (
              <div className="grid gap-2 pt-1 sm:grid-cols-2">
                {panel.implementations.map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        item.done
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white text-transparent dark:border-[#374d6e] dark:bg-[#0f1624]'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSupport(panel);
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2c4e78] dark:font-display dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#386399]"
          >
            <span>Dar Impulso</span>
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
