/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { AboutAndCommunity } from './components/AboutAndCommunity';
import { AdminModal, AdminTab } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';
import { GameViewport } from './components/GameViewport';
import { Header } from './components/Header';
import { ImageLightbox } from './components/ImageLightbox';
import { ProjectHeroBar } from './components/ProjectHeroBar';
import { ProjectStatsBar } from './components/ProjectStatsBar';
import { ShareModal } from './components/ShareModal';
import { SupportModal } from './components/SupportModal';
import { UpdateDetailPanel } from './components/UpdateDetailPanel';
import { UpdateGallery } from './components/UpdateGallery';
import { storageService } from './services/storageService';
import {
  CommunityComment,
  GameConfig,
  SupportImpulse,
  ThemeMode,
  UpdatePanel,
  UserSession,
} from './types/platform';
import { applyClientOpenGraphTags, syncPanelsWithServer } from './utils/shareUtils';

type PendingAction =
  | { type: 'support'; panel: UpdatePanel }
  | { type: 'admin'; tab: AdminTab; editPanel: UpdatePanel | null }
  | null;

function getInitialPanelIdFromUrl(panels: UpdatePanel[]): string | null {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const queryPanel = params.get('painel');
    if (queryPanel && panels.some((p) => p.id === queryPanel)) {
      return queryPanel;
    }
    if (window.location.pathname.startsWith('/painel/')) {
      const pathId = window.location.pathname.replace('/painel/', '').trim();
      if (pathId && panels.some((p) => p.id === pathId)) {
        return pathId;
      }
    }
  }
  return panels[0]?.id ?? null;
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => storageService.getTheme());
  const [panels, setPanels] = useState<UpdatePanel[]>(() => storageService.getPanels());
  const [gameConfig, setGameConfig] = useState<GameConfig>(() => storageService.getGameConfig());
  const [impulses, setImpulses] = useState<SupportImpulse[]>(() => storageService.getImpulses());
  const [comments, setComments] = useState<CommunityComment[]>(() => storageService.getComments());
  const [session, setSession] = useState<UserSession | null>(() => storageService.getSession());

  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(() =>
    getInitialPanelIdFromUrl(storageService.getPanels())
  );

  const [activeSection, setActiveSection] = useState<string>('inicio');

  // Modals & protected action queue
  const [supportModalPanel, setSupportModalPanel] = useState<UpdatePanel | null>(null);
  const [lightboxState, setLightboxState] = useState<{
    panel: UpdatePanel;
    initialIndex: number;
  } | null>(null);
  const [shareModalPanel, setShareModalPanel] = useState<UpdatePanel | null>(null);
  const [authModalState, setAuthModalState] = useState<{
    open: boolean;
    tab: 'login' | 'signup';
    reason: string | null;
    requireCreator: boolean;
  }>({
    open: false,
    tab: 'login',
    reason: null,
    requireCreator: false,
  });
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const [adminState, setAdminState] = useState<{
    open: boolean;
    tab: AdminTab;
    editPanel: UpdatePanel | null;
  }>({
    open: false,
    tab: 'editor',
    editPanel: null,
  });

  // Sync Tailwind .dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storageService.saveTheme(theme);
  }, [theme]);

  // Sync panels to server for dynamic Open Graph meta tags
  useEffect(() => {
    void syncPanelsWithServer(panels);
  }, [panels]);

  const selectedPanel = useMemo(
    () => panels.find((p) => p.id === selectedPanelId) ?? null,
    [panels, selectedPanelId]
  );

  // Update dynamic client-side Open Graph / document title
  useEffect(() => {
    applyClientOpenGraphTags(selectedPanel);
  }, [selectedPanel]);

  // ESC key closes topmost modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (shareModalPanel) {
        setShareModalPanel(null);
      } else if (lightboxState) {
        setLightboxState(null);
      } else if (supportModalPanel) {
        setSupportModalPanel(null);
      } else if (adminState.open) {
        setAdminState((prev) => ({ ...prev, open: false }));
      } else if (authModalState.open) {
        setAuthModalState((prev) => ({ ...prev, open: false }));
        setPendingAction(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shareModalPanel, lightboxState, supportModalPanel, adminState.open, authModalState.open]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Selecting a panel increments its view counter cleanly & updates shareable query param
  const handleSelectPanel = (panel: UpdatePanel) => {
    if (panel.id !== selectedPanelId) {
      const updated = panels.map((p) =>
        p.id === panel.id ? { ...p, views: p.views + 1 } : p
      );
      setPanels(updated);
      storageService.savePanels(updated);
    }
    setSelectedPanelId(panel.id);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('painel', panel.id);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Interactive like toggle
  const handleToggleLike = (panelId: string) => {
    const updated = panels.map((p) => {
      if (p.id !== panelId) return p;
      const nextLiked = !p.likedByMe;
      return {
        ...p,
        likedByMe: nextLiked,
        likes: Math.max(0, p.likes + (nextLiked ? 1 : -1)),
      };
    });
    setPanels(updated);
    storageService.savePanels(updated);
  };

  // Protected action: Support / Donate requires logged-in user
  const requestSupportAction = (panel: UpdatePanel) => {
    if (!session) {
      setPendingAction({ type: 'support', panel });
      setAuthModalState({
        open: true,
        tab: 'login',
        reason: 'Faça login ou crie uma conta para apoiar esta atualização.',
        requireCreator: false,
      });
      return;
    }
    setSupportModalPanel(panel);
  };

  // Protected action: Admin panel requires Creator role
  const requestAdminAction = (tab: AdminTab, editPanel: UpdatePanel | null = null) => {
    if (!session || session.role !== 'creator') {
      setPendingAction({ type: 'admin', tab, editPanel });
      setAuthModalState({
        open: true,
        tab: 'login',
        reason: session
          ? 'Área exclusiva para Criadores. Entre com uma conta de Criador para gerenciar painéis.'
          : 'Faça login como Criador para criar, editar ou configurar o painel.',
        requireCreator: true,
      });
      return;
    }
    setAdminState({ open: true, tab, editPanel });
  };

  const handleAuthSuccess = (newSession: UserSession) => {
    setSession(newSession);
    storageService.saveSession(newSession);
    setAuthModalState((prev) => ({ ...prev, open: false }));

    if (pendingAction) {
      if (pendingAction.type === 'support') {
        setSupportModalPanel(pendingAction.panel);
      } else if (pendingAction.type === 'admin' && newSession.role === 'creator') {
        setAdminState({
          open: true,
          tab: pendingAction.tab,
          editPanel: pendingAction.editPanel,
        });
      }
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    setSession(null);
    storageService.saveSession(null);
    setAdminState((prev) => ({ ...prev, open: false }));
    setSupportModalPanel(null);
  };

  // Support / Boost confirmation
  const handleConfirmSupport = (panelId: string, amount: number, supporterName: string) => {
    const updatedPanels = panels.map((p) => {
      if (p.id !== panelId) return p;
      const nextSponsors = [supporterName, ...(p.sponsors ?? [])].slice(0, 6);
      return {
        ...p,
        supportCount: p.supportCount + 1,
        totalRaised: p.totalRaised + amount,
        sponsors: nextSponsors,
      };
    });
    setPanels(updatedPanels);
    storageService.savePanels(updatedPanels);

    const targetPanel = updatedPanels.find((p) => p.id === panelId);
    if (supportModalPanel && targetPanel) {
      setSupportModalPanel(targetPanel);
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} · ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newImpulse: SupportImpulse = {
      id: `imp-${Date.now()}`,
      updateId: panelId,
      updateTitle: targetPanel ? `${targetPanel.version} ${targetPanel.title}` : 'Atualização',
      amount,
      supporterName,
      message: '',
      createdAt: formattedDate,
    };

    setImpulses(storageService.addImpulse(newImpulse));
  };

  // Admin: Create or Update Panel
  const handleSavePanel = (savedPanel: UpdatePanel) => {
    const exists = panels.some((p) => p.id === savedPanel.id);
    const nextPanels = exists
      ? panels.map((p) => (p.id === savedPanel.id ? savedPanel : p))
      : [...panels, savedPanel];

    const normalized = [...nextPanels]
      .sort((a, b) => a.order - b.order)
      .map((p, idx) => ({ ...p, order: idx + 1 }));

    setPanels(normalized);
    storageService.savePanels(normalized);
    setSelectedPanelId(savedPanel.id);
  };

  const handleDeletePanel = (id: string) => {
    const filtered = panels
      .filter((p) => p.id !== id)
      .map((p, idx) => ({ ...p, order: idx + 1 }));
    setPanels(filtered);
    storageService.savePanels(filtered);
    if (selectedPanelId === id) {
      setSelectedPanelId(filtered[0]?.id ?? null);
    }
  };

  const handleMovePanel = (id: string, direction: 'up' | 'down') => {
    const index = panels.findIndex((p) => p.id === id);
    if (index === -1) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= panels.length) return;

    const copy = [...panels];
    const temp = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = temp;

    const reordered = copy.map((p, idx) => ({ ...p, order: idx + 1 }));
    setPanels(reordered);
    storageService.savePanels(reordered);
  };

  const handleSaveGameConfig = (config: GameConfig) => {
    setGameConfig(config);
    storageService.saveGameConfig(config);
  };

  const handleToggleWebViewSource = () => {
    const next = { ...gameConfig, useExternalIframe: !gameConfig.useExternalIframe };
    handleSaveGameConfig(next);
  };

  const handleAddComment = (author: string, message: string) => {
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;
    const newComment: CommunityComment = {
      id: `cmt-${Date.now()}`,
      author: session?.name || author,
      role: session?.role === 'creator' ? 'Criador' : 'Apoiador',
      message,
      createdAt: formatted,
    };
    setComments(storageService.addComment(newComment));
  };

  return (
    <div id="inicio" className="min-h-screen bg-[#f4f6f9] text-slate-900 transition-colors dark:bg-[#0a0e17] dark:text-slate-100">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        session={session}
        onOpenLogin={() => {
          setPendingAction(null);
          setAuthModalState({
            open: true,
            tab: 'login',
            reason: null,
            requireCreator: false,
          });
        }}
        onOpenSignup={() => {
          setPendingAction(null);
          setAuthModalState({
            open: true,
            tab: 'signup',
            reason: null,
            requireCreator: false,
          });
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => requestAdminAction('list', null)}
      />

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Project Header Breadcrumb + Title + Theme Toggle */}
        <ProjectHeroBar
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          totalUpdates={panels.length}
        />

        {/* Primary Stage: Game WebView + Right Update Detail Panel */}
        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          <div className={selectedPanel ? 'lg:col-span-7 xl:col-span-7' : 'lg:col-span-12'}>
            <GameViewport
              gameConfig={gameConfig}
              onOpenWebViewConfig={() => requestAdminAction('webview', null)}
              onToggleSourceMode={handleToggleWebViewSource}
            />
          </div>

          {selectedPanel && (
            <div className="lg:col-span-5 xl:col-span-5">
              <UpdateDetailPanel
                panel={selectedPanel}
                onClose={() => setSelectedPanelId(null)}
                onOpenSupport={requestSupportAction}
                onOpenImageLightbox={(panel, initialIndex = 0) =>
                  setLightboxState({ panel, initialIndex })
                }
                onToggleLike={handleToggleLike}
                onOpenShare={(panel) => setShareModalPanel(panel)}
              />
            </div>
          )}
        </div>

        {/* Horizontal Update Gallery Strip */}
        <UpdateGallery
          panels={panels}
          selectedPanelId={selectedPanelId}
          onSelectPanel={handleSelectPanel}
          onCreateNewPanel={() => requestAdminAction('editor', null)}
          onViewAll={() => handleNavigate('atualizacoes')}
        />

        {/* Overall Project Statistics Bar */}
        <ProjectStatsBar
          panels={panels}
          onDonateClick={() => {
            const target = selectedPanel ?? panels[0];
            if (target) requestSupportAction(target);
          }}
        />

        {/* Secondary Sections Below the Fold */}
        <AboutAndCommunity
          panels={panels}
          gameConfig={gameConfig}
          impulses={impulses}
          comments={comments}
          onSelectPanel={handleSelectPanel}
          onOpenSupport={requestSupportAction}
          onEditPanel={(panel) => requestAdminAction('editor', panel)}
          onCreatePanel={() => requestAdminAction('editor', null)}
          onAddComment={handleAddComment}
          onToggleLike={handleToggleLike}
          onOpenShare={(panel) => setShareModalPanel(panel)}
        />
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white py-6 dark:border-[#162030] dark:bg-[#070a11]">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:px-6 lg:px-8">
          <span className="font-display font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-400">
            Dark Knight PSX · Plataforma de Apresentação & Apoio
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => requestAdminAction('list', null)}
              className="hover:text-blue-600 dark:hover:text-slate-200"
            >
              Painel do Criador
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => requestAdminAction('webview', null)}
              className="hover:text-blue-600 dark:hover:text-slate-200"
            >
              Configurar WebView
            </button>
          </div>
        </div>
      </footer>

      {/* Support / PIX Boost Modal (Protected) */}
      {supportModalPanel && (
        <SupportModal
          panel={supportModalPanel}
          defaultSupporterName={session?.name ?? ''}
          onClose={() => setSupportModalPanel(null)}
          onConfirmSupport={handleConfirmSupport}
        />
      )}

      {/* Image & Video Zoom Lightbox */}
      {lightboxState && (
        <ImageLightbox
          panel={lightboxState.panel}
          initialIndex={lightboxState.initialIndex}
          onClose={() => setLightboxState(null)}
          onOpenSupport={requestSupportAction}
          onOpenShare={(panel) => setShareModalPanel(panel)}
        />
      )}

      {/* Share Modal (Open Graph preview + copy link) */}
      {shareModalPanel && (
        <ShareModal panel={shareModalPanel} onClose={() => setShareModalPanel(null)} />
      )}

      {/* Creator Admin Modal (Protected) */}
      {adminState.open && (
        <AdminModal
          key={`${adminState.tab}-${adminState.editPanel?.id ?? 'new'}`}
          initialTab={adminState.tab}
          initialEditPanel={adminState.editPanel}
          panels={panels}
          gameConfig={gameConfig}
          onSavePanel={handleSavePanel}
          onDeletePanel={handleDeletePanel}
          onMovePanel={handleMovePanel}
          onSaveGameConfig={handleSaveGameConfig}
          onLogoutCreator={handleLogout}
          onClose={() => setAdminState((prev) => ({ ...prev, open: false }))}
        />
      )}

      {/* Auth Login & Sign Up Modal */}
      {authModalState.open && (
        <AuthModal
          initialTab={authModalState.tab}
          reasonMessage={authModalState.reason}
          requireCreatorRole={authModalState.requireCreator}
          onLoginSuccess={handleAuthSuccess}
          onClose={() => {
            setAuthModalState((prev) => ({ ...prev, open: false }));
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
}
