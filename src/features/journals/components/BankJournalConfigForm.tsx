/**
 * Formulario de configuración bancaria para journals
 * Permite crear y editar configuraciones bancarias avanzadas
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type {
  BankJournalConfigCreate,
  BankJournalConfigUpdate,
  BankJournalConfigRead,
  PaymentMode,
} from '../types';
import { PaymentModeConst, PaymentModeLabels } from '../types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AccountSearchInput } from '@/components/ui/AccountSearchInput';
import { SaveIcon } from '@/shared/components/icons';

interface BankJournalConfigFormData {
  bank_account_number: string;
  bank_account_id?: string;
  transit_account_id?: string;
  profit_account_id?: string;
  loss_account_id?: string;
  dedicated_payment_sequence: boolean;
  allow_inbound_payments: boolean;
  inbound_payment_mode: PaymentMode;
  inbound_receipt_account_id?: string;
  allow_outbound_payments: boolean;
  outbound_payment_mode: PaymentMode;
  outbound_payment_method: string;
  outbound_payment_name: string;
  outbound_pending_account_id?: string;
  currency_code: string;
  allow_currency_exchange: boolean;
  auto_reconcile: boolean;
  description: string;
}

interface BankJournalConfigFormProps {
  journalId: string;
  initialData?: BankJournalConfigRead;
  onSubmit: (data: BankJournalConfigCreate | BankJournalConfigUpdate) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  errors?: string[];
  warnings?: string[];
}

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - Dólar Estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - Libra Esterlina' },
  { value: 'CAD', label: 'CAD - Dólar Canadiense' },
  { value: 'AUD', label: 'AUD - Dólar Australiano' },
  { value: 'JPY', label: 'JPY - Yen Japonés' },
  { value: 'CHF', label: 'CHF - Franco Suizo' },
  { value: 'CNY', label: 'CNY - Yuan Chino' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'check', label: 'Cheque' },
  { value: 'wire_transfer', label: 'Transferencia Bancaria' },
  { value: 'sepa', label: 'SEPA' },
  { value: 'manual', label: 'Manual' },
  { value: 'electronic', label: 'Electrónico' },
];

export function BankJournalConfigForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  errors = [],
  warnings = [],
}: BankJournalConfigFormProps) {

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors },
    reset,
  } = useForm<BankJournalConfigFormData>({
    defaultValues: {
      bank_account_number: '',
      dedicated_payment_sequence: true,
      allow_inbound_payments: true,
      inbound_payment_mode: PaymentModeConst.MANUAL,
      allow_outbound_payments: true,
      outbound_payment_mode: PaymentModeConst.MANUAL,
      outbound_payment_method: 'manual',
      outbound_payment_name: '',
      currency_code: 'USD',
      allow_currency_exchange: false,
      auto_reconcile: true,
      description: '',
    },
  });

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      reset({
        bank_account_number: initialData.bank_account_number || '',
        bank_account_id: initialData.bank_account_id,
        transit_account_id: initialData.transit_account_id,
        profit_account_id: initialData.profit_account_id,
        loss_account_id: initialData.loss_account_id,
        dedicated_payment_sequence: initialData.dedicated_payment_sequence,
        allow_inbound_payments: initialData.allow_inbound_payments,
        inbound_payment_mode: initialData.inbound_payment_mode,
        inbound_receipt_account_id: initialData.inbound_receipt_account_id,
        allow_outbound_payments: initialData.allow_outbound_payments,
        outbound_payment_mode: initialData.outbound_payment_mode,
        outbound_payment_method: initialData.outbound_payment_method || 'manual',
        outbound_payment_name: initialData.outbound_payment_name || '',
        outbound_pending_account_id: initialData.outbound_pending_account_id,
        currency_code: initialData.currency_code,
        allow_currency_exchange: initialData.allow_currency_exchange,
        auto_reconcile: initialData.auto_reconcile,
        description: initialData.description || '',
      });
    }
  }, [initialData, reset]);

  // Watch para campos condicionales
  const watchAllowInbound = watch('allow_inbound_payments');
  const watchAllowOutbound = watch('allow_outbound_payments');
  const watchAllowCurrencyExchange = watch('allow_currency_exchange');

  const handleFormSubmit = async (data: BankJournalConfigFormData) => {
    // Limpiar campos opcionales que están vacíos
    const cleanData = { ...data };
    
    // Si no permite pagos entrantes, limpiar campos relacionados
    if (!cleanData.allow_inbound_payments) {
      cleanData.inbound_receipt_account_id = undefined;
    }
    
    // Si no permite pagos salientes, limpiar campos relacionados
    if (!cleanData.allow_outbound_payments) {
      cleanData.outbound_pending_account_id = undefined;
      delete (cleanData as any).outbound_payment_method;
      delete (cleanData as any).outbound_payment_name;
    }
    
    // Si no permite intercambio de moneda, limpiar cuentas de ganancia/pérdida
    if (!cleanData.allow_currency_exchange) {
      cleanData.profit_account_id = undefined;
      cleanData.loss_account_id = undefined;
    }

    await onSubmit(cleanData);
  };

  const paymentModeOptions = [
    { value: PaymentModeConst.MANUAL, label: PaymentModeLabels.manual },
    { value: PaymentModeConst.BATCH, label: PaymentModeLabels.batch },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Alertas de validación */}
      {errors.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Errores de Validación</h4>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {warnings.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Advertencias</h4>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Información básica del banco */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información Bancaria Básica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bank_account_number">
              Número de Cuenta Bancaria *
            </Label>
            <Input
              id="bank_account_number"
              {...register('bank_account_number', {
                required: 'El número de cuenta es obligatorio',
                minLength: {
                  value: 5,
                  message: 'Debe tener al menos 5 caracteres',
                },
              })}
              placeholder="Ej: 1234567890"
              error={formErrors.bank_account_number?.message}
            />
          </div>

          <div>
            <Label htmlFor="bank_account_id">
              Cuenta Contable del Banco
            </Label>
            <AccountSearchInput
              value={watch('bank_account_id')}
              onChange={(accountId) => setValue('bank_account_id', accountId)}
              placeholder="Buscar cuenta del banco..."
              limit={10}
            />
            <p className="mt-1 text-xs text-gray-500">
              Cuenta contable que representa este banco
            </p>
          </div>

          <div>
            <Label htmlFor="currency_code">
              Moneda *
            </Label>
            <Select
              value={watch('currency_code')}
              onChange={(value) => setValue('currency_code', value)}
              options={CURRENCY_OPTIONS}
            />
          </div>

          <div>
            <Label htmlFor="transit_account_id">
              Cuenta de Tránsito
            </Label>
            <AccountSearchInput
              value={watch('transit_account_id')}
              onChange={(accountId) => setValue('transit_account_id', accountId)}
              placeholder="Buscar cuenta de tránsito..."
              limit={10}
            />
            <p className="mt-1 text-xs text-gray-500">
              Cuenta temporal para transacciones en proceso
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="dedicated_payment_sequence"
              {...register('dedicated_payment_sequence')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="dedicated_payment_sequence" className="!mb-0">
              Secuencia dedicada para pagos
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="auto_reconcile"
              {...register('auto_reconcile')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="auto_reconcile" className="!mb-0">
              Conciliación automática
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="allow_currency_exchange"
              {...register('allow_currency_exchange')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="allow_currency_exchange" className="!mb-0">
              Permitir intercambio de divisas
            </Label>
          </div>
        </div>
      </Card>

      {/* Configuración de pagos entrantes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Pagos Entrantes (Ingresos)
          </h3>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="allow_inbound_payments"
              {...register('allow_inbound_payments')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="allow_inbound_payments" className="!mb-0">
              Permitir pagos entrantes
            </Label>
          </div>
        </div>

        {watchAllowInbound && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="inbound_payment_mode">
                Modo de Pago Entrante
              </Label>
              <Select
                value={watch('inbound_payment_mode')}
                onChange={(value) => setValue('inbound_payment_mode', value as PaymentMode)}
                options={paymentModeOptions}
              />
            </div>

            <div>
              <Label htmlFor="inbound_receipt_account_id">
                Cuenta de Recibos Entrantes
              </Label>
              <AccountSearchInput
                value={watch('inbound_receipt_account_id')}
                onChange={(accountId) => setValue('inbound_receipt_account_id', accountId)}
                placeholder="Buscar cuenta de recibos..."
                limit={10}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Configuración de pagos salientes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Pagos Salientes (Egresos)
          </h3>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="allow_outbound_payments"
              {...register('allow_outbound_payments')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="allow_outbound_payments" className="!mb-0">
              Permitir pagos salientes
            </Label>
          </div>
        </div>

        {watchAllowOutbound && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="outbound_payment_mode">
                Modo de Pago Saliente
              </Label>
              <Select
                value={watch('outbound_payment_mode')}
                onChange={(value) => setValue('outbound_payment_mode', value as PaymentMode)}
                options={paymentModeOptions}
              />
            </div>

            <div>
              <Label htmlFor="outbound_payment_method">
                Método de Pago
              </Label>
              <Select
                value={watch('outbound_payment_method')}
                onChange={(value) => setValue('outbound_payment_method', value)}
                options={PAYMENT_METHOD_OPTIONS}
              />
            </div>

            <div>
              <Label htmlFor="outbound_payment_name">
                Nombre del Método de Pago
              </Label>
              <Input
                id="outbound_payment_name"
                {...register('outbound_payment_name')}
                placeholder="Ej: Cheques del Banco XYZ"
              />
            </div>

            <div>
              <Label htmlFor="outbound_pending_account_id">
                Cuenta de Pagos Pendientes
              </Label>
              <AccountSearchInput
                value={watch('outbound_pending_account_id')}
                onChange={(accountId) => setValue('outbound_pending_account_id', accountId)}
                placeholder="Buscar cuenta de pendientes..."
                limit={10}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Configuración avanzada de divisas */}
      {watchAllowCurrencyExchange && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Configuración de Divisas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="profit_account_id">
                Cuenta de Ganancias Cambiarias
              </Label>
              <AccountSearchInput
                value={watch('profit_account_id')}
                onChange={(accountId) => setValue('profit_account_id', accountId)}
                placeholder="Buscar cuenta de ganancias..."
                limit={10}
              />
            </div>

            <div>
              <Label htmlFor="loss_account_id">
                Cuenta de Pérdidas Cambiarias
              </Label>
              <AccountSearchInput
                value={watch('loss_account_id')}
                onChange={(accountId) => setValue('loss_account_id', accountId)}
                placeholder="Buscar cuenta de pérdidas..."
                limit={10}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Descripción */}
      <Card className="p-6">
        <div>
          <Label htmlFor="description">
            Descripción
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Descripción opcional de la configuración bancaria..."
            rows={3}
          />
        </div>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4 mr-2" />
              {initialData ? 'Actualizar' : 'Crear'} Configuración
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default BankJournalConfigForm;