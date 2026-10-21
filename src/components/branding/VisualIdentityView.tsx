import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Palette, 
  Upload, 
  X, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Eye, 
  Sun, 
  Moon, 
  Sliders, 
  RotateCcw,
  Building2,
  HardHat
} from 'lucide-react';
import { 
  themePresets, 
  evaluateContrast, 
  getReadableTextColor,
  enforceStrictTypography,
  isDarkColor,
  applyThemeVariables
} from '../../utils/theme';
import { CompanyBranding } from '../../types';

export const VisualIdentityView: React.FC = () => {
  const { companyBranding, updateCompanyBranding, showToast } = useApp();

  // Local editing state
  const [branding, setBranding] = useState<CompanyBranding>({ ...companyBranding });
  const [selectedPreset, setSelectedPreset] = useState<'claro' | 'escuro' | 'personalizado'>(
    companyBranding.themePreset || 'personalizado'
  );

  React.useEffect(() => {
    setBranding({ ...companyBranding });
    setSelectedPreset(companyBranding.themePreset || 'personalizado');
  }, [companyBranding]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleColorChange = (key: keyof CompanyBranding, value: string) => {
    setSelectedPreset('personalizado');
    setBranding((prev) => {
      const updated = { ...prev, [key]: value, themePreset: 'personalizado' as const };
      // Sugestão de contraste no botão primário se não houver texto explícito
      if (key === 'buttonPrimary' && !prev.buttonPrimaryText) {
        updated.buttonPrimaryText = getReadableTextColor(value);
      }
      // Propagação instantânea no context (silenciosa) e no DOM
      updateCompanyBranding(updated, { silent: true });
      applyThemeVariables(updated);
      return updated;
    });
  };

  const handleApplyPreset = (presetKey: 'claro' | 'escuro' | 'azul' | 'verde' | 'grafite') => {
    let newBranding: CompanyBranding;

    if (presetKey === 'claro') {
      setSelectedPreset('claro');
      // No Tema Claro: base de fundos claros e fontes pretas (#000000 / #334155),
      // mantendo todas as cores de botões, menus, títulos e bordas 100% livres e preservadas
      newBranding = {
        ...branding,
        themePreset: 'claro',
        bgPrimary: '#f8fafc',
        bgSecondary: '#ffffff',
        textPrimary: '#000000',
        textSecondary: '#334155',
        textTitles: '#000000',
        borderColor: branding.borderColor === '#1e293b' ? '#e2e8f0' : (branding.borderColor || '#e2e8f0'),
        menuBg: branding.menuBg === '#090d16' ? '#ffffff' : (branding.menuBg || '#ffffff'),
        buttonPrimary: branding.buttonPrimary || '#0f172a',
        buttonPrimaryText: branding.buttonPrimaryText || '#ffffff',
        buttonSecondary: branding.buttonSecondary || '#f1f5f9',
      };
    } else if (presetKey === 'escuro') {
      setSelectedPreset('escuro');
      // No Tema Escuro: base de fundos escuros e fontes brancas (#ffffff / #94a3b8),
      // mantendo todas as cores de botões, menus, títulos e bordas 100% livres e preservadas
      newBranding = {
        ...branding,
        themePreset: 'escuro',
        bgPrimary: '#090d16',
        bgSecondary: '#0f172a',
        textPrimary: '#ffffff',
        textSecondary: '#94a3b8',
        textTitles: '#ffffff',
        borderColor: branding.borderColor === '#e2e8f0' ? '#1e293b' : (branding.borderColor || '#1e293b'),
        menuBg: branding.menuBg === '#ffffff' ? '#090d16' : (branding.menuBg || '#090d16'),
        buttonPrimary: branding.buttonPrimary || '#2563eb',
        buttonPrimaryText: branding.buttonPrimaryText || '#ffffff',
        buttonSecondary: branding.buttonSecondary || '#1e293b',
      };
    } else {
      const preset = themePresets[presetKey];
      setSelectedPreset('personalizado');
      newBranding = {
        ...branding,
        ...preset,
        themePreset: 'personalizado',
      };
    }

    setBranding(newBranding);
    updateCompanyBranding(newBranding, { silent: true });
    applyThemeVariables(newBranding);
    showToast({
      type: 'info',
      title: `Tema ${presetKey.toUpperCase()} aplicado como base`,
      message: 'Fundos e fontes contrastantes configurados. Todas as cores continuam 100% livres para editar.',
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const logoUrl = reader.result as string;
        setBranding((prev) => {
          const updated = { ...prev, logoUrl };
          applyThemeVariables(updated);
          return updated;
        });
        showToast({
          type: 'success',
          title: 'Logo carregada',
          message: 'Prévia atualizada. Salve para manter salva no sistema.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const finalBranding: CompanyBranding = {
      ...branding,
    };
    updateCompanyBranding(finalBranding);
    setBranding(finalBranding);
    applyThemeVariables(finalBranding);
  };

  // Contrast validations for live UI warnings
  const buttonPrimaryContrast = evaluateContrast(
    branding.buttonPrimaryText || getReadableTextColor(branding.buttonPrimary),
    branding.buttonPrimary
  );
  const textBgContrast = evaluateContrast(branding.textPrimary, branding.bgPrimary);
  const menuTextContrast = evaluateContrast(branding.textPrimary, branding.menuBg);

  const colorFields: { key: keyof CompanyBranding; label: string; description: string }[] = [
    { key: 'bgPrimary', label: 'Fundo principal', description: 'Cor base da área de trabalho e páginas' },
    { key: 'bgSecondary', label: 'Fundo secundário', description: 'Cor dos cartões, modais e containers' },
    { key: 'menuBg', label: 'Menus / Sidebar', description: 'Barra lateral de navegação' },
    { key: 'buttonPrimary', label: 'Botões principais', description: 'Ações de destaque e confirmação' },
    { key: 'buttonPrimaryText', label: 'Texto do botão principal', description: 'Cor da fonte em botões de destaque' },
    { key: 'buttonSecondary', label: 'Botões secundários', description: 'Botões de suporte e filtros' },
    { key: 'textPrimary', label: 'Textos principais', description: 'Texto corrido e conteúdos da interface' },
    { key: 'textSecondary', label: 'Textos secundários', description: 'Subtítulos e legendas informativas' },
    { key: 'textTitles', label: 'Títulos', description: 'Cabeçalhos de módulos e seções' },
    { key: 'accentColor', label: 'Destaques / Badges', description: 'Realces operacionais e elementos ativos' },
    { key: 'borderColor', label: 'Bordas e divisores', description: 'Linhas divisórias e contornos' },
    { key: 'iconColor', label: 'Ícones', description: 'Símbolos gráficos e ilustrações' },
    { key: 'linkColor', label: 'Links', description: 'Ações clicáveis e hiperlinks' },
    { key: 'successColor', label: 'Cor de sucesso', description: 'Concluído, ativo e aprovado' },
    { key: 'warningColor', label: 'Cor de alerta', description: 'Avisos e pendências operacionais' },
    { key: 'errorColor', label: 'Cor de erro', description: 'Críticos, bloqueios e falhas' },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: 'var(--btn-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--btn-primary)'
              }}
            >
              <Palette className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Identidade Visual</h1>
              <p className="text-xs text-slate-400">
                Personalização completa da instalação para a marca da sua empresa
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            style={{ 
              backgroundColor: branding.buttonPrimary, 
              color: branding.buttonPrimaryText || getReadableTextColor(branding.buttonPrimary) 
            }}
          >
            <Check className="w-4 h-4" />
            <span>Salvar identidade</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Chooser */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Predefinições Rápidas de Tema
          </span>
          <span className="text-[11px] text-slate-500">
            Escolha uma predefinição ou ajuste cada cor individualmente
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => handleApplyPreset('escuro')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
              selectedPreset === 'escuro'
                ? 'bg-blue-500/10 border-blue-500 text-white font-bold ring-1 ring-blue-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Moon className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-xs font-bold">Escuro</div>
              <div className="text-[10px] text-slate-400">Moderno & elegante</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('claro')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
              selectedPreset === 'claro'
                ? 'bg-blue-500/10 border-blue-500 text-white font-bold ring-1 ring-blue-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold">Claro</div>
              <div className="text-[10px] text-slate-400">Fundo limpo profissional</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('azul')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-left transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 shrink-0" />
            <div>
              <div className="text-xs font-bold">Azul Corporativo</div>
              <div className="text-[10px] text-slate-400">Engenharia civil</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('verde')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-left transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-bold">Verde Obra</div>
              <div className="text-[10px] text-slate-400">Sustentabilidade</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('grafite')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-left transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold">Grafite & Ouro</div>
              <div className="text-[10px] text-slate-400">Construtora premium</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid: Customization Controls & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Logo & Color Palette Form */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Logo da Empresa */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Logo da Empresa</h3>
                <p className="text-[11px] text-slate-400">
                  Substitui a marca do sistema no cabeçalho e menu interno
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Enviar logo</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />

            {branding.logoUrl ? (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
                    <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{branding.tradeName || 'Logo ativa'}</span>
                    <span className="text-[10px] text-emerald-400">Aplicada no cabeçalho e menu</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBranding(prev => ({ ...prev, logoUrl: '' }))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Remover logo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-950/60 transition-all cursor-pointer text-center group"
              >
                <Upload className="w-5 h-5 mx-auto text-slate-500 group-hover:text-blue-400 mb-1" />
                <span className="text-xs font-semibold text-slate-300 block">Clique para fazer upload da imagem</span>
                <span className="text-[10px] text-slate-500">Formatos recomendados: PNG ou SVG com fundo transparente</span>
              </div>
            )}
          </div>

          {/* Dados Textuais da Empresa */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Nome da Empresa Contratante</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Nome Fantasia (marca exibida no sistema)
                </label>
                <input
                  type="text"
                  value={branding.tradeName}
                  onChange={(e) => setBranding(prev => ({ ...prev, tradeName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Razão Social (contrato / relatórios)
                </label>
                <input
                  type="text"
                  value={branding.companyName}
                  onChange={(e) => setBranding(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Color Matrix Customization */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Configuração Completa de Cores</h3>
                <p className="text-[11px] text-slate-400">
                  Todas as cores do sistema sob medida para sua identidade
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {colorFields.length} parâmetros
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {colorFields.map((field) => {
                const currentColor = (branding[field.key] as string) || '#ffffff';
                return (
                  <div
                    key={field.key}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{field.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{field.description}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">{currentColor}</span>
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => handleColorChange(field.key, e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contrast & Readability Security Section (Requirement 2) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verificação de Contraste & Legibilidade (Proteção Visual)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Botão Principal</span>
                <strong className={buttonPrimaryContrast.isReadable ? 'text-emerald-400' : 'text-amber-400'}>
                  {buttonPrimaryContrast.score} ({buttonPrimaryContrast.ratio}:1)
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Texto / Fundo</span>
                <strong className={textBgContrast.isReadable ? 'text-emerald-400' : 'text-amber-400'}>
                  {textBgContrast.score} ({textBgContrast.ratio}:1)
                </strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Menu / Texto</span>
                <strong className={menuTextContrast.isReadable ? 'text-emerald-400' : 'text-amber-400'}>
                  {menuTextContrast.score} ({menuTextContrast.ratio}:1)
                </strong>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              O sistema calcula automaticamente o contraste WCAG e assegura textos legíveis em botões e menus.
            </p>
          </div>

        </div>

        {/* Right Column: High Fidelity Live Preview (Requirement 1 & 4) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Prévia do Sistema em Tempo Real</span>
            <span className="text-[10px] text-emerald-400 font-semibold">● Atualização ao vivo</span>
          </div>

          <div 
            className="rounded-2xl border p-4 space-y-4 shadow-xl transition-all"
            style={{ 
              backgroundColor: branding.bgPrimary, 
              borderColor: branding.borderColor 
            }}
          >
            {/* Mock Header */}
            <div 
              className="p-3 rounded-xl border flex items-center justify-between"
              style={{ 
                backgroundColor: branding.bgSecondary,
                borderColor: branding.borderColor 
              }}
            >
              <div className="flex items-center gap-2">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="w-6 h-6 object-contain rounded" />
                ) : (
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
                    style={{ 
                      backgroundColor: branding.buttonPrimary,
                      color: branding.buttonPrimaryText || getReadableTextColor(branding.buttonPrimary)
                    }}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                )}
                <div>
                  <span 
                    className="font-bold text-xs block leading-tight truncate max-w-[140px]"
                    style={{ color: branding.textTitles }}
                  >
                    {branding.tradeName || 'Sua Construtora'}
                  </span>
                  <span className="text-[9px]" style={{ color: branding.textSecondary }}>
                    Obra Residencial Exemplo
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span 
                  className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                  style={{ 
                    backgroundColor: `${branding.accentColor}25`, 
                    color: branding.accentColor 
                  }}
                >
                  Em obra
                </span>
              </div>
            </div>

            {/* Mock Sidebar + Content Area */}
            <div className="grid grid-cols-12 gap-3 min-h-[220px]">
              {/* Mock Sidebar */}
              <div 
                className="col-span-4 p-2.5 rounded-xl border space-y-1.5"
                style={{ 
                  backgroundColor: branding.menuBg,
                  borderColor: branding.borderColor 
                }}
              >
                <div className="text-[9px] uppercase font-bold" style={{ color: branding.textSecondary }}>
                  Módulos
                </div>
                {['Início', 'Obras', 'Materiais', 'Equipe'].map((item, idx) => (
                  <div
                    key={item}
                    className="px-2 py-1.5 rounded text-[11px] font-semibold flex items-center justify-between"
                    style={
                      idx === 0
                        ? { 
                            backgroundColor: branding.buttonPrimary, 
                            color: branding.buttonPrimaryText || getReadableTextColor(branding.buttonPrimary) 
                          }
                        : { color: branding.textPrimary }
                    }
                  >
                    <span>{item}</span>
                    {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                ))}
              </div>

              {/* Mock Content */}
              <div className="col-span-8 space-y-3">
                <div 
                  className="p-3 rounded-xl border space-y-2"
                  style={{ 
                    backgroundColor: branding.bgSecondary,
                    borderColor: branding.borderColor 
                  }}
                >
                  <h4 className="text-xs font-bold" style={{ color: branding.textTitles }}>
                    Painel Operacional
                  </h4>
                  <p className="text-[11px]" style={{ color: branding.textSecondary }}>
                    Controle de estoque, ferramentas e ocorrências do canteiro.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm"
                      style={{ 
                        backgroundColor: branding.buttonPrimary, 
                        color: branding.buttonPrimaryText || getReadableTextColor(branding.buttonPrimary) 
                      }}
                    >
                      Adicionar material
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium border"
                      style={{ 
                        backgroundColor: branding.buttonSecondary, 
                        borderColor: branding.borderColor,
                        color: branding.textPrimary 
                      }}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>

                {/* Status Badges Preview */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold">
                  <span 
                    className="px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${branding.successColor}20`, color: branding.successColor }}
                  >
                    ● Concluído
                  </span>
                  <span 
                    className="px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${branding.warningColor}20`, color: branding.warningColor }}
                  >
                    ● Atenção
                  </span>
                  <span 
                    className="px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${branding.errorColor}20`, color: branding.errorColor }}
                  >
                    ● Crítico
                  </span>
                </div>
              </div>
            </div>

            {/* Discrete CANTEIRO Footer (Requirement 5) */}
            <div 
              className="pt-2 border-t text-center text-[10px] flex items-center justify-between"
              style={{ borderColor: branding.borderColor, color: branding.textSecondary }}
            >
              <span>{branding.companyName || 'Empresa Contratante'}</span>
              <span className="opacity-70 font-mono">CANTEIRO v1</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-white block">Regra de Identidade de Marca:</span>
            <p className="text-[11px] leading-relaxed">
              Dentro da área autenticada, o logo e nome da sua empresa substituem o CANTEIRO como marca principal. A marca CANTEIRO permanece ativa na tela de login.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
