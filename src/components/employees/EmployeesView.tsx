import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Wrench, 
  TrendingUp, 
  FileWarning, 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  UserPlus,
  Phone,
  Briefcase,
  Plus,
  Edit2,
  Power,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { Employee } from '../../types';
import { EntityAdminModals } from '../modals/EntityAdminModals';

export const EmployeesView: React.FC = () => {
  const { 
    employees, 
    tools, 
    epiDeliveries, 
    services, 
    occurrences, 
    currentWork,
    hasPermission,
    toggleEmployeeActive,
    deleteEmployee,
    requestConfirmation,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(employees[0] || null);
  
  // Admin modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const canCreate = hasPermission('employees.create');
  const canEdit = hasPermission('employees.edit');
  const canDeactivate = hasPermission('employees.deactivate');

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.functionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.code && e.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Centralized data for selected employee
  const employeeTools = selectedEmployee ? tools.filter(t => t.currentEmployeeId === selectedEmployee.id) : [];
  const employeeEpis = selectedEmployee ? epiDeliveries.filter(e => e.employeeId === selectedEmployee.id) : [];
  const employeeServices = selectedEmployee ? services.filter(s => s.assignedEmployees.some(ae => ae.id === selectedEmployee.id)) : [];
  const employeeOccurrences = selectedEmployee ? occurrences.filter(o => o.employeeId === selectedEmployee.id) : [];

  const handleToggleActiveWithConfirm = (emp: Employee) => {
    const isCurrentlyActive = emp.status === 'Ativo';
    if (isCurrentlyActive) {
      requestConfirmation({
        title: `Inativar funcionário "${emp.name}"?`,
        message: 'O trabalhador não constará nas listas ativas de cautela de ferramentas e serviços. Todo o histórico permanecerá preservado.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        isDestructive: true,
        onConfirm: () => toggleEmployeeActive(emp.id),
      });
    } else {
      requestConfirmation({
        title: `Reativar funcionário "${emp.name}"?`,
        message: 'O trabalhador voltará ao status Ativo na obra.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => toggleEmployeeActive(emp.id),
      });
    }
  };

  const handleDeleteWithConfirm = (emp: Employee) => {
    const hasHistory = 
      epiDeliveries.some(d => d.employeeId === emp.id) || 
      occurrences.some(o => o.employeeId === emp.id) || 
      tools.some(t => t.currentEmployeeId === emp.id);

    if (hasHistory) {
      showToast({
        type: 'warning',
        title: 'Registro com histórico',
        message: `O colaborador "${emp.name}" possui histórico operacional registrado (EPIs, ferramentas ou ocorrências). Utilize "Inativar" para preservar as fichas legais.`,
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
        deleteEmployee(emp.id);
        if (selectedEmployee?.id === emp.id) {
          setSelectedEmployee(null);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Quadro de Funcionários</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ficha do trabalhador: EPIs recebidos, ferramentas sob custódia, ocorrências e alocação em serviços.
          </p>
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar funcionário</span>
          </button>
        )}
      </div>

      {/* Main Layout: List on Left, Centralized Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Employees List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar colaborador por nome, função ou matrícula..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredEmployees.map((emp) => {
              const isSelected = selectedEmployee?.id === emp.id;
              const hasToolsInUse = tools.some(t => t.currentEmployeeId === emp.id);

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs truncate">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                        <span className="text-slate-300 font-medium">{emp.functionName}</span>
                        {emp.code && (
                          <>
                            <span>·</span>
                            <span className="font-mono">{emp.code}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      emp.status === 'Ativo'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {emp.status}
                    </span>
                    {hasToolsInUse && (
                      <span className="text-[9px] text-amber-400 font-medium flex items-center gap-0.5">
                        <Wrench className="w-2.5 h-2.5" />
                        Com ferramenta
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Centralized Employee Dossier (Section 25 & Actions: Visualizar | Editar | Inativar) */}
        <div className="lg:col-span-7">
          {selectedEmployee ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              {/* Header Info & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl font-black text-lg flex items-center justify-center shadow-lg shadow-black/20"
                    style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                  >
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedEmployee.name}</h2>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-amber-400">{selectedEmployee.functionName}</span>
                      <span>·</span>
                      <span className="font-mono">{selectedEmployee.code || 'Sem matrícula'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions per Section 13: Visualizar | Editar | Inativar */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${
                    selectedEmployee.status === 'Ativo'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {selectedEmployee.status}
                  </span>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => setEditingEmployee(selectedEmployee)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}

                  {canDeactivate && (
                    <button
                      type="button"
                      onClick={() => handleToggleActiveWithConfirm(selectedEmployee)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        selectedEmployee.status === 'Ativo'
                          ? 'bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                      title={selectedEmployee.status === 'Ativo' ? 'Inativar' : 'Reativar'}
                    >
                      {selectedEmployee.status === 'Ativo' ? <Power className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Excluir (permitido somente se sem histórico) */}
                  {canDeactivate && (
                    <button
                      type="button"
                      onClick={() => handleDeleteWithConfirm(selectedEmployee)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* General Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Obra Atual</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{currentWork.name}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Admissão</span>
                  <div className="font-mono text-slate-200 mt-0.5">{selectedEmployee.admissionDate || 'Não informada'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Contato / Telefone</span>
                  <div className="font-mono text-slate-200 mt-0.5">{selectedEmployee.phone || 'Sem telefone'}</div>
                </div>
              </div>

              {/* 1. Ferramentas sob Custódia */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Ferramentas Atualmente em Posse ({employeeTools.length})</span>
                </div>
                {employeeTools.length > 0 ? (
                  <div className="space-y-1.5">
                    {employeeTools.map((tool) => (
                      <div key={tool.id} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{tool.name}</span>
                          <span className="text-[11px] text-slate-400 ml-2 font-mono">({tool.code})</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10">
                          Condição: {tool.condition}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 p-2 rounded bg-slate-950/40">Nenhuma ferramenta cautelada no momento.</p>
                )}
              </div>

              {/* 2. EPIs Entregues */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  <span>EPIs Fornecidos com C.A. Preservado ({employeeEpis.length})</span>
                </div>
                {employeeEpis.length > 0 ? (
                  <div className="space-y-1.5">
                    {employeeEpis.map((del) => (
                      <div key={del.id} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{del.quantity}x {del.epiName}</span>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            C.A. {del.caNumberSnapshot} · Fab: {del.manufacturerSnapshot} · Entregue em {del.timestamp.split(' ')[0]}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-blue-300 px-2 py-0.5 rounded bg-blue-500/10">
                          {del.movementType}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 p-2 rounded bg-slate-950/40">Nenhum EPI registrado no histórico recente.</p>
                )}
              </div>

              {/* 3. Frentes de Serviço Ativas */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Serviços / Andamento ({employeeServices.length})</span>
                </div>
                {employeeServices.length > 0 ? (
                  <div className="space-y-1.5">
                    {employeeServices.map((srv) => (
                      <div key={srv.id} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{srv.floorName} — {srv.name}</span>
                          <div className="text-[11px] text-slate-400 mt-0.5">Área: {srv.area}</div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                          {srv.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 p-2 rounded bg-slate-950/40">Não alocado em serviços no momento.</p>
                )}
              </div>

              {/* 4. Ocorrências / Atestados */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileWarning className="w-4 h-4 text-rose-400" />
                  <span>Ocorrências e Atestados ({employeeOccurrences.length})</span>
                </div>
                {employeeOccurrences.length > 0 ? (
                  <div className="space-y-1.5">
                    {employeeOccurrences.map((occ) => (
                      <div key={occ.id} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{occ.type}</span>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Data: {occ.date} · Motivo: {occ.reason}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-rose-300 px-2 py-0.5 rounded bg-rose-500/10">
                          {occ.hours ? `${occ.hours}h` : 'Registrado'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 p-2 rounded bg-slate-950/40">Nenhuma ocorrência registrada.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 rounded-2xl bg-slate-900 border border-slate-800">
              Selecione um funcionário na lista à esquerda.
            </div>
          )}
        </div>
      </div>

      {/* CREATE & EDIT MODALS */}
      <EntityAdminModals
        entityType="employee"
        isOpen={isCreateModalOpen || editingEmployee !== null}
        editItem={editingEmployee}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingEmployee(null);
        }}
      />
    </div>
  );
};
