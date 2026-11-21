import {
  CommunityComment,
  GameConfig,
  ImplementationItem,
  RegisteredUser,
  SupportImpulse,
  ThemeMode,
  UpdatePanel,
  UserSession,
} from '../types/platform';
import { DEFAULT_ARTWORKS } from '../utils/psxArtwork';

const KEYS = {
  PANELS: 'dkpsx_update_panels_v1',
  CONFIG: 'dkpsx_game_config_v1',
  IMPULSES: 'dkpsx_support_impulses_v1',
  COMMENTS: 'dkpsx_community_comments_v1',
  SESSION: 'dkpsx_user_session_v1',
  USERS: 'dkpsx_registered_users_v1',
  THEME: 'dkpsx_theme_mode_v1',
};

export const DEFAULT_PANELS: UpdatePanel[] = [
  {
    id: 'upd-1-3',
    version: '1.3',
    headerLabel: 'ATUALIZAÇÃO 1.3',
    title: 'RUAS DAS ÁGUAS',
    subtitle: 'AMBIENTES EXPANDIDOS',
    category: 'AMBIENTES',
    shortDescription: 'Novos cenários, mais detalhes e clima dinâmico.',
    fullDescription:
      'Exploração ampliada nos becos alagados do Distrito Leste de Gotham. Adicionamos reflexos em tempo real nas poças de chuva, iluminação volumétrica nos postes de vapor e novos pontos de gancho nos telhados para infiltração furtiva em estilo PS1.',
    date: '24/05/2024',
    imageUrl: DEFAULT_ARTWORKS.ruaDasAguas,
    images: [
      DEFAULT_ARTWORKS.ruaDasAguas,
      DEFAULT_ARTWORKS.chuvaGotham,
      DEFAULT_ARTWORKS.testesIluminacao,
    ],
    videoUrl: '',
    implementations: [
      { id: 'imp-13-1', text: 'Reflexos em tempo real nas poças de água da rua principal', done: true },
      { id: 'imp-13-2', text: 'Postes de iluminação volumétrica com partículas de névoa', done: true },
      { id: 'imp-13-3', text: 'Novos pontos de gancho (Grapple) nos telhados do Distrito Leste', done: false },
      { id: 'imp-13-4', text: 'Áudio ambiente reativo à intensidade da chuva', done: false },
    ],
    mediaTypeLabel: 'IMAGEM',
    supportCount: 12,
    totalRaised: 640,
    goalAmount: 1000,
    views: 3782,
    likes: 512,
    likedByMe: false,
    sponsors: ['Rafael M.', 'Camila S.', 'Bruno T.', 'Lucas V.'],
    supportValues: [5, 10, 25, 50],
    order: 1,
  },
  {
    id: 'upd-1-2',
    version: '1.2',
    headerLabel: 'ATUALIZAÇÃO 1.2',
    title: 'CHUVA EM GOTHAM',
    subtitle: 'SISTEMA CLIMÁTICO',
    category: 'CLIMA',
    shortDescription: 'Partículas de chuva PSX, neblina densa e faróis dinâmicos.',
    fullDescription:
      'Implementação do sistema climático contínuo com densidade de neblina ajustável, som espacial de tempestade e veículos de patrulha com feixes de luz em vértices calculados por hardware retrô.',
    date: '11/05/2024',
    imageUrl: DEFAULT_ARTWORKS.chuvaGotham,
    images: [DEFAULT_ARTWORKS.chuvaGotham, DEFAULT_ARTWORKS.ruaDasAguas],
    videoUrl: '',
    implementations: [
      { id: 'imp-12-1', text: 'Sistema de chuva contínua com otimização de draw calls', done: true },
      { id: 'imp-12-2', text: 'Faróis volumétricos em veículos de patrulha', done: true },
      { id: 'imp-12-3', text: 'Neblina dinâmica com transição suave entre distritos', done: true },
    ],
    mediaTypeLabel: 'IMAGEM',
    supportCount: 19,
    totalRaised: 890,
    goalAmount: 1000,
    views: 2915,
    likes: 378,
    likedByMe: false,
    sponsors: ['Camila S.', 'Diego F.', 'Mariana R.', 'Pedro H.'],
    supportValues: [5, 10, 25, 50],
    order: 2,
  },
  {
    id: 'upd-1-1',
    version: '1.1',
    headerLabel: 'ATUALIZAÇÃO 1.1',
    title: 'NOVO INIMIGO',
    subtitle: 'IA E COMBATE',
    category: 'PERSONAGENS',
    shortDescription: 'Novo arquétipo de chefe tático com rotina de patrulha.',
    fullDescription:
      'Introdução do antagonista investigativo das docas, equipado com detecção por cone de visão, animações em baixa contagem poligonal e diálogos em estilo noir clássico.',
    date: '28/04/2024',
    imageUrl: DEFAULT_ARTWORKS.novoInimigo,
    images: [DEFAULT_ARTWORKS.novoInimigo, DEFAULT_ARTWORKS.primeiroBuild],
    videoUrl: '',
    implementations: [
      { id: 'imp-11-1', text: 'Modelo low-poly com texturas 128x128 em estilo PS1', done: true },
      { id: 'imp-11-2', text: 'Cone de visão furtiva e estado de alerta por som', done: true },
      { id: 'imp-11-3', text: 'Sequência de contra-ataque e nocaute silencioso', done: false },
    ],
    mediaTypeLabel: 'IMAGEM',
    supportCount: 15,
    totalRaised: 520,
    goalAmount: 800,
    views: 2341,
    likes: 301,
    likedByMe: false,
    sponsors: ['Lucas V.', 'Ana C.', 'Thiago N.', 'Carla M.'],
    supportValues: [5, 10, 25, 50],
    order: 3,
  },
  {
    id: 'upd-1-0',
    version: '1.0',
    headerLabel: 'ATUALIZAÇÃO 1.0',
    title: 'PRIMEIRO BUILD',
    subtitle: 'FUNDAÇÃO JOGÁVEL',
    category: 'BASE DO JOGO',
    shortDescription: 'Ponte de Gotham, física da capa e movimentação básica.',
    fullDescription:
      'Primeiro protótipo jogável em navegador via WebGL com física clássica de planagem da capa, combate corpo a corpo de três golpes e cenário completo da ponte sul.',
    date: '14/04/2024',
    imageUrl: DEFAULT_ARTWORKS.primeiroBuild,
    images: [DEFAULT_ARTWORKS.primeiroBuild, DEFAULT_ARTWORKS.testesIluminacao],
    videoUrl: '',
    implementations: [
      { id: 'imp-10-1', text: 'Movimentação em 3ª pessoa com câmera fixa e livre', done: true },
      { id: 'imp-10-2', text: 'Física de planagem da capa ao saltar dos pilares', done: true },
      { id: 'imp-10-3', text: 'Mapa jogável completo da Ponte Sul de Gotham', done: true },
    ],
    mediaTypeLabel: 'IMAGEM',
    supportCount: 28,
    totalRaised: 1120,
    goalAmount: 1200,
    views: 4120,
    likes: 645,
    likedByMe: false,
    sponsors: ['Bruno T.', 'Felipe A.', 'Juliana K.', 'Igor S.'],
    supportValues: [5, 10, 25, 50],
    order: 4,
  },
  {
    id: 'upd-0-9',
    version: '0.9',
    headerLabel: 'ATUALIZAÇÃO 0.9',
    title: 'TESTES DE ILUMINAÇÃO',
    subtitle: 'SHADER RETRO 32-BIT',
    category: 'TECNOLOGIA',
    shortDescription: 'Dithering PS1, vertex jitter e sombras de gárgulas.',
    fullDescription:
      'Calibração da paleta de 15 bits com matriz de Bayer e instabilidade autêntica de vértices, garantindo fidelidade visual aos clássicos de 1998.',
    date: '02/04/2024',
    imageUrl: DEFAULT_ARTWORKS.testesIluminacao,
    images: [DEFAULT_ARTWORKS.testesIluminacao],
    videoUrl: '',
    implementations: [
      { id: 'imp-09-1', text: 'Shader de dithering 15-bit com matriz de Bayer 4x4', done: true },
      { id: 'imp-09-2', text: 'Snapping de vértices configurável para estética PSX', done: true },
    ],
    mediaTypeLabel: 'IMAGEM',
    supportCount: 9,
    totalRaised: 310,
    goalAmount: 600,
    views: 1876,
    likes: 245,
    likedByMe: false,
    sponsors: ['Marina L.', 'Gustavo B.', 'Eduardo P.'],
    supportValues: [5, 10, 25, 50],
    order: 5,
  },
];

