import React, { useState } from 'react';
import {
  ArrowUp,
  Eye,
  Film,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  Pencil,
  Plus,
  Send,
  Share2,
  Users,
} from 'lucide-react';
import { CommunityComment, GameConfig, SupportImpulse, UpdatePanel } from '../types/platform';

interface AboutAndCommunityProps {
  panels: UpdatePanel[];
  gameConfig: GameConfig;
  impulses: SupportImpulse[];
  comments: CommunityComment[];
  onSelectPanel: (panel: UpdatePanel) => void;
  onOpenSupport: (panel: UpdatePanel) => void;
  onEditPanel: (panel: UpdatePanel) => void;
  onCreatePanel: () => void;
  onAddComment: (author: string, message: string) => void;
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

export const AboutAndCommunity: React.FC<AboutAndCommunityProps> = ({
  panels,
  gameConfig,
  impulses,
  comments,
  onSelectPanel,
  onOpenSupport,
  onEditPanel,
  onCreatePanel,
  onAddComment,
  onToggleLike,
  onOpenShare,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');

  const totalSupporters = panels.reduce((acc, p) => acc + p.supportCount, 0);
  const totalRaised = panels.reduce((acc, p) => acc + p.totalRaised, 0);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(authorName.trim() || 'Visitante de Gotham', commentText.trim());
    setCommentText('');
  };

  return (
    <div className="mt-12 space-y-12 border-t border-slate-200 pt-10 dark:border-[#192436]">
      {/* Sobre o Projeto */}
      <section id="sobre" className="scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 uppercase sm:text-3xl dark:tracking-[0.1em] dark:text-white">
              Sobre o Projeto
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-200">
              Dark Knight PSX é um projeto independente que recria a atmosfera densa e chuvosa dos jogos de ação da era 32-bit. Jogável diretamente no navegador via WebView, cada nova atualização expande áreas, sistemas climáticos e encontros táticos graças ao apoio direto da comunidade.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3.5 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:rounded-[4px] dark:border-[#1f2c40] dark:bg-[#0c121d]">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Atualizações
              </div>
              <div className="mt-1 font-display text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {panels.length}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:rounded-[4px] dark:border-[#1f2c40] dark:bg-[#0c121d]">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Impulsos
              </div>
              <div className="mt-1 font-display text-3xl font-bold tabular-nums text-blue-600 dark:text-[#7db3ed]">
                {totalSupporters}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:rounded-[4px] dark:border-[#1f2c40] dark:bg-[#0c121d]">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Arrecadado
              </div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl dark:text-white">
                R$ {totalRaised.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Engine: WebGL PSX Pipeline</span>
          <span aria-hidden="true">·</span>
          <span>
            WebView configurado:{' '}
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {gameConfig.iframeUrl}
            </span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Controles: WASD mover, Espaço planar, Mouse câmera</span>
        </div>
      </section>

      {/* Atualizações & Galeria Completa */}
      <section id="atualizacoes" className="scroll-mt-24">
        <div id="galeria" className="scroll-mt-24" />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 uppercase sm:text-3xl dark:tracking-[0.1em] dark:text-white">
              Todas as Atualizações & Galeria
            </h2>
            <p className="mt-1.5 text-base text-slate-600 dark:text-slate-300">
              Clique em qualquer registro para inspecionar no palco principal, compartilhar o link ou dar um impulso.
            </p>
          </div>
          <button
            type="button"
            onClick={onCreatePanel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-xs transition-colors hover:border-blue-400 hover:text-blue-700 dark:rounded-[4px] dark:border-[#3a557c] dark:bg-[#16243a] dark:text-white dark:hover:bg-[#1e3150]"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Painel</span>
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {panels.map((panel) => {
            const sponsors = (panel.sponsors ?? []).slice(0, 3);
            const photoCount = (panel.images ?? [panel.imageUrl]).length;
            return (
              <article
                key={panel.id}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs transition-colors hover:border-blue-300 dark:rounded-[4px] dark:border-[#1f2c40] dark:bg-[#0c121d] dark:hover:border-[#344b6d]"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectPanel(panel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative aspect-[16/9] w-full overflow-hidden bg-slate-900 text-left dark:bg-[#070a11]"
                >
                  <img
                    src={panel.images?.[0] || panel.imageUrl}
                    alt={panel.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white">
                      <ImageIcon className="h-3 w-3" />
                      <span>{photoCount}</span>
                    </span>
                    {panel.videoUrl && (
                      <span className="inline-flex items-center gap-1 rounded bg-blue-600/90 px-2 py-0.5 font-mono text-[10px] text-white">
                        <Film className="h-3 w-3" />
                        <span>Vídeo</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute right-3 bottom-2.5 left-3 flex items-baseline justify-between gap-2">
                    <span className="font-display text-lg font-bold tracking-wider text-white uppercase">
                      {panel.version} {panel.title}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-slate-200">
                      {panel.date}
                    </span>
                  </div>
                </button>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-blue-600 uppercase dark:text-[#7db3ed]">
                        {panel.category}
                      </span>
                      <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                        R$ {panel.totalRaised.toLocaleString('pt-BR')} arrecadados
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {panel.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 dark:border-[#192436]">
                    {/* Sponsors + Views/Likes */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {sponsors.map((s, idx) => (
                            <span
                              key={`${s}-${idx}`}
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-white text-[9px] font-bold dark:border-[#0c121d] ${
                                AVATAR_TONES[idx % AVATAR_TONES.length]
                              }`}
                            >
                              {getInitials(s)}
                            </span>
                          ))}
                        </div>
                        <span className="tabular-nums text-slate-500 dark:text-slate-400">
                          {panel.supportCount} apoiadores
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{panel.views.toLocaleString('pt-BR')}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleLike(panel.id)}
                          className="inline-flex items-center gap-1 font-mono tabular-nums hover:text-rose-500"
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              panel.likedByMe ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                          <span>{panel.likes.toLocaleString('pt-BR')}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditPanel(panel)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#101826] dark:text-slate-300 dark:hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenShare(panel)}
                          aria-label={`Compartilhar ${panel.title}`}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#101826] dark:text-slate-300 dark:hover:text-white"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenSupport(panel)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 dark:rounded-[4px] dark:border dark:border-[#5483ba]/60 dark:bg-[#2a4970] dark:font-display dark:tracking-[0.12em] dark:uppercase dark:hover:bg-[#365d8f]"
                      >
                        <span>Dar Impulso</span>
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Comunidade & Mural de Impulsos */}
      <section id="comunidade" className="scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Recent Impulses Feed */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs lg:col-span-5 dark:rounded-[6px] dark:border-[#1f2c40] dark:bg-[#0c121d]">
            <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-[#192436]">
              <Users className="h-5 w-5 text-blue-600 dark:text-[#73a9e6]" />
              <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 uppercase dark:tracking-[0.1em] dark:text-white">
                Impulsos Recentes
              </h2>
            </div>

            <div className="space-y-3">
              {impulses.slice(0, 6).map((imp) => (
                <div
                  key={imp.id}
                  className="rounded-md border border-slate-100 bg-slate-50/70 p-3 dark:rounded-[4px] dark:border-[#1a2638] dark:bg-[#090e17]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-slate-900 uppercase dark:text-white">
                      {imp.supporterName}
                    </span>
                    <span className="font-mono text-xs font-semibold tabular-nums text-blue-600 dark:text-[#7db3ed]">
                      + R$ {imp.amount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Apoiou {imp.updateTitle} · {imp.createdAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Discussion Wall */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs lg:col-span-7 dark:rounded-[6px] dark:border-[#1f2c40] dark:bg-[#0c121d]">
            <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-[#192436]">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-[#73a9e6]" />
              <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 uppercase dark:tracking-[0.1em] dark:text-white">
                Comunidade & Feedback
              </h2>
            </div>

            <form onSubmit={handleSubmitComment} className="mb-5 space-y-2.5">
              <div className="grid gap-2.5 sm:grid-cols-3">
                <input
                  type="text"
                  maxLength={32}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Seu nome"
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#080c14] dark:text-white"
                />
                <div className="flex gap-2 sm:col-span-2">
                  <input
                    type="text"
                    required
                    maxLength={240}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Deixe sua opinião sobre a build atual..."
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#080c14] dark:text-white"
                  />
                  <button
                    type="submit"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 dark:rounded-[4px] dark:border dark:border-[#5483ba]/60 dark:bg-[#2a4970] dark:hover:bg-[#365d8f]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Enviar</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              {comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="rounded-md border border-slate-100 bg-slate-50/70 p-3.5 dark:rounded-[4px] dark:border-[#1a2638] dark:bg-[#090e17]"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-slate-900 uppercase dark:text-white">
                        {cmt.author}
                      </span>
                      <span className="text-slate-300 dark:text-slate-500">·</span>
                      <span
                        className={
                          cmt.role === 'Criador'
                            ? 'font-semibold text-blue-600 dark:text-[#7db3ed]'
                            : 'text-slate-500 dark:text-slate-400'
                        }
                      >
                        {cmt.role}
                      </span>
                    </div>
                    <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500">
                      {cmt.createdAt}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {cmt.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
