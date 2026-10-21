import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  X, 
  Users, 
  Phone, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Briefcase, 
  UserCheck, 
  Calendar, 
  FileText,
  BadgeCheck,
  HardHat,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { OutsourcedCompany, OutsourcedEmployee, OutsourcedEmployeeStatus } from '../../types';

interface OutsourcedCompanyDetailDrawerProps {
  companyId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OutsourcedCompanyDetailDrawer: React.FC<OutsourcedCompanyDetailDrawerProps> = ({
  companyId,
  isOpen,
  onClose,
}) => {
  const { 
    outsourced, 
    currentWork, 
    addEmployeeToOutsourced, 
    editEmployeeInOutsourced, 
    removeEmployeeFromOutsourced,
    requestConfirmation,
    hasPermission 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OutsourcedEmployeeStatus>('ALL');
  
  // Add / Edit Employee modal states
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<OutsourcedEmployee | null>(null);

  // Form states for employee
  const [empName, setEmpName] = useState('');
  const [empFunction, setEmpFunction] = useState('');
  const [empStatus, setEmpStatus] = useState<OutsourcedEmployeeStatus>('Ativo na obra');
  const [empPhone, setEmpPhone] = useState('');
  const [empCpf, setEmpCpf] = useState('');
  const [empAdmissionDate, setEmpAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [empNotes, setEmpNotes] = useState('');

  if (!isOpen || !companyId) return null;

  const company = outsourced.find((c) => c.id === companyId);
  if (!company) return null;

  const employees = company.employees || [];

  const activeCount = employees.filter((e) => e.status === 'Ativo na obra').length;
  const awayCount = employees.filter((e) => e.status === 'Afastado').length;
  const closedCount = employees.filter((e) => e.status === 'Encerrado na obra').length;

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.functionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.cpf && e.cpf.includes(searchTerm));
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAddEmployeeModal = () => {
    setEditingEmployee(null);
    setEmpName('');
    setEmpFunction('');
    setEmpStatus('Ativo na obra');
    setEmpPhone('');
    setEmpCpf('');
    setEmpAdmissionDate(new Date().toISOString().split('T')[0]);
    setEmpNotes('');
    setIsEmployeeModalOpen(true);
  };

  const openEditEmployeeModal = (emp: OutsourcedEmployee) => {
    setEditingEmployee(emp);
    setEmpName(emp.name);
    setEmpFunction(emp.functionName);
    setEmpStatus(emp.status);
    setEmpPhone(emp.phone || '');
    setEmpCpf(emp.cpf || '');
    setEmpAdmissionDate(emp.admissionDate || new Date().toISOString().split('T')[0]);
    setEmpNotes(emp.notes || '');
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empFunction.trim()) return;

    if (editingEmployee) {
      editEmployeeInOutsourced(company.id, editingEmployee.id, {
        name: empName.trim(),
        functionName: empFunction.trim(),
        status: empStatus,
        phone: empPhone.trim() || undefined,
        cpf: empCpf.trim() || undefined,
        admissionDate: empAdmissionDate || undefined,
        notes: empNotes.trim() || undefined,
      });
    } else {
      addEmployeeToOutsourced(company.id, {
        name: empName.trim(),
        functionName: empFunction.trim(),
        status: empStatus,
        phone: empPhone.trim() || undefined,
        cpf: empCpf.trim() || undefined,
        admissionDate: empAdmissionDate || undefined,
        notes: empNotes.trim() || undefined,
      });
    }

    setIsEmployeeModalOpen(false);
  };

  const handleRemoveEmployee = (emp: OutsourcedEmployee) => {
    requestConfirmation({
      title: `Remover "${emp.name}"?`,
      message: `O colaborador será desvinculado da empresa terceirizada "${company.name}". Esta ação atualizará o total de efetivo alocado na obra.`,
      confirmLabel: 'Remover Colaborador',
      cancelLabel: 'Cancelar',
      isDestructive: true,
      onConfirm: () => {
        removeEmployeeFromOutsourced(company.id, emp.id);
      },
    });
  };

  const handleQuickStatusChange = (emp: OutsourcedEmployee, newStatus: OutsourcedEmployeeStatus) => {
    editEmployeeInOutsourced(company.id, emp.id, { status: newStatus });
  };

  const quickRoles = [
    'Eletricista',
    'Encanador',
    'Pedreiro',
    'Pintor',
    'Ajudante Geral',
    'Mestre de Obras',
    'Gesseiro',
    'Serralheiro',
    'Carpinteiro',
    'Soldador',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col z-10">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60">
            <div className="flex items-start gap-3">
              <div 
                className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner"
                style={{
                  backgroundColor: 'var(--btn-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--btn-primary)'
                }}
              >
                <Building className="w-6 h-6 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-tight">{company.name}</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    company.isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {company.isActive ? 'Ativa na Obra' : 'Inativa'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                  {company.cnpj && (
                    <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded text-[11px] text-slate-300">
                      CNPJ: {company.cnpj}
                    </span>
                  )}
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">Obra: <strong className="text-white">{currentWork.name}</strong></span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            
            {/* Company Info Box */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Serviço Principal / Especialidade:</span>
                  <span className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                    {company.mainService}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Responsável Técnico / Contato:</span>
                  <span className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-amber-400" />
                    {company.responsible}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Telefone / WhatsApp:</span>
                  <a 
                    href={`tel:${company.phone}`}
                    className="font-mono text-amber-400 mt-0.5 flex items-center gap-1.5 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {company.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ID do Cadastro:</span>
                  <span className="font-mono text-slate-400 mt-0.5 text-[11px] block truncate">
                    {company.id}
                  </span>
                </div>
              </div>

              {company.notes && (
                <div className="pt-2.5 border-t border-slate-800/60 text-xs text-slate-400">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-0.5">Observações contratuais:</span>
                  <p className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 text-slate-300 leading-relaxed">
                    {company.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Total</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{employees.length}</span>
                <span className="text-[9px] text-slate-500">colaboradores</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-center">
                <span className="text-[10px] text-emerald-400 block font-medium">Ativos</span>
                <span className="text-lg font-bold text-emerald-300 mt-0.5 block">{activeCount}</span>
                <span className="text-[9px] text-emerald-500/80">em campo</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-center">
                <span className="text-[10px] text-amber-400 block font-medium">Afastados</span>
                <span className="text-lg font-bold text-amber-300 mt-0.5 block">{awayCount}</span>
                <span className="text-[9px] text-amber-500/80">licença/outros</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Encerrados</span>
                <span className="text-lg font-bold text-slate-300 mt-0.5 block">{closedCount}</span>
                <span className="text-[9px] text-slate-500">desmobilizados</span>
              </div>
            </div>

            {/* Team Section Header & Action */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                    Equipe de Colaboradores Alocados
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trabalhadores vinculados automaticamente ao contrato desta terceirizada.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddEmployeeModal}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
                  style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Funcionário</span>
                </button>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar por nome, função ou CPF..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === 'ALL'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Todos ({employees.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Ativo na obra')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === 'Ativo na obra'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Ativos ({activeCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Afastado')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === 'Afastado'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Afastados ({awayCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('Encerrado na obra')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === 'Encerrado na obra'
                        ? 'bg-slate-700/50 text-slate-300 border border-slate-600'
                        : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Encerrados ({closedCount})
                  </button>
                </div>
              </div>

              {/* Workers List */}
              <div className="space-y-2.5">
                {filteredEmployees.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300">
                        {employees.length === 0 
                          ? 'Nenhum funcionário cadastrado nesta empresa' 
                          : 'Nenhum colaborador encontrado com os filtros aplicados'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        {employees.length === 0
                          ? 'Adicione os membros da equipe terceirizada para controlar o efetivo e a presença no canteiro de obras.'
                          : 'Tente alterar os termos de busca ou o filtro de status.'}
                      </p>
                    </div>
                    {employees.length === 0 && (
                      <button
                        type="button"
                        onClick={openAddEmployeeModal}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer mt-2"
                        style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Primeiro Funcionário</span>
                      </button>
                    )}
                  </div>
                ) : (
                  filteredEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{emp.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              emp.status === 'Ativo na obra'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : emp.status === 'Afastado'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              ● {emp.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                            <span className="text-amber-400 font-medium flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {emp.functionName}
                            </span>
                            {emp.cpf && (
                              <span className="font-mono text-slate-400">
                                CPF: {emp.cpf}
                              </span>
                            )}
                            {emp.phone && (
                              <span className="font-mono text-slate-400 flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" />
                                {emp.phone}
                              </span>
                            )}
                            {emp.admissionDate && (
                              <span className="text-slate-500 flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                Início: {emp.admissionDate}
                              </span>
                            )}
                          </div>

                          {emp.notes && (
                            <p className="text-[11px] text-slate-400 italic pt-0.5">
                              "{emp.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80 w-full sm:w-auto justify-end">
                        {/* Status Quick Switch */}
                        <select
                          value={emp.status}
                          onChange={(e) => handleQuickStatusChange(emp, e.target.value as OutsourcedEmployeeStatus)}
                          className="px-2 py-1 text-[11px] rounded-lg bg-slate-800 border border-slate-700 text-slate-300 focus:outline-none focus:border-[var(--btn-primary)] cursor-pointer"
                          title="Alterar status"
                        >
                          <option value="Ativo na obra">Ativo na obra</option>
                          <option value="Afastado">Afastado</option>
                          <option value="Encerrado na obra">Encerrado na obra</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => openEditEmployeeModal(emp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[var(--btn-primary)] transition-colors cursor-pointer"
                          title="Editar colaborador"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveEmployee(emp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Remover colaborador da equipe"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Contagem atual: <strong className="text-white">{employees.length} colaboradores</strong> vinculados a {company.name}.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
            >
              Concluído
            </button>
          </div>

        </div>
      </div>

      {/* Add / Edit Employee Modal Dialog */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 text-white">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-xl border flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--btn-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--btn-primary)'
                  }}
                >
                  <HardHat className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingEmployee ? 'Editar Funcionário da Terceirizada' : 'Adicionar Funcionário à Terceirizada'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Vinculação automática: <strong className="text-slate-200">{company.name}</strong></span>
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEmployeeModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Nome Completo do Trabalhador *
                </label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Função / Especialidade *
                </label>
                <input
                  type="text"
                  required
                  value={empFunction}
                  onChange={(e) => setEmpFunction(e.target.value)}
                  placeholder="Ex: Eletricista Montador, Encanador, Pedreiro..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                />
                
                {/* Quick Suggestion Chips */}
                <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-400">Sugestões rápidas:</span>
                  {quickRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setEmpFunction(role)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Status na Obra *
                  </label>
                  <select
                    value={empStatus}
                    onChange={(e) => setEmpStatus(e.target.value as OutsourcedEmployeeStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-[var(--btn-primary)] cursor-pointer"
                  >
                    <option value="Ativo na obra">Ativo na obra</option>
                    <option value="Afastado">Afastado</option>
                    <option value="Encerrado na obra">Encerrado na obra</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Data de Início / Admissão
                  </label>
                  <input
                    type="date"
                    value={empAdmissionDate}
                    onChange={(e) => setEmpAdmissionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-[var(--btn-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Telefone / WhatsApp (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[var(--btn-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    CPF ou Matrícula (Opcional)
                  </label>
                  <input
                    type="text"
                    value={empCpf}
                    onChange={(e) => setEmpCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[var(--btn-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Observações / Qualificações (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={empNotes}
                  onChange={(e) => setEmpNotes(e.target.value)}
                  placeholder="Ex: Treinamento NR-10 e NR-35 em dia; experiência em subestações."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
                />
              </div>

              {/* Informative banner */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  O colaborador será vinculado automaticamente à terceirizada <strong>{company.name}</strong> (ID: <code className="font-mono text-emerald-200">{company.id}</code>), atualizando o total de colaboradores exibido no card da obra.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer"
                  style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                >
                  {editingEmployee ? 'Salvar Alterações' : 'Adicionar e Vincular'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
