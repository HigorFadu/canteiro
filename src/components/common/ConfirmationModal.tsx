import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, AlertCircle, ShieldAlert, X } from 'lucide-react';

export const ConfirmationModal: React.FC = () => {
  const { confirmModal, closeConfirmation } = useApp();

  if (!confirmModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              confirmModal.isDestructive 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {confirmModal.isDestructive ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight" style={{ color: 'var(--title-color)' }}>
                {confirmModal.title}
              </h3>
              <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Confirmação de operação</span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeConfirmation}
            className="hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <div className="space-y-3">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {confirmModal.message}
          </p>

          {confirmModal.warningDetails && (
            <div 
              className="p-3 rounded-xl border text-[11px] leading-snug flex items-start gap-2"
              style={{ backgroundColor: 'var(--btn-secondary)', borderColor: 'var(--border-color)', color: 'var(--warning-color)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--warning-color)' }} />
              <span>{confirmModal.warningDetails}</span>
            </div>
          )}

          <div 
            className="p-2.5 rounded-lg border text-[10px] flex items-center justify-between"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <span>Esta ação será registrada no histórico da obra</span>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Registro seguro</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={closeConfirmation}
            className="px-3.5 py-2 rounded-xl font-semibold text-xs transition-colors border"
            style={{ backgroundColor: 'var(--btn-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
          >
            {confirmModal.cancelLabel || 'Cancelar'}
          </button>
          <button
            type="button"
            onClick={confirmModal.onConfirm}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
              confirmModal.isDestructive
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                : 'hover:opacity-90 shadow-sm'
            }`}
            style={
              !confirmModal.isDestructive
                ? { backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }
                : undefined
            }
          >
            {confirmModal.confirmLabel || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
