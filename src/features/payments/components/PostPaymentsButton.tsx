/**
 * Botón para contabilizar pagos con validación automática
 * Muestra detalles de validación si hay errores o advertencias
 */
import React, { useState } from 'react';
import { usePaymentPosting } from '../hooks/usePaymentPosting';
import { PaymentValidationModal } from './PaymentValidationModal';

interface PostPaymentsButtonProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const PostPaymentsButton: React.FC<PostPaymentsButtonProps> = ({
  className = '',
  disabled = false,
  children = 'Contabilizar Pagos'
}) => {
  const [postingNotes, setPostingNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const {
    isPosting,
    showValidationModal,
    validationResult,
    validateAndPostPayments,
    proceedWithWarnings,
    closeValidationModal,
    draftPaymentCount,
    totalSelectedCount,
    canProceedWithOperation
  } = usePaymentPosting();

  const handleClick = () => {
    if (draftPaymentCount === 0) {
      return;
    }

    if (showNotesInput) {
      validateAndPostPayments(postingNotes);
      setShowNotesInput(false);
      setPostingNotes('');
    } else {
      setShowNotesInput(true);
    }
  };

  const handleProceedWithWarnings = () => {
    proceedWithWarnings(postingNotes);
    setPostingNotes('');
  };

  const isDisabled = disabled || isPosting || draftPaymentCount === 0;

  return (
    <>
      <div className="space-y-2">
        {/* Botón principal */}
        <button
          onClick={handleClick}
          disabled={isDisabled}
          className={`
            inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm
            ${isDisabled 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }
            ${className}
          `}
        >
          {isPosting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Contabilizando...
            </>
          ) : (
            <>
              {showNotesInput ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmar Contabilización
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {children}
                </>
              )}
            </>
          )}
        </button>

        {/* Input para notas (si está visible) */}
        {showNotesInput && (
          <div className="w-full">
            <label htmlFor="posting-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notas de contabilización (opcional)
            </label>
            <div className="flex space-x-2">
              <input
                id="posting-notes"
                type="text"
                value={postingNotes}
                onChange={(e) => setPostingNotes(e.target.value)}
                placeholder="Ej: Contabilización masiva del mes..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
              />
              <button
                onClick={() => {
                  setShowNotesInput(false);
                  setPostingNotes('');
                }}
                className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Cancelar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Información de estado */}
        <div className="text-xs text-gray-500">
          {totalSelectedCount > 0 ? (
            draftPaymentCount > 0 ? (
              <>
                {draftPaymentCount} de {totalSelectedCount} pagos listos para contabilizar
                {draftPaymentCount < totalSelectedCount && (
                  <span className="text-yellow-600 ml-1">
                    (solo pagos en borrador)
                  </span>
                )}
              </>
            ) : (
              <span className="text-yellow-600">
                Ningún pago seleccionado está en estado borrador
              </span>
            )
          ) : (
            'Seleccione pagos para contabilizar'
          )}
        </div>
      </div>

      {/* Modal de validación */}
      <PaymentValidationModal
        isOpen={showValidationModal}
        onClose={closeValidationModal}
        validation={validationResult}
        onProceedWithWarnings={canProceedWithOperation ? handleProceedWithWarnings : undefined}
        title="Validación de Contabilización"
        showProceedButton={canProceedWithOperation}
      />
    </>
  );
};
