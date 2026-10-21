import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Minus, 
  ShieldCheck, 
  Wrench, 
  FileWarning, 
  TrendingUp, 
  X, 
  AlertTriangle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { OccurrenceType } from '../../types';
import { OccurrenceFormModal } from '../occurrences/OccurrenceFormModal';

export const QuickActionModals: React.FC = () => {
  const { 
    activeQuickAction, 
    closeQuickAction, 
    materials, 
    tools, 
    epis, 
    employees, 
    services,
    addMaterialEntry, 
    addMaterialExit, 
    deliverEpi, 
    deliverTool, 
    addOccurrence, 
    updateServiceStatus,
    currentUser,
    currentWork
  } = useApp();

  if (!activeQuickAction) return null;

  if (activeQuickAction === 'occurrence') {
    return <OccurrenceFormModal isOpen={true} onClose={closeQuickAction} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      {activeQuickAction === 'entry' && <EntryModal />}
      {activeQuickAction === 'exit' && <ExitModal />}
      {activeQuickAction === 'epi' && <EpiModal />}
      {activeQuickAction === 'tool' && <ToolModal />}
      {activeQuickAction === 'service' && <ServiceModal />}
    </div>
  );
};

// 1. ENTRADA DE MATERIAL (Seção 15)
const EntryModal: React.FC = () => {
  const { materials, closeQuickAction, addMaterialEntry, currentWork, currentUser } = useApp();
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(10);
  const [origin, setOrigin] = useState<'Compra' | 'Transferência' | 'Outro'>('Compra');
  const [documentRef, setDocumentRef] = useState('');
  const [notes, setNotes] = useState('');

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId);
  const currentStock = selectedMaterial ? selectedMaterial.currentStock : 0;
  const resultStock = currentStock + (quantity || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || quantity <= 0) return;

    addMaterialEntry({
      materialId: selectedMaterial.id,
      quantity,
      origin,
      documentRef,
      notes,
    });
    closeQuickAction();
  };

  return (
    <div 
      className="w-full max-w-lg rounded-2xl border shadow-2xl p-5 space-y-4"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    >
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--title-color)' }}>Entrada de material</h3>
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Obra: {currentWork.name}</span>
          </div>
        </div>
        <button type="button" onClick={closeQuickAction} className="hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Material a Receber
          </label>
          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — Atual: {m.currentStock} {m.unit}
              </option>
            ))}
          </select>
        </div>

        {/* Calculation Pill (Section 15: Estoque 50 + 20 = 70) */}
        {selectedMaterial && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Estoque Atual</span>
              <strong className="font-mono text-sm text-slate-200">{currentStock} {selectedMaterial.unit}</strong>
            </div>
            <span className="text-amber-400 font-bold text-base">+</span>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Entrada</span>
              <strong className="font-mono text-sm text-emerald-400">+{quantity || 0} {selectedMaterial.unit}</strong>
            </div>
            <span className="text-amber-400 font-bold text-base">=</span>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Saldo Resultante</span>
              <strong className="font-mono text-sm text-amber-300">{resultStock} {selectedMaterial.unit}</strong>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Quantidade Recebida
            </label>
            <input
              type="number"
              min="0.01"
              step="any"
              required
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Origem da Carga
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Compra">Compra (Distribuidora / Usina)</option>
              <option value="Transferência">Transferência de Outra Obra</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Documento / Referência (Opcional)
          </label>
          <input
            type="text"
            value={documentRef}
            onChange={(e) => setDocumentRef(e.target.value)}
            placeholder="Ex: NF-e 88492, Ticket de balança..."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Observações
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Descarregado na baia 02 pelo caminhão basculante..."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Usuário: <strong>{currentUser.name}</strong></span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeQuickAction}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border"
              style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm"
              style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// 2. SAÍDA DE MATERIAL (Seção 16)
const ExitModal: React.FC = () => {
  const { materials, employees, closeQuickAction, addMaterialExit, currentWork, currentUser } = useApp();
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(5);
  const [destination, setDestination] = useState<'Uso geral' | 'Funcionário'>('Uso geral');
  const [employeeId, setEmployeeId] = useState('');
  const [notes, setNotes] = useState('');

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId);
  const currentStock = selectedMaterial ? selectedMaterial.currentStock : 0;
  const resultStock = currentStock - (quantity || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || quantity <= 0) return;

    const emp = employees.find(e => e.id === employeeId);

    addMaterialExit({
      materialId: selectedMaterial.id,
      quantity,
      destination,
      employeeId: destination === 'Funcionário' ? employeeId : undefined,
      employeeName: destination === 'Funcionário' ? emp?.name : undefined,
      notes,
    });
    closeQuickAction();
  };

  return (
    <div 
      className="w-full max-w-lg rounded-2xl border shadow-2xl p-5 space-y-4"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    >
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
            <Minus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--title-color)' }}>Saída de material</h3>
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Quem retirou (opcional)</span>
          </div>
        </div>
        <button type="button" onClick={closeQuickAction} className="hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Material
          </label>
          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — Disponível: {m.currentStock} {m.unit}
              </option>
            ))}
          </select>
        </div>

        {selectedMaterial && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Disponível</span>
              <strong className="font-mono text-sm text-slate-200">{currentStock} {selectedMaterial.unit}</strong>
            </div>
            <span className="text-amber-400 font-bold text-base">-</span>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Saída</span>
              <strong className="font-mono text-sm text-amber-400">-{quantity || 0} {selectedMaterial.unit}</strong>
            </div>
            <span className="text-amber-400 font-bold text-base">=</span>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Restante</span>
              <strong className={`font-mono text-sm ${resultStock < 0 ? 'text-red-400 font-bold' : 'text-slate-200'}`}>
                {resultStock} {selectedMaterial.unit}
              </strong>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Quantidade de Saída
            </label>
            <input
              type="number"
              min="0.01"
              step="any"
              required
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Destino
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Uso geral">Uso geral na Obra</option>
              <option value="Funcionário">Entregue a Funcionário específico</option>
            </select>
          </div>
        </div>

        {destination === 'Funcionário' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Funcionário que Retirou (Opcional se uso geral)
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Selecione o funcionário...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.functionName})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Observações / Pavimento de Destino
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Para concretagem dos pilares do 6º pavimento..."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {resultStock < 0 && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>A quantidade solicitada é maior que o saldo em estoque.</span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={closeQuickAction}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border"
            style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={resultStock < 0}
            className="px-4 py-2 rounded-xl font-bold text-xs disabled:opacity-50 transition-colors shadow-sm"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
};

