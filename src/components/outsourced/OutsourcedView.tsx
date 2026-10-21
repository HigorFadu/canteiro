import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  Search, 
  Users, 
  Phone, 
  FileText, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Edit2,
  Power,
  Trash2,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { OutsourcedCompany } from '../../types';
import { EntityAdminModals } from '../modals/EntityAdminModals';
import { OutsourcedCompanyDetailDrawer } from './OutsourcedCompanyDetailDrawer';

export const OutsourcedView: React.FC = () => {
  const { 
    outsourced, 
    currentWork, 
    hasPermission, 
    toggleOutsourcedActive, 
    deleteOutsourced, 
    requestConfirmation, 
    showToast 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<OutsourcedCompany | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const filtered = outsourced.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.mainService.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActiveWithConfirm = (company: OutsourcedCompany) => {
    if (company.isActive) {
      requestConfirmation({
        title: `Inativar terceirizada "${company.name}"?`,
        message: 'A empresa será inativada. Todo o histórico contratual e alocações anteriores permanecem preservados.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        isDestructive: true,
        onConfirm: () => toggleOutsourcedActive(company.id),
      });
    } else {
      requestConfirmation({
        title: `Reativar terceirizada "${company.name}"?`,
        message: 'A empresa voltará ao status ativo para novas frentes de trabalho no canteiro.',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => toggleOutsourcedActive(company.id),
      });
    }
  };

  const handleDeleteOutsourced = (company: OutsourcedCompany) => {
    if (company.employees && company.employees.length > 0) {
      showToast({
        type: 'warning',
        title: 'Terceirizada com colaboradores',
        message: `A terceirizada "${company.name}" possui colaboradores alocados na obra. Utilize "Inativar" para preservar os registros contratuais.`,
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
        deleteOutsourced(company.id);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Empresas Terceirizadas & Empreiteiros</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de contratos e alocação de equipes terceirizadas nas frentes de trabalho. Clique em qualquer empresa para gerenciar sua equipe.
          </p>
        </div>

        {hasPermission('outsourced.create') && (
          <button
            type="button"
            onClick={() => {
              setEditingCompany(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar terceirizada</span>
          </button>
        )}
      </div>

      {/* Info Pill */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[var(--btn-primary)] shrink-0" style={{ color: 'var(--btn-primary)' }} />
          <span>
            <strong>Gestão de Efetivo:</strong> Clique sobre qualquer card de empresa terceirizada para abrir sua visão detalhada e adicionar ou gerenciar os colaboradores da equipe.
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar terceirizada por razão social, serviço principal ou responsável..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--btn-primary)]"
        />
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((company) => (
          <div
            key={company.id}
            onClick={() => setSelectedCompanyId(company.id)}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 cursor-pointer group hover:border-slate-700 hover:shadow-xl ${
              company.isActive
                ? 'bg-slate-900 border-slate-800 hover:bg-slate-900/90'
                : 'bg-slate-900/60 border-slate-800/60 opacity-60 hover:opacity-80'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: 'var(--btn-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--btn-primary)'
                    }}
                  >
                    <Building className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[var(--btn-primary)] transition-colors">
                      {company.name}
                    </h3>
                    {company.cnpj && (
                      <span className="text-[11px] font-mono text-slate-400">{company.cnpj}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {company.employees ? company.employees.length : 0} colaboradores
                  </span>
                  <span className="p-1 rounded-lg text-slate-500 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs space-y-1">
                <div className="text-slate-300">
                  <strong className="text-slate-400">Serviço:</strong> {company.mainService}
                </div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Responsável: <strong className="text-slate-300">{company.responsible}</strong></span>
                  <span className="flex items-center gap-1 font-mono text-amber-400">
                    <Phone className="w-3 h-3" />
                    {company.phone}
                  </span>
                </div>
              </div>

              {/* Workers roster preview */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Efetivo Alocado na Obra:
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-[var(--btn-primary)] font-medium transition-colors">
                    Gerenciar equipe →
                  </span>
                </div>

                {(!company.employees || company.employees.length === 0) ? (
                  <div className="p-2.5 rounded-lg border border-dashed border-slate-800 text-center text-xs text-slate-500 group-hover:border-slate-700 transition-colors">
                    Nenhum colaborador adicionado ainda. Clique para cadastrar a equipe.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {company.employees.slice(0, 3).map((emp) => (
                      <div
                        key={emp.id}
                        className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="font-semibold text-white">{emp.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">{emp.functionName}</span>
                          <span className={`text-[10px] font-medium ${
                            emp.status === 'Ativo na obra'
                              ? 'text-emerald-400'
                              : emp.status === 'Afastado'
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}>
                            ● {emp.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {company.employees.length > 3 && (
                      <div className="text-center text-[11px] text-slate-400 pt-1 font-medium">
                        + {company.employees.length - 3} outros colaboradores alocados...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Ver Equipe | Editar | Inativar | Excluir */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  company.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  {company.isActive ? 'Ativa' : 'Inativa'}
                </span>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCompanyId(company.id);
                  }}
                  className="text-[11px] font-semibold text-[var(--btn-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                  style={{ color: 'var(--btn-primary)' }}
                >
                  <Users className="w-3.5 h-3.5" />
                  Ver equipe
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCompany(company);
                    setIsCreateModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[var(--btn-primary)] transition-colors cursor-pointer"
                  title="Editar dados da terceirizada"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleActiveWithConfirm(company);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    company.isActive
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[var(--btn-primary)]'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  }`}
                  title={company.isActive ? 'Inativar' : 'Reativar'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOutsourced(company);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Company Modal */}
      <EntityAdminModals
        entityType="outsourced"
        isOpen={isCreateModalOpen}
        editItem={editingCompany}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCompany(null);
        }}
      />

      {/* Detail Drawer with Team Management & Add Worker Form */}
      <OutsourcedCompanyDetailDrawer
        companyId={selectedCompanyId}
        isOpen={selectedCompanyId !== null}
        onClose={() => setSelectedCompanyId(null)}
      />
    </div>
  );
};
