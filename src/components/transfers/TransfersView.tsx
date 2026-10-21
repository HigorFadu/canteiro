import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeftRight, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Share2, 
  Building2, 
  Plus, 
  ExternalLink,
  Truck,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Filter,
  Package,
  Wrench,
  Shield,
  Layers,
  HelpCircle,
  FileText,
  Radio,
  Split,
  Scale,
  Copy,
  MapPin,
  UserCheck,
  Phone,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Receipt,
  RotateCcw,
  Boxes,
  Info
} from 'lucide-react';
import { 
  TransferRequest, 
  TransferType, 
  TransferStatus,
  FractionalContribution,
  MaterialDebtBalance,
  MaterialAccountTransaction 
} from '../../types';

export const TransfersView: React.FC = () => {
  const { 
    transfers, 
    works,
    currentWork, 
    currentUser, 
    hasPermission, 
    createTransferRequest,
    createBroadcastRequest,
    contributeToTransferRequest,
    materialDebts,
    materialTransactions,
    settleDebtBalance,
    showToast 
  } = useApp();

  const currentObra = currentWork;

  // Tabs do Módulo
  const [activeTab, setActiveTab] = useState<'mural' | 'conta_corrente' | 'rotas'>('mural');

  // Modais
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isLegacyModalOpen, setIsLegacyModalOpen] = useState(false);

  // Seleções ativas
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null);
  const [selectedDebt, setSelectedDebt] = useState<MaterialDebtBalance | null>(null);
  const [requestForRoute, setRequestForRoute] = useState<TransferRequest | null>(null);

  // Filtros do Mural
  const [muralStatusFilter, setMuralStatusFilter] = useState<'all' | 'abertos' | 'concluidos' | 'minhas'>('all');
  const [muralSearchTerm, setMuralSearchTerm] = useState('');

  // Filtros da Conta-Corrente
  const [debtWorkFilter, setDebtWorkFilter] = useState<string>('all');
  const [debtSearchTerm, setDebtSearchTerm] = useState('');

  // ---------------------------------------------------------------------------
  // ESTATÍSTICAS E KPIS DO MÓDULO
  // ---------------------------------------------------------------------------
  const stats = useMemo(() => {
    const broadcastList = transfers.filter((t) => t.isBroadcast !== false);
    const openOrders = broadcastList.filter((t) => {
      const fulfilled = t.fulfilledQuantity || 0;
      return fulfilled < t.requestedQuantity && t.status !== 'Encerrado';
    });
    const completedOrders = broadcastList.filter((t) => {
      const fulfilled = t.fulfilledQuantity || 0;
      return fulfilled >= t.requestedQuantity;
    });
    const activeDebts = materialDebts.filter((d) => {
      if (d.balance <= 0) return false;
      if (currentObra?.id) {
        const dId = d.debtorId || d.debtorWorkId;
        const cId = d.creditorId || d.creditorWorkId;
        return dId === currentObra.id || cId === currentObra.id;
      }
      return true;
    });
    const totalTransactions = materialTransactions.length;
    const totalDeductions = materialTransactions.filter((tx) => tx.type === 'ABATIMENTO' || tx.type === 'QUITACAO').length;

    return {
      openCount: openOrders.length,
      completedCount: completedOrders.length,
      activeDebtsCount: activeDebts.length,
      totalDeductions,
      totalTransactions,
    };
  }, [transfers, materialDebts, materialTransactions, currentObra?.id]);

  // ---------------------------------------------------------------------------
  // LISTA DO MURAL FILTRADA
  // ---------------------------------------------------------------------------
  const filteredBroadcastRequests = useMemo(() => {
    return transfers.filter((t) => {
      const fulfilled = t.fulfilledQuantity || 0;
      const isComplete = fulfilled >= t.requestedQuantity;

      // Filtro de status
      if (muralStatusFilter === 'abertos' && isComplete) return false;
      if (muralStatusFilter === 'concluidos' && !isComplete) return false;
      if (muralStatusFilter === 'minhas' && t.originWorkId !== currentWork.id) return false;

      // Filtro de busca
      if (muralSearchTerm.trim()) {
        const term = muralSearchTerm.toLowerCase();
        const matchesMat = t.materialName.toLowerCase().includes(term);
        const matchesOrigin = t.originWorkName.toLowerCase().includes(term);
        const matchesType = (t.itemType || '').toLowerCase().includes(term);
        if (!matchesMat && !matchesOrigin && !matchesType) return false;
      }

      return true;
    });
  }, [transfers, muralStatusFilter, muralSearchTerm, currentWork.id]);

  // ---------------------------------------------------------------------------
  // LISTA DE SALDOS DEVEDORES FILTRADA
  // ---------------------------------------------------------------------------
  const filteredDebts = useMemo(() => {
    return materialDebts.filter((d) => {
      const debtorId = d.debtorId || d.debtorWorkId;
      const creditorId = d.creditorId || d.creditorWorkId;
      const targetWorkId = debtWorkFilter !== 'all' ? debtWorkFilter : currentObra?.id;

      if (targetWorkId) {
        if (debtorId !== targetWorkId && creditorId !== targetWorkId) {
          return false;
        }
      }

      if (debtSearchTerm.trim()) {
        const term = debtSearchTerm.toLowerCase();
        const matchMat = d.materialName.toLowerCase().includes(term);
        const matchDebtor = (d.debtorWorkName || '').toLowerCase().includes(term);
        const matchCreditor = (d.creditorWorkName || '').toLowerCase().includes(term);
        if (!matchMat && !matchDebtor && !matchCreditor) return false;
      }
      return true;
    });
  }, [materialDebts, debtWorkFilter, debtSearchTerm, currentObra?.id]);

  // ---------------------------------------------------------------------------
  // COMPILADOR DE ROTEIRIZAÇÃO VIA WHATSAPP (REGRA 3)
  // Contém:
  // - Lista de obras fornecedoras
  // - Endereços de coleta
  // - Nomes dos almoxarifes
  // - Quantidade a retirar em cada local
  // - Endereço final de entrega
  // ---------------------------------------------------------------------------
  const compileWhatsAppRouteMessage = (t: TransferRequest): string => {
    const contributions = t.contributions || [];
    const totalCollected = contributions.reduce((acc, c) => acc + c.quantity, 0);

    const deliveryAddress = t.deliveryAddress || 
      works.find((w) => w.id === t.originWorkId)?.address || 
      'Canteiro da Obra Solicitante';

    const deliveryManager = t.targetWarehouseManager || t.requestedByUserName;

    let pointsText = '';
    if (contributions.length === 0) {
      pointsText = '⚠️ Nenhuma coleta fracionada registrada até o momento.';
    } else {
      pointsText = contributions.map((c, index) => {
        return (
          `📍 *PONTO DE COLETA #${index + 1}*\n` +
          `🏭 *Obra Fornecedora:* ${c.supplyingWorkName}\n` +
          `📌 *Endereço de Retirada:* ${c.supplyingWorkAddress}\n` +
          `👤 *Almoxarife Responsável:* ${c.warehouseManagerName}` +
          (c.warehouseManagerPhone ? ` (${c.warehouseManagerPhone})` : '') + `\n` +
          `📦 *Quantidade a Retirar:* ${c.quantity} ${t.unit}\n` +
          (c.notes ? `📝 *Obs de Carregamento:* ${c.notes}\n` : '')
        );
      }).join('\n----------------------------------------\n\n');
    }

    const message = 
      `🚚 *ROTA DE COLETA LOGÍSTICA — CANTEIRO DE OBRAS*\n` +
      `📦 *Insumo:* ${t.materialName} (${t.itemType || 'Material'})\n` +
      `🔢 *Carga Total Programada:* ${t.requestedQuantity} ${t.unit} (Coletado: ${totalCollected} ${t.unit})\n` +
      `📅 *Data de Emissão:* ${t.requestedAt}\n\n` +
      `========================================\n` +
      `🚚 *PONTOS DE COLETA (FORNECEDORES):*\n` +
      `========================================\n\n` +
      `${pointsText}\n\n` +
      `========================================\n` +
      `🏁 *DESTINO FINAL DA ENTREGA:*\n` +
      `========================================\n` +
      `🏗️ *Obra Solicitante:* ${t.originWorkName}\n` +
      `📍 *Endereço de Entrega:* ${deliveryAddress}\n` +
      `👤 *Recebedor / Almoxarife:* ${deliveryManager}\n` +
      (t.notes ? `📝 *Observação do Pedido:* ${t.notes}\n` : '') +
      `\n⚠️ *Instrução ao Motorista:* Apresentar esta rota na guarita de cada canteiro para conferência física dos volumes e liberação da carga.`;

    return message;
  };

  const handleOpenRoute = (t: TransferRequest) => {
    setRequestForRoute(t);
    setIsRouteModalOpen(true);
  };

  const handleOpenContribute = (t: TransferRequest) => {
    setSelectedRequest(t);
    setIsContributeModalOpen(true);
  };

  const handleOpenSettle = (debt: MaterialDebtBalance) => {
    setSelectedDebt(debt);
    setIsSettleModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
          HEADER PRINCIPAL
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Boxes className="w-6 h-6 text-blue-400" />
              <span>Transferências entre Obras & Logística Fracionada</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium border border-slate-700">
              Obra Ativa: {currentWork.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-98"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <Radio className="w-4 h-4" />
            <span>Abrir Solicitação no Mural</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          CARDS DE KPIS / STATUS LOGÍSTICO
          ===================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Pedidos Abertos no Mural</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {stats.openCount}
              <span className="text-[10px] text-amber-400 font-normal ml-1">aguardando frações</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">100% Atendidos / Rotas</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {stats.completedCount}
              <span className="text-[10px] text-emerald-400 font-normal ml-1">prontos p/ coleta</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Saldos Devedores Ativos</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {stats.activeDebtsCount}
              <span className="text-[10px] text-blue-400 font-normal ml-1">contas-correntes</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Encontros de Contas</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {stats.totalDeductions}
              <span className="text-[10px] text-purple-400 font-normal ml-1">abatimentos auto</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          NAVEGAÇÃO POR ABAS DO MÓDULO
          ===================================================================== */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('mural')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'mural'
              ? 'border-[var(--btn-primary)] text-white bg-slate-850/50'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Radio className="w-4 h-4 text-blue-400" />
          <span>1. Mural de Solicitações (Broadcast)</span>
          {stats.openCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-300 border border-slate-700">
              {stats.openCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('conta_corrente')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'conta_corrente'
              ? 'border-[var(--btn-primary)] text-[var(--primary-color)] bg-slate-850/50'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Scale className={`w-4 h-4 ${activeTab === 'conta_corrente' ? 'text-[var(--primary-color)]' : 'text-slate-400'}`} />
          <span>2. Saldo Devedor & Conta-Corrente</span>
          {stats.activeDebtsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-300 border border-slate-700">
              {stats.activeDebtsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rotas')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'rotas'
              ? 'border-[var(--btn-primary)] text-white bg-slate-850/50'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>3. Rotas de Coleta Logística (WhatsApp)</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: MURAL DE SOLICITAÇÕES (BROADCAST & ATENDIMENTO FRACIONADO)
          ===================================================================== */}
      {activeTab === 'mural' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Barra de Filtros e Busca */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setMuralStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  muralStatusFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({transfers.length})
              </button>

              <button
                type="button"
                onClick={() => setMuralStatusFilter('abertos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  muralStatusFilter === 'abertos'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-amber-400/80 hover:bg-amber-500/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Em Aberto / Fracionados ({stats.openCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setMuralStatusFilter('concluidos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  muralStatusFilter === 'concluidos'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-emerald-400/80 hover:bg-emerald-500/10'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Concluídos ({stats.completedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setMuralStatusFilter('minhas')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  muralStatusFilter === 'minhas'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Minha Obra Solicitou
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={muralSearchTerm}
                onChange={(e) => setMuralSearchTerm(e.target.value)}
                placeholder="Buscar insumo ou obra..."
                className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
              />
            </div>
          </div>

          {/* Grid de Pedidos no Mural */}
          {filteredBroadcastRequests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-dashed border-slate-800 space-y-3">
              <Radio className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">Nenhum pedido no mural com os filtros atuais</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Crie um novo pedido global para transmitir a necessidade de insumos a todas as obras da empresa.
              </p>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
                style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Pedido no Mural</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBroadcastRequests.map((req) => {
                const fulfilled = req.fulfilledQuantity || 0;
                const total = req.requestedQuantity;
                const percent = Math.min(100, Math.round((fulfilled / total) * 100));
                const remaining = Math.max(0, total - fulfilled);
                const isComplete = percent >= 100;
                const contributions = req.contributions || [];

                return (
                  <div
                    key={req.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      isComplete
                        ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                            <Radio className="w-3 h-3" />
                            <span>Mural Global</span>
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {req.itemType || 'Material'}
                          </span>
                        </div>

                        {/* Status Badge */}
                        {isComplete ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>100% Concluído</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>{percent}% Atendido</span>
                          </span>
                        )}
                      </div>

                      {/* Nome do Insumo e Solicitante */}
                      <h3 className="text-base font-bold text-white leading-tight">
                        {req.materialName}
                      </h3>

                      <div className="mt-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-slate-500">Solicitante:</span>
                          <span className="font-bold text-white truncate">{req.originWorkName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Por: <strong>{req.requestedByUserName}</strong></span>
                          <span>·</span>
                          <span>{req.requestedAt}</span>
                        </div>
                        {req.deliveryAddress && (
                          <div className="flex items-start gap-1.5 text-slate-400 text-[11px] pt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <span className="truncate">{req.deliveryAddress}</span>
                          </div>
                        )}
                      </div>

                      {/* BARRA DE PROGRESSO DO ATENDIMENTO FRACIONADO (REGRA 2) */}
                      <div className="mt-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-300 font-bold">
                            Progresso: <strong className={isComplete ? 'text-emerald-400' : 'text-amber-400'}>{percent}%</strong>
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {fulfilled} de {total} {req.unit} {isComplete ? '(Completo)' : `(Faltam ${remaining} ${req.unit})`}
                          </span>
                        </div>

                        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              isComplete
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : 'bg-gradient-to-r from-amber-500 to-orange-400'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Lista de Contribuições Fracionadas */}
                      {contributions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Obras Contribuintes ({contributions.length}):
                          </span>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                            {contributions.map((c) => (
                              <div
                                key={c.id}
                                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] flex items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <Building2 className="w-3 h-3 text-emerald-400" />
                                    <span>{c.supplyingWorkName}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    Almoxarife: {c.warehouseManagerName} · {c.contributedAt.split(' ')[0]}
                                  </div>
                                </div>
                                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                  +{c.quantity} {req.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BOTÕES DE AÇÃO DO CARD */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      {!isComplete ? (
                        <>
                          <span className="text-[11px] font-mono text-amber-300/90 font-semibold">
                            Faltam {remaining} {req.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenContribute(req)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                          >
                            <Split className="w-3.5 h-3.5" />
                            <span>Contribuir / Enviar Fração</span>
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between gap-2">
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>100% Atendido</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenRoute(req)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 active:scale-95"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Gerar Rota de Coleta</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: SALDO DEVEDOR & CONTA-CORRENTE (REGRA 4 - ENCONTRO DE CONTAS)
          ===================================================================== */}
      {activeTab === 'conta_corrente' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          
          {/* Filtros da Conta-Corrente */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filtrar por Obra:</span>
              <select
                value={debtWorkFilter}
                onChange={(e) => setDebtWorkFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-[var(--btn-primary)]"
              >
                <option value="all">Todas as Obras</option>
                {works.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={debtSearchTerm}
                onChange={(e) => setDebtSearchTerm(e.target.value)}
                placeholder="Buscar insumo ou obra..."
                className="w-full sm:w-60 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
              />
            </div>
          </div>

          {/* MATRIZ DE SALDOS DEVEDORES ATIVOS (QUEM DEVE A QUEM) */}
          {(() => {
            const obraSelecionada = debtWorkFilter !== 'all'
              ? works.find((w) => w.id === debtWorkFilter)
              : currentObra;

            const debtsToDisplay = filteredDebts.filter((balance) => {
              if (obraSelecionada?.id) {
                const debtorId = balance.debtorId || balance.debtorWorkId;
                const creditorId = balance.creditorId || balance.creditorWorkId;
                return obraSelecionada.id === debtorId || obraSelecionada.id === creditorId;
              }
              return true;
            });

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  <span>
                    Matriz de Saldos Devedores Ativos ({debtsToDisplay.length})
                  </span>
                  <span className="text-[11px] text-[var(--primary-color)] font-semibold normal-case">
                    {obraSelecionada?.name ? `Obra selecionada: ${obraSelecionada.name}` : 'Visão Global (Todas as Obras)'}
                  </span>
                </div>

                {debtsToDisplay.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-sm font-medium text-slate-400">Nenhum saldo devedor</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {debtsToDisplay
                      .filter((balance) => {
                        if (obraSelecionada?.id) {
                          const debtorId = balance.debtorId || balance.debtorWorkId;
                          const creditorId = balance.creditorId || balance.creditorWorkId;
                          return obraSelecionada.id === debtorId || obraSelecionada.id === creditorId;
                        }
                        return true;
                      })
                      .map((debt) => {
                        const isSettled = debt.balance === 0;

                        return (
                          <div
                            key={debt.id}
                            className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                              isSettled
                                ? 'bg-slate-900/50 border-slate-800 opacity-60'
                                : 'bg-slate-900 border-amber-500/30 hover:border-amber-500/50 shadow-md'
                            }`}
                          >
                            <div>
                              {/* Header do Card */}
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  {debt.materialName}
                                </span>
                                {isSettled ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    Quitado
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    Saldo Ativo
                                  </span>
                                )}
                              </div>

                              {/* Relação Devedor ➔ Credor */}
                              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                                  <span className="text-slate-400 font-semibold w-16 shrink-0">Quem Deve:</span>
                                  <span className="font-bold text-white truncate">{debt.debtorWorkName}</span>
                                </div>

                                <div className="flex items-center gap-1.5 pl-3 text-slate-500 text-[10px]">
                                  <ArrowRight className="w-3 h-3 text-slate-600" />
                                  <span>Deve para:</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                  <span className="text-slate-400 font-semibold w-16 shrink-0">Credor:</span>
                                  <span className="font-bold text-emerald-300 truncate">{debt.creditorWorkName}</span>
                                </div>
                              </div>

                              {/* Saldo Líquido Devedor */}
                              <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                                <span className="text-xs text-slate-400 font-medium">Saldo Devedor:</span>
                                <span className="text-sm font-mono font-black text-amber-300">
                                  {debt.balance} {debt.unit}
                                </span>
                              </div>
                            </div>

                            {/* Ações */}
                            {!isSettled && (
                              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                                <span className="text-[10px] text-slate-500">
                                  Atualizado: {debt.lastUpdatedAt.split(' ')[0]}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenSettle(debt)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Liquidar / Abater</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* HISTÓRICO / EXTRATO DE MOVIMENTAÇÕES DA CONTA-CORRENTE */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              <span>Extrato de Movimentações da Conta-Corrente ({materialTransactions.length})</span>
              <span className="text-[11px] text-slate-400 font-semibold normal-case">
                Livro-Razão de débitos, créditos e abatimentos
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                    <th className="pb-2.5">Data / Hora</th>
                    <th className="pb-2.5">Tipo de Evento</th>
                    <th className="pb-2.5">Obra Devedora ➔ Credora</th>
                    <th className="pb-2.5">Insumo</th>
                    <th className="pb-2.5">Qtd. Movimentada</th>
                    <th className="pb-2.5">Saldo Devedor</th>
                    <th className="pb-2.5">Histórico / Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {materialTransactions.map((tx) => {
                    const isAbatimento = tx.type === 'ABATIMENTO' || tx.type === 'QUITACAO';

                    return (
                      <tr key={tx.id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="py-2.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="py-2.5">
                          {isAbatimento ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
                              <Sparkles className="w-3 h-3" />
                              <span>{tx.type === 'QUITACAO' ? 'QUITAÇÃO TOTAL' : 'ABATIMENTO AUTO'}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 w-max">
                              <TrendingUp className="w-3 h-3" />
                              <span>NOVA DÍVIDA</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5">
                          <div className="font-semibold text-white">
                            {tx.debtorWorkName} ➔ <span className="text-emerald-300">{tx.creditorWorkName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 font-semibold text-slate-200">
                          {tx.materialName}
                        </td>
                        <td className="py-2.5 font-mono font-bold text-white whitespace-nowrap">
                          {isAbatimento ? `-${tx.quantity}` : `+${tx.quantity}`} {tx.unit}
                        </td>
                        <td className="py-2.5 font-mono whitespace-nowrap">
                          <span className="text-slate-400">{tx.previousBalance}</span>
                          <span className="mx-1 text-slate-600">➔</span>
                          <strong className={tx.newBalance === 0 ? 'text-emerald-400' : 'text-amber-300'}>
                            {tx.newBalance} {tx.unit}
                          </strong>
                        </td>
                        <td className="py-2.5 text-[11px] text-slate-400 max-w-xs truncate" title={tx.description}>
                          {tx.description}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 3: CENTRAL DE ROTEIRIZAÇÃO & WHATSAPP
          ===================================================================== */}
      {activeTab === 'rotas' && (
        <div className="space-y-4 animate-in fade-in duration-150">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transfers.map((req) => {
              const fulfilled = req.fulfilledQuantity || 0;
              const isComplete = fulfilled >= req.requestedQuantity;
              const contributions = req.contributions || [];

              return (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                        {req.materialName}
                      </span>
                      {isComplete ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>100% Pronto</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {fulfilled}/{req.requestedQuantity} {req.unit}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-slate-500">Destino da Entrega:</span>
                        <strong className="text-white">{req.originWorkName}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-slate-500">Endereço:</span>
                        <span className="text-slate-300 truncate">{req.deliveryAddress || 'Canteiro Central'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-500">Pontos de Coleta:</span>
                        <strong className="text-emerald-300">{contributions.length} fornecedores</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenRoute(req)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Ver & Enviar Rota via WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =====================================================================
          MODAL 1: ABRIR SOLICITAÇÃO NO MURAL (BROADCAST)
          Informa: Insumo, Tipo e Quantidade Total Necessária.
          ===================================================================== */}
      {isBroadcastModalOpen && (
        <BroadcastRequestModal
          isOpen={isBroadcastModalOpen}
          onClose={() => setIsBroadcastModalOpen(false)}
          onSuccess={() => setIsBroadcastModalOpen(false)}
        />
      )}

      {/* =====================================================================
          MODAL 2: ATENDIMENTO FRACIONADO (CONTRIBUIR COM QUANTIDADE PARCIAL)
          Multiplas obras contribuem. Exibe barra e impacto na conta-corrente.
          ===================================================================== */}
      {isContributeModalOpen && selectedRequest && (
        <FractionalContributeModal
          isOpen={isContributeModalOpen}
          request={selectedRequest}
          onClose={() => {
            setIsContributeModalOpen(false);
            setSelectedRequest(null);
          }}
          onSuccess={() => {
            setIsContributeModalOpen(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {/* =====================================================================
          MODAL 3: ROTEIRIZAÇÃO VIA WHATSAPP (REGRA 3)
          Compila lista de fornecedores, endereços, almoxarifes e destino.
          ===================================================================== */}
      {isRouteModalOpen && requestForRoute && (
        <RouteWhatsAppModal
          isOpen={isRouteModalOpen}
          request={requestForRoute}
          message={compileWhatsAppRouteMessage(requestForRoute)}
          onClose={() => {
            setIsRouteModalOpen(false);
            setRequestForRoute(null);
          }}
        />
      )}

      {/* =====================================================================
          MODAL 4: LIQUIDAÇÃO MANUAL / DEVOLUÇÃO DIRETA DE SALDO DEVEDOR
          ===================================================================== */}
      {isSettleModalOpen && selectedDebt && (
        <SettleDebtModal
          isOpen={isSettleModalOpen}
          debt={selectedDebt}
          onClose={() => {
            setIsSettleModalOpen(false);
            setSelectedDebt(null);
          }}
          onSuccess={() => {
            setIsSettleModalOpen(false);
            setSelectedDebt(null);
          }}
        />
      )}

    </div>
  );
};

// ===============================================================================
// SUBCOMPONENTE 1: MODAL DE BROADCAST NO MURAL
// O solicitante informa: Insumo, Tipo e Quantidade Total Necessária.
// ===============================================================================
interface BroadcastRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BroadcastRequestModal: React.FC<BroadcastRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { works, currentWork, createBroadcastRequest, showToast } = useApp();

  const [originWorkId, setOriginWorkId] = useState<string>(currentWork.id || works[0]?.id || '');
  const [itemType, setItemType] = useState<string>('Material');
  const [materialName, setMaterialName] = useState<string>('');
  const [unit, setUnit] = useState<string>('Saco');
  const [requestedQuantity, setRequestedQuantity] = useState<number>(50);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(() => {
    const w = works.find((work) => work.id === currentWork.id);
    return w?.address ? `${w.address}, ${w.city}/${w.state}` : '';
  });
  const [targetWarehouseManager, setTargetWarehouseManager] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleOriginChange = (id: string) => {
    setOriginWorkId(id);
    const selected = works.find((w) => w.id === id);
    if (selected?.address) {
      setDeliveryAddress(`${selected.address}, ${selected.city}/${selected.state}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!materialName.trim()) {
      showToast({ type: 'warning', title: 'Campo Obrigatório', message: 'Informe o Nome do Insumo.' });
      return;
    }
    if (!requestedQuantity || requestedQuantity <= 0) {
      showToast({ type: 'warning', title: 'Quantidade Inválida', message: 'A quantidade deve ser maior que zero.' });
      return;
    }

    const originWork = works.find((w) => w.id === originWorkId) || currentWork;

    createBroadcastRequest({
      originWorkId,
      originWorkName: originWork.name,
      itemType,
      materialName: materialName.trim(),
      unit,
      requestedQuantity: Number(requestedQuantity),
      deliveryAddress: deliveryAddress.trim() || originWork.address,
      targetWarehouseManager: targetWarehouseManager.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Abrir Solicitação no Mural (Broadcast)
              </h2>
              <p className="text-xs text-slate-400">
                O pedido será transmitido globalmente para que todas as obras possam contribuir.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Obra Solicitante */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Obra Solicitante (Quem pede) *
            </label>
            <select
              value={originWorkId}
              onChange={(e) => handleOriginChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-[var(--btn-primary)] font-semibold"
            >
              {works.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} {w.id === currentWork.id ? '(Obra Ativa)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Insumo */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Tipo de Insumo *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'Material', icon: Package },
                { type: 'Ferramenta', icon: Wrench },
                { type: 'EPI', icon: Shield },
                { type: 'Equipamento', icon: Layers },
              ].map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setItemType(type)}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    itemType === type
                      ? 'bg-slate-800 border-[var(--btn-primary)] text-white ring-1 ring-[var(--btn-primary)]'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nome do Insumo e Unidade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Nome do Insumo Solicitado *
              </label>
              <input
                type="text"
                required
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder="Ex: Cimento CP II-32 (Saco 50kg), Barra Aço 10mm..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Unidade
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-[var(--btn-primary)]"
              >
                <option value="Saco">Saco</option>
                <option value="un">un (Unidades)</option>
                <option value="m²">m²</option>
                <option value="m³">m³</option>
                <option value="kg">kg</option>
                <option value="Barra">Barra</option>
                <option value="Par">Par</option>
                <option value="Metro">Metro</option>
                <option value="Caixa">Caixa</option>
              </select>
            </div>
          </div>

          {/* Quantidade Total Necessária */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-white">
              Quantidade Total Necessária *
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRequestedQuantity((prev) => Math.max(1, prev - 5))}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                -5
              </button>
              <input
                type="number"
                min={1}
                required
                value={requestedQuantity}
                onChange={(e) => setRequestedQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full text-center py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono font-bold text-white focus:outline-none focus:border-[var(--btn-primary)] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setRequestedQuantity((prev) => prev + 5)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                +5
              </button>
            </div>
            <span className="text-[11px] text-slate-400 block">
              Múltiplas obras poderão contribuir com frações até totalizar {requestedQuantity} {unit}.
            </span>
          </div>

          {/* Endereço de Entrega Final (Para rota WhatsApp) */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Endereço de Entrega (Destino Final da Carga)
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Ex: Rua das Palmeiras, 120 — Centro, Curitiba/PR"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
            />
          </div>

          {/* Nome do Recebedor / Almoxarife */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Nome do Almoxarife / Recebedor na Obra
            </label>
            <input
              type="text"
              value={targetWarehouseManager}
              onChange={(e) => setTargetWarehouseManager(e.target.value)}
              placeholder="Ex: Carlos Souza (Almoxarife Central)"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Observações / Justificativa (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Concretagem urgente prevista para sexta-feira às 14h."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:opacity-90"
              style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
            >
              <Radio className="w-4 h-4" />
              <span>Publicar no Mural Global</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ===============================================================================
// SUBCOMPONENTE 2: MODAL DE ATENDIMENTO FRACIONADO (REGRA 2 + REGRA 4)
// Obra fornecedora informa quanto pode enviar. Mostra barra e abatimento automático!
// ===============================================================================
interface FractionalContributeModalProps {
  isOpen: boolean;
  request: TransferRequest;
  onClose: () => void;
  onSuccess: () => void;
}

const FractionalContributeModal: React.FC<FractionalContributeModalProps> = ({
  isOpen,
  request,
  onClose,
  onSuccess,
}) => {
  const { works, currentWork, contributeToTransferRequest, materialDebts, showToast } = useApp();

  const fulfilled = request.fulfilledQuantity || 0;
  const remainingNeeded = Math.max(0, request.requestedQuantity - fulfilled);

  // Obra fornecedora (quem vai enviar a fração)
  const [supplyingWorkId, setSupplyingWorkId] = useState<string>(() => {
    // Escolhe uma obra diferente da solicitante
    const other = works.find((w) => w.id !== request.originWorkId);
    return other ? other.id : (works[0]?.id || '');
  });

  const supplyingWork = works.find((w) => w.id === supplyingWorkId) || currentWork;

  const [supplyingAddress, setSupplyingAddress] = useState<string>(() => {
    return supplyingWork?.address ? `${supplyingWork.address}, ${supplyingWork.city}/${supplyingWork.state}` : '';
  });

  const [warehouseManagerName, setWarehouseManagerName] = useState<string>('Marcos Vinícius (Almoxarife)');
  const [warehouseManagerPhone, setWarehouseManagerPhone] = useState<string>('(41) 98877-1122');
  const [quantity, setQuantity] = useState<number>(Math.min(remainingNeeded, 25));
  const [notes, setNotes] = useState<string>('');

  const handleSupplyingWorkChange = (id: string) => {
    setSupplyingWorkId(id);
    const sw = works.find((w) => w.id === id);
    if (sw?.address) {
      setSupplyingAddress(`${sw.address}, ${sw.city}/${sw.state}`);
    }
  };

  // -------------------------------------------------------------
  // SIMULAÇÃO EM TEMPO REAL DA CONTA-CORRENTE & ABATIMENTO (REGRA 4)
  // -------------------------------------------------------------
  const existingDebt = useMemo(() => {
    return materialDebts.find(
      (d) =>
        d.debtorWorkId === supplyingWorkId &&
        d.creditorWorkId === request.originWorkId &&
        d.materialName.toLowerCase().trim() === request.materialName.toLowerCase().trim() &&
        d.balance > 0
    );
  }, [materialDebts, supplyingWorkId, request.originWorkId, request.materialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplyingWorkId || supplyingWorkId === request.originWorkId) {
      showToast({
        type: 'warning',
        title: 'Obra Inválida',
        message: 'A obra fornecedora deve ser diferente da obra solicitante.',
      });
      return;
    }

    if (quantity <= 0) {
      showToast({
        type: 'warning',
        title: 'Quantidade Inválida',
        message: 'A quantidade a fornecer deve ser maior que zero.',
      });
      return;
    }

    if (!warehouseManagerName.trim()) {
      showToast({
        type: 'warning',
        title: 'Almoxarife Obrigatório',
        message: 'Informe o nome do almoxarife responsável pela liberação.',
      });
      return;
    }

    contributeToTransferRequest(request.id, {
      supplyingWorkId,
      supplyingWorkName: supplyingWork.name,
      supplyingWorkAddress: supplyingAddress.trim() || supplyingWork.address,
      warehouseManagerName: warehouseManagerName.trim(),
      warehouseManagerPhone: warehouseManagerPhone.trim() || undefined,
      quantity: Number(quantity),
      notes: notes.trim() || undefined,
    });

    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Contribuir com Atendimento Fracionado
              </h2>
              <p className="text-xs text-slate-400">
                Aprove o envio de uma fração para este pedido do mural global.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Card Resumo do Pedido Solicitado */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800/80">
              <span>Pedido Aberto no Mural</span>
              <span className="font-mono text-amber-300 font-bold">{request.requestedAt}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Obra Solicitante:</span>
                <strong className="text-white">{request.originWorkName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Insumo:</span>
                <strong className="text-amber-300">{request.materialName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Total Solicitado:</span>
                <strong className="text-white font-mono">{request.requestedQuantity} {request.unit}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Falta Atender:</span>
                <strong className="text-amber-400 font-mono text-xs">{remainingNeeded} {request.unit}</strong>
              </div>
            </div>
          </div>

          {/* Selecionar Obra Fornecedora */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Obra Fornecedora (Quem envia esta fração) *
            </label>
            <select
              value={supplyingWorkId}
              onChange={(e) => handleSupplyingWorkChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
            >
              {works
                .filter((w) => w.id !== request.originWorkId)
                .map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.city}/{w.state})
                  </option>
                ))}
            </select>
          </div>

          {/* Endereço de Coleta / Retirada */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Endereço de Coleta (Onde o caminhão vai retirar) *
            </label>
            <input
              type="text"
              required
              value={supplyingAddress}
              onChange={(e) => setSupplyingAddress(e.target.value)}
              placeholder="Ex: Av. das Araucárias, 850 — Batel, Curitiba/PR"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Almoxarife e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Nome do Almoxarife *
              </label>
              <input
                type="text"
                required
                value={warehouseManagerName}
                onChange={(e) => setWarehouseManagerName(e.target.value)}
                placeholder="Ex: Marcos Vinícius (Almoxarife)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Telefone para Rota WhatsApp
              </label>
              <input
                type="text"
                value={warehouseManagerPhone}
                onChange={(e) => setWarehouseManagerPhone(e.target.value)}
                placeholder="Ex: (41) 98877-1122"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* QUANTIDADE A ENVIAR */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                Quantidade a Enviar / Liberar *
              </label>
              <span className="text-xs font-mono text-amber-400 font-semibold">
                Máx necessário: {remainingNeeded} {request.unit}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 5))}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                -5
              </button>
              <input
                type="number"
                min={1}
                max={remainingNeeded}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(remainingNeeded, parseFloat(e.target.value) || 1)))}
                className="w-full text-center py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(remainingNeeded, prev + 5))}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                +5
              </button>
            </div>
          </div>

          {/* =============================================================
              SIMULADOR DE CONTA-CORRENTE EM TEMPO REAL (REGRA 4)
              ============================================================= */}
          {existingDebt ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Encontro de Contas Automático Detectado!</span>
              </div>
              <p className="text-emerald-200/90 leading-relaxed text-[11px]">
                A obra fornecedora <strong>{supplyingWork.name}</strong> já possui uma dívida prévia de 
                <strong> {existingDebt.balance} {request.unit}</strong> deste insumo para a obra solicitante ({request.originWorkName}).
              </p>
              <p className="text-emerald-100 font-mono text-[11px] pt-1 border-t border-emerald-500/20">
                ✨ Este envio de <strong>{quantity} {request.unit}</strong> será 
                <strong> deduzido automaticamente</strong>, reduzindo sua dívida para{' '}
                <strong className="text-emerald-400">
                  {Math.max(0, existingDebt.balance - quantity)} {request.unit}
                </strong>!
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                Como não há dívida prévia desta obra com o solicitante, este fornecimento gerará 
                um <strong>saldo devedor de {quantity} {request.unit}</strong> da obra {request.originWorkName} perante sua obra.
              </p>
            </div>
          )}

          {/* Instruções de Carga */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Instruções de Carga / Pátio (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Carga paletizada na doca 2, conferir com Marcos."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aprovar Envio da Fração</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ===============================================================================
// SUBCOMPONENTE 3: MODAL DE ROTEIRIZAÇÃO VIA WHATSAPP (REGRA 3)
// ===============================================================================
interface RouteWhatsAppModalProps {
  isOpen: boolean;
  request: TransferRequest;
  message: string;
  onClose: () => void;
}

const RouteWhatsAppModal: React.FC<RouteWhatsAppModalProps> = ({
  isOpen,
  request,
  message,
  onClose,
}) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    showToast({
      type: 'success',
      title: 'Rota Copiada para a Área de Transferência',
      message: 'O texto formatado foi copiado. Basta colar no WhatsApp.',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
    showToast({
      type: 'success',
      title: 'WhatsApp Aberto',
      message: 'A guia de rota de coleta foi enviada para o aplicativo.',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Rota de Coleta Logística</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Pronto p/ WhatsApp
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Roteirização compilada para despacho e conferência dos pontos de coleta.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mensagem formatada com markdown oficial:</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto select-all">
            {message}
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Ao clicar no botão abaixo, o WhatsApp Web ou aplicativo móvel será aberto com todos 
              os dados preenchidos para envio imediato ao motorista da transportadora ou freteiro.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Copiar Mensagem</span>
          </button>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Enviar Rota pelo WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

// ===============================================================================
// SUBCOMPONENTE 4: MODAL DE LIQUIDAÇÃO DIRETA DE SALDO DEVEDOR
// ===============================================================================
interface SettleDebtModalProps {
  isOpen: boolean;
  debt: MaterialDebtBalance;
  onClose: () => void;
  onSuccess: () => void;
}

const SettleDebtModal: React.FC<SettleDebtModalProps> = ({
  isOpen,
  debt,
  onClose,
  onSuccess,
}) => {
  const { settleDebtBalance, showToast } = useApp();
  const [quantity, setQuantity] = useState<number>(debt.balance);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      showToast({ type: 'warning', title: 'Quantidade Inválida', message: 'A quantidade deve ser maior que zero.' });
      return;
    }

    settleDebtBalance(debt.id, quantity, notes.trim() || undefined);
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Liquidar / Devolver Saldo Devedor
              </h2>
              <p className="text-xs text-slate-400">
                Registrar amortização direta de saldo entre canteiros.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Obra Devedora:</span>
              <strong className="text-white">{debt.debtorWorkName}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Obra Credora:</span>
              <strong className="text-emerald-300">{debt.creditorWorkName}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Insumo em Aberto:</span>
              <strong className="text-amber-300">{debt.materialName}</strong>
            </div>
            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
              <span>Saldo Devedor Atual:</span>
              <strong className="font-mono text-white">{debt.balance} {debt.unit}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Quantidade a Liquidar / Abater ({debt.unit}) *
            </label>
            <input
              type="number"
              min={1}
              max={debt.balance}
              required
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(debt.balance, parseFloat(e.target.value) || 1)))}
              className="w-full text-center py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Justificativa / Motivo da Liquidação
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Devolução física realizada em caminhão próprio da obra."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Liquidação</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TransfersView;
