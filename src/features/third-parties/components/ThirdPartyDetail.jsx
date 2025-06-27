import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { formatCurrency } from '../../../shared/utils';
import { useThirdPartyBalance, useThirdPartyStatement } from '../hooks';
import { THIRD_PARTY_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '../types';
export var ThirdPartyDetail = function (_a) {
    var thirdParty = _a.thirdParty, onEdit = _a.onEdit, onDelete = _a.onDelete, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var _c = useState('info'), activeTab = _c[0], setActiveTab = _c[1];
    var _d = useThirdPartyBalance(thirdParty.id), balance = _d.balance, balanceLoading = _d.loading;
    var _e = useThirdPartyStatement(), statement = _e.statement, statementLoading = _e.loading, fetchStatement = _e.fetchStatement;
    var handleShowStatement = function () {
        setActiveTab('statement');
        if (!statement) {
            // Obtener estado de cuenta del último año
            var endDate = new Date().toISOString().split('T')[0];
            var startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            fetchStatement(thirdParty.id, startDate, endDate);
        }
    };
    var getStatusBadge = function (isActive) {
        var classes = isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
        return (<span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(classes)}>
        {isActive ? 'Activo' : 'Inactivo'}
      </span>);
    };
    var getTypeBadge = function (type) {
        var colors = {
            'customer': 'bg-green-100 text-green-800',
            'supplier': 'bg-blue-100 text-blue-800',
            'employee': 'bg-purple-100 text-purple-800'
        };
        var color = colors[type] || 'bg-gray-100 text-gray-800';
        return (<span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(color)}>
        {THIRD_PARTY_TYPE_LABELS[type]}
      </span>);
    };
    if (loading) {
        return (<div className="flex justify-center items-center py-8">
        <Spinner size="lg"/>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="card-title">
                {thirdParty.commercial_name || thirdParty.name}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                {getTypeBadge(thirdParty.third_party_type)}
                {getStatusBadge(thirdParty.is_active)}
                <span className="text-sm text-gray-600">
                  {DOCUMENT_TYPE_LABELS[thirdParty.document_type]}: {thirdParty.document_number}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {onEdit && (<Button onClick={onEdit} variant="outline" size="sm">
                  ✏️ Editar
                </Button>)}
              {onDelete && (<Button onClick={onDelete} variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                  🗑️ Eliminar
                </Button>)}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button onClick={function () { return setActiveTab('info'); }} className={"py-2 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'info'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
            📋 Información General
          </button>
          <button onClick={function () { return setActiveTab('balance'); }} className={"py-2 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'balance'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
            💰 Balance y Antigüedad
          </button>
          <button onClick={handleShowStatement} className={"py-2 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'statement'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
            📊 Estado de Cuenta
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información Básica */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">Información Básica</h3>
            </div>
            <div className="card-body">
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Razón Social</dt>
                  <dd className="text-sm text-gray-900">{thirdParty.name}</dd>
                </div>
                {thirdParty.commercial_name && (<div>
                    <dt className="text-sm font-medium text-gray-500">Nombre Comercial</dt>
                    <dd className="text-sm text-gray-900">{thirdParty.commercial_name}</dd>
                  </div>)}
                {/* Nombre completo removido - ahora usamos el campo name */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Documento</dt>
                  <dd className="text-sm text-gray-900">
                    {DOCUMENT_TYPE_LABELS[thirdParty.document_type]}: {thirdParty.document_number}
                  </dd>
                </div>
                {thirdParty.tax_id && (<div>
                    <dt className="text-sm font-medium text-gray-500">ID Fiscal</dt>
                    <dd className="text-sm text-gray-900">{thirdParty.tax_id}</dd>
                  </div>)}
              </dl>
            </div>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">Información de Contacto</h3>
            </div>
            <div className="card-body">
              <dl className="space-y-3">
                {thirdParty.email && (<div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">
                      <a href={"mailto:".concat(thirdParty.email)} className="text-blue-600 hover:text-blue-800">
                        {thirdParty.email}
                      </a>
                    </dd>
                  </div>)}
                {thirdParty.phone && (<div>
                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                    <dd className="text-sm text-gray-900">
                      <a href={"tel:".concat(thirdParty.phone)} className="text-blue-600 hover:text-blue-800">
                        {thirdParty.phone}
                      </a>
                    </dd>
                  </div>)}
                {thirdParty.address && (<div>
                    <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                    <dd className="text-sm text-gray-900">{thirdParty.address}</dd>
                  </div>)}
                {thirdParty.city && (<div>
                    <dt className="text-sm font-medium text-gray-500">Ciudad</dt>
                    <dd className="text-sm text-gray-900">{thirdParty.city}</dd>
                  </div>)}
                {thirdParty.country && (<div>
                    <dt className="text-sm font-medium text-gray-500">País</dt>
                    <dd className="text-sm text-gray-900">{thirdParty.country}</dd>
                  </div>)}
                {/* Contact person removido - no está en la nueva interfaz */}
                {thirdParty.website && (<div>
                    <dt className="text-sm font-medium text-gray-500">Sitio Web</dt>
                    <dd className="text-sm text-gray-900">
                      <a href={thirdParty.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {thirdParty.website}
                      </a>
                    </dd>
                  </div>)}
              </dl>
            </div>
          </Card>

          {/* Información Comercial */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">Información Comercial</h3>
            </div>
            <div className="card-body">
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Términos de Pago</dt>
                  <dd className="text-sm text-gray-900">
                    {thirdParty.payment_terms ? "".concat(thirdParty.payment_terms, " d\u00EDas") : 'No definido'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Límite de Crédito</dt>
                  <dd className="text-sm text-gray-900">
                    {thirdParty.credit_limit ? formatCurrency(Number(thirdParty.credit_limit)) : 'Sin límite'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Descuento</dt>
                  <dd className="text-sm text-gray-900">
                    {thirdParty.discount_percentage ? "".concat(thirdParty.discount_percentage, "%") : '0%'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Saldo Actual</dt>
                  <dd className={"text-sm font-medium ".concat(thirdParty.current_balance && thirdParty.current_balance >= 0
                ? 'text-green-600'
                : 'text-red-600')}>
                    {thirdParty.current_balance !== undefined
                ? formatCurrency(thirdParty.current_balance)
                : 'No disponible'}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>

          {/* Notas */}
          {thirdParty.notes && (<Card>
              <div className="card-header">
                <h3 className="card-title">Notas</h3>
              </div>
              <div className="card-body">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {thirdParty.notes}
                </p>
              </div>
            </Card>)}
        </div>)}

      {activeTab === 'balance' && (<Card>
          <div className="card-header">
            <h3 className="card-title">Balance y Análisis de Antigüedad</h3>
          </div>
          <div className="card-body">
            {balanceLoading ? (<div className="flex justify-center py-8">
                <Spinner />
              </div>) : balance ? (<div className="space-y-6">
                {/* Resumen de Balance */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">Saldo Actual</h4>
                    <p className={"text-lg font-bold ".concat(balance.current_balance >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {formatCurrency(balance.current_balance)}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-red-900">Saldo Vencido</h4>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(balance.overdue_balance)}
                    </p>
                  </div>
                  {balance.credit_limit && (<div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-green-900">Límite de Crédito</h4>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(balance.credit_limit)}
                      </p>
                    </div>)}
                  {balance.available_credit && (<div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-900">Crédito Disponible</h4>
                      <p className="text-lg font-bold text-yellow-600">
                        {formatCurrency(balance.available_credit)}
                      </p>
                    </div>)}
                </div>

                {/* Análisis de Antigüedad */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Análisis de Antigüedad</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-green-900">Corriente (0-30 días)</h5>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(balance.aging_buckets.current)}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-yellow-900">31-60 días</h5>
                      <p className="text-lg font-bold text-yellow-600">
                        {formatCurrency(balance.aging_buckets.days_30)}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-orange-900">61-90 días</h5>
                      <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(balance.aging_buckets.days_60)}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-red-900">91-120 días</h5>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(balance.aging_buckets.days_90)}
                      </p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-red-900">Más de 120 días</h5>
                      <p className="text-lg font-bold text-red-700">
                        {formatCurrency(balance.aging_buckets.over_120)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                {balance.oldest_transaction && (<div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Transacción Más Antigua</h4>
                    <p className="text-sm text-gray-700">
                      Fecha: {new Date(balance.oldest_transaction.date).toLocaleDateString()} • 
                      Monto: {formatCurrency(balance.oldest_transaction.amount)} • 
                      Días: {balance.oldest_transaction.days_old} • 
                      Referencia: {balance.oldest_transaction.reference}
                    </p>
                  </div>)}
              </div>) : (<p className="text-gray-500 text-center py-8">
                No se pudo cargar la información de balance.
              </p>)}
          </div>
        </Card>)}

      {activeTab === 'statement' && (<Card>
          <div className="card-header">
            <h3 className="card-title">Estado de Cuenta</h3>
          </div>
          <div className="card-body">
            {statementLoading ? (<div className="flex justify-center py-8">
                <Spinner />
              </div>) : statement ? (<div className="space-y-6">
                {/* Resumen del Estado de Cuenta */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">Saldo Inicial</h4>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(statement.opening_balance)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">Total Débitos</h4>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(statement.summary.total_debits)}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-red-900">Total Créditos</h4>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(statement.summary.total_credits)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-900">Saldo Final</h4>
                    <p className="text-lg font-bold text-purple-600">
                      {formatCurrency(statement.closing_balance)}
                    </p>
                  </div>
                </div>

                {/* Movimientos */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referencia
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Débito
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Crédito
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {statement.movements.map(function (movement, index) { return (<tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(movement.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {movement.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {movement.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {movement.debit_amount > 0 && (<span className="text-green-600 font-medium">
                                {formatCurrency(movement.debit_amount)}
                              </span>)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {movement.credit_amount > 0 && (<span className="text-red-600 font-medium">
                                {formatCurrency(movement.credit_amount)}
                              </span>)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            <span className={movement.running_balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(movement.running_balance)}
                            </span>
                          </td>
                        </tr>); })}
                    </tbody>
                  </table>
                </div>
              </div>) : (<p className="text-gray-500 text-center py-8">
                No se pudo cargar el estado de cuenta.
              </p>)}
          </div>
        </Card>)}
    </div>);
};
