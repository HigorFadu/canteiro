import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Search, 
  Plus, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  History, 
  Layers, 
  AlertTriangle,
  Edit2,
  Power,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { Epi, EpiCategory } from '../../types';
import { EntityAdminModals } from '../modals/EntityAdminModals';

export const EpisView: React.FC = () => {
  const { 
    epis, 
    epiDeliveries, 
    employees, 
    hasPermission, 
    openQuickAction, 
    deliverEpi,
    toggleEpiActive,
    deleteEpi,
    requestConfirmation,
    showToast,
    currentWork
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Admin modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEpi, setEditingEpi] = useState<Epi | null>(null);

  // Quick delivery modal
  const [isDelivering, setIsDelivering] = useState(false);
  const [selectedEpiId, setSelectedEpiId] = useState(epis[0]?.id || '');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [movementType, setMovementType] = useState<'Fornecimento' | 'Troca'>('Fornecimento');
  const [notes, setNotes] = useState('');

  const canCreate = hasPermission('epis.create');
  const canEdit = hasPermission('epis.edit');
  const canDeliver = hasPermission('epis.deliver');
  const canDeactivate = hasPermission('epis.deactivate');

  const filteredEpis = epis.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.caNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: EpiCategory[] = [
    'Proteção da cabeça',
    'Proteção dos olhos',
    'Proteção facial',
    'Proteção auditiva',
    'Proteção respiratória',
    'Proteção das mãos',
    'Proteção dos pés',
    'Proteção contra quedas',
    'Vestimentas',
    'Outros'
  ];

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(emp => emp.id === selectedEmployeeId);
    const epiObj = epis.find(e => e.id === selectedEpiId);
    if (!emp || !epiObj) return;

    requestConfirmation({
      title: 'Confirmar entrega de EPI',
      message: `Registrar ${movementType} de ${quantity}x "${epiObj.name}" para ${emp.name}?`,
      warningDetails: `C.A. ${epiObj.caNumber} e Fabricante ${epiObj.manufacturer} serão permanentemente vinculados à ficha do colaborador como cópia histórica legal.`,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        deliverEpi({
          employeeId: emp.id,
          employeeName: emp.name,
          epiId: selectedEpiId,
          quantity,
          movementType,
          notes,
        });
        setIsDelivering(false);
        setNotes('');
      },
    });
  };

  const handleToggleActiveWithConfirm = (epi: Epi) => {
    if (epi.isActive) {
      requestConfirmation({
        title: `Inativar EPI "${epi.name}"?`,
        message: 'O EPI será removido das opções ativas de fornecimento. Todas as fichas anteriores continuarão preservadas com C.A. registrado.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        isDestructive: true,
        onConfirm: () => toggleEpiActive(epi.id),
      });
    } else {
      requestConfirmation({
        title: `Reativar EPI "${epi.name}"?`,
        message: 'O EPI voltará a ficar disponível para entregas aos colaboradores.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => toggleEpiActive(epi.id),
      });
    }
  };

  const handleDeleteWithConfirm = (epi: Epi) => {
    const hasHistory = epiDeliveries.some(d => d.epiId === epi.id);
    if (hasHistory) {
      showToast({
        type: 'warning',
        title: 'Registro com histórico legal',
        message: `O EPI "${epi.name}" possui entregas registradas e vinculadas a fichas de colaboradores. Utilize a inativação para preservar o histórico legal do C.A.`,
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
        deleteEpi(epi.id);
      },
    });
  };

  const selectedEpiObject = epis.find(e => e.id === selectedEpiId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">EPIs — Equipamentos de Proteção Individual</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão com registro histórico permanente de C.A. e Fabricante por colaborador.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCreate && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar EPI</span>
            </button>
          )}

          {canDeliver && (
            <button
              type="button"
              onClick={() => setIsDelivering(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Entrega de EPI</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'catalog'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Catálogo de EPIs na Obra ({filteredEpis.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'history'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Fichas de Entrega / Histórico ({epiDeliveries.length})</span>
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar EPI por nome, C.A. (ex: 31469) ou fabricante..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* EPIs Catalog Grid (Section 13: Actions: Entregar | Editar | Inativar) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEpis.map((epi) => (
              <div
                key={epi.id}
                className={`p-4 rounded-2xl bg-slate-900 border flex flex-col justify-between transition-colors ${
                  !epi.isActive ? 'border-slate-800 opacity-60' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {epi.category}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      C.A. {epi.caNumber}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {epi.name}
                  </h3>

                  <div className="mt-2 text-xs text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">Fabricante:</span>
                    <span className="font-semibold text-slate-200">{epi.manufacturer}</span>
                  </div>

                  {epi.sizes && epi.sizes.length > 0 && (
                    <div className="mt-1 text-xs text-slate-400 flex items-center justify-between">
                      <span>Tamanhos:</span>
                      <span className="font-mono text-slate-300">{epi.sizes.join(', ')}</span>
                    </div>
                  )}

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estoque Almoxarifado:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {epi.stock} {epi.unit}s
                    </span>
                  </div>
                </div>

                {/* Actions Bar (Section 13: Entregar | Editar | Inativar) */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    epi.isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                  }`}>
                    {epi.isActive ? 'Ativo' : 'Inativo'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {canDeliver && epi.isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEpiId(epi.id);
                          setIsDelivering(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Entregar este EPI"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Entregar</span>
                      </button>
                    )}

                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => setEditingEpi(epi)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[var(--btn-primary)] transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {canDeactivate && (
                      <button
                        type="button"
                        onClick={() => handleToggleActiveWithConfirm(epi)}
                        className={`p-1 rounded transition-colors ${
                          epi.isActive
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[var(--btn-primary)]'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                        title={epi.isActive ? 'Inativar' : 'Reativar'}
                      >
                        {epi.isActive ? <Power className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {/* Excluir (permitido somente se não houver histórico) */}
                    {canDeactivate && (
                      <button
                        type="button"
                        onClick={() => handleDeleteWithConfirm(epi)}
                        className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* HISTÓRICO DE ENTREGAS POR FUNCIONÁRIO (Regra 24) */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Registro de Entrega e Ficha de EPI</h3>
              <p className="text-xs text-slate-400">
                Snapshots de C.A. e Fabricante preservados no ato da entrega para fins legais e periciais.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {epiDeliveries.length} entregas cadastradas
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {epiDeliveries.map((del) => (
              <div key={del.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    del.movementType === 'Fornecimento' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    <Shield className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="font-bold text-white text-xs">
                      {del.employeeName}
                    </div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">
                      {del.quantity}x {del.epiName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-slate-200">C.A. {del.caNumberSnapshot}</span>
                      <span>·</span>
                      <span>Fab: {del.manufacturerSnapshot}</span>
                      <span>·</span>
                      <span>{del.movementType}</span>
                      <span>·</span>
                      <span>Responsável: {del.userName}</span>
                    </div>
                    {del.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        "{del.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right sm:self-center shrink-0 pl-11 sm:pl-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    del.movementType === 'Fornecimento'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {del.movementType}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {del.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EPI DELIVERY MODAL (Section 24) */}
      {isDelivering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                <h3 className="text-sm font-bold text-white">Registro de Entrega de EPI</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDelivering(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Funcionário
                </label>
                <select
                  required
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.functionName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  EPI Obrigatório
                </label>
                <select
                  required
                  value={selectedEpiId}
                  onChange={(e) => setSelectedEpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {epis.filter(e => e.isActive).map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} (C.A. {e.caNumber})
                    </option>
                  ))}
                </select>
              </div>

              {selectedEpiObject && (
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fabricante copiado:</span>
                    <span className="font-semibold text-white">{selectedEpiObject.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">C.A. copiado:</span>
                    <span className="font-bold text-slate-200 font-mono">{selectedEpiObject.caNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estoque disponível:</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedEpiObject.stock} {selectedEpiObject.unit}s</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tipo de Movimento
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Fornecimento">1 = Fornecimento</option>
                    <option value="Troca">2 = Troca</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Observações
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Troca periódica, admissão..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDelivering(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold text-xs shadow-md cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                >
                  Confirmar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE & EDIT MODALS */}
      <EntityAdminModals
        entityType="epi"
        isOpen={isCreateModalOpen || editingEpi !== null}
        editItem={editingEpi}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingEpi(null);
        }}
      />
    </div>
  );
};
