import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Boxes, 
  Search, 
  Plus, 
  Minus, 
  SlidersHorizontal, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  ArrowDownRight, 
  ArrowUpRight,
  Filter,
  Package,
  Layers,
  Edit2,
  Power,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { Material, MaterialCategory } from '../../types';
import { EntityAdminModals } from '../modals/EntityAdminModals';

export const MaterialsView: React.FC = () => {
  const { 
    materials, 
    materialMovements, 
    currentUser, 
    hasPermission, 
    openQuickAction,
    adjustMaterialStock,
    toggleMaterialActive,
    deleteMaterial,
    requestConfirmation,
    showToast,
    currentWork
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'critical' | 'low' | 'normal' | 'inactive'>('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  // Admin Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Adjustment modal state
  const [adjustingMaterial, setAdjustingMaterial] = useState<Material | null>(null);
  const [newStockInput, setNewStockInput] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('Divergência na contagem');
  const [adjustNotes, setAdjustNotes] = useState<string>('');

  const canAlterStock = hasPermission('materials.entry') || hasPermission('materials.exit');
  const canAdjustStock = hasPermission('materials.adjust');
  const canCreate = hasPermission('materials.create');
  const canEdit = hasPermission('materials.edit');
  const canDeactivate = hasPermission('materials.deactivate');

  // Filter materials
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (m.code && m.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (m.location && m.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;

    let matchesStock = true;
    if (filterStockStatus === 'critical') {
      matchesStock = m.currentStock <= m.minStock && m.isActive;
    } else if (filterStockStatus === 'low') {
      matchesStock = m.currentStock > m.minStock && m.currentStock <= m.minStock * 1.3 && m.isActive;
    } else if (filterStockStatus === 'normal') {
      matchesStock = m.currentStock > m.minStock * 1.3 && m.isActive;
    } else if (filterStockStatus === 'inactive') {
      matchesStock = !m.isActive;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories: MaterialCategory[] = [
    'Cimento', 'Argamassa', 'Areia', 'Brita', 'Aço', 'Madeira', 'Tubos', 
    'Conexões', 'Elétrica', 'Hidráulica', 'Ferragens', 'Acabamento', 'Limpeza', 'Outros'
  ];

  const handleOpenAdjust = (mat: Material) => {
    setAdjustingMaterial(mat);
    setNewStockInput(mat.currentStock.toString());
    setAdjustReason('Divergência na contagem');
    setAdjustNotes('');
  };

  const handleConfirmAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingMaterial) return;

    const newQty = parseFloat(newStockInput);
    if (isNaN(newQty) || newQty < 0) {
      alert('Informe uma quantidade válida igual ou maior que zero.');
      return;
    }

    requestConfirmation({
      title: 'Confirmar ajuste de estoque',
      message: `Alterar o saldo de "${adjustingMaterial.name}" de ${adjustingMaterial.currentStock} para ${newQty} ${adjustingMaterial.unit}?`,
      warningDetails: `Motivo: ${adjustReason}. Operação irreversível gravada na auditoria de ${currentUser.name}.`,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        adjustMaterialStock({
          materialId: adjustingMaterial.id,
          newQuantity: newQty,
          reason: adjustReason,
          notes: adjustNotes,
        });
        setAdjustingMaterial(null);
      },
    });
  };

  const handleToggleActiveWithConfirm = (mat: Material) => {
    if (mat.isActive) {
      requestConfirmation({
        title: `Inativar material "${mat.name}"?`,
        message: 'O material será ocultado das operações diárias. Todo o histórico de entradas e saídas continuará permanentemente preservado.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        isDestructive: true,
        onConfirm: () => toggleMaterialActive(mat.id),
      });
    } else {
      requestConfirmation({
        title: `Reativar material "${mat.name}"?`,
        message: 'O material voltará a ficar disponível para entradas e saídas no almoxarifado.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => toggleMaterialActive(mat.id),
      });
    }
  };

  const handleDeleteWithConfirm = (mat: Material) => {
    const hasHistory = materialMovements.some(m => m.materialId === mat.id);
    if (hasHistory) {
      showToast({
        type: 'warning',
        title: 'Registro com histórico',
        message: `O material "${mat.name}" possui movimentações registradas no canteiro. Utilize "Inativar" para preservar o histórico.`,
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
        deleteMaterial(mat.id);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Stock Rule Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Almoxarifado & Materiais</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Controle de estoque operacional, entradas, saídas e catálogo de materiais da obra.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Adicionar material */}
          {canCreate && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar material</span>
            </button>
          )}

          {canAlterStock ? (
            <>
              <button
                type="button"
                onClick={() => openQuickAction('entry')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Entrada</span>
              </button>
              <button
                type="button"
                onClick={() => openQuickAction('exit')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-all"
              >
                <Minus className="w-4 h-4" />
                <span>Saída</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Alteração restrita ao Almoxarife</span>
            </div>
          )}
        </div>
      </div>

      {/* Security Rule Pill Alert for Non-Almoxarife */}
      {!canAlterStock && (
        <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-200/90 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Aviso de acesso:</strong> Você está conectado como <strong>{currentUser.role}</strong>. Seu perfil possui permissão para consultar o estoque, mas a alteração física de saldos é de competência do Almoxarife.
            </span>
          </div>
        </div>
      )}

      {/* Tabs: Estoque Atual vs Histórico Completo */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'inventory'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Inventário de Materiais ({filteredMaterials.length})</span>
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
          <span>Histórico de Movimentações ({materialMovements.length})</span>
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, código (CIM-001) ou baia..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Level Quick Filter */}
            <div className="md:col-span-3">
              <select
                value={filterStockStatus}
                onChange={(e) => setFilterStockStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Todos os níveis de estoque</option>
                <option value="critical">Crítico (Saldo ≤ Mínimo)</option>
                <option value="low">Baixo (Próximo do Mínimo)</option>
                <option value="normal">Normal</option>
                <option value="inactive">Itens Inativados</option>
              </select>
            </div>
          </div>

          {/* Materials View: Desktop Table vs Mobile Stacked Cards (Sem Rolagem Lateral) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Desktop Table (md: e superior) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Material / Código</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Localização na Obra</th>
                    <th className="py-3 px-4 text-right">Mínimo</th>
                    <th className="py-3 px-4 text-right">Saldo Atual</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Nenhum material encontrado com os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filteredMaterials.map((mat) => {
                      const isCritical = mat.currentStock <= mat.minStock && mat.isActive;
                      const isLow = !isCritical && mat.currentStock <= mat.minStock * 1.3 && mat.isActive;

                      return (
                        <tr key={mat.id} className={`hover:bg-slate-800/40 transition-colors ${!mat.isActive ? 'opacity-50' : ''}`}>
                          <td className="py-3 px-4">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{mat.name}</span>
                              {!mat.isActive && (
                                <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">Inativo</span>
                              )}
                            </div>
                            {mat.code && (
                              <div className="text-[10px] text-slate-400 font-mono">{mat.code}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {mat.category}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {mat.location || 'Não especificado'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                            {mat.minStock} {mat.unit}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums">
                            <span className={`text-sm font-bold ${
                              !mat.isActive ? 'text-slate-500' : isCritical ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              {mat.currentStock}
                            </span>{' '}
                            <span className="text-[11px] text-slate-400">{mat.unit}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {!mat.isActive ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                Inativado
                              </span>
                            ) : isCritical ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                                Crítico
                              </span>
                            ) : isLow ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Baixo
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Regular
                              </span>
                            )}
                          </td>

                          {/* ACTION BUTTONS (Section 13: Entrada | Saída | Ajuste | Editar | Inativar) */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Ajuste (Rule 20) */}
                              {canAdjustStock && mat.isActive && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenAdjust(mat)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                                  title="Ajuste de inventário"
                                >
                                  Ajustar
                                </button>
                              )}

                              {/* Editar */}
                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={() => setEditingMaterial(mat)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[var(--btn-primary)] transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Inativar / Reativar */}
                              {canDeactivate && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleActiveWithConfirm(mat)}
                                  className={`p-1 rounded transition-colors ${
                                    mat.isActive
                                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[var(--btn-primary)]'
                                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                  }`}
                                  title={mat.isActive ? 'Inativar' : 'Reativar'}
                                >
                                  {mat.isActive ? <Power className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                                </button>
                              )}

                              {/* Excluir (apenas permitido quando sem histórico) */}
                              {canDeactivate && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteWithConfirm(mat)}
                                  className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (md:hidden - Fim da rolagem lateral) */}
            <div className="block md:hidden p-3 space-y-3">
              {filteredMaterials.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  Nenhum material encontrado com os filtros atuais.
                </div>
              ) : (
                filteredMaterials.map((mat) => {
                  const isCritical = mat.currentStock <= mat.minStock && mat.isActive;
                  const isLow = !isCritical && mat.currentStock <= mat.minStock * 1.3 && mat.isActive;

                  return (
                    <div
                      key={mat.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        !mat.isActive ? 'bg-slate-950/60 border-slate-800 opacity-60' : 'bg-slate-950/40 border-slate-800'
                      }`}
                    >
                      {/* Top Header: Nome, Código e Status */}
                      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-white text-sm leading-snug">
                            {mat.name}
                          </div>
                          {mat.code && (
                            <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                              Cód: {mat.code}
                            </span>
                          )}
                        </div>
                        <div className="shrink-0">
                          {!mat.isActive ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              Inativado
                            </span>
                          ) : isCritical ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                              Crítico
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Baixo
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Regular
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Details Grid */}
                      <div className="grid grid-cols-2 gap-2.5 py-3 text-xs">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Categoria
                          </span>
                          <span className="text-slate-200 font-medium truncate block mt-0.5">
                            {mat.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Localização
                          </span>
                          <span className="text-slate-300 truncate block mt-0.5">
                            {mat.location || 'Não especificado'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Estoque Mínimo
                          </span>
                          <span className="font-mono text-slate-400 block mt-0.5">
                            {mat.minStock} {mat.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Saldo Atual
                          </span>
                          <span className={`text-sm font-bold font-mono block mt-0.5 ${
                            !mat.isActive ? 'text-slate-500' : isCritical ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {mat.currentStock} <span className="text-[11px] font-normal text-slate-400">{mat.unit}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Actions: Botões de Ação diretos no card sem rolagem lateral */}
                      <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2">
                        {canAdjustStock && mat.isActive && (
                          <button
                            type="button"
                            onClick={() => handleOpenAdjust(mat)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                          >
                            Ajustar Saldo
                          </button>
                        )}
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => setEditingMaterial(mat)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[var(--btn-primary)] text-xs font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                        )}
                        {canDeactivate && (
                          <button
                            type="button"
                            onClick={() => handleToggleActiveWithConfirm(mat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                              mat.isActive
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[var(--btn-primary)]'
                                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            }`}
                          >
                            {mat.isActive ? <Power className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                            <span>{mat.isActive ? 'Inativar' : 'Reativar'}</span>
                          </button>
                        )}
                        {canDeactivate && (
                          <button
                            type="button"
                            onClick={() => handleDeleteWithConfirm(mat)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      ) : (
        /* HISTÓRICO DE MOVIMENTAÇÕES (Regra 18) */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Linha do Tempo das Movimentações</h3>
              <p className="text-xs text-slate-400">Rastreabilidade completa de saldo anterior, movimentação e operador.</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {materialMovements.length} eventos registrados
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {materialMovements.map((mov) => {
              const isEntry = mov.type === 'entry';
              const isExit = mov.type === 'exit';

              return (
                <div key={mov.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isEntry ? 'bg-emerald-500/20 text-emerald-300' : isExit ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {isEntry ? <ArrowDownRight className="w-4 h-4" /> : isExit ? <ArrowUpRight className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="font-bold text-white text-xs">
                        {mov.materialName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-300">
                          {isEntry ? 'Entrada' : isExit ? 'Saída' : 'Ajuste de Inventário'}
                        </span>
                        <span>·</span>
                        <span>Operador: {mov.userName}</span>
                        {mov.destination === 'Funcionário' && mov.employeeName && (
                          <>
                            <span>·</span>
                            <span className="text-amber-300 font-medium">Retirado por: {mov.employeeName}</span>
                          </>
                        )}
                        {mov.origin && (
                          <>
                            <span>·</span>
                            <span>Origem: {mov.origin}</span>
                          </>
                        )}
                        {mov.documentRef && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-slate-400">{mov.documentRef}</span>
                          </>
                        )}
                      </div>
                      {mov.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          "{mov.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right sm:self-center shrink-0 pl-11 sm:pl-0">
                    <div className={`text-xs font-mono font-bold tabular-nums ${
                      isEntry ? 'text-emerald-400' : isExit ? 'text-amber-400' : 'text-purple-400'
                    }`}>
                      {isEntry ? '+' : isExit ? '-' : 'Δ '}{mov.quantity} {mov.unit}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Saldo: {mov.previousStock} → {mov.resultStock} {mov.unit}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {mov.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADJUSTMENT MODAL WITH SAFETY CONFIRMATION (Section 17 & 41) */}
      {adjustingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                <h3 className="text-sm font-bold text-white">Ajuste Operacional de Estoque</h3>
              </div>
              <button
                type="button"
                onClick={() => setAdjustingMaterial(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
              <div className="text-slate-400">Material selecionado:</div>
              <div className="text-sm font-bold text-white">{adjustingMaterial.name}</div>
              <div className="text-slate-400 flex items-center gap-2">
                <span>Estoque Atual:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {adjustingMaterial.currentStock} {adjustingMaterial.unit}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nova Quantidade Contada / Real
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={newStockInput}
                  onChange={(e) => setNewStockInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                {newStockInput !== '' && !isNaN(parseFloat(newStockInput)) && (
                  <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Diferença apurada:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {parseFloat(newStockInput) - adjustingMaterial.currentStock >= 0 ? '+' : ''}
                      {(parseFloat(newStockInput) - adjustingMaterial.currentStock).toFixed(2)} {adjustingMaterial.unit}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Motivo do ajuste *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Divergência na contagem">Divergência na contagem</option>
                  <option value="Perda">Perda</option>
                  <option value="Avaria">Avaria</option>
                  <option value="Material encontrado">Material encontrado</option>
                  <option value="Erro de lançamento">Erro de lançamento</option>
                  <option value="Inventário">Inventário</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Observações / Justificativa
                </label>
                <textarea
                  rows={2}
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="Explicação do ajuste para auditoria..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                <p className="font-bold flex items-center gap-1 mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Registro de auditoria
                </p>
                <p>
                  A alteração será gravada com operador, data/hora e justificativa no histórico da obra.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingMaterial(null)}
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
        entityType="material"
        isOpen={isCreateModalOpen || editingMaterial !== null}
        editItem={editingMaterial}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingMaterial(null);
        }}
      />
    </div>
  );
};
