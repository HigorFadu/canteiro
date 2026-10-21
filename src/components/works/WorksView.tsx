import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUp,
  ArrowDown,
  Edit2,
  Eye,
  Power,
  RotateCcw,
  SlidersHorizontal,
  X,
  Building,
  Trash2,
  ListTree,
  ChevronDown,
  ChevronUp,
  FolderTree,
  GripVertical,
  TrendingUp,
} from 'lucide-react';
import { Work, WorkType, WorkStatus, Floor, LocationServiceStatus } from '../../types';
import { AddWorkMapModal } from './AddWorkMapModal';
import { MASTER_DISCIPLINES, getDisciplineMeta } from '../../data/masterDisciplines';
import { EAPServiceTemplate } from '../../data/eapTemplates';

// Função Construtora da Árvore (Tree Builder)
function buildTree(paths: string[]) {
  const root: Record<string, any> = {};
  paths.forEach(path => {
    const parts = path.split(' - ');
    let current = root;
    parts.forEach((part, index) => {
      if (!current[part]) { current[part] = index === parts.length - 1 ? null : {}; }
      current = current[part];
    });
  });
  return root;
}

// Componente Recursivo (<TreeNode/>)
interface TreeNodeProps {
  children: Record<string, any> | null;
  fullPath: string;
  name: string;
  isRoot?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEdit?: (fullPath: string) => void;
  onDelete?: (fullPath: string) => void;
  onApontarServico?: (fullPath: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  children,
  fullPath,
  name,
  isRoot,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onApontarServico,
}) => {
  // SE tiver filhos (children !== null): Renderize OBRIGATORIAMENTE a tag HTML <details className="ml-4 mt-2 border-l border-slate-700 pl-4"> (sem open para iniciar fechada)
  if (children !== null) {
    return (
      <details className="ml-4 mt-2 border-l border-slate-700 pl-4">
        <summary className="cursor-pointer font-semibold py-2 text-white hover:text-blue-400 select-none flex items-center justify-between pr-2">
          <div className="flex items-center gap-2 min-w-0">
            {isRoot && (
              <div
                className="flex items-center gap-1 shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <button
                  type="button"
                  disabled={!canMoveUp}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMoveUp?.();
                  }}
                  className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                    canMoveUp
                      ? 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer shadow-sm'
                      : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-40'
                  }`}
                  title="Subir pavimento"
                >
                  ⬆️
                </button>
                <button
                  type="button"
                  disabled={!canMoveDown}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMoveDown?.();
                  }}
                  className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                    canMoveDown
                      ? 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer shadow-sm'
                      : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-40'
                  }`}
                  title="Descer pavimento"
                >
                  ⬇️
                </button>
              </div>
            )}
            <span className="truncate">{name}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onApontarServico && onApontarServico(fullPath);
            }}
            className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            🛠️ Apontar Serviço
          </button>
        </summary>
        {Object.keys(children).map((childKey) => (
          <TreeNode
            key={fullPath ? `${fullPath} - ${childKey}` : childKey}
            name={childKey}
            fullPath={fullPath ? `${fullPath} - ${childKey}` : childKey}
            children={children[childKey]}
            onEdit={onEdit}
            onDelete={onDelete}
            onApontarServico={onApontarServico}
          />
        ))}
      </details>
    );
  }

  // SE NÃO tiver filhos (Leaf Node): NÃO USE GRID. Renderize uma div simples em linha:
  return (
    <div className="flex justify-between items-center ml-4 p-2 border-b border-slate-800">
      <div className="flex items-center gap-2 min-w-0">
        {isRoot && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={onMoveUp}
              className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                canMoveUp
                  ? 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer shadow-sm'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-40'
              }`}
              title="Subir pavimento"
            >
              ⬆️
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={onMoveDown}
              className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                canMoveDown
                  ? 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer shadow-sm'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-40'
              }`}
              title="Descer pavimento"
            >
              ⬇️
            </button>
          </div>
        )}
        <span className="text-xs sm:text-sm text-slate-200 truncate">{name}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit && onEdit(fullPath)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          title="Editar ambiente"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={() => onDelete && onDelete(fullPath)}
          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-xs"
          title="Excluir ambiente"
        >
          🗑️
        </button>
        <button
          type="button"
          onClick={() => onApontarServico && onApontarServico(fullPath)}
          className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors"
        >
          🛠️ Apontar Serviço
        </button>
      </div>
    </div>
  );
};

