import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { usePaymentTermsList } from '../hooks/usePaymentTerms';
import { PaymentTermsService } from '../services/paymentTermsService';
import { PaymentTermsSelector } from '../components/PaymentTermsSelector';
import { PaymentScheduleDisplay } from '../components/PaymentScheduleDisplay';
import { PaymentTermsModal } from '../components/PaymentTermsModal';
import type { PaymentTerms, PaymentCalculationItem } from '../types';

export const PaymentTermsPage: React.FC = () => {  const { 
    paymentTerms, 
    loading, 
    error, 
    refreshPaymentTerms,
    filters,
    setFilters
  } = usePaymentTermsList({
    initialFilters: { is_active: true },
    autoLoad: true
  });  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState<PaymentTerms | null>(null);
  const [testAmount, setTestAmount] = useState<string>('1000.00');
  const [testInvoiceDate, setTestInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calculatedSchedule, setCalculatedSchedule] = useState<PaymentCalculationItem[]>([]);
  const [calculating, setCalculating] = useState(false);  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Función utilitaria para formatear montos
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('es-ES', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Función utilitaria para validar datos de entrada
  const validateCalculationInputs = () => {
    const errors: string[] = [];
    
    if (!selectedPaymentTerms) {
      errors.push('Debe seleccionar condiciones de pago');
    }
    
    if (!testAmount || testAmount.trim() === '') {
      errors.push('Debe ingresar un monto');
    } else {
      const amount = parseFloat(testAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.push('El monto debe ser un número mayor a 0');
      }
    }
    
    if (!testInvoiceDate) {
      errors.push('Debe seleccionar una fecha de factura');
    }
    
    if (selectedPaymentTerms && (!selectedPaymentTerms.payment_schedules || selectedPaymentTerms.payment_schedules.length === 0)) {
      errors.push('Las condiciones de pago seleccionadas no tienen cronogramas definidos');
    }
    
    return errors;
  };
  // Filter payment terms based on search
  const filteredPaymentTerms = (paymentTerms || []).filter(pt =>
    pt.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pt.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );  const handlePaymentTermsSelect = async (paymentTerms: PaymentTerms | null) => {
    if (!paymentTerms) {
      setSelectedPaymentTerms(null);
      setCalculatedSchedule([]);
      setCalculationError(null);
      return;
    }

    try {
      setLoadingDetails(true);
      setCalculationError(null);
        // Obtener los datos completos por ID
      console.log('📋 Payment Terms - Datos del listado:', {
        id: paymentTerms.id,
        code: paymentTerms.code,
        name: paymentTerms.name,
        schedulesCount: paymentTerms.payment_schedules?.length || 0,
        schedules: paymentTerms.payment_schedules
      });
      
      const fullPaymentTerms = await PaymentTermsService.getPaymentTermsById(paymentTerms.id);
      
      console.log('🔍 Payment Terms - Datos completos obtenidos:', {
        id: fullPaymentTerms.id,
        code: fullPaymentTerms.code,
        name: fullPaymentTerms.name,
        schedulesCount: fullPaymentTerms.payment_schedules?.length || 0,
        schedules: fullPaymentTerms.payment_schedules
      });
      setSelectedPaymentTerms(fullPaymentTerms);
      setCalculatedSchedule([]);
      
    } catch (error) {
      console.error('Error al obtener detalles de payment terms:', error);
      setCalculationError(`Error al cargar detalles: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      // Usar los datos del listado como fallback
      setSelectedPaymentTerms(paymentTerms);
    } finally {
      setLoadingDetails(false);
    }
  };const calculateSchedule = async () => {
    // Limpiar errores previos
    setCalculationError(null);
    
    // Validar entradas
    const validationErrors = validateCalculationInputs();
    if (validationErrors.length > 0) {
      setCalculationError(validationErrors.join('. '));
      return;
    }

    setCalculating(true);
    try {
      const amount = parseFloat(testAmount);
      const invoiceDate = new Date(testInvoiceDate);
      const schedules = selectedPaymentTerms!.payment_schedules || [];
      
      // Verificar que los porcentajes sumen 100%
      const totalPercentage = schedules.reduce((sum, ps) => sum + ps.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        console.warn(`Los porcentajes no suman 100% (suma actual: ${totalPercentage}%)`);
      }
        // Calcular cronograma
      const schedule: PaymentCalculationItem[] = schedules.map((ps) => {
        const paymentDate = new Date(invoiceDate);
        paymentDate.setDate(paymentDate.getDate() + ps.days);
        
        // Calcular monto exacto considerando redondeo
        const scheduleAmount = Math.round((amount * ps.percentage / 100) * 100) / 100;
        
        return {
          sequence: ps.sequence,
          days: ps.days,
          percentage: ps.percentage,
          amount: scheduleAmount,
          payment_date: paymentDate.toISOString().split('T')[0],
          description: ps.description || `Cuota ${ps.sequence} - ${ps.percentage}%`
        };
      });
      
      // Verificar que la suma de montos coincida con el total (ajustar redondeo si es necesario)
      const calculatedTotal = schedule.reduce((sum, item) => sum + item.amount, 0);
      const difference = amount - calculatedTotal;
      
      if (Math.abs(difference) > 0.01) {
        // Ajustar la diferencia en la última cuota
        const lastIndex = schedule.length - 1;
        schedule[lastIndex].amount = Math.round((schedule[lastIndex].amount + difference) * 100) / 100;
        console.info(`Ajuste de redondeo aplicado: ${difference.toFixed(2)} en la última cuota`);
      }

      setCalculatedSchedule(schedule);
        console.log('Cronograma calculado:', {
        paymentTerms: selectedPaymentTerms!.name,
        invoiceDate: testInvoiceDate,
        totalAmount: amount,
        schedulesCount: schedule.length,
        calculatedTotal: schedule.reduce((sum, item) => sum + item.amount, 0),
        schedule
      });
        } catch (error) {
      console.error('Error calculating schedule:', error);
      setCalculationError(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setCalculating(false);
    }
  };const toggleActiveFilter = () => {
    setFilters({ ...filters, is_active: !filters.is_active });
  };
  const handleCreateSuccess = (newPaymentTerms: PaymentTerms) => {
    console.log('Condiciones de pago creadas exitosamente:', newPaymentTerms);
    // Actualizar la lista
    refreshPaymentTerms();
    // Seleccionar las nuevas condiciones de pago creadas
    setSelectedPaymentTerms(newPaymentTerms);
    setShowCreateModal(false);
  };

  const handleEditSuccess = (updatedPaymentTerms: PaymentTerms) => {
    console.log('Condiciones de pago editadas exitosamente:', updatedPaymentTerms);
    // Actualizar la lista
    refreshPaymentTerms();
    // Actualizar las condiciones seleccionadas
    setSelectedPaymentTerms(updatedPaymentTerms);
    setShowEditModal(false);
  };

  const handleEdit = () => {
    if (selectedPaymentTerms) {
      setShowEditModal(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Condiciones de Pago</h1>
          <p className="text-gray-600">Gestión y prueba de condiciones de pago</p>
        </div>        <div className="flex space-x-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
          >
            ➕ Crear Nuevo
          </Button>
          <Button
            onClick={refreshPaymentTerms}
            disabled={loading}
            variant="secondary"
          >
            {loading ? <Spinner size="sm" /> : '🔄'}
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Buscar condiciones</label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Código, nombre o descripción..."
              />
            </div>
            <div>
              <label className="form-label">Estado</label>
              <Button
                onClick={toggleActiveFilter}
                variant={filters.is_active ? "primary" : "secondary"}
                className="w-full"
              >
                {filters.is_active ? 'Activas' : 'Todas'}
              </Button>
            </div>
            <div className="flex items-end">              <div className="text-sm text-gray-600">
                Mostrando {filteredPaymentTerms.length} de {(paymentTerms || []).length} condiciones
              </div>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <ValidationMessage type="error" message={error} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Terms List */}
        <Card>
          <div className="card-header">
            <h2 className="card-title">Lista de Condiciones</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
                <span className="ml-2">Cargando condiciones de pago...</span>
              </div>
            ) : filteredPaymentTerms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron condiciones de pago
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPaymentTerms.map((pt) => (
                  <div
                    key={pt.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentTerms?.id === pt.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handlePaymentTermsSelect(pt)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {pt.code}
                        </span>
                        <span className="ml-2 font-medium">{pt.name}</span>
                      </div>                      <div className="text-xs text-gray-500">
                        {(pt.payment_schedules?.length || 0)} cuota{(pt.payment_schedules?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
                    {pt.description && (
                      <div className="text-sm text-gray-600 mt-1">{pt.description}</div>
                    )}
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{pt.max_days} días máximo</span>
                      <span className={`px-2 py-1 rounded ${
                        pt.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pt.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Payment Terms Details and Calculator */}
        <div className="space-y-4">          {selectedPaymentTerms && (
            <Card>              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    Detalles de Condición
                    {loadingDetails && <Spinner size="sm" className="ml-2" />}
                  </h2>
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    disabled={loadingDetails}
                  >
                    ✏️ Editar
                  </Button>
                </div>
              </div>
              <div className="card-body">
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Spinner size="md" />
                      <div className="mt-2 text-sm text-gray-500">Cargando detalles...</div>
                    </div>
                  </div>
                ) : (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Código</div>
                    <div className="font-mono font-semibold">{selectedPaymentTerms.code}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Nombre</div>
                    <div className="font-medium">{selectedPaymentTerms.name}</div>
                  </div>
                  {selectedPaymentTerms.description && (
                    <div>
                      <div className="text-sm text-gray-600">Descripción</div>
                      <div className="text-sm">{selectedPaymentTerms.description}</div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Días Máximo</div>
                      <div className="font-medium">{selectedPaymentTerms.max_days}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Porcentaje Total</div>
                      <div className="font-medium">{selectedPaymentTerms.total_percentage}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Cronograma</div>                    <div className="space-y-1">
                      {(selectedPaymentTerms.payment_schedules || []).map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <span>Cuota {schedule.sequence}</span>
                          <span>{schedule.days} días</span>
                          <span>{schedule.percentage}%</span>
                        </div>
                      ))}                    </div>
                  </div>
                </div>
                )}
              </div>
            </Card>
          )}

          {/* Calculator */}
          <Card>
            <div className="card-header">
              <h2 className="card-title">Calculadora de Cronograma</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="form-label">Condiciones de Pago</label>
                  <PaymentTermsSelector
                    value={selectedPaymentTerms?.id}
                    onChange={(id) => {
                      const pt = paymentTerms.find(p => p.id === id);
                      handlePaymentTermsSelect(pt || null);
                    }}
                    onPaymentTermsSelect={handlePaymentTermsSelect}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Monto de Factura</label>                    <Input
                      type="number"
                      step="0.01"
                      value={testAmount}
                      onChange={(e) => {
                        setTestAmount(e.target.value);
                        setCalculationError(null); // Limpiar errores al cambiar
                      }}
                      placeholder="1000.00"
                    />
                  </div>
                  <div>
                    <label className="form-label">Fecha de Factura</label>                    <Input
                      type="date"
                      value={testInvoiceDate}
                      onChange={(e) => {
                        setTestInvoiceDate(e.target.value);
                        setCalculationError(null); // Limpiar errores al cambiar
                      }}
                    />
                  </div>
                </div>                <div className="space-y-3">
                  <Button
                    onClick={calculateSchedule}
                    disabled={!selectedPaymentTerms || !testAmount || !testInvoiceDate || calculating}
                    className="w-full"
                    size="lg"
                  >
                    {calculating ? (
                      <div className="flex items-center space-x-2">
                        <Spinner size="sm" />
                        <span>Calculando cronograma...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>📊</span>
                        <span>Calcular Cronograma de Pagos</span>
                      </div>
                    )}
                  </Button>
                  
                  {/* Validaciones visuales */}
                  <div className="space-y-1">
                    <div className={`text-xs flex items-center space-x-2 ${selectedPaymentTerms ? 'text-green-600' : 'text-red-500'}`}>
                      <span>{selectedPaymentTerms ? '✓' : '✗'}</span>
                      <span>Condiciones de pago seleccionadas</span>
                    </div>
                    <div className={`text-xs flex items-center space-x-2 ${testAmount && parseFloat(testAmount) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      <span>{testAmount && parseFloat(testAmount) > 0 ? '✓' : '✗'}</span>
                      <span>Monto válido (mayor a 0)</span>
                    </div>
                    <div className={`text-xs flex items-center space-x-2 ${testInvoiceDate ? 'text-green-600' : 'text-red-500'}`}>
                      <span>{testInvoiceDate ? '✓' : '✗'}</span>
                      <span>Fecha de factura seleccionada</span>
                    </div>
                    {selectedPaymentTerms && (
                      <div className={`text-xs flex items-center space-x-2 ${
                        selectedPaymentTerms.payment_schedules && selectedPaymentTerms.payment_schedules.length > 0 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        <span>{selectedPaymentTerms.payment_schedules && selectedPaymentTerms.payment_schedules.length > 0 ? '✓' : '⚠'}</span>
                        <span>
                          {selectedPaymentTerms.payment_schedules && selectedPaymentTerms.payment_schedules.length > 0 
                            ? `${selectedPaymentTerms.payment_schedules.length} cronograma(s) definido(s)`
                            : 'Sin cronogramas definidos'
                          }
                        </span>                      </div>
                    )}
                  </div>
                  
                  {/* Mostrar errores de cálculo */}
                  {calculationError && (
                    <ValidationMessage 
                      type="error" 
                      message={calculationError} 
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>{/* Calculated Schedule */}
          {calculatedSchedule.length > 0 && (
            <>
              {/* Resumen del cálculo */}
              <Card>
                <div className="card-header">
                  <h3 className="card-title">Resumen del Cálculo</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Condiciones</div>
                      <div className="text-sm font-bold text-blue-800">{selectedPaymentTerms?.name}</div>
                    </div>                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Monto Total</div>
                      <div className="text-sm font-bold text-green-800">
                        ${formatCurrency(parseFloat(testAmount))}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-xs text-purple-600 font-medium">Número de Cuotas</div>
                      <div className="text-sm font-bold text-purple-800">{calculatedSchedule.length}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-xs text-orange-600 font-medium">Plazo Máximo</div>
                      <div className="text-sm font-bold text-orange-800">
                        {Math.max(...calculatedSchedule.map(s => s.days))} días
                      </div>
                    </div>
                  </div>                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Cálculo realizado el {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}
                  </div>
                  <div className="mt-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCalculatedSchedule([])}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      🗑️ Limpiar Cálculo
                    </Button>
                  </div>
                </div>
              </Card>
              
              <PaymentScheduleDisplay
                schedule={calculatedSchedule}
                invoiceAmount={parseFloat(testAmount)}
                invoiceDate={testInvoiceDate}
              />
            </>
          )}
        </div>
      </div>      {/* Modal para crear condiciones de pago */}
      <PaymentTermsModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        title="Crear Nuevas Condiciones de Pago"
      />

      {/* Modal para editar condiciones de pago */}
      <PaymentTermsModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        editingPaymentTerms={selectedPaymentTerms}
        title="Editar Condiciones de Pago"
      />
    </div>
  );
};
