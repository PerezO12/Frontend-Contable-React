import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useJournalEntryDetails } from '../hooks';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { JOURNAL_ENTRY_STATUS_LABELS, JOURNAL_ENTRY_TYPE_LABELS } from '../types';
export var JournalEntryEnrichedDetail = function (_a) {
    var _b;
    var entryId = _a.entryId, onEdit = _a.onEdit, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = useState('overview'), activeTab = _d[0], setActiveTab = _d[1];
    var _e = useJournalEntryDetails(entryId), entry = _e.entry, loading = _e.loading, error = _e.error, products = _e.products, thirdParties = _e.thirdParties, paymentTerms = _e.paymentTerms, enrichedPaymentTerms = _e.enrichedPaymentTerms, calculationSummary = _e.calculationSummary, validation = _e.validation, aggregatedInfo = _e.aggregatedInfo, hasEnrichedPaymentTerms = _e.hasEnrichedPaymentTerms;
    if (loading) {
        return (<div className="flex justify-center items-center p-8">
        <Spinner size="lg"/>
      </div>);
    }
    if (error || !entry) {
        return (<div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error || 'Asiento contable no encontrado'}
      </div>);
    }
    var getStatusBadgeClass = function (status) {
        var baseClass = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'draft': return "".concat(baseClass, " bg-gray-100 text-gray-800");
            case 'pending': return "".concat(baseClass, " bg-yellow-100 text-yellow-800");
            case 'approved': return "".concat(baseClass, " bg-blue-100 text-blue-800");
            case 'posted': return "".concat(baseClass, " bg-green-100 text-green-800");
            case 'cancelled': return "".concat(baseClass, " bg-red-100 text-red-800");
            default: return "".concat(baseClass, " bg-gray-100 text-gray-800");
        }
    };
    var tabs = [
        { id: 'overview', label: 'Resumen' },
        { id: 'products', label: "Productos (".concat(products.length, ")"), show: products.length > 0 },
        { id: 'thirdparties', label: "Terceros (".concat(thirdParties.length, ")"), show: thirdParties.length > 0 },
        { id: 'payments', label: "T\u00E9rminos Pago (".concat(paymentTerms.length, ")"), show: paymentTerms.length > 0 },
        { id: 'lines', label: "L\u00EDneas (".concat(((_b = entry.lines) === null || _b === void 0 ? void 0 : _b.length) || 0, ")") },
        { id: 'calculations', label: 'Cálculos', show: calculationSummary.lines_with_products > 0 }
    ].filter(function (tab) { return tab.show !== false; });
    return (<div className={"space-y-6 ".concat(className)}>
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
            {entry.can_be_edited && onEdit && (<Button onClick={function () { return onEdit(entry); }} size="sm" variant="outline">
                ✏️ Editar
              </Button>)}
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
          {entry.is_balanced && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Balanceado
            </span>)}
          {entry.can_be_posted && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Puede ser contabilizado
            </span>)}
          {(aggregatedInfo === null || aggregatedInfo === void 0 ? void 0 : aggregatedInfo.productSummary.hasProducts) && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              🛒 Con productos
            </span>)}
          {(aggregatedInfo === null || aggregatedInfo === void 0 ? void 0 : aggregatedInfo.statusInfo.hasDiscounts) && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Con descuentos
            </span>)}          {(aggregatedInfo === null || aggregatedInfo === void 0 ? void 0 : aggregatedInfo.statusInfo.hasTaxes) && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Con impuestos
            </span>)}
          {hasEnrichedPaymentTerms && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              📅 Cronogramas Calculados
            </span>)}
        </div>

        {/* Validación */}
        {!validation.is_valid && (<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-1">Problemas encontrados:</h4>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {validation.issues.map(function (issue, index) { return (<li key={index}>{issue}</li>); })}
            </ul>
          </div>)}
      </Card>

      {/* Pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(function (tab) { return (<button key={tab.id} onClick={function () { return setActiveTab(tab.id); }} className={"py-2 px-1 border-b-2 font-medium text-sm ".concat(activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              {tab.label}
            </button>); })}
        </nav>
      </div>

      {/* Contenido de pestañas */}
      <div className="space-y-4">
        {activeTab === 'overview' && (<OverviewTab entry={entry} aggregatedInfo={aggregatedInfo} calculationSummary={calculationSummary}/>)}
        
        {activeTab === 'products' && (<ProductsTab products={products}/>)}
        
        {activeTab === 'thirdparties' && (<ThirdPartiesTab thirdParties={thirdParties}/>)}
          {activeTab === 'payments' && (<PaymentTermsTab paymentTerms={paymentTerms} enrichedPaymentTerms={enrichedPaymentTerms}/>)}
        
        {activeTab === 'lines' && (<LinesTab lines={entry.lines || []}/>)}
        
        {activeTab === 'calculations' && (<CalculationsTab calculationSummary={calculationSummary} lines={entry.lines || []}/>)}
      </div>
    </div>);
};
// Componentes para cada pestaña
var OverviewTab = function (_a) {
    var _b;
    var entry = _a.entry, aggregatedInfo = _a.aggregatedInfo, calculationSummary = _a.calculationSummary;
    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <span>{((_b = entry.lines) === null || _b === void 0 ? void 0 : _b.length) || 0}</span>
        </div>
      </div>
    </Card>

    <Card className="p-4">
      <h3 className="font-medium text-gray-900 mb-3">Resumen de Entidades</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Productos:</span>
          <span>{(aggregatedInfo === null || aggregatedInfo === void 0 ? void 0 : aggregatedInfo.productSummary.count) || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Terceros:</span>
          <span>{(aggregatedInfo === null || aggregatedInfo === void 0 ? void 0 : aggregatedInfo.thirdPartySummary.count) || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Términos Pago:</span>
          <span>{(aggregatedInfo === null || aggregatedInfo === void 0 ? void 0 : aggregatedInfo.paymentTermsSummary.count) || 0}</span>
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
  </div>);
};
var ProductsTab = function (_a) {
    var products = _a.products;
    return (<Card className="p-6">
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
          {products.map(function (product, index) { return (<tr key={index}>
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
            </tr>); })}
        </tbody>
      </table>
    </div>
  </Card>);
};
var ThirdPartiesTab = function (_a) {
    var thirdParties = _a.thirdParties;
    return (<Card className="p-6">
    <h3 className="font-medium text-gray-900 mb-4">Terceros</h3>
    <div className="space-y-4">
      {thirdParties.map(function (thirdParty, index) { return (<div key={index} className="border rounded-lg p-4">
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
            {thirdParty.email && (<div>
                <span className="font-medium">Email:</span> {thirdParty.email}
              </div>)}
            {thirdParty.phone && (<div>
                <span className="font-medium">Teléfono:</span> {thirdParty.phone}
              </div>)}
          </div>
        </div>); })}
    </div>
  </Card>);
};
var PaymentTermsTab = function (_a) {
    var paymentTerms = _a.paymentTerms, enrichedPaymentTerms = _a.enrichedPaymentTerms;
    return (<Card className="p-6">
    <h3 className="font-medium text-gray-900 mb-4">Términos de Pago</h3>
    <div className="space-y-6">
      {paymentTerms.map(function (term, index) {
            var _a, _b;
            // Buscar información enriquecida si está disponible
            var enrichedTerm = enrichedPaymentTerms === null || enrichedPaymentTerms === void 0 ? void 0 : enrichedPaymentTerms.get(term.id);
            var hasPaymentSchedule = ((_a = enrichedTerm === null || enrichedTerm === void 0 ? void 0 : enrichedTerm.payment_schedule) === null || _a === void 0 ? void 0 : _a.length) > 0;
            return (<div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-900">{term.name}</h4>
              {hasPaymentSchedule && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Cronograma Calculado
                </span>)}
              {(enrichedTerm === null || enrichedTerm === void 0 ? void 0 : enrichedTerm.error) && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Error en Cálculo
                </span>)}
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
                <span className={(enrichedTerm === null || enrichedTerm === void 0 ? void 0 : enrichedTerm.calculated_final_due_date) ? 'font-medium text-blue-600' : ''}>
                  {formatDate((enrichedTerm === null || enrichedTerm === void 0 ? void 0 : enrichedTerm.calculated_final_due_date) || term.due_date)}
                  {(enrichedTerm === null || enrichedTerm === void 0 ? void 0 : enrichedTerm.calculated_final_due_date) && (<span className="text-xs text-blue-500 ml-1">(Calculada)</span>)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Descripción:</span> {term.description}
              </div>
            </div>

            {/* Mostrar cronograma de pagos si está disponible */}
            {hasPaymentSchedule && (<div className="mt-4">
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
                      {enrichedTerm.payment_schedule.map(function (payment, paymentIndex) { return (<tr key={paymentIndex}>
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
                        </tr>); })}
                    </tbody>
                  </table>
                </div>
                
                {/* Totales del cronograma */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Cronograma:</span>
                      <div className="font-medium">{formatCurrency(((_b = enrichedTerm.calculation) === null || _b === void 0 ? void 0 : _b.total_amount) || 0)}</div>
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
              </div>)}

            {/* Mostrar información básica si no hay cronograma */}
            {!hasPaymentSchedule && term.needs_detailed_calculation && (<div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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
              </div>)}
          </div>);
        })}
    </div>
  </Card>);
};
var LinesTab = function (_a) {
    var lines = _a.lines;
    return (<Card className="p-6">
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
          {lines.map(function (line) { return (<tr key={line.id}>
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
            </tr>); })}
        </tbody>
      </table>
    </div>
  </Card>);
};
var CalculationsTab = function (_a) {
    var calculationSummary = _a.calculationSummary, lines = _a.lines;
    var linesWithProducts = lines.filter(function (line) { return line.product_id; });
    return (<div className="space-y-6">
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

      {linesWithProducts.length > 0 && (<Card className="p-6">
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
                {linesWithProducts.map(function (line) { return (<tr key={line.id}>
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
                  </tr>); })}
              </tbody>
            </table>
          </div>
        </Card>)}
    </div>);
};
