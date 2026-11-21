import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

dotenv.config();

interface SyncedPanelMeta {
  id: string;
  version: string;
  headerLabel: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
}

const PORT = Number(process.env.PORT) || 3000;
const STORE_DIR = path.resolve(process.cwd(), '.dkpsx-store');
const MEDIA_DIR = path.join(STORE_DIR, 'media');
const PANELS_FILE = path.join(STORE_DIR, 'panels.json');

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

const DEFAULT_META_PANELS: SyncedPanelMeta[] = [
  {
    id: 'upd-1-3',
    version: '1.3',
    headerLabel: 'ATUALIZAÇÃO 1.3',
    title: 'RUAS DAS ÁGUAS',
    shortDescription: 'Novos cenários, mais detalhes e clima dinâmico.',
    imageUrl: '',
  },
  {
    id: 'upd-1-2',
    version: '1.2',
    headerLabel: 'ATUALIZAÇÃO 1.2',
    title: 'CHUVA EM GOTHAM',
    shortDescription: 'Partículas de chuva PSX, neblina densa e faróis dinâmicos.',
    imageUrl: '',
  },
  {
    id: 'upd-1-1',
    version: '1.1',
    headerLabel: 'ATUALIZAÇÃO 1.1',
    title: 'NOVO INIMIGO',
    shortDescription: 'Novo arquétipo de chefe tático com rotina de patrulha.',
    imageUrl: '',
  },
  {
    id: 'upd-1-0',
    version: '1.0',
    headerLabel: 'ATUALIZAÇÃO 1.0',
    title: 'PRIMEIRO BUILD',
    shortDescription: 'Ponte de Gotham, física da capa e movimentação básica.',
    imageUrl: '',
  },
  {
    id: 'upd-0-9',
    version: '0.9',
    headerLabel: 'ATUALIZAÇÃO 0.9',
    title: 'TESTES DE ILUMINAÇÃO',
    shortDescription: 'Dithering PS1, vertex jitter e sombras de gárgulas.',
    imageUrl: '',
  },
];

