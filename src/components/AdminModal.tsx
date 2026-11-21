import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Film,
  Globe,
  LogOut,
  Pencil,
  Plus,
  Share2,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { GameConfig, ImplementationItem, UpdatePanel } from '../types/platform';
import { compressUploadedImage, DEFAULT_ARTWORKS } from '../utils/psxArtwork';
import { getPanelShareUrl, uploadVideoFile } from '../utils/shareUtils';

export type AdminTab = 'editor' | 'list' | 'webview';

interface AdminModalProps {
  initialTab?: AdminTab;
  initialEditPanel?: UpdatePanel | null;
  panels: UpdatePanel[];
  gameConfig: GameConfig;
  onSavePanel: (panel: UpdatePanel) => void;
  onDeletePanel: (id: string) => void;
  onMovePanel: (id: string, direction: 'up' | 'down') => void;
  onSaveGameConfig: (config: GameConfig) => void;
  onLogoutCreator?: () => void;
  onClose: () => void;
}

const ARTWORK_PRESETS = [
  { label: 'Ruas das Águas', url: DEFAULT_ARTWORKS.ruaDasAguas },
  { label: 'Chuva em Gotham', url: DEFAULT_ARTWORKS.chuvaGotham },
  { label: 'Novo Inimigo', url: DEFAULT_ARTWORKS.novoInimigo },
  { label: 'Primeiro Build', url: DEFAULT_ARTWORKS.primeiroBuild },
  { label: 'Gárgula & Luz', url: DEFAULT_ARTWORKS.testesIluminacao },
];

function createEmptyPanel(nextOrder: number): UpdatePanel {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return {
    id: `upd-${Date.now()}`,
    version: '1.4',
    headerLabel: 'ATUALIZAÇÃO 1.4',
    title: '',
    subtitle: 'NOVO CONTEÚDO',
    category: 'AMBIENTES',
    shortDescription: '',
    fullDescription: '',
    date: `${dd}/${mm}/${yyyy}`,
    imageUrl: DEFAULT_ARTWORKS.ruaDasAguas,
    images: [DEFAULT_ARTWORKS.ruaDasAguas],
    videoUrl: '',
    implementations: [],
    mediaTypeLabel: 'IMAGEM',
    supportCount: 0,
    totalRaised: 0,
    goalAmount: 1000,
    views: 1,
    likes: 0,
    likedByMe: false,
    sponsors: ['Criador'],
    supportValues: [5, 10, 25, 50],
    order: nextOrder,
  };
}

