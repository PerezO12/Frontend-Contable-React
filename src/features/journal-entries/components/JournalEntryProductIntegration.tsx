import { useState, useEffect } from 'react';
import { JournalEntryProductLine } from './JournalEntryProductLine';
import { Button } from '../../../components/ui/Button';
import { TransactionOrigin, TransactionOriginLabels, getTransactionOriginColor } from '../types';
import type { JournalEntryLineFormData, JournalEntryFormData, TransactionOrigin as TransactionOriginType } from '../types';

interface JournalEntryProductIntegrationProps {
  formData: JournalEntryFormData;
  onFormDataChange: (data: Partial<JournalEntryFormData>) => void;
  onLineChange: (index: number, field: keyof JournalEntryLineFormData, value: string) => void;
  disabled?: boolean;
}

export function JournalEntryProductIntegration({
  formData,
  onFormDataChange,
  onLineChange,
  disabled = false
}: JournalEntryProductIntegrationProps) {
  const [expandedLines, setExpandedLines] = useState<Set<number>>(new Set());

  // Auto-expandir primera línea para mejor UX
  useEffect(() => {
    if (formData.lines.length > 0 && expandedLines.size === 0) {
      setExpandedLines(new Set([0]));
    }
  }, [formData.lines.length]);

  // Alternar expansión de línea de producto
  const toggleLineExpansion = (lineIndex: number) => {
    const newExpanded = new Set(expandedLines);
    if (newExpanded.has(lineIndex)) {
      newExpanded.delete(lineIndex);
    } else {
      newExpanded.add(lineIndex);
    }
    setExpandedLines(newExpanded);
  };

  // Manejar cambio de origen de transacción
  const handleTransactionOriginChange = (origin: TransactionOriginType | '') => {
    onFormDataChange({
      transaction_origin: origin || undefined
    });
  };

  // Determinar si mostrar productos por defecto según el origen
  const shouldShowProductsByDefault = (origin?: TransactionOriginType) => {
    return origin === TransactionOrigin.SALE || origin === TransactionOrigin.PURCHASE;
  };

  // Auto-expandir líneas cuando se selecciona un origen que requiere productos
  const handleTransactionOriginChangeWithExpansion = (origin: TransactionOriginType | '') => {
    handleTransactionOriginChange(origin);
    
    if (shouldShowProductsByDefault(origin as TransactionOriginType)) {
      // Expandir todas las líneas para mostrar productos
      const allLines = new Set(formData.lines.map((_, index) => index));
      setExpandedLines(allLines);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de origen de transacción */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-blue-900">
            Origen de Transacción
          </label>
          {formData.transaction_origin && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTransactionOriginColor(formData.transaction_origin)}`}>
              {TransactionOriginLabels[formData.transaction_origin]}
            </span>
          )}
        </div>
        
        <select
          value={formData.transaction_origin || ''}
          onChange={(e) => handleTransactionOriginChangeWithExpansion(e.target.value as TransactionOriginType)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          <option value="">Seleccionar origen...</option>
          {Object.entries(TransactionOriginLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        
        {formData.transaction_origin && shouldShowProductsByDefault(formData.transaction_origin) && (
          <p className="text-xs text-blue-700 mt-2">
            💡 Este tipo de transacción comúnmente incluye productos. Los campos de productos se han expandido automáticamente.
          </p>
        )}
      </div>

      {/* Controles de expansión masiva */}
      {formData.lines.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Gestión de Productos en Líneas
            </span>
            <div className="flex space-x-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setExpandedLines(new Set(formData.lines.map((_, index) => index)))}
                disabled={disabled}
                className="text-xs"
              >
                📦 Expandir Todas
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setExpandedLines(new Set())}
                disabled={disabled}
                className="text-xs"
              >
                📋 Contraer Todas
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Expande las líneas individuales para agregar información de productos, cantidades y precios.
          </p>
        </div>
      )}

      {/* Líneas de productos */}
      <div className="space-y-3">
        {formData.lines.map((line, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            {/* Header de línea con toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  Línea {index + 1}
                </span>
                {line.product_id && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Con Producto
                  </span>
                )}
                {line.account_name && (
                  <span className="text-xs text-gray-500 truncate max-w-xs">
                    {line.account_code} - {line.account_name}
                  </span>
                )}
              </div>
              
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => toggleLineExpansion(index)}
                disabled={disabled}
                className="text-xs"
              >
                {expandedLines.has(index) ? '🔼 Contraer' : '🔽 Expandir'} Productos
              </Button>
            </div>

            {/* Contenido expandible de productos */}
            {expandedLines.has(index) && (
              <div className="p-4">
                <JournalEntryProductLine
                  line={line}
                  lineIndex={index}
                  onLineChange={onLineChange}
                  disabled={disabled}
                  showProductInfo={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Información de ayuda */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Información sobre Productos en Asientos Contables
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Los productos son opcionales y proporcionan trazabilidad adicional</li>
                <li>Para ventas y compras, se recomienda especificar productos cuando sea aplicable</li>
                <li>Los cálculos de cantidad × precio pueden ayudar a determinar los montos de línea</li>
                <li>El sistema validará automáticamente la disponibilidad de stock para ventas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
