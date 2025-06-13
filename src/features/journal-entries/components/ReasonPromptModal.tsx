import React, { useState, useEffect } from 'react';

interface ReasonPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, forceOperation?: boolean) => void;
  title: string;
  placeholder: string;
  showForceOption?: boolean;
  forceOptionLabel?: string;
  forceOptionDescription?: string;
}

export const ReasonPromptModal: React.FC<ReasonPromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  placeholder,
  showForceOption = false,
  forceOptionLabel = "Forzar operación",
  forceOptionDescription = "Activa esta opción para forzar la operación aún si no se cumplen algunas validaciones. Usar con precaución."
}) => {
  const [reason, setReason] = useState('');
  const [forceOperation, setForceOperation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  useEffect(() => {
    if (isOpen) {
      setReason('');
      setForceOperation(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
      setIsSubmitting(true);
    try {
      await onConfirm(reason.trim(), showForceOption ? forceOperation : undefined);
      onClose();
    } catch (error) {
      console.error('Error al confirmar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={handleBackdropClick}
      >        {/* Modal Container */}
        <div 
          className="w-full max-w-md transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95"
        >
          {/* Modal Content */}
          <div 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="px-6 py-6">
              <div className="mb-6">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-3">
                  Ingrese la razón para esta acción
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={placeholder}
                  rows={4}
                  required
                  disabled={isSubmitting}
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                  style={{
                    backgroundColor: '#fafafa',
                    fontSize: '14px',
                    lineHeight: '1.5',
                  }}
                />                <p className="mt-2 text-xs text-gray-500">
                  Proporcione una explicación clara para esta operación
                </p>
              </div>              {/* Force Operation Checkbox */}
              {showForceOption && (
                <div className="mb-6">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={forceOperation}
                      onChange={(e) => setForceOperation(e.target.checked)}
                      disabled={isSubmitting}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        {forceOptionLabel}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {forceOptionDescription}
                        <span className="text-yellow-600 font-medium"> Usar con precaución.</span>
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim() || isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Confirmar</span>
                  )}
                </button>
              </div>
            </form>          </div>
        </div>
      </div>
    </>
  );
};
