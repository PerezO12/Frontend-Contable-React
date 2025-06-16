import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useForm } from '../../../shared/hooks/useForm';
import { useJournalEntries, useJournalEntryBalance, useJournalEntry } from '../hooks';
import { usePaymentTermsList } from '../../payment-terms/hooks/usePaymentTerms';
import { useThirdParties } from '../../third-parties/hooks';
import { useCostCenters } from '../../cost-centers/hooks';
import { useAccounts } from '../../accounts/hooks';
import { formatCurrency } from '../../../shared/utils';
import { 
  JournalEntryType,
  type JournalEntryFormData,
  type JournalEntryLineFormData,
  type JournalEntry
} from '../types';

// Tipo extendido para las líneas del formulario de edición
interface ExtendedJournalEntryLineFormData extends JournalEntryLineFormData {
  // Campos enriquecidos adicionales que vienen del backend
  account_code?: string;
  account_name?: string;
  third_party_code?: string;
  third_party_name?: string;
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
  const { thirdParties = [] } = useThirdParties({ is_active: true });  const { costCenters = [] } = useCostCenters({ is_active: true });
  const { accounts = [] } = useAccounts({ is_active: true });
  
  // Hook para operaciones CRUD
  const { updateEntry } = useJournalEntries();  // Estados para búsqueda de cuentas
  const [accountSearchTerms, setAccountSearchTerms] = useState<Record<number, string>>({});
  const [focusedAccountInput, setFocusedAccountInput] = useState<number | null>(null);
  
