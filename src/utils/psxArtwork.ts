// Procedural PSX Dark Noir artwork generator (zero external URLs, 100% deterministic SVG Data URIs)
// plus client-side image compression for Creator Panel uploads stored in localStorage.

function encodeSvg(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const DEFAULT_ARTWORKS = {
  ruaDasAguas: encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#070b12"/>
          <stop offset="55%" stop-color="#131e30"/>
          <stop offset="100%" stop-color="#0a0e17"/>
        </linearGradient>
        <linearGradient id="beam" x1="0.7" y1="0.18" x2="0.45" y2="0.95">
          <stop offset="0%" stop-color="#dbeafe" stop-opacity="0.52"/>
          <stop offset="50%" stop-color="#60a5fa" stop-opacity="0.14"/>
          <stop offset="100%" stop-color="#0a0e17" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="puddle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e2d44"/>
          <stop offset="100%" stop-color="#060910"/>
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#sky)"/>
      <!-- Distant Gotham buildings -->
      <path d="M0 320 L0 110 L65 110 L65 160 L110 160 L110 70 L185 70 L185 260 L230 260 L230 140 L310 140 L310 210 L370 210 L370 90 L460 90 L460 175 L520 175 L520 50 L640 50 L640 320 Z" fill="#0d1421"/>
      <!-- Alley perspective walls -->
      <polygon points="0,30 210,165 210,335 0,430" fill="#101827"/>
      <polygon points="640,20 420,160 420,335 640,440" fill="#0e1523"/>
      <!-- Elevated train bridge -->
      <rect x="170" y="190" width="290" height="26" fill="#080c14"/>
      <rect x="200" y="216" width="18" height="115" fill="#080c14"/>
      <rect x="405" y="216" width="18" height="115" fill="#080c14"/>
      <!-- Windows glow -->
      <g fill="#4c6b94" opacity="0.45">
        <rect x="42" y="130" width="14" height="22"/><rect x="42" y="170" width="14" height="22"/>
        <rect x="130" y="105" width="10" height="16"/><rect x="150" y="105" width="10" height="16"/>
        <rect x="545" y="120" width="16" height="24"/><rect x="575" y="120" width="16" height="24"/>
      </g>
      <!-- Wet street -->
      <polygon points="210,335 420,335 640,480 0,480" fill="url(#puddle)"/>
      <!-- Cobblestone reflections -->
      <g stroke="#7dd3fc" stroke-opacity="0.22" stroke-width="2">
        <line x1="255" y1="360" x2="365" y2="360"/>
        <line x1="220" y1="392" x2="400" y2="392"/>
        <line x1="190" y1="425" x2="430" y2="425"/>
        <line x1="275" y1="455" x2="385" y2="455"/>
      </g>
      <!-- Streetlamp & cone -->
      <line x1="478" y1="375" x2="478" y2="108" stroke="#1e293b" stroke-width="7"/>
      <path d="M478 108 Q455 98 442 114" fill="none" stroke="#334155" stroke-width="5"/>
      <polygon points="442,115 240,455 565,455" fill="url(#beam)"/>
      <circle cx="442" cy="116" r="8" fill="#f8fafc"/>
      <circle cx="442" cy="116" r="22" fill="#93c5fd" opacity="0.25"/>
      <!-- Rain streaks -->
      <g stroke="#94a3b8" stroke-opacity="0.25" stroke-width="1">
        <line x1="90" y1="20" x2="72" y2="110"/><line x1="180" y1="60" x2="160" y2="165"/>
        <line x1="310" y1="15" x2="292" y2="115"/><line x1="415" y1="45" x2="392" y2="155"/>
        <line x1="560" y1="35" x2="540" y2="135"/><line x1="240" y1="220" x2="218" y2="335"/>
      </g>
    </svg>
  `),

  chuvaGotham: encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="65%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#fog)"/>
      <rect x="0" y="45" width="145" height="330" fill="#182232"/>
      <rect x="465" y="30" width="175" height="345" fill="#141d2b"/>
      <rect x="190" y="95" width="230" height="230" fill="#233146" opacity="0.65"/>
      <!-- Street & curb -->
      <polygon points="145,325 465,325 640,480 0,480" fill="#0d1420"/>
      <!-- 90s Police/Noir Sedan PSX Low-Poly -->
      <polygon points="135,335 280,335 305,365 305,405 110,405 110,365" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <polygon points="155,338 265,338 280,362 140,362" fill="#334155"/>
      <rect x="122" y="374" width="22" height="10" fill="#fef08a" opacity="0.8"/>
      <rect x="272" y="374" width="22" height="10" fill="#fef08a" opacity="0.8"/>
      <circle cx="148" cy="406" r="18" fill="#090d16" stroke="#334155" stroke-width="4"/>
      <circle cx="272" cy="406" r="18" fill="#090d16" stroke="#334155" stroke-width="4"/>
      <!-- Headlight cones -->
      <polygon points="122,384 20,465 135,465" fill="#bae6fd" opacity="0.16"/>
      <polygon points="294,384 225,465 350,465" fill="#bae6fd" opacity="0.16"/>
      <!-- Heavy rain -->
      <g stroke="#cbd5e1" stroke-opacity="0.32" stroke-width="1.2">
        <line x1="60" y1="0" x2="30" y2="120"/><line x1="140" y1="40" x2="105" y2="180"/>
        <line x1="250" y1="10" x2="215" y2="160"/><line x1="360" y1="30" x2="320" y2="195"/>
        <line x1="480" y1="0" x2="445" y2="145"/><line x1="590" y1="50" x2="550" y2="210"/>
        <line x1="390" y1="220" x2="355" y2="365"/><line x1="510" y1="230" x2="475" y2="375"/>
      </g>
    </svg>
  `),

  novoInimigo: encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <radialGradient id="rim" cx="0.5" cy="0.38" r="0.55">
          <stop offset="0%" stop-color="#334e70"/>
          <stop offset="65%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#070a12"/>
        </radialGradient>
      </defs>
      <rect width="640" height="480" fill="url(#rim)"/>
      <!-- Low-poly PSX character bust -->
      <polygon points="180,480 230,330 410,330 460,480" fill="#131b29" stroke="#283852" stroke-width="2"/>
      <polygon points="270,330 370,330 350,415 290,415" fill="#1e293b"/>
      <!-- Neck & Jaw -->
      <polygon points="285,275 355,275 348,340 292,340" fill="#1f2937"/>
      <polygon points="245,140 395,140 405,240 355,295 285,295 235,240" fill="#2c3a4f" stroke="#475569" stroke-width="1.5"/>
      <!-- Cheekbone shadows -->
      <polygon points="245,185 288,200 285,295 235,240" fill="#162030"/>
      <polygon points="395,185 352,200 355,295 405,240" fill="#1a2538"/>
      <!-- Eyes -->
      <polygon points="262,190 302,196 296,208 266,205" fill="#090d14"/>
      <polygon points="378,190 338,196 344,208 374,205" fill="#090d14"/>
      <circle cx="284" cy="199" r="3" fill="#93c5fd"/>
      <circle cx="356" cy="199" r="3" fill="#93c5fd"/>
      <!-- Hair low-poly -->
      <polygon points="230,175 245,95 320,78 402,102 412,185 375,135 285,132" fill="#0c111b"/>
      <!-- Scar detail -->
      <line x1="358" y1="185" x2="368" y2="238" stroke="#64748b" stroke-width="2"/>
    </svg>
  `),

  primeiroBuild: encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="bSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b111d"/>
          <stop offset="65%" stop-color="#1e2d42"/>
          <stop offset="100%" stop-color="#090d16"/>
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#bSky)"/>
      <!-- Skyline silhouettes -->
      <path d="M0 320 L0 180 L70 180 L70 220 L140 220 L140 130 L210 130 L210 250 L390 250 L390 110 L470 110 L470 205 L560 205 L560 155 L640 155 L640 320 Z" fill="#0f1726"/>
      <!-- Gotham Suspension Bridge -->
      <rect x="0" y="295" width="640" height="22" fill="#070b12"/>
      <!-- Left Tower -->
      <rect x="155" y="95" width="18" height="220" fill="#0a0f18"/>
      <rect x="195" y="95" width="18" height="220" fill="#0a0f18"/>
      <rect x="150" y="130" width="68" height="14" fill="#0a0f18"/>
      <rect x="150" y="205" width="68" height="14" fill="#0a0f18"/>
      <!-- Right Tower -->
      <rect x="435" y="110" width="16" height="205" fill="#0a0f18"/>
      <rect x="470" y="110" width="16" height="205" fill="#0a0f18"/>
      <rect x="430" y="145" width="60" height="12" fill="#0a0f18"/>
      <!-- Suspension cables -->
      <path d="M0 245 Q90 255 164 102 Q315 265 443 114 Q545 255 640 245" fill="none" stroke="#334155" stroke-width="3"/>
      <g stroke="#293548" stroke-width="1.5">
        <line x1="230" y1="195" x2="230" y2="295"/><line x1="275" y1="222" x2="275" y2="295"/>
        <line x1="320" y1="232" x2="320" y2="295"/><line x1="365" y1="222" x2="365" y2="295"/>
        <line x1="410" y1="185" x2="410" y2="295"/>
      </g>
      <!-- River reflection -->
      <rect x="0" y="317" width="640" height="163" fill="#090e18"/>
      <g stroke="#475569" stroke-opacity="0.35" stroke-width="2">
        <line x1="120" y1="350" x2="240" y2="350"/><line x1="380" y1="372" x2="510" y2="372"/>
        <line x1="210" y1="410" x2="360" y2="410"/><line x1="90" y1="445" x2="195" y2="445"/>
      </g>
    </svg>
  `),

  testesIluminacao: encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <radialGradient id="moon" cx="0.5" cy="0.32" r="0.5">
          <stop offset="0%" stop-color="#64748b" stop-opacity="0.55"/>
          <stop offset="60%" stop-color="#1e293b" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#070a11" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="640" height="480" fill="#090d16"/>
      <circle cx="320" cy="155" r="240" fill="url(#moon)"/>
      <!-- Stone ledge -->
      <polygon points="110,360 530,360 590,480 50,480" fill="#141c2b" stroke="#334155" stroke-width="2"/>
      <!-- Low-poly Gargoyle -->
      <polygon points="240,360 270,220 370,220 400,360" fill="#1f293b" stroke="#475569" stroke-width="2"/>
      <!-- Wings -->
      <polygon points="265,245 120,115 165,250 250,295" fill="#182234" stroke="#3b4d6b" stroke-width="2"/>
      <polygon points="375,245 520,115 475,250 390,295" fill="#182234" stroke="#3b4d6b" stroke-width="2"/>
      <!-- Head & Horns -->
      <polygon points="292,165 348,165 360,225 280,225" fill="#2a384e" stroke="#64748b" stroke-width="1.5"/>
      <polygon points="292,168 272,118 308,155" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
      <polygon points="348,168 368,118 332,155" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
      <!-- Rim highlights -->
      <polyline points="120,115 265,245 292,165 348,165 375,245 520,115" fill="none" stroke="#93c5fd" stroke-opacity="0.45" stroke-width="2"/>
    </svg>
  `),
};

export async function compressUploadedImage(file: File, maxWidth = 960, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido.'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / Math.max(img.width, 1));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
