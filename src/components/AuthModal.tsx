import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Shield, User, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import { UserSession } from '../types/platform';
import { BatEmblem } from './BatEmblem';

interface AuthModalProps {
  initialTab?: 'login' | 'signup';
  reasonMessage?: string | null;
  requireCreatorRole?: boolean;
  onLoginSuccess: (session: UserSession) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialTab = 'login',
  reasonMessage = null,
  requireCreatorRole = false,
  onLoginSuccess,
  onClose,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupRole, setSignupRole] = useState<'supporter' | 'creator'>(
    requireCreatorRole ? 'creator' : 'supporter'
  );
  const [showSignupPass, setShowSignupPass] = useState(false);

  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = storageService.authenticateUser(loginEmail, loginPassword);
    if (result.ok === false) {
      setError(result.error);
      return;
    }
    if (requireCreatorRole && result.session.role !== 'creator') {
      setError('Esta conta é de Apoiador. Entre com uma conta de Criador para acessar o Admin.');
      return;
    }
    onLoginSuccess(result.session);
  };

  const handleQuickCreatorDemo = () => {
    setError('');
    const result = storageService.authenticateUser('criador@darkknightpsx.dev', '123456');
    if (result.ok) {
      onLoginSuccess(result.session);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupName.trim()) {
      setError('Informe seu nome completo.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setError('As senhas não coincidem.');
      return;
    }

    const result = storageService.registerUser({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      role: signupRole,
    });

    if (result.ok === false) {
      setError(result.error);
      return;
    }
    onLoginSuccess(result.session);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs dark:bg-black/75"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[500px] rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:rounded-[6px] dark:border-[#2a3d5a] dark:bg-[#0d1421] dark:shadow-[0_24px_65px_rgba(0,0,0,0.85)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar janela de autenticação"
          className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:rounded-[4px] dark:hover:bg-[#182438] dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <BatEmblem className="h-9 w-8 shrink-0" />
          <span className="font-display text-xl font-bold tracking-wide text-slate-900 uppercase dark:text-white">
            Dark Knight PSX
          </span>
        </div>

        {/* Reason Banner if opened from protected action */}
        {reasonMessage && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 dark:border-[#3c5e8c] dark:bg-[#132238] dark:text-[#a6ccf5]">
            {reasonMessage}
          </div>
        )}

        {/* Login / Cadastro Tabs */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:rounded-[4px] dark:border dark:border-[#202d42] dark:bg-[#080c14]">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`rounded-md py-2 text-xs font-semibold transition-colors ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#254063] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setError('');
            }}
            className={`rounded-md py-2 text-xs font-semibold transition-colors ${
              tab === 'signup'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-[#254063] dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Criar conta
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-200"
          >
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3.5">
            <div>
              <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Entrar na sua conta
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Bem-vindo de volta! Entre para apoiar atualizações ou gerenciar painéis.
              </p>
            </div>

            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                E-mail
              </label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white dark:focus:border-[#5a92cf]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Senha
              </label>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type={showLoginPass ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full rounded-md border border-slate-300 bg-white py-2.5 pr-10 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white dark:focus:border-[#5a92cf]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass((prev) => !prev)}
                  aria-label={showLoginPass ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2c4e78] dark:font-display dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#386399]"
            >
              Entrar
            </button>

            <div className="relative my-3 flex items-center justify-center">
              <span className="h-px w-full bg-slate-200 dark:bg-[#1e2b3e]" />
              <span className="bg-white px-2.5 text-[11px] text-slate-400 dark:bg-[#0d1421]">
                ou acesso rápido
              </span>
              <span className="h-px w-full bg-slate-200 dark:bg-[#1e2b3e]" />
            </div>

            <button
              type="button"
              onClick={handleQuickCreatorDemo}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:rounded-[4px] dark:border-[#2a3b54] dark:bg-[#111927] dark:text-slate-200 dark:hover:border-[#4f87c4] dark:hover:text-white"
            >
              <Shield className="h-4 w-4 text-blue-600 dark:text-[#7db3ed]" />
              <span>Entrar como Criador (Admin Demo)</span>
            </button>

            <p className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setError('');
                }}
                className="font-semibold text-blue-600 hover:underline dark:text-[#7db3ed]"
              >
                Criar conta
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="mt-4 space-y-3">
            <div>
              <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Criar conta
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Cadastre-se para apoiar o projeto ou administrar atualizações.
              </p>
            </div>

            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Nome completo
              </label>
              <div className="relative mt-1">
                <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="w-full rounded-md border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                E-mail
              </label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-md border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="signup-pass"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Senha
                </label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="signup-pass"
                    type={showSignupPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Mín. 6 dígitos"
                    className="w-full rounded-md border border-slate-300 bg-white py-2 pr-9 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPass((prev) => !prev)}
                    aria-label={showSignupPass ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showSignupPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-confirm"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirmar senha
                </label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="signup-confirm"
                    type={showSignupPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full rounded-md border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:rounded-[4px] dark:border-[#25354d] dark:bg-[#080c14] dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Profile Role Selection */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tipo de conta
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSignupRole('supporter')}
                  className={`flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-colors ${
                    signupRole === 'supporter'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-[#5a92cf] dark:bg-[#182942] dark:text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-[#25354d] dark:bg-[#0a0f18] dark:text-slate-400'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Apoiador</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupRole('creator')}
                  className={`flex items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-colors ${
                    signupRole === 'creator'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-[#5a92cf] dark:bg-[#182942] dark:text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-[#25354d] dark:bg-[#0a0f18] dark:text-slate-400'
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Criador (Admin)</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:rounded-[4px] dark:border dark:border-[#5f92cc]/60 dark:bg-[#2c4e78] dark:font-display dark:tracking-[0.14em] dark:uppercase dark:hover:bg-[#386399]"
            >
              Criar conta
            </button>

            <p className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
              Já possui uma conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
                className="font-semibold text-blue-600 hover:underline dark:text-[#7db3ed]"
              >
                Entrar
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
