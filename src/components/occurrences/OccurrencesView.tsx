import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileWarning, 
  Search, 
  Plus, 
  FileText, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Calendar,
  Eye,
  ShieldAlert,
  X,
  FileCheck,
  Building2,
  Users
} from 'lucide-react';
import { Occurrence } from '../../types';
import { OccurrenceFormModal } from './OccurrenceFormModal';

export const OccurrencesView: React.FC = () => {
  const { 
    occurrences, 
    employees, 
    hasPermission, 
    currentWork,
    companyBranding,
    currentUser,
    customAllowanceTypes
  } = useApp();

  const activeCompanyId = currentWork.companyId || currentUser.companyId || 'comp-01';

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewAttachmentOcc, setPreviewAttachmentOcc] = useState<Occurrence | null>(null);

  // Filter occurrences by company & search & type
  const companyOccurrences = occurrences.filter(
    (o) => !o.companyId || o.companyId === activeCompanyId
  );

  const filteredOccurrences = companyOccurrences.filter((o) => {
    const matchesSearch = 
      o.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.notes && o.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || o.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate metrics
  const totalDaysOff = companyOccurrences.reduce((acc, o) => acc + (o.daysCount || 0), 0);
  const totalHoursOff = companyOccurrences.reduce((acc, o) => acc + (o.hours || 0), 0);
  const totalWarnings = companyOccurrences.filter(o => o.type === 'Advertência' || o.type === 'Suspensão').length;
  const totalAttachments = companyOccurrences.filter(o => o.hasAttachment).length;

  // Custom company allowance types
  const companyAllowances = customAllowanceTypes.filter(
    (cat) => cat.companyId === activeCompanyId
  );

  const formatDateBR = (iso?: string) => {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return iso;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--title-color)]">
              Livro de Ocorrências & Atestados
            </h1>
            <span 
              className="text-xs px-2.5 py-0.5 rounded-lg border font-mono font-bold"
              style={{
                backgroundColor: 'var(--btn-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              {currentWork.name}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Gestão de atestados médicos de dias/horas, advertências com comprovação, suspensões e abonos exclusivos da empresa.
          </p>
        </div>

        {hasPermission('occurrences.create') && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer hover:opacity-95"
            style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar ocorrência</span>
          </button>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          className="p-3.5 rounded-xl border space-y-1"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
            Total de Ocorrências
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-[var(--title-color)]">
              {companyOccurrences.length}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">Na obra</span>
          </div>
        </div>

        <div 
          className="p-3.5 rounded-xl border space-y-1"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
            Dias de Afastamento
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-amber-400">
              {totalDaysOff} dias
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">Atestados/Suspensões</span>
          </div>
        </div>

        <div 
          className="p-3.5 rounded-xl border space-y-1"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
            Horas Abonadas
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-blue-400">
              {totalHoursOff.toFixed(1)}h
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">Atestados de horas</span>
          </div>
        </div>

        <div 
          className="p-3.5 rounded-xl border space-y-1"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
            Comprovantes Anexados
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-400">
              {totalAttachments}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">Documentados</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl border"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por colaborador, motivo ou observações..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-xs text-[var(--title-color)] placeholder-slate-500 focus:outline-none"
            style={{ backgroundColor: 'var(--btn-secondary)', borderColor: 'var(--border-color)' }}
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-xs text-[var(--title-color)] focus:outline-none cursor-pointer"
            style={{ backgroundColor: 'var(--btn-secondary)', borderColor: 'var(--border-color)' }}
          >
            <option value="all">Todos os tipos de ocorrência</option>
            <optgroup label="Atestados & Afastamentos">
              <option value="Atestado de Dias">Atestado de Dias</option>
              <option value="Atestado de Horas">Atestado de Horas</option>
              <option value="Atestado médico">Atestado médico</option>
              <option value="Suspensão">Suspensão</option>
            </optgroup>
            <optgroup label="Disciplinares">
              <option value="Advertência">Advertência</option>
              <option value="Falta justificada">Falta justificada</option>
              <option value="Falta injustificada">Falta injustificada</option>
            </optgroup>
            <optgroup label="Abonos da Empresa">
              <option value="Abono">Abono Geral</option>
              {companyAllowances.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Occurrences List */}
      <div 
        className="rounded-2xl border overflow-hidden divide-y"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        {filteredOccurrences.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <FileWarning className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-slate-400">Nenhuma ocorrência encontrada com os filtros atuais.</p>
            <p className="text-[11px] text-slate-500">
              Clique em "+ Adicionar ocorrência" para cadastrar um novo atestado, advertência ou abono.
            </p>
          </div>
        ) : (
          filteredOccurrences.map((occ) => {
            const isWarning = occ.type === 'Advertência';
            const isSuspension = occ.type === 'Suspensão';
            const isDays = occ.type === 'Atestado de Dias' || occ.type === 'Atestado médico' || Boolean(occ.returnDate);
            const isHours = occ.type === 'Atestado de Horas' || occ.type === 'Atestado de horas' || Boolean(occ.startTime && occ.endTime);

            return (
              <div 
                key={occ.id} 
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-black/10 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Icon badge */}
                  <div 
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isWarning || isSuspension
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : isDays || isHours
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isDays ? (
                      <Calendar className="w-5 h-5" />
                    ) : isHours ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <FileWarning className="w-5 h-5" />
                    )}
                  </div>

                  {/* Main Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[var(--title-color)]">
                        {occ.employeeName}
                      </span>
                      
                      {/* Type Badge */}
                      <span 
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isWarning
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : isSuspension
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : isDays
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : isHours
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {occ.type}
                      </span>

                      {/* Allowance Type if applicable */}
                      {occ.allowanceType && occ.allowanceType !== occ.type && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-[var(--accent-color)] border border-[var(--border-color)]">
                          {occ.allowanceType}
                        </span>
                      )}
                    </div>

                    {/* Reason */}
                    <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                      {occ.reason}
                    </p>

                    {/* DYNAMIC CASE: Period & Return Date */}
                    {occ.returnDate && (
                      <div className="p-2 rounded-lg bg-black/20 border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] flex flex-wrap items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          Afastamento: <strong className="text-[var(--title-color)]">{formatDateBR(occ.startDate || occ.date)}</strong> 
                          {occ.daysCount && ` (${occ.daysCount} dias)`}
                        </span>
                        <span>·</span>
                        <span>
                          Retorno previsto ao trabalho: <strong className="text-amber-400">{formatDateBR(occ.returnDate)}</strong>
                        </span>
                      </div>
                    )}

                    {/* DYNAMIC CASE: Hours & Times */}
                    {occ.startTime && occ.endTime && (
                      <div className="p-2 rounded-lg bg-black/20 border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] flex flex-wrap items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[var(--btn-primary)] shrink-0" style={{ color: 'var(--btn-primary)' }} />
                        <span>
                          Horário: <strong className="text-[var(--title-color)]">{occ.startTime} às {occ.endTime}</strong>
                        </span>
                        {occ.hours && (
                          <>
                            <span>·</span>
                            <span>Total abonado: <strong className="text-[var(--title-color)]">{occ.hours}h</strong></span>
                          </>
                        )}
                        <span>· Retorno no mesmo dia</span>
                      </div>
                    )}

                    {/* Attachment & Notes metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-secondary)] pt-0.5">
                      <span>Data de registro: <strong>{formatDateBR(occ.date)}</strong></span>
                      <span>·</span>
                      <span>Registrado por: <strong>{occ.userName}</strong></span>
                      
                      {/* Attachment Badge */}
                      {occ.hasAttachment && (
                        <button
                          type="button"
                          onClick={() => setPreviewAttachmentOcc(occ)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/30 border border-[var(--accent-color)]/30 text-amber-300 hover:text-white hover:border-amber-400 transition-colors cursor-pointer ml-auto sm:ml-0"
                          title="Clique para visualizar o comprovante"
                        >
                          <Paperclip className="w-3 h-3 text-[var(--accent-color)]" />
                          <span className="font-medium truncate max-w-[150px]">
                            {occ.attachmentName || 'Comprovante anexo'}
                          </span>
                          <Eye className="w-3 h-3 ml-0.5 opacity-70" />
                        </button>
                      )}
                    </div>

                    {occ.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        Obs: "{occ.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action / Status badge */}
                <div className="text-right shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-2 md:pt-0">
                  <span 
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      occ.isAllowed
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {occ.isAllowed ? '● Abonado / Justificado' : '● Falta / Penalidade'}
                  </span>
                  
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] opacity-70">
                    {occ.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Main Form Modal */}
      <OccurrenceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Attachment Preview Modal */}
      {previewAttachmentOcc && (
        <div 
          onClick={() => setPreviewAttachmentOcc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border p-5 space-y-4 shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[var(--accent-color)]" />
                <div>
                  <h4 className="text-sm font-bold text-[var(--title-color)]">
                    Comprovante da Ocorrência
                  </h4>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {previewAttachmentOcc.employeeName} · {previewAttachmentOcc.type}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAttachmentOcc(null)}
                className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--title-color)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {previewAttachmentOcc.attachmentUrl ? (
                previewAttachmentOcc.attachmentType === 'image' ? (
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-black/40 flex items-center justify-center max-h-[60vh]">
                    <img 
                      src={previewAttachmentOcc.attachmentUrl} 
                      alt="Comprovante" 
                      className="max-w-full max-h-[55vh] object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-black/30 border border-slate-700 text-center space-y-2">
                    <FileText className="w-12 h-12 text-red-400 mx-auto" />
                    <p className="text-xs font-bold text-white">{previewAttachmentOcc.attachmentName}</p>
                    <p className="text-[11px] text-slate-400">Documento em formato PDF digitalizado.</p>
                    <a
                      href={previewAttachmentOcc.attachmentUrl}
                      download={previewAttachmentOcc.attachmentName || 'comprovante.pdf'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                      style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Baixar arquivo PDF</span>
                    </a>
                  </div>
                )
              ) : (
                <div className="p-6 rounded-xl bg-black/30 border border-slate-700 text-center space-y-2">
                  <FileText className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-xs font-bold text-white">Arquivo: {previewAttachmentOcc.attachmentName}</p>
                  <p className="text-[11px] text-slate-400">Comprovante anexado no ato do registro físico.</p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-black/20 border border-[var(--border-color)] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Motivo:</span>
                  <span className="font-semibold text-[var(--title-color)]">{previewAttachmentOcc.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Data do Fato:</span>
                  <span>{formatDateBR(previewAttachmentOcc.date)}</span>
                </div>
                {previewAttachmentOcc.returnDate && (
                  <div className="flex justify-between text-amber-400 font-semibold">
                    <span>Retorno Previsto:</span>
                    <span>{formatDateBR(previewAttachmentOcc.returnDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewAttachmentOcc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer"
                style={{
                  backgroundColor: 'var(--btn-secondary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
