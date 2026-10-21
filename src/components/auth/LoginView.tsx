import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HardHat, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Check, 
  Key, 
  AlertCircle,
  HelpCircle,
  X,
  Building2,
  Palette,
  Sparkles,
  Upload
} from 'lucide-react';
import { User, Work } from '../../types';

export const LoginView: React.FC = () => {
  const { 
    setIsLoggedIn, 
    setCurrentUser, 
    setCurrentWork, 
    works, 
    users, 
    setUserDefinitivePassword,
    registerFirstAccess,
    showToast
  } = useApp();
  
  // Login form state - clean inputs as requested
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Flow step: 'login' | 'define_password' | 'select_work' | 'onboarding'
  const [step, setStep] = useState<'login' | 'define_password' | 'select_work' | 'onboarding'>('login');
  
  // Pending user when provisional password or multiple works
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [userAccessibleWorks, setUserAccessibleWorks] = useState<Work[]>([]);

  // "Defina a sua senha" form state
  const [definitivePassword, setDefinitivePassword] = useState('');
  const [confirmDefinitivePassword, setConfirmDefinitivePassword] = useState('');
  const [showDefinitivePassword, setShowDefinitivePassword] = useState(false);
  const [showConfirmDefinitivePassword, setShowConfirmDefinitivePassword] = useState(false);
  const [definitivePasswordError, setDefinitivePasswordError] = useState('');

  // Onboarding da Empresa Contratante (Primeiro acesso / Novo cliente)
  const [companyName, setCompanyName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [selectedColorPreset, setSelectedColorPreset] = useState<'azul' | 'verde' | 'escuro' | 'claro'>('azul');
  const [onboardingError, setOnboardingError] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingError('');

    if (!companyName.trim() || !adminName.trim() || !adminEmail.trim()) {
      setOnboardingError('Preencha os campos obrigatórios da empresa e do ADM Master.');
      return;
    }

    if (adminPassword && adminPassword.length < 6) {
      setOnboardingError('A senha do administrador deve ter pelo menos 6 caracteres.');
      return;
    }

    // Cores conforme o preset selecionado
    let primary = '#2563eb';
    let bgPri = '#090d16';
    let bgSec = '#0f172a';
    let menu = '#090d16';
    let accent = '#3b82f6';

    if (selectedColorPreset === 'verde') {
      primary = '#059669';
      bgPri = '#06130d';
      bgSec = '#092117';
      menu = '#040d09';
      accent = '#10b981';
    } else if (selectedColorPreset === 'claro') {
      primary = '#0f172a';
      bgPri = '#f8fafc';
      bgSec = '#ffffff';
      menu = '#ffffff';
      accent = '#2563eb';
    } else if (selectedColorPreset === 'escuro') {
      primary = '#f59e0b';
      bgPri = '#0a0f1d';
      bgSec = '#0f172a';
      menu = '#0a0f1d';
      accent = '#f59e0b';
    }

    registerFirstAccess({
      companyName: companyName.trim(),
      tradeName: (tradeName.trim() || companyName.trim()),
      cnpj: cnpj.trim(),
      adminName: adminName.trim(),
      adminEmail: adminEmail.trim(),
      adminPassword: adminPassword || '123456',
      logoUrl: logoPreview,
      bgPrimary: bgPri,
      bgSecondary: bgSec,
      menuBg: menu,
      buttonPrimary: primary,
      accentColor: accent,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const query = email.trim().toLowerCase();
    const targetUser = users.find(u => u.email.toLowerCase() === query);

    if (!targetUser) {
      setLoginError('E-mail ou credenciais não encontrados no cadastro da empresa.');
      return;
    }

    if (targetUser.status === 'Inativo') {
      setLoginError('Acesso bloqueado. Este usuário está inativo no sistema. Procure o Administrador.');
      return;
    }

    // Regra Obrigatória: Se o usuário tem senha provisória ou primeiro acesso pendente
    if (
      targetUser.status === 'Primeiro acesso pendente' || 
      targetUser.requiresPasswordChange || 
      targetUser.provisionalPassword
    ) {
      setPendingUser(targetUser);
      setDefinitivePassword('');
      setConfirmDefinitivePassword('');
      setDefinitivePasswordError('');
      setStep('define_password');
      return;
    }

    // Acesso normal com senha definitiva
    const accessible = works.filter(w => targetUser.workIds.includes(w.id));

    if (accessible.length === 1) {
      setCurrentUser(targetUser);
      setCurrentWork(accessible[0]);
      setIsLoggedIn(true);
    } else if (accessible.length > 1) {
      setPendingUser(targetUser);
      setUserAccessibleWorks(accessible);
      setStep('select_work');
    } else {
      setCurrentUser(targetUser);
      if (works.length > 0) {
        setCurrentWork(works[0]);
      }
      setIsLoggedIn(true);
    }
  };

  const handleDefinitivePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;

    if (!definitivePassword || definitivePassword.length < 6) {
      setDefinitivePasswordError('A nova senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (definitivePassword !== confirmDefinitivePassword) {
      setDefinitivePasswordError('As senhas informadas não coincidem. Digite novamente.');
      return;
    }

    // Salva a senha definitiva, altera status para 'Ativo' e invalida a senha provisória
    setUserDefinitivePassword(pendingUser.id, definitivePassword);

    const updatedUser: User = {
      ...pendingUser,
      status: 'Ativo',
      requiresPasswordChange: false,
      provisionalPassword: undefined,
    };

    setCurrentUser(updatedUser);

    showToast({
      type: 'success',
      title: 'Senha definitiva configurada',
      message: 'Seu acesso foi validado com sucesso.',
    });

    const accessible = works.filter(w => updatedUser.workIds.includes(w.id));

    if (accessible.length === 1) {
      setCurrentWork(accessible[0]);
      setIsLoggedIn(true);
    } else if (accessible.length > 1) {
      setUserAccessibleWorks(accessible);
      setStep('select_work');
    } else {
      if (works.length > 0) {
        setCurrentWork(works[0]);
      }
      setIsLoggedIn(true);
    }
  };

  const handleSelectWork = (work: Work) => {
    if (pendingUser) {
      setCurrentUser(pendingUser);
    }
    setCurrentWork(work);
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] flex flex-col justify-center items-center px-4 py-8 sm:py-12 text-slate-100 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Container Principal */}
      <div className="w-full max-w-md transition-all duration-300">
        
        {/* Marca Oficial e Original "CANTEIRO" (Exclusiva na tela de login) */}
        <div className="text-center pt-2 pb-6 sm:pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-3 border border-blue-400/20">
            <HardHat className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            CANTEIRO
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Gestão de obras
          </p>
        </div>

        {/* Card de Autenticação / Onboarding */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          
          {/* ============================================================== */}
          {/* ETAPA 1: LOGIN                                                 */}
          {/* ============================================================== */}
          {step === 'login' && (
            <div>
              <div className="mb-6">
                <h2 className="text-base font-bold text-white">Acessar o sistema</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Insira o seu e-mail corporativo e senha de acesso.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@empresa.com.br"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Ação limpa: Primeiro acesso da Empresa? Configurar sistema */}
              <div className="mt-6 pt-5 border-t border-slate-800/90 text-center space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setOnboardingError('');
                    setStep('onboarding');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Primeiro acesso da Empresa? Configurar sistema</span>
                </button>
                <span className="text-[11px] text-slate-500 block">
                  Colaborador? Solicite suas credenciais provisórias ao Administrador da sua empresa.
                </span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ETAPA: ONBOARDING DA NOVA EMPRESA CONTRATANTE (AMBIENTE LIMPO) */}
          {/* ============================================================== */}
          {step === 'onboarding' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                    <h2 className="text-base font-bold text-white">Configurar Nova Empresa</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cadastre sua construtora e crie o usuário ADM Master em ambiente 100% limpo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  title="Voltar ao login"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {onboardingError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{onboardingError}</span>
                </div>
              )}

              <form onSubmit={handleOnboardingSubmit} className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
                {/* Dados da Empresa */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    1. Dados da Construtora
                  </span>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Razão Social *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Construtora Horizonte Ltda"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Nome Fantasia
                      </label>
                      <input
                        type="text"
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                        placeholder="Ex: Horizonte Eng."
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="00.000.000/0001-00"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Logo da Empresa (White-label)
                    </label>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700">
                      {logoPreview ? (
                        <div className="w-10 h-10 rounded-lg bg-white/10 p-1 flex items-center justify-center overflow-hidden border border-white/20">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400">
                          <Building2 className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Selecionar imagem</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cores iniciais */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                      <span>Identidade Visual Inicial</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedColorPreset('azul')}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedColorPreset === 'azul'
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-blue-600" />
                        <span>Azul</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedColorPreset('verde')}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedColorPreset === 'verde'
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-600" />
                        <span>Verde</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedColorPreset('escuro')}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedColorPreset === 'escuro'
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-orange-500" />
                        <span>Âmbar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedColorPreset('claro')}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          selectedColorPreset === 'claro'
                            ? 'bg-slate-600/20 border-slate-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-200" />
                        <span>Claro</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dados do ADM Master */}
                <div className="pt-2 border-t border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    2. Conta do Administrador Master
                  </span>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nome do Administrador *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Ex: Engenheiro Responsável"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      E-mail de Acesso (Login ADM) *
                    </label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="adm@suaconstrutora.com.br"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Senha Definitiva do ADM *
                    </label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    Iniciar Sistema Limpo
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* ETAPA 2: DEFINA A SUA SENHA (PRIMEIRO ACESSO OBRIGATÓRIO)       */}
          {/* ============================================================== */}
          {step === 'define_password' && pendingUser && (
            <div>
              <div className="mb-5 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-white">Defina a sua senha</h2>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Primeiro acesso identificado para <strong>{pendingUser.name}</strong>. Crie sua senha definitiva para acessar o sistema.
                </p>
              </div>

              {definitivePasswordError && (
                <div className="mb-4 p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-300">
                  {definitivePasswordError}
                </div>
              )}

              <form onSubmit={handleDefinitivePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nova senha pessoal *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type={showDefinitivePassword ? 'text' : 'password'}
                      required
                      value={definitivePassword}
                      onChange={(e) => setDefinitivePassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDefinitivePassword(!showDefinitivePassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showDefinitivePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirmar nova senha *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type={showConfirmDefinitivePassword ? 'text' : 'password'}
                      required
                      value={confirmDefinitivePassword}
                      onChange={(e) => setConfirmDefinitivePassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmDefinitivePassword(!showConfirmDefinitivePassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmDefinitivePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                  <span className="block font-semibold text-slate-300">Regras de Segurança:</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>A senha provisória deixará de funcionar imediatamente.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>O Administrador nunca terá acesso à sua senha definitiva.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar senha e acessar</span>
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* ETAPA 3: SELEÇÃO DE OBRA (QUANDO O USUÁRIO TEM MAIS DE UMA)     */}
          {/* ============================================================== */}
          {step === 'select_work' && (
            <div>
              <div className="mb-5 pb-3 border-b border-slate-800">
                <h2 className="text-base font-bold text-white">Selecione a obra de trabalho</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Você possui permissão em mais de uma obra ativa da empresa.
                </p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {userAccessibleWorks.map(w => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleSelectWork(w)}
                    className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                        {w.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {w.city} - {w.state} · {w.type}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal Informativo: Esqueci Minha Senha */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Recuperação de Senha</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                Por motivos de conformidade e segurança do sistema <strong>CANTEIRO</strong>, as senhas de usuários são criptografadas e não podem ser visualizadas.
              </p>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <strong>O que fazer:</strong> Solicite ao Administrador da sua empresa a emissão de uma <strong>nova senha provisória</strong> no menu interno de Usuários.
              </div>
              <p className="text-[11px] text-slate-400">
                Assim que você acessar com a senha provisória, o sistema solicitará que crie uma nova senha pessoal definitiva.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Compreendi
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
