import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Boxes, 
  Wrench, 
  ShieldAlert, 
  TrendingUp, 
  ArrowLeftRight, 
  Plus, 
  Minus, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  ArrowUpRight,
  User,
  Activity,
  FileWarning,
  Building2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentWork, 
    works,
    currentUser, 
    hasPermission, 
    materials, 
    tools, 
    services, 
    transfers, 
    alerts, 
    materialMovements, 
    occurrences, 
    setCurrentTab,
    openQuickAction,
    companyBranding
  } = useApp();

  if (works.length === 0) {
    return (
      <div className="space-y-6">
        <div 
          className="p-8 sm:p-12 text-center rounded-2xl border space-y-4 max-w-xl mx-auto mt-8"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div 
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border"
            style={{ 
              backgroundColor: 'var(--btn-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent-color)'
            }}
          >
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--title-color)]">Nenhuma obra cadastrada</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
              Para iniciar o acompanhamento operacional, estoque e equipe, cadastre a primeira obra da sua empresa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab('works')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar obra</span>
          </button>
        </div>
      </div>
    );
  }

  // 1. Critical & Low Stock
  const criticalMaterials = materials.filter(m => m.currentStock <= m.minStock);
  const lowMaterials = materials.filter(m => m.currentStock > m.minStock && m.currentStock <= m.minStock * 1.3);

  // 2. Tools in use & maintenance
  const toolsInUse = tools.filter(t => t.status === 'Em uso');
  const toolsInMaintenance = tools.filter(t => t.status === 'Em manutenção');

  // 3. Services calculation
  const totalServices = services.length;
  const completedServices = services.filter(s => s.status === 'Concluído').length;
  const inProgressServices = services.filter(s => s.status === 'Em andamento').length;
  const haltedServices = services.filter(s => s.status === 'Paralisado').length;
  
  // Rule 30: Progress calculated from registered services states
  const workProgressPercentage = totalServices > 0 
    ? Math.round(((completedServices * 1.0) + (inProgressServices * 0.4)) / totalServices * 100)
    : 0;

  // 4. Pending transfers
  const pendingTransfers = transfers.filter(t => t.status !== 'Encerrado');

  return (
    <div className="space-y-6">
      {/* Top Banner: Work Context & Direct Answer to "O que precisa da minha atenção agora?" */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--accent-color)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Painel operacional da obra</span>
            <span className="opacity-40">·</span>
            <span className="text-[var(--text-secondary)]">{currentWork.type}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--title-color)] mt-1">
            {currentWork.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 opacity-60" />
              {currentWork.address}, {currentWork.city} - {currentWork.state}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 opacity-60" />
              {currentWork.floors.length} pavimentos configurados
            </span>
          </div>
        </div>

        {/* Work Progress Indicator */}
        <div 
          className="flex items-center gap-4 p-3 rounded-xl border"
          style={{ backgroundColor: 'var(--btn-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div>
            <div className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Progresso Geral
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono tabular-nums" style={{ color: 'var(--accent-color)' }}>
              {workProgressPercentage}%
            </div>
          </div>
          <div className="w-24 sm:w-32 bg-[var(--bg-primary)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)]">
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ width: `${workProgressPercentage}%`, backgroundColor: 'var(--accent-color)' }}
            />
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR (Only rendered if authorized, Rule 11 & 14) */}
      <div 
        className="p-3.5 sm:p-4 rounded-xl border"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5 flex items-center justify-between">
          <span>Ações rápidas da obra</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* Entrada de Material (Almoxarife / Authorized) */}
          <button
            type="button"
            onClick={() => hasPermission('materials.entry') && openQuickAction('entry')}
            disabled={!hasPermission('materials.entry')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
              hasPermission('materials.entry')
                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-pointer active:scale-[0.98]'
                : 'bg-[var(--btn-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed opacity-40'
            }`}
            title={!hasPermission('materials.entry') ? 'Apenas Almoxarife autorizado pode dar entrada' : 'Entrada de material'}
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="truncate">Entrada</span>
          </button>

          {/* Saída de Material (Almoxarife / Authorized) */}
          <button
            type="button"
            onClick={() => hasPermission('materials.exit') && openQuickAction('exit')}
            disabled={!hasPermission('materials.exit')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
              hasPermission('materials.exit')
                ? 'bg-[var(--btn-secondary)] hover:opacity-90 text-[var(--title-color)] border border-[var(--border-color)] cursor-pointer active:scale-[0.98]'
                : 'bg-[var(--btn-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed opacity-40'
            }`}
            title={!hasPermission('materials.exit') ? 'Apenas Almoxarife autorizado pode dar saída' : 'Saída de material'}
          >
            <Minus className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            <span className="truncate">Saída</span>
          </button>

          {/* Entrega de EPI */}
          <button
            type="button"
            onClick={() => hasPermission('epis.deliver') && openQuickAction('epi')}
            disabled={!hasPermission('epis.deliver')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
              hasPermission('epis.deliver')
                ? 'bg-[var(--btn-secondary)] hover:opacity-90 text-[var(--title-color)] border border-[var(--border-color)] cursor-pointer active:scale-[0.98]'
                : 'bg-[var(--btn-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed opacity-40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            <span className="truncate">Entrega de EPI</span>
          </button>

          {/* Entrega de Ferramenta */}
          <button
            type="button"
            onClick={() => hasPermission('tools.deliver') && openQuickAction('tool')}
            disabled={!hasPermission('tools.deliver')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
              hasPermission('tools.deliver')
                ? 'bg-[var(--btn-secondary)] hover:opacity-90 text-[var(--title-color)] border border-[var(--border-color)] cursor-pointer active:scale-[0.98]'
                : 'bg-[var(--btn-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed opacity-40'
            }`}
          >
            <Wrench className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            <span className="truncate">Entrega de ferramenta</span>
          </button>

          {/* Registrar Ocorrência */}
          <button
            type="button"
            onClick={() => hasPermission('occurrences.create') && openQuickAction('occurrence')}
            disabled={!hasPermission('occurrences.create')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
              hasPermission('occurrences.create')
                ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 cursor-pointer active:scale-[0.98]'
                : 'bg-[var(--btn-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed opacity-40'
            }`}
          >
            <FileWarning className="w-4 h-4 text-rose-400" />
            <span className="truncate">Ocorrência</span>
          </button>

          {/* Atualizar Serviço */}
          <button
            type="button"
            onClick={() => hasPermission('progress.edit_service') && openQuickAction('service')}
            disabled={!hasPermission('progress.edit_service')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
              hasPermission('progress.edit_service')
                ? 'bg-[var(--btn-secondary)] hover:opacity-90 text-[var(--title-color)] border border-[var(--border-color)] cursor-pointer active:scale-[0.98]'
                : 'bg-[var(--btn-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed opacity-40'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            <span className="truncate">Serviço</span>
          </button>
        </div>
      </div>

      {/* OPERATIONAL STATUS TILES (Direct answers to site state) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Estoque Crítico */}
        <div 
          onClick={() => setCurrentTab('materials')}
          className="p-4 rounded-xl border cursor-pointer transition-all group"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Estoque Crítico</span>
            <Boxes className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-[var(--title-color)] font-mono tabular-nums flex items-baseline gap-2">
            <span>{criticalMaterials.length}</span>
            <span className="text-xs font-medium text-red-400">itens abaixo do mín.</span>
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-secondary)] truncate">
            {criticalMaterials.length > 0 ? (
              <span className="text-red-300 font-medium">Atenção: {criticalMaterials[0].name.split(' ')[0]} {criticalMaterials[0].name.split(' ')[1]}</span>
            ) : (
              <span className="text-emerald-400">Todos itens normais</span>
            )}
          </div>
        </div>

        {/* Ferramentas em Uso */}
        <div 
          onClick={() => setCurrentTab('tools')}
          className="p-4 rounded-xl border cursor-pointer transition-all group"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Ferramentas em Uso</span>
            <Wrench className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
          </div>
          <div className="text-2xl font-black text-[var(--title-color)] font-mono tabular-nums flex items-baseline gap-2">
            <span>{toolsInUse.length}</span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">/ {tools.length} total</span>
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-secondary)] flex items-center justify-between">
            <span>{toolsInMaintenance.length} em manutenção</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors" />
          </div>
        </div>

        {/* Serviços em Andamento */}
        <div 
          onClick={() => setCurrentTab('progress')}
          className="p-4 rounded-xl border cursor-pointer transition-all group"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Serviços Ativos</span>
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
          </div>
          <div className="text-2xl font-black text-[var(--title-color)] font-mono tabular-nums flex items-baseline gap-2">
            <span>{inProgressServices}</span>
            {haltedServices > 0 && (
              <span className="text-xs font-bold text-red-400">({haltedServices} paralisado)</span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-secondary)] flex items-center justify-between">
            <span>{completedServices} concluídos</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors" />
          </div>
        </div>

        {/* Transferências */}
        <div 
          onClick={() => setCurrentTab('transfers')}
          className="p-4 rounded-xl border cursor-pointer transition-all group"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Transferências Obras</span>
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-[var(--title-color)] font-mono tabular-nums flex items-baseline gap-2">
            <span>{pendingTransfers.length}</span>
            <span className="text-xs font-medium text-emerald-400">em trânsito/pendentes</span>
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-secondary)] flex items-center justify-between">
            <span className="truncate">Argamassa AC-III (Prime Plaza)</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: OPERATIONAL ALERTS & RECENT ACTIVITY */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Alertas Reais que Requerem Atenção */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-[var(--title-color)]">Alertas Operacionais Prioritários</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {alerts.length} Requerem Atenção
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  onClick={() => alert.actionTab && setCurrentTab(alert.actionTab)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    alert.severity === 'high' 
                      ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' 
                      : 'bg-[var(--btn-secondary)] border-[var(--border-color)] hover:opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[var(--title-color)] flex items-center gap-1.5">
                        {alert.severity === 'high' && (
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        )}
                        <span>{alert.title}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">
                        {alert.message}
                      </p>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] shrink-0 font-medium">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t text-xs text-[var(--text-secondary)] flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
            <span>Prioridades operacionais da obra</span>
            <span className="text-emerald-400 font-semibold">Monitoramento ativo</span>
          </div>
        </div>

        {/* Right Column: Movimentações e Atividade Recente */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-[var(--title-color)]">Últimas Movimentações na Obra</h3>
              </div>
              <button
                onClick={() => setCurrentTab('materials')}
                className="text-xs font-semibold text-[var(--accent-color)] hover:underline"
              >
                Ver histórico
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {materialMovements.slice(0, 3).map((mov) => (
                <div 
                  key={mov.id}
                  className="p-3 rounded-xl bg-[var(--btn-secondary)] border border-[var(--border-color)] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      mov.type === 'entry' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {mov.type === 'entry' ? '+' : '-'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--title-color)] truncate">
                        {mov.materialName}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1.5 mt-0.5 truncate">
                        <span>{mov.type === 'entry' ? 'Entrada' : 'Saída'}</span>
                        <span>·</span>
                        <span>{mov.userName.split(' ')[0]}</span>
                        {mov.destination === 'Funcionário' && mov.employeeName && (
                          <>
                            <span>·</span>
                            <span className="text-[var(--accent-color)]">Para: {mov.employeeName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-xs font-bold font-mono tabular-nums ${
                      mov.type === 'entry' ? 'text-emerald-400' : 'text-slate-300'
                    }`}>
                      {mov.type === 'entry' ? '+' : '-'}{mov.quantity} {mov.unit}
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                      {mov.timestamp.split(' ')[1]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-[var(--text-secondary)]" style={{ borderColor: 'var(--border-color)' }}>
            <span>Rastreabilidade completa de operador e data/hora</span>
            <span className="text-[var(--accent-color)] font-semibold">{materialMovements.length} registros</span>
          </div>
        </div>
      </div>
    </div>
  );
};
