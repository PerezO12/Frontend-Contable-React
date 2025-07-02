import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { Badge } from '../../../components/ui/Badge';
import { Autocomplete } from '../../../components/ui/Autocomplete';
import type { AutocompleteOption } from '../../../components/ui/Autocomplete';
import { PaymentFlowAPI } from '../api/paymentFlowAPI';
import { usePartnerSearch } from '../hooks/usePartnerSearch';
import { useJournalSearch } from '../hooks/useJournalSearch';
import { 
  PaymentType,
  PaymentMethod,
  type PaymentCreate,
  type Payment,
  PAYMENT_TYPE_LABELS,
  PAYMENT_METHOD_LABELS
} from '../types';
import { formatCurrency } from '../../../shared/utils/formatters';

interface PaymentFormProps {
  onSuccess?: (payment: Payment) => void;
  onCancel?: () => void;
  initialData?: Partial<PaymentCreate> & { id?: string };
  isEditMode?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isEditMode = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hooks para búsqueda
  const { searchPartners, getPartnerById } = usePartnerSearch();
  const { searchJournals, getJournalById } = useJournalSearch();

  // Estados para los valores seleccionados
  const [selectedPartner, setSelectedPartner] = useState<AutocompleteOption | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<AutocompleteOption | null>(null);

  const [formData, setFormData] = useState<PaymentCreate>({
    payment_type: PaymentType.SUPPLIER_PAYMENT,
    payment_method: PaymentMethod.BANK_TRANSFER,
    payment_date: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    amount: 0,
    currency_code: 'COP',
    reference: '',
    description: '',
    customer_id: undefined, // Tercero opcional
    journal_id: '', // Diario obligatorio
    ...initialData
  });

  // Inicializar valores seleccionados cuando hay datos iniciales
  useEffect(() => {
    const initializeSelectedValues = async () => {
      if (initialData?.customer_id && !selectedPartner) {
        try {
          const partner = await getPartnerById(parseInt(initialData.customer_id));
          if (partner) {
            setSelectedPartner({
              id: partner.id,
              label: partner.name,
              description: `${partner.document_type || ''} ${partner.document_number || ''}`.trim() || undefined
            });
          }
        } catch (error) {
          console.error('Error cargando tercero inicial:', error);
        }
      }

      if (initialData?.journal_id && !selectedJournal) {
        try {
          const journal = await getJournalById(initialData.journal_id);
          if (journal) {
            setSelectedJournal({
              id: journal.id,
              label: journal.name,
              description: `${journal.code} - ${journal.currency_code}`
            });
          }
        } catch (error) {
          console.error('Error cargando diario inicial:', error);
        }
      }
    };

    initializeSelectedValues();
  }, [initialData?.customer_id, initialData?.journal_id, getPartnerById, getJournalById, selectedPartner, selectedJournal]);

  const handleInputChange = (field: keyof PaymentCreate, value: any) => {
    setFormData((prev: PaymentCreate) => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error específico cuando el usuario modifica el campo
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.payment_date) {
      newErrors.payment_date = 'La fecha de pago es obligatoria';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El importe debe ser mayor a 0';
    }

    if (!formData.currency_code) {
      newErrors.currency_code = 'La moneda es obligatoria';
    }

    if (!formData.journal_id) {
      newErrors.journal_id = 'Debe seleccionar un diario';
    }

    // customer_id es opcional, no validamos

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let payment: Payment;
      
      // Limpiar datos para el envío: convertir strings vacías en undefined
      const cleanFormData = {
        ...formData,
        customer_id: formData.customer_id || undefined,
        reference: formData.reference || undefined,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
      };
      
      if (isEditMode && initialData?.id) {
        payment = await PaymentFlowAPI.updatePayment(initialData.id.toString(), cleanFormData);
        setSuccessMessage('Pago actualizado exitosamente');
      } else {
        payment = await PaymentFlowAPI.createPayment(cleanFormData);
        setSuccessMessage('Pago creado exitosamente');
      }

      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        onSuccess?.(payment);
      }, 1000);

    } catch (error: any) {
      console.error('Error al guardar pago:', error);
      
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'object') {
          setErrors(error.response.data.detail);
        } else {
          setErrors({ general: error.response.data.detail });
        }
      } else {
        setErrors({ general: 'Error al guardar el pago. Intente nuevamente.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errors.general}
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Pago *
            </label>
            <select
              value={formData.payment_type}
              onChange={(e) => handleInputChange('payment_type', e.target.value as PaymentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {Object.values(PaymentType).map(type => (
                <option key={type} value={type}>
                  {PAYMENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago *
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => handleInputChange('payment_method', e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {Object.values(PaymentMethod).map(method => (
                <option key={method} value={method}>
                  {PAYMENT_METHOD_LABELS[method]}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Pago *
            </label>
            <Input
              type="date"
              value={formData.payment_date}
              onChange={(e) => handleInputChange('payment_date', e.target.value)}
              error={errors.payment_date}
              required
            />
          </div>

          {/* Importe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Importe *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              error={errors.amount}
              placeholder="0.00"
              required
            />
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda *
            </label>
            <select
              value={formData.currency_code}
              onChange={(e) => handleInputChange('currency_code', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="COP">COP - Peso Colombiano</option>
              <option value="USD">USD - Dólar Americano</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          {/* Diario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diario *
            </label>
            <Autocomplete
              value={selectedJournal}
              onChange={(option) => {
                setSelectedJournal(option);
                handleInputChange('journal_id', option ? String(option.id) : '');
              }}
              onSearch={searchJournals}
              placeholder="Buscar diario..."
              error={errors.journal_id}
              noResultsText="No se encontraron diarios"
              minQueryLength={0}
            />
            <p className="mt-1 text-xs text-gray-500">
              La cuenta se tomará automáticamente del diario seleccionado
            </p>
          </div>

          {/* Tercero (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tercero (Opcional)
            </label>
            <Autocomplete
              value={selectedPartner}
              onChange={(option) => {
                setSelectedPartner(option);
                handleInputChange('customer_id', option ? String(option.id) : undefined);
              }}
              onSearch={searchPartners}
              placeholder="Buscar tercero por nombre, documento..."
              error={errors.customer_id}
              noResultsText="No se encontraron terceros"
              minQueryLength={0}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Información Adicional
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Referencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referencia
            </label>
            <Input
              type="text"
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              placeholder="Número de referencia o documento"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descripción del pago..."
            />
          </div>

          {/* Estado (solo en modo edición) */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <p className="text-sm text-gray-600">
                El estado se gestiona automáticamente por el sistema
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Resumen del pago */}
      {formData.amount > 0 && (
        <Card className="p-6 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Resumen
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tipo:</span>
              <Badge color={formData.payment_type === PaymentType.CUSTOMER_PAYMENT ? 'blue' : 'purple'}>
                {PAYMENT_TYPE_LABELS[formData.payment_type]}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Importe:</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(formData.amount, formData.currency_code)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fecha:</span>
              <span className="text-sm text-gray-900">{formData.payment_date}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              {isEditMode ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            isEditMode ? 'Actualizar Pago' : 'Crear Pago'
          )}
        </Button>
      </div>
    </form>
  );
};
