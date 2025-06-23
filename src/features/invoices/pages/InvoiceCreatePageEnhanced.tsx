/**
 * Formulario mejorado de creación de facturas - Estilo Odoo
 * Incluye selección de productos, cuentas contables y preview de asientos
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceTypeConst, type InvoiceType } from '../types';
import { InvoiceAPI } from '../api/invoiceAPI';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/shared/contexts/ToastContext';
import { formatCurrency } from '@/shared/utils/formatters';
import { PlusIcon, TrashIcon, ArrowLeftIcon, PencilIcon } from '@/shared/components/icons';
import { CustomerSearch, ProductSearch, AccountSearch, PaymentTermsSearch } from '../components';

// Estructura de línea de factura mejorada
interface EnhancedInvoiceLine {
  sequence: number;
  product_id?: string;
  product_code?: string;
  product_name?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  account_id: string;
  account_code?: string;
  account_name?: string;
  subtotal?: number;
  discount_amount?: number;
  line_total?: number;
}

interface JournalEntryPreview {
  debit_lines: Array<{
    id: string; // Para edición
    account_id?: string; // ID de la cuenta para edición
    account_code: string;
    account_name: string;
    description: string;
    debit_amount: number;
    is_editable?: boolean; // Para permitir edición manual
  }>;
  credit_lines: Array<{
    id: string; // Para edición
    account_id?: string; // ID de la cuenta para edición
    account_code: string;
    account_name: string;
    description: string;
    credit_amount: number;
    is_editable?: boolean; // Para permitir edición manual
  }>;
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
}

export function InvoiceCreatePageEnhanced() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'info' | 'lines' | 'preview'>('info');

  // Estado del formulario principal
  const [formData, setFormData] = useState({
    invoice_type: InvoiceTypeConst.CUSTOMER_INVOICE,
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 días
    payment_term_id: '',
    currency_code: 'COP',
    exchange_rate: 1,
    description: '',
    notes: '',
    lines: [] as EnhancedInvoiceLine[]
  });

  // Estado de la línea actual en edición
  const [currentLine, setCurrentLine] = useState<EnhancedInvoiceLine>({
    sequence: 1,
    product_id: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    discount_percentage: 0,
    account_id: '',
    subtotal: 0,
    discount_amount: 0,
    line_total: 0
  });  // Estado del preview de asiento contable
  const [journalEntryPreview, setJournalEntryPreview] = useState<JournalEntryPreview | null>(null);
  const [isEditingPreview, setIsEditingPreview] = useState(false);
  const [saving, setSaving] = useState(false);
    // Estado para información adicional  
  const [selectedPaymentTermInfo, setSelectedPaymentTermInfo] = useState<{ name: string; days?: number; code?: string }>({ name: '' });
  
  // Calcular totales de línea automáticamente
  useEffect(() => {
    const subtotal = currentLine.quantity * currentLine.unit_price;
    const discount_amount = subtotal * (currentLine.discount_percentage / 100);
    const line_total = subtotal - discount_amount;
    
    setCurrentLine(prev => ({ 
      ...prev, 
      subtotal,
      discount_amount,
      line_total
    }));
  }, [currentLine.quantity, currentLine.unit_price, currentLine.discount_percentage]);
  // Generar preview del asiento contable
  const generateJournalEntryPreview = useCallback(() => {
    if (formData.lines.length === 0 || !formData.customer_id) {
      setJournalEntryPreview(null);
      return;
    }    const debit_lines: Array<{
      id: string;
      account_id?: string;
      account_code: string;
      account_name: string;
      description: string;
      debit_amount: number;
      is_editable?: boolean;
    }> = [];
    
    const credit_lines: Array<{
      id: string;
      account_id?: string;
      account_code: string;
      account_name: string;
      description: string;
      credit_amount: number;
      is_editable?: boolean;
    }> = [];

    const total_amount = formData.lines.reduce((sum: number, line: EnhancedInvoiceLine) => {
      return sum + (line.line_total || 0);
    }, 0);    // Línea de débito: Cuenta por cobrar clientes
    debit_lines.push({
      id: 'debit-receivable',
      account_id: '1305', // ID de ejemplo, debería venir de un select real
      account_code: '1305',
      account_name: 'Cuentas por Cobrar - Clientes',
      description: `Factura de venta`,
      debit_amount: total_amount,
      is_editable: true
    });

    // Líneas de crédito: Ventas por línea
    formData.lines.forEach((line, index) => {
      const line_total = line.line_total || 0;
      
      credit_lines.push({
        id: `credit-line-${index}`,
        account_id: line.account_id || '4135', // Usar el account_id de la línea
        account_code: line.account_code || '4135',
        account_name: line.account_name || 'Ventas de Productos/Servicios',
        description: line.description,
        credit_amount: line_total,
        is_editable: true
      });
    });

    const total_debit = debit_lines.reduce((sum, line) => sum + line.debit_amount, 0);
    const total_credit = credit_lines.reduce((sum, line) => sum + line.credit_amount, 0);

    setJournalEntryPreview({
      debit_lines,
      credit_lines,
      total_debit,
      total_credit,
      is_balanced: Math.abs(total_debit - total_credit) < 0.01
    });
  }, [formData.lines, formData.customer_id]);
  // Actualizar preview cuando cambien las líneas
  useEffect(() => {
    generateJournalEntryPreview();
  }, [generateJournalEntryPreview]);

  // Funciones para editar el preview del asiento contable
  const handleDebitAmountChange = (lineId: string, newAmount: number) => {
    if (!journalEntryPreview) return;
    
    const updatedDebitLines = journalEntryPreview.debit_lines.map(line => 
      line.id === lineId ? { ...line, debit_amount: newAmount } : line
    );
    
    const total_debit = updatedDebitLines.reduce((sum, line) => sum + line.debit_amount, 0);
    const total_credit = journalEntryPreview.total_credit;
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      debit_lines: updatedDebitLines,
      total_debit,
      is_balanced: Math.abs(total_debit - total_credit) < 0.01
    });
  };

  const handleCreditAmountChange = (lineId: string, newAmount: number) => {
    if (!journalEntryPreview) return;
    
    const updatedCreditLines = journalEntryPreview.credit_lines.map(line => 
      line.id === lineId ? { ...line, credit_amount: newAmount } : line
    );
    
    const total_credit = updatedCreditLines.reduce((sum, line) => sum + line.credit_amount, 0);
    const total_debit = journalEntryPreview.total_debit;
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      credit_lines: updatedCreditLines,      total_credit,
      is_balanced: Math.abs(total_debit - total_credit) < 0.01
    });
  };

  const togglePreviewEditing = () => {
    setIsEditingPreview(!isEditingPreview);
  };

  // Funciones adicionales para edición completa del preview
  const handleDebitAccountChange = (lineId: string, accountId: string, accountInfo: any) => {
    if (!journalEntryPreview) return;
    
    const updatedDebitLines = journalEntryPreview.debit_lines.map(line => 
      line.id === lineId ? { 
        ...line, 
        account_id: accountId,
        account_code: accountInfo.code || '',
        account_name: accountInfo.name || ''
      } : line
    );
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      debit_lines: updatedDebitLines
    });
  };

  const handleCreditAccountChange = (lineId: string, accountId: string, accountInfo: any) => {
    if (!journalEntryPreview) return;
    
    const updatedCreditLines = journalEntryPreview.credit_lines.map(line => 
      line.id === lineId ? { 
        ...line, 
        account_id: accountId,
        account_code: accountInfo.code || '',
        account_name: accountInfo.name || ''
      } : line
    );
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      credit_lines: updatedCreditLines
    });
  };

  const handleDebitDescriptionChange = (lineId: string, newDescription: string) => {
    if (!journalEntryPreview) return;
    
    const updatedDebitLines = journalEntryPreview.debit_lines.map(line => 
      line.id === lineId ? { ...line, description: newDescription } : line
    );
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      debit_lines: updatedDebitLines
    });
  };

  const handleCreditDescriptionChange = (lineId: string, newDescription: string) => {
    if (!journalEntryPreview) return;
    
    const updatedCreditLines = journalEntryPreview.credit_lines.map(line => 
      line.id === lineId ? { ...line, description: newDescription } : line
    );
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      credit_lines: updatedCreditLines
    });
  };

  const handleRemoveDebitLine = (lineId: string) => {
    if (!journalEntryPreview) return;
    
    const updatedDebitLines = journalEntryPreview.debit_lines.filter(line => line.id !== lineId);
    const total_debit = updatedDebitLines.reduce((sum, line) => sum + line.debit_amount, 0);
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      debit_lines: updatedDebitLines,
      total_debit,
      is_balanced: Math.abs(total_debit - journalEntryPreview.total_credit) < 0.01
    });
  };

  const handleRemoveCreditLine = (lineId: string) => {
    if (!journalEntryPreview) return;
    
    const updatedCreditLines = journalEntryPreview.credit_lines.filter(line => line.id !== lineId);
    const total_credit = updatedCreditLines.reduce((sum, line) => sum + line.credit_amount, 0);
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      credit_lines: updatedCreditLines,
      total_credit,
      is_balanced: Math.abs(journalEntryPreview.total_debit - total_credit) < 0.01
    });
  };
  // Añadir nueva línea de débito al preview
  const addDebitLine = () => {
    if (!journalEntryPreview) return;
    
    const newLine = {
      id: `debit-manual-${Date.now()}`,
      account_id: '',
      account_code: '',
      account_name: '',
      description: 'Nueva línea de débito',
      debit_amount: 0,
      is_editable: true
    };
    
    const updatedDebitLines = [...journalEntryPreview.debit_lines, newLine];
    const total_debit = updatedDebitLines.reduce((sum, line) => sum + line.debit_amount, 0);
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      debit_lines: updatedDebitLines,
      total_debit,
      is_balanced: Math.abs(total_debit - journalEntryPreview.total_credit) < 0.01
    });
  };

  // Añadir nueva línea de crédito al preview
  const addCreditLine = () => {
    if (!journalEntryPreview) return;
    
    const newLine = {
      id: `credit-manual-${Date.now()}`,
      account_id: '',
      account_code: '',
      account_name: '',
      description: 'Nueva línea de crédito',
      credit_amount: 0,
      is_editable: true
    };
    
    const updatedCreditLines = [...journalEntryPreview.credit_lines, newLine];
    const total_credit = updatedCreditLines.reduce((sum, line) => sum + line.credit_amount, 0);
    
    setJournalEntryPreview({
      ...journalEntryPreview,
      credit_lines: updatedCreditLines,
      total_credit,
      is_balanced: Math.abs(journalEntryPreview.total_debit - total_credit) < 0.01
    });
  };// Manejar cambios en inputs del formulario principal
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };  // Manejar cambio de cliente
  const handleCustomerChange = (customerId: string, _customerInfo: { code?: string; name: string }) => {
    setFormData(prev => ({ ...prev, customer_id: customerId }));
  };

  // Manejar cambio de plan de pagos
  const handlePaymentTermChange = (paymentTermId: string, paymentTermInfo: { name: string; days?: number; code?: string }) => {
    setFormData(prev => ({ ...prev, payment_term_id: paymentTermId }));
    setSelectedPaymentTermInfo(paymentTermInfo);
    
    // Calcular automáticamente la fecha de vencimiento basada en los días del plan de pago
    if (paymentTermInfo.days && paymentTermInfo.days > 0) {
      const invoiceDate = new Date(formData.invoice_date);
      const dueDate = new Date(invoiceDate.getTime() + (paymentTermInfo.days * 24 * 60 * 60 * 1000));
      setFormData(prev => ({ 
        ...prev, 
        payment_term_id: paymentTermId,
        due_date: dueDate.toISOString().split('T')[0]
      }));
    }
  };

  // Añadir línea a la factura
  const handleAddLine = () => {
    if (!currentLine.description || !currentLine.account_id || currentLine.unit_price <= 0) {
      showToast('Por favor complete todos los campos obligatorios de la línea', 'error');
      return;
    }

    const newLine: EnhancedInvoiceLine = {
      ...currentLine,
      sequence: formData.lines.length + 1,
    };

    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, newLine]
    }));

    // Limpiar formulario de línea
    setCurrentLine({
      sequence: formData.lines.length + 2,
      product_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
      account_id: '',
      subtotal: 0,
      discount_amount: 0,
      line_total: 0
    });
  };

  // Eliminar línea
  const handleRemoveLine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  // Crear factura
  const handleCreateInvoice = async () => {
    if (!formData.customer_id) {
      showToast('Por favor seleccione un cliente', 'error');
      return;
    }    if (formData.lines.length === 0) {
      showToast('Por favor añada al menos una línea a la factura', 'error');
      return;
    }    if (!formData.customer_id) {
      showToast('Por favor seleccione un cliente', 'error');
      return;
    }

    setSaving(true);
    try {
      // Preparar datos para el backend en el formato correcto
      const invoiceData = {
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        invoice_type: formData.invoice_type as InvoiceType,
        currency_code: formData.currency_code || "USD",
        exchange_rate: formData.exchange_rate || 1,
        description: formData.description || "",
        notes: formData.notes || "",
        invoice_number: "", // Se genera automáticamente
        third_party_id: formData.customer_id, // Ya validamos que no esté vacío
        journal_id: undefined,
        payment_terms_id: formData.payment_term_id || undefined,
        third_party_account_id: undefined,
        lines: formData.lines.map(line => ({
          sequence: line.sequence,
          product_id: line.product_id || undefined,
          description: line.description,
          quantity: line.quantity,
          unit_price: line.unit_price,
          discount_percentage: line.discount_percentage,
          account_id: line.account_id || undefined,
          cost_center_id: undefined,
          tax_ids: []
        }))
      };

      // Debug: Log the data being sent
      console.log('Sending invoice data:', invoiceData);

      // Usar InvoiceAPI para crear la factura
      const invoice = await InvoiceAPI.createInvoiceWithLines(invoiceData);
      showToast('Factura creada exitosamente', 'success');
      navigate(`/invoices/${invoice.id}`);
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      showToast(error instanceof Error ? error.message : 'Error al crear la factura', 'error');
    } finally {
      setSaving(false);
    }  };

  const totalAmount = formData.lines.reduce((sum, line) => sum + (line.line_total || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Volver a Facturas
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Factura</h1>
              <p className="text-gray-600">Crear factura con líneas de productos/servicios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Información General
            </button>
            <button
              onClick={() => setActiveTab('lines')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lines'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Líneas de Factura ({formData.lines.length})
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Preview Asiento Contable
            </button>
          </nav>
        </div>
      </div>

      {/* Tab: Información General */}
      {activeTab === 'info' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Información de la Factura</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>              <CustomerSearch
                value={formData.customer_id}
                onChange={handleCustomerChange}
                placeholder="Buscar cliente por nombre o código..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Factura
              </label>
              <Select
                value={formData.invoice_type}
                onChange={(value: string) => handleInputChange('invoice_type', value)}                options={[                  { value: InvoiceTypeConst.CUSTOMER_INVOICE, label: 'Factura de Cliente' },
                  { value: InvoiceTypeConst.SUPPLIER_INVOICE, label: 'Factura de Proveedor' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Factura *
              </label>
              <Input
                type="date"
                value={formData.invoice_date}
                onChange={(e) => handleInputChange('invoice_date', e.target.value)}
                required
              />
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento *
                {formData.payment_term_id && (
                  <span className="text-xs text-blue-600 ml-2">
                    (Calculada automáticamente desde el plan de pagos)
                  </span>
                )}
              </label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                disabled={!!formData.payment_term_id} // Deshabilitar si hay plan de pagos
                className={formData.payment_term_id ? 'bg-gray-100 cursor-not-allowed' : ''}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan de Pagos (opcional)
              </label>              <PaymentTermsSearch
                value={formData.payment_term_id}
                onChange={handlePaymentTermChange}
                placeholder="Seleccionar plan de pagos..."
              />
              {selectedPaymentTermInfo.name && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                  <div className="text-sm text-blue-800">
                    ✓ Plan seleccionado: <strong>{selectedPaymentTermInfo.name}</strong>
                    {selectedPaymentTermInfo.days && (
                      <span className="ml-2">({selectedPaymentTermInfo.days} días)</span>
                    )}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    La fecha de vencimiento se calculó automáticamente
                  </div>
                </div>
              )}
            </div><div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <Select
                value={formData.currency_code}
                onChange={(value: string) => handleInputChange('currency_code', value)}
                options={[
                  { value: 'COP', label: 'COP - Peso Colombiano' },
                  { value: 'USD', label: 'USD - Dólar Americano' },
                  { value: 'EUR', label: 'EUR - Euro' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción general de la factura"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas adicionales..."
                rows={3}
              />
            </div>
          </div>
        </Card>
      )}      {/* Tab: Líneas de Factura */}
      {activeTab === 'lines' && (
        <div className="space-y-6">
          {/* Formulario para agregar nueva línea */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Agregar Línea de Factura</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto (opcional)
                </label>
                <ProductSearch
                  value={currentLine.product_id || ''}
                  onChange={(productId, productInfo) => {
                    setCurrentLine(prev => ({
                      ...prev,
                      product_id: productId,
                      product_code: productInfo.code || '',
                      product_name: productInfo.name,
                      description: productInfo.description || productInfo.name,
                      unit_price: productInfo.price || 0,
                    }));
                  }}
                  placeholder="Buscar producto por nombre o código..."
                />
              </div>

              <div>                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuenta Contable *
                </label>
                <AccountSearch
                  value={currentLine.account_id}
                  onChange={(accountId, accountInfo) => {
                    setCurrentLine(prev => ({
                      ...prev,
                      account_id: accountId,
                      account_code: accountInfo.code,
                      account_name: accountInfo.name
                    }));
                  }}                  placeholder="Buscar cuenta contable..."
                  // allowedTypes={['ingreso', 'gasto']} // Para facturas, típicamente cuentas de ingresos o gastos (temporalmente deshabilitado para debug)
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <Input
                  type="text"
                  value={currentLine.description}
                  onChange={(e) => setCurrentLine(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del producto/servicio"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad *
                </label>
                <Input
                  type="number"
                  value={currentLine.quantity}
                  onChange={(e) => setCurrentLine(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Unitario *
                </label>
                <Input
                  type="number"
                  value={currentLine.unit_price}
                  onChange={(e) => setCurrentLine(prev => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento (%)
                </label>
                <Input
                  type="number"
                  value={currentLine.discount_percentage}
                  onChange={(e) => setCurrentLine(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            {/* Totales de línea */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Subtotal:</span>
                  <div className="font-medium">{formatCurrency(currentLine.subtotal || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Descuento:</span>
                  <div className="font-medium text-red-600">-{formatCurrency(currentLine.discount_amount || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total Línea:</span>
                  <div className="font-bold text-green-600">{formatCurrency(currentLine.line_total || 0)}</div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddLine}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Agregar Línea
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Lista de líneas existentes */}
          {formData.lines.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Líneas de la Factura</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descuento
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.lines.map((line, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            {line.description}
                            {line.product_code && (
                              <div className="text-xs text-gray-500">{line.product_code}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {line.account_code} - {line.account_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {line.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(line.unit_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                          {line.discount_percentage > 0 && `-${formatCurrency(line.discount_amount || 0)}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(line.line_total || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveLine(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total Factura:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(totalAmount)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}      {/* Tab: Preview Asiento Contable */}
      {activeTab === 'preview' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Preview del Asiento Contable</h2>            <Button
              variant="outline"
              onClick={togglePreviewEditing}
              className="flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              {isEditingPreview ? 'Finalizar Edición' : 'Editar Asiento'}
            </Button>
          </div>
          {journalEntryPreview ? (
            <div className="space-y-6">              {/* Tabla de asientos al estilo journal entries */}
              <div className="overflow-x-auto">
                <table className={`min-w-full divide-y divide-gray-200 ${isEditingPreview ? 'table-fixed' : ''}`}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isEditingPreview ? 'w-80' : ''}`}>
                        Cuenta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Débito
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Crédito
                      </th>
                      {isEditingPreview && (
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">                    {/* Líneas de débito */}
                    {journalEntryPreview.debit_lines.map((line) => (
                      <tr key={`debit-${line.id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 min-w-80 relative">
                          {isEditingPreview && line.is_editable ? (
                            <div className="w-full relative">
                              <AccountSearch
                                value={line.account_id || ''}
                                onChange={(accountId, accountInfo) => handleDebitAccountChange(line.id, accountId, accountInfo)}
                                placeholder="Seleccionar cuenta..."
                                className="text-sm w-full"
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {line.account_code}
                              </div>
                              <div className="text-sm text-gray-500">
                                {line.account_name}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditingPreview && line.is_editable ? (
                            <Input
                              type="text"
                              value={line.description}
                              onChange={(e) => handleDebitDescriptionChange(line.id, e.target.value)}
                              placeholder="Descripción..."
                              className="w-48 text-sm"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {line.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isEditingPreview && line.is_editable ? (
                            <Input
                              type="number"
                              value={line.debit_amount}
                              onChange={(e) => handleDebitAmountChange(line.id, parseFloat(e.target.value) || 0)}
                              step="0.01"
                              min="0"
                              className="w-32 text-right text-sm"
                            />
                          ) : (
                            <div className="text-sm font-medium text-green-600">
                              {formatCurrency(line.debit_amount)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-400">
                            -
                          </div>
                        </td>
                        {isEditingPreview && (
                          <td className="px-6 py-4 text-center">
                            {line.is_editable && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveDebitLine(line.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}                      {/* Líneas de crédito */}
                    {journalEntryPreview.credit_lines.map((line) => (
                      <tr key={`credit-${line.id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 min-w-80 relative">
                          {isEditingPreview && line.is_editable ? (
                            <div className="w-full relative">
                              <AccountSearch
                                value={line.account_id || ''}
                                onChange={(accountId, accountInfo) => handleCreditAccountChange(line.id, accountId, accountInfo)}
                                placeholder="Seleccionar cuenta..."
                                className="text-sm w-full"
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {line.account_code}
                              </div>
                              <div className="text-sm text-gray-500">
                                {line.account_name}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditingPreview && line.is_editable ? (
                            <Input
                              type="text"
                              value={line.description}
                              onChange={(e) => handleCreditDescriptionChange(line.id, e.target.value)}
                              placeholder="Descripción..."
                              className="w-48 text-sm"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {line.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-400">
                            -
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isEditingPreview && line.is_editable ? (
                            <Input
                              type="number"
                              value={line.credit_amount}
                              onChange={(e) => handleCreditAmountChange(line.id, parseFloat(e.target.value) || 0)}
                              step="0.01"
                              min="0"
                              className="w-32 text-right text-sm"
                            />
                          ) : (
                            <div className="text-sm font-medium text-blue-600">
                              {formatCurrency(line.credit_amount)}
                            </div>
                          )}
                        </td>
                        {isEditingPreview && (
                          <td className="px-6 py-4 text-center">
                            {line.is_editable && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveCreditLine(line.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  
                  {/* Totales */}
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Totales:
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-green-700">
                        {formatCurrency(journalEntryPreview.total_debit)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-blue-700">
                        {formatCurrency(journalEntryPreview.total_credit)}
                      </td>
                    </tr>
                    {!journalEntryPreview.is_balanced && (
                      <tr>
                        <td colSpan={2} className="px-6 py-4 text-right text-sm font-medium text-red-900">
                          Diferencia:
                        </td>
                        <td colSpan={2} className="px-6 py-4 text-right text-sm font-bold text-red-700">
                          {formatCurrency(Math.abs(journalEntryPreview.total_debit - journalEntryPreview.total_credit))}
                          <span className="text-xs ml-1">
                            ({journalEntryPreview.total_debit > journalEntryPreview.total_credit ? 'Exceso débitos' : 'Exceso créditos'})
                          </span>
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>              </div>

              {/* Botones para agregar líneas en modo edición */}
              {isEditingPreview && (
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={addDebitLine}
                    className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Agregar Línea Débito
                  </Button>
                  <Button
                    variant="outline"
                    onClick={addCreditLine}
                    className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Agregar Línea Crédito
                  </Button>
                </div>
              )}

              {/* Estado del balance */}
              <div className="flex justify-end">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  journalEntryPreview.is_balanced 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {journalEntryPreview.is_balanced ? '✓ Asiento Balanceado' : '✗ Asiento No Balanceado'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg font-medium">Agregue líneas a la factura</p>
              <p className="text-sm">El preview del asiento contable se mostrará aquí</p>
            </div>
          )}
        </Card>
      )}

      {/* Acciones */}
      <div className="mt-8 flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/invoices')}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleCreateInvoice}
          disabled={saving || formData.lines.length === 0 || !formData.customer_id}          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? 'Creando...' : 'Crear Factura'}
        </Button>
      </div>
    </div>
  );
}