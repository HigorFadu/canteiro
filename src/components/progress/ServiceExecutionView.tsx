import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MASTER_DISCIPLINES, MasterDiscipline, getDisciplineMeta } from '../../data/masterDisciplines';
import { EAPServiceTemplate } from '../../data/eapTemplates';
import { LocationServiceStatus } from '../../types';
import {
  TrendingUp,
  Compass,
  Search,
} from 'lucide-react';

interface ServiceExecutionViewProps {
  onOpenMapBuilder?: () => void;
}

/**
 * Constrói a árvore aninhada dinâmica de locais a partir de caminhos com ' - '.
 * Suporta N níveis de profundidade (Prédio, Galpão, Hospital, Loteamento, etc.).
 * Retorna null nas folhas (Leaf Nodes) e Record<string, any> nos agregadores.
 */
function buildLocationTree(paths: string[]): Record<string, any> {
  const root: Record<string, any> = {};
  paths.forEach((path) => {
    const parts = path.split(' - ');
    let current = root;
    parts.forEach((part, index) => {
      const isLeaf = index === parts.length - 1;
      if (!current[part] || (current[part] === null && !isLeaf)) {
        current[part] = isLeaf ? null : {};
      }
      current = current[part];
    });
  });
  return root;
}

/**
 * Componente Recursivo para Níveis de Local dentro de cada Serviço
 */
interface ServiceLocationTreeNodeProps {
  name: string;
  fullPath: string;
  children: Record<string, any> | null;
  service: EAPServiceTemplate;
  getLeafStatus: (service: EAPServiceTemplate, fullPath: string) => LocationServiceStatus;
  getProgressoLocalNode: (
    name: string,
    fullPath: string,
    children: Record<string, any> | null,
    service: EAPServiceTemplate
  ) => number;
  onSetStatus: (
    service: EAPServiceTemplate,
    locationPath: string,
    newStatus: LocationServiceStatus
  ) => void;
}

const ServiceLocationTreeNode: React.FC<ServiceLocationTreeNodeProps> = ({
  name,
  fullPath,
  children,
  service,
  getLeafStatus,
  getProgressoLocalNode,
  onSetStatus,
}) => {
  // Se for agregador (Pasta de Andar, Apto, Galpão, etc.):
  // Níveis de Local (Pastas recursivas): <details><summary>{Nome Local} - {Progresso}%</summary>
  if (children !== null) {
    const progresso = getProgressoLocalNode(name, fullPath, children, service);

    return (
      <details className="ml-4 mt-2 border-l border-slate-700 pl-4">
        <summary className="cursor-pointer py-1.5 text-xs font-semibold text-slate-300 hover:text-white select-none">
          {name} - {progresso}%
        </summary>
        <div className="space-y-1 mt-1">
          {Object.keys(children).map((childKey) => (
            <ServiceLocationTreeNode
              key={fullPath ? `${fullPath} - ${childKey}` : childKey}
              name={childKey}
              fullPath={fullPath ? `${fullPath} - ${childKey}` : childKey}
              children={children[childKey]}
              service={service}
              getLeafStatus={getLeafStatus}
              getProgressoLocalNode={getProgressoLocalNode}
              onSetStatus={onSetStatus}
            />
          ))}
        </div>
      </details>
    );
  }

  // Leaf Node (Ambiente): Renderize uma <div className="flex"> exibindo apenas o Nome, os botões de ação e a label de 100% ou 0%
  const currentStatus = getLeafStatus(service, fullPath);
  const progresso = (currentStatus === 'Concluído' || currentStatus === 'Finalizado') ? 100 : 0;

  return (
    <div className="flex justify-between items-center ml-4 p-2 border-b border-slate-800 hover:bg-slate-800/40 transition-colors gap-3">
      <span className="text-xs text-slate-200">{name}</span>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSetStatus(service, fullPath, 'Em andamento')}
            className={`px-2.5 py-1 text-xs font-semibold rounded bg-green-500 hover:bg-green-600 text-white cursor-pointer transition-colors ${
              currentStatus === 'Em andamento' ? 'ring-2 ring-white/70 shadow-sm' : 'opacity-90'
            }`}
          >
            Iniciar
          </button>
          <button
            type="button"
            onClick={() => onSetStatus(service, fullPath, 'Paralisado')}
            className={`px-2.5 py-1 text-xs font-semibold rounded bg-yellow-500 hover:bg-yellow-400 text-slate-950 cursor-pointer transition-colors ${
              currentStatus === 'Paralisado' ? 'ring-2 ring-white/70 shadow-sm' : 'opacity-90'
            }`}
          >
            Paralisar
          </button>
          <button
            type="button"
            onClick={() => onSetStatus(service, fullPath, 'Concluído')}
            className={`px-2.5 py-1 text-xs font-semibold rounded bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transition-colors ${
              currentStatus === 'Concluído' ? 'ring-2 ring-white/70 shadow-sm' : 'opacity-90'
            }`}
          >
            Finalizar
          </button>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            progresso === 100
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          {progresso}%
        </span>
      </div>
    </div>
  );
};

