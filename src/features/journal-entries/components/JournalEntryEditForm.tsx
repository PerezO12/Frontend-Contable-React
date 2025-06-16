import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useForm } from '../../../shared/hooks/useForm';
import { useJournalEntries, useJournalEntryBalance, useJournalEntry } from '../hooks';
import { useAccounts } from '../../accounts/hooks';
import { usePaymentTermsList } from '../../payment-terms/hooks/usePaymentTerms';
import { formatCurrency } from '../../../shared/utils';
import { 
  JournalEntryType,
  type JournalEntryFormData,
  type JournalEntryLineFormData,
  type JournalEntry
} from '../types';

// Tipo extendido para las líneas del formulario de edición
interface ExtendedJournalEntryLineFormData extends JournalEntryLineFormData {
  // Campos enriquecidos adicionales
  third_party_code?: string;
  third_party_name?: string;
  third_party_document_type?: string;
  third_party_document_number?: string;
  third_party_tax_id?: string;
  third_party_email?: string;
  third_party_phone?: string;
  third_party_address?: string;
  third_party_city?: string;
  third_party_type?: string;
  cost_center_code?: string;
  cost_center_name?: string;
  payment_terms_code?: string;
  payment_terms_name?: string;
  payment_terms_description?: string;
  effective_invoice_date?: string;
  effective_due_date?: string;
  payment_schedule?: any[];
  product_code?: string;
  product_name?: string;
  product_type?: string;
  product_measurement_unit?: string;
  subtotal_before_discount?: string;
  effective_unit_price?: string;
  total_discount?: string;
  subtotal_after_discount?: string;
  net_amount?: string;
  gross_amount?: string;
  amount?: string;
  movement_type?: string;
}

// Tipo extendido para el formulario de edición
interface ExtendedJournalEntryFormData extends Omit<JournalEntryFormData, 'lines'> {
  lines: ExtendedJournalEntryLineFormData[];
}

interface JournalEntryEditFormProps {
  entryId: string;
  onSuccess?: (entry: JournalEntry) => void;
  onCancel?: () => void;
}

