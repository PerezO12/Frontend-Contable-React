import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useJournalEntryDetails } from '../hooks';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { 
  JOURNAL_ENTRY_STATUS_LABELS,
  JOURNAL_ENTRY_TYPE_LABELS,
  type JournalEntry 
} from '../types';

interface JournalEntryEnrichedDetailProps {
  entryId: string;
  onEdit?: (entry: JournalEntry) => void;
  className?: string;
}

type TabType = 'overview' | 'products' | 'thirdparties' | 'payments' | 'lines' | 'calculations';

export const JournalEntryEnrichedDetail: React.FC<JournalEntryEnrichedDetailProps> = ({
  entryId,
  onEdit,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
    const {
    entry,
    loading,
    error,
    products,
    thirdParties,
    paymentTerms,
    enrichedPaymentTerms,
    calculationSummary,
    validation,
    aggregatedInfo,
    hasEnrichedPaymentTerms
  } = useJournalEntryDetails(entryId);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error || 'Asiento contable no encontrado'}
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'draft': return `${baseClass} bg-gray-100 text-gray-800`;
      case 'pending': return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'approved': return `${baseClass} bg-blue-100 text-blue-800`;
      case 'posted': return `${baseClass} bg-green-100 text-green-800`;
      case 'cancelled': return `${baseClass} bg-red-100 text-red-800`;
      default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Resumen' },
    { id: 'products', label: `Productos (${products.length})`, show: products.length > 0 },
    { id: 'thirdparties', label: `Terceros (${thirdParties.length})`, show: thirdParties.length > 0 },
    { id: 'payments', label: `Términos Pago (${paymentTerms.length})`, show: paymentTerms.length > 0 },
    { id: 'lines', label: `Líneas (${entry.lines?.length || 0})` },
    { id: 'calculations', label: 'Cálculos', show: calculationSummary.lines_with_products > 0 }
  ].filter(tab => tab.show !== false);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Encabezado */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{entry.number}</h2>
            <p className="text-gray-600 mt-1">{entry.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={getStatusBadgeClass(entry.status)}>
              {JOURNAL_ENTRY_STATUS_LABELS[entry.status]}
            </span>
            {entry.can_be_edited && onEdit && (
              <Button onClick={() => onEdit(entry)} size="sm" variant="outline">
                ✏️ Editar
              </Button>
            )}
          </div>
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Fecha:</span>
            <p className="font-medium">{formatDate(entry.entry_date)}</p>
          </div>
          <div>
            <span className="text-gray-500">Tipo:</span>
            <p className="font-medium">{JOURNAL_ENTRY_TYPE_LABELS[entry.entry_type]}</p>
          </div>
          <div>
            <span className="text-gray-500">Total Débito:</span>
            <p className="font-medium text-green-600">{formatCurrency(parseFloat(entry.total_debit))}</p>
          </div>
          <div>
            <span className="text-gray-500">Total Crédito:</span>
            <p className="font-medium text-red-600">{formatCurrency(parseFloat(entry.total_credit))}</p>
          </div>
        </div>

        {/* Indicadores de estado */}
        <div className="flex flex-wrap gap-2 mt-4">
          {entry.is_balanced && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Balanceado
            </span>
          )}
          {entry.can_be_posted && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Puede ser contabilizado
            </span>
          )}
          {aggregatedInfo?.productSummary.hasProducts && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              🛒 Con productos
            </span>
          )}
          {aggregatedInfo?.statusInfo.hasDiscounts && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Con descuentos
            </span>
          )}          {aggregatedInfo?.statusInfo.hasTaxes && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Con impuestos
            </span>
          )}
          {hasEnrichedPaymentTerms && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              📅 Cronogramas Calculados
            </span>
          )}
        </div>

        {/* Validación */}
        {!validation.is_valid && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-1">Problemas encontrados:</h4>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {validation.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de pestañas */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <OverviewTab 
            entry={entry} 
            aggregatedInfo={aggregatedInfo}
            calculationSummary={calculationSummary}
          />
        )}
        
        {activeTab === 'products' && (
          <ProductsTab products={products} />
        )}
        
        {activeTab === 'thirdparties' && (
          <ThirdPartiesTab thirdParties={thirdParties} />
        )}
          {activeTab === 'payments' && (
          <PaymentTermsTab 
            paymentTerms={paymentTerms}
            enrichedPaymentTerms={enrichedPaymentTerms}
          />
        )}
        
        {activeTab === 'lines' && (
          <LinesTab lines={entry.lines || []} />
        )}
        
        {activeTab === 'calculations' && (
          <CalculationsTab 
            calculationSummary={calculationSummary}
            lines={entry.lines || []}
          />
        )}
      </div>
    </div>
  );
};