function readPanelsStore(): SyncedPanelMeta[] {
  try {
    if (!fs.existsSync(PANELS_FILE)) {
      return DEFAULT_META_PANELS;
    }
    const raw = fs.readFileSync(PANELS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as SyncedPanelMeta[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_META_PANELS;
  } catch {
    return DEFAULT_META_PANELS;
  }
}

function writePanelsStore(panels: SyncedPanelMeta[]): void {
  try {
    fs.writeFileSync(PANELS_FILE, JSON.stringify(panels, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Erro ao gravar panels.json:', err);
  }
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildFallbackOgSvg(title: string, subtitle: string): string {
  const safeTitle = escapeHtmlAttr(title || 'Dark Knight PSX');
  const safeSub = escapeHtmlAttr(subtitle || 'Atualização do Projeto');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e3a8a"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="60" y="60" width="1080" height="510" rx="16" fill="none" stroke="#60a5fa" stroke-opacity="0.35" stroke-width="2"/>
    <text x="110" y="210" fill="#93c5fd" font-family="sans-serif" font-size="34" font-weight="700" letter-spacing="4">DARK KNIGHT PSX</text>
    <text x="110" y="310" fill="#ffffff" font-family="sans-serif" font-size="68" font-weight="800">${safeTitle}</text>
    <text x="110" y="385" fill="#cbd5e1" font-family="sans-serif" font-size="32">${safeSub}</text>
  </svg>`;
}

function injectOpenGraphTags(
  html: string,
  panel: SyncedPanelMeta | undefined,
  origin: string,
  fullUrl: string
): string {
  if (!panel) return html;

  const title = `${panel.headerLabel ? `${panel.headerLabel} — ` : ''}${panel.title} | Dark Knight PSX`;
  const description = panel.shortDescription || 'Confira esta atualização em Dark Knight PSX.';
  const image = `${origin}/api/media/${encodeURIComponent(panel.id)}`;

  const safeTitle = escapeHtmlAttr(title);
  const safeDesc = escapeHtmlAttr(description);
  const safeImg = escapeHtmlAttr(image);
  const safeUrl = escapeHtmlAttr(fullUrl);

  let out = html
    .replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${safeDesc}" />`
    );

  const extraTags = `
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImg}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImg}" />`;

  return out.replace('</head>', `${extraTags}\n  </head>`);
}

async function startServer() {
  const app = express();
  app.set('trust proxy', true);

  // Serve uploaded video/image files with proper Range support for HTML5 <video>
  app.use('/api/uploads', express.static(MEDIA_DIR));

  // Sync panel metadata from client so Open Graph tags work for newly created/edited panels
  app.post('/api/panels/sync', express.json({ limit: '15mb' }), (req, res) => {
    const incoming = req.body?.panels;
    if (!Array.isArray(incoming)) {
      res.status(400).json({ error: 'Invalid panels payload' });
      return;
    }

    const sanitized: SyncedPanelMeta[] = incoming.map((p: Record<string, unknown>) => ({
      id: String(p.id ?? ''),
      version: String(p.version ?? '1.0'),
      headerLabel: String(p.headerLabel ?? ''),
      title: String(p.title ?? 'Atualização'),
      shortDescription: String(p.shortDescription ?? ''),
      imageUrl: String(p.imageUrl ?? ''),
    }));

    writePanelsStore(sanitized);
    res.json({ ok: true, count: sanitized.length });
  });

  // Upload video binary (mp4, webm, ogg)
  app.post(
    '/api/upload-video',
    express.raw({ type: ['video/*', 'application/octet-stream'], limit: '35mb' }),
    (req, res) => {
      const contentType = String(req.headers['content-type'] || 'video/mp4');
      let ext = 'mp4';
      if (contentType.includes('webm')) ext = 'webm';
      else if (contentType.includes('ogg')) ext = 'ogg';
      else if (contentType.includes('quicktime')) ext = 'mov';

      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        res.status(400).json({ error: 'Arquivo de vídeo vazio.' });
        return;
      }

      const fileName = `vid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const targetPath = path.join(MEDIA_DIR, fileName);
      fs.writeFileSync(targetPath, req.body);

      res.json({ url: `/api/uploads/${fileName}` });
    }
  );

  // Serve panel cover image over HTTP so og:image works on WhatsApp / Twitter / Instagram
  app.get('/api/media/:panelId', (req, res) => {
    const panelId = req.params.panelId;
    const panels = readPanelsStore();
    const panel = panels.find((p) => p.id === panelId);

    if (panel?.imageUrl) {
      if (panel.imageUrl.startsWith('data:image/svg+xml')) {
        const commaIdx = panel.imageUrl.indexOf(',');
        if (commaIdx !== -1) {
          const svgRaw = decodeURIComponent(panel.imageUrl.slice(commaIdx + 1));
          res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=300');
          res.send(svgRaw);
          return;
        }
      }

      const match = panel.imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (match) {
        const mime = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        res.setHeader('Content-Type', mime);
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.send(buffer);
        return;
      }
    }

    const svg = buildFallbackOgSvg(
      panel?.title || 'Dark Knight PSX',
      panel?.shortDescription || 'Plataforma de apresentação e apoio'
    );
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.send(svg);
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use(async (req, res, next) => {
      if (req.method !== 'GET') {
        next();
        return;
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        const panelIdParam =
          typeof req.query.painel === 'string'
            ? req.query.painel
            : req.path.startsWith('/painel/')
              ? req.path.replace('/painel/', '')
              : '';

        if (panelIdParam) {
          const panels = readPanelsStore();
          const panel = panels.find((p) => p.id === panelIdParam);
          const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
          const host = req.headers['x-forwarded-host'] || req.get('host') || `localhost:${PORT}`;
          const origin = `${protocol}://${host}`;
          template = injectOpenGraphTags(template, panel, origin, `${origin}${url}`);
        }

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir, { index: false }));

    app.get('*', (req, res) => {
      let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
      const panelIdParam =
        typeof req.query.painel === 'string'
          ? req.query.painel
          : req.path.startsWith('/painel/')
            ? req.path.replace('/painel/', '')
            : '';

      if (panelIdParam) {
        const panels = readPanelsStore();
        const panel = panels.find((p) => p.id === panelIdParam);
        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.get('host') || `localhost:${PORT}`;
        const origin = `${protocol}://${host}`;
        html = injectOpenGraphTags(html, panel, origin, `${origin}${req.originalUrl}`);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dark Knight PSX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
