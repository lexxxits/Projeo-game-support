import React, { useEffect, useRef, useState } from 'react';
import { Globe, Heart, Maximize2, Minimize2, Settings2 } from 'lucide-react';
import { GameConfig } from '../types/platform';
import { BatEmblem } from './BatEmblem';

interface GameViewportProps {
  gameConfig: GameConfig;
  onOpenWebViewConfig: () => void;
  onToggleSourceMode: () => void;
}

export const GameViewport: React.FC<GameViewportProps> = ({
  gameConfig,
  onOpenWebViewConfig,
  onToggleSourceMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Sync native fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = async () => {
    if (cssFullscreen) {
      setCssFullscreen(false);
      return;
    }
    if (!document.fullscreenElement && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
      } catch {
        // Graceful fallback inside sandboxed iframes
        setCssFullscreen(true);
      }
    } else if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setCssFullscreen(false);
      }
    }
  };

  // Interactive PSX Gotham Night 2 procedural canvas when using built-in PSX preview
  useEffect(() => {
    if (gameConfig.useExternalIframe) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const width = 960;
    const height = 540;
    canvas.width = width;
    canvas.height = height;

    const raindrops = Array.from({ length: 130 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 10 + Math.random() * 18,
      speed: 8 + Math.random() * 9,
      alpha: 0.14 + Math.random() * 0.25,
    }));

    const buildings = [
      { x: 0, w: 68, h: 250 },
      { x: 64, w: 54, h: 310 },
      { x: 114, w: 72, h: 210 },
      { x: 182, w: 58, h: 280 },
      { x: 236, w: 64, h: 335 },
      { x: 298, w: 50, h: 195 },
      { x: 344, w: 76, h: 240 },
      { x: 422, w: 56, h: 215 },
      { x: 520, w: 72, h: 245 },
      { x: 588, w: 56, h: 315 },
      { x: 640, w: 64, h: 270 },
      { x: 700, w: 78, h: 350 },
      { x: 774, w: 58, h: 265 },
      { x: 828, w: 66, h: 300 },
      { x: 890, w: 70, h: 235 },
    ];

    const windows = buildings.flatMap((b) => {
      const wins: { x: number; y: number; lit: boolean }[] = [];
      for (let wy = height - b.h + 18; wy < height - 110; wy += 18) {
        for (let wx = b.x + 10; wx < b.x + b.w - 14; wx += 14) {
          wins.push({ x: wx, y: wy, lit: (wx * 7 + wy * 13) % 5 === 0 });
        }
      }
      return wins;
    });

    const render = () => {
      const px = pointerOffset.x * 14;
      const py = pointerOffset.y * 8;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#070b12');
      sky.addColorStop(0.45, '#121d2e');
      sky.addColorStop(1, '#090e18');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      // Moonlit mist & Bat-Signal beam
      const signalX = 485 + px * 0.4;
      const signalY = 178 + py * 0.4;
      const mist = ctx.createRadialGradient(signalX, signalY, 20, signalX, signalY, 260);
      mist.addColorStop(0, 'rgba(148, 178, 218, 0.36)');
      mist.addColorStop(0.45, 'rgba(71, 101, 142, 0.14)');
      mist.addColorStop(1, 'rgba(10, 14, 23, 0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, width, height);

      // Searchlight cone from rooftop
      ctx.beginPath();
      ctx.moveTo(640 + px * 0.5, height - 90);
      ctx.lineTo(signalX - 58, signalY - 22);
      ctx.lineTo(signalX + 62, signalY + 25);
      ctx.closePath();
      const beamGrad = ctx.createLinearGradient(640, height - 90, signalX, signalY);
      beamGrad.addColorStop(0, 'rgba(165, 198, 238, 0.04)');
      beamGrad.addColorStop(1, 'rgba(190, 218, 250, 0.14)');
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // Bat-signal crest in clouds
      ctx.save();
      ctx.translate(signalX, signalY);
      ctx.fillStyle = 'rgba(11, 16, 26, 0.72)';
      ctx.beginPath();
      ctx.moveTo(0, 19);
      ctx.bezierCurveTo(-4, 11, -11, 8, -19, 12);
      ctx.bezierCurveTo(-21, 5, -26, 1, -34, 0);
      ctx.bezierCurveTo(-30, -9, -20, -14, -10, -13);
      ctx.lineTo(-6, -7);
      ctx.lineTo(-3, -15);
      ctx.lineTo(0, -9);
      ctx.lineTo(3, -15);
      ctx.lineTo(6, -7);
      ctx.lineTo(10, -13);
      ctx.bezierCurveTo(20, -14, 30, -9, 34, 0);
      ctx.bezierCurveTo(26, 1, 21, 5, 19, 12);
      ctx.bezierCurveTo(11, 8, 4, 11, 0, 19);
      ctx.fill();
      ctx.restore();

      // Gotham Skyline
      buildings.forEach((b) => {
        ctx.fillStyle = '#0c1320';
        ctx.fillRect(b.x + px * 0.7, height - b.h + py * 0.4, b.w, b.h);
        ctx.strokeStyle = '#1b283d';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x + px * 0.7, height - b.h + py * 0.4, b.w, b.h);
      });

      // Lit building windows
      windows.forEach((w) => {
        if (!w.lit) return;
        ctx.fillStyle = 'rgba(128, 166, 214, 0.25)';
        ctx.fillRect(w.x + px * 0.7, w.y + py * 0.4, 5, 8);
      });

      // Foreground rooftop parapet
      ctx.fillStyle = '#101724';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - 102);
      ctx.lineTo(360 + px * 1.1, height - 102);
      ctx.lineTo(525 + px * 1.1, height);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#2c3d58';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stone blocks on parapet
      ctx.strokeStyle = '#1d293b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(120 + px * 1.1, height - 102, 118, 42);
      ctx.strokeRect(238 + px * 1.1, height - 102, 116, 42);

      // PSX Low-Poly Batman silhouette overlooking Gotham
      const bx = 212 + px * 1.25;
      const by = height - 295 + py * 0.5;
      ctx.save();
      ctx.translate(bx, by);
      // Flowing PSX Cape
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.moveTo(-12, 34);
      ctx.lineTo(-76, 175);
      ctx.lineTo(-34, 192);
      ctx.lineTo(-8, 172);
      ctx.lineTo(14, 188);
      ctx.lineTo(30, 145);
      ctx.lineTo(22, 34);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#26364d';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Torso & armored shoulder
      ctx.fillStyle = '#172133';
      ctx.beginPath();
      ctx.moveTo(-14, 34);
      ctx.lineTo(24, 34);
      ctx.lineTo(18, 108);
      ctx.lineTo(-10, 108);
      ctx.closePath();
      ctx.fill();

      // Utility belt
      ctx.fillStyle = '#8b6f2b';
      ctx.fillRect(-10, 96, 28, 7);

      // Cowl & ears
      ctx.fillStyle = '#0d1421';
      ctx.beginPath();
      ctx.moveTo(-10, 34);
      ctx.lineTo(-10, 12);
      ctx.lineTo(-12, -4);
      ctx.lineTo(-4, 8);
      ctx.lineTo(8, 8);
      ctx.lineTo(13, -5);
      ctx.lineTo(16, 14);
      ctx.lineTo(15, 34);
      ctx.closePath();
      ctx.fill();

      // Rim light on shoulder & cowl
      ctx.strokeStyle = 'rgba(130, 175, 228, 0.48)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(13, -5);
      ctx.lineTo(16, 14);
      ctx.lineTo(24, 34);
      ctx.lineTo(20, 82);
      ctx.stroke();
      ctx.restore();

      // Atmospheric Rain
      ctx.lineWidth = 1;
      raindrops.forEach((r) => {
        r.y += r.speed;
        r.x -= r.speed * 0.16;
        if (r.y > height) {
          r.y = -20;
          r.x = Math.random() * (width + 80);
        }
        ctx.strokeStyle = `rgba(180, 205, 235, ${r.alpha})`;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - r.len * 0.16, r.y + r.len);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameConfig.useExternalIframe, pointerOffset]);

  const activeContainerClasses = cssFullscreen
    ? 'fixed inset-0 z-50 bg-[#070a11]'
    : 'relative w-full overflow-hidden rounded-xl border border-slate-200 bg-[#090d16] shadow-md aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[640px] dark:rounded-[6px] dark:border-[#223147] dark:shadow-[0_24px_60px_rgba(0,0,0,0.65)]';

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        if (gameConfig.useExternalIframe) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        setPointerOffset({ x: nx, y: ny });
      }}
      onMouseLeave={() => setPointerOffset({ x: 0, y: 0 })}
      className={activeContainerClasses}
    >
      {gameConfig.useExternalIframe && gameConfig.iframeUrl ? (
        <div className="relative h-full w-full bg-[#070a11]">
          <iframe
            src={gameConfig.iframeUrl}
            title="Dark Knight PSX WebView"
            className="h-full w-full border-0"
            allow="fullscreen; gamepad; autoplay"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
          />
          {!iframeLoaded && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[#090d16]/85 px-6 text-center">
              <p className="font-display text-lg tracking-wider text-slate-200 uppercase">
                Conectando ao WebView: {gameConfig.iframeUrl}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Caso o domínio bloqueie iframe ou esteja offline, alterne para o Preview PSX Integrado.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-full w-full select-none">
          <canvas
            ref={canvasRef}
            className="h-full w-full object-cover"
            aria-label="Preview interativo de Dark Knight PSX — Gotham City Night 2"
          />
          {/* Subtle PSX CRT Scanlines */}
          <div className="psx-scanlines absolute inset-0 opacity-45" />

          {/* PSX In-Game HUD matching reference screenshot */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
            {/* Top HUD row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 rounded-[4px] border border-[#2a3b54]/80 bg-[#0b111c]/80 px-3 py-2 backdrop-blur-xs">
                <BatEmblem className="h-7 w-6 shrink-0" />
                <div className="leading-tight">
                  <div className="font-display text-xs font-semibold tracking-[0.14em] text-slate-200 uppercase sm:text-sm">
                    GOTHAM CITY
                  </div>
                  <div className="font-display text-[11px] tracking-[0.16em] text-slate-400 uppercase">
                    NIGHT 2
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 rounded-[4px] border border-[#2a3b54]/60 bg-[#0b111c]/70 px-3 py-2 backdrop-blur-xs">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs font-semibold tracking-[0.16em] text-slate-300 uppercase">
                    HEALTH
                  </span>
                  <Heart className="h-4 w-4 fill-slate-400/70 text-slate-300" />
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2.5 w-2.5 border border-[#3a4e6b] ${
                        idx < 8 ? 'bg-[#7b9cc6]' : 'bg-[#111926]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs font-medium tabular-nums text-slate-300">
                  08 / 10
                </span>
              </div>
            </div>

            {/* Bottom HUD row */}
            <div className="flex items-end justify-between gap-4">
              {/* Ammo octagon readout */}
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-[6px] border border-[#354b6a] bg-[#0b111d]/85 shadow-inner">
                  <span className="font-display text-[10px] tracking-[0.18em] text-slate-400 uppercase">
                    AMMO
                  </span>
                  <span className="font-display text-2xl font-bold tabular-nums leading-none text-slate-100">
                    16
                  </span>
                </div>
              </div>

              {/* Mini Radar Map + space for controls */}
              <div className="mr-12 hidden items-end gap-3 sm:flex">
                <div className="relative h-20 w-24 overflow-hidden rounded-[4px] border border-[#354b6a] bg-[#0b111d]/85 p-1.5">
                  <svg viewBox="0 0 100 80" className="h-full w-full opacity-75">
                    <path
                      d="M5 20 L40 15 L65 35 L95 25 M20 5 L30 75 M55 10 L50 75 M10 55 L90 60"
                      stroke="#394d6b"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <polygon points="50,34 44,48 56,48" fill="#cbd5e1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-left unobtrusive WebView switcher */}
      <div className="absolute bottom-3 left-24 z-20 flex items-center gap-2 sm:left-28">
        <button
          type="button"
          onClick={onToggleSourceMode}
          title={
            gameConfig.useExternalIframe
              ? 'Voltar ao Preview PSX Integrado'
              : `Carregar WebView configurado (${gameConfig.iframeUrl})`
          }
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#2a3b54] bg-[#0b111c]/90 px-2.5 py-1.5 font-display text-[11px] font-medium tracking-[0.12em] text-slate-300 uppercase transition-colors hover:border-[#4f87c4] hover:text-white"
        >
          <Globe className="h-3.5 w-3.5 text-[#5b92cf]" />
          <span>{gameConfig.useExternalIframe ? 'Iframe Ativo' : 'Abrir WebView'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenWebViewConfig}
          title="Configurar URL do WebView (Vercel)"
          aria-label="Configurar URL do WebView"
          className="inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#2a3b54] bg-[#0b111c]/90 text-slate-300 transition-colors hover:border-[#4f87c4] hover:text-white"
        >
          <Settings2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Bottom-right Fullscreen Button matching reference icon */}
      <button
        type="button"
        onClick={handleToggleFullscreen}
        aria-label={isFullscreen || cssFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        title={isFullscreen || cssFullscreen ? 'Sair da tela cheia' : 'Expandir tela cheia'}
        className="absolute right-3 bottom-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#344966] bg-[#0b111c]/90 text-slate-200 transition-colors duration-150 hover:border-[#5b92cf] hover:bg-[#142034] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f87c4]"
      >
        {isFullscreen || cssFullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
