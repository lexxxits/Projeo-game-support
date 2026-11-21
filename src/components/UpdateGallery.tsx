import React from 'react';
import { ArrowUpRight, Eye, Heart, Plus } from 'lucide-react';
import { UpdatePanel } from '../types/platform';

interface UpdateGalleryProps {
  panels: UpdatePanel[];
  selectedPanelId: string | null;
  onSelectPanel: (panel: UpdatePanel) => void;
  onCreateNewPanel: () => void;
  onViewAll: () => void;
}

export const UpdateGallery: React.FC<UpdateGalleryProps> = ({
  panels,
  selectedPanelId,
  onSelectPanel,
  onCreateNewPanel,
  onViewAll,
}) => {
  return (
    <section
      aria-label="Galeria de Atualizações"
      className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:rounded-[6px] dark:border-[#1f2c40] dark:bg-[#0c121d]/95"
    >
      {/* Gallery Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 uppercase sm:text-2xl dark:tracking-[0.14em] dark:text-slate-100">
          Galeria de Atualizações
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:font-display dark:tracking-[0.12em] dark:text-slate-300 dark:uppercase dark:hover:text-[#6aa4e8]"
        >
          <span>Ver todas</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Horizontal Cards Row */}
      <div className="noir-scroll grid grid-flow-col auto-cols-[240px] gap-3.5 overflow-x-auto pb-1.5 sm:auto-cols-[250px] lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible">
        {panels.map((panel) => {
          const isSelected = panel.id === selectedPanelId;
          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => onSelectPanel(panel)}
              className={`group flex flex-col overflow-hidden rounded-lg border text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/45 ring-2 ring-blue-600/20 dark:border-[#5a92cf] dark:bg-[#131e30] dark:shadow-[0_0_0_1px_rgba(90,146,207,0.35)]'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/80 dark:border-[#202d42] dark:bg-[#0f1624] dark:hover:border-[#3c577d] dark:hover:bg-[#131c2e]'
              }`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 dark:bg-[#080c14]">
                <img
                  src={panel.images?.[0] || panel.imageUrl}
                  alt={`${panel.version} ${panel.title}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                />
                <span className="absolute bottom-2 left-2 rounded bg-blue-600 px-2 py-0.5 font-mono text-[11px] font-semibold text-white shadow-xs dark:bg-[#182942] dark:text-[#9cc5f2]">
                  v{panel.version}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-3">
                <div>
                  <div className="truncate font-display text-base font-bold tracking-tight text-slate-900 uppercase dark:tracking-[0.06em] dark:text-slate-100">
                    {panel.title}
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="truncate font-medium uppercase">{panel.category}</span>
                    <span className="font-mono tabular-nums">{panel.date}</span>
                  </div>
                </div>

                {/* Views & Likes row */}
                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-600 dark:border-[#1c283b] dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    <span>{panel.views.toLocaleString('pt-BR')}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        panel.likedByMe ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                      }`}
                    />
                    <span>{panel.likes.toLocaleString('pt-BR')}</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {/* "+ MAIS EM BREVE" -> Create New Panel Button */}
        <button
          type="button"
          onClick={onCreateNewPanel}
          className="group flex min-h-[195px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-center transition-colors duration-150 hover:border-blue-500 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border-[#2c3e59] dark:bg-[#0b101a] dark:hover:border-[#5a92cf] dark:hover:bg-[#111a2b]"
        >
          <span className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 shadow-xs transition-colors group-hover:border-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:rounded-[4px] dark:border-[#2c3e59] dark:bg-[#101827] dark:text-slate-300 dark:group-hover:border-[#5a92cf]">
            <Plus className="h-5 w-5" />
          </span>
          <span className="font-display text-base font-bold tracking-wide text-slate-900 uppercase dark:tracking-[0.12em] dark:text-slate-200">
            Mais em breve
          </span>
          <span className="mt-1 text-xs font-semibold text-blue-600 dark:font-display dark:tracking-[0.12em] dark:text-slate-400 dark:uppercase dark:group-hover:text-[#7db3ed]">
            Criar novo painel
          </span>
        </button>
      </div>
    </section>
  );
};
