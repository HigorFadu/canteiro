import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Boxes, 
  Wrench, 
  Shield, 
  Users, 
  TrendingUp, 
  Building2, 
  Layers, 
  X, 
  Building,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MaterialCategory, MaterialUnit, ToolCondition, EpiCategory, WorkType } from '../../types';

interface EntityAdminModalProps {
  entityType: 'material' | 'tool' | 'epi' | 'employee' | 'service' | 'area' | 'floor' | 'work' | 'outsourced';
  isOpen: boolean;
  onClose: () => void;
  editItem?: any;
}

export const EntityAdminModals: React.FC<EntityAdminModalProps> = ({
  entityType,
  isOpen,
  onClose,
  editItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      {entityType === 'material' && <MaterialModal onClose={onClose} editItem={editItem} />}
      {entityType === 'tool' && <ToolModal onClose={onClose} editItem={editItem} />}
      {entityType === 'epi' && <EpiModal onClose={onClose} editItem={editItem} />}
      {entityType === 'employee' && <EmployeeModal onClose={onClose} editItem={editItem} />}
      {entityType === 'service' && <ServiceModal onClose={onClose} editItem={editItem} />}
      {entityType === 'area' && <AreaModal onClose={onClose} editItem={editItem} />}
      {entityType === 'floor' && <FloorModal onClose={onClose} editItem={editItem} />}
      {entityType === 'work' && <WorkModal onClose={onClose} editItem={editItem} />}
      {entityType === 'outsourced' && <OutsourcedModal onClose={onClose} editItem={editItem} />}
    </div>
  );
};