  // Estados para búsqueda de terceros
  const [thirdPartySearchTerm, setThirdPartySearchTerm] = useState<string>('');
  const [thirdPartyDropdownOpen, setThirdPartyDropdownOpen] = useState<boolean>(false);

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
    }    console.log('📥 [EDIT] Cargando datos del entry existente:', existingEntry);
    console.log('📥 [EDIT] Líneas originales del backend:', existingEntry.lines);
    console.log('📥 [EDIT] Cantidad de líneas:', existingEntry.lines?.length);

    // Extraer datos generales de la primera línea si existen
    const firstLine = existingEntry.lines?.[0];
    const generalThirdPartyId = firstLine?.third_party_id || '';
    const generalCostCenterId = firstLine?.cost_center_id || '';
    const generalPaymentTermsId = firstLine?.payment_terms_id || '';
    const generalInvoiceDate = firstLine?.invoice_date || '';
    const generalDueDate = firstLine?.due_date || '';

    // Mapear todas las líneas con datos enriquecidos
    const mappedLines: ExtendedJournalEntryLineFormData[] = existingEntry.lines?.map((line: any, index: number) => {
      console.log(`📥 [EDIT] Mapeando línea ${index + 1}:`, {
        account_id: line.account_id,
        account_name: line.account_name,
        product_id: line.product_id,
        product_name: line.product_name,
        payment_schedule: line.payment_schedule?.length || 0
      });

      return {
        // Campos básicos requeridos
        account_id: line.account_id || '',
        debit_amount: String(line.debit_amount) || '0.00',
        credit_amount: String(line.credit_amount) || '0.00',
        description: line.description || '',
        reference: line.reference || '',
        third_party_id: line.third_party_id || '',
        cost_center_id: line.cost_center_id || '',
        payment_terms_id: line.payment_terms_id || '',
        invoice_date: line.invoice_date || '',
        due_date: line.due_date || '',
        product_id: line.product_id || '',
        quantity: line.quantity || '',
        unit_price: line.unit_price || '',
        discount_percentage: line.discount_percentage || '',
        discount_amount: line.discount_amount || '',
        tax_percentage: line.tax_percentage || '',
        tax_amount: line.tax_amount || '',
        
        // Campos enriquecidos adicionales
        account_code: line.account_code || '',
        account_name: line.account_name || '',
        third_party_name: line.third_party_name || '',
        product_name: line.product_name || '',
        payment_schedule: line.payment_schedule || [],
        payment_terms_name: line.payment_terms_name || ''
      };
    }) || [];

    console.log('📥 [EDIT] Líneas mapeadas:', mappedLines.length);
    console.log('📥 [EDIT] Primera línea mapeada:', mappedLines[0]);    const formData: ExtendedJournalEntryFormData = {
      reference: existingEntry.reference || '',
      description: existingEntry.description || '',
      entry_type: existingEntry.entry_type || JournalEntryType.MANUAL,
      entry_date: existingEntry.entry_date || new Date().toISOString().split('T')[0],
      notes: existingEntry.notes || '',
      external_reference: existingEntry.external_reference || '',
      transaction_origin: existingEntry.transaction_origin || undefined,
      third_party_id: generalThirdPartyId,
      cost_center_id: generalCostCenterId,
      payment_terms_id: generalPaymentTermsId,
      invoice_date: generalInvoiceDate,
      due_date: generalDueDate,
      lines: mappedLines
    };

    console.log('📥 [EDIT] Datos finales del formulario:', {
      linesCount: formData.lines.length,
      firstLineName: formData.lines[0]?.account_name,
      firstLineProduct: formData.lines[0]?.product_name
    });

    return formData;
  }, [existingEntry, loadingEntry, paymentTerms]);

  // Validación simple para edición
  const formValidate = useCallback((data: ExtendedJournalEntryFormData) => {
    console.log('🔍 [EDIT] Validando datos:', data);
    const errors: any[] = [];
    
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

    try {      const updateData = {
        id: entryId,
        entry_date: formData.entry_date,
        reference: formData.reference?.trim() || '',
        description: formData.description?.trim() || '',
        entry_type: formData.entry_type || JournalEntryType.MANUAL,
        transaction_origin: formData.transaction_origin || undefined,
        notes: formData.notes?.trim() || '',        lines: formData.lines
          .filter(line => line.account_id && 
            (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0))
          .map(line => ({
            account_id: line.account_id,            description: line.description?.trim() || formData.description?.trim() || '',
            debit_amount: parseFloat(line.debit_amount),
            credit_amount: parseFloat(line.credit_amount),
            third_party_id: line.third_party_id || formData.third_party_id || undefined,
            cost_center_id: line.cost_center_id || formData.cost_center_id || undefined,
            reference: line.reference?.trim() || undefined,
            product_id: line.product_id || undefined,            quantity: line.quantity || undefined,
            unit_price: line.unit_price || undefined,
            discount_percentage: line.discount_percentage || undefined,
            discount_amount: line.discount_amount || undefined,
            tax_percentage: line.tax_percentage || undefined,
            tax_amount: line.tax_amount || undefined,
            // Campos de payment terms con lógica condicional para evitar conflictos
            invoice_date: (formData.payment_terms_id && formData.invoice_date) ? formData.invoice_date : undefined,
            due_date: (!formData.payment_terms_id && formData.due_date) ? formData.due_date : undefined,
            payment_terms_id: formData.payment_terms_id || undefined
          }))
          // Filtrar campos undefined/null/empty para evitar enviarlos al backend
          .map(line => {
            const cleanLine: any = { ...line };
            Object.keys(cleanLine).forEach(key => {
              if (cleanLine[key] === undefined || 
                  cleanLine[key] === '' || 
                  cleanLine[key] === null) {
                delete cleanLine[key];
              }
            });
            console.log('🧼 [EDIT] Línea limpia:', cleanLine);
            return cleanLine;
          })
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
    isSubmitting
  } = useForm<ExtendedJournalEntryFormData>({
    initialData: initialFormData,
    validate: formValidate,
    onSubmit: formOnSubmit  });  // Funciones para manejar las líneas
  const addLine = useCallback(() => {
    const newLine: ExtendedJournalEntryLineFormData = {
      account_id: '',
      account_code: '',
      account_name: '',
      debit_amount: '0.00',
      credit_amount: '0.00',
      description: '',
      reference: '',
      third_party_id: values.third_party_id || '',
      cost_center_id: values.cost_center_id || '',
      payment_terms_id: values.payment_terms_id || '',
      invoice_date: values.invoice_date || '',
      due_date: values.due_date || '',
      product_id: '',
      quantity: '',
      unit_price: '',
      discount_percentage: '',
      discount_amount: '',
      tax_percentage: '',
      tax_amount: ''
    };
    
    updateField('lines', [...values.lines, newLine]);
  }, [values.lines, values.third_party_id, values.cost_center_id, values.payment_terms_id, values.invoice_date, values.due_date, updateField]);

  const removeLine = useCallback((index: number) => {
    if (values.lines.length > 2) { // Mantener al menos 2 líneas
      const newLines = values.lines.filter((_, i) => i !== index);
      updateField('lines', newLines);
    }
  }, [values.lines, updateField]);  const updateLine = useCallback((index: number, field: keyof ExtendedJournalEntryLineFormData, value: string) => {
    const newLines = [...values.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    updateField('lines', newLines);
  }, [values.lines, updateField]);

  // Función para filtrar cuentas
  const getFilteredAccounts = useCallback((searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 1) return accounts.slice(0, 10);
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return accounts
      .filter(account => 
        account.name.toLowerCase().includes(lowerSearchTerm) ||
        account.code.toLowerCase().includes(lowerSearchTerm)
      )
      .slice(0, 10);
  }, [accounts]);

  // Función para filtrar terceros
  const getFilteredThirdParties = useCallback((searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) return []; // Solo buscar con al menos 2 caracteres
    
    const term = searchTerm.toLowerCase();
    return thirdParties
      .filter(thirdParty => 
        (thirdParty.code && thirdParty.code.toLowerCase().includes(term)) ||
        thirdParty.name.toLowerCase().includes(term) ||
        (thirdParty.document_number && thirdParty.document_number.toLowerCase().includes(term))
      )
      .slice(0, 20);
  }, [thirdParties]);

  // Función para manejar selección de cuenta
  const handleAccountSelect = useCallback((lineIndex: number, account: any) => {
    updateLine(lineIndex, 'account_id', account.id);
    updateLine(lineIndex, 'account_code', account.code);
    updateLine(lineIndex, 'account_name', account.name);
    
    // Limpiar término de búsqueda y cerrar dropdown
    setAccountSearchTerms(prev => {
      const newTerms = { ...prev };
      delete newTerms[lineIndex];
      return newTerms;
    });
    setFocusedAccountInput(null);
  }, [updateLine]);
  // Función para propagar cambios generales a las líneas
  const propagateGeneralFieldsToLines = useCallback((updatedValues: ExtendedJournalEntryFormData) => {
    const updatedLines = updatedValues.lines.map(line => ({
      ...line,
      third_party_id: line.third_party_id || updatedValues.third_party_id || '',
      cost_center_id: line.cost_center_id || updatedValues.cost_center_id || '',
      // Manejo especial para payment terms con limpieza de conflictos
      payment_terms_id: updatedValues.payment_terms_id ? updatedValues.payment_terms_id : undefined,
      invoice_date: updatedValues.payment_terms_id && updatedValues.invoice_date ? updatedValues.invoice_date : undefined,
      due_date: !updatedValues.payment_terms_id && updatedValues.due_date ? updatedValues.due_date : undefined,
    }));
    
    return { ...updatedValues, lines: updatedLines };
  }, []);// Wrapper para updateField que propaga campos generales
  const updateFieldWithPropagation = useCallback((field: keyof ExtendedJournalEntryFormData, value: any) => {
    const updatedValues = { ...values, [field]: value };    // Lógica de limpieza automática para términos de pago
    if (field === 'payment_terms_id' && value) {
      // Al seleccionar términos de pago, limpiar fecha de vencimiento manual
      updatedValues.due_date = '';
    } else if (field === 'due_date' && value) {
      // Al establecer fecha de vencimiento manual, limpiar términos de pago e invoice_date
      updatedValues.payment_terms_id = '';
      updatedValues.invoice_date = '';
    }
    
    // Si es un campo general que afecta las líneas, propagar
    if (['third_party_id', 'cost_center_id', 'payment_terms_id', 'invoice_date', 'due_date'].includes(field as string)) {
      const finalValues = propagateGeneralFieldsToLines(updatedValues);
      updateField('lines', finalValues.lines);      // Si se limpiaron campos por la lógica automática, actualizar también esos campos
      if (field === 'payment_terms_id' && value) {
        updateField('due_date', '');
      } else if (field === 'due_date' && value) {
        updateField('payment_terms_id', '');
        updateField('invoice_date', '');
      }
    }
    
    updateField(field, value);
  }, [values, updateField, propagateGeneralFieldsToLines]);

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
            disabled={isSubmitting || !balance.isBalanced}
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
          </div>        </Card>

        {/* Datos Generales - Términos de Pago */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Datos Generales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tercero
              </label>              <div className="relative">
                <Input
                  value={thirdPartySearchTerm || (() => {
                    const selectedThirdParty = thirdParties.find(tp => tp.id === values.third_party_id);
                    return selectedThirdParty 
                      ? (selectedThirdParty.code 
                          ? `${selectedThirdParty.code} - ${selectedThirdParty.name}` 
                          : `${selectedThirdParty.document_number} - ${selectedThirdParty.name}`)
                      : '';
                  })()}
                  onChange={(e) => {
                    const searchTerm = e.target.value;
                    setThirdPartySearchTerm(searchTerm);
                    setThirdPartyDropdownOpen(searchTerm.length >= 2);
                    
                    // Si borra el texto completamente, limpiar la selección
                    if (searchTerm === '') {
                      updateFieldWithPropagation('third_party_id', '');
                    }
                  }}
                  onFocus={() => {
                    setThirdPartyDropdownOpen(thirdPartySearchTerm.length >= 2);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setThirdPartyDropdownOpen(false);
                      // Si no hay selección, limpiar el término
                      if (!values.third_party_id) {
                        setThirdPartySearchTerm('');
                      }
                    }, 200);
                  }}
                  placeholder="Buscar por código, nombre o documento..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {thirdPartyDropdownOpen && getFilteredThirdParties(thirdPartySearchTerm).length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {getFilteredThirdParties(thirdPartySearchTerm).map(thirdParty => (
                      <div
                        key={thirdParty.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          updateFieldWithPropagation('third_party_id', thirdParty.id);
                          setThirdPartySearchTerm('');
                          setThirdPartyDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono text-sm text-blue-600">
                              {thirdParty.code || thirdParty.document_number}
                            </span>
                            <span className="ml-2 text-sm text-gray-900">
                              {thirdParty.name}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            thirdParty.third_party_type === 'customer' 
                              ? 'bg-blue-100 text-blue-800' 
                              : thirdParty.third_party_type === 'supplier'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {thirdParty.third_party_type === 'customer' ? 'Cliente' : 
                             thirdParty.third_party_type === 'supplier' ? 'Proveedor' : 
                             thirdParty.third_party_type}
                          </span>
                        </div>
                        {thirdParty.document_number && thirdParty.code && (
                          <div className="text-xs text-gray-500 mt-1">
                            Doc: {thirdParty.document_number}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Se aplicará a todas las líneas del asiento. Escriba al menos 2 caracteres para buscar.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centro de Costo
              </label>              <select
                value={values.cost_center_id || ''}
                onChange={(e) => updateFieldWithPropagation('cost_center_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condiciones de Pago
              </label>              <select
                value={values.payment_terms_id || ''}
                onChange={(e) => updateFieldWithPropagation('payment_terms_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar condiciones...</option>
                {paymentTerms.map(paymentTerm => (
                  <option key={paymentTerm.id} value={paymentTerm.id}>
                    {paymentTerm.code} - {paymentTerm.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                📋 Se calcularán fechas de vencimiento automáticamente
              </p>
            </div>
              <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">🔄 Limpieza automática</span>
              </div>              <div className="text-xs text-gray-600 space-y-1">
                <p>• Seleccionar condiciones de pago limpia la fecha de vencimiento manual</p>
                <p>• Establecer fecha de vencimiento manual limpia las condiciones de pago y fecha de factura</p>
                <p>• Dejar las descripciones de líneas vacías usa la descripción general</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Factura
                {values.payment_terms_id && <span className="text-red-500 ml-1">*</span>}
              </label>                <Input
                  type="date"
                  value={values.invoice_date || ''}
                  onChange={(e) => updateFieldWithPropagation('invoice_date', e.target.value)}
                />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vencimiento
                {!values.payment_terms_id && values.due_date && <span className="text-blue-500 ml-1">(Manual)</span>}
              </label>                <Input
                  type="date"
                  value={values.due_date || ''}
                  onChange={(e) => updateFieldWithPropagation('due_date', e.target.value)}
                  disabled={!!values.payment_terms_id}
                  className={values.payment_terms_id ? 'bg-gray-100' : ''}
                />
              {values.payment_terms_id && (
                <p className="text-xs text-blue-600 mt-1">
                  🔒 Deshabilitado - Se calculará automáticamente según las condiciones de pago
                </p>
              )}
              {!values.payment_terms_id && (
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Al establecer una fecha manual se limpiarán las condiciones de pago
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Resumen de líneas */}
        <Card className="p-6">          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Líneas del Asiento ({values.lines.length})
            </h3>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addLine()}
              >
                + Agregar Línea
              </Button>
            </div>
          </div>          <div className="space-y-4">
            {values.lines.map((line, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Línea {index + 1}
                  </span>
                  {values.lines.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLine(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      × Eliminar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cuenta *
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={accountSearchTerms[index] ?? (line.account_name || line.account_code || '')}
                        onChange={(e) => {
                          const searchTerm = e.target.value;
                          setAccountSearchTerms(prev => ({ 
                            ...prev, 
                            [index]: searchTerm 
                          }));
                          
                          // Si borra el texto completamente, limpiar la selección
                          if (searchTerm === '') {
                            updateLine(index, 'account_id', '');
                            updateLine(index, 'account_code', '');
                            updateLine(index, 'account_name', '');
                          }
                        }}
                        onFocus={() => setFocusedAccountInput(index)}
                        onBlur={() => {
                          setTimeout(() => {
                            setFocusedAccountInput(null);
                            // Si no hay selección, limpiar el término
                            if (!line.account_id) {
                              setAccountSearchTerms(prev => {
                                const newTerms = { ...prev };
                                delete newTerms[index];
                                return newTerms;
                              });
                            }
                          }, 200);
                        }}
                        placeholder={line.account_id ? "Cuenta seleccionada" : "Buscar cuenta por nombre o código..."}
                        className="text-sm"
                      />
                      
                      {/* Dropdown de cuentas */}
                      {(accountSearchTerms[index] || focusedAccountInput === index) && (
                        <div className="absolute z-[9999] mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[320px] max-w-[400px]">
                          {getFilteredAccounts(accountSearchTerms[index] || '').map((account) => (
                            <div
                              key={account.id}
                              className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleAccountSelect(index, account)}
                            >
                              <div className="text-sm font-medium text-gray-900">
                                {account.code} - {account.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Tipo: {account.account_type || 'No especificado'}
                              </div>
                            </div>
                          ))}
                          {getFilteredAccounts(accountSearchTerms[index] || '').length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No se encontraron cuentas
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Mostrar cuenta seleccionada como indicador */}
                      {line.account_id && !accountSearchTerms[index] && focusedAccountInput !== index && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded border border-blue-200 font-medium">
                            📊 {line.account_code} - {line.account_name}
                          </div>
                        </div>
                      )}
                    </div>
                    {line.account_name && (
                      <div className="text-xs text-gray-500 mt-1">
                        {line.account_code} - {line.account_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Descripción
                    </label>
                    <Input
                      type="text"
                      value={line.description}
                      onChange={(e) => updateLine(index, 'description', e.target.value)}
                      placeholder="Descripción de la línea"
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Débito
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.debit_amount}
                      onChange={(e) => updateLine(index, 'debit_amount', e.target.value)}
                      placeholder="0.00"
                      className="text-sm text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Crédito
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.credit_amount}
                      onChange={(e) => updateLine(index, 'credit_amount', e.target.value)}
                      placeholder="0.00"
                      className="text-sm text-right"
                    />
                  </div>
                </div>

                {/* Campos adicionales opcionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Referencia
                    </label>
                    <Input
                      type="text"
                      value={line.reference || ''}
                      onChange={(e) => updateLine(index, 'reference', e.target.value)}
                      placeholder="Referencia de línea"
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tercero
                    </label>
                    <select
                      value={line.third_party_id || ''}
                      onChange={(e) => updateLine(index, 'third_party_id', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Usar tercero general</option>
                      {thirdParties.map(thirdParty => (
                        <option key={thirdParty.id} value={thirdParty.id}>
                          {thirdParty.code} - {thirdParty.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Centro de Costo
                    </label>
                    <select
                      value={line.cost_center_id || ''}
                      onChange={(e) => updateLine(index, 'cost_center_id', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Usar centro general</option>
                      {costCenters.map(costCenter => (
                        <option key={costCenter.id} value={costCenter.id}>
                          {costCenter.code} - {costCenter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mostrar información enriquecida si existe (solo lectura) */}
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
        </Card>
      </form>
    </div>
  );
};