export const ServiceExecutionView: React.FC<ServiceExecutionViewProps> = ({
  onOpenMapBuilder,
}) => {
  const {
    currentWork,
    services,
    createService,
    updateServiceLocationStatus,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Pavimentos/locais cadastrados no mapa da obra
  const workFloors = useMemo(() => {
    return (currentWork.floors || []).filter((fl) => fl.isActive);
  }, [currentWork.floors]);

  // Árvore Dinâmica Universal dos Locais gerada a partir dos caminhos split(' - ')
  const locationTree = useMemo(() => {
    const paths = workFloors.map((f) => f.name);
    return buildLocationTree(paths);
  }, [workFloors]);

  // Helper para obter status do serviço no local
  const getLeafStatus = (service: EAPServiceTemplate, fullPath: string): LocationServiceStatus => {
    const matchingService = services.find(
      (s) =>
        s.workId === currentWork.id &&
        (s.eapServiceCode === service.code || s.name.toLowerCase() === service.name.toLowerCase())
    );
    if (!matchingService) return 'Não iniciado';
    const loc = (matchingService.locationProgress || []).find(
      (lp) =>
        lp.locationName === fullPath ||
        lp.locationId === fullPath ||
        fullPath.endsWith(lp.locationName) ||
        lp.locationName.endsWith(fullPath)
    );
    return loc
      ? (loc.status as LocationServiceStatus)
      : ((matchingService.status as LocationServiceStatus) || 'Não iniciado');
  };

  /**
   * Motor de Cálculo (Bottom-Up): getProgresso(node)
   * Se node for Leaf Node (ambiente final): retorne 100 se o status for 'Finalizado'/'Concluído', e 0 se não for.
   * Se node for um agregador: retorne OBRIGATORIAMENTE a Média Aritmética de todos os filhos diretos e indiretos.
   */
  const getProgressoLocalNode = (
    name: string,
    fullPath: string,
    children: Record<string, any> | null,
    service: EAPServiceTemplate
  ): number => {
    // Leaf Node
    if (children === null) {
      const status = getLeafStatus(service, fullPath);
      return status === 'Concluído' || status === 'Finalizado' ? 100 : 0;
    }

    // Agregador: Média aritmética dos filhos
    const childKeys = Object.keys(children);
    if (childKeys.length === 0) return 0;

    const sum = childKeys.reduce((acc, childKey) => {
      const childPath = fullPath ? `${fullPath} - ${childKey}` : childKey;
      return acc + getProgressoLocalNode(childKey, childPath, children[childKey], service);
    }, 0);

    return Math.round(sum / childKeys.length);
  };

  // getProgresso para Nível 2 (Serviço)
  const getServiceProgresso = (service: EAPServiceTemplate): number => {
    const rootKeys = Object.keys(locationTree);
    if (rootKeys.length === 0) return 0;

    const sum = rootKeys.reduce((acc, rootKey) => {
      return (
        acc + getProgressoLocalNode(rootKey, rootKey, locationTree[rootKey], service)
      );
    }, 0);

    return Math.round(sum / rootKeys.length);
  };

  // getProgresso para Nível 1 (Disciplina)
  const getDisciplineProgresso = (discipline: MasterDiscipline): number => {
    if (discipline.services.length === 0) return 0;

    const sum = discipline.services.reduce((acc, srv) => {
      return acc + getServiceProgresso(srv);
    }, 0);

    return Math.round(sum / discipline.services.length);
  };

  // Alterar status de um serviço em um local específico
  const handleSetStatus = (
    service: EAPServiceTemplate,
    locationPath: string,
    newStatus: LocationServiceStatus
  ) => {
    const floorMatch = workFloors.find((f) => f.name === locationPath);
    const locationId = floorMatch ? floorMatch.id : `loc-${encodeURIComponent(locationPath)}`;

    const existingService = services.find(
      (s) =>
        s.workId === currentWork.id &&
        (s.eapServiceCode === service.code || s.name.toLowerCase() === service.name.toLowerCase())
    );

    if (existingService) {
      updateServiceLocationStatus(existingService.id, locationId, locationPath, newStatus);
    } else {
      createService({
        workId: currentWork.id,
        floorId: locationId,
        floorName: locationPath,
        name: service.name,
        area: service.subCategoryName || 'Obra Geral',
        status: newStatus,
        responsibleName: service.defaultResponsible || 'Engenheiro Residente',
        startDate: new Date().toISOString().substring(0, 10),
        predictedEndDate: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10),
        eapServiceCode: service.code,
        categoryCode: service.categoryCode,
        categoryName: service.categoryName,
        checklist: service.checklist || [],
        assignedEmployees: [],
        locationProgress: [
          {
            locationId,
            locationName: locationPath,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          },
        ],
        proofPhotos: [],
      });
    }

    showToast({
      type: 'success',
      title: 'Status Atualizado',
      message: `${service.name}: marcado como "${newStatus}" em "${locationPath}".`,
    });
  };

  // Disciplinas filtradas caso haja busca e ordenadas pela sequência construtiva
  const filteredDisciplines = useMemo(() => {
    let list: MasterDiscipline[] = MASTER_DISCIPLINES;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = MASTER_DISCIPLINES.map((discipline) => {
        const matchesDisc = discipline.technicalName.toLowerCase().includes(term);
        const filteredServices = discipline.services.filter(
          (srv) => srv.name.toLowerCase().includes(term) || srv.code.includes(term)
        );

        if (matchesDisc) return discipline;
        if (filteredServices.length > 0) {
          return {
            ...discipline,
            services: filteredServices,
          };
        }
        return null;
      }).filter(Boolean) as MasterDiscipline[];
    }

    return [...list].sort((a, b) => getDisciplineMeta(a).order - getDisciplineMeta(b).order);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-primary/20 text-primary font-mono text-xs font-bold border border-primary/30">
                VISÃO MATRICIAL
              </span>
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Andamento da Obra • Disciplina → Serviço → Locais
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Estrutura matricial bottom-up: Disciplina → Serviço → Árvore de Locais com cálculo de progresso ponderado.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenMapBuilder && (
              <button
                type="button"
                onClick={onOpenMapBuilder}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer shrink-0"
              >
                <Compass className="w-4 h-4 text-primary" />
                <span>Mapa da Obra (Etapa 1)</span>
              </button>
            )}
          </div>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por disciplina ou serviço técnico..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* =========================================================================
          ESTRUTURA MATRICIAL EM CASCATA:
          Nível 1 (Disciplina) -> Nível 2 (Serviço) -> Níveis de Local -> Leaf Node
          TODAS as tags <details> iniciam fechadas. Sem CSS Grid para listas.
          ========================================================================= */}
      <div className="space-y-3">
        {filteredDisciplines.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500">
            Nenhuma disciplina encontrada com o filtro pesquisado.
          </div>
        ) : (
          filteredDisciplines.map((discipline) => {
            const disciplineProgress = getDisciplineProgresso(discipline);

            return (
              // Nível 1 (Disciplina): <details><summary>{Nome Disciplina} - {Progresso}%</summary>
              <details
                key={discipline.id}
                className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden mb-3 shadow-md"
              >
                <summary className="p-3.5 bg-slate-900 hover:bg-slate-850 cursor-pointer select-none font-bold text-xs sm:text-sm text-white flex items-center justify-between border-b border-slate-800/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <span>{getDisciplineMeta(discipline).icon}</span>
                    <span className="truncate">{discipline.technicalName} - {disciplineProgress}%</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 shrink-0">
                    {discipline.services.length} {discipline.services.length === 1 ? 'serviço' : 'serviços'}
                  </span>
                </summary>

                <div className="p-3 space-y-2 bg-slate-950/40">
                  {discipline.services.map((service) => {
                    const serviceProgress = getServiceProgresso(service);

                    return (
                      // Nível 2 (Serviço): <details><summary>{Nome Serviço} - {Progresso}%</summary>
                      <details
                        key={service.code}
                        className="border border-slate-800/80 rounded-lg bg-slate-900/60 overflow-hidden mb-2"
                      >
                        <summary className="p-2.5 bg-slate-900/80 hover:bg-slate-800/70 cursor-pointer select-none font-semibold text-xs text-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded shrink-0">
                              {service.code}
                            </span>
                            <span className="truncate">{service.name} - {serviceProgress}%</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {workFloors.length} {workFloors.length === 1 ? 'local' : 'locais'}
                          </span>
                        </summary>

                        <div className="p-2.5 space-y-1 bg-slate-950/30">
                          {Object.keys(locationTree).length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-500">
                              Nenhum local cadastrado no Mapa da Obra.
                            </div>
                          ) : (
                            Object.keys(locationTree).map((rootKey) => (
                              <ServiceLocationTreeNode
                                key={rootKey}
                                name={rootKey}
                                fullPath={rootKey}
                                children={locationTree[rootKey]}
                                service={service}
                                getLeafStatus={getLeafStatus}
                                getProgressoLocalNode={getProgressoLocalNode}
                                onSetStatus={handleSetStatus}
                              />
                            ))
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </details>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ServiceExecutionView;