// 1. MATERIAL MODAL
const MaterialModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createMaterial, editMaterial, currentWork, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');
  const [category, setCategory] = useState<MaterialCategory>(editItem?.category || 'Cimento');
  const [unit, setUnit] = useState<MaterialUnit>(editItem?.unit || 'Saco');
  const [code, setCode] = useState(editItem?.code || '');
  const [minStock, setMinStock] = useState<number>(editItem?.minStock || 50);
  const [location, setLocation] = useState(editItem?.location || '');
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [initialStock, setInitialStock] = useState<number>(editItem?.currentStock || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      requestConfirmation({
        title: 'Confirmar edição de material',
        message: `Deseja salvar as alterações cadastrais de "${name}"?`,
        confirmLabel: 'Salvar',
        cancelLabel: 'Cancelar',
        onConfirm: () => {
          editMaterial(editItem.id, { name, category, unit, code, minStock, location, notes });
          onClose();
        },
      });
    } else {
      requestConfirmation({
        title: 'Confirmar cadastro do material',
        message: `Confirmar cadastro de "${name}" com estoque mínimo de ${minStock} ${unit}?`,
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => {
          createMaterial({
            workId: currentWork.id,
            name,
            category,
            unit,
            code,
            minStock,
            currentStock: initialStock,
            location,
            notes,
          });
          onClose();
        },
      });
    }
  };

  const categories: MaterialCategory[] = [
    'Cimento', 'Argamassa', 'Areia', 'Brita', 'Aço', 'Madeira', 'Tubos',
    'Conexões', 'Elétrica', 'Hidráulica', 'Ferragens', 'Acabamento', 'Limpeza', 'Outros'
  ];

  const units: MaterialUnit[] = [
    'Unidade', 'Saco', 'Caixa', 'Metro', 'm²', 'm³', 'kg', 'Litro', 'Barra', 'Rolo', 'Par', 'Pacote', 'Outro'
  ];

  return (
    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold text-white">
            {editItem ? 'Editar material' : 'Adicionar material'}
          </h3>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Material *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Cimento Portland CP-II E-32"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Unidade de Medida *</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Código / Referência</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: CIM-002"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estoque Mínimo Operacional *</label>
            <input
              type="number"
              min="0"
              required
              value={minStock}
              onChange={(e) => setMinStock(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        {!editItem && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quantidade Inicial no Almoxarifado</label>
            <input
              type="number"
              min="0"
              value={initialStock}
              onChange={(e) => setInitialStock(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Localização na Obra</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Baia 03 — Depósito Coberto"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold hover:bg-slate-700 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm">
            {editItem ? 'Salvar' : 'Adicionar material'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 2. TOOL MODAL
const ToolModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createTool, editTool, currentWork, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');
  const [type, setType] = useState(editItem?.type || 'Furadeira');
  const [brand, setBrand] = useState(editItem?.brand || '');
  const [model, setModel] = useState(editItem?.model || '');
  const [code, setCode] = useState(editItem?.code || '');
  const [condition, setCondition] = useState<ToolCondition>(editItem?.condition || 'Nova');
  const [notes, setNotes] = useState(editItem?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      requestConfirmation({
        title: 'Confirmar Edição de Ferramenta',
        message: `Deseja salvar as alterações em "${name}"?`,
        onConfirm: () => {
          editTool(editItem.id, { name, type, brand, model, code, condition, notes });
          onClose();
        },
      });
    } else {
      requestConfirmation({
        title: 'Confirmar Cadastro de Ferramenta',
        message: `Confirmar inclusão de "${name}" (${code || 'S/N'}) no inventário?`,
        onConfirm: () => {
          createTool({
            workId: currentWork.id,
            name,
            type,
            brand,
            model,
            code,
            status: 'Disponível',
            condition,
            notes,
          });
          onClose();
        },
      });
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold text-white">{editItem ? 'Editar ferramenta' : 'Adicionar ferramenta'}</h3>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Equipamento / Ferramenta *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Martelete Rompedor 1500W"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo *</label>
            <input
              type="text"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ex: Furadeira, Serra, Martelete..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Condição Física *</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              <option value="Nova">Nova</option>
              <option value="Boa">Boa</option>
              <option value="Usada">Usada</option>
              <option value="Danificada">Danificada</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Marca</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Bosch, Makita..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="GSH 11 E"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Patrimônio / Código</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="PAT-MRT-02"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Observações</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Acessórios inclusos, especificações..."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold hover:bg-slate-700 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm">
            {editItem ? 'Salvar' : 'Adicionar ferramenta'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 3. EPI MODAL
const EpiModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createEpi, editEpi, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');
  const [category, setCategory] = useState<EpiCategory>(editItem?.category || 'Proteção da cabeça');
  const [manufacturer, setManufacturer] = useState(editItem?.manufacturer || '');
  const [caNumber, setCaNumber] = useState(editItem?.caNumber || '');
  const [stock, setStock] = useState<number>(editItem?.stock || 20);
  const [minStock, setMinStock] = useState<number>(editItem?.minStock || 10);
  const [unit, setUnit] = useState(editItem?.unit || 'Unidade');
  const [notes, setNotes] = useState(editItem?.notes || '');

  const categories: EpiCategory[] = [
    'Proteção da cabeça', 'Proteção dos olhos', 'Proteção facial', 'Proteção auditiva',
    'Proteção respiratória', 'Proteção das mãos', 'Proteção dos pés', 'Proteção contra quedas',
    'Vestimentas', 'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      requestConfirmation({
        title: 'Confirmar Edição de EPI',
        message: `Salvar alterações em "${name}"? Nota: entregas antigas manterão o C.A. histórico original intacto.`,
        onConfirm: () => {
          editEpi(editItem.id, { name, category, manufacturer, caNumber, stock, minStock, unit, notes });
          onClose();
        },
      });
    } else {
      requestConfirmation({
        title: 'Confirmar Cadastro de EPI',
        message: `Cadastrar "${name}" com C.A. ${caNumber} e fabricante ${manufacturer}?`,
        onConfirm: () => {
          createEpi({ name, category, manufacturer, caNumber, stock, minStock, unit, notes });
          onClose();
        },
      });
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold text-white">{editItem ? 'Editar EPI' : 'Adicionar EPI'}</h3>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do EPI *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Luva de Vaqueta Mista Cano Curto"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">C.A. (Certificado de Aprovação) *</label>
            <input
              type="text"
              required
              value={caNumber}
              onChange={(e) => setCaNumber(e.target.value)}
              placeholder="Ex: 15480"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Fabricante *</label>
            <input
              type="text"
              required
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="Volk, Marluvas, 3M..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estoque no Almoxarifado</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
            {editItem ? 'Salvar' : 'Adicionar EPI'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 4. EMPLOYEE MODAL
const EmployeeModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createEmployee, editEmployee, currentWork, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');
  const [functionName, setFunctionName] = useState(editItem?.functionName || 'Pedreiro');
  const [code, setCode] = useState(editItem?.code || '');
  const [phone, setPhone] = useState(editItem?.phone || '');
  const [notes, setNotes] = useState(editItem?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      requestConfirmation({
        title: 'Confirmar Edição de Funcionário',
        message: `Deseja salvar alterações na ficha de "${name}"?`,
        onConfirm: () => {
          editEmployee(editItem.id, { name, functionName, code, phone, notes });
          onClose();
        },
      });
    } else {
      requestConfirmation({
        title: 'Confirmar cadastro do funcionário',
        message: `Cadastrar colaborador "${name}" na função de ${functionName}?`,
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => {
          createEmployee({
            workId: currentWork.id,
            name,
            functionName,
            code,
            phone,
            status: 'Ativo',
            notes,
            admissionDate: new Date().toISOString().split('T')[0],
          });
          onClose();
        },
      });
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold text-white">{editItem ? 'Editar funcionário' : 'Adicionar funcionário'}</h3>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do trabalhador"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Função / Cargo na Obra *</label>
            <input
              type="text"
              required
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              placeholder="Ex: Pedreiro, Eletricista, Encanador..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Matrícula (Opcional)</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="MAT-1055"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone / Contato</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(21) 98765-4321"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Observações</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Especialidades, NR-10, NR-35..."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
            {editItem ? 'Salvar' : 'Adicionar funcionário'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 5. SERVICE MODAL
const ServiceModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createService, editService, currentWork, areas, employees, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');
  const [floorId, setFloorId] = useState(editItem?.floorId || currentWork.floors[0]?.id || '');
  const [area, setArea] = useState(editItem?.area || areas[0]?.name || 'Alvenaria');
  const [responsibleName, setResponsibleName] = useState(editItem?.responsibleName || 'Mestre de Obras');
  const [predictedEndDate, setPredictedEndDate] = useState(editItem?.predictedEndDate || '2026-10-30');
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(
    editItem?.assignedEmployees?.map((e: any) => e.id) || []
  );

  const selectedFloor = currentWork.floors.find((f) => f.id === floorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assigned = employees
      .filter((emp) => selectedEmployees.includes(emp.id))
      .map((emp) => ({ id: emp.id, name: emp.name, isOutsourced: false }));

    if (editItem) {
      requestConfirmation({
        title: 'Confirmar Edição de Serviço',
        message: `Salvar alterações na frente "${name}"?`,
        onConfirm: () => {
          editService(editItem.id, {
            name,
            floorId,
            floorName: selectedFloor?.name || 'Pavimento',
            area,
            responsibleName,
            predictedEndDate,
            notes,
            assignedEmployees: assigned,
          });
          onClose();
        },
      });
    } else {
      requestConfirmation({
        title: 'Confirmar cadastro do serviço',
        message: `Cadastrar serviço "${name}" no ${selectedFloor?.name}?`,
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => {
          createService({
            workId: currentWork.id,
            name,
            floorId,
            floorName: selectedFloor?.name || 'Pavimento',
            area,
            status: 'Não iniciado',
            responsibleName,
            startDate: new Date().toISOString().split('T')[0],
            predictedEndDate,
            notes,
            assignedEmployees: assigned,
          });
          onClose();
        },
      });
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold text-white">{editItem ? 'Editar serviço' : 'Adicionar serviço'}</h3>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Serviço *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Alvenaria de vedação dos aptos 501 e 502"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Andar / Pavimento *</label>
            <select
              value={floorId}
              onChange={(e) => setFloorId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {currentWork.floors.map((fl) => (
                <option key={fl.id} value={fl.id}>{fl.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Área da Obra *</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {areas.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Responsável pela Frente</label>
            <input
              type="text"
              value={responsibleName}
              onChange={(e) => setResponsibleName(e.target.value)}
              placeholder="Mestre, Encarregado..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Previsão de Término</label>
            <input
              type="date"
              value={predictedEndDate}
              onChange={(e) => setPredictedEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Alocar Funcionários:</label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            {employees.map((emp) => {
              const isChecked = selectedEmployees.includes(emp.id);
              return (
                <label key={emp.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedEmployees([...selectedEmployees, emp.id]);
                      else setSelectedEmployees(selectedEmployees.filter((id) => id !== emp.id));
                    }}
                    className="rounded border-slate-700 text-amber-500"
                  />
                  <span className="truncate">{emp.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
            {editItem ? 'Salvar' : 'Adicionar serviço'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 6. AREA MODAL (Section 29)
const AreaModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createArea, editArea, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      requestConfirmation({
        title: 'Confirmar Edição de Área',
        message: `Deseja renomear a área para "${name}"?`,
        onConfirm: () => {
          editArea(editItem.id, name);
          onClose();
        },
      });
    } else {
      createArea(name);
      onClose();
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white">{editItem ? 'Editar área' : 'Adicionar área'}</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Área *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Fundação, Impermeabilização..."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
            {editItem ? 'Salvar' : 'Adicionar área'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 7. FLOOR MODAL (Section 5)
const FloorModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createFloor, editFloor, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');
  const [level, setLevel] = useState<number>(editItem?.level || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      editFloor(editItem.id, name);
      onClose();
    } else {
      createFloor(name, level);
      onClose();
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white">{editItem ? 'Editar andar' : 'Adicionar andar'}</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Pavimento *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Cobertura, 15º Andar, Subsolo 3"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>
        {!editItem && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nível Numérico *</label>
            <input
              type="number"
              required
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        )}
        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
            {editItem ? 'Salvar' : 'Adicionar andar'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 8. OUTSOURCED MODAL (Section 32)
const OutsourcedModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createOutsourced, editOutsourced, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');
  const [cnpj, setCnpj] = useState(editItem?.cnpj || '');
  const [mainService, setMainService] = useState(editItem?.mainService || '');
  const [responsible, setResponsible] = useState(editItem?.responsible || '');
  const [phone, setPhone] = useState(editItem?.phone || '');
  const [notes, setNotes] = useState(editItem?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      editOutsourced(editItem.id, { name, cnpj, mainService, responsible, phone, notes });
      onClose();
    } else {
      createOutsourced({
        name,
        cnpj,
        mainService,
        responsible,
        phone,
        notes,
        employees: [],
      });
      onClose();
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold text-white">{editItem ? 'Editar terceirizada' : 'Adicionar terceirizada'}</h3>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Razão Social / Nome Fantasia *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da empresa terceirizada"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">CNPJ (Opcional)</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Serviço Principal *</label>
            <input
              type="text"
              required
              value={mainService}
              onChange={(e) => setMainService(e.target.value)}
              placeholder="Gesso, Pintura, Elétrica..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Responsável / Encarregado</label>
            <input
              type="text"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Nome do encarregado"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(21) 98765-4321"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            />
          </div>
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
            {editItem ? 'Salvar' : 'Adicionar terceirizada'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 9. WORK MODAL (Section 5)
const WorkModal: React.FC<{ onClose: () => void; editItem?: any }> = ({ onClose, editItem }) => {
  const { createWork, editWork, requestConfirmation } = useApp();
  const [name, setName] = useState(editItem?.name || '');
  const [code, setCode] = useState(editItem?.code || '');
  const [address, setAddress] = useState(editItem?.address || '');
  const [city, setCity] = useState(editItem?.city || '');
  const [state, setState] = useState(editItem?.state || 'RJ');
  const [type, setType] = useState<WorkType>(editItem?.type || 'Residencial');
  const [totalFloors, setTotalFloors] = useState<number>(editItem?.totalFloors || 10);
  const [hasGroundFloor, setHasGroundFloor] = useState<boolean>(editItem?.hasGroundFloor ?? true);
  const [hasBasements, setHasBasements] = useState<boolean>(editItem?.hasBasements ?? true);
  const [basementCount, setBasementCount] = useState<number>(editItem?.basementCount || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      requestConfirmation({
        title: 'Confirmar Edição de Obra',
        message: `Deseja salvar alterações na obra "${name}"?`,
        onConfirm: () => {
          editWork(editItem.id, { name, code, address, city, state, type });
          onClose();
        },
      });
    } else {
      requestConfirmation({
        title: 'Confirmar cadastro da obra',
        message: `Criar a obra "${name}"? O sistema gerará automaticamente ${
          totalFloors + (hasGroundFloor ? 1 : 0) + (hasBasements ? basementCount : 0)
        } pavimentos.`,
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        onConfirm: () => {
          createWork({
            name,
            code,
            address,
            city,
            state,
            type,
            totalFloors,
            hasGroundFloor,
            hasBasements,
            basementCount: hasBasements ? basementCount : 0,
          });
          onClose();
        },
      });
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[var(--btn-primary)]" style={{ color: 'var(--btn-primary)' }} />
          <h3 className="text-sm font-bold text-white">{editItem ? 'Editar obra' : 'Adicionar obra'}</h3>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Obra / Empreendimento *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Residencial Vista do Parque"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Código da Obra</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="OBR-2026-05"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Obra</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Reforma">Reforma</option>
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Endereço</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rua, número, bairro..."
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Rio de Janeiro"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estado</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="RJ"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            />
          </div>
        </div>

        {!editItem && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-amber-400 block uppercase">
              Geração automática de pavimentos
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Andares Tipos</label>
              <input
                type="number"
                min="1"
                max="100"
                value={totalFloors}
                onChange={(e) => setTotalFloors(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGroundFloor}
                  onChange={(e) => setHasGroundFloor(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500"
                />
                <span>Possui Térreo</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBasements}
                  onChange={(e) => setHasBasements(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500"
                />
                <span>Possui Subsolo</span>
              </label>
            </div>

            {hasBasements && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qtd. de Subsolos</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={basementCount}
                  onChange={(e) => setBasementCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            )}
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
            {editItem ? 'Salvar' : 'Adicionar obra'}
          </button>
        </div>
      </form>
    </div>
  );
};
