import React, { useState, useEffect, useId } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileWarning,
  Upload,
  FileText,
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  Plus,
  Eye,
  Info,
  X,
  FileCheck
} from 'lucide-react';
import { OccurrenceType } from '../../types';

interface OccurrenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmployeeId?: string;
}

export const OccurrenceFormModal: React.FC<OccurrenceFormModalProps> = ({
  isOpen,
  onClose,
  defaultEmployeeId
}) => {
  const {
    employees,
    addOccurrence,
    currentUser,
    currentWork,
    companyBranding,
    customAllowanceTypes,
    addCustomAllowanceType,
    showToast
  } = useApp();

  const activeCompanyId = currentWork.companyId || currentUser.companyId || 'comp-01';

  // Base Form State
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId || employees[0]?.id || '');
  const [occType, setOccType] = useState<OccurrenceType>('Atestado de Dias');
  const [occDate, setOccDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isAllowed, setIsAllowed] = useState(true);

  // Dynamic Case 1: 'Atestado de Dias' ou 'Suspensão'
  const [startDate, setStartDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [daysCount, setDaysCount] = useState<number>(1);
  const [returnDate, setReturnDate] = useState('');

  // Dynamic Case 2: 'Atestado de Horas'
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [calculatedHours, setCalculatedHours] = useState(4);

  // Dynamic Case 3: 'Advertência' / Warning Details
  const [warningDetails, setWarningDetails] = useState('');

  // Attachment State
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'pdf' | ''>('');
  const [attachmentSize, setAttachmentSize] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Validation Error Message
  const [formError, setFormError] = useState('');

  // Custom Allowance Creation Modal State
  const [isCreatingAllowance, setIsCreatingAllowance] = useState(false);
  const [newAllowanceName, setNewAllowanceName] = useState('');
  const [newAllowanceDesc, setNewAllowanceDesc] = useState('');

  // Reset or initialize when opened
  useEffect(() => {
    if (isOpen) {
      if (defaultEmployeeId) {
        setEmployeeId(defaultEmployeeId);
      } else if (employees.length > 0 && !employeeId) {
        setEmployeeId(employees[0].id);
      }
      setFormError('');
    }
  }, [isOpen, defaultEmployeeId, employees]);

  // Calculate return date automatically for 'Atestado de Dias' or 'Suspensão'
  useEffect(() => {
    if ((occType === 'Atestado de Dias' || occType === 'Atestado médico' || occType === 'Suspensão') && startDate && daysCount > 0) {
      const [y, m, d] = startDate.split('-').map(Number);
      const start = new Date(y, m - 1, d);
      start.setDate(start.getDate() + Number(daysCount));
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, '0');
      const dd = String(start.getDate()).padStart(2, '0');
      setReturnDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setReturnDate('');
    }
  }, [occType, startDate, daysCount]);

  // Calculate hours automatically for 'Atestado de Horas'
  useEffect(() => {
    if ((occType === 'Atestado de Horas' || occType === 'Atestado de horas') && startTime && endTime) {
      const [h1, m1] = startTime.split(':').map(Number);
      const [h2, m2] = endTime.split(':').map(Number);
      const diffMin = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (diffMin > 0) {
        setCalculatedHours(Number((diffMin / 60).toFixed(1)));
      } else {
        setCalculatedHours(0);
      }
    }
  }, [occType, startTime, endTime]);

  // Handle file attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachmentFile(file);
    setAttachmentName(file.name);

    // Format size
    const sizeInKb = Math.round(file.size / 1024);
    setAttachmentSize(sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`);

    if (file.type.startsWith('image/')) {
      setAttachmentType('image');
      const reader = new FileReader();
      reader.onload = () => {
        setAttachmentUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setAttachmentType('pdf');
      const reader = new FileReader();
      reader.onload = () => {
        setAttachmentUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentType('');
      setAttachmentUrl('');
    }
    setFormError('');
  };

  const handleRemoveAttachment = () => {
    setAttachmentFile(null);
    setAttachmentName('');
    setAttachmentUrl('');
    setAttachmentType('');
    setAttachmentSize('');
  };

  // Helper date formatter
  const formatDateBR = (iso: string) => {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return iso;
  };

  // Handle custom allowance submission
  const handleSaveCustomAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllowanceName.trim()) return;

    const created = addCustomAllowanceType(newAllowanceName, newAllowanceDesc);
    setOccType(created.name);
    setIsCreatingAllowance(false);
    setNewAllowanceName('');
    setNewAllowanceDesc('');
  };

  // Handle main form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
      setFormError('Selecione um funcionário válido.');
      return;
    }

    // Validation for 'Advertência': attachment is mandatory
    if (occType === 'Advertência' && !attachmentName) {
      setFormError('O comprovante assinado da Advertência é obrigatório para resguardo legal.');
      return;
    }

    // Validation for 'Atestado de Horas': end time must be after start time
    if ((occType === 'Atestado de Horas' || occType === 'Atestado de horas') && calculatedHours <= 0) {
      setFormError('A hora de término deve ser posterior à hora de início.');
      return;
    }

    // Construct occurrence payload
    const effectiveDate = (occType === 'Atestado de Dias' || occType === 'Atestado médico' || occType === 'Suspensão') 
      ? startDate 
      : occDate;

    const success = addOccurrence({
      employeeId: emp.id,
      employeeName: emp.name,
      type: occType,
      date: effectiveDate,
      startDate: (occType === 'Atestado de Dias' || occType === 'Atestado médico' || occType === 'Suspensão') ? startDate : undefined,
      daysCount: (occType === 'Atestado de Dias' || occType === 'Atestado médico' || occType === 'Suspensão') ? daysCount : undefined,
      returnDate: returnDate || undefined,
      startTime: (occType === 'Atestado de Horas' || occType === 'Atestado de horas') ? startTime : undefined,
      endTime: (occType === 'Atestado de Horas' || occType === 'Atestado de horas') ? endTime : undefined,
      hours: (occType === 'Atestado de Horas' || occType === 'Atestado de horas') ? calculatedHours : (occType === 'Atestado de Dias' || occType === 'Suspensão') ? daysCount * 8 : undefined,
      isAllowed: occType === 'Suspensão' || occType === 'Advertência' || occType === 'Falta injustificada' ? false : isAllowed,
      reason: occType === 'Advertência' ? (warningDetails ? `${reason} — ${warningDetails}` : reason) : reason,
      notes: notes.trim() || undefined,
      hasAttachment: Boolean(attachmentName),
      attachmentName: attachmentName || undefined,
      attachmentUrl: attachmentUrl || undefined,
      attachmentType: attachmentType || undefined,
      attachmentSize: attachmentSize || undefined,
    });

    if (success) {
      handleRemoveAttachment();
      setReason('');
      setNotes('');
      setWarningDetails('');
      onClose();
    }
  };

  if (!isOpen) return null;

  // Filter company custom allowances
  const companyAllowances = customAllowanceTypes.filter(
    (cat) => cat.companyId === activeCompanyId
  );

  const isDaysType = occType === 'Atestado de Dias' || occType === 'Atestado médico' || occType === 'Suspensão';
  const isHoursType = occType === 'Atestado de Horas' || occType === 'Atestado de horas';
  const isWarningType = occType === 'Advertência';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
        <div 
          className="w-full max-w-xl rounded-2xl border shadow-2xl p-4 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold"
                style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
              >
                <FileWarning className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--title-color)]">
                  Registrar Ocorrência de Funcionário
                </h3>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Obra: {currentWork.name} · Empresa: {companyBranding.tradeName || 'Sua Empresa'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--title-color)] hover:bg-[var(--btn-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Validation Alert */}
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Funcionário */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Funcionário Alocado na Obra *
              </label>
              <select
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--btn-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] focus:outline-none focus:border-[var(--accent-color)]"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.functionName}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Ocorrência & Seletor com Abonos Customizados */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                  Tipo de Ocorrência *
                </label>
                {currentUser.role === 'ADM do sistema' && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingAllowance(true)}
                    className="text-[11px] font-semibold text-[var(--accent-color)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Cadastrar novo tipo de abono</span>
                  </button>
                )}
              </div>

              <select
                value={occType}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '__NEW_ALLOWANCE__') {
                    setIsCreatingAllowance(true);
                  } else {
                    setOccType(val as any);
                    setFormError('');
                  }
                }}
                className="w-full px-3 py-2 rounded-lg bg-[var(--btn-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] font-medium focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
              >
                <optgroup label="Atestados & Afastamentos">
                  <option value="Atestado de Dias">Atestado de Dias (com data de retorno)</option>
                  <option value="Atestado de Horas">Atestado de Horas (horário início e fim)</option>
                  <option value="Suspensão">Suspensão Disciplinar (dias afastado)</option>
                </optgroup>

                <optgroup label="Disciplinares & Faltas">
                  <option value="Advertência">Advertência (exige comprovante assinado)</option>
                  <option value="Falta justificada">Falta justificada</option>
                  <option value="Falta injustificada">Falta injustificada</option>
                </optgroup>

                <optgroup label="Abonos Legais / Padrão">
                  <option value="Abono">Abono Geral</option>
                </optgroup>

                {companyAllowances.length > 0 && (
                  <optgroup label={`Abonos Exclusivos (${companyBranding.tradeName || 'Sua Empresa'})`}>
                    {companyAllowances.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </optgroup>
                )}

                <optgroup label="Ações Rápidas">
                  <option value="__NEW_ALLOWANCE__">
                    + Cadastrar novo tipo de abono da empresa
                  </option>
                </optgroup>
              </select>
            </div>

            {/* ============================================================== */}
            {/* CAMPOS DINÂMICOS 1: Atestado de Dias / Suspensão               */}
            {/* ============================================================== */}
            {isDaysType && (
              <div 
                className="p-3.5 rounded-xl border space-y-3 animate-in fade-in slide-in-from-top-1 duration-150"
                style={{ backgroundColor: 'var(--btn-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[var(--accent-color)] border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Período do Afastamento & Retorno Automático</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">
                    Cálculo Automático
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Data de Início do Afastamento *
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Quantidade de Dias de Afastamento *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={daysCount}
                      onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] font-mono font-bold focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* Banner de Cálculo Automático da Data de Retorno */}
                {returnDate && (
                  <div className="p-3 rounded-xl bg-black/30 border border-[var(--accent-color)]/30 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] block font-semibold">
                        Data Prevista de Retorno ao Trabalho
                      </span>
                      <strong className="text-sm font-extrabold text-[var(--accent-color)] block mt-0.5">
                        {formatDateBR(returnDate)}
                      </strong>
                    </div>
                    <div className="text-right text-[11px] text-[var(--text-secondary)]">
                      <span>Afastado de <strong>{formatDateBR(startDate)}</strong> a <strong>{daysCount} dia(s)</strong></span>
                      <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Calculado pelo sistema</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* CAMPOS DINÂMICOS 2: Atestado de Horas                          */}
            {/* ============================================================== */}
            {isHoursType && (
              <div 
                className="p-3.5 rounded-xl border space-y-3 animate-in fade-in slide-in-from-top-1 duration-150"
                style={{ backgroundColor: 'var(--btn-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[var(--accent-color)] border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Horário do Atestado e Retorno no Mesmo Dia</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">
                    Rastreio de Horas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Data do Atestado *
                    </label>
                    <input
                      type="date"
                      required
                      value={occDate}
                      onChange={(e) => setOccDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Hora de Início *
                    </label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Hora Fim / Retorno *
                    </label>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Banner de Cálculo de Horas */}
                <div className="p-3 rounded-xl bg-black/30 border border-[var(--accent-color)]/30 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] block font-semibold">
                      Total de Horas Abonadas
                    </span>
                    <strong className="text-sm font-extrabold text-[var(--accent-color)] block mt-0.5">
                      {calculatedHours > 0 ? `${calculatedHours} hora(s)` : 'Horário inválido'}
                    </strong>
                  </div>
                  <div className="text-right text-[11px] text-[var(--text-secondary)]">
                    <span>Retorno ao canteiro às: <strong className="text-[var(--title-color)]">{endTime}</strong></span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Lançamento de abono proporcional</p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Geral (para ocorrências normais que não sejam de dias/horas) */}
            {!isDaysType && !isHoursType && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Data da Ocorrência *
                </label>
                <input
                  type="date"
                  required
                  value={occDate}
                  onChange={(e) => setOccDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--btn-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] focus:outline-none"
                />
              </div>
            )}

            {/* Motivo Principal */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Motivo / Justificativa *
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  isWarningType 
                    ? 'Ex: Descumprimento reiterado de normas de segurança / Ausência de EPI'
                    : isHoursType
                    ? 'Ex: Consulta médica odontológica / Exame laboratorial'
                    : 'Ex: Atestado CID, motivo particular, liberação...'
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--btn-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] focus:outline-none focus:border-[var(--accent-color)]"
              />
            </div>

            {/* ============================================================== */}
            {/* CAMPOS DINÂMICOS 3: Advertência (Exigência de Motivo + Anexo) */}
            {/* ============================================================== */}
            {isWarningType && (
              <div 
                className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2.5 animate-in fade-in"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Procedimento Disciplinar — Advertência Formal</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Descrição Detalhada do Fato / Fundamentação Disciplinar *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={warningDetails}
                    onChange={(e) => setWarningDetails(e.target.value)}
                    placeholder="Descreva detalhadamente o ocorrido, data/hora da infração e orientação dada ao colaborador..."
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-amber-300">
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>Exigência Obrigatória:</strong> Anexe abaixo a via assinada da Advertência pelo colaborador ou testemunhas.
                  </span>
                </div>
              </div>
            )}

            {/* Observações Gerais */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Observações Complementares (Opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Entregue pelo encarregado, médico Dr. Silva CRM 1234..."
                className="w-full px-3 py-2 rounded-lg bg-[var(--btn-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* ============================================================== */}
            {/* REQUISITO: UPLOAD DE COMPROVANTE (FOTO OU PDF COM PRÉVIA)     */}
            {/* ============================================================== */}
            <div className="space-y-2 pt-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Comprovante / Atestado Digitalizado</span>
                  {isWarningType ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500 text-white">
                      Obrigatório
                    </span>
                  ) : (
                    <span className="text-[10px] text-[var(--text-secondary)] font-normal">
                      (Foto ou PDF)
                    </span>
                  )}
                </label>

                {attachmentName && (
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover comprovante</span>
                  </button>
                )}
              </div>

              {!attachmentName ? (
                /* Dropzone / Upload Input */
                <label 
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    isWarningType 
                      ? 'border-amber-500/50 hover:border-amber-400 bg-amber-500/5' 
                      : 'border-[var(--border-color)] hover:border-[var(--accent-color)] bg-[var(--btn-secondary)]/50'
                  }`}
                >
                  <Upload className="w-6 h-6 text-[var(--accent-color)] mb-1.5" />
                  <span className="text-xs font-bold text-[var(--title-color)] text-center">
                    Clique ou arraste para anexar foto ou PDF
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                    Aceita PNG, JPG, JPEG ou PDF (até 10 MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                /* Prévia e Detalhes do Arquivo Anexado */
                <div 
                  className="p-3 rounded-xl border flex items-center justify-between gap-3 animate-in fade-in"
                  style={{ backgroundColor: 'var(--btn-secondary)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Thumbnail or PDF Icon */}
                    {attachmentType === 'image' && attachmentUrl ? (
                      <div 
                        onClick={() => setPreviewOpen(true)}
                        className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 bg-black/40 shrink-0 cursor-pointer relative group"
                        title="Clique para ampliar"
                      >
                        <img 
                          src={attachmentUrl} 
                          alt="Prévia do comprovante" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[var(--title-color)] truncate">
                          {attachmentName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-black/20 text-[var(--accent-color)] shrink-0">
                          {attachmentType.toUpperCase() || 'ARQUIVO'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-secondary)] block mt-0.5">
                        {attachmentSize} · Pronto para envio
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {attachmentType === 'image' && (
                      <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="p-1.5 rounded-lg text-xs font-medium text-[var(--accent-color)] hover:bg-black/20 transition-colors"
                        title="Ver foto em tamanho real"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="p-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Excluir anexo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors border cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: 'var(--btn-secondary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer hover:opacity-90 flex items-center gap-1.5"
                style={{
                  backgroundColor: 'var(--btn-primary)',
                  color: 'var(--btn-primary-text)'
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Ocorrência</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-MODAL: Cadastrar Novo Tipo de Abono da Empresa             */}
      {/* ============================================================== */}
      {isCreatingAllowance && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h4 className="text-sm font-bold text-[var(--title-color)]">
                  Novo Tipo de Abono da Empresa
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  Exclusivo para o Tenant: <strong className="text-[var(--accent-color)]">{companyBranding.tradeName || 'Sua Construtora'}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingAllowance(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--title-color)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomAllowance} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Nome do Tipo de Abono *
                </label>
                <input
                  type="text"
                  required
                  value={newAllowanceName}
                  onChange={(e) => setNewAllowanceName(e.target.value)}
                  placeholder="Ex: Abono - Folga Aniversário, Abono - Curso Técnico..."
                  className="w-full px-3 py-2 rounded-lg bg-[var(--btn-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Critério / Descrição (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={newAllowanceDesc}
                  onChange={(e) => setNewAllowanceDesc(e.target.value)}
                  placeholder="Ex: Concedido 1 dia no mês de aniversário mediante aviso prévio..."
                  className="w-full px-3 py-2 rounded-lg bg-[var(--btn-secondary)] border border-[var(--border-color)] text-xs text-[var(--title-color)] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/20 border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] flex items-start gap-2">
                <Info className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
                <span>
                  Este tipo de abono ficará salvo permanentemente no catálogo da empresa <strong>{companyBranding.tradeName || 'sua empresa'}</strong> (isolamento por companyId).
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingAllowance(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border"
                  style={{
                    backgroundColor: 'var(--btn-secondary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm"
                  style={{
                    backgroundColor: 'var(--btn-primary)',
                    color: 'var(--btn-primary-text)'
                  }}
                >
                  Salvar Tipo de Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL DE PRÉVIA DA FOTO AMPLIADA                               */}
      {/* ============================================================== */}
      {previewOpen && attachmentUrl && (
        <div 
          onClick={() => setPreviewOpen(false)}
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="max-w-3xl max-h-[90vh] flex flex-col items-center">
            <img 
              src={attachmentUrl} 
              alt="Comprovante ampliado" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-slate-700" 
            />
            <span className="text-xs text-white/80 mt-2 font-mono">{attachmentName}</span>
          </div>
        </div>
      )}
    </>
  );
};