export const DEFAULT_GAME_CONFIG: GameConfig = {
  iframeUrl: 'https://dark-knight-psx.vercel.app',
  useExternalIframe: false,
};

export const DEFAULT_IMPULSES: SupportImpulse[] = [
  {
    id: 'imp-1',
    updateId: 'upd-1-3',
    updateTitle: '1.3 RUAS DAS ÁGUAS',
    amount: 25,
    supporterName: 'Rafael M.',
    message: 'Os reflexos na chuva ficaram idênticos aos jogos de PS1!',
    createdAt: '24/05/2024 · 21:40',
  },
  {
    id: 'imp-2',
    updateId: 'upd-1-2',
    updateTitle: '1.2 CHUVA EM GOTHAM',
    amount: 50,
    supporterName: 'Camila S.',
    message: 'Força no projeto, ansiosa pela próxima área jogável.',
    createdAt: '23/05/2024 · 18:15',
  },
  {
    id: 'imp-3',
    updateId: 'upd-1-1',
    updateTitle: '1.1 NOVO INIMIGO',
    amount: 10,
    supporterName: 'Lucas V.',
    message: 'Visual noir perfeito, continuem atualizando!',
    createdAt: '20/05/2024 · 14:05',
  },
];

export const DEFAULT_COMMENTS: CommunityComment[] = [
  {
    id: 'cmt-1',
    author: 'Desenvolvedor Dark Knight PSX',
    role: 'Criador',
    message:
      'Bem-vindos à central oficial! Usem a galeria abaixo para acompanhar cada marco de desenvolvimento e testar o build mais recente.',
    createdAt: '24/05/2024',
  },
  {
    id: 'cmt-2',
    author: 'Bruno Tavares',
    role: 'Apoiador',
    message: 'A atmosfera com o Bat-Sinal na neblina está absurda. Já dei meu impulso na 1.3!',
    createdAt: '24/05/2024',
  },
];

