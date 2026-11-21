import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Share2, X } from 'lucide-react';
import { UpdatePanel } from '../types/platform';
import { getPanelShareUrl } from '../utils/shareUtils';

interface ShareModalProps {
  panel: UpdatePanel;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ panel, onClose }) => {
  const shareUrl = getPanelShareUrl(panel.id);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${panel.headerLabel} — ${panel.title}`,
          text: panel.shortDescription,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled
      }
    }
    await handleCopy();
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${panel.headerLabel} — ${panel.title}: ${panel.shortDescription} ${shareUrl}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${panel.headerLabel} — ${panel.title}`
  )}&url=${encodeURIComponent(shareUrl)}`;

  const coverImage = panel.images?.[0] || panel.imageUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs dark:bg-black/80"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[580px] rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:rounded-[6px] dark:border-[#2c405e] dark:bg-[#0d1421] dark:shadow-[0_24px_65px_rgba(0,0,0,0.85)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar compartilhamento"
          className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:rounded-[4px] dark:hover:bg-[#172236] dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 pr-10">
          <Share2 className="h-6 w-6 text-blue-600 dark:text-[#73a9e6]" />
          <h2
            id="share-modal-title"
            className="font-display text-2xl font-bold tracking-wide text-slate-900 uppercase dark:text-white"
          >
            Compartilhar Atualização
          </h2>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          O link inclui meta tags Open Graph com imagem de capa, título e descrição para exibição automática em redes sociais e mensageiros.
        </p>

        {/* Open Graph Preview Card */}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:rounded-[4px] dark:border-[#223147] dark:bg-[#080c14]">
          <div className="h-52 w-full overflow-hidden bg-slate-950 sm:h-60">
            <img
              src={coverImage}
              alt={panel.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="p-4">
            <div className="truncate font-mono text-xs text-slate-500 dark:text-slate-400">
              {shareUrl}
            </div>
            <div className="mt-1 font-display text-xl font-bold text-slate-900 uppercase dark:text-white">
              {panel.headerLabel} — {panel.title}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {panel.shortDescription}
            </p>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="mt-5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Link único do painel
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => e.currentTarget.select()}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-800 focus:outline-none dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#080c14] dark:text-slate-200"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:rounded-[4px] dark:bg-[#2c4e78] dark:hover:bg-[#386399]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Quick Social Share Actions */}
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#101826] dark:text-slate-200 dark:hover:text-white"
          >
            <span>WhatsApp</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#101826] dark:text-slate-200 dark:hover:text-white"
          >
            <span>X / Twitter</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#101826] dark:text-slate-200 dark:hover:text-white"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Sistema</span>
          </button>
        </div>
      </div>
    </div>
  );
};
