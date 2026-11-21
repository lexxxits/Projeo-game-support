import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUp, Check, Copy, Heart, QrCode, Users, X } from 'lucide-react';
import { UpdatePanel } from '../types/platform';

interface SupportModalProps {
  panel: UpdatePanel;
  defaultSupporterName?: string;
  onClose: () => void;
  onConfirmSupport: (panelId: string, amount: number, supporterName: string) => void;
}

function buildQrCells(seedText: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[r0 + r][c0 + c] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      grid[r][c] = (hash >>> 0) % 2 === 0;
    }
  }
  return grid;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  panel,
  defaultSupporterName = '',
  onClose,
  onConfirmSupport,
}) => {
  const presetValues =
    panel.supportValues && panel.supportValues.length > 0 ? panel.supportValues : [5, 10, 25, 50];

  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    presetValues.includes(25) ? 25 : presetValues[0]
  );
  const [customValue, setCustomValue] = useState('');
  const [supporterName, setSupporterName] = useState(defaultSupporterName);
  const [step, setStep] = useState<'select' | 'pix' | 'done'>('select');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const finalAmount = useMemo(() => {
    if (customValue.trim() !== '') {
      const parsed = Number(customValue.replace(',', '.'));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return selectedPreset ?? 0;
  }, [customValue, selectedPreset]);

  const pixPayload = useMemo(() => {
    const formatted = finalAmount.toFixed(2);
    return `00020126580014BR.GOV.BCB.PIX0136apoio-darkknightpsx@gotham.dev520400005303986540${formatted.length}${formatted}5802BR5915DARK KNIGHT PSX6009SAO PAULO62150511${panel.id.toUpperCase()}6304A9F2`;
  }, [finalAmount, panel.id]);

  const qrCells = useMemo(() => buildQrCells(pixPayload), [pixPayload]);

  const handleProceedToPix = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount < 1) {
      setErrorMsg('Escolha um valor rápido ou informe um valor mínimo de R$ 1,00.');
      return;
    }
    setErrorMsg('');
    setStep('pix');
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCompletePix = () => {
    onConfirmSupport(panel.id, finalAmount, supporterName.trim() || 'Apoiador Anônimo');
    setStep('done');
  };

  const coverImg = panel.images?.[0] || panel.imageUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs dark:bg-black/80"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="noir-scroll relative max-h-[92vh] w-full max-w-[600px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:rounded-[6px] dark:border-[#2c405e] dark:bg-[#0d1421] dark:shadow-[0_28px_70px_rgba(0,0,0,0.85)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal de apoio"
          className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:rounded-[4px] dark:hover:bg-[#172236] dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'select' && (
          <form onSubmit={handleProceedToPix} className="space-y-5">
            <div className="pr-10">
              <div className="flex items-center gap-2.5">
                <Heart className="h-6 w-6 shrink-0 text-blue-600 dark:text-[#73a9e6]" />
                <h2
                  id="support-modal-title"
                  className="font-display text-2xl font-bold tracking-wide text-slate-900 uppercase sm:text-3xl dark:tracking-[0.08em] dark:text-slate-100"
                >
                  Apoiar esta atualização
                </h2>
              </div>
              <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Seu apoio mantém o desenvolvimento vivo. Cada impulso acelera novas entregas do projeto.
              </p>
            </div>

            {/* Panel Preview Card inside Support Modal */}
            <div className="flex flex-col gap-3.5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3.5 sm:flex-row sm:items-center dark:border-[#223147] dark:bg-[#080c14]">
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-md bg-slate-950 sm:h-28 sm:w-44">
                <img
                  src={coverImg}
                  alt={panel.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-display text-xs font-bold tracking-[0.12em] text-blue-600 uppercase dark:text-[#7db3ed]">
                  {panel.headerLabel}
                </span>
                <h3 className="mt-0.5 font-display text-xl font-bold text-slate-900 uppercase dark:text-white">
                  {panel.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {panel.shortDescription}
                </p>
              </div>
            </div>

            {/* Quick Value Buttons */}
            <div>
              <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Escolha um valor para impulsionar
              </span>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {presetValues.map((val) => {
                  const isActive = customValue.trim() === '' && selectedPreset === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(val);
                        setCustomValue('');
                        setErrorMsg('');
                      }}
                      className={`rounded-lg border py-3.5 font-display text-xl font-bold tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] ${
                        isActive
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm dark:border-[#74a9e8] dark:bg-[#2a4a73]'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-400 hover:bg-blue-50/70 dark:border-[#273852] dark:bg-[#111928] dark:text-slate-200 dark:hover:border-[#476894] dark:hover:bg-[#162236]'
                      }`}
                    >
                      R$ {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Value + Supporter Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="custom-support-value"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Outro valor (R$)
                </label>
                <input
                  id="custom-support-value"
                  type="number"
                  min="1"
                  step="0.50"
                  placeholder="Digite o valor"
                  value={customValue}
                  onChange={(e) => {
                    setCustomValue(e.target.value);
                    setErrorMsg('');
                  }}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-mono text-base tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#26364f] dark:bg-[#090e17] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#5a92cf]"
                />
              </div>

              <div>
                <label
                  htmlFor="supporter-name"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Seu nome no mural
                </label>
                <input
                  id="supporter-name"
                  type="text"
                  maxLength={32}
                  placeholder="Ex: Bruce W."
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#223147] dark:bg-[#090e17] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#5a92cf]"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400" role="alert">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2c4e78] dark:font-display dark:text-lg dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#386399]"
            >
              <span>Dar Impulso</span>
              <ArrowUp className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-4 text-sm font-medium text-slate-600 dark:border-[#1c283b] dark:text-slate-300">
              <Users className="h-4 w-4 text-blue-600 dark:text-[#7db3ed]" />
              <span className="tabular-nums">
                {panel.supportCount} pessoas já apoiaram esta atualização.
              </span>
            </div>
          </form>
        )}

        {step === 'pix' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('select')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Alterar valor</span>
            </button>

            <div className="flex items-center gap-2.5">
              <QrCode className="h-6 w-6 text-blue-600 dark:text-[#73a9e6]" />
              <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900 uppercase dark:text-slate-100">
                Pagamento via PIX
              </h2>
            </div>

            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Escaneie o QR Code abaixo ou copie o código PIX para concluir seu impulso de{' '}
              <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                R$ {finalAmount.toFixed(2).replace('.', ',')}
              </strong>
              .
            </p>

            {/* Scannable-style SVG QR Code */}
            <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-5 dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#080c14]">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
                <svg
                  viewBox="0 0 21 21"
                  className="h-48 w-48"
                  shapeRendering="crispEdges"
                  aria-label="QR Code PIX simulado"
                >
                  <rect width="21" height="21" fill="#ffffff" />
                  {qrCells.map((row, r) =>
                    row.map((filled, c) =>
                      filled ? (
                        <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0a0e17" />
                      ) : null
                    )
                  )}
                </svg>
              </div>
              <span className="mt-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                Recebedor: Dark Knight PSX Studio
              </span>
            </div>

            {/* PIX Copia e Cola */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                PIX Copia e Cola
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixPayload}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-700 focus:outline-none dark:rounded-[4px] dark:border-[#24344d] dark:bg-[#080c14] dark:text-slate-300"
                />
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:rounded-[4px] dark:border-[#3a557c] dark:bg-[#16243a] dark:text-slate-100 dark:hover:bg-[#1e3150]"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompletePix}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2c4e78] dark:font-display dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#386399]"
            >
              <Check className="h-5 w-5" />
              <span>Confirmar Pagamento PIX</span>
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:rounded-[6px] dark:border-[#4f87c4]/60 dark:bg-[#182c47] dark:text-[#7db3ed]">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-wide text-slate-900 uppercase dark:tracking-[0.1em] dark:text-white">
              Impulso Registrado
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Obrigado pelo apoio de{' '}
              <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                R$ {finalAmount.toFixed(2).replace('.', ',')}
              </span>{' '}
              em <strong className="text-slate-900 dark:text-slate-100">{panel.title}</strong>!
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Agora {panel.supportCount} pessoas já apoiaram esta atualização.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 dark:rounded-[4px] dark:border dark:border-[#4f87c4]/60 dark:bg-[#243f63] dark:font-display dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#315585]"
            >
              Voltar para a plataforma
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
