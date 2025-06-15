import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useForm } from '../../../shared/hooks/useForm';
import { useJournalEntries, useJournalEntryBalance } from '../hooks';
import { useAccounts } from '../../accounts/hooks';
import { useThirdParties } from '../../third-parties/hooks';
import { useCostCenters } from '../../cost-centers/hooks';
import { usePaymentTermsList } from '../../payment-terms/hooks/usePaymentTerms';
import { useJournalEntryPaymentTerms } from '../hooks/useJournalEntryPaymentTerms';
import { formatCurrency } from '../../../shared/utils';
import { 
  journalEntryCreateSchema,
  JournalEntryType,
  JOURNAL_ENTRY_TYPE_LABELS,
  type JournalEntryFormData,
  type JournalEntryLineFormData,
  type JournalEntry,
  type PaymentScheduleItem
} from '../types';

interface JournalEntryFormProps {
  onSuccess?: (entry: JournalEntry) => void;
  onCancel?: () => void;
  initialData?: Partial<JournalEntryFormData>;
  isEditMode?: boolean;
  entryId?: string;
}

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isEditMode = false,
  entryId
}) => {
  console.log('🔍 JournalEntryForm renderizado con:', {
    isEditMode,
    entryId,
    hasInitialData: !!initialData,
    initialDataKeys: initialData ? Object.keys(initialData) : []
  });  // Estabilizar filtros para evitar bucles infinitos
  const accountFilters = useMemo(() => ({ is_active: true }), []);
  const thirdPartyFilters = useMemo(() => ({ is_active: true }), []);
  const costCenterFilters = useMemo(() => ({ is_active: true }), []);
  const paymentTermsOptions = useMemo(() => ({ autoLoad: true }), []);

  const { createEntry, updateEntry, loading } = useJournalEntries();
  const { accounts } = useAccounts(accountFilters);
  const { thirdParties } = useThirdParties(thirdPartyFilters);
  const { costCenters } = useCostCenters(costCenterFilters);
  const { paymentTerms } = usePaymentTermsList(paymentTermsOptions);
  const {
    calculatePaymentSchedule,
    calculating: calculatingSchedule,
    error: scheduleError,
    clearError: clearScheduleError
  } = useJournalEntryPaymentTerms();
    const [accountSearchTerms, setAccountSearchTerms] = useState<Record<number, string>>({});
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [draftKey] = useState(`journal-entry-draft-${Date.now()}`); // Clave única para esta sesión
  const [entryPaymentSchedule, setEntryPaymentSchedule] = useState<PaymentScheduleItem[]>([]);
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);

  // Función para limpiar borradores del localStorage
  const clearDrafts = useCallback(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('journal-entry-draft-')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // Función para limpiar el borrador actual específicamente
  const clearCurrentDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
  }, [draftKey]);  // Memoizar configuraciones para evitar recreaciones
  const initialFormData = useMemo(() => ({
    reference: initialData?.reference || '',
    description: initialData?.description || '',
    entry_type: initialData?.entry_type || JournalEntryType.MANUAL,
    entry_date: initialData?.entry_date || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
    external_reference: initialData?.external_reference || '',
    // Nuevos campos de payment terms a nivel de asiento
    third_party_id: initialData?.third_party_id || '',
    cost_center_id: initialData?.cost_center_id || '',
    payment_terms_id: initialData?.payment_terms_id || '',
    invoice_date: initialData?.invoice_date || '',
    due_date: initialData?.due_date || '',
    lines: initialData?.lines || [
      { account_id: '', debit_amount: '0.00', credit_amount: '0.00', description: '' },
      { account_id: '', debit_amount: '0.00', credit_amount: '0.00', description: '' }
    ]
  }), [initialData]);

  const formValidate = useCallback((data: JournalEntryFormData) => {
    console.log('🔍 Validando datos en modo:', isEditMode ? 'edición' : 'creación');
    console.log('🔍 Datos a validar:', data);
    
    if (isEditMode) {
      // Para modo edición, hacer validaciones básicas sin schema estricto
      const errors: any[] = [];
      
      // Validar descripción si está presente
      if (data.description && data.description.length < 3) {
        errors.push({
          field: 'description',
          message: 'La descripción debe tener al menos 3 caracteres'
        });
      }
      
      // Validar fecha si está presente
      if (data.entry_date && isNaN(Date.parse(data.entry_date))) {
        errors.push({
          field: 'entry_date',
          message: 'Fecha inválida'
        });
      }
      
      // Validar líneas básicamente
      if (data.lines && data.lines.length < 2) {
        errors.push({
          field: 'lines',
          message: 'Un asiento debe tener al menos 2 líneas'
        });
      }
      
      console.log('🔍 Errores de validación manual:', errors);
      return errors;
    } else {
      // Para modo creación, usar schema de creación
      const result = journalEntryCreateSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        console.log('🔍 Errores de validación schema:', errors);
        return errors;
      }
    }
    return [];
  }, [isEditMode]);
  const formOnSubmit = useCallback(async (formData: JournalEntryFormData) => {
    console.log('🚀 JournalEntry onSubmit ejecutado con:', {
      isEditMode,
      entryId,
      formData
    });
    
    // Preparar las líneas con third_party_id y cost_center_id propagados desde el nivel del asiento
    const enhancedLines = formData.lines
      .filter(line => line.account_id && 
        (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0))
      .map(line => ({
        ...line,
        // Propagar third_party_id y cost_center_id del asiento a todas las líneas
        third_party_id: formData.third_party_id || line.third_party_id || undefined,
        cost_center_id: formData.cost_center_id || line.cost_center_id || undefined
      }));

    const submitData = {
      ...formData,
      lines: enhancedLines
    };

    console.log('📤 Datos que se enviarán al backend:', submitData);

    if (isEditMode && entryId) {
      const result = await updateEntry(entryId, { ...submitData, id: entryId });
      if (result) {
        console.log('✅ Asiento actualizado exitosamente:', result);
        // Limpiar borrador actual y todos los borradores antiguos al actualizar exitosamente
        clearCurrentDraft();
        clearDrafts();
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } else {
      const result = await createEntry(submitData);
      if (result) {
        console.log('✅ Asiento creado exitosamente:', result);
        // Limpiar borrador actual y todos los borradores antiguos al crear exitosamente
        clearCurrentDraft();
        clearDrafts();
        if (onSuccess) {
          onSuccess(result);
        }
      }
    }
  }, [isEditMode, entryId, updateEntry, createEntry, clearCurrentDraft, clearDrafts, onSuccess]);

  const {
    data: values,
    updateField,
    handleSubmit,
    getFieldError,
    clearErrors
  } = useForm<JournalEntryFormData>({
    initialData: initialFormData,
    validate: formValidate,
    onSubmit: formOnSubmit
  });// Balance validation hook
  const balance = useJournalEntryBalance(values.lines);
    // Memoize total debit to avoid unnecessary useEffect executions
  const totalDebit = useMemo(() => balance.total_debit, [balance.total_debit]);

  // Memoize calculation function to avoid re-creating it on every render
  const calculateEntryPaymentSchedule = useCallback(async () => {
    if (values.payment_terms_id && values.invoice_date && totalDebit > 0) {
      try {
        clearScheduleError();
        const result = await calculatePaymentSchedule({
          payment_terms_id: values.payment_terms_id,
          invoice_date: values.invoice_date,
          amount: totalDebit
        });

        // Transform PaymentCalculationItem[] to PaymentScheduleItem[]
        const scheduleItems: PaymentScheduleItem[] = result.schedule.map(item => ({
          sequence: item.sequence,
          days: item.days,
          percentage: item.percentage,
          amount: item.amount,
          payment_date: item.payment_date,
          description: item.description || ''
        }));

        setEntryPaymentSchedule(scheduleItems);
        setShowPaymentSchedule(true);
      } catch (error) {
        console.error('Error calculating entry payment schedule:', error);
        setEntryPaymentSchedule([]);
        setShowPaymentSchedule(false);
      }
    } else {
      setEntryPaymentSchedule([]);
      setShowPaymentSchedule(false);
    }
  }, [values.payment_terms_id, values.invoice_date, totalDebit, calculatePaymentSchedule, clearScheduleError]);

  // Calculate payment schedule when payment terms, invoice date, or total amount changes
  useEffect(() => {
    calculateEntryPaymentSchedule();
  }, [calculateEntryPaymentSchedule]);

  // Filter accounts for autocomplete
  const getFilteredAccounts = useCallback((searchTerm: string) => {
    if (!searchTerm) return accounts.slice(0, 20);
    
    const term = searchTerm.toLowerCase();
    return accounts
      .filter(account => 
        account.code.toLowerCase().includes(term) ||
        account.name.toLowerCase().includes(term)
      )
      .slice(0, 20);
  }, [accounts]);  // Memoize event handlers to avoid recreating them on every render
  const handleInputChange = useCallback((field: keyof JournalEntryFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      
      // Si se selecciona payment terms, limpiar due_date manual
      if (field === 'payment_terms_id' && value) {
        updateField('due_date', '');
      }
      // Si se selecciona due_date manual, limpiar payment_terms_id
      else if (field === 'due_date' && value) {
        updateField('payment_terms_id', '');
      }
      
      updateField(field, value);
      clearErrors();
    }, [updateField, clearErrors]);

  const handleLineChange = useCallback((index: number, field: keyof JournalEntryLineFormData, value: string) => {
    const newLines = [...values.lines];
    newLines[index] = { ...newLines[index], [field]: value };

    // Auto-clear the opposite amount field
    if (field === 'debit_amount' && parseFloat(value) > 0) {
      newLines[index].credit_amount = '0.00';
    } else if (field === 'credit_amount' && parseFloat(value) > 0) {
      newLines[index].debit_amount = '0.00';
    }

    updateField('lines', newLines);
    clearErrors();
  }, [values.lines, updateField, clearErrors]);  const handleAccountSelect = useCallback((index: number, account: { id: string; code: string; name: string }) => {
    const newLines = [...values.lines];
    newLines[index] = {
      ...newLines[index],
      account_id: account.id,
      account_code: account.code,
      account_name: account.name
    };
    updateField('lines', newLines);
    
    // Clear search term and close dropdown
    setAccountSearchTerms(prev => ({ ...prev, [index]: '' }));
    setFocusedInput(null);
  }, [values.lines, updateField]);

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
    if (values.lines.length <= 2) return; // Minimum 2 lines required
    
    const newLines = values.lines.filter((_, i) => i !== index);
    updateField('lines', newLines);
  }, [values.lines, updateField]);

  const duplicateLine = useCallback((index: number) => {
    const lineToDuplicate = values.lines[index];
    const newLine = {
      ...lineToDuplicate,
      account_id: '',
      account_code: '',
      account_name: '',
      debit_amount: '0.00',
      credit_amount: '0.00'    };
    const newLines = [...values.lines];
    newLines.splice(index + 1, 0, newLine);
    updateField('lines', newLines);
  }, [values.lines, updateField]);

  // Auto-save draft functionality with debounced value check
  const draftableData = useMemo(() => {
    // Only include data that should trigger auto-save
    return {
      description: values.description,
      hasLines: values.lines.some(line => line.account_id)
    };
  }, [values.description, values.lines]);

  useEffect(() => {
    if (!isEditMode && draftableData.description && draftableData.hasLines) {
      const saveTimer = setTimeout(() => {
        // Usar la clave específica de esta sesión en lugar de generar una nueva cada vez
        localStorage.setItem(draftKey, JSON.stringify(values));
        console.log('Borrador guardado automáticamente:', draftKey);
      }, 5000); // Auto-save every 5 seconds

      return () => clearTimeout(saveTimer);
    }
  }, [draftableData, values, isEditMode, draftKey]);

  // Limpiar borrador al desmontar el componente o cancelar
  useEffect(() => {
    return () => {
      // Limpiar solo el borrador actual al desmontar, no todos
      if (!isEditMode) {
        clearCurrentDraft();
      }
    };
  }, [clearCurrentDraft, isEditMode]);

  // Función para manejar cancelación
  const handleCancel = useCallback(() => {
    if (!isEditMode) {
      clearCurrentDraft(); // Limpiar borrador al cancelar
    }
    if (onCancel) {
      onCancel();
    }
  }, [clearCurrentDraft, isEditMode, onCancel]);

  // Limpiar borradores antiguos al inicializar (solo una vez)
  useEffect(() => {
    if (!isEditMode) {
      // Limpiar borradores que tengan más de 1 hora
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('journal-entry-draft-')) {
          const timestamp = parseInt(key.replace('journal-entry-draft-', ''));
          if (timestamp < oneHourAgo) {
            localStorage.removeItem(key);
            console.log('Borrador antiguo eliminado:', key);
          }
        }
      });
    }
  }, []); // Solo ejecutar una vez al montar

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="card-title">
              {isEditMode ? 'Editar Asiento Contable' : 'Nuevo Asiento Contable'}
            </h3>
            <div className="flex items-center space-x-4">
              {/* Balance indicator */}
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                balance.is_balanced 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {balance.is_balanced ? '✓ Balanceado' : '⚠ Desbalanceado'}
              </div>
              {!balance.is_balanced && (
                <div className="text-sm text-red-600">
                  Diferencia: {formatCurrency(Math.abs(balance.difference))}
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-body space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="entry_date" className="form-label">
                Fecha del Asiento *
              </label>
              <Input
                id="entry_date"
                type="date"
                value={values.entry_date}
                onChange={handleInputChange('entry_date')}
                error={getFieldError('entry_date')}
              />
              {getFieldError('entry_date') && (
                <ValidationMessage type="error" message={getFieldError('entry_date')!} />
              )}
            </div>

            <div>
              <label htmlFor="entry_type" className="form-label">
                Tipo de Asiento *
              </label>
              <select
                id="entry_type"
                value={values.entry_type}
                onChange={handleInputChange('entry_type')}
                className="form-select"
              >
                {Object.entries(JOURNAL_ENTRY_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {getFieldError('entry_type') && (
                <ValidationMessage type="error" message={getFieldError('entry_type')!} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reference" className="form-label">
                Referencia
              </label>
              <Input
                id="reference"
                value={values.reference || ''}
                onChange={handleInputChange('reference')}
                placeholder="Ej: FAC-001, CHQ-123"
                error={getFieldError('reference')}
              />
              {getFieldError('reference') && (
                <ValidationMessage type="error" message={getFieldError('reference')!} />
              )}
            </div>

            <div>
              <label htmlFor="external_reference" className="form-label">
                Referencia Externa
              </label>
              <Input
                id="external_reference"
                value={values.external_reference || ''}
                onChange={handleInputChange('external_reference')}
                placeholder="Referencia del sistema externo"
                error={getFieldError('external_reference')}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Descripción *
            </label>
            <Input
              id="description"
              value={values.description}
              onChange={handleInputChange('description')}
              placeholder="Descripción del asiento contable"
              error={getFieldError('description')}
            />            {getFieldError('description') && (
              <ValidationMessage type="error" message={getFieldError('description')!} />
            )}
          </div>          {/* Payment Terms and Due Date Section */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Información de Facturación y Costos</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="third_party_id" className="form-label">
                  Tercero (Cliente/Proveedor)
                </label>
                <select
                  id="third_party_id"
                  value={values.third_party_id || ''}
                  onChange={handleInputChange('third_party_id')}
                  className="form-select"
                >
                  <option value="">Seleccionar tercero...</option>
                  {thirdParties.map(thirdParty => (
                    <option key={thirdParty.id} value={thirdParty.id}>
                      {thirdParty.code ? `${thirdParty.code} - ${thirdParty.name}` : `${thirdParty.document_number} - ${thirdParty.name}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Se aplicará a todas las líneas del asiento
                </p>
              </div>

              <div>
                <label htmlFor="cost_center_id" className="form-label">
                  Centro de Costo
                </label>
                <select
                  id="cost_center_id"
                  value={values.cost_center_id || ''}
                  onChange={handleInputChange('cost_center_id')}
                  className="form-select"
                >
                  <option value="">Seleccionar centro de costo...</option>
                  {costCenters.map(costCenter => (
                    <option key={costCenter.id} value={costCenter.id}>
                      {costCenter.code} - {costCenter.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Se aplicará a todas las líneas del asiento
                </p>
              </div>
            </div>            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="payment_terms_id" className="form-label">
                  Condiciones de Pago
                </label>
                <select
                  id="payment_terms_id"
                  value={values.payment_terms_id || ''}
                  onChange={handleInputChange('payment_terms_id')}
                  className="form-select"
                >
                  <option value="">Seleccionar condiciones...</option>
                  {paymentTerms.map(paymentTerm => (
                    <option key={paymentTerm.id} value={paymentTerm.id}>
                      {paymentTerm.code} - {paymentTerm.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                {/* Espacio para futura funcionalidad */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="invoice_date" className="form-label">
                  Fecha de Factura
                  {values.payment_terms_id && <span className="text-red-500 ml-1">*</span>}
                </label>
                <Input
                  id="invoice_date"
                  type="date"
                  value={values.invoice_date || ''}
                  onChange={handleInputChange('invoice_date')}
                  error={getFieldError('invoice_date')}
                />
                {getFieldError('invoice_date') && (
                  <ValidationMessage type="error" message={getFieldError('invoice_date')!} />
                )}
              </div>

              <div>
                <label htmlFor="due_date" className="form-label">
                  Fecha de Vencimiento
                  {!values.payment_terms_id && values.due_date && <span className="text-blue-500 ml-1">(Manual)</span>}
                </label>
                <Input
                  id="due_date"
                  type="date"
                  value={values.due_date || ''}
                  onChange={handleInputChange('due_date')}
                  disabled={!!values.payment_terms_id}
                  error={getFieldError('due_date')}
                />
                {getFieldError('due_date') && (
                  <ValidationMessage type="error" message={getFieldError('due_date')!} />
                )}                {values.payment_terms_id && (
                  <p className="text-xs text-gray-500 mt-1">
                    La fecha de vencimiento se calculará automáticamente según las condiciones de pago
                  </p>
                )}
              </div>
            </div>

            {/* Payment Schedule Display */}
            {showPaymentSchedule && entryPaymentSchedule.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-medium text-blue-900">
                    📅 Cronograma de Pagos Calculado
                  </h5>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Total: {formatCurrency(balance.total_debit)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {entryPaymentSchedule.map((payment, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-white border border-blue-100 rounded text-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                          {payment.sequence}
                        </span>
                        <div>
                          <span className="font-medium text-gray-900">
                            {payment.description || `Pago ${payment.sequence}`}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({payment.percentage}% - {payment.days} días)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          📅 {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {calculatingSchedule && (
                  <div className="text-center py-2">
                    <span className="text-sm text-blue-600">Calculando cronograma...</span>
                  </div>
                )}

                {scheduleError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    Error al calcular cronograma: {scheduleError}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="form-label">
              Notas
            </label>
            <textarea
              id="notes"              value={values.notes || ''}
              onChange={handleInputChange('notes')}
              rows={3}
              className="form-textarea"
              placeholder="Notas adicionales sobre el asiento..."
            />
          </div>
        </form>
      </Card>

      {/* Journal Entry Lines */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h4 className="card-title">Líneas del Asiento</h4>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={addLine}
                className="text-sm"
              >
                + Agregar Línea
              </Button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Balance Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Débito</p>
              <p className="text-lg font-semibold text-green-700">
                {formatCurrency(balance.total_debit)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Crédito</p>
              <p className="text-lg font-semibold text-blue-700">
                {formatCurrency(balance.total_credit)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Diferencia</p>
              <p className={`text-lg font-semibold ${
                balance.is_balanced ? 'text-green-700' : 'text-red-700'
              }`}>
                {formatCurrency(Math.abs(balance.difference))}
              </p>
            </div>
          </div>          {/* Lines Table */}
          <div 
            className="overflow-x-auto"
            style={{
              paddingBottom: focusedInput !== null ? '320px' : '0px',
              transition: 'padding-bottom 0.2s ease-in-out'
            }}
          >
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-900">#</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900">Cuenta</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-900">Descripción</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-900">Débito</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-900">Crédito</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>              <tbody>
                {values.lines.map((line, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">
                        <span className="text-sm text-gray-600">{index + 1}</span>
                      </td>                    <td className="py-2 px-3 relative">
                        <div className="relative">                        <Input
                            value={accountSearchTerms[index] || line.account_code || ''}
                            onChange={(e) => {
                              const searchTerm = e.target.value;
                              setAccountSearchTerms(prev => ({ 
                                ...prev, 
                                [index]: searchTerm 
                              }));
                              
                              // Si se está borrando el contenido, limpiar la cuenta seleccionada
                              if (searchTerm === '' && line.account_id) {
                                const newLines = [...values.lines];
                                newLines[index] = {
                                  ...newLines[index],
                                  account_id: '',
                                  account_code: '',
                                  account_name: ''
                                };
                                updateField('lines', newLines);
                              }
                            }}
                            onFocus={() => setFocusedInput(index)}
                            onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
                            placeholder="Escribe para buscar cuenta (código o nombre)..."
                            className="text-sm w-full"
                          />{/* Account dropdown */}
                          {(accountSearchTerms[index] || focusedInput === index) && (
                            <div 
                              className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-auto"
                              style={{
                                width: '450px',
                                maxHeight: '280px',
                                left: '0',
                                top: '100%',
                                marginTop: '4px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                border: '1px solid #e5e7eb'
                              }}
                            >
                              {getFilteredAccounts(accountSearchTerms[index] || '').map((account) => (
                                <div
                                  key={account.id}
                                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                  onClick={() => handleAccountSelect(index, account)}
                                >
                                  <div className="flex flex-col">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">{account.code}</span>
                                      <span className="text-sm font-medium text-gray-900">{account.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">{account.code} - {account.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}                        {/* Selected account display */}
                          {line.account_id && !accountSearchTerms[index] && focusedInput !== index && (
                            <div className="text-xs text-gray-500 mt-1">
                              {line.account_code} - {line.account_name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          value={line.description || ''}
                          onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                          placeholder="Descripción de la línea"
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.debit_amount}
                          onChange={(e) => handleLineChange(index, 'debit_amount', e.target.value)}
                          className="text-sm text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.credit_amount}
                          onChange={(e) => handleLineChange(index, 'credit_amount', e.target.value)}
                          className="text-sm text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex justify-center space-x-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => duplicateLine(index)}
                            className="text-xs"
                            title="Duplicar línea"
                          >
                            📋
                          </Button>
                          {values.lines.length > 2 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="danger"
                              onClick={() => removeLine(index)}
                              className="text-xs"
                              title="Eliminar línea"
                            >
                              🗑️
                            </Button>
                          )}                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {getFieldError('lines') && (
            <div className="mt-4">
              <ValidationMessage type="error" message={getFieldError('lines')!} />
            </div>
          )}
        </div>
      </Card>

      {/* Form Actions */}
      <Card>
        <div className="card-body">
          <div className="flex justify-end space-x-3">            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}            <Button
              type="button"
              disabled={loading || !balance.is_balanced}
              onClick={() => {
                console.log('🔘 Click en botón submit JournalEntry - isEditMode:', isEditMode, 'loading:', loading, 'balanced:', balance.is_balanced);
                handleSubmit();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                isEditMode ? 'Actualizar Asiento' : 'Crear Asiento'
              )}            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
