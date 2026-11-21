import { UpdatePanel } from '../types/platform';

export function getPanelShareUrl(panelId: string): string {
  if (typeof window === 'undefined') return `/?painel=${encodeURIComponent(panelId)}`;
  return `${window.location.origin}/?painel=${encodeURIComponent(panelId)}`;
}

function setMetaContent(selector: string, attrName: 'property' | 'name', attrVal: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attrName, attrVal);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function applyClientOpenGraphTags(panel: UpdatePanel | null): void {
  if (typeof document === 'undefined') return;

  if (!panel) {
    document.title = 'Dark Knight PSX — Plataforma de Apresentação & Apoio';
    return;
  }

  const title = `${panel.headerLabel} — ${panel.title} | Dark Knight PSX`;
  const description = panel.shortDescription || 'Confira esta atualização do projeto Dark Knight PSX.';
  const url = getPanelShareUrl(panel.id);
  const ogImage = `${window.location.origin}/api/media/${encodeURIComponent(panel.id)}`;

  document.title = title;
  setMetaContent('meta[name="description"]', 'name', 'description', description);
  setMetaContent('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaContent('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaContent('meta[property="og:url"]', 'property', 'og:url', url);
  setMetaContent('meta[property="og:image"]', 'property', 'og:image', ogImage);
  setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaContent('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaContent('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
}

export async function syncPanelsWithServer(panels: UpdatePanel[]): Promise<void> {
  try {
    await fetch('/api/panels/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        panels: panels.map((p) => ({
          id: p.id,
          version: p.version,
          headerLabel: p.headerLabel,
          title: p.title,
          shortDescription: p.shortDescription,
          imageUrl: p.images?.[0] || p.imageUrl,
        })),
      }),
    });
  } catch {
    // Non-blocking fallback when offline
  }
}

export async function uploadVideoFile(file: File): Promise<string> {
  try {
    const res = await fetch('/api/upload-video', {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'video/mp4',
      },
      body: file,
    });
    if (!res.ok) {
      throw new Error('Falha no upload de vídeo');
    }
    const data = (await res.json()) as { url?: string };
    if (data.url) return data.url;
    throw new Error('URL de vídeo ausente');
  } catch {
    // Fallback local blob URL for current session if server unavailable
    return URL.createObjectURL(file);
  }
}