export const WorksView: React.FC = () => {
  const {
    works,
    currentWork,
    setCurrentWork,
    createWork,
    editWork,
    toggleWorkActive,
    deleteWork,
    createFloor,
    editFloor,
    toggleFloorActive,
    deleteFloor,
    reorderFloors,
    materials,
    employees,
    services,
    occurrences,
    alerts,
    createService,
    updateServiceLocationStatus,
    hasPermission,
    requestConfirmation,
    showToast,
    setCurrentTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | WorkStatus>('Todos');
  const [typeFilter, setTypeFilter] = useState<'Todos' | WorkType>('Todos');

  // Modal states
  const [isAddWorkModalOpen, setIsAddWorkModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [selectedDetailWork, setSelectedDetailWork] = useState<Work | null>(null);
  const [dashboardWork, setDashboardWork] = useState<Work | null>(null);
  const [apontamentoLocation, setApontamentoLocation] = useState<string | null>(null);

  // Floor modal states
  const [isAddFloorModalOpen, setIsAddFloorModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [floorNameInput, setFloorNameInput] = useState('');
  const [floorSearchTerm, setFloorSearchTerm] = useState('');

  // Filtered works
  const filteredWorks = works.filter((work) => {
    const matchesSearch =
      work.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (work.code && work.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      work.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || work.status === statusFilter;
    const matchesType = typeFilter === 'Todos' || work.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const openAddWorkModal = () => {
    setEditingWork(null);
    setIsAddWorkModalOpen(true);
  };

  const openEditWorkModal = (work: Work) => {
    setEditingWork(work);
    setIsAddWorkModalOpen(true);
  };

  const handleToggleWorkActive = (work: Work) => {
    if (work.isActive) {
      requestConfirmation({
        title: 'Tem certeza que deseja inativar esta obra?',
        message: `A obra "${work.name}" será marcada como inativa. Todo o histórico operacional continuará preservado.`,
        isDestructive: true,
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => {
          toggleWorkActive(work.id);
        },
      });
    } else {
      requestConfirmation({
        title: 'Reativar obra?',
        message: `Deseja reativar a obra "${work.name}" no sistema?`,
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => {
          toggleWorkActive(work.id);
        },
      });
    }
  };

  const handleDeleteWorkWithConfirm = (work: Work) => {
    if (works.length <= 1) {
      showToast({
        type: 'warning',
        title: 'Operação não permitida',
        message: 'A empresa precisa manter pelo menos uma obra cadastrada no sistema.',
      });
      return;
    }

    const hasOperationalData = 
      materials.some(m => m.workId === work.id) ||
      employees.some(e => e.workId === work.id);

    if (hasOperationalData) {
      showToast({
        type: 'warning',
        title: 'Obra com dados operacionais',
        message: `A obra "${work.name}" possui materiais ou funcionários vinculados. Utilize "Inativar" para preservar o histórico.`,
      });
      return;
    }

    requestConfirmation({
      title: 'Excluir este registro?',
      message: 'Esta ação não poderá ser desfeita.',
      isDestructive: true,
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        deleteWork(work.id);
        if (currentWork.id === work.id) {
          const remaining = works.filter(w => w.id !== work.id);
          if (remaining.length > 0) {
            setCurrentWork(remaining[0]);
          }
        }
      },
    });
  };

  const handleDeleteFloorWithConfirm = (floor: Floor, workId: string) => {
    const hasServices = services.some(s => s.floorId === floor.id);
    if (hasServices) {
      showToast({
        type: 'warning',
        title: 'Pavimento com serviços',
        message: `O pavimento "${floor.name}" possui frentes de serviço vinculadas. Inative o pavimento para preservar o histórico.`,
      });
      return;
    }

    requestConfirmation({
      title: 'Excluir este registro?',
      message: 'Esta ação não poderá ser desfeita.',
      isDestructive: true,
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        deleteFloor(floor.id, workId);
      },
    });
  };

  // Floor handling
  const activeDetailWork = selectedDetailWork
    ? works.find((w) => w.id === selectedDetailWork.id) || selectedDetailWork
    : null;

  const handleAddFloor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!floorNameInput.trim() || !activeDetailWork) return;

    if (editingFloor) {
      editFloor(editingFloor.id, floorNameInput.trim(), activeDetailWork.id);
      setEditingFloor(null);
    } else {
      const nextLevel = activeDetailWork.floors.length;
      createFloor(floorNameInput.trim(), nextLevel, activeDetailWork.id);
    }
    setFloorNameInput('');
    setIsAddFloorModalOpen(false);
  };

  const handleMoveFloor = (floorIndex: number, direction: 'up' | 'down') => {
    if (!activeDetailWork) return;
    const targetIndex = direction === 'up' ? floorIndex - 1 : floorIndex + 1;
    if (targetIndex < 0 || targetIndex >= activeDetailWork.floors.length) return;

    const newFloors = [...activeDetailWork.floors];
    const temp = newFloors[floorIndex];
    newFloors[floorIndex] = newFloors[targetIndex];
    newFloors[targetIndex] = temp;

    reorderFloors(
      activeDetailWork.id,
      newFloors.map((f) => f.id)
    );
  };

  const getServiceStatusAtLocation = (srv: EAPServiceTemplate, locationPath: string): LocationServiceStatus => {
    if (!activeDetailWork) return 'Não iniciado';
    const match = services.find(
      (s) =>
        s.workId === activeDetailWork.id &&
        (s.eapServiceCode === srv.code || s.name.toLowerCase() === srv.name.toLowerCase())
    );
    if (!match) return 'Não iniciado';
    const loc = (match.locationProgress || []).find(
      (lp) =>
        lp.locationName === locationPath ||
        lp.locationId === locationPath ||
        locationPath.endsWith(lp.locationName) ||
        lp.locationName.endsWith(locationPath)
    );
    return loc ? (loc.status as LocationServiceStatus) : ((match.status as LocationServiceStatus) || 'Não iniciado');
  };

  const handleSetApontamentoStatus = (
    srv: EAPServiceTemplate,
    locationPath: string,
    newStatus: LocationServiceStatus
  ) => {
    if (!activeDetailWork) return;

    const floorMatch = activeDetailWork.floors.find((f) => f.name === locationPath);
    const locationId = floorMatch ? floorMatch.id : `loc-${encodeURIComponent(locationPath)}`;

    const existingService = services.find(
      (s) =>
        s.workId === activeDetailWork.id &&
        (s.eapServiceCode === srv.code || s.name.toLowerCase() === srv.name.toLowerCase())
    );

    if (existingService) {
      updateServiceLocationStatus(existingService.id, locationId, locationPath, newStatus);
    } else {
      createService({
        workId: activeDetailWork.id,
        floorId: locationId,
        floorName: locationPath,
        name: srv.name,
        area: srv.subCategoryName || 'Obra Geral',
        status: newStatus,
        responsibleName: srv.defaultResponsible || 'Engenheiro Residente',
        startDate: new Date().toISOString().substring(0, 10),
        predictedEndDate: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10),
        eapServiceCode: srv.code,
        categoryCode: srv.categoryCode,
        categoryName: srv.categoryName,
        checklist: srv.checklist || [],
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
      message: `${srv.name}: marcado como "${newStatus}" em "${locationPath}".`,
    });
  };

  // Estrutura em Árvore Hierárquica construída via buildTree
  const treeData = useMemo(() => {
    if (!activeDetailWork?.floors) return {};
    const paths = activeDetailWork.floors
      .map((f) => f.name)
      .filter((name) => {
        if (!floorSearchTerm.trim()) return true;
        return name.toLowerCase().includes(floorSearchTerm.toLowerCase());
      });
    return buildTree(paths);
  }, [activeDetailWork?.floors, floorSearchTerm]);

  // Reordenação de Pavimentos Raiz [⬆️] e [⬇️]
  const handleMoveRootFloor = (rootKey: string, direction: 'up' | 'down') => {
    if (!activeDetailWork?.floors) return;
    const roots = Object.keys(treeData);
    const idx = roots.indexOf(rootKey);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= roots.length) return;

    // Troque a posição do rootKey com o vizinho (idx - 1 ou idx + 1)
    const newRoots = [...roots];
    const temp = newRoots[idx];
    newRoots[idx] = newRoots[targetIdx];
    newRoots[targetIdx] = temp;

    // Reordene o array activeDetailWork.floors agrupando os pisos conforme a nova ordem de roots (f.name === r || f.name.startsWith(r + ' - '))
    const reorderedFloors: Floor[] = [];
    newRoots.forEach((r) => {
      const matching = activeDetailWork.floors.filter(
        (f) => f.name === r || f.name.startsWith(r + ' - ')
      );
      reorderedFloors.push(...matching);
    });

    const addedIds = new Set(reorderedFloors.map((f) => f.id));
    activeDetailWork.floors.forEach((f) => {
      if (!addedIds.has(f.id)) {
        reorderedFloors.push(f);
      }
    });

    setSelectedDetailWork({
      ...activeDetailWork,
      floors: reorderedFloors,
    });

    reorderFloors(
      activeDetailWork.id,
      reorderedFloors.map((f) => f.id)
    );
  };

  // Métricas e progresso por disciplina para o Modal Dashboard Executivo
  const dashboardStats = useMemo(() => {
    if (!dashboardWork) {
      return {
        overallProgress: 0,
        completedEnvironments: 0,
        totalEnvironments: 0,
        totalIssues: 0,
        occurrencesCount: 0,
        alertsCount: 0,
        disciplineProgressList: [] as {
          discipline: typeof MASTER_DISCIPLINES[0];
          order: number;
          icon: string;
          progress: number;
        }[],
      };
    }

    const floors = dashboardWork.floors || [];
    const totalEnvironments = floors.length;

    // Ocorrências e alertas associados à obra
    const workOccurrences = (occurrences || []).filter((o) => o.workId === dashboardWork.id);
    const workAlerts = (alerts || []).filter((a) => a.workId === dashboardWork.id);
    const totalIssues = workOccurrences.length + workAlerts.length;

    const workServices = services.filter((s) => s.workId === dashboardWork.id);

    // Helper de status de serviço em um ambiente
    const getSrvStatus = (srv: EAPServiceTemplate, locationPath: string): LocationServiceStatus => {
      const match = workServices.find(
        (s) => s.eapServiceCode === srv.code || s.name.toLowerCase() === srv.name.toLowerCase()
      );
      if (!match) return 'Não iniciado';
      const loc = (match.locationProgress || []).find(
        (lp) =>
          lp.locationName === locationPath ||
          lp.locationId === locationPath ||
          locationPath.endsWith(lp.locationName) ||
          lp.locationName.endsWith(locationPath)
      );
      return loc ? (loc.status as LocationServiceStatus) : ((match.status as LocationServiceStatus) || 'Não iniciado');
    };

    // Ambientes Concluídos
    let completedEnvironments = 0;
    floors.forEach((fl) => {
      const statuses = workServices.map((s) => {
        const loc = (s.locationProgress || []).find(
          (lp) => lp.locationName === fl.name || lp.locationId === fl.id || fl.name.endsWith(lp.locationName)
        );
        return loc ? loc.status : s.status;
      });
      if (statuses.length > 0 && statuses.every((st) => st === 'Concluído' || st === 'Finalizado')) {
        completedEnvironments++;
      }
    });

    // Disciplinas ordenadas cronologicamente com progresso
    const sortedDisciplines = [...MASTER_DISCIPLINES].sort(
      (a, b) => getDisciplineMeta(a).order - getDisciplineMeta(b).order
    );

    const disciplineProgressList = sortedDisciplines.map((discipline) => {
      const meta = getDisciplineMeta(discipline);
      if (discipline.services.length === 0 || totalEnvironments === 0) {
        return {
          discipline,
          order: meta.order,
          icon: meta.icon,
          progress: 0,
        };
      }

      let disciplineSum = 0;
      discipline.services.forEach((srv) => {
        let srvSum = 0;
        floors.forEach((fl) => {
          const st = getSrvStatus(srv, fl.name);
          if (st === 'Concluído' || st === 'Finalizado') {
            srvSum += 100;
          } else if (st === 'Em andamento') {
            srvSum += 50;
          }
        });
        disciplineSum += srvSum / totalEnvironments;
      });

      const avg = Math.round(disciplineSum / discipline.services.length);
      return {
        discipline,
        order: meta.order,
        icon: meta.icon,
        progress: avg,
      };
    });

    const activeDisciplinesCount = disciplineProgressList.length;
    const overallProgress = activeDisciplinesCount > 0
      ? Math.round(disciplineProgressList.reduce((acc, d) => acc + d.progress, 0) / activeDisciplinesCount)
      : 0;

    return {
      overallProgress,
      completedEnvironments,
      totalEnvironments,
      totalIssues,
      occurrencesCount: workOccurrences.length,
      alertsCount: workAlerts.length,
      disciplineProgressList,
    };
  }, [dashboardWork, services, occurrences, alerts]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: 'var(--btn-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--btn-primary)'
              }}
            >
              <Building2 className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Obras</h1>
              <p className="text-xs text-slate-400">
                Gerenciamento de empreendimentos, obras e pavimentos da empresa
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddWorkModal}
          className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
          style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          title="Adicionar obra"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar obra</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome da obra, código ou cidade..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-[var(--btn-primary)]"
          >
            <option value="Todos">Todos os status</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Paralisada">Paralisada</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-[var(--btn-primary)]"
          >
            <option value="Todos">Todos os tipos</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Reforma">Reforma</option>
            <option value="Infraestrutura">Infraestrutura</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorks.map((work) => {
          const isSelected = work.id === currentWork.id;
          return (
            <div
              key={work.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[var(--btn-primary)]/50 ring-1 ring-[var(--btn-primary)]/30'
                  : work.isActive
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800/60 opacity-60 bg-slate-900/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {work.type}
                      </span>
                      {work.code && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {work.code}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white truncate" title={work.name}>
                      {work.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      work.status === 'Concluída'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : work.status === 'Paralisada'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-[var(--btn-primary)]/10 text-[var(--btn-primary)] border border-[var(--btn-primary)]/20'
                    }`}
                  >
                    {work.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {work.address ? `${work.address}, ` : ''}{work.city} - {work.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>
                      {work.floors?.length || work.totalFloors} pavimentos cadastrados
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Estrutura de Pavimentos
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-300">
                    {(() => {
                      const realSubsolosCount = work.floors ? Array.from(new Set(work.floors.map(f => f.name.split(' - ')[0]))).filter(r => r.toLowerCase().startsWith('subsolo')).length : work.basementCount;
                      return realSubsolosCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                          {realSubsolosCount} subsolos
                        </span>
                      ) : null;
                    })()}
                    {work.hasGroundFloor && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                        Térreo
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                      {work.totalFloors} andares
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDashboardWork(work)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Dashboard Executivo da Obra"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver detalhes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDetailWork(work)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Mapa da Obra e Árvore de Locais"
                  >
                    <ListTree className="w-3.5 h-3.5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                    <span>Mapa</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {!isSelected ? (
                    <button
                      type="button"
                      onClick={() => setCurrentWork(work)}
                      className="px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer"
                      style={{
                        backgroundColor: 'var(--btn-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--btn-primary)',
                      }}
                    >
                      Definir ativa
                    </button>
                  ) : (
                    <span 
                      className="text-[10px] font-bold px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'var(--btn-primary)',
                        color: 'var(--btn-primary-text)',
                      }}
                    >
                      Obra ativa
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleWorkActive(work)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      work.isActive
                        ? 'text-slate-400 hover:text-[var(--btn-primary)] hover:bg-[var(--btn-secondary)]'
                        : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                    title={work.isActive ? 'Inativar' : 'Reativar'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteWorkWithConfirm(work)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWorks.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-3">
          <p>Nenhuma obra encontrada para os filtros selecionados.</p>
          <button
            type="button"
            onClick={openAddWorkModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer hover:opacity-90"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar obra</span>
          </button>
        </div>
      )}

      {/* Modal: Construtor Dinâmico do Mapa da Obra */}
      <AddWorkMapModal
        isOpen={isAddWorkModalOpen}
        onClose={() => {
          setIsAddWorkModalOpen(false);
          setEditingWork(null);
        }}
        workToEdit={editingWork}
      />

      {/* Modal / Drawer: Detalhes da Obra & Gerenciamento de Andares */}
      {activeDetailWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--btn-primary)]/10 text-[var(--btn-primary)] border border-[var(--btn-primary)]/20">
                    {activeDetailWork.type}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {activeDetailWork.status}
                  </span>
                </div>
                <h2 className="text-lg font-black text-white mt-1">
                  {activeDetailWork.name}
                </h2>
                <p className="text-xs text-slate-400">
                  {activeDetailWork.address ? `${activeDetailWork.address}, ` : ''}
                  {activeDetailWork.city} - {activeDetailWork.state}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetailWork(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Obra Summary Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Código</span>
                <span className="text-xs font-mono font-bold text-white">
                  {activeDetailWork.code || 'Não informado'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Locais / Ambientes</span>
                <span className="text-xs font-bold text-white">
                  {activeDetailWork.floors.length} ambientes
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Subsolos</span>
                <span className="text-xs font-bold text-white">
                  {(() => {
                    const realSubsolosCount = activeDetailWork.floors ? Array.from(new Set(activeDetailWork.floors.map(f => f.name.split(' - ')[0]))).filter(r => r.toLowerCase().startsWith('subsolo')).length : activeDetailWork.basementCount;
                    return realSubsolosCount > 0 ? `${realSubsolosCount} subsolos` : 'Nenhum';
                  })()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Térreo</span>
                <span className="text-xs font-bold text-white">
                  {activeDetailWork.hasGroundFloor ? 'Possui térreo' : 'Sem térreo'}
                </span>
              </div>
            </div>

            {/* Árvore de Locais e Ambientes (Agrupamento Hierárquico) */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                    <h3 className="text-sm font-bold text-white">Árvore de Locais e Ambientes</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] font-bold border border-slate-700">
                      {activeDetailWork.floors.length} {activeDetailWork.floors.length === 1 ? 'local' : 'locais'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Estrutura hierárquica de pavimentos e ambientes agrupados da obra
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFloor(null);
                      setFloorNameInput('');
                      setIsAddFloorModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar ambiente</span>
                  </button>
                </div>
              </div>

              {/* Filtro Rápido de Ambientes (para obras com muitos cômodos) */}
              {activeDetailWork.floors.length > 6 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Filtrar por pavimento, cômodo ou ambiente..."
                    value={floorSearchTerm}
                    onChange={(e) => setFloorSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                  />
                  {floorSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setFloorSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              {/* Injeção na UI: Árvore Recursiva de Locais e Ambientes sem GRID */}
              <div className="rounded-xl max-h-[50vh] overflow-y-auto pr-1">
                {Object.keys(treeData).length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500">
                    Nenhum ambiente encontrado com o filtro pesquisado.
                  </div>
                ) : (
                  Object.keys(treeData).map((rootKey, idx, arr) => (
                    <TreeNode
                      key={rootKey}
                      name={rootKey}
                      fullPath={rootKey}
                      children={treeData[rootKey]}
                      isRoot={true}
                      canMoveUp={idx > 0}
                      canMoveDown={idx < arr.length - 1}
                      onMoveUp={() => handleMoveRootFloor(rootKey, 'up')}
                      onMoveDown={() => handleMoveRootFloor(rootKey, 'down')}
                      onEdit={(path) => {
                        const floor = activeDetailWork?.floors.find((f) => f.name === path);
                        if (floor) {
                          setEditingFloor(floor);
                          setFloorNameInput(floor.name);
                          setIsAddFloorModalOpen(true);
                        }
                      }}
                      onDelete={(path) => {
                        const floor = activeDetailWork?.floors.find((f) => f.name === path);
                        if (floor && activeDetailWork) {
                          handleDeleteFloorWithConfirm(floor, activeDetailWork.id);
                        }
                      }}
                      onApontarServico={(path) => {
                        setApontamentoLocation(path);
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedDetailWork(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pop-up: Apontamentos: {fullPath do local} (Location-First) */}
      {apontamentoLocation && activeDetailWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Header com título Apontamentos: {fullPath} */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-400 block tracking-wider">
                  Apontamento no Local
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  Apontamentos: {apontamentoLocation}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApontamentoLocation(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Disciplinas em <details> fechados */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {[...MASTER_DISCIPLINES]
                .sort((a, b) => getDisciplineMeta(a).order - getDisciplineMeta(b).order)
                .map((discipline) => (
                  <details
                    key={discipline.id}
                    className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 transition-all"
                  >
                    <summary className="p-3 bg-slate-900 hover:bg-slate-800/80 cursor-pointer select-none font-bold text-xs sm:text-sm text-white flex items-center justify-between border-b border-slate-800/40">
                      <div className="flex items-center gap-2">
                        <span>{getDisciplineMeta(discipline).icon}</span>
                        <span>{discipline.technicalName}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {discipline.services.length} serviços
                      </span>
                    </summary>

                  <div className="p-3 space-y-2.5 bg-slate-950/30">
                    {discipline.services.map((srv) => {
                      const currentStatus = getServiceStatusAtLocation(srv, apontamentoLocation);
                      return (
                        <div
                          key={srv.code}
                          className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                                {srv.code}
                              </span>
                              <span className="text-xs font-semibold text-white">
                                {srv.name}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Status atual: <span className="font-bold text-blue-400">{currentStatus}</span>
                            </div>
                          </div>

                          {/* Botões estáticos obrigatórios: [Iniciar], [Paralisar], [Finalizar] */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSetApontamentoStatus(srv, apontamentoLocation, 'Em andamento')}
                              className="px-2.5 py-1 rounded bg-green-500 hover:bg-green-600 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
                            >
                              Iniciar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetApontamentoStatus(srv, apontamentoLocation, 'Paralisado')}
                              className="px-2.5 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs cursor-pointer shadow-sm transition-all"
                            >
                              Paralisar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetApontamentoStatus(srv, apontamentoLocation, 'Concluído')}
                              className="px-2.5 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
                            >
                              Finalizar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900">
              <button
                type="button"
                onClick={() => setApontamentoLocation(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar / Editar Ambiente ou Local */}
      {isAddFloorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingFloor ? 'Editar ambiente / local' : 'Adicionar ambiente / local'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddFloorModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFloor} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome do ambiente ou pavimento *
                </label>
                <input
                  type="text"
                  required
                  value={floorNameInput}
                  onChange={(e) => setFloorNameInput(e.target.value)}
                  placeholder="Ex: 1º Andar - Apto 11 - Sala, Poço de Elevador..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddFloorModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl font-bold text-xs transition-colors"
                  style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dashboard Executivo da Obra */}
      {dashboardWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="p-1 rounded bg-[var(--btn-primary)]/10 text-[var(--btn-primary)] text-xs font-bold">
                    📊 Dashboard Executivo
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {dashboardWork.type}
                  </span>
                  {dashboardWork.code && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {dashboardWork.code}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      dashboardWork.status === 'Concluída'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : dashboardWork.status === 'Paralisada'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {dashboardWork.status}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                  {dashboardWork.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">
                    {dashboardWork.address ? `${dashboardWork.address}, ` : ''}
                    {dashboardWork.city} - {dashboardWork.state}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDashboardWork(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Fechar Dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Cards no Topo: % Progresso Geral, Ambientes Concluídos / Total de Ambientes, Ocorrências/Alertas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Card 1: % Progresso Geral */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Progresso Geral
                    </span>
                    <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                      <span>{dashboardStats.overallProgress}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Média ponderada das disciplinas
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 2: Ambientes Concluídos / Total de Ambientes */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Ambientes Concluídos
                    </span>
                    <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                      <span className="text-emerald-400">{dashboardStats.completedEnvironments}</span>
                      <span className="text-sm text-slate-500 font-normal">
                        / {dashboardStats.totalEnvironments}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {dashboardStats.totalEnvironments > 0
                        ? `${Math.round((dashboardStats.completedEnvironments / dashboardStats.totalEnvironments) * 100)}% finalizados`
                        : 'Sem ambientes'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 3: Ocorrências / Alertas da Obra */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Ocorrências & Alertas
                    </span>
                    <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                      <span className={dashboardStats.totalIssues > 0 ? 'text-amber-400' : 'text-slate-300'}>
                        {dashboardStats.totalIssues}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">registrados</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {dashboardStats.occurrencesCount} ocorrências • {dashboardStats.alertsCount} alertas
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Lista das Disciplinas da obra com barra de progresso (%) ordenada cronologicamente */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>Disciplinas da Obra (Sequência Construtiva)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {dashboardStats.disciplineProgressList.length} disciplinas
                  </span>
                </div>

                <div className="space-y-2">
                  {dashboardStats.disciplineProgressList.map((item) => (
                    <div
                      key={item.discipline.id}
                      className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{item.icon}</span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                            {item.discipline.technicalName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-white">
                            {item.progress}%
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.progress === 100
                              ? 'bg-emerald-500'
                              : item.progress > 0
                              ? 'bg-blue-500'
                              : 'bg-slate-700'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const targetWork = dashboardWork;
                  setDashboardWork(null);
                  setSelectedDetailWork(targetWork);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ListTree className="w-4 h-4 text-primary" />
                <span>Abrir Mapa da Obra</span>
              </button>

              <button
                type="button"
                onClick={() => setDashboardWork(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