export const AdminModal: React.FC<AdminModalProps> = ({
  initialTab = 'editor',
  initialEditPanel = null,
  panels,
  gameConfig,
  onSavePanel,
  onDeletePanel,
  onMovePanel,
  onSaveGameConfig,
  onLogoutCreator,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [editingId, setEditingId] = useState<string | null>(initialEditPanel?.id ?? null);
  const [form, setForm] = useState<UpdatePanel>(() => {
    if (!initialEditPanel) return createEmptyPanel(panels.length + 1);
    const imgs =
      initialEditPanel.images && initialEditPanel.images.length > 0
        ? initialEditPanel.images
        : [initialEditPanel.imageUrl];
    return {
      ...initialEditPanel,
      images: imgs,
      imageUrl: imgs[0],
      videoUrl: initialEditPanel.videoUrl ?? '',
      implementations: initialEditPanel.implementations ?? [],
    };
  });

  const [customSupportInput, setCustomSupportInput] = useState<string>(() =>
    (initialEditPanel?.supportValues ?? [5, 10, 25, 50]).join(', ')
  );
  const [useDefaultSupportValues, setUseDefaultSupportValues] = useState<boolean>(() => {
    const vals = initialEditPanel?.supportValues ?? [5, 10, 25, 50];
    return vals.join(',') === '5,10,25,50';
  });

  const [newImplText, setNewImplText] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [iframeUrl, setIframeUrl] = useState(gameConfig.iframeUrl);
  const [useExternalIframe, setUseExternalIframe] = useState(gameConfig.useExternalIframe);

  const startNewPanel = () => {
    const empty = createEmptyPanel(panels.length + 1);
    setEditingId(null);
    setForm(empty);
    setUseDefaultSupportValues(true);
    setCustomSupportInput('5, 10, 25, 50');
    setNewImplText('');
    setFeedbackMsg('');
    setActiveTab('editor');
  };

  const startEditPanel = (panel: UpdatePanel) => {
    const imgs = panel.images && panel.images.length > 0 ? panel.images : [panel.imageUrl];
    setEditingId(panel.id);
    setForm({
      ...panel,
      images: imgs,
      imageUrl: imgs[0],
      videoUrl: panel.videoUrl ?? '',
      implementations: panel.implementations ?? [],
    });
    const isDefault = panel.supportValues.join(',') === '5,10,25,50';
    setUseDefaultSupportValues(isDefault);
    setCustomSupportInput(panel.supportValues.join(', '));
    setNewImplText('');
    setFeedbackMsg('');
    setActiveTab('editor');
  };

  // Multi-photo upload handler
  const handleMultipleImagesChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImg(true);
    try {
      const processed: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressUploadedImage(files[i], 960, 0.82);
        processed.push(compressed);
      }
      setForm((prev) => {
        const current = prev.images && prev.images.length > 0 ? prev.images : [];
        const merged = [...current, ...processed];
        return {
          ...prev,
          images: merged,
          imageUrl: merged[0],
        };
      });
      setFeedbackMsg(`${processed.length} foto(s) adicionada(s) ao carrossel.`);
    } catch {
      setFeedbackMsg('Não foi possível processar uma ou mais imagens. Tente PNG ou JPG.');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleAddPresetPhoto = (url: string) => {
    setForm((prev) => {
      const current = prev.images ?? [];
      if (current.includes(url)) return prev;
      const merged = [...current, url];
      return {
        ...prev,
        images: merged,
        imageUrl: merged[0],
      };
    });
  };

  const handleSetCoverImage = (idx: number) => {
    setForm((prev) => {
      const imgs = [...(prev.images ?? [prev.imageUrl])];
      const [chosen] = imgs.splice(idx, 1);
      if (!chosen) return prev;
      const reordered = [chosen, ...imgs];
      return {
        ...prev,
        images: reordered,
        imageUrl: reordered[0],
      };
    });
  };

  const handleRemoveImage = (idx: number) => {
    setForm((prev) => {
      const imgs = [...(prev.images ?? [prev.imageUrl])];
      if (imgs.length <= 1) {
        setFeedbackMsg('O painel deve manter pelo menos 1 foto de capa.');
        return prev;
      }
      imgs.splice(idx, 1);
      return {
        ...prev,
        images: imgs,
        imageUrl: imgs[0],
      };
    });
  };

  // Video upload handler
  const handleVideoFileChange = async (file: File | undefined) => {
    if (!file) return;
    setUploadingVid(true);
    try {
      const videoUrl = await uploadVideoFile(file);
      setForm((prev) => ({ ...prev, videoUrl }));
      setFeedbackMsg('Vídeo enviado e anexado ao painel.');
    } catch {
      setFeedbackMsg('Falha ao enviar o vídeo. Tente um arquivo MP4 ou WebM menor.');
    } finally {
      setUploadingVid(false);
    }
  };

  // Implementation checklist handlers
  const handleAddImplementation = () => {
    const trimmed = newImplText.trim();
    if (!trimmed) return;
    const newItem: ImplementationItem = {
      id: `impl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
      done: false,
    };
    setForm((prev) => ({
      ...prev,
      implementations: [...(prev.implementations ?? []), newItem],
    }));
    setNewImplText('');
  };

  const handleToggleImplDone = (id: string) => {
    setForm((prev) => ({
      ...prev,
      implementations: (prev.implementations ?? []).map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    }));
  };

  const handleRemoveImpl = (id: string) => {
    setForm((prev) => ({
      ...prev,
      implementations: (prev.implementations ?? []).filter((item) => item.id !== id),
    }));
  };

  const handleCopyShareLink = async (panelId: string) => {
    const url = getPanelShareUrl(panelId);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore clipboard errors
    }
    setCopiedId(panelId);
    setFeedbackMsg(`Link de compartilhamento copiado: ${url}`);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFeedbackMsg('Informe o título da atualização.');
      return;
    }

    let parsedSupportValues = [5, 10, 25, 50];
    if (!useDefaultSupportValues) {
      const nums = customSupportInput
        .split(',')
        .map((n) => Number(n.trim()))
        .filter((n) => Number.isFinite(n) && n >= 1)
        .slice(0, 4);
      if (nums.length > 0) {
        parsedSupportValues = nums;
      }
    }

    const versionClean = form.version.trim() || '1.4';
    const imgs = form.images && form.images.length > 0 ? form.images : [form.imageUrl];

    const panelToSave: UpdatePanel = {
      ...form,
      version: versionClean,
      headerLabel: form.headerLabel.trim() || `ATUALIZAÇÃO ${versionClean}`,
      title: form.title.trim().toUpperCase(),
      subtitle: form.subtitle.trim().toUpperCase(),
      category: form.category.trim().toUpperCase() || 'ATUALIZAÇÃO',
      shortDescription:
        form.shortDescription.trim() || 'Nova atualização adicionada ao projeto.',
      fullDescription:
        form.fullDescription.trim() ||
        form.shortDescription.trim() ||
        'Detalhes completos da atualização.',
      images: imgs,
      imageUrl: imgs[0],
      videoUrl: form.videoUrl?.trim() || '',
      implementations: form.implementations ?? [],
      goalAmount: Math.max(50, Number(form.goalAmount) || 1000),
      supportValues: parsedSupportValues,
      order: Math.max(1, Number(form.order) || 1),
    };

    onSavePanel(panelToSave);
    setFeedbackMsg(
      editingId
        ? 'Painel atualizado e salvo na galeria!'
        : 'Novo painel criado e publicado na galeria!'
    );
    if (!editingId) {
      setEditingId(panelToSave.id);
    }
  };

  const handleSaveWebView = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGameConfig({
      iframeUrl: iframeUrl.trim() || 'https://dark-knight-psx.vercel.app',
      useExternalIframe,
    });
    setFeedbackMsg('Configuração do WebView salva e aplicada.');
  };

  const currentImages = form.images && form.images.length > 0 ? form.images : [form.imageUrl];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-3 backdrop-blur-xs sm:p-5 dark:bg-black/80"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[93vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:rounded-[6px] dark:border-[#2a3d5a] dark:bg-[#0b111c] dark:shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-[#1d2a3d] dark:bg-[#0e1523]">
          <div>
            <h2
              id="admin-modal-title"
              className="font-display text-xl font-bold tracking-wide text-slate-900 uppercase dark:tracking-[0.12em] dark:text-white"
            >
              Painel de Administração · Criador
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gerencie fotos em carrossel, vídeo, lista de implementações, compartilhamento e WebView.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onLogoutCreator && (
              <button
                type="button"
                onClick={onLogoutCreator}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-300 hover:text-rose-600 dark:rounded-[4px] dark:border-[#2a3b54] dark:bg-[#121a2a] dark:text-slate-300 dark:hover:border-rose-500/50 dark:hover:text-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar painel admin"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 dark:rounded-[4px] dark:hover:bg-[#192538] dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/70 px-5 pt-2.5 dark:border-[#1d2a3d] dark:bg-[#0c121e]">
          <button
            type="button"
            onClick={() => {
              setFeedbackMsg('');
              setActiveTab('editor');
            }}
            className={`whitespace-nowrap shrink-0 rounded-t-md border-b-2 px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors dark:font-display dark:text-sm ${
              activeTab === 'editor'
                ? 'border-blue-600 bg-white text-blue-600 dark:border-[#5a92cf] dark:bg-[#142033] dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {editingId ? 'Editar Painel' : 'Criar Novo Painel'}
          </button>

          <button
            type="button"
            onClick={() => {
              setFeedbackMsg('');
              setActiveTab('list');
            }}
            className={`whitespace-nowrap shrink-0 rounded-t-md border-b-2 px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors dark:font-display dark:text-sm ${
              activeTab === 'list'
                ? 'border-blue-600 bg-white text-blue-600 dark:border-[#5a92cf] dark:bg-[#142033] dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Painéis Existentes ({panels.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setFeedbackMsg('');
              setActiveTab('webview');
            }}
            className={`whitespace-nowrap shrink-0 rounded-t-md border-b-2 px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors dark:font-display dark:text-sm ${
              activeTab === 'webview'
                ? 'border-blue-600 bg-white text-blue-600 dark:border-[#5a92cf] dark:bg-[#142033] dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            WebView do Jogo
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="noir-scroll flex-1 overflow-y-auto p-5">
          {feedbackMsg && (
            <div className="mb-4 flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-medium text-blue-800 dark:rounded-[4px] dark:border-[#4f87c4]/50 dark:bg-[#15253d] dark:text-slate-100">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-blue-600 dark:text-[#7db3ed]" />
                <span className="break-all">{feedbackMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackMsg('')}
                className="ml-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {activeTab === 'editor' && (
            <form onSubmit={handleSaveEditor} className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Multi-Image Upload + Video Upload */}
              <div className="space-y-4 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 uppercase dark:font-display dark:tracking-[0.14em] dark:text-slate-300">
                    Fotos do Carrossel ({currentImages.length})
                  </span>
                  {editingId && (
                    <button
                      type="button"
                      onClick={startNewPanel}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-[#7db3ed]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Novo em branco</span>
                    </button>
                  )}
                </div>

                {/* Cover Preview */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-slate-200 bg-slate-900 dark:rounded-[4px] dark:border-[#2a3b54] dark:bg-[#070a11]">
                  <img
                    src={currentImages[0]}
                    alt="Capa do painel"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 left-2 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    Capa Principal
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <div className="font-display text-lg font-bold tracking-wider text-white uppercase">
                      {form.title || 'TÍTULO DA ATUALIZAÇÃO'}
                    </div>
                  </div>
                </div>

                {/* Multi-Photo Thumbnail Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {currentImages.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-[4/3] overflow-hidden rounded border ${
                        idx === 0
                          ? 'border-blue-600 ring-1 ring-blue-600/30'
                          : 'border-slate-200 dark:border-[#26364f]'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`Foto ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(idx)}
                            title="Definir como capa"
                            className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Remover foto"
                          className="inline-flex h-6 w-6 items-center justify-center rounded bg-rose-600 text-white hover:bg-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Multi-Image Upload Dropzone */}
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3.5 text-center transition-colors hover:border-blue-500 hover:bg-blue-50/40 dark:rounded-[4px] dark:border-[#344b6d] dark:bg-[#0e1523] dark:hover:border-[#5a92cf] dark:hover:bg-[#131d30]">
                  <Upload className="mb-1 h-5 w-5 text-blue-600 dark:text-[#6aa4e8]" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {uploadingImg ? 'Processando fotos...' : 'Adicionar Múltiplas Fotos (PNG, JPG, WEBP)'}
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Selecione uma ou várias imagens para o carrossel
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => handleMultipleImagesChange(e.target.files)}
                  />
                </label>

                {/* Preset Artwork Selector */}
                <div>
                  <span className="mb-1.5 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Adicionar arte pronta ao carrossel:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ARTWORK_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleAddPresetPhoto(preset.url)}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-700 dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#101826] dark:text-slate-300 dark:hover:text-white"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Video Upload Section */}
                <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3 dark:rounded-[4px] dark:border-[#202d42] dark:bg-[#0e1523]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <Film className="h-4 w-4 text-blue-600 dark:text-[#7db3ed]" />
                      <span>Vídeo do Painel (Opcional)</span>
                    </span>
                    {form.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, videoUrl: '' }))}
                        className="text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
                      >
                        Remover vídeo
                      </button>
                    )}
                  </div>

                  {form.videoUrl ? (
                    <video
                      src={form.videoUrl}
                      controls
                      playsInline
                      className="mt-2 aspect-[16/9] w-full rounded border border-slate-200 bg-black object-contain dark:border-[#26364f]"
                    />
                  ) : (
                    <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:border-blue-500 hover:text-blue-700 dark:border-[#324663] dark:bg-[#0a0f18] dark:text-slate-300">
                      <Upload className="h-4 w-4 text-blue-600 dark:text-[#7db3ed]" />
                      <span>{uploadingVid ? 'Enviando vídeo...' : 'Enviar Vídeo (MP4, WebM)'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        className="sr-only"
                        onChange={(e) => handleVideoFileChange(e.target.files?.[0])}
                      />
                    </label>
                  )}

                  <input
                    type="url"
                    value={form.videoUrl ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="Ou cole uma URL direta de vídeo (.mp4 / .webm)"
                    className="mt-2 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                  />
                </div>
              </div>

              {/* Right Column: Fields + Implementation Checklist + Share Link */}
              <div className="space-y-3.5 lg:col-span-7">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Versão
                    </label>
                    <input
                      type="text"
                      value={form.version}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          version: e.target.value,
                          headerLabel: `ATUALIZAÇÃO ${e.target.value}`,
                        }))
                      }
                      placeholder="1.4"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Data
                    </label>
                    <input
                      type="text"
                      value={form.date}
                      onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                      placeholder="24/05/2024"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Meta (R$)
                    </label>
                    <input
                      type="number"
                      min="50"
                      value={form.goalAmount}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, goalAmount: Number(e.target.value) || 1000 }))
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ordem
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.order}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, order: Number(e.target.value) || 1 }))
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Título da Atualização *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: ESGOTOS DE GOTHAM"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Categoria (Card)
                    </label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: AMBIENTES, CLIMA, INIMIGOS"
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Resumo Curto (Painel & Link Compartilhado)
                  </label>
                  <textarea
                    rows={2}
                    value={form.shortDescription}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, shortDescription: e.target.value }))
                    }
                    placeholder="Novos cenários, mais detalhes e clima dinâmico."
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Texto Descritivo Completo
                  </label>
                  <textarea
                    rows={2}
                    value={form.fullDescription}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullDescription: e.target.value }))
                    }
                    placeholder="Detalhes técnicos, melhorias de iluminação, física e notas de versão..."
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                  />
                </div>

                {/* Lista de Implementações Builder */}
                <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3 dark:rounded-[4px] dark:border-[#202d42] dark:bg-[#0e1523]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Lista de Implementações ({(form.implementations ?? []).length})
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Marque os itens já concluídos
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImplText}
                      onChange={(e) => setNewImplText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImplementation();
                        }
                      }}
                      placeholder="Ex: Novo sistema de partículas de neblina"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddImplementation}
                      className="inline-flex shrink-0 items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 dark:rounded-[4px] dark:bg-[#2a4970]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  {(form.implementations ?? []).length > 0 && (
                    <ul className="mt-2.5 max-h-36 space-y-1.5 overflow-y-auto pr-1">
                      {(form.implementations ?? []).map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs dark:border-[#223147] dark:bg-[#0a0f18]"
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleImplDone(item.id)}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                          >
                            <span
                              className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                item.done
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-slate-300 bg-white text-transparent dark:border-[#324663] dark:bg-[#0f1624]'
                              }`}
                            >
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="truncate text-slate-700 dark:text-slate-200">
                              {item.text}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImpl(item.id)}
                            aria-label="Remover item"
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Support Values Configuration */}
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:rounded-[4px] dark:border-[#202d42] dark:bg-[#0e1523]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Valores de Apoio (PIX)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUseDefaultSupportValues(true);
                          setCustomSupportInput('5, 10, 25, 50');
                        }}
                        className={`rounded px-2.5 py-1 text-xs font-medium ${
                          useDefaultSupportValues
                            ? 'bg-blue-600 text-white dark:bg-[#2a4970]'
                            : 'border border-slate-200 bg-white text-slate-600 dark:border-transparent dark:bg-[#131d2e] dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Padrão (5, 10, 25, 50)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseDefaultSupportValues(false)}
                        className={`rounded px-2.5 py-1 text-xs font-medium ${
                          !useDefaultSupportValues
                            ? 'bg-blue-600 text-white dark:bg-[#2a4970]'
                            : 'border border-slate-200 bg-white text-slate-600 dark:border-transparent dark:bg-[#131d2e] dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Personalizado
                      </button>
                    </div>
                  </div>
                  {!useDefaultSupportValues && (
                    <input
                      type="text"
                      value={customSupportInput}
                      onChange={(e) => setCustomSupportInput(e.target.value)}
                      placeholder="Ex: 10, 20, 40, 100"
                      className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#283a54] dark:bg-[#080c14] dark:text-white"
                    />
                  )}
                </div>

                {/* Form Actions + Copy Share Link Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(form.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:rounded-[4px] dark:border-[#2a3b54] dark:bg-[#111927] dark:text-slate-200"
                  >
                    {copiedId === form.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {copiedId === form.id
                        ? 'Link copiado!'
                        : 'Copiar link de compartilhamento'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:rounded-[4px] dark:border-[#283a54] dark:bg-[#101826] dark:text-slate-300 dark:hover:text-white"
                    >
                      Fechar
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2c4e78] dark:font-display dark:text-sm dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#386399]"
                    >
                      {editingId ? 'Salvar Alterações' : 'Publicar Painel'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reordene a exibição na galeria, copie o link de compartilhamento ou edite/exclua painéis.
                </p>
                <button
                  type="button"
                  onClick={startNewPanel}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 dark:rounded-[4px] dark:border dark:border-[#5483ba]/60 dark:bg-[#243f63] dark:hover:bg-[#2f5280]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Criar Novo</span>
                </button>
              </div>

              {panels.length === 0 ? (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-[#223147] dark:bg-[#0d1421] dark:text-slate-400">
                  Nenhum painel cadastrado ainda. Clique em "Criar Novo" para adicionar.
                </div>
              ) : (
                <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white dark:divide-[#1a2638] dark:rounded-[4px] dark:border-[#223147] dark:bg-[#0e1523]">
                  {panels.map((panel, index) => (
                    <div
                      key={panel.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-3 sm:flex-nowrap"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="w-6 shrink-0 text-center font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
                          #{index + 1}
                        </span>
                        <img
                          src={panel.images?.[0] || panel.imageUrl}
                          alt={panel.title}
                          referrerPolicy="no-referrer"
                          className="h-12 w-16 shrink-0 rounded border border-slate-200 object-cover dark:border-[#26364f]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-blue-600 dark:text-[#7db3ed]">
                              v{panel.version}
                            </span>
                            <span className="truncate font-display text-base font-bold tracking-wide text-slate-900 uppercase dark:text-white">
                              {panel.title}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{(panel.images ?? [panel.imageUrl]).length} foto(s)</span>
                            {panel.videoUrl && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>Com vídeo</span>
                              </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{(panel.implementations ?? []).length} itens</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono font-semibold tabular-nums text-blue-600 dark:text-[#7db3ed]">
                              R$ {panel.totalRaised}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyShareLink(panel.id)}
                          title="Copiar link de compartilhamento"
                          aria-label={`Copiar link de ${panel.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400 hover:text-blue-700 dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#111927] dark:text-slate-300 dark:hover:text-white"
                        >
                          {copiedId === panel.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => onMovePanel(panel.id, 'up')}
                          aria-label="Mover para cima"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400 hover:text-blue-700 disabled:opacity-30 dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#111927] dark:text-slate-300 dark:hover:text-white"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === panels.length - 1}
                          onClick={() => onMovePanel(panel.id, 'down')}
                          aria-label="Mover para baixo"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400 hover:text-blue-700 disabled:opacity-30 dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#111927] dark:text-slate-300 dark:hover:text-white"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditPanel(panel)}
                          className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:rounded-[4px] dark:border-[#2a3b54] dark:bg-[#131d2e] dark:text-slate-200 dark:hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Editar</span>
                        </button>

                        {confirmDeleteId === panel.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                onDeletePanel(panel.id);
                                setConfirmDeleteId(null);
                              }}
                              className="rounded bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded bg-slate-100 px-2 py-1.5 text-xs text-slate-600 dark:bg-[#1a2538] dark:text-slate-300"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(panel.id)}
                            aria-label={`Excluir ${panel.title}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:border-rose-300 hover:text-rose-600 dark:rounded-[4px] dark:border-[#2a3b54] dark:bg-[#131d2e] dark:hover:border-rose-500/60 dark:hover:text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'webview' && (
            <form onSubmit={handleSaveWebView} className="space-y-4">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:rounded-[4px] dark:border-[#223147] dark:bg-[#0e1523]">
                <div className="flex items-center gap-2.5">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-[#6aa4e8]" />
                  <h3 className="font-display text-lg font-bold tracking-wide text-slate-900 uppercase dark:tracking-[0.1em] dark:text-white">
                    Link do WebView / Build do Jogo
                  </h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Configure o subdomínio Vercel ou URL pública onde a build HTML5/WebGL do projeto está hospedada.
                </p>

                <div className="mt-4">
                  <label
                    htmlFor="webview-url-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    URL do Iframe (Ex: https://dark-knight-psx.vercel.app)
                  </label>
                  <input
                    id="webview-url-input"
                    type="url"
                    required
                    value={iframeUrl}
                    onChange={(e) => setIframeUrl(e.target.value)}
                    placeholder="https://dark-knight-psx.vercel.app"
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#26364f] dark:bg-[#080c14] dark:text-white"
                  />
                </div>

                <div className="mt-4">
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Modo de Exibição na Área Central
                  </span>
                  <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setUseExternalIframe(false)}
                      className={`rounded-md border p-3 text-left transition-colors dark:rounded-[4px] ${
                        !useExternalIframe
                          ? 'border-blue-600 bg-blue-50 text-slate-900 dark:border-[#5a92cf] dark:bg-[#16243a] dark:text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-[#233248] dark:bg-[#0b101b] dark:text-slate-300'
                      }`}
                    >
                      <div className="text-sm font-semibold">Preview PSX Integrado</div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Cena interativa em Canvas com HUD retrô (ideal para apresentação imediata).
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUseExternalIframe(true)}
                      className={`rounded-md border p-3 text-left transition-colors dark:rounded-[4px] ${
                        useExternalIframe
                          ? 'border-blue-600 bg-blue-50 text-slate-900 dark:border-[#5a92cf] dark:bg-[#16243a] dark:text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-[#233248] dark:bg-[#0b101b] dark:text-slate-300'
                      }`}
                    >
                      <div className="text-sm font-semibold">WebView Externo (Iframe)</div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Carrega diretamente o link configurado acima dentro da tela central.
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:rounded-[4px] dark:border-[#283a54] dark:bg-[#101826] dark:text-slate-300 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2c4e78] dark:font-display dark:text-sm dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#386399]"
                >
                  Salvar WebView
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
