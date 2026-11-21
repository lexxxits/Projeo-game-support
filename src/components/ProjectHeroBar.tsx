import React from 'react';
import { ChevronRight, Gamepad2, Monitor, Moon, Sun } from 'lucide-react';
import { ThemeMode } from '../types/platform';

interface ProjectHeroBarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  totalUpdates: number;
}

export const ProjectHeroBar: React.FC<ProjectHeroBarProps> = ({
  theme,
  onToggleTheme,
  totalUpdates,
}) => {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <span>Projetos</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span>Dark Knight PSX</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-blue-600 dark:text-[#7db3ed]">Atualizações</span>
        </div>

        {/* Project Title & Description */}
        <h1 className="mt-1.5 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:tracking-[0.04em] dark:text-white">
          Dark Knight PSX
        </h1>
        <p className="mt-1.5 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-200">
          Uma aventura de ação noir em estilo PlayStation 1 jogável diretamente no navegador.
        </p>

        {/* Clean Unboxed Metadata */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <Gamepad2 className="h-4 w-4 text-blue-600 dark:text-[#7db3ed]" />
            <span>Ação · Furtividade</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Monitor className="h-4 w-4 text-blue-600 dark:text-[#7db3ed]" />
            <span>WebGL, PC</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium tabular-nums">
            {totalUpdates} atualizações publicadas
          </span>
        </div>
      </div>

      {/* Theme Switcher Control */}
      <div className="flex shrink-0 items-center gap-2 self-start sm:self-end">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-xs transition-colors hover:border-blue-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border-[#2a3b54] dark:bg-[#101826] dark:text-slate-200 dark:hover:border-[#4f87c4] dark:hover:text-white"
        >
          {theme === 'light' ? (
            <>
              <Moon className="h-4 w-4 text-slate-700" />
              <span>Tema Escuro</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4 text-amber-300" />
              <span>Tema Claro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
