import React, { useState } from 'react';
import { LogOut, Menu, Shield, User, X } from 'lucide-react';
import { UserSession } from '../types/platform';
import { BatEmblem } from './BatEmblem';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  session: UserSession | null;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

const NAV_ITEMS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'atualizacoes', label: 'Atualizações' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'comunidade', label: 'Comunidade' },
];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  session,
  onOpenLogin,
  onOpenSignup,
  onLogout,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors dark:border-[#1e2b3d] dark:bg-[#0a0e17]/95">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Mark */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('inicio');
          }}
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <BatEmblem className="h-9 w-8 shrink-0" />
          <span className="font-display text-xl font-bold tracking-[0.08em] text-slate-900 uppercase sm:text-2xl dark:tracking-[0.12em] dark:text-slate-100">
            DARK KNIGHT PSX
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 md:flex lg:gap-8"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`relative whitespace-nowrap shrink-0 py-1 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:font-display dark:tracking-[0.14em] dark:uppercase ${
                  isActive
                    ? 'text-blue-600 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-blue-600 dark:bg-[#4f87c4]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Auth Actions */}
        <div className="flex shrink-0 items-center gap-2.5">
          {session ? (
            <div className="flex items-center gap-2">
              {session.role === 'creator' ? (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border dark:border-[#4f87c4]/60 dark:bg-[#182942] dark:font-display dark:text-sm dark:tracking-[0.12em] dark:uppercase dark:hover:bg-[#22395c]"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Painel Admin</span>
                </button>
              ) : (
                <span className="hidden items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 sm:inline-flex dark:border-[#24344d] dark:bg-[#111927] dark:text-slate-200">
                  <User className="h-3.5 w-3.5 text-blue-600 dark:text-[#7db3ed]" />
                  <span className="max-w-[120px] truncate">{session.name}</span>
                </span>
              )}
              <button
                type="button"
                onClick={onLogout}
                title="Sair da conta"
                aria-label="Sair da conta"
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:rounded-[4px] dark:border-[#2a3b54] dark:bg-[#111927] dark:text-slate-300 dark:hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenLogin}
                className="whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border-[#3a4f6d] dark:bg-[#111927] dark:font-display dark:text-sm dark:tracking-[0.12em] dark:text-slate-100 dark:uppercase dark:hover:bg-[#192438]"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={onOpenSignup}
                className="hidden whitespace-nowrap shrink-0 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:inline-flex dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2c4e78] dark:font-display dark:text-sm dark:tracking-[0.12em] dark:uppercase dark:hover:bg-[#386399]"
              >
                Cadastrar
              </button>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 md:hidden dark:rounded-[4px] dark:border-[#253348] dark:bg-[#101724] dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navegação mobile"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-[#1c2738] dark:bg-[#0c111b]"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-[#172438] dark:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-[#121b2b] dark:hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
            {!session && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignup();
                }}
                className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 sm:hidden"
              >
                Criar conta
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
