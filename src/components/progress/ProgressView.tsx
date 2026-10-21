import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Layers, 
  Users, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  PlayCircle, 
  PauseCircle,
  Building,
  UserCheck,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Compass,
  Sparkles,
  Map,
  ListFilter
} from 'lucide-react';
import { ServiceStatus, ConstructionService } from '../../types';
import { EntityAdminModals } from '../modals/EntityAdminModals';
import { WorkMapBuilder } from './WorkMapBuilder';
import { ServiceExecutionView } from './ServiceExecutionView';

export const ProgressView: React.FC = () => {
  const { 
    currentWork, 
    services, 
    employees, 
    updateServiceStatus, 
    deleteService,
    requestConfirmation,
    hasPermission 
  } = useApp();

  // Sub-abas: 'apontamento' (Etapa 2: Apontamento & Execução), 'mapa' (Etapa 1: Construtor do Mapa), ou 'consultas' (Consultas de Equipe)
  const [activeSubTab, setActiveSubTab] = useState<'apontamento' | 'mapa' | 'consultas'>('apontamento');

  const [adminModal, setAdminModal] = useState<{
    isOpen: boolean;
    type: 'service' | 'area';
    editItem?: any;
  }>({ isOpen: false, type: 'service' });

  const handleDeleteService = (service: ConstructionService) => {
    requestConfirmation({
      title: 'Excluir este registro?',
      message: 'Esta ação não poderá ser desfeita.',
      isDestructive: true,
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        deleteService(service.id);
      },
    });
  };

  // Questions from Section 30:
  // "Quem está trabalhando no 5º andar?"
  // "Em quais serviços o João está trabalhando?"
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<string>('all');
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtered list
  const filteredServices = services.filter((srv) => {
    const matchesFloor = selectedFloorFilter === 'all' || srv.floorId === selectedFloorFilter;
    const matchesStatus = statusFilter === 'all' || srv.status === statusFilter;
    const matchesEmployee = selectedEmployeeFilter === 'all' || 
      srv.assignedEmployees.some(emp => emp.id === selectedEmployeeFilter);

    return matchesFloor && matchesStatus && matchesEmployee;
  });

  // Calculate floor presence: "Quem está trabalhando no 5º andar?"
  const peopleInSelectedFloor = selectedFloorFilter !== 'all'
    ? Array.from(
        new Set(
          services
            .filter(s => s.floorId === selectedFloorFilter && s.status === 'Em andamento')
            .flatMap(s => s.assignedEmployees.map(e => `${e.name} (${s.area})`))
        )
      )
    : [];

  // Calculate worker's services: "Em quais serviços o João está trabalhando?"
  const servicesOfSelectedEmployee = selectedEmployeeFilter !== 'all'
    ? services.filter(s => s.assignedEmployees.some(e => e.id === selectedEmployeeFilter))
    : [];

  const totalServices = services.length;
  const completedCount = services.filter(s => s.status === 'Concluído').length;
  const inProgressCount = services.filter(s => s.status === 'Em andamento').length;
  const haltedCount = services.filter(s => s.status === 'Paralisado').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Andamento da Obra & Alocação de Equipes</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hierarquia: Obra → Andar → Área → Serviço → Pessoas alocadas.
          </p>
        </div>

        {/* Global Progress Indicator & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sub-Aba Seletor: Mapa da Obra (Etapa 1) PRIMEIRO, depois Apontamento (Etapa 2) e Consultas */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('mapa')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'mapa'
                  ? 'bg-primary text-[var(--btn-primary-text)] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Mapa da Obra (Etapa 1)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('apontamento')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'apontamento'
                  ? 'bg-primary text-[var(--btn-primary-text)] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apontamento de Serviços (Etapa 2)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('consultas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'consultas'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Consultas de Equipe</span>
            </button>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Progresso Geral</span>
              <div className="text-sm font-black text-primary font-mono">
                {completedCount} de {totalServices} concluídos
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-[var(--primary-color)]/30 flex items-center justify-center font-mono font-bold text-xs text-primary">
              {totalServices > 0 ? Math.round((completedCount / totalServices) * 100) : 0}%
            </div>
          </div>

          {hasPermission('progress.create_service') && (
            <button
              type="button"
              onClick={() => setAdminModal({ isOpen: true, type: 'service' })}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar serviço</span>
            </button>
          )}

          {hasPermission('areas.create') && (
            <button
              type="button"
              onClick={() => setAdminModal({ isOpen: true, type: 'area' })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>Adicionar área</span>
            </button>
          )}
        </div>
      </div>

      {/* Renderização Condicional Conforme Sub-Aba Ativa */}
      {activeSubTab === 'mapa' && (
        <WorkMapBuilder 
          onComplete={() => setActiveSubTab('apontamento')} 
          onCancel={() => setActiveSubTab('apontamento')} 
        />
      )}

      {activeSubTab === 'apontamento' && (
        <ServiceExecutionView onOpenMapBuilder={() => setActiveSubTab('mapa')} />
      )}

      {activeSubTab === 'consultas' && (
        <>
          {/* Banner de atalho para o Construtor do Mapa caso a obra ainda não tenha sido configurada */}
          {!currentWork.configuredWithEap && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--primary-color)]/15 via-slate-900 to-slate-900 border border-[var(--primary-color)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[var(--primary-color)]/20 text-primary mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Configure o Mapa da Obra & Gere o Cronograma EAP
                    <span className="px-1.5 py-0.2 rounded bg-[var(--primary-color)]/20 text-primary text-[10px] uppercase font-mono">
                      Novo
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Utilize o <strong>Construtor do Mapa da Obra</strong> para gerar pavimentos por tipologia (Casa, Prédio, Galpão, Hospital, etc.) e estruturar o cronograma do projeto.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('mapa')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-[var(--btn-primary-text)] font-bold text-xs shrink-0 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Abrir Construtor do Mapa</span>
              </button>
            </div>
          )}

      {/* Consultas operacionais do andamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Consulta 1: "Quem está trabalhando no 5º andar?" */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              <span>Consulta Rápida: Pessoas por Andar</span>
            </div>
            <span className="text-[10px] text-slate-400">Pergunta da Obra</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 shrink-0">Selecionar Pavimento:</label>
            <select
              value={selectedFloorFilter}
              onChange={(e) => setSelectedFloorFilter(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
            >
              <option value="all">Selecione um andar para ver a equipe...</option>
              {currentWork.floors.map((fl) => (
                <option key={fl.id} value={fl.id}>
                  {fl.name}
                </option>
              ))}
            </select>
          </div>

          {selectedFloorFilter !== 'all' && (
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
              <div className="text-[11px] font-semibold text-primary">
                Quem está trabalhando agora neste pavimento:
              </div>
              {peopleInSelectedFloor.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {peopleInSelectedFloor.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      {p}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">Nenhum trabalhador com serviço ativo no momento neste andar.</p>
              )}
            </div>
          )}
        </div>

        {/* Consulta 2: "Em quais serviços o João está trabalhando?" */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span>Consulta Rápida: Serviços por Colaborador</span>
            </div>
            <span className="text-[10px] text-slate-400">Pergunta da Obra</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 shrink-0">Selecionar Funcionário:</label>
            <select
              value={selectedEmployeeFilter}
              onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
            >
              <option value="all">Selecione um funcionário para ver suas frentes...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.functionName})
                </option>
              ))}
            </select>
          </div>

          {selectedEmployeeFilter !== 'all' && (
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
              <div className="text-[11px] font-semibold text-primary">
                Frentes de serviço onde está alocado:
              </div>
              {servicesOfSelectedEmployee.length > 0 ? (
                <div className="space-y-1">
                  {servicesOfSelectedEmployee.map((s) => (
                    <div key={s.id} className="text-slate-300 flex items-center justify-between">
                      <span>• {s.floorName} — {s.name}</span>
                      <span className="text-[10px] font-semibold text-primary">{s.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">Nenhum serviço atribuído no momento.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter and Services Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Frentes de Trabalho e Serviços ({filteredServices.length})
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">Todos os status</option>
              <option value="Não iniciado">Não iniciado</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
              <option value="Paralisado">Paralisado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const isCompleted = service.status === 'Concluído';
            const isInProgress = service.status === 'Em andamento';
            const isHalted = service.status === 'Paralisado';

            return (
              <div
                key={service.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isHalted
                    ? 'bg-slate-900 border-red-500/40'
                    : isCompleted
                    ? 'bg-slate-900 border-emerald-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  {/* Top: Floor & Area */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {service.floorName}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {service.area}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {service.name}
                  </h3>

                  <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                    <span>Responsável:</span>
                    <span className="text-slate-200 font-medium">{service.responsibleName}</span>
                  </div>

                  <div className="mt-1 text-xs text-slate-400 flex items-center justify-between">
                    <span>Previsão:</span>
                    <span className="font-mono text-slate-300">{service.predictedEndDate}</span>
                  </div>

                  {/* Assigned Workers */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Equipe Alocada ({service.assignedEmployees.length}):
                    </div>
                    {service.assignedEmployees.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {service.assignedEmployees.map((emp) => (
                          <span
                            key={emp.id}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                          >
                            {emp.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Nenhum funcionário vinculado ainda</span>
                    )}
                  </div>

                  {service.notes && (
                    <p className="mt-2 text-[11px] text-slate-400 italic">
                      "{service.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom: Status & Quick Status Switch */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : isInProgress
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      : isHalted
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {service.status}
                  </span>

                  {hasPermission('progress.edit_service') && (
                    <div className="flex items-center gap-1">
                      {service.status !== 'Em andamento' && (
                        <button
                          type="button"
                          onClick={() => updateServiceStatus(service.id, 'Em andamento')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 text-[10px] font-semibold"
                          title="Iniciar"
                        >
                          Iniciar
                        </button>
                      )}
                      {service.status !== 'Concluído' && (
                        <button
                          type="button"
                          onClick={() => updateServiceStatus(service.id, 'Concluído')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-semibold"
                          title="Concluir"
                        >
                          Concluir
                        </button>
                      )}
                      {service.status !== 'Paralisado' && (
                        <button
                          type="button"
                          onClick={() => updateServiceStatus(service.id, 'Paralisado')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-red-300 text-[10px] font-semibold"
                          title="Paralisar"
                        >
                          Paralisar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setAdminModal({ isOpen: true, type: 'service', editItem: service })}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-primary text-[10px]"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service)}
                        className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-[10px]"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </>
      )}

      <EntityAdminModals
        entityType={adminModal.type}
        isOpen={adminModal.isOpen}
        editItem={adminModal.editItem}
        onClose={() => setAdminModal((prev) => ({ ...prev, isOpen: false, editItem: undefined }))}
      />
    </div>
  );
};