// 3. EPI MODAL (Seção 23)
const EpiModal: React.FC = () => {
  const { epis, employees, closeQuickAction, deliverEpi } = useApp();
  const [selectedEpiId, setSelectedEpiId] = useState(epis[0]?.id || '');
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [type, setType] = useState<'Fornecimento' | 'Troca'>('Fornecimento');

  const selectedEpi = epis.find(e => e.id === selectedEpiId);
  const selectedEmp = employees.find(e => e.id === selectedEmpId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEpi || !selectedEmp) return;

    deliverEpi({
      employeeId: selectedEmp.id,
      employeeName: selectedEmp.name,
      epiId: selectedEpi.id,
      quantity: qty,
      movementType: type,
    });
    closeQuickAction();
  };

  return (
    <div 
      className="w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    >
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--title-color)' }}>Entrega de EPI</h3>
        </div>
        <button type="button" onClick={closeQuickAction} className="hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Funcionário Obrigatório</label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.functionName})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">EPI</label>
          <select
            value={selectedEpiId}
            onChange={(e) => setSelectedEpiId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          >
            {epis.map(e => (
              <option key={e.id} value={e.id}>{e.name} (C.A. {e.caNumber})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quantidade</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Movimento</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              <option value="Fornecimento">1 = Fornecimento</option>
              <option value="Troca">2 = Troca</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={closeQuickAction} className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border" style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm" style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}>Confirmar</button>
        </div>
      </form>
    </div>
  );
};

// 4. TOOL MODAL (Seção 20)
const ToolModal: React.FC = () => {
  const { tools, employees, closeQuickAction, deliverTool } = useApp();
  const availableTools = tools.filter(t => t.status === 'Disponível');
  const [toolId, setToolId] = useState(availableTools[0]?.id || '');
  const [empId, setEmpId] = useState(employees[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === empId);
    if (!emp || !toolId) return;

    deliverTool({
      toolId,
      employeeId: emp.id,
      employeeName: emp.name,
    });
    closeQuickAction();
  };

  return (
    <div 
      className="w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    >
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--title-color)' }}>Entrega de ferramenta</h3>
        </div>
        <button type="button" onClick={closeQuickAction} className="hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>✕</button>
      </div>

      {availableTools.length === 0 ? (
        <p className="text-xs text-slate-400 py-4">Todas as ferramentas estão em uso ou manutenção.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ferramenta Disponível</label>
            <select
              value={toolId}
              onChange={(e) => setToolId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {availableTools.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.code || 'S/N'})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Funcionário responsável *</label>
            <select
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.functionName})</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={closeQuickAction} className="px-3.5 py-2 rounded-xl text-xs text-slate-300 font-semibold hover:bg-slate-700 transition-colors border" style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm" style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}>Confirmar</button>
          </div>
        </form>
      )}
    </div>
  );
};

// 6. SERVICE STATUS MODAL
const ServiceModal: React.FC = () => {
  const { services, closeQuickAction, updateServiceStatus } = useApp();
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [status, setStatus] = useState<any>('Em andamento');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) return;

    updateServiceStatus(serviceId, status);
    closeQuickAction();
  };

  return (
    <div 
      className="w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    >
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--title-color)' }}>Atualizar Frente de Serviço</h3>
        </div>
        <button type="button" onClick={closeQuickAction} className="hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Serviço</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          >
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.floorName} — {s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Novo Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          >
            <option value="Em andamento">Em andamento</option>
            <option value="Concluído">Concluído</option>
            <option value="Paralisado">Paralisado</option>
            <option value="Não iniciado">Não iniciado</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={closeQuickAction} className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border" style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm" style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}>Confirmar</button>
        </div>
      </form>
    </div>
  );
};
