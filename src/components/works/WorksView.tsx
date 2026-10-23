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
  warningChecker?: (fullPath: string) => boolean;
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
  warningChecker,
}) => {
  const hasWarning = warningChecker ? warningChecker(fullPath) : false;

  // SE tiver filhos (children !== null): Renderize OBRIGATORIAMENTE a tag HTML <details className="ml-4 mt-2 border-l border-slate-700 pl-4"> (sem open para iniciar fechada)
  if (children !== null) {
    return (
      <details className="ml-4 mt-2 border-l border-slate-700 pl-4">
        <summary className="cursor-pointer font-semibold py-2 text-white hover:text-blue-400 select-none flex items-center justify-between pr-2">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
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
            {hasWarning && (
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-sm animate-pulse" title="Fechamento com instalações pendentes">
                ⚠️ Fechamento com instalações pendentes
              </span>
            )}
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
            warningChecker={warningChecker}
          />
        ))}
      </details>
    );
  }

  // SE NÃO tiver filhos (Leaf Node): NÃO USE GRID. Renderize uma div simples em linha:
  return (
    <div className="flex justify-between items-center ml-4 p-2 border-b border-slate-800">
      <div className="flex items-center gap-2 min-w-0 flex-wrap">
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
        {hasWarning && (
          <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-sm animate-pulse" title="Fechamento com instalações pendentes">
            ⚠️ Fechamento com instalações pendentes
          </span>
        )}
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
    editService,
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
  const [replicateFloor, setReplicateFloor] = useState<boolean>(false);

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

  // Dados de Mão de Obra, Profissional Responsável, Ajudantes e Motivo de Parada por Serviço e Local
  const [serviceLaborMap, setServiceLaborMap] = useState<
    Record<
      string,
      {
        laborType: 'propria' | 'terceirizada';
        contractorName: string;
        responsibleName: string;
        helpers: string[];
        stopReason?: string;
      }
    >
  >({});

  const updateLabor = (
    srvCode: string,
    locPath: string,
    data: Partial<{
      laborType: 'propria' | 'terceirizada';
      contractorName: string;
      responsibleName: string;
      stopReason?: string;
    }>
  ) => {
    const key = `${srvCode}_${locPath}`;
    setServiceLaborMap((prev) => {
      const current = prev[key] || {
        laborType: 'propria',
        contractorName: '',
        responsibleName: '',
        helpers: [],
      };
      return {
        ...prev,
        [key]: {
          ...current,
          ...data,
        },
      };
    });
  };

  const addHelper = (srvCode: string, locPath: string) => {
    const key = `${srvCode}_${locPath}`;
    setServiceLaborMap((prev) => {
      const current = prev[key] || {
        laborType: 'propria',
        contractorName: '',
        responsibleName: '',
        helpers: [],
      };
      return {
        ...prev,
        [key]: {
          ...current,
          helpers: [...current.helpers, ''],
        },
      };
    });
  };

  const updateHelper = (srvCode: string, locPath: string, index: number, value: string) => {
    const key = `${srvCode}_${locPath}`;
    setServiceLaborMap((prev) => {
      const current = prev[key] || {
        laborType: 'propria',
        contractorName: '',
        responsibleName: '',
        helpers: [],
      };
      const updated = [...current.helpers];
      updated[index] = value;
      return {
        ...prev,
        [key]: {
          ...current,
          helpers: updated,
        },
      };
    });
  };

  const removeHelper = (srvCode: string, locPath: string, index: number) => {
    const key = `${srvCode}_${locPath}`;
    setServiceLaborMap((prev) => {
      const current = prev[key] || {
        laborType: 'propria',
        contractorName: '',
        responsibleName: '',
        helpers: [],
      };
      return {
        ...prev,
        [key]: {
          ...current,
          helpers: current.helpers.filter((_, i) => i !== index),
        },
      };
    });
  };

  // Precedência construtiva: Identifica se é serviço de fechamento/acabamento (Reboco, Gesso, Forro ou Pintura)
  const isFechamentoService = (name: string, cat?: string, subCat?: string): boolean => {
    const text = `${name} ${cat || ''} ${subCat || ''}`.toLowerCase();
    return (
      text.includes('reboco') ||
      text.includes('gesso') ||
      text.includes('forro') ||
      text.includes('pintura') ||
      text.includes('emboço') ||
      text.includes('emboco') ||
      text.includes('drywall') ||
      text.includes('massa corrida')
    );
  };

  // Precedência construtiva: Verifica se as instalações (Elétrica e Hidráulica) estão 100% finalizadas no local
  const isInstallationsPendingAtLocation = (locationPath: string, workId: string): boolean => {
    const workServices = services.filter((s) => s.workId === workId);

    // Serviços de instalações elétricas ou hidráulicas
    const instServices = workServices.filter((s) => {
      const text = `${s.categoryName || ''} ${s.area || ''} ${s.name}`.toLowerCase();
      return (
        text.includes('elétric') ||
        text.includes('eletric') ||
        text.includes('hidráulic') ||
        text.includes('hidraulic')
      );
    });

    if (instServices.length === 0) {
      // Nenhuma instalação foi cadastrada/finalizada ainda neste local
      return true;
    }

    // Status de cada instalação relevante no local
    const relevantStatuses = instServices.map((s) => {
      const lp = (s.locationProgress || []).find(
        (l) => l.locationName === locationPath || l.locationId === locationPath || locationPath.endsWith(l.locationName)
      );
      return lp ? lp.status : s.status;
    });

    return relevantStatuses.some((st) => st !== 'Concluído' && st !== 'Finalizado');
  };

  // Precedência construtiva: Verificador para exibição do badge amarelo na árvore
  const checkLocationPrecedenceWarning = (locPath: string): boolean => {
    if (!activeDetailWork) return false;
    const workServices = services.filter((s) => s.workId === activeDetailWork.id);

    return workServices.some((s) => {
      const isFech = isFechamentoService(s.name, s.categoryName, s.area);
      if (!isFech) return false;

      return (s.locationProgress || []).some((lp) => {
        const matchesLoc =
          lp.locationName === locPath ||
          lp.locationName.startsWith(locPath + ' - ') ||
          locPath.startsWith(lp.locationName);
        if (!matchesLoc) return false;
        const isFin = lp.status === 'Concluído' || lp.status === 'Finalizado';
        if (!isFin) return false;

        return isInstallationsPendingAtLocation(lp.locationName, activeDetailWork.id);
      });
    });
  };

  // Lista oficial das 15 Disciplinas na sequência exata de obra
  const modalDisciplines = useMemo(() => {
    const allServices = MASTER_DISCIPLINES.flatMap((d) => d.services);

    const definitions = [
      { id: 'preliminares', order: 1, name: '1. Preliminares', icon: '🚜', technicalName: '1. Preliminares 🚜' },
      { id: 'fundacoes', order: 2, name: '2. Fundações', icon: '🏗️', technicalName: '2. Fundações 🏗️' },
      { id: 'estrutura', order: 3, name: '3. Estrutura', icon: '🏗️', technicalName: '3. Estrutura 🏗️' },
      { id: 'alvenaria', order: 4, name: '4. Alvenaria', icon: '🧱', technicalName: '4. Alvenaria 🧱' },
      { id: 'cobertura', order: 5, name: '5. Cobertura', icon: '🏠', technicalName: '5. Cobertura 🏠' },
      { id: 'eletrica', order: 6, name: '6. Elétrica', icon: '⚡', technicalName: '6. Elétrica ⚡' },
      { id: 'hidraulica', order: 7, name: '7. Hidráulica', icon: '💧', technicalName: '7. Hidráulica 💧' },
      { id: 'gas', order: 8, name: '8. Gás', icon: '🔥', technicalName: '8. Gás 🔥' },
      { id: 'incendio', order: 9, name: '9. Incêndio', icon: '🧯', technicalName: '9. Incêndio 🧯' },
      { id: 'climatizacao', order: 10, name: '10. Climatização', icon: '❄️', technicalName: '10. Climatização ❄️' },
      { id: 'revestimentos', order: 11, name: '11. Revestimentos', icon: '🛠️', technicalName: '11. Revestimentos 🛠️' },
      { id: 'esquadrias', order: 12, name: '12. Esquadrias', icon: '🚪', technicalName: '12. Esquadrias 🚪' },
      { id: 'pisos_loucas', order: 13, name: '13. Pisos/Louças', icon: '🚽', technicalName: '13. Pisos/Louças 🚽' },
      { id: 'pintura', order: 14, name: '14. Pintura', icon: '🎨', technicalName: '14. Pintura 🎨' },
      { id: 'limpeza', order: 15, name: '15. Limpeza', icon: '✨', technicalName: '15. Limpeza ✨' },
    ];

    return definitions.map((disc) => {
      let matchedServices = allServices.filter((srv) => {
        const meta = getDisciplineMeta(srv.name || srv.subCategoryName || '');
        if (disc.order === 1) return meta.order === 1;
        if (disc.order === 2) return meta.order === 2;
        if (disc.order === 3) return meta.order === 3;
        if (disc.order === 4) return meta.order === 4 && !srv.name.toLowerCase().includes('cobertura') && !srv.name.toLowerCase().includes('esquadria');
        if (disc.order === 5) return meta.order === 5 || srv.name.toLowerCase().includes('cobertura') || srv.name.toLowerCase().includes('impermeabiliz');
        if (disc.order === 6) return meta.order === 6;
        if (disc.order === 7) return meta.order === 7;
        if (disc.order === 8) return meta.order === 8;
        if (disc.order === 9) return meta.order === 9;
        if (disc.order === 10) return meta.order === 10;
        if (disc.order === 11) return (meta.order === 11 || srv.name.toLowerCase().includes('reboco') || srv.name.toLowerCase().includes('gesso')) && !srv.name.toLowerCase().includes('pintura') && !srv.name.toLowerCase().includes('piso');
        if (disc.order === 12) return meta.order === 12 || srv.name.toLowerCase().includes('esquadria') || srv.name.toLowerCase().includes('vidro') || srv.name.toLowerCase().includes('marcenaria');
        if (disc.order === 13) return meta.order === 13 || srv.name.toLowerCase().includes('piso') || srv.name.toLowerCase().includes('louça') || srv.name.toLowerCase().includes('bancada');
        if (disc.order === 14) return meta.order === 14 || srv.name.toLowerCase().includes('pintura') || srv.name.toLowerCase().includes('massa');
        if (disc.order === 15) return meta.order >= 15 || meta.order === 99;
        return false;
      });

      if (matchedServices.length === 0) {
        if (disc.order === 5) {
          matchedServices = [
            {
              id: 'srv-disc-05-01',
              code: '05.01.001',
              name: 'Impermeabilização de laje de cobertura com manta asfáltica',
              order: 1,
              categoryCode: '05',
              categoryName: 'Cobertura',
              subCategoryName: 'Impermeabilização e Coberturas',
              defaultResponsible: 'Impermeabilizador / Oficial',
              defaultEstimatedDays: 5,
              description: 'Execução de caimento, imprimação e colagem de manta asfáltica',
              checklist: ['Teste de estanqueidade 72h', 'Proteção mecânica'],
            },
            {
              id: 'srv-disc-05-02',
              code: '05.01.002',
              name: 'Instalação de estrutura de cobertura, telhas e calhas pluviais',
              order: 2,
              categoryCode: '05',
              categoryName: 'Cobertura',
              subCategoryName: 'Impermeabilização e Coberturas',
              defaultResponsible: 'Montador / Telhadista',
              defaultEstimatedDays: 6,
              description: 'Montagem de tesouras, perfis, fixação de telhas e rufos metálicos',
              checklist: ['Caimento para calhas', 'Vedação de rufos com selante PU'],
            },
          ];
        } else if (disc.order === 12) {
          matchedServices = [
            {
              id: 'srv-disc-12-01',
              code: '12.01.001',
              name: 'Fixação e chumbamento de contramarcos e caixilhos de alumínio',
              order: 1,
              categoryCode: '12',
              categoryName: 'Esquadrias',
              subCategoryName: 'Esquadrias e Vidros',
              defaultResponsible: 'Serralheiro / Montador',
              defaultEstimatedDays: 3,
              description: 'Posicionamento a laser, fixação com grapas e argamassa de encunhamento',
              checklist: ['Prumo e esquadro', 'Nivelamento dos vãos'],
            },
            {
              id: 'srv-disc-12-02',
              code: '12.01.002',
              name: 'Instalação de portas de madeira, batentes, fechaduras e guarnições',
              order: 2,
              categoryCode: '12',
              categoryName: 'Esquadrias',
              subCategoryName: 'Marcenaria',
              defaultResponsible: 'Marceneiro / Carpinteiro',
              defaultEstimatedDays: 4,
              description: 'Instalação com espuma expansiva, dobradiças reforçadas e fechaduras',
              checklist: ['Ajuste da folha de porta', 'Travamento e chaves'],
            },
            {
              id: 'srv-disc-12-03',
              code: '12.01.003',
              name: 'Instalação de vidros temperados, laminados e guarda-corpos',
              order: 3,
              categoryCode: '12',
              categoryName: 'Esquadrias',
              subCategoryName: 'Vidraçaria',
              defaultResponsible: 'Vidraceiro Especialista',
              defaultEstimatedDays: 3,
              description: 'Montagem de painéis de vidro, colagem estrutural e fixação mecânica',
              checklist: ['Norma de guarda-corpo NBR 14718', 'Espessura e película'],
            },
          ];
        } else if (disc.order === 13) {
          matchedServices = [
            {
              id: 'srv-disc-13-01',
              code: '13.01.001',
              name: 'Assentamento de pisos porcelanatos, cerâmicas e rodapés',
              order: 1,
              categoryCode: '13',
              categoryName: 'Pisos e Louças',
              subCategoryName: 'Pisos e Revestimentos Nobres',
              defaultResponsible: 'Azulejista / Ladrilhista',
              defaultEstimatedDays: 5,
              description: 'Dupla colagem de argamassa AC-III, niveladores e rejunte resinado',
              checklist: ['Alinhamento das juntas', 'Caimento dos ralos mínimo 1%'],
            },
            {
              id: 'srv-disc-13-02',
              code: '13.01.002',
              name: 'Instalação de bancadas de granito, cubas e tampos em pedra',
              order: 2,
              categoryCode: '13',
              categoryName: 'Pisos e Louças',
              subCategoryName: 'Marmoraria',
              defaultResponsible: 'Marmorista / Instalador',
              defaultEstimatedDays: 2,
              description: 'Chumbamento de mãos francesas em aço, colagem e calafetação',
              checklist: ['Nível e esquadro', 'Vedação perimetral contra infiltração'],
            },
            {
              id: 'srv-disc-13-03',
              code: '13.01.003',
              name: 'Fixação de louças sanitárias, bacias, caixas acopladas e metais de acabamento',
              order: 3,
              categoryCode: '13',
              categoryName: 'Pisos e Louças',
              subCategoryName: 'Louças e Metais',
              defaultResponsible: 'Bombeiro Hidráulico / Instalador',
              defaultEstimatedDays: 2,
              description: 'Fixação com parafusos de inox, anel de vedação e ligação flexível',
              checklist: ['Teste de descarga e estanqueidade', 'Instalação de torneiras e registros'],
            },
          ];
        } else if (disc.order === 14) {
          matchedServices = [
            {
              id: 'srv-disc-14-01',
              code: '14.01.001',
              name: 'Aplicação de selador acrílico e emassamento com massa corrida / acrílica',
              order: 1,
              categoryCode: '14',
              categoryName: 'Pintura',
              subCategoryName: 'Pinturas e Acabamentos',
              defaultResponsible: 'Pintor Oficial',
              defaultEstimatedDays: 4,
              description: 'Fundo preparador, duas demãos cruzadas de massa e lixamento mecanizado',
              checklist: ['Planicidade com luz rasante', 'Aspiração de pó'],
            },
            {
              id: 'srv-disc-14-02',
              code: '14.01.002',
              name: 'Pintura látex/acrílica fosca, acetinada e pintura de tetos e molduras',
              order: 2,
              categoryCode: '14',
              categoryName: 'Pintura',
              subCategoryName: 'Pinturas e Acabamentos',
              defaultResponsible: 'Pintor Oficial',
              defaultEstimatedDays: 3,
              description: 'Aplicação com rolo de microfibra, recorte fino em cantos e demãos necessárias',
              checklist: ['Cobertura uniforme sem manchas', 'Proteção de pisos e esquadrias com lona'],
            },
          ];
        }
      }

      return {
        ...disc,
        services: matchedServices,
      };
    });
  }, []);

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

    const laborKey = `${srv.code}_${locationPath}`;
    const defaultResp = existingService?.responsibleName || srv.defaultResponsible || 'Engenheiro Residente';
    const laborData = serviceLaborMap[laborKey] || {
      laborType: existingService?.assignedEmployees?.some((e) => e.isOutsourced) ? 'terceirizada' : 'propria',
      contractorName: existingService?.assignedEmployees?.find((e) => e.companyName)?.companyName || '',
      responsibleName: defaultResp,
      helpers: (existingService?.assignedEmployees || [])
        .filter((e) => e.name !== defaultResp)
        .map((e) => e.name),
    };

    const isFechamento = isFechamentoService(srv.name, srv.categoryName, srv.subCategoryName);
    const isFinished = newStatus === 'Concluído' || newStatus === 'Finalizado';
    const isPendingInst = isInstallationsPendingAtLocation(locationPath, activeDetailWork.id);

    const assignedEmps = [
      ...(laborData.responsibleName.trim()
        ? [
            {
              id: `resp-${Date.now()}`,
              name: laborData.responsibleName.trim(),
              isOutsourced: laborData.laborType === 'terceirizada',
              companyName: laborData.laborType === 'terceirizada' ? laborData.contractorName.trim() : undefined,
            },
          ]
        : []),
      ...laborData.helpers
        .filter((h) => h.trim())
        .map((h, i) => ({
          id: `helper-${Date.now()}-${i}`,
          name: h.trim(),
          isOutsourced: laborData.laborType === 'terceirizada',
          companyName: laborData.laborType === 'terceirizada' ? laborData.contractorName.trim() : undefined,
        })),
    ];

    // Se checkbox 'Replicar no pavimento' estiver marcado, busca ambientes equivalentes
    let equivalentFloors: Floor[] = [];
    if (replicateFloor && activeDetailWork.floors) {
      const parts = locationPath.split(' - ');
      if (parts.length >= 3) {
        // Ex: 1º Pavimento - Apto 101 - Suíte 1 -> prefix: 1º Pavimento, suffix: Suíte 1
        const floorPrefix = parts.slice(0, parts.length - 2).join(' - ');
        const roomSuffix = parts[parts.length - 1];
        equivalentFloors = activeDetailWork.floors.filter(
          (f) => f.name !== locationPath && f.name.startsWith(floorPrefix + ' - ') && f.name.endsWith(' - ' + roomSuffix)
        );
      } else if (parts.length === 2) {
        // Ex: 1º Pavimento - Suíte 1
        const floorPrefix = parts[0];
        const roomSuffix = parts[1];
        equivalentFloors = activeDetailWork.floors.filter(
          (f) => f.name !== locationPath && f.name.startsWith(floorPrefix + ' - ') && f.name.endsWith(roomSuffix)
        );
      }
    }

    // Replicar mão de obra no serviceLaborMap
    if (equivalentFloors.length > 0) {
      setServiceLaborMap((prev) => {
        const next = { ...prev };
        equivalentFloors.forEach((ef) => {
          const eqKey = `${srv.code}_${ef.name}`;
          next[eqKey] = {
            ...laborData,
          };
        });
        return next;
      });
    }

    if (existingService) {
      updateServiceLocationStatus(existingService.id, locationId, locationPath, newStatus);
      if (equivalentFloors.length > 0) {
        equivalentFloors.forEach((ef) => {
          updateServiceLocationStatus(existingService.id, ef.id, ef.name, newStatus);
        });
      }
      editService(existingService.id, {
        responsibleName: laborData.responsibleName.trim() || defaultResp,
        assignedEmployees: assignedEmps,
      });
    } else {
      const eqLocProgress = equivalentFloors.map((ef) => ({
        locationId: ef.id,
        locationName: ef.name,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }));

      createService({
        workId: activeDetailWork.id,
        floorId: locationId,
        floorName: locationPath,
        name: srv.name,
        area: srv.subCategoryName || 'Obra Geral',
        status: newStatus,
        responsibleName: laborData.responsibleName.trim() || defaultResp,
        startDate: new Date().toISOString().substring(0, 10),
        predictedEndDate: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10),
        eapServiceCode: srv.code,
        categoryCode: srv.categoryCode,
        categoryName: srv.categoryName,
        checklist: srv.checklist || [],
        assignedEmployees: assignedEmps,
        locationProgress: [
          {
            locationId,
            locationName: locationPath,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          },
          ...eqLocProgress,
        ],
        proofPhotos: [],
      });
    }

    if (isFechamento && isFinished && isPendingInst) {
      showToast({
        type: 'warning',
        title: '⚠️ Precedência Construtiva',
        message: `Fechamento com instalações pendentes: serviço salvo normalmente${equivalentFloors.length > 0 ? ` (replicado em ${equivalentFloors.length} ambiente(s))` : ''}, porém Elétrica ou Hidráulica ainda não estão 100% finalizadas neste local.`,
      });
    } else {
      showToast({
        type: 'success',
        title: 'Status Atualizado',
        message: `${srv.name}: marcado como "${newStatus}" em "${locationPath}"${equivalentFloors.length > 0 ? ` e replicado em ${equivalentFloors.length} ambientes equivalentes deste pavimento.` : '.'}`,
      });
    }
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
        precedenceAlertsCount: 0,
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

    // Alertas de precedência construtiva (Fechamentos finalizados com instalações pendentes)
    let precedenceAlertsCount = 0;
    floors.forEach((fl) => {
      const hasWarning = workServices.some((s) => {
        const isFech = isFechamentoService(s.name, s.categoryName, s.area);
        if (!isFech) return false;
        const lp = (s.locationProgress || []).find(
          (l) => l.locationName === fl.name || l.locationId === fl.id || fl.name.endsWith(l.locationName)
        );
        const isFin = (lp ? lp.status : s.status) === 'Concluído' || (lp ? lp.status : s.status) === 'Finalizado';
        return isFin && isInstallationsPendingAtLocation(fl.name, dashboardWork.id);
      });
      if (hasWarning) precedenceAlertsCount++;
    });

    return {
      overallProgress,
      completedEnvironments,
      totalEnvironments,
      totalIssues,
      occurrencesCount: workOccurrences.length,
      alertsCount: workAlerts.length,
      precedenceAlertsCount,
      disciplineProgressList,
    };
  }, [dashboardWork, services, occurrences, alerts]);

  // Copiar Resumo Executivo para WhatsApp
  const handleCopyWhatsAppSummary = async () => {
    if (!dashboardWork) return;

    const activeDisciplines = dashboardStats.disciplineProgressList.filter((d) => d.progress > 0);

    const disciplinesLines = activeDisciplines.length > 0
      ? activeDisciplines
          .map((d) => `${d.icon} *${d.discipline.technicalName}:* ${d.progress}%`)
          .join('\n')
      : 'Nenhuma disciplina com avanço registrado ainda.';

    const text = [
      `🏗️ *RELATÓRIO EXECUTIVO - ${dashboardWork.name}*`,
      `📊 *Progresso Geral:* ${dashboardStats.overallProgress}% (${dashboardStats.completedEnvironments}/${dashboardStats.totalEnvironments} ambientes)`,
      `⚠️ *Alertas de Precedência:* ${dashboardStats.precedenceAlertsCount}`,
      `--- *Avanço por Disciplina* ---`,
      disciplinesLines,
    ].join('\n');

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast({
        type: 'success',
        title: 'WhatsApp',
        message: 'Resumo copiado para o WhatsApp!',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Erro ao copiar',
        message: 'Não foi possível copiar o texto automaticamente.',
      });
    }
  };

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
                      const realSubsolosCount = (work.floors && work.floors.length > 0)
                        ? Array.from(new Set(work.floors.map(f => f.name.split(' - ')[0]))).filter(r => r.toLowerCase().startsWith('subsolo')).length
                        : (work.basementCount || 0);
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
                    const realSubsolosCount = (activeDetailWork.floors && activeDetailWork.floors.length > 0)
                      ? Array.from(new Set(activeDetailWork.floors.map(f => f.name.split(' - ')[0]))).filter(r => r.toLowerCase().startsWith('subsolo')).length
                      : (activeDetailWork.basementCount || 0);
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
                      warningChecker={(path) => checkLocationPrecedenceWarning(path)}
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

            {/* Checkbox: Replicar apontamentos para unidades/ambientes equivalentes deste pavimento */}
            <div className="px-4 sm:px-5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={replicateFloor}
                  onChange={(e) => setReplicateFloor(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 accent-blue-500 cursor-pointer"
                />
                <span>🔄 Replicar apontamentos para unidades/ambientes equivalentes deste pavimento</span>
              </label>
            </div>

            {/* Disciplinas em <details> fechados (Sequência Construtiva 1 a 15) */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {modalDisciplines.map((discipline) => (
                <details
                  key={discipline.id}
                  className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 transition-all"
                >
                  <summary className="p-3 bg-slate-900 hover:bg-slate-800/80 cursor-pointer select-none font-bold text-xs sm:text-sm text-white flex items-center justify-between border-b border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{discipline.icon}</span>
                      <span>{discipline.technicalName}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {discipline.services.length} {discipline.services.length === 1 ? 'serviço' : 'serviços'}
                    </span>
                  </summary>

                  <div className="p-3 space-y-3 bg-slate-950/30">
                    {discipline.services.map((srv) => {
                      const currentStatus = getServiceStatusAtLocation(srv, apontamentoLocation);
                      const laborKey = `${srv.code}_${apontamentoLocation}`;
                      const existingSrv = services.find(
                        (s) =>
                          s.workId === activeDetailWork.id &&
                          (s.eapServiceCode === srv.code || s.name.toLowerCase() === srv.name.toLowerCase())
                      );
                      const defaultResp = existingSrv?.responsibleName || srv.defaultResponsible || '';
                      const laborData = serviceLaborMap[laborKey] || {
                        laborType: existingSrv?.assignedEmployees?.some((e) => e.isOutsourced) ? 'terceirizada' : 'propria',
                        contractorName: existingSrv?.assignedEmployees?.find((e) => e.companyName)?.companyName || '',
                        responsibleName: defaultResp,
                        helpers: (existingSrv?.assignedEmployees || [])
                          .filter((e) => e.name !== defaultResp)
                          .map((e) => e.name),
                      };

                      const isFechamento = isFechamentoService(srv.name, srv.categoryName, srv.subCategoryName);
                      const isFinished = currentStatus === 'Concluído' || currentStatus === 'Finalizado';
                      const hasWarning = isFechamento && isFinished && isInstallationsPendingAtLocation(apontamentoLocation, activeDetailWork.id);

                      return (
                        <div
                          key={srv.code}
                          className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-3 shadow-sm"
                        >
                          {/* Cabeçalho do Serviço e Status */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                  {srv.code}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-white">
                                  {srv.name}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                                <span>
                                  Status no local: <strong className={currentStatus === 'Concluído' || currentStatus === 'Finalizado' ? 'text-emerald-400' : currentStatus === 'Em andamento' ? 'text-blue-400' : currentStatus === 'Paralisado' ? 'text-amber-400' : 'text-slate-400'}>{currentStatus}</strong>
                                </span>
                                {laborData.stopReason && (
                                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                    Motivo: {laborData.stopReason}
                                  </span>
                                )}
                                {hasWarning && (
                                  <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1 shadow-sm animate-pulse">
                                    ⚠️ Fechamento com instalações pendentes
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Botões estáticos obrigatórios: [Iniciar], [Paralisar], [Finalizar] + Motivo Rápido de Parada */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0 self-end sm:self-auto">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSetApontamentoStatus(srv, apontamentoLocation, 'Em andamento')}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
                                >
                                  Iniciar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetApontamentoStatus(srv, apontamentoLocation, 'Paralisado')}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-sm transition-all"
                                >
                                  Paralisar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetApontamentoStatus(srv, apontamentoLocation, 'Concluído')}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
                                >
                                  Finalizar
                                </button>
                              </div>

                              {/* 1. Motivo Rápido de Parada em 1 Clique */}
                              {(currentStatus === 'Paralisado' || currentStatus === 'Não iniciado' || !!laborData.stopReason) && (
                                <div className="flex items-center gap-1 flex-wrap justify-end pt-0.5">
                                  {(['📦 Falta Material', '🌧️ Chuva/Clima', '👷 Aguardando Equipe'] as const).map((reason) => {
                                    const isSelected = laborData.stopReason === reason;
                                    return (
                                      <button
                                        key={reason}
                                        type="button"
                                        onClick={() => {
                                          const nextReason = isSelected ? '' : reason;
                                          updateLabor(srv.code, apontamentoLocation, { stopReason: nextReason });
                                        }}
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all border cursor-pointer ${
                                          isSelected
                                            ? 'bg-amber-500/25 border-amber-500 text-amber-300 font-bold'
                                            : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700/80 text-slate-300'
                                        }`}
                                      >
                                        {reason}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Campos de Equipe, Profissional e Ajudantes */}
                          <div className="pt-2.5 border-t border-slate-800/80 space-y-2.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {/* Tipo de Mão de Obra */}
                              <div>
                                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                                  Tipo de Mão de Obra
                                </span>
                                <div className="flex items-center gap-3 bg-slate-950/70 p-1.5 px-2.5 rounded-lg border border-slate-800">
                                  <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
                                    <input
                                      type="radio"
                                      name={`laborType-${srv.code}-${apontamentoLocation}`}
                                      checked={laborData.laborType === 'propria'}
                                      onChange={() => updateLabor(srv.code, apontamentoLocation, { laborType: 'propria' })}
                                      className="accent-blue-500"
                                    />
                                    <span>Equipe Própria</span>
                                  </label>
                                  <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer select-none">
                                    <input
                                      type="radio"
                                      name={`laborType-${srv.code}-${apontamentoLocation}`}
                                      checked={laborData.laborType === 'terceirizada'}
                                      onChange={() => updateLabor(srv.code, apontamentoLocation, { laborType: 'terceirizada' })}
                                      className="accent-blue-500"
                                    />
                                    <span>Terceirizada</span>
                                  </label>
                                </div>
                              </div>

                              {/* Se Terceirizada, exiba input para o Nome da Empreiteira */}
                              {laborData.laborType === 'terceirizada' && (
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                                    Nome da Empreiteira *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Empreiteira Alfa, Construtora Silva..."
                                    value={laborData.contractorName}
                                    onChange={(e) => updateLabor(srv.code, apontamentoLocation, { contractorName: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Input de texto para Profissional Responsável */}
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                                Profissional Responsável
                              </label>
                              <input
                                type="text"
                                placeholder="Nome do encarregado ou oficial responsável..."
                                value={laborData.responsibleName}
                                onChange={(e) => updateLabor(srv.code, apontamentoLocation, { responsibleName: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            {/* Lista dinâmica de Ajudantes com botão + Adicionar Ajudante */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                  Ajudantes Vinculados ({laborData.helpers.length})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addHelper(srv.code, apontamentoLocation)}
                                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>+ Adicionar Ajudante</span>
                                </button>
                              </div>

                              {laborData.helpers.length === 0 ? (
                                <p className="text-[11px] text-slate-500 italic">
                                  Nenhum ajudante vinculado. Clique em "+ Adicionar Ajudante" para associar à equipe.
                                </p>
                              ) : (
                                <div className="space-y-1.5">
                                  {laborData.helpers.map((helper, hIdx) => (
                                    <div key={hIdx} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        placeholder={`Nome do ajudante ${hIdx + 1}...`}
                                        value={helper}
                                        onChange={(e) => updateHelper(srv.code, apontamentoLocation, hIdx, e.target.value)}
                                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeHelper(srv.code, apontamentoLocation, hIdx)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                        title="Remover ajudante"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
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

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyWhatsAppSummary}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Copiar Resumo para WhatsApp"
                >
                  <span>📲 Copiar Resumo WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardWork(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                  title="Fechar Dashboard"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