export const JournalEntryEditForm: React.FC<JournalEntryEditFormProps> = ({
  entryId,
  onSuccess,
  onCancel
}) => {  // Cargar datos del entry existente
  const { entry: existingEntry, loading: loadingEntry } = useJournalEntry(entryId);
  
  // Cargar datos dependientes
  const { paymentTerms = [] } = usePaymentTermsList({ autoLoad: true });
  const { accounts = [] } = useAccounts({ is_active: true });
  
  // Hook para operaciones CRUD
  const { updateEntry } = useJournalEntries();
  // Preparar datos iniciales del formulario cuando se cargan los datos del backend
  const initialFormData = useMemo((): ExtendedJournalEntryFormData => {
    if (!existingEntry || loadingEntry) {
      return {
        reference: '',
        description: '',
        entry_type: JournalEntryType.MANUAL,
        entry_date: new Date().toISOString().split('T')[0],
        notes: '',
        external_reference: '',
        third_party_id: '',
        cost_center_id: '',
        payment_terms_id: '',
        invoice_date: '',
        due_date: '',
        lines: []
      };
    }

    console.log('📥 [EDIT] Cargando datos del entry existente:', existingEntry);
    console.log('📥 [EDIT] Líneas originales del backend:', existingEntry.lines);
    console.log('📥 [EDIT] Cantidad de líneas:', existingEntry.lines?.length);

    // Obtener valores efectivos de la primera línea para campos de payment terms
    const firstLine = existingEntry.lines?.[0];
    const effectiveInvoiceDate = firstLine?.effective_invoice_date || firstLine?.invoice_date || '';
    const effectiveDueDate = firstLine?.effective_due_date || firstLine?.due_date || '';
    
    // Buscar payment_terms_id por código si no está presente
    let paymentTermsId = firstLine?.payment_terms_id || '';
    if (!paymentTermsId && firstLine?.payment_terms_code && paymentTerms.length > 0) {
      const foundPaymentTerm = paymentTerms.find((pt: any) => pt.code === firstLine.payment_terms_code);
      if (foundPaymentTerm) {
        paymentTermsId = foundPaymentTerm.id;
      }
    }

    // Mapear todas las líneas con datos enriquecidos
    const mappedLines: ExtendedJournalEntryLineFormData[] = existingEntry.lines?.map((line: any, index: number) => {
      console.log(`📥 [EDIT] Mapeando línea ${index + 1}:`, {
        account_id: line.account_id,
        account_name: line.account_name,
        product_id: line.product_id,
        product_name: line.product_name,
        payment_schedule: line.payment_schedule?.length || 0
      });

      // Usar valores efectivos para fechas
      const lineEffectiveInvoiceDate = line.effective_invoice_date || line.invoice_date || '';
      const lineEffectiveDueDate = line.effective_due_date || line.due_date || '';
      
      // Buscar payment_terms_id por código si no está presente
      let linePaymentTermsId = line.payment_terms_id || '';
      if (!linePaymentTermsId && line.payment_terms_code && paymentTerms.length > 0) {
        const foundPaymentTerm = paymentTerms.find((pt: any) => pt.code === line.payment_terms_code);
        if (foundPaymentTerm) {
          linePaymentTermsId = foundPaymentTerm.id;
        }
      }

      return {
        // Campos básicos requeridos
        account_id: line.account_id || '',
        debit_amount: String(line.debit_amount) || '0.00',
        credit_amount: String(line.credit_amount) || '0.00',
        description: line.description || '',
        
        // Campos básicos opcionales
        reference: line.reference || '',
        
        // Campos enriquecidos - Cuenta
        account_code: line.account_code || '',
        account_name: line.account_name || '',
        
        // Campos enriquecidos - Tercero
        third_party_id: line.third_party_id || '',
        third_party_code: line.third_party_code || '',
        third_party_name: line.third_party_name || '',
        third_party_document_type: line.third_party_document_type || '',
        third_party_document_number: line.third_party_document_number || '',
        third_party_tax_id: line.third_party_tax_id || '',
        third_party_email: line.third_party_email || '',
        third_party_phone: line.third_party_phone || '',
        third_party_address: line.third_party_address || '',
        third_party_city: line.third_party_city || '',
        third_party_type: line.third_party_type || '',
        
        // Campos enriquecidos - Centro de costo
        cost_center_id: line.cost_center_id || '',
        cost_center_code: line.cost_center_code || '',
        cost_center_name: line.cost_center_name || '',
        
        // Campos enriquecidos - Términos de pago
        payment_terms_id: linePaymentTermsId,
        payment_terms_code: line.payment_terms_code || '',
        payment_terms_name: line.payment_terms_name || '',
        payment_terms_description: line.payment_terms_description || '',
        invoice_date: lineEffectiveInvoiceDate,
        due_date: lineEffectiveDueDate,
        effective_invoice_date: line.effective_invoice_date || '',
        effective_due_date: line.effective_due_date || '',
        payment_schedule: line.payment_schedule || [],
        
        // Campos enriquecidos - Productos
        product_id: line.product_id || '',
        product_code: line.product_code || '',
        product_name: line.product_name || '',
        product_type: line.product_type || '',
        product_measurement_unit: line.product_measurement_unit || '',
        quantity: line.quantity || '',
        unit_price: line.unit_price || '',
        discount_percentage: line.discount_percentage || '',
        discount_amount: line.discount_amount || '',
        tax_percentage: line.tax_percentage || '',
        tax_amount: line.tax_amount || '',
        
        // Campos calculados
        subtotal_before_discount: line.subtotal_before_discount || '',
        effective_unit_price: line.effective_unit_price || '',
        total_discount: line.total_discount || '',
        subtotal_after_discount: line.subtotal_after_discount || '',
        net_amount: line.net_amount || '',
        gross_amount: line.gross_amount || '',
        amount: line.amount || '',
        movement_type: line.movement_type || ''
      };
    }) || [];

    console.log('📥 [EDIT] Líneas mapeadas:', mappedLines.length);
    console.log('📥 [EDIT] Primera línea mapeada:', mappedLines[0]);

    const formData: ExtendedJournalEntryFormData = {
      reference: existingEntry.reference || '',
      description: existingEntry.description || '',
      entry_type: existingEntry.entry_type || JournalEntryType.MANUAL,
      entry_date: existingEntry.entry_date || new Date().toISOString().split('T')[0],
      notes: existingEntry.notes || '',
      external_reference: existingEntry.external_reference || '',
      // Campos de payment terms a nivel de asiento
      third_party_id: firstLine?.third_party_id || '',
      cost_center_id: firstLine?.cost_center_id || '',
      payment_terms_id: paymentTermsId,
      invoice_date: effectiveInvoiceDate,
      due_date: effectiveDueDate,
      lines: mappedLines
    };

    console.log('📥 [EDIT] Datos finales del formulario:', {
      linesCount: formData.lines.length,
      hasPaymentTerms: !!formData.payment_terms_id,
      hasInvoiceDate: !!formData.invoice_date
    });

    return formData;
  }, [existingEntry, loadingEntry, paymentTerms]);
  // Validación simple para edición
  const formValidate = useCallback((data: ExtendedJournalEntryFormData) => {
    console.log('🔍 [EDIT] Validando datos:', data);
    const errors: any[] = [];
    
    // Validaciones básicas
    if (!data.description || data.description.trim().length < 3) {
      errors.push({
        field: 'description',
        message: 'La descripción debe tener al menos 3 caracteres'
      });
    }
    
    if (!data.entry_date || isNaN(Date.parse(data.entry_date))) {
      errors.push({
        field: 'entry_date',
        message: 'Fecha inválida'
      });
    }
    
    if (!data.lines || data.lines.length < 2) {
      errors.push({
        field: 'lines',
        message: 'Un asiento debe tener al menos 2 líneas'
      });
    }
    
    console.log('🔍 [EDIT] Errores de validación:', errors);
    return errors;
  }, []);

  // Función de envío
  const formOnSubmit = useCallback(async (formData: ExtendedJournalEntryFormData) => {
    console.log('🚀 [EDIT] Enviando actualización:', formData);

    try {
      // Preparar datos para el backend
      const updateData = {
        id: entryId,
        reference: formData.reference?.trim() || '',
        description: formData.description?.trim() || '',
        entry_type: formData.entry_type || JournalEntryType.MANUAL,
        entry_date: formData.entry_date,
        notes: formData.notes?.trim() || '',
        external_reference: formData.external_reference?.trim() || '',        lines: formData.lines
          .filter(line => line.account_id && 
            (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0))
          .map(line => ({
            account_id: line.account_id,
            description: line.description?.trim() || formData.description?.trim() || '',
            debit_amount: parseFloat(line.debit_amount),
            credit_amount: parseFloat(line.credit_amount),
            third_party_id: line.third_party_id || undefined,
            cost_center_id: line.cost_center_id || undefined,
            reference: line.reference?.trim() || undefined,
            // Campos de productos e facturación
            product_id: line.product_id || undefined,
            quantity: line.quantity ? String(line.quantity) : undefined,
            unit_price: line.unit_price || undefined,
            discount_percentage: line.discount_percentage || undefined,
            discount_amount: line.discount_amount || undefined,
            tax_percentage: line.tax_percentage || undefined,
            tax_amount: line.tax_amount || undefined,
            // Campos de términos de pago
            payment_terms_id: line.payment_terms_id || formData.payment_terms_id || undefined,
            invoice_date: line.invoice_date || formData.invoice_date || undefined,
            due_date: line.due_date || formData.due_date || undefined,
          }))
      };

      console.log('🚀 [EDIT] Datos preparados para backend:', updateData);

      const updatedEntry = await updateEntry(entryId, updateData);
      
      console.log('✅ [EDIT] Asiento actualizado exitosamente:', updatedEntry);
      
      if (onSuccess && updatedEntry) {
        onSuccess(updatedEntry);
      }
    } catch (error) {
      console.error('❌ [EDIT] Error al actualizar asiento:', error);
      throw error;
    }
  }, [entryId, updateEntry, onSuccess]);

  // Hook del formulario
  const {
    data: values,
    updateField,
    handleSubmit,
    getFieldError,
    isSubmitting
  } = useForm<ExtendedJournalEntryFormData>({
    initialData: initialFormData,
    validate: formValidate,
    onSubmit: formOnSubmit
  });

  // Log para depurar el estado del formulario
  useEffect(() => {
    console.log('🔄 [EDIT] Estado del formulario actualizado:', {
      entryId,
      hasEntry: !!existingEntry,
      linesCount: values.lines?.length || 0,
      firstLine: values.lines?.[0] ? {
        account_id: values.lines[0].account_id,
        account_name: values.lines[0].account_name,
        product_name: values.lines[0].product_name
      } : null
    });
  }, [entryId, existingEntry, values.lines]);
  // Funciones auxiliares para manejo de líneas
  const addLine = useCallback(() => {
    const newLines = [...values.lines, {
      account_id: '',
      debit_amount: '0.00',
      credit_amount: '0.00',
      description: ''
    }];
    updateField('lines', newLines);
  }, [values.lines, updateField]);

  const removeLine = useCallback((index: number) => {
    if (values.lines.length > 2) {
      const newLines = values.lines.filter((_, i) => i !== index);
      updateField('lines', newLines);
    }
  }, [values.lines, updateField]);

  const updateLine = useCallback((index: number, field: keyof ExtendedJournalEntryLineFormData, value: any) => {
    const newLines = [...values.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    updateField('lines', newLines);
  }, [values.lines, updateField]);

  // Hook para cálculos de balance
  const balanceData = useJournalEntryBalance(values.lines);
  const balance = {
    totalDebit: balanceData.total_debit,
    totalCredit: balanceData.total_credit,
    difference: balanceData.difference,
    isBalanced: balanceData.is_balanced
  };

  if (loadingEntry) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!existingEntry) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          No se encontró el asiento contable
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Editar Asiento Contable #{existingEntry.number}
        </h2>
        <div className="flex space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || balance.isBalanced === false}
            className="min-w-[120px]"
          >
            {isSubmitting ? <Spinner size="sm" /> : 'Actualizar'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información Básica
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia
              </label>
              <Input
                type="text"
                value={values.reference}
                onChange={(e) => updateField('reference', e.target.value)}
                placeholder="Referencia del asiento"
              />
              {getFieldError('reference') && (
                <ValidationMessage message={getFieldError('reference')!} type="error" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Asiento *
              </label>
              <Input
                type="date"
                value={values.entry_date}
                onChange={(e) => updateField('entry_date', e.target.value)}
                required
              />
              {getFieldError('entry_date') && (
                <ValidationMessage message={getFieldError('entry_date')!} type="error" />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <Input
                type="text"
                value={values.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Descripción del asiento contable"
                required
              />
              {getFieldError('description') && (
                <ValidationMessage message={getFieldError('description')!} type="error" />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={values.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Notas adicionales"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Resumen de líneas */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Líneas del Asiento ({values.lines.length})
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLine}
            >
              Agregar Línea
            </Button>
          </div>

          <div className="space-y-4">
            {values.lines.map((line, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Línea {index + 1}
                    {line.account_name && ` - ${line.account_name}`}
                    {line.product_name && ` (${line.product_name})`}
                  </span>
                  {values.lines.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLine(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Eliminar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cuenta
                    </label>
                    <select
                      value={line.account_id}
                      onChange={(e) => updateLine(index, 'account_id', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar cuenta</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Descripción
                    </label>                    <Input
                      type="text"
                      value={line.description}
                      onChange={(e) => updateLine(index, 'description', e.target.value)}
                      placeholder="Descripción de la línea"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Débito
                    </label>                    <Input
                      type="number"
                      step="0.01"
                      value={line.debit_amount}
                      onChange={(e) => updateLine(index, 'debit_amount', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Crédito
                    </label>                    <Input
                      type="number"
                      step="0.01"
                      value={line.credit_amount}
                      onChange={(e) => updateLine(index, 'credit_amount', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>                {/* Mostrar información enriquecida si existe */}
                {(line.product_name || line.third_party_name || (line.payment_schedule && line.payment_schedule.length > 0)) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-600 space-y-1">
                      {line.product_name && (
                        <div>
                          <strong>Producto:</strong> {line.product_name}
                          {line.quantity && line.unit_price && (
                            <span> ({line.quantity} x {formatCurrency(parseFloat(line.unit_price))})</span>
                          )}
                        </div>
                      )}
                      {line.third_party_name && (
                        <div><strong>Tercero:</strong> {line.third_party_name}</div>
                      )}
                      {line.payment_schedule && line.payment_schedule.length > 0 && (
                        <div>
                          <strong>Cronograma:</strong> {line.payment_schedule.length} cuotas
                          <span className="ml-2">
                            Vence: {line.payment_schedule[line.payment_schedule.length - 1]?.payment_date}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Balance */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <div className="space-x-4">
                <span>Total Débito: <strong>{formatCurrency(balance.totalDebit)}</strong></span>
                <span>Total Crédito: <strong>{formatCurrency(balance.totalCredit)}</strong></span>
                <span>Diferencia: <strong className={balance.difference === 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(Math.abs(balance.difference))}
                </strong></span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                balance.isBalanced 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {balance.isBalanced ? 'Balanceado' : 'Desbalanceado'}
              </div>
            </div>
          </div>

          {getFieldError('lines') && (
            <ValidationMessage message={getFieldError('lines')!} type="error" />
          )}
        </Card>
      </form>
    </div>
  );
};
