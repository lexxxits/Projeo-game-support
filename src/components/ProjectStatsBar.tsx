import React from 'react';
import { DollarSign, FileText, Heart } from 'lucide-react';
import { UpdatePanel } from '../types/platform';

interface ProjectStatsBarProps {
  panels: UpdatePanel[];
  onDonateClick: () => void;
}

export const ProjectStatsBar: React.FC<ProjectStatsBarProps> = ({ panels, onDonateClick }) => {
  const totalUpdates = panels.length;
  const totalImpulses = panels.reduce((sum, p) => sum + p.supportCount, 0);
  const totalRaised = panels.reduce((sum, p) => sum + p.totalRaised, 0);
  const totalGoal = panels.reduce((sum, p) => sum + (p.goalAmount || 1000), 0);
  const progressPct = totalGoal > 0 ? Math.min(100, Math.round((totalRaised / totalGoal) * 100)) : 0;

  return (
    <section
      aria-label="Estatísticas gerais do projeto"
      className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:rounded-[6px] dark:border-[#1f2c40] dark:bg-[#0c121d]/95"
    >
      <div className="grid items-center gap-5 md:grid-cols-12">
        {/* Stat 1: Total Updates */}
        <div className="flex items-center gap-3.5 md:col-span-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 dark:border-[#273a54] dark:bg-[#131e30] dark:text-[#7db3ed]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total de Atualizações
            </div>
            <div className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {totalUpdates}
            </div>
          </div>
        </div>

        {/* Stat 2: Total Impulses */}
        <div className="flex items-center gap-3.5 md:col-span-3 md:border-l md:border-slate-200 md:pl-5 dark:md:border-[#1b2738]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-[#273a54] dark:bg-[#131e30] dark:text-[#7db3ed]">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total de Apoiadores / Impulsos
            </div>
            <div className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {totalImpulses.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Stat 3: Total Money Raised */}
        <div className="flex items-center gap-3.5 md:col-span-3 md:border-l md:border-slate-200 md:pl-5 dark:md:border-[#1b2738]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 dark:border-[#273a54] dark:bg-[#131e30] dark:text-[#7db3ed]">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Valor Total Arrecadado
            </div>
            <div className="font-display text-2xl font-bold tabular-nums text-blue-600 dark:text-[#7db3ed]">
              R$ {totalRaised.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Progress + Donate CTA */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center md:col-span-4 md:border-l md:border-slate-200 md:pl-5 dark:md:border-[#1b2738]">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Meta global ({progressPct}%)
              </span>
              <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                R$ {totalGoal.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#162032]">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300 dark:bg-[#5a92cf]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onDonateClick}
            className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2a4970] dark:font-display dark:text-sm dark:tracking-[0.12em] dark:uppercase dark:hover:bg-[#365d8f]"
          >
            <Heart className="h-4 w-4" />
            <span>Apoiar Projeto</span>
          </button>
        </div>
      </div>
    </section>
  );
};
