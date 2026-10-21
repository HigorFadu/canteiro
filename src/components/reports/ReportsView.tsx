import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle2,
  PlayCircle,
  Circle,
  AlertCircle,
  AlertTriangle,
  Camera,
  Image as ImageIcon,
  Layers,
  Building2,
  HardHat,
  Filter,
  CheckCheck,
  Maximize2,
  X,
  Boxes,
  Wrench,
  Shield,
  ArrowLeftRight,
  Clock,
  Sun,
  CloudRain,
  Cloud,
  FileCheck,
  Building,
  UserCheck,
  ChevronDown,
  Sparkles,
  ClipboardList,
  Eye,
} from 'lucide-react';
import { ConstructionService, ServiceProofPhoto, Floor } from '../../types';

export type ReportFormat =
  | 'evolucao'       // Evolução Física Geral
  | 'rdo'            // Diário de Obra (RDO)
  | 'pendencias'     // Relatório de Pendências
  | 'materiais'      // Materiais & Estoque (Apoio)
  | 'ferramentas'    // Ferramentas & Custódia (Apoio)
  | 'epis'           // EPIs & Fichas C.A. (Apoio)
  | 'transferencias'; // Transferências (Apoio)

export const ReportsView: React.FC = () => {
  const {
    currentWork,
    currentUser,
    materials,
    tools,
    epis,
    epiDeliveries,
    employees,
    services,
    occurrences,
    transfers,
    companyBranding,
    showToast,
  } = useApp();

  // 1. Seletor de Formato Principal
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('evolucao');

  // 2. Filtros de Escopo
  const [selectedLocation, setSelectedLocation] = useState<string>('all'); // 'all' ou floorId
  const [selectedArea, setSelectedArea] = useState<string>('all');         // 'all' ou nome da disciplina
  const [filterDate, setFilterDate] = useState<string>(() =>
    new Date().toISOString().substring(0, 10)
  );
  const [rdoWeather, setRdoWeather] = useState<'Ensolarado' | 'Nublado' | 'Chuvoso' | 'Instável'>('Ensolarado');

  // 3. Toggle Fotográfico
  const [includePhotos, setIncludePhotos] = useState<boolean>(true);

  // Estado para Modal de Foto Ampliada (Lightbox)
  const [previewPhoto, setPreviewPhoto] = useState<ServiceProofPhoto | null>(null);

  // Estado para Print Preview Mode interno (contorna bloqueio de iframe para window.print)
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Atalho de teclado para fechar o modo de visualização com a tecla Esc
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewMode) {
        setIsPreviewMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode]);

  // Extração das Cores e Dados da Empresa Contratante (Padrão White-Label Absoluto)
  const primaryColor = companyBranding.buttonPrimary || companyBranding.primaryColor || '#2563eb';
  const primaryTextColor = companyBranding.buttonPrimaryText || '#ffffff';
  const accentColor = companyBranding.accentColor || primaryColor;
  const companyName = companyBranding.companyName || companyBranding.tradeName || 'Empresa Contratante';

  // Pavimentos / Locais da Obra
  const workFloors = useMemo(() => {
    return (currentWork.floors || []).filter((fl) => fl.isActive);
  }, [currentWork.floors]);

  // Serviços Ativos da Obra Atual
  const workServices = useMemo(() => {
    return services.filter((s) => s.workId === currentWork.id && s.isActive);
  }, [services, currentWork.id]);

  // Lista única de Disciplinas (Áreas) da Obra
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    workServices.forEach((s) => {
      const areaName = s.area || s.categoryName;
      if (areaName) set.add(areaName);
    });
    return Array.from(set).sort();
  }, [workServices]);

  // Cálculo de Progresso de cada Serviço
  const getServiceEvolution = (service: ConstructionService) => {
    const locs = service.locationProgress || [];
    if (locs.length === 0) {
      if (service.status === 'Concluído') return 100;
      if (service.status === 'Em andamento') return 50;
      return 0;
    }
    const completed = locs.filter((l) => l.status === 'Concluído').length;
    const inProgress = locs.filter((l) => l.status === 'Em andamento').length;
    return Math.round(((completed + inProgress * 0.5) / locs.length) * 100);
  };

  // Serviços Filtrados pelo Escopo (Local e Área)
  const filteredServices = useMemo(() => {
    return workServices.filter((s) => {
      // Filtro por Área / Disciplina
      if (selectedArea !== 'all') {
        const areaName = s.area || s.categoryName;
        if (areaName !== selectedArea) return false;
      }

      // Filtro por Local do Mapa da Obra
      if (selectedLocation !== 'all') {
        const hasLocationProgress = (s.locationProgress || []).some(
          (lp) => lp.locationId === selectedLocation
        );
        const matchesFloorId = s.floorId === selectedLocation;
        if (!hasLocationProgress && !matchesFloorId) return false;
      }

      return true;
    });
  }, [workServices, selectedArea, selectedLocation]);

  // Dados do Relatório de Status de Obras para geração de PDF / Impressão A4
  const dadosDoRelatorio = useMemo(() => {
    return filteredServices;
  }, [filteredServices]);

  // Agrupamento por Disciplina (Área) para o Relatório de Evolução Física Geral
  const groupedDisciplines = useMemo(() => {
    const map = new Map<string, ConstructionService[]>();

    filteredServices.forEach((srv) => {
      const areaKey = srv.area || srv.categoryName || 'Geral';
      if (!map.has(areaKey)) {
        map.set(areaKey, []);
      }
      map.get(areaKey)!.push(srv);
    });

    const list: {
      name: string;
      services: ConstructionService[];
      total: number;
      completed: number;
      inProgress: number;
      notStarted: number;
      evolutionPercent: number;
    }[] = [];

    map.forEach((srvs, name) => {
      let evoSum = 0;
      let comp = 0;
      let inProg = 0;
      let notSt = 0;

      srvs.forEach((s) => {
        const evo = getServiceEvolution(s);
        evoSum += evo;
        if (s.status === 'Concluído' || evo === 100) comp++;
        else if (s.status === 'Em andamento' || evo > 0) inProg++;
        else notSt++;
      });

      const avg = srvs.length > 0 ? Math.round(evoSum / srvs.length) : 0;

      list.push({
        name,
        services: srvs,
        total: srvs.length,
        completed: comp,
        inProgress: inProg,
        notStarted: notSt,
        evolutionPercent: avg,
      });
    });

    list.sort((a, b) => b.evolutionPercent - a.evolutionPercent);
    return list;
  }, [filteredServices]);

  // Métricas Globais da Evolução Física Geral
  const globalEvolutionStats = useMemo(() => {
    const total = filteredServices.length;
    if (total === 0) {
      return { overallPercent: 0, completed: 0, inProgress: 0, notStarted: 0, totalPhotos: 0 };
    }

    let sum = 0;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let totalPhotos = 0;

    filteredServices.forEach((s) => {
      const evo = getServiceEvolution(s);
      sum += evo;
      if (s.status === 'Concluído' || evo === 100) completed++;
      else if (s.status === 'Em andamento' || evo > 0) inProgress++;
      else notStarted++;

      totalPhotos += (s.proofPhotos || []).length;
    });

    return {
      overallPercent: Math.round(sum / total),
      completed,
      inProgress,
      notStarted,
      totalPhotos,
    };
  }, [filteredServices]);

  // Serviços e Dados para o Diário de Obra (RDO)
  const rdoData = useMemo(() => {
    // Serviços que estão em andamento ou foram concluídos na obra
    const activeOrConcludedServices = filteredServices.filter(
      (s) => s.status === 'Em andamento' || s.status === 'Concluído'
    );

    // Ocorrências do Dia / Período
    const dayOccurrences = occurrences.filter((occ) => {
      if (occ.workId !== currentWork.id) return false;
      // Se tiver data idêntica ou dentro do escopo
      return occ.date === filterDate || occ.startDate === filterDate;
    });

    // Equipe Presente: Funcionários ativos na obra com função
    const activeEmployees = employees.filter((e) => e.status === 'Ativo');

    return {
      services: activeOrConcludedServices,
      occurrences: dayOccurrences,
      employees: activeEmployees,
    };
  }, [filteredServices, occurrences, employees, currentWork.id, filterDate]);

  // Serviços para o Relatório de Pendências (apenas 'Não Iniciados' ou 'Em Andamento') agrupados por Local
  const pendingByLocation = useMemo(() => {
    // Filtra apenas Não Iniciados ou Em Andamento
    const pendingServices = filteredServices.filter(
      (s) => s.status === 'Não iniciado' || s.status === 'Em andamento'
    );

    const map = new Map<string, { floorName: string; services: ConstructionService[] }>();

    pendingServices.forEach((srv) => {
      const appliedLocs = srv.locationProgress || [];

      if (appliedLocs.length > 0) {
        appliedLocs.forEach((lp) => {
          if (lp.status !== 'Concluído') {
            if (selectedLocation !== 'all' && lp.locationId !== selectedLocation) {
              return;
            }
            if (!map.has(lp.locationId)) {
              map.set(lp.locationId, { floorName: lp.locationName, services: [] });
            }
            // Evita duplicatas se o mesmo serviço já tiver sido adicionado
            const existing = map.get(lp.locationId)!;
            if (!existing.services.some((s) => s.id === srv.id)) {
              existing.services.push(srv);
            }
          }
        });
      } else {
        // Se não tiver locationProgress detalhado, agrupa pelo floorId do serviço
        const targetFloorId = srv.floorId || 'geral';
        const targetFloorName = srv.floorName || 'Área Geral da Obra';

        if (selectedLocation !== 'all' && targetFloorId !== selectedLocation) {
          return;
        }

        if (!map.has(targetFloorId)) {
          map.set(targetFloorId, { floorName: targetFloorName, services: [] });
        }
        map.get(targetFloorId)!.services.push(srv);
      }
    });

    const result = Array.from(map.entries()).map(([floorId, data]) => ({
      floorId,
      floorName: data.floorName,
      services: data.services,
      totalPending: data.services.length,
    }));

    result.sort((a, b) => b.totalPending - a.totalPending);
    return result;
  }, [filteredServices, selectedLocation]);

  // Contagem total de fotos incluídas na visualização
  const totalPhotosInView = useMemo(() => {
    return filteredServices.reduce((acc, s) => acc + (s.proofPhotos || []).length, 0);
  }, [filteredServices]);

  // Impressão / Exportação (Ativa o Print Preview Mode interno contornando bloqueios de iframe)
  const handlePrint = () => {
    setIsPreviewMode(true);
  };

  const handleExportPDF = () => {
    setIsPreviewMode(true);
  };

  // Renderizador unificado da Folha A4 Oficial (Header, Corpo com Operador Ternário e Rodapé de Assinaturas)
  const renderA4SheetBody = () => (
    <>
      {/* Header de Impressão: Título H1 'Relatório de Status de Obras', data de emissão, e o nome da Empresa. Borda inferior. */}
      <div className="flex items-center justify-between pb-5 border-b-2 border-slate-800 pr-36 sm:pr-44">
        <div className="flex items-center gap-4">
          {companyBranding.logoUrl ? (
            <img
              src={companyBranding.logoUrl}
              alt={companyName}
              className="w-14 h-14 object-contain"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg font-mono">
              {companyName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Relatório de Status de Obras
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              {companyName} {companyBranding.cnpj ? `• CNPJ: ${companyBranding.cnpj}` : ''}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Empreendimento: <strong className="text-slate-900">{currentWork.name}</strong> • Localidade: {currentWork.city}/{currentWork.state} • Responsável: {currentUser.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Data de Emissão
          </span>
          <span className="text-sm font-mono font-bold text-slate-900 block mt-0.5">
            {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-xs text-slate-600 block mt-1">
            Filtro: {selectedLocation === 'all' ? 'Toda a Obra' : workFloors.find(f => f.id === selectedLocation)?.name} • {selectedArea === 'all' ? 'Todas as Áreas' : selectedArea}
          </span>
        </div>
      </div>

      {/* Corpo (Obrigatório usar Operador Ternário): Validação real se há dados a serem exibidos */}
      <div className="my-6 space-y-6">
        {dadosDoRelatorio && dadosDoRelatorio.length > 0 ? (
          <div className="space-y-6">
            {/* Painel de Indicadores Globais (KPIs de Engenharia) */}
            <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-slate-300 bg-slate-50">
              <div className="border-r border-slate-200 pr-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Avanço Físico Global</span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                  {globalEvolutionStats.overallPercent}%
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-1.5 overflow-hidden">
                  <div 
                    className="bg-slate-900 h-2 rounded-full"
                    style={{ width: `${globalEvolutionStats.overallPercent}%` }}
                  />
                </div>
              </div>
              <div className="border-r border-slate-200 pr-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Total de Serviços</span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                  {dadosDoRelatorio.length}
                </div>
                <span className="text-[10px] text-slate-500">frentes cadastradas</span>
              </div>
              <div className="border-r border-slate-200 pr-3">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Concluídos</span>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                  {globalEvolutionStats.completed}
                </div>
                <span className="text-[10px] text-slate-500">
                  {dadosDoRelatorio.length > 0 ? Math.round((globalEvolutionStats.completed / dadosDoRelatorio.length) * 100) : 0}% do total
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-700 block">Em Andamento</span>
                <div className="text-2xl font-black text-blue-800 font-mono mt-0.5">
                  {globalEvolutionStats.inProgress}
                </div>
                <span className="text-[10px] text-slate-500">
                  {globalEvolutionStats.notStarted} não iniciados
                </span>
              </div>
            </div>

            {/* Gráfico Analítico de Progresso por Disciplina de Engenharia */}
            {groupedDisciplines.length > 0 && (
              <div className="border border-slate-300 rounded-xl p-4 bg-white">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>Distribuição e Progresso por Disciplina de Engenharia</span>
                  <span className="text-[10px] font-mono text-slate-500">{groupedDisciplines.length} Disciplinas</span>
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {groupedDisciplines.map((group) => (
                    <div key={group.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 truncate">{group.name}</span>
                        <span className="font-mono font-bold text-slate-900">{group.evolutionPercent}% ({group.services.length} frentes)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-slate-800 h-2 rounded-full"
                          style={{ width: `${group.evolutionPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabela Oficial de Detalhamento dos Apontamentos e Serviços */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Detalhamento dos Apontamentos e Serviços da Obra
                </h3>
                <span className="text-[10px] font-mono text-slate-600">
                  Exibindo {dadosDoRelatorio.length} apontamentos registrados
                </span>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50 text-[10px] uppercase font-bold text-slate-700">
                    <th className="py-2.5 px-3">Item / Código</th>
                    <th className="py-2.5 px-3">Serviço de Engenharia</th>
                    <th className="py-2.5 px-3">Disciplina</th>
                    <th className="py-2.5 px-3">Pavimento / Local</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Avanço (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dadosDoRelatorio.map((srv, idx) => {
                    const evol = getServiceEvolution(srv);
                    return (
                      <tr key={srv.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 font-semibold">
                          {srv.eapServiceCode || srv.categoryCode || `#${String(idx + 1).padStart(2, '0')}`}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-slate-900 block">{srv.name}</span>
                          {srv.responsibleName && (
                            <span className="text-[10px] text-slate-500 block">Resp: {srv.responsibleName}</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-700">
                          {srv.area || srv.categoryName || 'Geral'}
                        </td>
                        <td className="py-2 px-3 text-slate-700 font-medium">
                          {srv.floorName || workFloors.find(f => f.id === srv.floorId)?.name || 'Geral'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            srv.status === 'Concluído'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : srv.status === 'Em andamento'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {srv.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full ${
                                evol === 100 ? 'bg-emerald-600' : evol > 0 ? 'bg-blue-600' : 'bg-slate-400'
                              }`}
                              style={{ width: `${evol}%` }}
                            />
                          </div>
                          <span>{evol}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-10 text-center font-bold">Nenhum apontamento no período.</div>
      )}
    </div>

    {/* Footer: Grid de 3 colunas com as linhas de assinatura (Engenheiro, Gestor, Cliente) */}
    <div className="grid grid-cols-3 gap-8 mt-24 pt-8 border-t border-slate-300">
      <div className="text-center">
        <div className="border-b border-slate-400 mb-2 h-12" />
        <p className="text-xs font-bold text-slate-800">Engenheiro</p>
      </div>
      <div className="text-center">
        <div className="border-b border-slate-400 mb-2 h-12" />
        <p className="text-xs font-bold text-slate-800">Gestor</p>
      </div>
      <div className="text-center">
        <div className="border-b border-slate-400 mb-2 h-12" />
        <p className="text-xs font-bold text-slate-800">Cliente</p>
      </div>
    </div>
  </>
  );

  // MODO PRINT PREVIEW INTERNO (SIMULAÇÃO DE FOLHA A4 NA TELA PARA DRIBLAR O BLOQUEIO DO IFRAME)
  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-slate-900/80 py-8 px-4 flex justify-center items-start overflow-y-auto fixed inset-0 z-[100]">
        <div className="max-w-4xl bg-white text-black p-8 shadow-2xl relative w-full my-auto min-h-[900px] space-y-6">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shadow-sm border border-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-600" />
            <span>X Fechar</span>
          </button>

          {renderA4SheetBody()}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Regras Rígidas de Impressão White-Label */}
      <style>{`
        @media print {
          aside, nav, header, button, .no-print {
            display: none !important;
          }
          main, .print-container {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
            color: black !important;
          }
          body {
            overflow: auto !important;
          }
        }
      `}</style>

      {/* Interface Principal do Sistema em Tela (Oculta Durante a Impressão) */}
      <div className="space-y-6 print:hidden">
        {/* =========================================================================
            CABEÇALHO DA TELA & BOTÕES DE AÇÃO (OCULTO NA IMPRESSÃO)
            ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
              Central de Relatórios
            </h1>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border transition-colors text-[var(--btn-primary)] border-[var(--btn-primary)]/40 bg-[var(--btn-primary)]/10"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--btn-primary) 12%, transparent)',
                color: 'var(--btn-primary)',
                borderColor: 'color-mix(in srgb, var(--btn-primary) 40%, transparent)',
              }}
            >
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cruze dados de <strong>Andamento da Obra</strong>, <strong>Equipe</strong> e <strong>Ocorrências</strong> com formatação oficial de engenharia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer no-print hover:opacity-95"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PAINEL DE FILTROS NO TOPO (OCULTO NA IMPRESSÃO)
          ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 print:hidden no-print">
        {/* 1. SELETOR DE FORMATO */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            1. Seletor de Formato de Relatório:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Formato 1: Evolução Física Geral */}
            <button
              type="button"
              onClick={() => setSelectedFormat('evolucao')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                selectedFormat === 'evolucao'
                  ? 'shadow-md border-[var(--btn-primary)] bg-[var(--btn-primary)]/10 text-[var(--btn-primary)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              style={
                selectedFormat === 'evolucao'
                  ? {
                      backgroundColor: 'color-mix(in srgb, var(--btn-primary) 15%, transparent)',
                      borderColor: 'var(--btn-primary)',
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black flex items-center gap-1.5 text-[var(--btn-primary)]"
                  style={{ color: selectedFormat === 'evolucao' ? 'var(--btn-primary)' : 'var(--title-color)' }}
                >
                  <TrendingUp className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  Evolução Física Geral
                </span>
                {selectedFormat === 'evolucao' && (
                  <span
                    className="w-2 h-2 rounded-full animate-pulse bg-[var(--btn-primary)]"
                    style={{ backgroundColor: 'var(--btn-primary)' }}
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                % Total da obra e barras de avanço por Área / Disciplina.
              </p>
            </button>

            {/* Formato 2: Diário de Obra (RDO) */}
            <button
              type="button"
              onClick={() => setSelectedFormat('rdo')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                selectedFormat === 'rdo'
                  ? 'shadow-md border-[var(--btn-primary)] bg-[var(--btn-primary)]/10 text-[var(--btn-primary)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              style={
                selectedFormat === 'rdo'
                  ? {
                      backgroundColor: 'color-mix(in srgb, var(--btn-primary) 15%, transparent)',
                      borderColor: 'var(--btn-primary)',
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black flex items-center gap-1.5 text-[var(--btn-primary)]"
                  style={{ color: selectedFormat === 'rdo' ? 'var(--btn-primary)' : 'var(--title-color)' }}
                >
                  <FileText className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  Diário de Obra (RDO)
                </span>
                {selectedFormat === 'rdo' && (
                  <span
                    className="w-2 h-2 rounded-full animate-pulse bg-[var(--btn-primary)]"
                    style={{ backgroundColor: 'var(--btn-primary)' }}
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Serviços executados no período + equipe presente + ocorrências do dia.
              </p>
            </button>

            {/* Formato 3: Relatório de Pendências */}
            <button
              type="button"
              onClick={() => setSelectedFormat('pendencias')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                selectedFormat === 'pendencias'
                  ? 'shadow-md border-[var(--btn-primary)] bg-[var(--btn-primary)]/10 text-[var(--btn-primary)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              style={
                selectedFormat === 'pendencias'
                  ? {
                      backgroundColor: 'color-mix(in srgb, var(--btn-primary) 15%, transparent)',
                      borderColor: 'var(--btn-primary)',
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black flex items-center gap-1.5 text-[var(--btn-primary)]"
                  style={{ color: selectedFormat === 'pendencias' ? 'var(--btn-primary)' : 'var(--title-color)' }}
                >
                  <AlertTriangle className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  Relatório de Pendências
                </span>
                {selectedFormat === 'pendencias' && (
                  <span
                    className="w-2 h-2 rounded-full animate-pulse bg-[var(--btn-primary)]"
                    style={{ backgroundColor: 'var(--btn-primary)' }}
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Serviços Não Iniciados e Em Andamento agrupados por local do mapa.
              </p>
            </button>
          </div>
        </div>

        {/* 2. FILTROS DE ESCOPO & TOGGLE FOTOGRÁFICO */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Dropdown: Local do Mapa da Obra */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
              Local do Mapa da Obra:
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none transition-colors"
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--btn-primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#334155'; }}
            >
              <option value="all">Toda a Obra (Todos os Locais)</option>
              {workFloors.map((fl) => (
                <option key={fl.id} value={fl.id}>
                  {fl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown: Área / Disciplina */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
              Área / Disciplina:
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none transition-colors"
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--btn-primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#334155'; }}
            >
              <option value="all">Todas as Áreas / Disciplinas</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de Data (Essencial para RDO e relatórios com filtro de período) */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
              Data de Referência:
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none transition-colors"
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--btn-primary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#334155'; }}
            />
          </div>

          {/* 3. TOGGLE FOTOGRÁFICO: CHECKBOX [X] INCLUIR FOTOS DE COMPROVAÇÃO */}
          <div className="flex flex-col justify-end">
            <label
              className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none"
              style={includePhotos ? { borderColor: 'var(--btn-primary)' } : undefined}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includePhotos}
                  onChange={(e) => setIncludePhotos(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 cursor-pointer"
                  style={{ accentColor: 'var(--btn-primary)' }}
                />
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  Incluir Fotos de Comprovação
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {totalPhotosInView} fotos
              </span>
            </label>
          </div>
        </div>

        {/* Barra de Status do Filtro & Ações Rápidas de Apoio */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <span>
              Filtrando: <strong className="text-white">{filteredServices.length}</strong> serviços encontrados
            </span>
            <span>•</span>
            <span>
              Local:{' '}
              <strong className="text-slate-200">
                {selectedLocation === 'all'
                  ? 'Toda a Obra'
                  : workFloors.find((f) => f.id === selectedLocation)?.name || selectedLocation}
              </strong>
            </span>
            <span>•</span>
            <span>
              Área: <strong className="text-slate-200">{selectedArea === 'all' ? 'Todas' : selectedArea}</strong>
            </span>
          </div>

          {/* Links para outros relatórios operacionais (Almoxarifado / EPI / Ferramentas) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Outros relatórios:</span>
            <button
              type="button"
              onClick={() => setSelectedFormat('materiais')}
              className="px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer"
              style={
                selectedFormat === 'materiais'
                  ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)', borderColor: 'var(--btn-primary)' }
                  : { backgroundColor: '#020617', borderColor: '#1e293b' }
              }
            >
              Materiais
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('ferramentas')}
              className="px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer"
              style={
                selectedFormat === 'ferramentas'
                  ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)', borderColor: 'var(--btn-primary)' }
                  : { backgroundColor: '#020617', borderColor: '#1e293b' }
              }
            >
              Ferramentas
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('epis')}
              className="px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer"
              style={
                selectedFormat === 'epis'
                  ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)', borderColor: 'var(--btn-primary)' }
                  : { backgroundColor: '#020617', borderColor: '#1e293b' }
              }
            >
              EPIs (C.A.)
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ÁREA DE PRÉ-VISUALIZAÇÃO DO RELATÓRIO (FOLHA A4 WHITE-LABEL ABSOLUTO)
          ========================================================================= */}
      {/* Indicador Visual de Folha A4 (Oculto na Impressão) */}
      <div className="max-w-[850px] mx-auto flex items-center justify-between text-xs text-slate-400 print:hidden no-print pb-1 px-1">
        <div className="flex items-center gap-1.5 font-medium">
          <FileText className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <span className="text-[var(--title-color)]">Folha de Documento (A4) • Padrão White-Label</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-slate-500">
            210mm x 297mm • Cores da Empresa
          </span>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-sm no-print"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <Printer className="w-3 h-3 text-[var(--btn-primary-text)]" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      <div className="a4-document-sheet print-container max-w-[850px] mx-auto p-6 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full space-y-6">
        
        {/* CABEÇALHO WHITE-LABEL DO DOCUMENTO (EXCLUSIVO DA EMPRESA CONTRATANTE) */}
        <div className="p-5 sm:p-6 rounded-xl bg-slate-950/90 border border-slate-800 print:bg-white print:border-slate-300 print:text-black space-y-4 a4-section-block">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 print:border-slate-300 gap-4">
            {/* Lado Esquerdo: EXCLUSIVAMENTE a Logo e o Nome da Empresa Contratante */}
            <div className="flex items-center gap-3.5">
              {companyBranding.logoUrl ? (
                <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center border border-slate-700 print:border-slate-300 shadow-sm shrink-0">
                  <img
                    src={companyBranding.logoUrl}
                    alt={companyName}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-base shrink-0 shadow-sm font-mono"
                  style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                >
                  {companyName.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <h2 className="text-lg sm:text-xl font-black text-white print:text-black tracking-tight leading-tight">
                  {companyName}
                </h2>
                {companyBranding.tradeName && companyBranding.tradeName !== companyName && (
                  <span className="text-xs font-semibold text-slate-300 print:text-slate-700 block">
                    {companyBranding.tradeName}
                  </span>
                )}
                {companyBranding.cnpj && (
                  <span className="text-[11px] text-slate-400 print:text-slate-600 block font-mono">
                    CNPJ: {companyBranding.cnpj}
                  </span>
                )}
              </div>
            </div>

            {/* Lado Direito: Identificador do Relatório com a cor primária configurada pela empresa */}
            <div className="text-left sm:text-right space-y-1">
              <span
                className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border inline-block shadow-sm text-[var(--btn-primary)] border-[var(--btn-primary)]/40 bg-[var(--btn-primary)]/10"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--btn-primary) 12%, transparent)',
                  color: 'var(--btn-primary)',
                  borderColor: 'color-mix(in srgb, var(--btn-primary) 40%, transparent)',
                }}
              >
                {selectedFormat === 'evolucao' && 'RELATÓRIO DE EVOLUÇÃO FÍSICA GERAL'}
                {selectedFormat === 'rdo' && 'DIÁRIO DE OBRA OFICIAL (RDO)'}
                {selectedFormat === 'pendencias' && 'RELATÓRIO DE PENDÊNCIAS E PUNCH-LIST'}
                {selectedFormat === 'materiais' && 'RELATÓRIO DE ESTOQUE & MATERIAIS'}
                {selectedFormat === 'ferramentas' && 'RELATÓRIO DE FERRAMENTAS & CUSTÓDIA'}
                {selectedFormat === 'epis' && 'RELATÓRIO DE EPIS & FICHAS COM C.A.'}
                {selectedFormat === 'transferencias' && 'RELATÓRIO DE TRANSFERÊNCIAS'}
              </span>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block font-mono">
                Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Metadados: Obra, Escopo, Data de Geração e Responsável */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-slate-900/60 print:bg-slate-50 border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Obra / Empreendimento</span>
              <strong className="text-white print:text-black text-sm block truncate">{currentWork.name}</strong>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">{currentWork.city} - {currentWork.state}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 print:bg-slate-50 border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Escopo Filtrado</span>
              <strong className="text-white print:text-black text-xs block truncate">
                Local: {selectedLocation === 'all' ? 'Toda a Obra' : workFloors.find(f => f.id === selectedLocation)?.name}
              </strong>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block truncate">
                Disciplina: {selectedArea === 'all' ? 'Todas as Áreas' : selectedArea}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 print:bg-slate-50 border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Data de Geração</span>
              <strong className="text-white print:text-black text-sm block">{filterDate.split('-').reverse().join('/')}</strong>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">
                {currentWork.interventionType || 'Construção Civil'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 print:bg-slate-50 border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Responsável Técnico</span>
              <strong className="text-white print:text-black text-xs block truncate">{currentUser.name}</strong>
              <span className="text-[10px] font-bold block text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FORMATO 1: EVOLUÇÃO FÍSICA GERAL (% TOTAL E BARRAS POR ÁREA/DISCIPLINA)
            ========================================================================= */}
        {selectedFormat === 'evolucao' && (
          <div className="space-y-6">
            {/* Bloco 1: Indicador Principal de Progresso Geral */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-4 a4-section-block">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-16 h-16 rounded-2xl border flex items-center justify-center font-mono font-black text-2xl print:bg-slate-200 print:text-black print:border-slate-400 shadow-inner text-[var(--btn-primary)] border-[var(--btn-primary)]/40 bg-[var(--btn-primary)]/15"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--btn-primary) 15%, transparent)',
                      color: 'var(--btn-primary)',
                      borderColor: 'color-mix(in srgb, var(--btn-primary) 40%, transparent)',
                    }}
                  >
                    {globalEvolutionStats.overallPercent}%
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400 print:text-slate-700 block">
                      Avanço Físico Global do Empreendimento
                    </span>
                    <span className="text-sm font-semibold text-white print:text-black">
                      {globalEvolutionStats.completed} de {filteredServices.length} frentes de serviço concluídas
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                    <span className="text-[10px] text-slate-400 block">Concluídos</span>
                    <strong className="text-emerald-400 print:text-emerald-700 font-mono text-sm">
                      {globalEvolutionStats.completed}
                    </strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                    <span className="text-[10px] text-slate-400 block">Em Andamento</span>
                    <strong className="font-mono text-sm text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }}>
                      {globalEvolutionStats.inProgress}
                    </strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                    <span className="text-[10px] text-slate-400 block">Não Iniciados</span>
                    <strong className="text-slate-400 print:text-slate-700 font-mono text-sm">
                      {globalEvolutionStats.notStarted}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso Global estilizada com a Cor Primária da Empresa */}
              <div className="w-full h-3 rounded-full bg-slate-800 print:bg-slate-200 overflow-hidden border border-slate-700/60 print:border-slate-300">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-[var(--btn-primary)]"
                  style={{
                    width: `${globalEvolutionStats.overallPercent}%`,
                    backgroundColor: 'var(--btn-primary)',
                  }}
                />
              </div>
            </div>

            {/* Bloco 2: Lista com Barras de Progresso por Área / Disciplina */}
            <div className="space-y-4">
              <h3
                className="text-sm font-bold uppercase tracking-wider print:text-black flex items-center justify-between text-[var(--btn-primary)]"
                style={{ color: 'var(--btn-primary)' }}
              >
                <span>Evolução por Disciplina / Área Técnica ({groupedDisciplines.length})</span>
                <span className="text-xs font-normal text-slate-400 print:text-slate-600">
                  Média ponderada dos serviços aplicados
                </span>
              </h3>

              <div className="space-y-3">
                {groupedDisciplines.map((disc) => (
                  <div
                    key={disc.name}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-slate-300 space-y-3 a4-section-block"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="p-1.5 rounded-lg border text-xs text-[var(--btn-primary)] border-[var(--btn-primary)]/40 bg-[var(--btn-primary)]/10"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--btn-primary) 12%, transparent)',
                            color: 'var(--btn-primary)',
                            borderColor: 'color-mix(in srgb, var(--btn-primary) 40%, transparent)',
                          }}
                        >
                          <HardHat className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white print:text-black">{disc.name}</h4>
                          <span className="text-[10px] text-slate-400 print:text-slate-600">
                            {disc.total} serviços • {disc.completed} concluídos • {disc.inProgress} em andamento
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-white print:text-black">
                          {disc.evolutionPercent}% concluído
                        </span>
                        <div className="w-32 sm:w-44 h-2 rounded-full bg-slate-800 print:bg-slate-200 overflow-hidden border border-slate-700">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${disc.evolutionPercent}%`,
                              backgroundColor: disc.evolutionPercent > 0 ? 'var(--btn-primary)' : '#475569',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tabela dos Serviços da Disciplina */}
                    <div className="overflow-x-auto pt-1 a4-table-container">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 print:border-slate-300 text-[10px] uppercase font-semibold text-slate-400 print:text-slate-700">
                            <th className="py-1.5">Código / Serviço</th>
                            <th className="py-1.5">Locais de Aplicação</th>
                            <th className="py-1.5">Responsável</th>
                            <th className="py-1.5 text-center">Status</th>
                            <th className="py-1.5 text-right">Avanço</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 text-[11px]">
                          {disc.services.map((srv) => {
                            const evo = getServiceEvolution(srv);
                            const locNames = (srv.locationProgress || []).map((l) => l.locationName).join(', ') || srv.floorName;
                            const photos = srv.proofPhotos || [];

                            return (
                              <React.Fragment key={srv.id}>
                                <tr>
                                  <td className="py-2 text-white print:text-black font-medium">
                                    {srv.eapServiceCode && (
                                      <span
                                        className="font-mono font-bold mr-1.5 text-[var(--btn-primary)]"
                                        style={{ color: 'var(--btn-primary)' }}
                                      >
                                        [{srv.eapServiceCode}]
                                      </span>
                                    )}
                                    {srv.name}
                                  </td>
                                  <td className="py-2 text-slate-300 print:text-slate-800 max-w-xs truncate">
                                    {locNames}
                                  </td>
                                  <td className="py-2 text-slate-400 print:text-slate-700">{srv.responsibleName}</td>
                                  <td className="py-2 text-center">
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                        srv.status === 'Concluído'
                                          ? 'bg-emerald-500/20 text-emerald-400 print:bg-emerald-100 print:text-emerald-800'
                                          : srv.status === 'Em andamento'
                                          ? 'bg-amber-500/20 text-amber-400 print:bg-amber-100 print:text-amber-800'
                                          : 'bg-slate-800 text-slate-400 print:bg-slate-200 print:text-slate-700'
                                      }`}
                                    >
                                      {srv.status}
                                    </span>
                                  </td>
                                  <td className="py-2 text-right font-mono font-bold text-white print:text-black">
                                    {evo}%
                                  </td>
                                </tr>

                                {/* GALERIA FOTOGRÁFICA DO SERVIÇO (SE TOGGLE ATIVO) */}
                                {includePhotos && photos.length > 0 && (
                                  <tr className="bg-slate-900/30 print:bg-slate-50">
                                    <td colSpan={5} className="py-2 px-3">
                                      <div className="space-y-1.5">
                                        <span
                                          className="text-[10px] font-bold flex items-center gap-1 text-[var(--btn-primary)]"
                                          style={{ color: 'var(--btn-primary)' }}
                                        >
                                          <Camera className="w-3 h-3 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                                          Fotos de Comprovação Anexadas ({photos.length}):
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {photos.map((p) => (
                                            <div
                                              key={p.id}
                                              onClick={() => setPreviewPhoto(p)}
                                              className="relative rounded-lg overflow-hidden border border-slate-700 print:border-slate-300 w-24 h-16 group cursor-pointer bg-black"
                                            >
                                              <img
                                                src={p.url}
                                                alt={p.caption || 'Foto'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                              />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-1 flex flex-col justify-end text-[8px] text-white font-mono">
                                                <span>{p.date}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FORMATO 2: DIÁRIO DE OBRA (RDO)
            ========================================================================= */}
        {selectedFormat === 'rdo' && (
          <div className="space-y-6">
            {/* Bloco de Condições do Dia & Clima */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl border print:bg-slate-100 text-[var(--btn-primary)] border-[var(--btn-primary)]/40 bg-[var(--btn-primary)]/15"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--btn-primary) 12%, transparent)',
                    color: 'var(--btn-primary)',
                    borderColor: 'color-mix(in srgb, var(--btn-primary) 40%, transparent)',
                  }}
                >
                  <Sun className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 print:text-slate-600 block">
                    Diário de Obra — Relatório Diário de Obras (RDO)
                  </span>
                  <span className="text-sm font-black text-white print:text-black">
                    Data: {filterDate.split('-').reverse().join('/')} ({new Date(filterDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })})
                  </span>
                </div>
              </div>

              {/* Seletor de Condições Climáticas (Interativo em tela, fixo na impressão) */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 print:text-slate-700">Clima / Tempo:</span>
                <select
                  value={rdoWeather}
                  onChange={(e) => setRdoWeather(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 print:bg-white print:border-slate-400 text-xs font-semibold text-white print:text-black"
                >
                  <option value="Ensolarado">☀️ Ensolarado (Praticável)</option>
                  <option value="Nublado">⛅ Nublado (Praticável)</option>
                  <option value="Chuvoso">🌧️ Chuvoso (Parcial)</option>
                  <option value="Instável">⛈️ Chuva Intensa (Impraticável)</option>
                </select>
              </div>
            </div>

            {/* SEÇÃO 1: SERVIÇOS EXECUTADOS E EM ANDAMENTO NO PERÍODO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 print:border-slate-300">
                <h3
                  className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-[var(--btn-primary)]"
                  style={{ color: 'var(--btn-primary)' }}
                >
                  <TrendingUp className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  1. Serviços Executados e em Andamento ({rdoData.services.length})
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">
                  Frentes ativas reportadas pela fiscalização
                </span>
              </div>

              {rdoData.services.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 rounded-lg bg-slate-950/40 border border-slate-800">
                  Nenhum serviço reportado em andamento ou concluído para os filtros selecionados.
                </div>
              ) : (
                <div className="space-y-3">
                  {rdoData.services.map((srv, idx) => {
                    const photos = srv.proofPhotos || [];
                    const locs = (srv.locationProgress || []).map((l) => `${l.locationName} (${l.status})`).join(', ') || srv.floorName;

                    return (
                      <div
                        key={srv.id}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-slate-300 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className="text-[10px] font-mono font-bold mr-2 text-[var(--btn-primary)]"
                              style={{ color: 'var(--btn-primary)' }}
                            >
                              ITEM {idx + 1}
                            </span>
                            <strong className="text-white print:text-black text-sm">{srv.name}</strong>
                            <div className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">
                              Disciplina: <strong>{srv.area}</strong> • Responsável: <strong>{srv.responsibleName}</strong>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              srv.status === 'Concluído'
                                ? 'bg-emerald-500/20 text-emerald-300 print:bg-emerald-100 print:text-emerald-800'
                                : 'bg-amber-500/20 text-amber-300 print:bg-amber-100 print:text-amber-800'
                            }`}
                          >
                            {srv.status}
                          </span>
                        </div>

                        {/* Locais Apontados */}
                        <div className="p-2 rounded-lg bg-slate-900/60 print:bg-slate-100 text-[11px] text-slate-300 print:text-slate-800">
                          <strong>Locais de Execução:</strong> {locs}
                        </div>

                        {/* Diário de Campo / Observações */}
                        {srv.notes && (
                          <p className="text-[11px] text-slate-400 print:text-slate-700 italic">
                            &quot;{srv.notes}&quot;
                          </p>
                        )}

                        {/* Galeria de Fotos do Dia (se Toggle Ativo) */}
                        {includePhotos && photos.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/60 print:border-slate-200">
                            <span
                              className="text-[10px] font-bold block mb-1 text-[var(--btn-primary)]"
                              style={{ color: 'var(--btn-primary)' }}
                            >
                              Registros Fotográficos de Comprovação:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {photos.map((p) => (
                                <div
                                  key={p.id}
                                  onClick={() => setPreviewPhoto(p)}
                                  className="rounded-lg overflow-hidden border border-slate-700 print:border-slate-300 w-28 h-20 bg-black cursor-pointer relative group"
                                >
                                  <img
                                    src={p.url}
                                    alt={p.caption || 'Foto RDO'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-1 flex flex-col justify-end text-[9px] text-white font-mono">
                                    <span className="truncate">{p.caption || p.date}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SEÇÃO 2: EQUIPE PRESENTE NA OBRA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 print:border-slate-300">
                <h3
                  className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-[var(--btn-primary)]"
                  style={{ color: 'var(--btn-primary)' }}
                >
                  <Users className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  2. Mão de Obra e Equipe Presente ({rdoData.employees.length} colaboradores ativos)
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">
                  Controle diário de efetivo em canteiro
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 print:border-slate-300 text-[10px] uppercase font-semibold text-slate-400 print:text-slate-700">
                      <th className="py-2">Colaborador</th>
                      <th className="py-2">Cargo / Função</th>
                      <th className="py-2">Matrícula / Vínculo</th>
                      <th className="py-2">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 text-[11px]">
                    {rdoData.employees.map((emp) => (
                      <tr key={emp.id}>
                        <td className="py-2 font-bold text-white print:text-black">{emp.name}</td>
                        <td className="py-2 text-slate-300 print:text-slate-800">{emp.functionName}</td>
                        <td className="py-2 text-slate-400 print:text-slate-600 font-mono">{emp.code || 'Próprio CLT'}</td>
                        <td className="py-2">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 print:bg-emerald-100 print:text-emerald-800">
                            Presente na Obra
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SEÇÃO 3: OCORRÊNCIAS DO DIA / PERÍODO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 print:border-slate-300">
                <h3
                  className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-[var(--btn-primary)]"
                  style={{ color: 'var(--btn-primary)' }}
                >
                  <AlertCircle className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  3. Ocorrências, Atestados e Afastamentos do Período ({rdoData.occurrences.length})
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">
                  Registros legais e diário de ausências
                </span>
              </div>

              {rdoData.occurrences.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500 rounded-lg bg-slate-950/40 border border-slate-800 italic">
                  Sem ocorrências ou afastamentos atípicos registrados nesta data. Expediente regular.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 print:border-slate-300 text-[10px] uppercase font-semibold text-slate-400 print:text-slate-700">
                        <th className="py-2">Colaborador</th>
                        <th className="py-2">Tipo de Ocorrência</th>
                        <th className="py-2">Horas / Duração</th>
                        <th className="py-2">Motivo / Justificativa</th>
                        <th className="py-2 text-right">Autorização</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 text-[11px]">
                      {rdoData.occurrences.map((occ) => (
                        <tr key={occ.id}>
                          <td className="py-2 font-bold text-white print:text-black">{occ.employeeName}</td>
                          <td className="py-2 text-slate-200 print:text-slate-900 font-semibold">{occ.type}</td>
                          <td className="py-2 text-slate-300 print:text-slate-700 font-mono">
                            {occ.hours ? `${occ.hours} horas` : occ.daysCount ? `${occ.daysCount} dias` : 'Turno'}
                          </td>
                          <td className="py-2 text-slate-400 print:text-slate-600 max-w-xs truncate">{occ.reason}</td>
                          <td className="py-2 text-right">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                occ.isAllowed
                                  ? 'bg-emerald-500/20 text-emerald-300 print:bg-emerald-100 print:text-emerald-800'
                                  : 'bg-slate-800 text-slate-300 print:bg-slate-200 print:text-slate-800'
                              }`}
                            >
                              {occ.isAllowed ? 'Abonado / Justificado' : 'Aguardando Aprovação'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            FORMATO 3: RELATÓRIO DE PENDÊNCIAS (PUNCH-LIST POR LOCAL DO MAPA)
            ========================================================================= */}
        {selectedFormat === 'pendencias' && (
          <div className="space-y-6">
            <div
              className="p-4 rounded-xl border print:bg-slate-50 print:border-slate-300 space-y-2 border-[var(--btn-primary)]/40 bg-[var(--btn-primary)]/10"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--btn-primary) 12%, transparent)',
                borderColor: 'color-mix(in srgb, var(--btn-primary) 35%, transparent)',
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black uppercase flex items-center gap-1.5 text-[var(--btn-primary)]"
                  style={{ color: 'var(--btn-primary)' }}
                >
                  <AlertTriangle className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  Quadro de Pendências e Serviços a Concluir
                </span>
                <span className="text-xs font-bold font-mono text-white print:text-black">
                  {pendingByLocation.reduce((acc, l) => acc + l.totalPending, 0)} pendências ativas
                </span>
              </div>
              <p className="text-xs text-slate-300 print:text-slate-700">
                Lista focada exclusivamente nos serviços com status <strong>&quot;Não Iniciado&quot;</strong> ou <strong>&quot;Em Andamento&quot;</strong>, organizados por pavimento/ambiente para vistoria de campo e cobrança de frentes.
              </p>
            </div>

            {pendingByLocation.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Nenhuma pendência encontrada!</h4>
                <p className="text-xs text-slate-400">
                  Todos os serviços do escopo selecionado já foram marcados como <strong>Concluídos</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {pendingByLocation.map((group) => (
                  <div
                    key={group.floorId}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-slate-300 space-y-3"
                  >
                    {/* Cabeçalho do Local / Pavimento */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 print:border-slate-300">
                      <div className="flex items-center gap-2">
                        <span
                          className="p-1.5 rounded-lg border text-xs text-[var(--btn-primary)] border-[var(--btn-primary)]/40 bg-[var(--btn-primary)]/10"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--btn-primary) 12%, transparent)',
                            color: 'var(--btn-primary)',
                            borderColor: 'color-mix(in srgb, var(--btn-primary) 40%, transparent)',
                          }}
                        >
                          <Layers className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white print:text-black">
                            {group.floorName}
                          </h4>
                          <span className="text-[10px] text-slate-400 print:text-slate-600">
                            Local do Mapa da Obra
                          </span>
                        </div>
                      </div>

                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-mono font-bold border text-[var(--btn-primary)] border-[var(--btn-primary)]/40 bg-[var(--btn-primary)]/15"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--btn-primary) 15%, transparent)',
                          color: 'var(--btn-primary)',
                          borderColor: 'color-mix(in srgb, var(--btn-primary) 40%, transparent)',
                        }}
                      >
                        {group.totalPending} pendências
                      </span>
                    </div>

                    {/* Tabela de Serviços Pendentes no Local */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 print:border-slate-300 text-[10px] uppercase font-semibold text-slate-400 print:text-slate-700">
                            <th className="py-2">Código EAP / Serviço</th>
                            <th className="py-2">Disciplina</th>
                            <th className="py-2">Responsável</th>
                            <th className="py-2">Previsão Fim</th>
                            <th className="py-2 text-right">Status Atual</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 text-[11px]">
                          {group.services.map((srv) => {
                            const photos = srv.proofPhotos || [];

                            return (
                              <React.Fragment key={srv.id}>
                                <tr>
                                  <td className="py-2 text-white print:text-black font-semibold">
                                    {srv.eapServiceCode && (
                                      <span
                                        className="font-mono font-bold mr-1.5 text-[var(--btn-primary)]"
                                        style={{ color: 'var(--btn-primary)' }}
                                      >
                                        [{srv.eapServiceCode}]
                                      </span>
                                    )}
                                    {srv.name}
                                  </td>
                                  <td className="py-2 text-slate-400 print:text-slate-700">{srv.area}</td>
                                  <td className="py-2 text-slate-300 print:text-slate-800">{srv.responsibleName}</td>
                                  <td className="py-2 font-mono text-slate-400 print:text-slate-700">
                                    {srv.predictedEndDate ? srv.predictedEndDate.split('-').reverse().join('/') : 'A definir'}
                                  </td>
                                  <td className="py-2 text-right">
                                    <span
                                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                        srv.status === 'Em andamento'
                                          ? 'bg-amber-500/20 text-amber-300 print:bg-amber-100 print:text-amber-800'
                                          : 'bg-slate-800 text-slate-400 print:bg-slate-200 print:text-slate-700'
                                      }`}
                                    >
                                      {srv.status}
                                    </span>
                                  </td>
                                </tr>

                                {/* Fotos Comprobatórias das Pendências (se Toggle Ativo) */}
                                {includePhotos && photos.length > 0 && (
                                  <tr className="bg-slate-900/30 print:bg-slate-50">
                                    <td colSpan={5} className="py-2 px-3">
                                      <div className="space-y-1">
                                        <span
                                          className="text-[10px] font-bold flex items-center gap-1 text-[var(--btn-primary)]"
                                          style={{ color: 'var(--btn-primary)' }}
                                        >
                                          <Camera className="w-3 h-3 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                                          Fotos da Frente Pendente ({photos.length}):
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {photos.map((p) => (
                                            <div
                                              key={p.id}
                                              onClick={() => setPreviewPhoto(p)}
                                              className="rounded-lg overflow-hidden border border-slate-700 print:border-slate-300 w-24 h-16 bg-black cursor-pointer relative group"
                                            >
                                              <img
                                                src={p.url}
                                                alt={p.caption || 'Foto Pendência'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                              />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1 flex flex-col justify-end text-[8px] text-white font-mono">
                                                <span>{p.date}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            FORMATOS DE APOIO: MATERIAIS, FERRAMENTAS, EPIS E TRANSFERÊNCIAS
            ========================================================================= */}
        {selectedFormat === 'materiais' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white print:text-black">
              Posição Atual de Estoque — Materiais Críticos e Regulares ({materials.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700 text-[10px] uppercase font-semibold">
                    <th className="py-2">Código / Material</th>
                    <th className="py-2">Categoria</th>
                    <th className="py-2 text-right">Mínimo</th>
                    <th className="py-2 text-right">Saldo Atual</th>
                    <th className="py-2 text-center">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {materials.map((m) => {
                    const isCrit = m.currentStock <= m.minStock;
                    return (
                      <tr key={m.id}>
                        <td className="py-2 font-medium text-white print:text-black">
                          {m.name} <span className="text-[10px] text-slate-500 font-mono">({m.code || 'S/C'})</span>
                        </td>
                        <td className="py-2 text-slate-400 print:text-slate-700">{m.category}</td>
                        <td className="py-2 text-right font-mono text-slate-400 print:text-slate-700">{m.minStock} {m.unit}</td>
                        <td className="py-2 text-right font-mono font-bold text-white print:text-black">{m.currentStock} {m.unit}</td>
                        <td className="py-2 text-center">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isCrit ? 'bg-red-500/20 text-red-300 print:text-red-700' : 'bg-emerald-500/20 text-emerald-300 print:text-emerald-700'
                            }`}
                          >
                            {isCrit ? 'CRÍTICO' : 'REGULAR'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedFormat === 'ferramentas' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white print:text-black">
              Patrimônio e Custódia de Ferramentas Elétricas e Equipamentos ({tools.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700 text-[10px] uppercase font-semibold">
                    <th className="py-2">Código / Ferramenta</th>
                    <th className="py-2">Marca / Modelo</th>
                    <th className="py-2">Condição</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Responsável Atual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {tools.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2 font-medium text-white print:text-black">
                        {t.name} <span className="text-[10px] text-slate-500 font-mono">({t.code || 'S/P'})</span>
                      </td>
                      <td className="py-2 text-slate-400 print:text-slate-700">{t.brand} {t.model}</td>
                      <td className="py-2 text-slate-300 print:text-slate-800">{t.condition}</td>
                      <td className="py-2 font-bold text-slate-200 print:text-slate-900">{t.status}</td>
                      <td className="py-2 text-slate-300 print:text-slate-800">{t.currentEmployeeName || 'No almoxarifado'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedFormat === 'epis' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white print:text-black">
              Fichas de Entrega de EPIs com Certificado de Aprovação (C.A.) ({epiDeliveries.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700 text-[10px] uppercase font-semibold">
                    <th className="py-2">Colaborador</th>
                    <th className="py-2">Equipamento Fornecido</th>
                    <th className="py-2">Nº C.A.</th>
                    <th className="py-2">Fabricante</th>
                    <th className="py-2">Movimento</th>
                    <th className="py-2 text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {epiDeliveries.map((del) => (
                    <tr key={del.id}>
                      <td className="py-2 font-bold text-white print:text-black">{del.employeeName}</td>
                      <td className="py-2 text-slate-300 print:text-slate-800">{del.quantity}x {del.epiName}</td>
                      <td className="py-2 font-mono font-bold text-slate-200 print:text-slate-900">{del.caNumberSnapshot}</td>
                      <td className="py-2 text-slate-400 print:text-slate-700">{del.manufacturerSnapshot}</td>
                      <td className="py-2 text-slate-300 print:text-slate-800">{del.movementType}</td>
                      <td className="py-2 text-right font-mono text-slate-400 print:text-slate-700">{del.timestamp.split(' ')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            BLOCO OFICIAL DE ASSINATURAS (CONFORME NBR E EXIGÊNCIAS DE FISCALIZAÇÃO)
            ========================================================================= */}
        <div className="pt-10 border-t border-slate-800 print:border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-xs text-slate-400 print:text-slate-700 a4-signature-block">
          <div>
            <div className="border-t border-slate-700 print:border-slate-400 w-44 mx-auto mb-1 pt-1" />
            <strong className="text-white print:text-black block text-xs">Mestre de Obras / Encarregado</strong>
            <span className="text-[10px] text-slate-500">Responsável Operacional</span>
          </div>
          <div>
            <div className="border-t border-slate-700 print:border-slate-400 w-44 mx-auto mb-1 pt-1" />
            <strong className="text-white print:text-black block text-xs">{currentUser.name}</strong>
            <span className="text-[10px] text-slate-500">Engenheiro Residente (CREA)</span>
          </div>
          <div>
            <div className="border-t border-slate-700 print:border-slate-400 w-44 mx-auto mb-1 pt-1" />
            <strong className="text-white print:text-black block text-xs">Fiscalização / Contratante</strong>
            <span className="text-[10px] text-slate-500">Aprovação da Medição</span>
          </div>
        </div>

        {/* NOTA DISCRETA NO RODAPÉ CONFORME PADRÃO WHITE-LABEL */}
        <div className="pt-6 border-t border-slate-800/40 print:border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 print:text-slate-400 font-mono tracking-wide">
            Documento gerado via plataforma Canteiro
          </span>
        </div>
      </div>

      {/* =========================================================================
          MODAL: LIGHTBOX DE VISUALIZAÇÃO AMPLIADA DA FOTO
          ========================================================================= */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 print:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-4 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-bold text-[var(--btn-primary)]"
                  style={{ color: 'var(--btn-primary)' }}
                >
                  📅 {previewPhoto.date}
                </span>
                {previewPhoto.locationName && (
                  <span className="text-xs font-semibold text-slate-300">
                    • {previewPhoto.locationName}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.caption || 'Foto da obra'}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            {previewPhoto.caption && (
              <p className="text-xs text-slate-300 px-1 font-medium">
                {previewPhoto.caption}
              </p>
            )}

            {previewPhoto.uploadedBy && (
              <span className="text-[10px] text-slate-500 block px-1">
                Enviado por: {previewPhoto.uploadedBy}
              </span>
            )}
          </div>
        </div>
      )}
      </div>

      {/* =========================================================================
          CONTAINER JSX ISOLADO EXCLUSIVAMENTE PARA PAPEL A4 (IMPRESSÃO / PDF)
          ========================================================================= */}
      <div className="hidden print:flex print:flex-col print:w-full print:bg-white print:text-black print:absolute print:top-0 print:left-0 print:z-50 print:p-8">
        {renderA4SheetBody()}
      </div>
    </>
  );
};

export default ReportsView;