export const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: 'usr-creator-1',
    name: 'Criador Dark Knight',
    email: 'criador@darkknightpsx.dev',
    password: '123456',
    role: 'creator',
  },
  {
    id: 'usr-supporter-1',
    name: 'Rafael Mendes',
    email: 'rafael@gotham.dev',
    password: '123456',
    role: 'supporter',
  },
];

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Erro ao salvar ${key} no localStorage:`, err);
  }
}

function hydratePanel(panel: UpdatePanel, idx: number): UpdatePanel {
  const defaults = DEFAULT_PANELS.find((d) => d.id === panel.id);
  const images: string[] =
    Array.isArray(panel.images) && panel.images.length > 0
      ? panel.images
      : panel.imageUrl
        ? [panel.imageUrl]
        : defaults?.images ?? [DEFAULT_ARTWORKS.ruaDasAguas];

  const implementations: ImplementationItem[] = Array.isArray(panel.implementations)
    ? panel.implementations
    : defaults?.implementations ?? [];

  return {
    ...panel,
    imageUrl: images[0],
    images,
    videoUrl: panel.videoUrl ?? defaults?.videoUrl ?? '',
    implementations,
    goalAmount: panel.goalAmount ?? defaults?.goalAmount ?? 1000,
    views: panel.views ?? defaults?.views ?? 1200 + idx * 140,
    likes: panel.likes ?? defaults?.likes ?? 140 + idx * 28,
    likedByMe: panel.likedByMe ?? false,
    sponsors:
      panel.sponsors && panel.sponsors.length > 0
        ? panel.sponsors
        : defaults?.sponsors ?? ['Rafael M.', 'Camila S.', 'Bruno T.'],
  };
}

export const storageService = {
  getTheme(): ThemeMode {
    const stored = safeRead<ThemeMode>(KEYS.THEME, 'light');
    return stored === 'dark' ? 'dark' : 'light';
  },

  saveTheme(theme: ThemeMode): void {
    safeWrite(KEYS.THEME, theme);
  },

  getPanels(): UpdatePanel[] {
    const panels = safeRead<UpdatePanel[]>(KEYS.PANELS, DEFAULT_PANELS);
    return [...panels].map(hydratePanel).sort((a, b) => a.order - b.order);
  },

  savePanels(panels: UpdatePanel[]): void {
    const normalized = [...panels]
      .sort((a, b) => a.order - b.order)
      .map((p, idx) => {
        const imgs = p.images && p.images.length > 0 ? p.images : [p.imageUrl];
        return {
          ...p,
          images: imgs,
          imageUrl: imgs[0],
          order: idx + 1,
        };
      });
    safeWrite(KEYS.PANELS, normalized);
  },

  getGameConfig(): GameConfig {
    return safeRead<GameConfig>(KEYS.CONFIG, DEFAULT_GAME_CONFIG);
  },

  saveGameConfig(config: GameConfig): void {
    safeWrite(KEYS.CONFIG, config);
  },

  getImpulses(): SupportImpulse[] {
    return safeRead<SupportImpulse[]>(KEYS.IMPULSES, DEFAULT_IMPULSES);
  },

  addImpulse(impulse: SupportImpulse): SupportImpulse[] {
    const current = this.getImpulses();
    const updated = [impulse, ...current].slice(0, 30);
    safeWrite(KEYS.IMPULSES, updated);
    return updated;
  },

  getComments(): CommunityComment[] {
    return safeRead<CommunityComment[]>(KEYS.COMMENTS, DEFAULT_COMMENTS);
  },

  addComment(comment: CommunityComment): CommunityComment[] {
    const current = this.getComments();
    const updated = [comment, ...current];
    safeWrite(KEYS.COMMENTS, updated);
    return updated;
  },

  getUsers(): RegisteredUser[] {
    return safeRead<RegisteredUser[]>(KEYS.USERS, DEFAULT_USERS);
  },

  registerUser(user: Omit<RegisteredUser, 'id'>): { ok: true; session: UserSession } | { ok: false; error: string } {
    const users = this.getUsers();
    const normalizedEmail = user.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, error: 'Este e-mail já está cadastrado.' };
    }
    const newUser: RegisteredUser = {
      ...user,
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
    };
    safeWrite(KEYS.USERS, [...users, newUser]);
    const session: UserSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    this.saveSession(session);
    return { ok: true, session };
  },

  authenticateUser(
    email: string,
    password: string
  ): { ok: true; session: UserSession } | { ok: false; error: string } {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const match = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!match || match.password !== password) {
      return { ok: false, error: 'E-mail ou senha inválidos.' };
    }
    const session: UserSession = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
    };
    this.saveSession(session);
    return { ok: true, session };
  },

  getSession(): UserSession | null {
    return safeRead<UserSession | null>(KEYS.SESSION, null);
  },

  saveSession(session: UserSession | null): void {
    if (!session) {
      localStorage.removeItem(KEYS.SESSION);
      return;
    }
    safeWrite(KEYS.SESSION, session);
  },
};