// Componentes para cada pestaña
const OverviewTab: React.FC<{
  entry: JournalEntry;
  aggregatedInfo: any;
  calculationSummary: any;
}> = ({ entry, aggregatedInfo, calculationSummary }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card className="p-4">
      <h3 className="font-medium text-gray-900 mb-3">Información General</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Referencia:</span>
          <span>{entry.reference || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Origen:</span>
          <span>{entry.transaction_origin || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Líneas:</span>
          <span>{entry.lines?.length || 0}</span>
        </div>
      </div>
    </Card>

    <Card className="p-4">
      <h3 className="font-medium text-gray-900 mb-3">Resumen de Entidades</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Productos:</span>
          <span>{aggregatedInfo?.productSummary.count || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Terceros:</span>
          <span>{aggregatedInfo?.thirdPartySummary.count || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Términos Pago:</span>
          <span>{aggregatedInfo?.paymentTermsSummary.count || 0}</span>
        </div>
      </div>
    </Card>

    <Card className="p-4">
      <h3 className="font-medium text-gray-900 mb-3">Totales</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Descuentos:</span>
          <span>{formatCurrency(parseFloat(calculationSummary.total_discount))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Impuestos:</span>
          <span>{formatCurrency(parseFloat(calculationSummary.total_taxes))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Neto:</span>
          <span className="font-medium">{formatCurrency(parseFloat(calculationSummary.total_net))}</span>
        </div>
      </div>
    </Card>
  </div>
);

const ProductsTab: React.FC<{ products: any[] }> = ({ products }) => (
  <Card className="p-6">
    <h3 className="font-medium text-gray-900 mb-4">Productos</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.quantity} {product.measurement_unit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(parseFloat(product.effective_unit_price || product.unit_price || '0'))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(parseFloat(product.total_amount || '0'))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const ThirdPartiesTab: React.FC<{ thirdParties: any[] }> = ({ thirdParties }) => (
  <Card className="p-6">
    <h3 className="font-medium text-gray-900 mb-4">Terceros</h3>
    <div className="space-y-4">
      {thirdParties.map((thirdParty, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{thirdParty.name}</h4>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {thirdParty.type}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Código:</span> {thirdParty.code}
            </div>
            <div>
              <span className="font-medium">Documento:</span> {thirdParty.document_number}
            </div>
            {thirdParty.email && (
              <div>
                <span className="font-medium">Email:</span> {thirdParty.email}
              </div>
            )}
            {thirdParty.phone && (
              <div>
                <span className="font-medium">Teléfono:</span> {thirdParty.phone}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const PaymentTermsTab: React.FC<{ paymentTerms: any[]; enrichedPaymentTerms?: Map<string, any> }> = ({ 
  paymentTerms, 
  enrichedPaymentTerms 
}) => (
  <Card className="p-6">
    <h3 className="font-medium text-gray-900 mb-4">Términos de Pago</h3>
    <div className="space-y-6">
      {paymentTerms.map((term, index) => {
        // Buscar información enriquecida si está disponible
        const enrichedTerm = enrichedPaymentTerms?.get(term.id);
        const hasPaymentSchedule = enrichedTerm?.payment_schedule?.length > 0;
        
        return (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-900">{term.name}</h4>
              {hasPaymentSchedule && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Cronograma Calculado
                </span>
              )}
              {enrichedTerm?.error && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Error en Cálculo
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Código:</span> {term.code}
              </div>
              <div>
                <span className="font-medium">Fecha Factura:</span> {formatDate(term.invoice_date)}
              </div>
              <div>
                <span className="font-medium">Fecha Vencimiento Final:</span> 
                <span className={enrichedTerm?.calculated_final_due_date ? 'font-medium text-blue-600' : ''}>
                  {formatDate(enrichedTerm?.calculated_final_due_date || term.due_date)}
                  {enrichedTerm?.calculated_final_due_date && (
                    <span className="text-xs text-blue-500 ml-1">(Calculada)</span>
                  )}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Descripción:</span> {term.description}
              </div>
            </div>

            {/* Mostrar cronograma de pagos si está disponible */}
            {hasPaymentSchedule && (
              <div className="mt-4">
                <h5 className="font-medium text-gray-800 mb-2">Cronograma de Pagos:</h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Días</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha Pago</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrichedTerm.payment_schedule.map((payment: any, paymentIndex: number) => (
                        <tr key={paymentIndex}>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                            {payment.sequence}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                            {payment.days}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                            {payment.percentage}%
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                            {formatDate(payment.payment_date)}
                          </td>
                          <td className="px-3 py-2 text-gray-900">
                            {payment.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Totales del cronograma */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Cronograma:</span>
                      <div className="font-medium">{formatCurrency(enrichedTerm.calculation?.total_amount || 0)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Número de Pagos:</span>
                      <div className="font-medium">{enrichedTerm.payment_schedule.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Días Máximos:</span>
                      <div className="font-medium">{enrichedTerm.max_days || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mostrar información básica si no hay cronograma */}
            {!hasPaymentSchedule && term.needs_detailed_calculation && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <div className="text-yellow-600 mr-2">⚠️</div>
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800">Información Básica</div>
                    <div className="text-yellow-700">
                      Esta información es básica. Para ver el cronograma detallado de pagos, 
                      se necesita obtener los términos de pago completos.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </Card>
);

const LinesTab: React.FC<{ lines: any[] }> = ({ lines }) => (
  <Card className="p-6">
    <h3 className="font-medium text-gray-900 mb-4">Líneas del Asiento</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuenta</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Débito</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crédito</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lines.map((line) => (
            <tr key={line.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {line.line_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{line.account_code}</div>
                  <div className="text-gray-500">{line.account_name}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {line.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                {parseFloat(line.debit_amount) > 0 ? formatCurrency(parseFloat(line.debit_amount)) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                {parseFloat(line.credit_amount) > 0 ? formatCurrency(parseFloat(line.credit_amount)) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const CalculationsTab: React.FC<{ 
  calculationSummary: any; 
  lines: any[] 
}> = ({ calculationSummary, lines }) => {
  const linesWithProducts = lines.filter(line => line.product_id);
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-medium text-gray-900 mb-4">Resumen de Cálculos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(parseFloat(calculationSummary.total_discount))}
            </div>
            <div className="text-sm text-gray-500">Total Descuentos</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(parseFloat(calculationSummary.total_taxes))}
            </div>
            <div className="text-sm text-gray-500">Total Impuestos</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(parseFloat(calculationSummary.total_net))}
            </div>
            <div className="text-sm text-gray-500">Total Neto</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(parseFloat(calculationSummary.total_gross))}
            </div>
            <div className="text-sm text-gray-500">Total Bruto</div>
          </div>
        </div>
      </Card>

      {linesWithProducts.length > 0 && (
        <Card className="p-6">
          <h3 className="font-medium text-gray-900 mb-4">Detalles por Línea con Productos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cant.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">P. Unit.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impuestos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {linesWithProducts.map((line) => (
                  <tr key={line.id}>
                    <td className="px-4 py-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{line.product_name}</div>
                        <div className="text-gray-500">{line.product_code}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {line.quantity}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(parseFloat(line.effective_unit_price || line.unit_price || '0'))}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(parseFloat(line.subtotal_before_discount || '0'))}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(parseFloat(line.total_discount || '0'))}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(parseFloat(line.tax_amount || '0'))}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(parseFloat(line.gross_amount || line.net_amount || '0'))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
