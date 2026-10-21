import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ChevronDown, 
  Bell, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  AlertTriangle,
  HardHat,
  Menu,
  User as UserIcon,
  RefreshCw,
  Key,
  X,
  Plus
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebarMobile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebarMobile }) => {
  const { 
    currentWork, 
    setCurrentWork, 
    availableWorks, 
    currentUser, 
    alerts, 
    setCurrentTab,
    logoutWithConfirm,
    switchUser,
    companyBranding,
    works,
    changeUserPassword,
  } = useApp();

  const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Change password form state in profile
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPasswordInput.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    const success = changeUserPassword(currentUser.id, currentPasswordInput, newPasswordInput);
    if (!success) {
      setPasswordError('Senha atual incorreta.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');
    setTimeout(() => {
      setShowPasswordChangeForm(false);
      setPasswordSuccess(false);
    }, 1800);
  };

  const workAlerts = alerts.filter(a => a.workId === currentWork.id);
  const userWorks = works.filter(w => currentUser.workIds.includes(w.id));

  return (
    <header 
      className="sticky top-0 z-50 flex items-center justify-between h-16 px-2 sm:px-6 border-b border-slate-800 bg-[var(--bg-primary)] bg-slate-900 select-none transition-colors duration-150 gap-1 sm:gap-4 w-full print:hidden"
      style={{
        backgroundColor: 'var(--menu-bg, var(--bg-primary, #0f172a))',
        borderColor: 'var(--border-color, #1e293b)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Zone 1: Tenant Brand & Work Context Selector */}
      <div className="flex items-center gap-1 sm:gap-2.5 min-w-0 flex-1">
        {onToggleSidebarMobile && (
          <button 
            type="button"
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--title-color)] hover:bg-[var(--btn-secondary)] transition-colors shrink-0"
            title="Menu secundário e configurações"
            aria-label="Abrir menu secundário e configurações"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Exclusivamente Logo e Nome da Empresa do cliente logado */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0 min-w-0"
          title={`Empresa: ${companyBranding.tradeName || companyBranding.companyName}`}
        >
          {companyBranding.logoUrl ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 p-1 flex items-center justify-center overflow-hidden border border-[var(--border-color)] shrink-0">
              <img 
                src={companyBranding.logoUrl} 
                alt="Logo da empresa" 
                className="w-full h-full object-contain" 
              />
            </div>
          ) : (
            <div 
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black text-xs sm:text-sm tracking-wider shadow-sm transition-colors shrink-0"
              style={{ 
                backgroundColor: 'var(--btn-primary)', 
                color: 'var(--btn-primary-text)' 
              }}
            >
              <Building2 className="w-4 h-4" />
            </div>
          )}
          <div className="flex flex-col min-w-0 max-w-[70px] min-[360px]:max-w-[95px] min-[420px]:max-w-[130px] sm:max-w-[180px] md:max-w-[240px]">
            <span 
              className="font-extrabold text-xs sm:text-sm tracking-tight transition-colors block leading-tight truncate text-[var(--title-color)]"
            >
              {companyBranding.tradeName || companyBranding.companyName || 'Minha Empresa'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-[var(--border-color)] mx-1 shrink-0" />

        {/* WORK CONTEXT SELECTOR - Nunca corta no mobile */}
        <div className="relative shrink min-w-0">
          <button
            type="button"
            onClick={() => {
              if (works.length === 0) {
                setCurrentTab('works');
                return;
              }
              setIsWorkMenuOpen(!isWorkMenuOpen);
              setIsUserMenuOpen(false);
              setIsAlertsOpen(false);
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 rounded-lg bg-[var(--btn-secondary)] hover:opacity-90 border border-[var(--border-color)] transition-all text-left max-w-[95px] min-[360px]:max-w-[125px] min-[420px]:max-w-[160px] sm:max-w-[220px] md:max-w-[280px] cursor-pointer"
            title={currentWork.name}
          >
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            <div className="min-w-0 flex-1">
              <div className="hidden md:flex text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider items-center gap-1">
                <span>{works.length > 0 ? 'Obra Ativa' : 'Sem Obras'}</span>
                {works.length > 0 && <span className="opacity-50">·</span>}
                {works.length > 0 && <span className="text-[var(--text-secondary)] truncate">{currentWork.type}</span>}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[var(--title-color)] truncate leading-tight">
                {currentWork.name || 'Selecionar'}
              </div>
            </div>
            {works.length > 0 && <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--text-secondary)] shrink-0" />}
          </button>

          {/* Work Dropdown */}
          {isWorkMenuOpen && works.length > 0 && (
            <div className="fixed sm:absolute left-2 sm:left-0 right-2 sm:right-auto mt-2 w-auto sm:w-80 max-w-[calc(100vw-1rem)] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-color)]">
                Obras Vinculadas ({availableWorks.length})
              </div>
              <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                {availableWorks.map((work) => {
                  const isSelected = work.id === currentWork.id;
                  return (
                    <button
                      key={work.id}
                      onClick={() => {
                        setCurrentWork(work);
                        setIsWorkMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col gap-1 cursor-pointer ${
                        isSelected 
                          ? 'bg-[var(--btn-secondary)] border border-[var(--accent-color)] text-[var(--title-color)]' 
                          : 'hover:bg-[var(--btn-secondary)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate">{work.name}</span>
                        {isSelected && (
                          <span 
                            className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                          >
                            Ativa
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                          {work.city} - {work.state}
                        </span>
                        <span>·</span>
                        <span>{work.floors?.length || work.totalFloors} pav.</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsWorkMenuOpen(false);
                    setCurrentTab('works');
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
                  style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar obra / Gerenciar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerts & User Profile - Nunca cortados no mobile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Operational Alerts Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsAlertsOpen(!isAlertsOpen);
              setIsWorkMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Alertas operacionais"
          >
            <Bell className="w-5 h-5" />
            {workAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center ring-2 ring-slate-900">
                {workAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts Flyout */}
          {isAlertsOpen && (
            <div className="fixed sm:absolute left-2 sm:left-auto right-2 sm:right-0 mt-2 w-auto sm:w-96 max-w-[calc(100vw-1rem)] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                <div className="text-xs font-bold text-[var(--title-color)] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[var(--accent-color)]" />
                  Alertas da Obra ({workAlerts.length})
                </div>
                <button
                  onClick={() => {
                    setCurrentTab('dashboard');
                    setIsAlertsOpen(false);
                  }}
                  className="text-[11px] text-[var(--accent-color)] hover:underline"
                >
                  Ver no Dashboard
                </button>
              </div>

              <div className="space-y-2 mt-2 max-h-72 overflow-y-auto">
                {workAlerts.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] py-3 text-center">Nenhum alerta pendente no momento.</p>
                ) : (
                  workAlerts.map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => {
                        if (alt.actionTab) setCurrentTab(alt.actionTab);
                        setIsAlertsOpen(false);
                      }}
                      className="p-2.5 rounded-lg bg-[var(--btn-secondary)] hover:opacity-90 border border-[var(--border-color)] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--title-color)]">
                        <span className="truncate">{alt.title}</span>
                        <span className="text-[10px] text-[var(--text-secondary)] shrink-0">{alt.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">{alt.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill - Nunca corta no mobile */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsWorkMenuOpen(false);
              setIsAlertsOpen(false);
            }}
            className="flex items-center gap-1 sm:gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-[var(--btn-secondary)] hover:opacity-90 border border-[var(--border-color)] text-left transition-colors cursor-pointer shrink-0"
            title={currentUser.name}
          >
            <div 
              className="w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:flex flex-col min-w-0 max-w-[120px]">
              <span className="text-xs font-bold text-[var(--title-color)] truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] truncate leading-tight">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--text-secondary)] shrink-0" />
          </button>

          {/* User Profile Menu */}
          {isUserMenuOpen && (
            <div className="fixed sm:absolute left-2 sm:left-auto right-2 sm:right-0 mt-2 w-auto sm:w-64 max-w-[calc(100vw-1rem)] rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-2 z-50 divide-y divide-[var(--border-color)]">
              <div className="px-3 py-2.5">
                <p className="text-xs font-bold text-[var(--title-color)]">{currentUser.name}</p>
                <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">{currentUser.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--btn-secondary)] text-[var(--accent-color)] border border-[var(--border-color)]">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {companyBranding.tradeName}
                  </span>
                </div>
              </div>

              <div className="py-1">
                {/* 1. Meu perfil */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--btn-secondary)] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Meu perfil</span>
                </button>

                {/* 2. Trocar usuário */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    switchUser();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--btn-secondary)] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Trocar usuário</span>
                </button>
              </div>

              <div className="pt-1">
                {/* 3. Sair */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logoutWithConfirm();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Meu Perfil */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                >
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--title-color)' }}>Meu perfil</h3>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Informações cadastrais e de acesso</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="hover:opacity-80 cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nome:</span>
                  <strong className="text-white">{currentUser.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">E-mail:</span>
                  <strong className="text-slate-300 font-mono text-[11px]">{currentUser.email}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cargo / Função:</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    {currentUser.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Empresa:</span>
                  <span className="text-slate-200">{companyBranding.tradeName} ({companyBranding.companyName})</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Obras com Acesso Autorizado ({userWorks.length}):
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {userWorks.map((w) => (
                    <div 
                      key={w.id} 
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                        w.id === currentWork.id 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                          : 'bg-slate-800/40 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="font-semibold">{w.name}</span>
                      {w.id === currentWork.id && (
                        <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-400">
                          Obra ativa
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Nível de autorização</span>
                <span className="font-semibold text-slate-300">
                  {currentUser.role === 'ADM do sistema' ? 'Controle Total (Administrador)' : `${currentUser.permissions.length} permissões ativas`}
                </span>
              </div>

              {/* Requirement 14: Alterar senha */}
              <div className="pt-2 border-t border-slate-800">
                {!showPasswordChangeForm ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeForm(true)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    <span>Alterar minha senha</span>
                  </button>
                ) : (
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-bold text-white block">Alterar Senha Pessoal</span>
                    {passwordError && (
                      <div className="text-[10px] text-red-400 p-1.5 rounded bg-red-500/10 border border-red-500/20">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="text-[10px] text-emerald-400 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        Senha alterada com sucesso!
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Senha atual</label>
                      <input
                        type="password"
                        required
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Nova senha</label>
                      <input
                        type="password"
                        required
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="Nova senha"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Confirmar nova senha</label>
                      <input
                        type="password"
                        required
                        value={confirmNewPasswordInput}
                        onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                        placeholder="Confirmar nova senha"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPasswordChangeForm(false)}
                        className="px-3 py-1.5 rounded-lg text-xs transition-colors border"
                        style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                      >
                        Salvar nova senha
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold text-xs transition-colors cursor-pointer border"
                style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
