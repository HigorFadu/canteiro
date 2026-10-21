import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  Search, 
  UserCheck, 
  RotateCcw, 
  AlertTriangle, 
  History, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ShieldAlert,
  ArrowRightLeft,
  Edit2,
  Power,
  Trash2
} from 'lucide-react';
import { Tool, ToolStatus, ToolCondition } from '../../types';
import { EntityAdminModals } from '../modals/EntityAdminModals';

export const ToolsView: React.FC = () => {
  const { 
    tools, 
    employees, 
    hasPermission, 
    openQuickAction, 
    deliverTool, 
    returnTool,
    toggleToolActive,
    deleteTool,
    requestConfirmation,
    showToast,
    currentWork
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Admin modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  // Return Modal State
  const [returningTool, setReturningTool] = useState<Tool | null>(null);
  const [returnCondition, setReturnCondition] = useState<ToolCondition>('Boa');
  const [returnNotes, setReturnNotes] = useState('');

  // Delivery Modal State
  const [deliveringTool, setDeliveringTool] = useState<Tool | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const canCreate = hasPermission('tools.create');
  const canEdit = hasPermission('tools.edit');
  const canDeliver = hasPermission('tools.deliver');
  const canReturn = hasPermission('tools.return');
  const canDeactivate = hasPermission('tools.deactivate') || hasPermission('tools.writeoff');

  const filteredTools = tools.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.code && t.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (t.brand && t.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (t.currentEmployeeName && t.currentEmployeeName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter === 'inactive') {
      matchesStatus = !t.isActive;
    } else if (statusFilter !== 'all') {
      matchesStatus = t.status === statusFilter && t.isActive;
    } else {
      matchesStatus = t.isActive;
    }

    return matchesSearch && matchesStatus;
  });

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returningTool) return;

    requestConfirmation({
      title: 'Confirmar devolução de ferramenta',
      message: `Registrar devolução de "${returningTool.name}" ao almoxarifado em condição "${returnCondition}"?`,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        returnTool({
          toolId: returningTool.id,
          condition: returnCondition,
          notes: returnNotes,
        });
        setReturningTool(null);
      },
    });
  };

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringTool || !selectedEmployeeId) {
      alert('Selecione obrigatoriamente um funcionário.');
      return;
    }

    const emp = employees.find(e => e.id === selectedEmployeeId);
    if (!emp) return;

    requestConfirmation({
      title: 'Confirmar entrega de ferramenta (cautela)',
      message: `Atribuir responsabilidade de "${deliveringTool.name}" exclusivamente a ${emp.name}?`,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        deliverTool({
          toolId: deliveringTool.id,
          employeeId: emp.id,
          employeeName: emp.name,
          notes: deliveryNotes,
        });
        setDeliveringTool(null);
      },
    });
  };

  const handleToggleActiveWithConfirm = (tool: Tool) => {
    if (tool.isActive) {
      requestConfirmation({
        title: `Baixar / Inativar ferramenta "${tool.name}"?`,
        message: 'A ferramenta será baixada e não poderá mais ser entregue. Toda a linha do tempo anterior permanece preservada.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        isDestructive: true,
        onConfirm: () => toggleToolActive(tool.id),
      });
    } else {
      requestConfirmation({
        title: `Reativar ferramenta "${tool.name}"?`,
        message: 'A ferramenta voltará ao status disponível no almoxarifado.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => toggleToolActive(tool.id),
      });
    }
  };

  const handleDeleteWithConfirm = (tool: Tool) => {
    if (tool.status === 'Em uso' || tool.currentEmployeeId) {
      showToast({
        type: 'warning',
        title: 'Ferramenta em uso',
        message: `A ferramenta "${tool.name}" está atualmente em uso por um colaborador e não pode ser excluída.`,
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
        deleteTool(tool.id);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Controle de Ferramentas</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rastreabilidade de patrimônio, cautelas e linha do tempo de posse das ferramentas.
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
              <span>Adicionar ferramenta</span>
            </button>
          )}

          {canDeliver && (
            <button
              type="button"
              onClick={() => openQuickAction('tool')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <UserCheck className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
              <span>Entrega de ferramenta</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar ferramenta por nome, patrimônio (PAT-MRT-01), marca ou funcionário..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todas as ativas</option>
            <option value="Disponível">Disponível no Almoxarifado</option>
            <option value="Em uso">Em uso na Obra</option>
            <option value="Em manutenção">Em Manutenção</option>
            <option value="Extraviada">Extraviada</option>
            <option value="Baixada">Baixada</option>
            <option value="inactive">Itens Inativados</option>
          </select>
        </div>
      </div>

      {/* Tools Cards Grid (Section 13: Actions: Entregar | Devolver | Editar | Inativar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const isAvailable = tool.status === 'Disponível' && tool.isActive;
          const isInUse = tool.status === 'Em uso' && tool.isActive;
          const isInMaintenance = tool.status === 'Em manutenção' && tool.isActive;

          return (
            <div
              key={tool.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                !tool.isActive
                  ? 'bg-slate-950/60 border-slate-800 opacity-60'
                  : isInUse
                  ? 'bg-slate-900/90 border-amber-500/30'
                  : isInMaintenance
                  ? 'bg-slate-900/90 border-red-500/30'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div>
                {/* Status & Code */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    !tool.isActive
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : isAvailable
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : isInUse
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : isInMaintenance
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {!tool.isActive ? 'Baixada / Inativa' : tool.status}
                  </span>

                  {tool.code && (
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {tool.code}
                    </span>
                  )}
                </div>

                {/* Name & Details */}
                <h3 className="text-sm font-bold text-white leading-snug">
                  {tool.name}
                </h3>

                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{tool.brand || 'Marca não informada'}</span>
                  {tool.model && (
                    <>
                      <span>·</span>
                      <span>Mod. {tool.model}</span>
                    </>
                  )}
                  <span>·</span>
                  <span className="text-slate-300 font-medium">Condição: {tool.condition}</span>
                </div>

                {/* Current Holder / State */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  {isInUse ? (
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                        Em posse de:
                      </div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>{tool.currentEmployeeName}</span>
                      </div>
                    </div>
                  ) : isInMaintenance ? (
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                        Motivo da Manutenção:
                      </div>
                      <div className="text-[11px] text-slate-300 italic">
                        {tool.notes || 'Revisão técnica de rotina'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Almoxarifado (Pronta para entrega)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons (Section 13: Entregar | Devolver | Editar | Inativar) */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500">
                  {tool.updatedAt.split(' ')[0]}
                </span>

                <div className="flex items-center gap-1.5">
                  {isInUse && canReturn && (
                    <button
                      type="button"
                      onClick={() => {
                        setReturningTool(tool);
                        setReturnCondition(tool.condition);
                        setReturnNotes('');
                      }}
                      className="px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                      style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                      title="Devolver ao almoxarifado"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Devolver</span>
                    </button>
                  )}

                  {isAvailable && canDeliver && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveringTool(tool);
                        setSelectedEmployeeId(employees[0]?.id || '');
                        setDeliveryNotes('');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                      title="Entregar para funcionário"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Entregar</span>
                    </button>
                  )}

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => setEditingTool(tool)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[var(--btn-primary)] transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {canDeactivate && (
                    <button
                      type="button"
                      onClick={() => handleToggleActiveWithConfirm(tool)}
                      className={`p-1 rounded transition-colors ${
                        tool.isActive
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[var(--btn-primary)]'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                      title={tool.isActive ? 'Inativar' : 'Reativar'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Excluir (permitido somente quando não em uso) */}
                  {canDeactivate && (
                    <button
                      type="button"
                      onClick={() => handleDeleteWithConfirm(tool)}
                      className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RETURN MODAL */}
      {returningTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                <h3 className="text-sm font-bold text-white">Devolução de Ferramenta ao Almoxarifado</h3>
              </div>
              <button
                type="button"
                onClick={() => setReturningTool(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
              <div className="text-slate-400">Ferramenta:</div>
              <div className="text-sm font-bold text-white">{returningTool.name}</div>
              <div className="text-slate-400">
                Devolvida por: <strong className="text-amber-300">{returningTool.currentEmployeeName}</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estado físico na devolução
                </label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Nova">Nova</option>
                  <option value="Boa">Boa (Operacional normal)</option>
                  <option value="Usada">Usada (Com marcas de uso)</option>
                  <option value="Danificada">Danificada (Direcionar para manutenção)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Observações de devolução
                </label>
                <textarea
                  rows={2}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Ex: Limpa, cabo conferido, lâmina preservada..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturningTool(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT DELIVERY MODAL */}
      {deliveringTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                <h3 className="text-sm font-bold text-white">Entrega de Ferramenta (Cautela)</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeliveringTool(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
              <div className="text-slate-400">Ferramenta:</div>
              <div className="text-sm font-bold text-white">{deliveringTool.name}</div>
              <div className="text-slate-400">
                Patrimônio: <strong className="font-mono text-slate-300">{deliveringTool.code || 'S/N'}</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Funcionário responsável *
                </label>
                <select
                  required
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.functionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Observações / Local de uso
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Ex: Para cortes na laje do 5º pavimento..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/50 text-[11px] text-slate-400">
                Uma ferramenta nunca pode estar com duas pessoas simultaneamente.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeliveringTool(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE & EDIT MODALS */}
      <EntityAdminModals
        entityType="tool"
        isOpen={isCreateModalOpen || editingTool !== null}
        editItem={editingTool}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTool(null);
        }}
      />
    </div>
  );
};
