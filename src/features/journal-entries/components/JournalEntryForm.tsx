import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useForm } from '../../../shared/hooks/useForm';
import { useJournalEntries, useJournalEntryBalance, useJournalEntry } from '../hooks';
import { useAccounts } from '../../accounts/hooks';
import { useThirdParties } from '../../third-parties/hooks';
import { useCostCenters } from '../../cost-centers/hooks';
import { useProducts } from '../../products/hooks';
import { usePaymentTermsList, usePaymentTermById } from '../../payment-terms/hooks/usePaymentTerms';
import { useJournalEntryPaymentTerms } from '../hooks/useJournalEntryPaymentTerms';
import { formatCurrency } from '../../../shared/utils';
import { 
  journalEntryCreateSchema,
  JournalEntryType,
  JOURNAL_ENTRY_TYPE_LABELS,
  TransactionOrigin,
  TransactionOriginLabels,
  getTransactionOriginColor,
  type JournalEntryFormData,
  type JournalEntryLineFormData,
  type JournalEntry,
  type JournalEntryBackend,
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
  // Estabilizar filtros para evitar bucles infinitos
  const accountFilters = useMemo(() => ({ is_active: true }), []);
  const thirdPartyFilters = useMemo(() => ({ is_active: true }), []);
  const costCenterFilters = useMemo(() => ({ is_active: true }), []);
  const paymentTermsOptions = useMemo(() => ({ 
    autoLoad: true,
    initialFilters: { is_active: true }
  }), []);
  const { createEntry, updateEntry, loading } = useJournalEntries();
  const { accounts } = useAccounts(accountFilters);
  const { thirdParties } = useThirdParties(thirdPartyFilters);
  const { costCenters } = useCostCenters(costCenterFilters);
  const { products } = useProducts({ is_active: true });
  const { paymentTerms } = usePaymentTermsList(paymentTermsOptions);  const { 
    getPaymentTermById   } = usePaymentTermById();
  
  const {
    calculating: calculatingSchedule,
    error: scheduleError,
    clearError: clearScheduleError  } = useJournalEntryPaymentTerms();  const [accountSearchTerms, setAccountSearchTerms] = useState<Record<number, string>>({});
  const [productSearchTerms, setProductSearchTerms] = useState<Record<number, string>>({});
  const [thirdPartySearchTerm, setThirdPartySearchTerm] = useState<string>('');
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [focusedInvoiceInput, setFocusedInvoiceInput] = useState<number | null>(null);  const [focusedProductInput, setFocusedProductInput] = useState<number | null>(null);  const [productDropdownOpen, setProductDropdownOpen] = useState<Record<number, boolean>>({});
  const [thirdPartyDropdownOpen, setThirdPartyDropdownOpen] = useState<boolean>(false);  
  // Estados separados para cada sección
  const hasOpenInvoiceDropdowns = Object.values(productDropdownOpen).some(isOpen => isOpen) || focusedInvoiceInput !== null;
  const hasOpenAccountDropdowns = focusedInput !== null;
  
  const [draftKey] = useState(`journal-entry-draft-${Date.now()}`); // Clave única para esta sesión
  const [entryPaymentSchedule, setEntryPaymentSchedule] = useState<PaymentScheduleItem[]>([]);
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
  // 🆕 Estado separado para líneas de factura (productos)
  const [invoiceLines, setInvoiceLines] = useState<Array<{
    id?: string;
    product_id: string;
    product_name: string;
    product_code: string;
    account_id: string;
    account_code: string;
    account_name: string;
    quantity: string;
    unit_price: string;
    discount_percentage?: string;
    tax_percentage?: string;
    total: number;
  }>>([{
    product_id: '',
    product_name: '',
    product_code: '',
    account_id: '',
    account_code: '',
    account_name: '',
    quantity: '1',
    unit_price: '0.00',
    total: 0
  }]);

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
    transaction_origin: initialData?.transaction_origin,
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
  }), [initialData]);// Cargar datos del entry existente cuando se está editando
  const { entry: existingEntry, loading: loadingEntry } = entryId 
    ? useJournalEntry(entryId) 
    : { entry: null, loading: false };  // Actualizar initialFormData cuando se cargan los datos del entry existente
  const finalInitialData = useMemo(() => {
    // Dar prioridad a los datos existentes del backend en modo edición
    if (isEditMode && existingEntry) {
      console.log('📥 Cargando datos del entry existente desde backend:', existingEntry);
      console.log('📋 Payment terms disponibles:', paymentTerms);
      
      // Obtener los valores efectivos de la primera línea para los campos de payment terms
      const firstLine = existingEntry.lines?.[0];
      const effectiveInvoiceDate = firstLine?.effective_invoice_date || firstLine?.invoice_date || '';
      const effectiveDueDate = firstLine?.effective_due_date || firstLine?.due_date || '';
        // Si hay payment_terms_code, intentar encontrar el payment_terms_id correspondiente
      let paymentTermsId = firstLine?.payment_terms_id || '';
      if (!paymentTermsId && firstLine?.payment_terms_code && paymentTerms.length > 0) {
        const foundPaymentTerm = paymentTerms.find(pt => pt.code === firstLine.payment_terms_code);
        if (foundPaymentTerm) {
          paymentTermsId = foundPaymentTerm.id;
        }
      }
      
      return {
        reference: existingEntry.reference || '',
        description: existingEntry.description || '',
        entry_type: existingEntry.entry_type || JournalEntryType.MANUAL,
        entry_date: existingEntry.entry_date || new Date().toISOString().split('T')[0],
        notes: existingEntry.notes || '',
        external_reference: existingEntry.external_reference || '',
        // Campos de payment terms a nivel de asiento (usar valores efectivos)
        third_party_id: firstLine?.third_party_id || '',
        cost_center_id: firstLine?.cost_center_id || '',
        payment_terms_id: paymentTermsId,
        invoice_date: effectiveInvoiceDate,
        due_date: effectiveDueDate,
        lines: existingEntry.lines?.map((line: any) => {
          // Para cada línea, usar también los valores efectivos
          const lineEffectiveInvoiceDate = line.effective_invoice_date || line.invoice_date || '';
          const lineEffectiveDueDate = line.effective_due_date || line.due_date || '';
          
          // Buscar payment_terms_id por código si no está presente
          let linePaymentTermsId = line.payment_terms_id || '';
          if (!linePaymentTermsId && line.payment_terms_code && paymentTerms.length > 0) {
            const foundPaymentTerm = paymentTerms.find(pt => pt.code === line.payment_terms_code);
            if (foundPaymentTerm) {
              linePaymentTermsId = foundPaymentTerm.id;
            }
          }
          
          return {
            account_id: line.account_id || '',
            account_code: line.account_code || '',
            account_name: line.account_name || '',
            debit_amount: String(line.debit_amount) || '0.00',
            credit_amount: String(line.credit_amount) || '0.00',
            description: line.description || '',
            reference: line.reference || '',
            third_party_id: line.third_party_id || '',
            cost_center_id: line.cost_center_id || '',
            payment_terms_id: linePaymentTermsId,
            invoice_date: lineEffectiveInvoiceDate,
            due_date: lineEffectiveDueDate
          };
        }) || [
          { account_id: '', debit_amount: '0.00', credit_amount: '0.00', description: '' },
          { account_id: '', debit_amount: '0.00', credit_amount: '0.00', description: '' }
        ]
      };
    }
    // Fallback a initialData si está disponible, o datos por defecto
    return initialFormData;
  }, [isEditMode, existingEntry, initialFormData, paymentTerms]);
  const formValidate = useCallback((data: JournalEntryFormData) => {
    console.log('🔍 Validando datos en modo:', isEditMode ? 'edición' : 'creación');
    console.log('🔍 Datos a validar:', data);
    
    // Primero, propagar campos globales a las líneas para validación
    const dataWithPropagatedFields = {
      ...data,
      lines: data.lines.map(line => ({
        ...line,
        // Propagar payment_terms_id e invoice_date si no están especificados en la línea
        payment_terms_id: line.payment_terms_id || data.payment_terms_id || '',
        invoice_date: line.invoice_date || data.invoice_date || '',
        due_date: line.due_date || data.due_date || '',
      }))
    };
    
    if (isEditMode) {
      // Para modo edición, hacer validaciones básicas sin schema estricto
      const errors: any[] = [];
      
      // Validar descripción si está presente
      if (dataWithPropagatedFields.description && dataWithPropagatedFields.description.length < 3) {
        errors.push({
          field: 'description',
          message: 'La descripción debe tener al menos 3 caracteres'
        });
      }
      
      // Validar fecha si está presente
      if (dataWithPropagatedFields.entry_date && isNaN(Date.parse(dataWithPropagatedFields.entry_date))) {
        errors.push({
          field: 'entry_date',
          message: 'Fecha inválida'
        });
      }
      
      // Validar líneas básicamente
      if (dataWithPropagatedFields.lines && dataWithPropagatedFields.lines.length < 2) {
        errors.push({
          field: 'lines',
          message: 'Un asiento debe tener al menos 2 líneas'
        });
      }
      
      console.log('🔍 Errores de validación manual:', errors);
      return errors;
    } else {
      // Para modo creación, usar schema de creación con datos propagados
      const result = journalEntryCreateSchema.safeParse(dataWithPropagatedFields);
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
  }, [isEditMode]);  const formOnSubmit = useCallback(async (formData: JournalEntryFormData) => {
    console.log('🚀 JournalEntry onSubmit ejecutado con:', {
      isEditMode,
      entryId,
      formData
    });    // IMPORTANTE: Propagar campos globales a las líneas ANTES de procesar
    // Esto asegura que la validación vea los datos correctos
    const dataWithPropagatedFields = {
      ...formData,
      lines: formData.lines.map(line => ({
        ...line,        // Propagar campos, pero convertir cadenas vacías a undefined para evitar errores de validación UUID
        // REGLA: Si hay due_date manual, NO enviar invoice_date ni payment_terms_id
        payment_terms_id: (line.due_date || formData.due_date) ? undefined : 
          (line.payment_terms_id && line.payment_terms_id !== '') 
            ? line.payment_terms_id 
            : (formData.payment_terms_id && formData.payment_terms_id !== '') 
              ? formData.payment_terms_id 
              : undefined,
        invoice_date: (line.due_date || formData.due_date) ? undefined :
          (line.invoice_date && line.invoice_date !== '') 
            ? line.invoice_date 
            : (formData.invoice_date && formData.invoice_date !== '') 
              ? formData.invoice_date 
              : undefined,
        due_date: (line.due_date && line.due_date !== '') 
          ? line.due_date 
          : (formData.due_date && formData.due_date !== '') 
            ? formData.due_date 
            : undefined,
        third_party_id: (line.third_party_id && line.third_party_id !== '') 
          ? line.third_party_id 
          : (formData.third_party_id && formData.third_party_id !== '') 
            ? formData.third_party_id 
            : undefined,
        cost_center_id: (line.cost_center_id && line.cost_center_id !== '') 
          ? line.cost_center_id 
          : (formData.cost_center_id && formData.cost_center_id !== '') 
            ? formData.cost_center_id 
            : undefined,
        product_id: (line.product_id && line.product_id !== '') 
          ? line.product_id 
          : undefined
      }))
    };

    console.log('📋 Datos con campos propagados:', dataWithPropagatedFields);

    // Preparar las líneas con conversión de tipos y propagación de campos
    const enhancedLines = dataWithPropagatedFields.lines
      .filter(line => line.account_id && 
        (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0))
      .map(line => ({
        account_id: line.account_id,
        // Si la línea no tiene descripción, usar la descripción general del asiento
        description: line.description?.trim() || formData.description,
        // Convertir amounts a números como espera el backend
        debit_amount: parseFloat(line.debit_amount) || 0,
        credit_amount: parseFloat(line.credit_amount) || 0,        // Propagar third_party_id y cost_center_id del asiento a todas las líneas si no están especificados
        third_party_id: (line.third_party_id && line.third_party_id !== '') 
          ? line.third_party_id 
          : (formData.third_party_id && formData.third_party_id !== '') 
            ? formData.third_party_id 
            : undefined,
        cost_center_id: (line.cost_center_id && line.cost_center_id !== '') 
          ? line.cost_center_id 
          : (formData.cost_center_id && formData.cost_center_id !== '') 
            ? formData.cost_center_id 
            : undefined,
        reference: line.reference || undefined,
        
        // Campos de productos - convertir a números
        product_id: line.product_id || undefined,
        quantity: line.quantity ? parseFloat(line.quantity) : undefined,
        unit_price: line.unit_price ? parseFloat(line.unit_price) : undefined,
        discount_percentage: line.discount_percentage ? parseFloat(line.discount_percentage) : undefined,
        discount_amount: line.discount_amount ? parseFloat(line.discount_amount) : undefined,
        tax_percentage: line.tax_percentage ? parseFloat(line.tax_percentage) : undefined,
        tax_amount: line.tax_amount ? parseFloat(line.tax_amount) : undefined,
        
        // Campos de payment terms - usar los ya propagados correctamente
        payment_terms_id: line.payment_terms_id,
        invoice_date: line.invoice_date,
        due_date: line.due_date
      }))// Filtrar campos undefined para evitar enviarlos al backend
      .map(line => {
        const cleanLine: any = { ...line };
        Object.keys(cleanLine).forEach(key => {
          if (cleanLine[key] === undefined || 
              cleanLine[key] === '' || 
              cleanLine[key] === null) {
            delete cleanLine[key];
          }
        });
        console.log('🧼 Línea limpia:', cleanLine);
        return cleanLine;
      });    // Estructura que espera el backend
    const submitData: JournalEntryBackend = {
      entry_date: dataWithPropagatedFields.entry_date,
      reference: dataWithPropagatedFields.reference || undefined,
      description: dataWithPropagatedFields.description,
      entry_type: dataWithPropagatedFields.entry_type,
      transaction_origin: dataWithPropagatedFields.transaction_origin || undefined,
      notes: dataWithPropagatedFields.notes || undefined,
      lines: enhancedLines
    };

    console.log('📤 Datos que se enviarán al backend (formato correcto):', submitData);

    if (isEditMode && entryId) {
      // Para actualizaciones, necesitamos mantener el formato original del servicio
      const updateData = {
        id: entryId,
        ...dataWithPropagatedFields,
        lines: dataWithPropagatedFields.lines
          .filter(line => line.account_id && 
            (parseFloat(line.debit_amount) > 0 || parseFloat(line.credit_amount) > 0))
          .map(line => ({
            ...line,
            third_party_id: line.third_party_id || dataWithPropagatedFields.third_party_id || undefined,
            cost_center_id: line.cost_center_id || dataWithPropagatedFields.cost_center_id || undefined
          }))
      };
      const result = await updateEntry(entryId, updateData);
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
      // Para creación, usamos el formato del backend
      const result = await createEntry(submitData as any);
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
    initialData: finalInitialData,
    validate: formValidate,
    onSubmit: formOnSubmit
  });

  // Log para depurar datos del formulario
  useEffect(() => {
    console.log('🔄 useForm inicializado/actualizado con:', {
      isEditMode,
      entryId,
      hasExistingEntry: !!existingEntry,
      hasInitialData: !!initialData,
      finalInitialData,
      currentValues: values
    });
  }, [isEditMode, entryId, existingEntry, initialData, finalInitialData, values]);  // Balance validation hook
  const balance = useJournalEntryBalance(values.lines);  // Memoize calculation function to avoid re-creating it on every render
  const calculateEntryPaymentSchedule = useCallback(async () => {
    // Calcular total de líneas de factura
    const invoiceTotal = invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0);
    
    console.log('🔍 Calculando cronograma de pagos localmente:', {
      payment_terms_id: values.payment_terms_id,
      invoice_date: values.invoice_date,
      invoiceTotal,
      invoiceLines: invoiceLines.length,
      hasConditions: values.payment_terms_id && values.invoice_date && invoiceTotal > 0
    });
    
    if (values.payment_terms_id && values.invoice_date && invoiceTotal > 0) {
      try {        clearScheduleError();
        
        // Obtener el payment term completo por ID
        console.log('📞 Obteniendo payment term por ID:', values.payment_terms_id);
        const selectedPaymentTerm = await getPaymentTermById(values.payment_terms_id);
        
        console.log('📋 Payment term obtenido por ID:', selectedPaymentTerm);
        console.log('📋 Payment term payment_schedules:', selectedPaymentTerm.payment_schedules);
        
        const schedules = selectedPaymentTerm.payment_schedules || [];
        
        if (schedules.length === 0) {
          console.log('⚠️ Payment term no tiene cronogramas definidos - es de fecha simple');
          setEntryPaymentSchedule([]);
          setShowPaymentSchedule(false);
          return;
        }
        
        // Verificar que los porcentajes sumen 100%
        const totalPercentage = schedules.reduce((sum, ps) => sum + ps.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
          console.warn(`⚠️ Los porcentajes no suman 100% (suma actual: ${totalPercentage}%)`);
        }
        
        // Calcular cronograma localmente (igual que en PaymentTermsPage)
        const invoiceDate = new Date(values.invoice_date);
        const schedule: PaymentScheduleItem[] = schedules.map((ps) => {
          const paymentDate = new Date(invoiceDate);
          paymentDate.setDate(paymentDate.getDate() + ps.days);
          
          // Calcular monto exacto considerando redondeo
          const scheduleAmount = Math.round((invoiceTotal * ps.percentage / 100) * 100) / 100;
          
          return {
            sequence: ps.sequence,
            days: ps.days,
            percentage: ps.percentage,
            amount: scheduleAmount,
            payment_date: paymentDate.toISOString().split('T')[0],
            description: ps.description || `Cuota ${ps.sequence}`
          };
        });
        
        // Verificar que la suma de montos coincida con el total (ajustar redondeo si es necesario)
        const calculatedTotal = schedule.reduce((sum, item) => sum + item.amount, 0);
        const difference = invoiceTotal - calculatedTotal;
        
        if (Math.abs(difference) > 0.01) {
          // Ajustar la diferencia en la última cuota
          const lastIndex = schedule.length - 1;
          schedule[lastIndex].amount = Math.round((schedule[lastIndex].amount + difference) * 100) / 100;
          console.info(`✅ Ajuste de redondeo aplicado: ${difference.toFixed(2)} en la última cuota`);
        }

        console.log('� Cronograma calculado localmente:', {
          paymentTermsName: selectedPaymentTerm.name,
          invoiceDate: values.invoice_date,
          totalAmount: invoiceTotal,
          schedulesCount: schedule.length,
          calculatedTotal: schedule.reduce((sum, item) => sum + item.amount, 0),
          schedule
        });
        
        setEntryPaymentSchedule(schedule);
        setShowPaymentSchedule(true);
        
        console.log('✅ Estado actualizado - showPaymentSchedule: true, items:', schedule.length);
      } catch (error) {
        console.error('❌ Error calculating entry payment schedule:', error);
        setEntryPaymentSchedule([]);
        setShowPaymentSchedule(false);
      }
    } else {
      console.log('⚠️ No se cumplieron las condiciones para calcular cronograma');
      setEntryPaymentSchedule([]);
      setShowPaymentSchedule(false);
    }
  }, [values.payment_terms_id, values.invoice_date, invoiceLines, getPaymentTermById, clearScheduleError]);

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
  }, [accounts]);

  // Filter third parties for autocomplete
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

  // Función para filtrar productos por nombre
  const getFilteredProducts = useCallback((searchTerm: string) => {
    if (!searchTerm) return products.slice(0, 20);
    
    const term = searchTerm.toLowerCase();
    return products
      .filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.code && product.code.toLowerCase().includes(term))
      )
      .slice(0, 20);
  }, [products]);  // Memoize event handlers to avoid recreating them on every render
  const handleInputChange = useCallback((field: keyof JournalEntryFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      
      // Lógica de limpieza para evitar conflictos entre payment terms y due_date manual
      if (field === 'payment_terms_id') {
        if (value) {
          // Si se selecciona payment terms, limpiar due_date manual
          updateField('due_date', '');
          console.log('🧹 Limpiando due_date porque se seleccionó payment_terms_id');
        } else {
          // Si se deselecciona payment terms, limpiar invoice_date también
          updateField('invoice_date', '');
          console.log('🧹 Limpiando invoice_date porque se deseleccionó payment_terms_id');
        }
      }      // Si se establece due_date manual, limpiar payment_terms_id e invoice_date
      if (field === 'due_date' && value) {
        updateField('payment_terms_id', '');
        updateField('invoice_date', '');
        console.log('🧹 Limpiando payment_terms_id e invoice_date porque se estableció due_date manual');
      }
      
      // Si se establece invoice_date sin payment_terms_id, es inconsistente
      if (field === 'invoice_date' && value && !values.payment_terms_id) {
        console.log('⚠️ Se estableció invoice_date sin payment_terms_id, esto puede causar inconsistencias');
      }
      
      updateField(field, value);
      clearErrors();
    }, [updateField, clearErrors, values.payment_terms_id]);

  // Función para actualizar automáticamente los montos de líneas basado en productos
  const updateLineAmountsFromProducts = useCallback(() => {
    if (!values.transaction_origin) return;

    const updatedLines = values.lines.map((line, index) => {
      // Solo procesar líneas que tienen producto y cantidad, pero montos en cero
      if (!line.product_id || !line.quantity || !line.unit_price) {
        return line;
      }

      const currentDebit = parseFloat(line.debit_amount || '0');
      const currentCredit = parseFloat(line.credit_amount || '0');
      
      // Solo actualizar si ambos montos están en cero
      if (currentDebit !== 0 || currentCredit !== 0) {
        return line;
      }

      try {
        // Calcular el monto total del producto
        const quantity = parseFloat(line.quantity);
        const unitPrice = parseFloat(line.unit_price);
        let totalAmount = quantity * unitPrice;

        // Aplicar descuentos si existen
        if (line.discount_amount) {
          totalAmount -= parseFloat(line.discount_amount);
        } else if (line.discount_percentage) {
          const discountAmount = (totalAmount * parseFloat(line.discount_percentage)) / 100;
          totalAmount -= discountAmount;
        }

        // Asegurar que el monto no sea negativo
        totalAmount = Math.max(0, totalAmount);
        const formattedAmount = totalAmount.toFixed(2);

        // Lógica mejorada para determinar débito vs crédito
        let isDebit = false;
        
        // Primero, intentar determinar por el tipo de cuenta si está disponible
        const accountCode = line.account_code?.toString() || '';
        
        if (accountCode) {
          // Lógica basada en el primer dígito del código de cuenta (plan contable colombiano)
          const firstDigit = accountCode.charAt(0);
          
          switch (firstDigit) {
            case '1': // Activos
            case '5': // Gastos
            case '6': // Costos
              isDebit = true;
              break;
            case '2': // Pasivos
            case '3': // Patrimonio
            case '4': // Ingresos
              isDebit = false;
              break;
            default:
              // Si no se puede determinar por cuenta, usar origen de transacción
              break;
          }
        }
        
        // Si no se pudo determinar por cuenta, usar origen de transacción
        if (accountCode === '' || !['1', '2', '3', '4', '5', '6'].includes(accountCode.charAt(0))) {
          switch (values.transaction_origin) {
            case TransactionOrigin.SALE:
              // En ventas, los productos generalmente van a cuentas de ingreso (crédito)
              // A menos que sea inventario o costo de ventas
              isDebit = accountCode.startsWith('1') || accountCode.startsWith('6'); // Inventario o costos
              break;
            case TransactionOrigin.PURCHASE:
              // En compras, los productos van a inventario (débito) o gastos (débito)
              isDebit = true;
              break;
            case TransactionOrigin.ADJUSTMENT:
              // En ajustes, depende del contexto, por defecto débito para aumentos
              isDebit = true;
              break;
            case TransactionOrigin.TRANSFER:
              // En transferencias, depende del contexto
              isDebit = true;
              break;
            default:
              // Por defecto, usar débito
              isDebit = true;
              break;
          }
        }

        console.log(`🔄 Auto-actualizando línea ${index + 1}:`, {
          product_id: line.product_id,
          account_code: accountCode,
          quantity,
          unitPrice,
          totalAmount,
          isDebit,
          transaction_origin: values.transaction_origin,
          reasoning: accountCode ? `Basado en cuenta ${accountCode}` : `Basado en origen ${values.transaction_origin}`
        });

        return {
          ...line,
          debit_amount: isDebit ? formattedAmount : '0.00',
          credit_amount: isDebit ? '0.00' : formattedAmount
        };

      } catch (error) {
        console.error(`Error calculando monto para línea ${index + 1}:`, error);
        return line;
      }
    });

    // Solo actualizar si hay cambios reales
    const hasChanges = updatedLines.some((line, index) => {
      const originalLine = values.lines[index];
      return line.debit_amount !== originalLine.debit_amount ||
             line.credit_amount !== originalLine.credit_amount;
    });

    if (hasChanges) {
      console.log('💰 Aplicando actualización automática de montos basada en productos');
      updateField('lines', updatedLines);
    }  }, [values.lines, values.transaction_origin, updateField]);
  // Función para auto-balancear el asiento agregando una línea de ajuste
  const autoBalanceEntry = useCallback(() => {
    if (balance.is_balanced || Math.abs(balance.difference) < 0.01) {
      return; // Ya está balanceado
    }

    const difference = balance.difference;
    const isDebitAdjustment = difference < 0; // Si créditos > débitos, necesitamos débito
    
    // Descripción sugerida según el contexto
    let adjustmentDescription = '';

    switch (values.transaction_origin) {
      case TransactionOrigin.SALE:
        adjustmentDescription = isDebitAdjustment 
          ? 'Ajuste ventas - débito'
          : 'Ajuste ventas - crédito';
        break;
      case TransactionOrigin.PURCHASE:
        adjustmentDescription = isDebitAdjustment 
          ? 'Ajuste compras - débito'
          : 'Ajuste compras - crédito';
        break;
      default:
        adjustmentDescription = isDebitAdjustment 
          ? 'Ajuste contable - débito'
          : 'Ajuste contable - crédito';
        break;
    }
    
    // Crear nueva línea de ajuste sin cuenta predefinida
    const adjustmentLine: JournalEntryLineFormData = {
      account_id: '',
      account_code: '',
      account_name: '',
      debit_amount: isDebitAdjustment ? Math.abs(difference).toFixed(2) : '0.00',
      credit_amount: isDebitAdjustment ? '0.00' : Math.abs(difference).toFixed(2),
      description: adjustmentDescription
    };

    // Agregar la línea al final
    const newLines = [...values.lines, adjustmentLine];
    updateField('lines', newLines);

    console.log('⚖️ Línea de auto-balance agregada:', {
      difference,
      isDebitAdjustment,
      amount: Math.abs(difference).toFixed(2),
      description: adjustmentDescription
    });
  }, [balance, values.lines, values.transaction_origin, updateField]);

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

    // Solo activar actualización automática para product_id, no para quantity o unit_price
    // porque esos se manejan mejor desde el componente ProductLine
    if (field === 'product_id') {
      // Ejecutar actualización automática después de un breve delay
      setTimeout(() => {
        updateLineAmountsFromProducts();
      }, 200);
    }  }, [values.lines, updateField, clearErrors, updateLineAmountsFromProducts]);

  // 🆕 Funciones para manejar líneas de factura (productos)
  const addInvoiceLine = useCallback(() => {
    const newLine = {
      product_id: '',
      product_name: '',
      product_code: '',
      account_id: '',
      account_code: '',
      account_name: '',
      quantity: '1',
      unit_price: '0.00',
      discount_percentage: '0',
      tax_percentage: '0',
      total: 0
    };
    setInvoiceLines(prev => [...prev, newLine]);
  }, []);

  const updateInvoiceLine = useCallback((index: number, field: string, value: string) => {
    setInvoiceLines(prev => {
      const newLines = [...prev];
      newLines[index] = { ...newLines[index], [field]: value };
      
      // Recalcular total si cambia cantidad o precio
      if (field === 'quantity' || field === 'unit_price') {
        const quantity = parseFloat(newLines[index].quantity || '0');
        const unitPrice = parseFloat(newLines[index].unit_price || '0');
        newLines[index].total = quantity * unitPrice;
      }
      
      return newLines;
    });
  }, []);

  const removeInvoiceLine = useCallback((index: number) => {
    setInvoiceLines(prev => prev.filter((_, i) => i !== index));
  }, []);
  const handleInvoiceProductSelect = useCallback((index: number, product: any) => {
    setInvoiceLines(prev => {
      const newLines = [...prev];
      const currentLine = newLines[index];
      
      newLines[index] = {
        ...currentLine,
        product_id: product.id,
        product_name: product.name,
        product_code: product.code || '',
        unit_price: product.sale_price?.toString() || '0.00',
        account_id: product.income_account_id || currentLine.account_id,
        account_code: product.income_account_code || currentLine.account_code,
        account_name: product.income_account_name || currentLine.account_name,
        total: parseFloat(currentLine.quantity || '1') * parseFloat(product.sale_price || '0')
        // NO sobrescribir product_name si ya tiene una descripción personalizada
      };
      return newLines;
    });    
    // Actualizar el término de búsqueda con el nombre del producto seleccionado
    setProductSearchTerms(prev => ({ 
      ...prev, 
      [index]: product.name 
    }));
    setFocusedProductInput(null);
    setProductDropdownOpen(prev => ({ ...prev, [index]: false }));
  }, []);

  const handleInvoiceAccountSelect = useCallback((index: number, account: any) => {
    setInvoiceLines(prev => {
      const newLines = [...prev];
      newLines[index] = {
        ...newLines[index],
        account_id: account.id,
        account_code: account.code,
        account_name: account.name
      };
      return newLines;
    });
      // Clear search term and close dropdown
    setAccountSearchTerms(prev => ({ ...prev, [index]: '' }));
    setFocusedInput(null);
  }, []);

  // Función para manejar selección de cuentas en apuntes contables
  const handleAccountSelect = useCallback((index: number, account: any) => {
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

  // 🆕 Función para generar apuntes contables automáticamente desde líneas de factura
  const generateJournalEntriesFromInvoiceLines = useCallback(() => {
    if (invoiceLines.length === 0) {
      updateField('lines', []);
      return;
    }

    const journalLines: any[] = [];
    
    // 1. Generar líneas de débito para cada producto (cuenta de ingresos)
    invoiceLines.forEach((line) => {
      if (line.account_id && line.total > 0) {
        journalLines.push({
          account_id: line.account_id,
          account_code: line.account_code,
          account_name: line.account_name,
          description: `${line.product_name} (${line.quantity} x ${line.unit_price})`,
          debit_amount: line.total.toString(),
          credit_amount: '0.00',
          product_id: line.product_id,
          quantity: line.quantity,
          unit_price: line.unit_price
        });
      }
    });

    // 2. Calcular total de la factura
    const totalInvoice = invoiceLines.reduce((sum, line) => sum + line.total, 0);

    // 3. Generar líneas de crédito según términos de pago
    if (values.payment_terms_id && entryPaymentSchedule.length > 0) {      // Con términos de pago: generar múltiples líneas según el cronograma
      entryPaymentSchedule.forEach((schedule) => {
        journalLines.push({
          account_id: '', // Usuario debe seleccionar cuenta (ej: cuentas por cobrar)
          account_code: '',
          account_name: '',
          description: `Cobro ${schedule.percentage}% - Vence: ${schedule.payment_date}`,
          debit_amount: '0.00',
          credit_amount: schedule.amount.toString(),
          due_date: schedule.payment_date,
          payment_terms_id: values.payment_terms_id
        });
      });
    } else {
      // Sin términos de pago: una sola línea de crédito
      journalLines.push({
        account_id: '', // Usuario debe seleccionar cuenta
        account_code: '',
        account_name: '',
        description: 'Total de factura',
        debit_amount: '0.00',
        credit_amount: totalInvoice.toString()
      });
    }

    updateField('lines', journalLines);
  }, [invoiceLines, values.payment_terms_id, entryPaymentSchedule, updateField]);
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
  }, []); // Solo ejecutar una vez al montar  // Propagar automáticamente third_party_id, cost_center_id, payment_terms_id, invoice_date y due_date 
  // desde el nivel del asiento a todas las líneas cuando cambien
  useEffect(() => {
    const updatedLines = values.lines.map(line => ({
      ...line,
      // Lógica de limpieza y propagación
      third_party_id: values.third_party_id || (line.third_party_id !== values.third_party_id ? undefined : line.third_party_id),
      cost_center_id: values.cost_center_id || (line.cost_center_id !== values.cost_center_id ? undefined : line.cost_center_id),
      
      // Manejo especial para payment terms con limpieza de conflictos
      payment_terms_id: values.payment_terms_id ? values.payment_terms_id : undefined,
      invoice_date: values.payment_terms_id && values.invoice_date ? values.invoice_date : undefined,
      due_date: !values.payment_terms_id && values.due_date ? values.due_date : undefined
    }));
    
    // Solo actualizar si hay cambios reales
    const hasChanges = updatedLines.some((line, index) => {
      const originalLine = values.lines[index];
      return line.third_party_id !== originalLine.third_party_id ||
             line.cost_center_id !== originalLine.cost_center_id ||
             line.payment_terms_id !== originalLine.payment_terms_id ||
             line.invoice_date !== originalLine.invoice_date ||
             line.due_date !== originalLine.due_date;
    });
    
    if (hasChanges) {
      console.log('🔄 Propagando cambios a las líneas:', {
        third_party_id: values.third_party_id,
        cost_center_id: values.cost_center_id,
        payment_terms_id: values.payment_terms_id,
        invoice_date: values.invoice_date,
        due_date: values.due_date
      });
      updateField('lines', updatedLines);
    }  }, [values.third_party_id, values.cost_center_id, values.payment_terms_id, 
      values.invoice_date, values.due_date, updateField]);

  // 🆕 Efecto para generar automáticamente apuntes contables desde líneas de factura
  useEffect(() => {
    generateJournalEntriesFromInvoiceLines();
  }, [invoiceLines, values.payment_terms_id, entryPaymentSchedule, generateJournalEntriesFromInvoiceLines]);

  // Efecto para ejecutar la actualización automática cuando cambien productos o origen
  useEffect(() => {
    // Solo ejecutar si hay un origen de transacción definido
    if (values.transaction_origin) {
      // Ejecutar con un delay mayor para dar tiempo al usuario a escribir
      const timer = setTimeout(() => {
        updateLineAmountsFromProducts();
      }, 1000); // Aumentado a 1 segundo para evitar interferir con la escritura

      return () => clearTimeout(timer);
    }
  }, [values.transaction_origin]); // Removido updateLineAmountsFromProducts de las dependencias para evitar loops

  // Si estamos en modo edición y aún estamos cargando los datos, mostrar spinner
  if (isEditMode && (loadingEntry || (entryId && !existingEntry))) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Cargando datos del asiento...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="card-title">
              {isEditMode ? 'Editar Asiento Contable' : 'Nuevo Asiento Contable'}
            </h3>            <div className="flex items-center space-x-4">
              {/* Balance indicator - más prominente */}
              <div className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${
                balance.is_balanced 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200 animate-pulse'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {balance.is_balanced ? '✅' : '⚠️'}
                  </span>
                  <span>
                    {balance.is_balanced ? 'Balanceado' : 'Desbalanceado'}
                  </span>
                </div>
              </div>
              {!balance.is_balanced && Math.abs(balance.difference) > 0.01 && (
                <div className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                  <span className="font-semibold">Diferencia:</span> {formatCurrency(Math.abs(balance.difference))}
                  <br />
                  <span className="text-xs">
                    {balance.difference > 0 ? 'Exceso en débitos' : 'Exceso en créditos'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>        <form onSubmit={handleSubmit} className="card-body space-y-6">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              <div>
                <label htmlFor="third_party_id" className="form-label">
                  Tercero (Cliente/Proveedor)
                </label>
                <div className="relative">
                  <Input
                    id="third_party_id"
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
                        updateField('third_party_id', '');
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
                    className="form-input"
                  />
                  
                  {thirdPartyDropdownOpen && getFilteredThirdParties(thirdPartySearchTerm).length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {getFilteredThirdParties(thirdPartySearchTerm).map(thirdParty => (
                        <div
                          key={thirdParty.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            updateField('third_party_id', thirdParty.id);
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
                            </div>                            <span className={`px-2 py-1 text-xs rounded-full ${
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
                <p className="text-xs text-gray-500 mt-1">
                  📋 Se calcularán fechas de vencimiento automáticamente
                </p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">🔄 Limpieza automática</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Seleccionar condiciones de pago limpia la fecha de vencimiento manual</p>
                  <p>• Establecer fecha de vencimiento manual limpia las condiciones de pago</p>
                  <p>• Dejar las descripciones de líneas vacías usa la descripción general</p>
                </div>
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
                </label>                <Input
                  id="due_date"
                  type="date"
                  value={values.due_date || ''}
                  onChange={handleInputChange('due_date')}
                  disabled={!!values.payment_terms_id}
                  error={getFieldError('due_date')}
                  className={values.payment_terms_id ? 'bg-gray-100' : ''}
                />
                {getFieldError('due_date') && (
                  <ValidationMessage type="error" message={getFieldError('due_date')!} />
                )}
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
              </div>            </div>          </div>
        </form>
      </Card>

      {/* Origen de Transacción */}
      <Card>
        <div className="card-header">
          <h4 className="card-title">Origen de Transacción</h4>
        </div>
        <div className="card-body">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-blue-900">
                Tipo de Transacción
              </label>
              {values.transaction_origin && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTransactionOriginColor(values.transaction_origin)}`}>
                  {TransactionOriginLabels[values.transaction_origin]}
                </span>
              )}
            </div>
            
            <select
              value={values.transaction_origin || ''}              onChange={(e) => {
                updateField('transaction_origin', e.target.value as TransactionOrigin || undefined);
              }}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar origen...</option>
              {Object.entries(TransactionOriginLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            
            {values.transaction_origin && ['sale', 'purchase'].includes(values.transaction_origin) && (
              <p className="text-xs text-blue-700 mt-2">
                💡 Este tipo de transacción comúnmente incluye productos. Las secciones de productos se han expandido automáticamente.
              </p>
            )}
          </div>
        </div>
      </Card>          {/* Diseño estilo Odoo - Líneas de factura y Apuntes contables */}
      <Card>
        <div className="card-body">
          <div className="space-y-6">            {/* Líneas de Factura */}            <div className={`bg-white border border-gray-200 rounded-lg relative transition-all duration-200 ${
              hasOpenInvoiceDropdowns ? 'overflow-visible pb-64' : 'overflow-hidden'
            }`}>
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h5 className="text-base font-semibold text-blue-900 flex items-center">
                    <span className="mr-2">📋</span>
                    Líneas de factura
                  </h5>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addInvoiceLine}
                      size="sm"
                      className="text-xs"
                    >
                      + Agregar línea
                    </Button>                  </div>
                </div>
              </div>                <div className={`overflow-x-auto transition-all duration-200 ${
                  hasOpenInvoiceDropdowns ? 'overflow-y-visible' : 'overflow-y-visible'
                }`}>
                <table className="min-w-full table-fixed relative">
                  <thead className="bg-gray-50">
                    <tr>                      <th className="w-1/4 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="w-1/5 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="w-1/12 px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="w-1/12 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidad
                      </th>
                      <th className="w-1/8 px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="w-1/8 px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="w-1/12 px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceLines.map((line, index) => {
                      const quantity = parseFloat(line.quantity || '0');
                      const unitPrice = parseFloat(line.unit_price || '0');
                      const total = quantity * unitPrice;
                        return (                        <tr key={index} className={`hover:bg-gray-50 transition-all duration-200 ${
                          (productDropdownOpen[index] || focusedInvoiceInput === index) ? 'h-auto min-h-20' : 'h-20'
                        }`}>
                          <td className="w-1/4 px-4 py-4 align-top">
                            <div className={`relative transition-all duration-200 ${
                              (productDropdownOpen[index] || focusedInvoiceInput === index) ? 'h-auto min-h-12 pb-64' : 'h-12'
                            }`}>
                              {/* Autocomplete para buscar productos por nombre */}
                              <div className="relative"><Input
                                  value={productSearchTerms[index] ?? (line.product_name || '')}
                                  onChange={(e) => {
                                    const searchTerm = e.target.value;
                                    setProductSearchTerms(prev => ({ 
                                      ...prev, 
                                      [index]: searchTerm 
                                    }));
                                    setProductDropdownOpen(prev => ({ 
                                      ...prev, 
                                      [index]: searchTerm.length > 0 
                                    }));
                                    
                                    // Si borra el texto completamente, limpiar la selección
                                    if (searchTerm === '') {
                                      updateInvoiceLine(index, 'product_id', '');
                                      updateInvoiceLine(index, 'product_name', '');
                                      updateInvoiceLine(index, 'product_code', '');
                                    }
                                  }}                                  onFocus={() => {
                                    setFocusedProductInput(index);
                                    setProductDropdownOpen(prev => ({ 
                                      ...prev, 
                                      [index]: true 
                                    }));
                                  }}                                  onBlur={() => {
                                    setTimeout(() => {
                                      setFocusedProductInput(null);
                                      setProductDropdownOpen(prev => ({ 
                                        ...prev, 
                                        [index]: false 
                                      }));
                                      // Si no hay selección, limpiar el término
                                      if (!line.product_id) {
                                        setProductSearchTerms(prev => {
                                          const newTerms = { ...prev };
                                          delete newTerms[index];
                                          return newTerms;
                                        });
                                      }
                                    }, 200);
                                  }}                                  placeholder={line.product_id ? "Producto seleccionado" : "Buscar producto por nombre..."}
                                  className="text-sm w-full h-10"
                                />                                {/* Dropdown de productos */}
                                {productDropdownOpen[index] && (
                                  <div className="absolute z-[9999] mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[300px] max-w-[400px]">
                                    {getFilteredProducts(productSearchTerms[index] || '').map((product) => (
                                      <div
                                        key={product.id}
                                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onClick={() => handleInvoiceProductSelect(index, product)}
                                      >
                                        <div className="text-sm font-medium text-gray-900">
                                          {product.code} - {product.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Precio: ${product.sale_price || 0}
                                        </div>
                                      </div>
                                    ))}
                                    {getFilteredProducts(productSearchTerms[index] || '').length === 0 && (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No se encontraron productos
                                      </div>
                                    )}
                                  </div>
                                )}                                {/* Mostrar producto seleccionado como placeholder en el input */}
                                {line.product_id && !productSearchTerms[index] && focusedProductInput !== index && (
                                  <div className="absolute inset-0 pointer-events-none">
                                    <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded border border-blue-200 font-medium">
                                      📦 {line.product_name || line.product_id}
                                    </div>
                                  </div>
                                )}
                              </div>                            </div>                          </td>                          <td className="w-1/5 px-4 py-4 align-top">
                            <div className={`relative transition-all duration-200 ${
                              focusedInvoiceInput === index ? 'h-auto min-h-12 pb-64' : 'h-12'
                            }`}>
                              <Input
                                value={accountSearchTerms[index] || line.account_code || ''}
                                onChange={(e) => {
                                  const searchTerm = e.target.value;
                                  setAccountSearchTerms(prev => ({ 
                                    ...prev, 
                                    [index]: searchTerm 
                                  }));
                                    if (searchTerm === '' && line.account_id) {
                                    updateInvoiceLine(index, 'account_id', '');
                                    updateInvoiceLine(index, 'account_code', '');
                                    updateInvoiceLine(index, 'account_name', '');
                                  }
                                }}                                onFocus={() => setFocusedInvoiceInput(index)}
                                onBlur={() => setTimeout(() => setFocusedInvoiceInput(null), 200)}                                placeholder="Buscar cuenta..."
                                className="text-sm w-full h-10"
                              />                              {(accountSearchTerms[index] || focusedInvoiceInput === index) && (
                                <div className="absolute z-[9999] mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[320px] max-w-[400px]">
                                  {getFilteredAccounts(accountSearchTerms[index] || '').map((account) => (
                                    <div
                                      key={account.id}
                                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onClick={() => handleInvoiceAccountSelect(index, account)}
                                    >
                                      <div className="text-sm">
                                        <span className="font-medium text-blue-600">{account.code}</span>
                                        <span className="text-gray-600 ml-2">{account.name}</span>
                                      </div>
                                    </div>                                  ))}
                                  {getFilteredAccounts(accountSearchTerms[index] || '').length === 0 && (
                                    <div className="px-3 py-2 text-sm text-gray-500">
                                      No se encontraron cuentas
                                    </div>
                                  )}
                                </div>
                              )}                                {/* Mostrar cuenta seleccionada como placeholder en el input */}
                              {line.account_id && !accountSearchTerms[index] && focusedInvoiceInput !== index && (
                                <div className="absolute inset-0 pointer-events-none">
                                  <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded border border-green-200 font-medium">
                                    🏦 {line.account_code} - {line.account_name}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="w-1/12 px-4 py-4 align-top">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={line.quantity || ''}
                              onChange={(e) => updateInvoiceLine(index, 'quantity', e.target.value)}
                              placeholder="0"                              className="text-sm text-right w-full h-10"
                            />
                          </td>
                          <td className="w-1/12 px-4 py-4 align-top">
                            <div className="text-sm text-gray-600 text-center h-10 flex items-center justify-center">
                              und
                            </div>
                          </td>                          <td className="w-1/8 px-4 py-4 align-top">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={line.unit_price || ''}
                              onChange={(e) => updateInvoiceLine(index, 'unit_price', e.target.value)}
                              placeholder="0.00"
                              className="text-sm text-right w-full h-10"
                            />
                          </td>
                          <td className="w-1/8 px-4 py-4 text-right align-top">
                            <span className="text-sm font-medium text-gray-900 h-10 flex items-center justify-end">
                              {formatCurrency(total || 0)}
                            </span>
                          </td>
                          <td className="w-1/12 px-4 py-4 align-top">
                            <div className="flex justify-center space-x-1">
                              {invoiceLines.length > 0 && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="danger"
                                  onClick={() => removeInvoiceLine(index)}
                                  className="text-xs p-1"
                                  title="Eliminar línea"
                                >
                                  🗑️
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>                      );
                    })}                    {invoiceLines.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="text-3xl mb-3">📋</div>
                            <p className="text-base font-medium">No hay líneas de factura</p>
                            <p className="text-sm text-gray-400 mt-2">
                              Haz clic en "Agregar línea" para añadir productos
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>            {/* Apuntes Contables */}            <div className={`bg-white border border-gray-200 rounded-lg relative transition-all duration-200 ${
              hasOpenAccountDropdowns ? 'overflow-visible pb-64' : 'overflow-hidden'
            }`}>
              <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h5 className="text-base font-semibold text-green-900 flex items-center">
                    <span className="mr-2">⚖️</span>
                    Apuntes contables
                  </h5>
                  <div className="flex items-center space-x-4">
                    <div className={`text-xs px-3 py-1 rounded-full ${
                      balance.is_balanced 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {balance.is_balanced ? '✅ Balanceado' : '⚠️ Desbalanceado'}
                    </div>
                    {!balance.is_balanced && Math.abs(balance.difference) > 0.01 && (
                      <Button
                        type="button"
                        onClick={() => autoBalanceEntry()}
                        variant="primary"
                        size="sm"
                        disabled={loading}
                        className="text-xs"
                      >
                        ⚖️ Auto-Balancear
                      </Button>
                    )}
                  </div>
                </div>              </div>                <div className={`overflow-x-auto transition-all duration-200 ${
                  hasOpenAccountDropdowns ? 'overflow-y-visible' : 'overflow-y-visible'
                }`}>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Venc.
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Débito
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crédito
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {values.lines.map((line, index) => {
                      const hasAmount = parseFloat(line.debit_amount || '0') > 0 || parseFloat(line.credit_amount || '0') > 0;
                        return (
                        <tr key={index} className={`${hasAmount ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-all duration-200 ${
                          focusedInput === index ? 'h-auto min-h-16' : 'h-auto'
                        }`}>                          <td className="px-3 py-2">
                            <div className={`relative transition-all duration-200 ${
                              focusedInput === index ? 'h-auto pb-64' : 'h-auto'
                            }`}>
                              <Input
                                value={accountSearchTerms[index] || line.account_code || ''}
                                onChange={(e) => {
                                  const searchTerm = e.target.value;
                                  setAccountSearchTerms(prev => ({ 
                                    ...prev, 
                                    [index]: searchTerm 
                                  }));
                                  
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
                                placeholder="Buscar cuenta..."
                                className="text-sm w-full"
                              />                              {(accountSearchTerms[index] || focusedInput === index) && (
                                <div className="absolute z-[9999] mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-y-auto min-w-[320px] max-w-[400px]">
                                  {getFilteredAccounts(accountSearchTerms[index] || '').map((account) => (
                                    <div
                                      key={account.id}
                                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onClick={() => handleAccountSelect(index, account)}
                                    >
                                      <div className="text-sm">
                                        <span className="font-medium text-blue-600">{account.code}</span>
                                        <span className="text-gray-600 ml-2">{account.name}</span>
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
                              
                              {line.account_id && !accountSearchTerms[index] && focusedInput !== index && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {line.account_code} - {line.account_name}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-sm text-gray-900">
                              {line.description || values.description || '-'}
                            </div>
                            {line.product_id && (
                              <div className="text-xs text-blue-600 mt-1">
                                📦 Producto: {line.product_id}
                                {line.quantity && line.unit_price && (
                                  <span className="ml-2">
                                    ({parseFloat(line.quantity).toFixed(2)} × {formatCurrency(parseFloat(line.unit_price))})
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="text-sm">
                              {line.due_date ? (
                                <span className="text-gray-900">
                                  {new Date(line.due_date).toLocaleDateString('es-ES')}
                                </span>
                              ) : values.due_date ? (
                                <span className="text-gray-600">
                                  {new Date(values.due_date).toLocaleDateString('es-ES')}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="space-y-1">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={line.debit_amount}
                                onChange={(e) => handleLineChange(index, 'debit_amount', e.target.value)}
                                className="text-sm text-right w-24"
                                placeholder="0.00"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="space-y-1">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={line.credit_amount}
                                onChange={(e) => handleLineChange(index, 'credit_amount', e.target.value)}
                                className="text-sm text-right w-24"
                                placeholder="0.00"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-900">
                        Totales:
                      </td>
                      <td className="px-3 py-2 text-right text-sm font-bold text-green-700">
                        {formatCurrency(balance.total_debit)}
                      </td>
                      <td className="px-3 py-2 text-right text-sm font-bold text-blue-700">
                        {formatCurrency(balance.total_credit)}
                      </td>
                    </tr>
                    {!balance.is_balanced && (
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-red-900">
                          Diferencia:
                        </td>
                        <td colSpan={2} className="px-3 py-2 text-right text-sm font-bold text-red-700">
                          {formatCurrency(Math.abs(balance.difference))}
                          <span className="text-xs ml-1">
                            ({balance.difference > 0 ? 'Exceso débitos' : 'Exceso créditos'})
                          </span>
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Cronograma de Pagos - Sección movida al final */}
      <Card>
        <div className="card-body">
          {/* Estado del cronograma de pagos */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h6 className="text-sm font-medium text-gray-700 flex items-center">
                📊 Calcular Cronograma de Pagos
              </h6>
              <div className="flex items-center space-x-2">
                {values.payment_terms_id && values.invoice_date && invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0) > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Listo para calcular
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    console.log('🔄 Forzando recálculo del cronograma...');
                    calculateEntryPaymentSchedule();
                  }}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                                   🔄 Recalcular
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className={`mr-3 text-lg ${values.payment_terms_id ? 'text-green-600' : 'text-gray-400'}`}>
                  {values.payment_terms_id ? '✓' : '○'}
                </span>
                <span className="flex-1">Condiciones de pago seleccionadas</span>
                {values.payment_terms_id && (
                  <span className="text-blue-600 font-medium text-xs">
                    {paymentTerms.find(pt => pt.id === values.payment_terms_id)?.code} - {paymentTerms.find(pt => pt.id === values.payment_terms_id)?.name}
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <span className={`mr-3 text-lg ${invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0) > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0) > 0 ? '✓' : '○'}
                </span>
                <span className="flex-1">Monto válido (mayor a 0)</span>
                <span className="text-blue-600 font-medium text-xs">
                  {formatCurrency(invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0))}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className={`mr-3 text-lg ${values.invoice_date ? 'text-green-600' : 'text-gray-400'}`}>
                  {values.invoice_date ? '✓' : '○'}
                </span>
                <span className="flex-1">Fecha de factura seleccionada</span>
                {values.invoice_date && (
                  <span className="text-blue-600 font-medium text-xs">
                    {new Date(values.invoice_date).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <span className={`mr-3 text-lg ${entryPaymentSchedule.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {entryPaymentSchedule.length > 0 ? '✓' : '○'}
                </span>
                <span className="flex-1">Cronograma calculado</span>
                <span className="text-blue-600 font-medium text-xs">
                  {entryPaymentSchedule.length > 0 ? `${entryPaymentSchedule.length} cronograma(s) definido(s)` : 'Sin cronograma'}
                </span>
              </div>

              {calculatingSchedule && (
                <div className="mt-3 flex items-center text-blue-600">
                  <span className="mr-2">⏳</span>
                  <span>Calculando cronograma...</span>
                </div>
              )}
              {scheduleError && (
                <div className="mt-3 flex items-center text-red-600">
                  <span className="mr-2">❌</span>
                  <span>Error: {scheduleError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Schedule Display */}
          {showPaymentSchedule && entryPaymentSchedule.length > 0 && (
            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-blue-900 flex items-center">
                  📅 Cronograma de Pagos
                </h5>
                <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {entryPaymentSchedule.length} cuota{entryPaymentSchedule.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Resumen del Cálculo */}
              <div className="mb-6 p-4 bg-white border border-blue-100 rounded-lg">
                <h6 className="font-medium text-gray-900 mb-3">Resumen del Cálculo</h6>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Condiciones</span>
                    <div className="font-medium text-gray-900">
                      {paymentTerms.find(pt => pt.id === values.payment_terms_id)?.name || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Monto Total</span>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Número de Cuotas</span>
                    <div className="font-medium text-gray-900">
                      {entryPaymentSchedule.length}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Plazo Máximo</span>
                    <div className="font-medium text-gray-900">
                      {Math.max(...entryPaymentSchedule.map(p => p.days))} días
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Cálculo realizado el {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}
                </div>
              </div>

              {/* Tabla del Cronograma */}
              <div className="bg-white border border-blue-100 rounded-lg overflow-hidden">
                <div className="bg-blue-100 px-4 py-2">
                  <h6 className="font-medium text-blue-900">Cronograma de Pagos</h6>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pago</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entryPaymentSchedule.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                              {payment.sequence}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {payment.days}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            {(Number(payment.percentage) || 0).toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {payment.description || `Cuota ${payment.sequence}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Totales */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Monto factura:</span>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total cronograma:</span>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(entryPaymentSchedule.reduce((sum, p) => sum + p.amount, 0))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">% Total:</span>
                      <div className="font-medium text-gray-900">
                        {entryPaymentSchedule.reduce((sum, p) => sum + (Number(p.percentage) || 0), 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Diferencia si existe */}
                  {Math.abs(entryPaymentSchedule.reduce((sum, p) => sum + p.amount, 0) - 
                            invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0)) > 0.01 && (
                    <div className="mt-2 text-sm">
                      <span className="text-red-600">Diferencia:</span>
                      <span className="font-medium text-red-600 ml-1">
                        {formatCurrency(Math.abs(entryPaymentSchedule.reduce((sum, p) => sum + p.amount, 0) - 
                                                 invoiceLines.reduce((sum, line) => sum + (line.total || 0), 0)))}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {calculatingSchedule && (
                <div className="text-center py-2 mt-4">
                  <span className="text-sm text-blue-600">⏳ Calculando cronograma...</span>
                </div>
              )}

              {scheduleError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  ❌ Error al calcular cronograma: {scheduleError}
                </div>
              )}
            </div>
          )}

          {/* Mensaje informativo cuando hay términos de pago pero no cronograma */}
          {values.payment_terms_id && !showPaymentSchedule && entryPaymentSchedule.length === 0 && (
            <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">ℹ️</span>
                <span>
                  El término de pago seleccionado utiliza fecha de vencimiento simple.
                  {values.due_date && (
                    <span className="ml-1 font-medium">
                      Vence: {new Date(values.due_date).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </span>
              </div>
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
