import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EAP_CATEGORIES, EAPCategoryTemplate, EAPServiceTemplate } from '../../eapTemplates';
import { LocationServiceStatus, ConstructionService } from '../../types';
import { getDisciplineMeta } from '../../data/masterDisciplines';
import {
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  PlayCircle,
  Circle,
  Wrench,
  MapPin,
  Search,
  Check,
  Sparkles,
  Clock,
  Layers,
  HardHat,
  Zap,
  Flame,
  Wind,
  ShieldAlert,
  Droplet,
  Paintbrush,
  Sparkle
} from 'lucide-react';

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  caminhoExato: string;
}

// Ícones dedicados para cada disciplina da EAP
function getDisciplineIcon(code: string) {
  switch (code) {
    case '01':
      return <HardHat className="w-4 h-4 text-amber-400" />;
    case '02':
      return <Layers className="w-4 h-4 text-orange-400" />;
    case '03':
      return <Layers className="w-4 h-4 text-blue-400" />;
    case '04':
      return <Layers className="w-4 h-4 text-yellow-400" />;
    case '05': // Hidráulica
      return <Droplet className="w-4 h-4 text-cyan-400" />;
    case '06': // Elétrica
      return <Zap className="w-4 h-4 text-yellow-400" />;
    case '07': // AVAC
      return <Wind className="w-4 h-4 text-sky-400" />;
    case '08': // Gás
      return <Flame className="w-4 h-4 text-amber-500" />;
    case '09': // Incêndio
      return <ShieldAlert className="w-4 h-4 text-red-400" />;
    case '10': // Revestimentos
      return <Paintbrush className="w-4 h-4 text-emerald-400" />;
    case '11': // Limpeza
      return <Sparkles className="w-4 h-4 text-teal-400" />;
    default:
      return <Wrench className="w-4 h-4 text-slate-400" />;
  }
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({
  isOpen,
  onClose,
  caminhoExato,
}) => {
  const { currentWork, services, updateServiceLocationStatus, showToast } = useApp();

  // Estados de expansão das disciplinas (iniciam todas fechadas conforme especificação)
  const [expandedDisciplines, setExpandedDisciplines] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Estado local para apontamentos rápidos em tela (mesmo se o serviço ainda for apenas modelo EAP)
  const [localStatusMap, setLocalStatusMap] = useState<Record<string, LocationServiceStatus>>({});

  // Alternar expansão de uma disciplina
  const toggleDiscipline = (categoryCode: string) => {
    setExpandedDisciplines((prev) => ({
      ...prev,
      [categoryCode]: !prev[categoryCode],
    }));
  };

  // Expandir / Recolher todas
  const handleExpandAll = () => {
    const all: Record<string, boolean> = {};
    EAP_CATEGORIES.forEach((cat) => {
      all[cat.code] = true;
    });
    setExpandedDisciplines(all);
  };

  const handleCollapseAll = () => {
    setExpandedDisciplines({});
  };

  // Obter o status atual de um serviço específico para este caminhoExato
  const getStatusForService = (serviceCode: string, serviceName: string): LocationServiceStatus => {
    // 1. Checa estado local imediato
    if (localStatusMap[serviceCode]) {
      return localStatusMap[serviceCode];
    }

    // 2. Checa nos serviços da obra atual
    const workService = services.find(
      (s) =>
        s.workId === currentWork.id &&
        (s.eapServiceCode === serviceCode || s.name.toLowerCase() === serviceName.toLowerCase())
    );

    if (workService) {
      const locProg = (workService.locationProgress || []).find(
        (lp) => lp.locationName === caminhoExato || lp.locationId === caminhoExato
      );
      if (locProg) return locProg.status;
      return (workService.status as LocationServiceStatus) || 'Não iniciado';
    }

    return 'Não iniciado';
  };

  // Atualizar o status do apontamento
  const handleSetStatus = (
    srv: EAPServiceTemplate,
    newStatus: LocationServiceStatus
  ) => {
    // 1. Atualiza estado local para refletir na UI imediatamente
    setLocalStatusMap((prev) => ({
      ...prev,
      [srv.code]: newStatus,
    }));

    // 2. Se o serviço já existe na obra, atualiza via context
    const existingWorkService = services.find(
      (s) =>
        s.workId === currentWork.id &&
        (s.eapServiceCode === srv.code || s.name.toLowerCase() === srv.name.toLowerCase())
    );

    if (existingWorkService) {
      updateServiceLocationStatus(
        existingWorkService.id,
        caminhoExato,
        caminhoExato,
        newStatus
      );
    }

    showToast({
      type: newStatus === 'Concluído' ? 'success' : newStatus === 'Em andamento' ? 'info' : 'warning',
      title: 'Apontamento Registrado',
      message: `"${srv.name}" marcado como "${newStatus}" em ${caminhoExato}.`,
    });
  };

  // Filtragem e ordenação de serviços pela sequência construtiva
  const filteredCategories = useMemo(() => {
    let list: EAPCategoryTemplate[] = EAP_CATEGORIES;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();

      list = EAP_CATEGORIES.map((cat) => {
        const filteredSubs = cat.subCategories
          .map((sub) => {
            const matchingSrvs = sub.services.filter(
              (s) =>
                s.name.toLowerCase().includes(q) ||
                s.code.toLowerCase().includes(q) ||
                s.defaultResponsible.toLowerCase().includes(q) ||
                cat.name.toLowerCase().includes(q)
            );
            return { ...sub, services: matchingSrvs };
          })
          .filter((sub) => sub.services.length > 0);

        return {
          ...cat,
          subCategories: filteredSubs,
        };
      }).filter((cat) => cat.subCategories.length > 0);
    }

    return [...list].sort(
      (a, b) => getDisciplineMeta(a.name).order - getDisciplineMeta(b.name).order
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
      >
        {/* Cabeçalho do Modal de Apontamento */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                🛠️ Apontar Serviços
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                Apontamento de Serviços em Campo
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300">
              <span className="text-slate-400">Ambiente selecionado:</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-white font-mono font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {caminhoExato}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Busca e Ações Rápidas */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar serviço por nome ou código..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
            >
              Expandir Disciplinas
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
            >
              Recolher Disciplinas
            </button>
          </div>
        </div>

        {/* Lista de Disciplinas (Elétrica, Hidráulica, AVAC, Gás, Incêndio, etc.) como Accordions Fechados */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl">
              Nenhum serviço encontrado para o termo pesquisado.
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isOpenCat = !!expandedDisciplines[cat.code];
              const allServicesInCat = cat.subCategories.flatMap((sub) => sub.services);

              // Contagem de status nesta disciplina para o local selecionado
              let completedCount = 0;
              let inProgressCount = 0;
              let notStartedCount = 0;

              allServicesInCat.forEach((s) => {
                const st = getStatusForService(s.code, s.name);
                if (st === 'Concluído') completedCount++;
                else if (st === 'Em andamento') inProgressCount++;
                else notStartedCount++;
              });

              return (
                <div
                  key={cat.id || cat.code}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-sm transition-all"
                >
                  {/* Cabeçalho da Disciplina (Accordion) */}
                  <div
                    onClick={() => toggleDiscipline(cat.code)}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-900/60 cursor-pointer select-none transition-colors border-b border-transparent hover:border-slate-800/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 text-base flex items-center justify-center">
                        {getDisciplineMeta(cat.name).icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold border border-slate-700">
                            {cat.code}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                            {cat.name}
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {allServicesInCat.length} serviços técnicos • {completedCount} concluídos • {inProgressCount} em andamento
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {completedCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold font-mono border border-emerald-500/30 hidden sm:inline-block">
                          {completedCount}/{allServicesInCat.length} OK
                        </span>
                      )}

                      <div className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                        {isOpenCat ? (
                          <ChevronUp className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo da Disciplina: Serviços com Botões de Status */}
                  {isOpenCat && (
                    <div className="p-3 sm:p-4 bg-slate-900/40 border-t border-slate-800/80 space-y-3">
                      {allServicesInCat.map((srv) => {
                        const currentStatus = getStatusForService(srv.code, srv.name);

                        return (
                          <div
                            key={srv.id || srv.code}
                            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] text-slate-500 font-bold">
                                  {srv.code}
                                </span>
                                <h4 className="text-xs font-semibold text-slate-200">
                                  {srv.name}
                                </h4>
                              </div>

                              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                <span>Resp: <strong>{srv.defaultResponsible}</strong></span>
                                <span>•</span>
                                <span>Prazo est: <strong>{srv.defaultEstimatedDays} dias</strong></span>
                              </div>
                            </div>

                            {/* Botões de Ação de Status do Serviço em Campo */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              {/* Botão Não iniciado */}
                              <button
                                type="button"
                                onClick={() => handleSetStatus(srv, 'Não iniciado')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                  currentStatus === 'Não iniciado'
                                    ? 'bg-slate-800 text-slate-200 border border-slate-600 font-bold shadow-sm'
                                    : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                                }`}
                                title="Marcar como Não Iniciado"
                              >
                                <Circle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Não iniciado</span>
                              </button>

                              {/* Botão Em andamento */}
                              <button
                                type="button"
                                onClick={() => handleSetStatus(srv, 'Em andamento')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                  currentStatus === 'Em andamento'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 font-bold shadow-sm'
                                    : 'bg-slate-900 text-slate-500 hover:text-blue-400 border border-slate-800'
                                }`}
                                title="Marcar como Em Andamento"
                              >
                                <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
                                <span className="hidden sm:inline">Em andamento</span>
                              </button>

                              {/* Botão Concluído */}
                              <button
                                type="button"
                                onClick={() => handleSetStatus(srv, 'Concluído')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                  currentStatus === 'Concluído'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-sm'
                                    : 'bg-slate-900 text-slate-500 hover:text-emerald-400 border border-slate-800'
                                }`}
                                title="Marcar como Concluído"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="hidden sm:inline">Concluído</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>
            Os apontamentos são vinculados a <strong>{caminhoExato}</strong> e salvos no cronograma.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition-colors"
          >
            Concluir Apontamentos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionModal;
