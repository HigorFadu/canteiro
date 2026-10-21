import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Building2, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  FileCode, 
  CheckCircle2 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentWork, availableWorks, currentUser, companyBranding, setCurrentTab } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Configurações da Obra & Parâmetros</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Estrutura física do empreendimento, pavimentos gerados e diretrizes da empresa.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('branding')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          style={{ backgroundColor: companyBranding.buttonPrimary }}
        >
          <span>Personalizar Identidade Visual</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
              <h3 className="text-sm font-bold text-white">Empresa Construtora</h3>
            </div>
            {companyBranding.logoUrl && (
              <img src={companyBranding.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded bg-white p-1" />
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Razão Social:</span>
              <strong className="text-white">{companyBranding.companyName}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Nome Fantasia:</span>
              <strong className="text-white">{companyBranding.tradeName}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">CNPJ:</span>
              <strong className="font-mono text-white">{companyBranding.cnpj || 'Não informado'}</strong>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Cores da Empresa:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: companyBranding.primaryColor }} title="Cor Principal" />
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: companyBranding.accentColor }} title="Cor de Destaque" />
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: companyBranding.secondaryColor }} title="Cor Secundária" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Work Structure */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Layers className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            <h3 className="text-sm font-bold text-white">Parâmetros da obra ativa</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Nome:</span>
              <strong className="text-white">{currentWork.name}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Código / Referência:</span>
              <strong className="font-mono text-white">{currentWork.code || 'S/C'}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Tipo de Empreendimento:</span>
              <strong className="text-white">{currentWork.type}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Status Operacional:</span>
              <strong className="text-emerald-400">{currentWork.status}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Localização:</span>
              <span className="text-slate-300">{currentWork.address}, {currentWork.city} - {currentWork.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Floors Grid */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">
              Estrutura vertical de pavimentos ({currentWork.floors.length} níveis)
            </h3>
            <p className="text-xs text-slate-400">
              Distribuição de subsolos, térreo e pavimentos tipos da obra ativa.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-[var(--btn-primary)]/10 text-[var(--btn-primary)] border border-[var(--btn-primary)]/20">
            Estrutura ativa
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {currentWork.floors.map((floor) => {
            const isBasement = floor.level < 0;
            const isGround = floor.level === 0;

            return (
              <div
                key={floor.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isBasement
                    ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                    : isGround
                    ? 'bg-slate-800/90 border-[var(--btn-primary)]/40 text-[var(--btn-primary)] font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-white font-semibold'
                }`}
              >
                <div className="text-xs font-bold">{floor.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Nível {floor.level}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
