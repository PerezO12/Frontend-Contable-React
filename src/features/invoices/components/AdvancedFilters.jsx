var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * Componente de filtros avanzados para facturas
 * Implementa todas las nuevas capacidades de búsqueda del backend
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@/shared/components/icons';
export function AdvancedFilters(_a) {
    var filters = _a.filters, onFiltersChange = _a.onFiltersChange, onApplyFilters = _a.onApplyFilters, onClearFilters = _a.onClearFilters, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var _c = useState(false), isExpanded = _c[0], setIsExpanded = _c[1];
    var _d = useState(filters), localFilters = _d[0], setLocalFilters = _d[1];
    // Actualizar filtros locales cuando cambien los externos
    var updateLocalFilter = function (key, value) {
        var _a;
        var newFilters = __assign(__assign({}, localFilters), (_a = {}, _a[key] = value || undefined, _a));
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };
    // Aplicar filtros
    var handleApplyFilters = function () {
        onApplyFilters();
    };
    // Limpiar filtros
    var handleClearFilters = function () {
        setLocalFilters({});
        onClearFilters();
    };
    // Verificar si hay filtros activos
    var hasActiveFilters = Object.values(localFilters).some(function (value) {
        return value !== undefined && value !== '' && value !== null;
    });
    return (<Card className="p-4 space-y-4">
      {/* Header con toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500"/>
          <h3 className="text-sm font-medium text-gray-900">Filtros de Búsqueda</h3>
          {hasActiveFilters && (<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {Object.values(localFilters).filter(function (v) { return v !== undefined && v !== ''; }).length} activos
            </span>)}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleClearFilters} disabled={!hasActiveFilters || loading} className="text-xs">
            <XMarkIcon className="h-4 w-4 mr-1"/>
            Limpiar
          </Button>
          <Button variant="outline" size="sm" onClick={function () { return setIsExpanded(!isExpanded); }}>
            {isExpanded ? (<ChevronUpIcon className="h-4 w-4"/>) : (<ChevronDownIcon className="h-4 w-4"/>)}
          </Button>
        </div>
      </div>

      {/* Filtros básicos (siempre visibles) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda rápida */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
          <Input placeholder="Buscar por número..." value={localFilters.invoice_number || ''} onChange={function (e) { return updateLocalFilter('invoice_number', e.target.value); }} className="pl-10"/>
        </div>

        {/* Estado */}
        <Select placeholder="Estado" value={localFilters.status || ''} onChange={function (value) { return updateLocalFilter('status', value); }} options={[
            { value: '', label: 'Todos los estados' },
            { value: 'DRAFT', label: 'Borrador' },
            { value: 'POSTED', label: 'Contabilizada' },
            { value: 'CANCELLED', label: 'Cancelada' }
        ]}/>

        {/* Tipo */}
        <Select placeholder="Tipo" value={localFilters.invoice_type || ''} onChange={function (value) { return updateLocalFilter('invoice_type', value); }} options={[
            { value: '', label: 'Todos los tipos' },
            { value: 'CUSTOMER_INVOICE', label: 'Factura de Venta' },
            { value: 'SUPPLIER_INVOICE', label: 'Factura de Compra' },
            { value: 'CREDIT_NOTE', label: 'Nota de Crédito' },
            { value: 'DEBIT_NOTE', label: 'Nota de Débito' }
        ]}/>

        {/* Botón aplicar */}
        <Button onClick={handleApplyFilters} disabled={loading} className="w-full">
          <MagnifyingGlassIcon className="h-4 w-4 mr-2"/>
          Buscar
        </Button>
      </div>

      {/* Filtros avanzados (expandibles) */}
      {isExpanded && (<div className="space-y-4 pt-4 border-t">
          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <Input type="date" value={localFilters.date_from || ''} onChange={function (e) { return updateLocalFilter('date_from', e.target.value); }} placeholder="Seleccionar fecha inicial"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <Input type="date" value={localFilters.date_to || ''} onChange={function (e) { return updateLocalFilter('date_to', e.target.value); }} placeholder="Seleccionar fecha final"/>
            </div>
          </div>

          {/* Búsquedas de texto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del tercero
              </label>
              <Input placeholder="Buscar por cliente/proveedor..." value={localFilters.third_party_name || ''} onChange={function (e) { return updateLocalFilter('third_party_name', e.target.value); }}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <Input placeholder="Buscar en descripción..." value={localFilters.description || ''} onChange={function (e) { return updateLocalFilter('description', e.target.value); }}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia
              </label>
              <Input placeholder="Buscar por referencia..." value={localFilters.reference || ''} onChange={function (e) { return updateLocalFilter('reference', e.target.value); }}/>
            </div>
          </div>

          {/* Filtros de monto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto desde
              </label>
              <Input type="number" placeholder="0.00" value={localFilters.amount_from || ''} onChange={function (e) { return updateLocalFilter('amount_from', parseFloat(e.target.value) || undefined); }} min="0" step="0.01"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto hasta
              </label>
              <Input type="number" placeholder="0.00" value={localFilters.amount_to || ''} onChange={function (e) { return updateLocalFilter('amount_to', parseFloat(e.target.value) || undefined); }} min="0" step="0.01"/>
            </div>
          </div>

          {/* Ordenamiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <Select value={localFilters.sort_by || 'invoice_date'} onChange={function (value) { return updateLocalFilter('sort_by', value); }} options={[
                { value: 'invoice_date', label: 'Fecha de factura' },
                { value: 'number', label: 'Número' },
                { value: 'total_amount', label: 'Monto total' },
                { value: 'status', label: 'Estado' },
                { value: 'created_at', label: 'Fecha de creación' },
                { value: 'due_date', label: 'Fecha de vencimiento' }
            ]}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <Select value={localFilters.sort_order || 'desc'} onChange={function (value) { return updateLocalFilter('sort_order', value); }} options={[
                { value: 'desc', label: 'Descendente' },
                { value: 'asc', label: 'Ascendente' }
            ]}/>
            </div>
          </div>

          {/* Otros filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <Select placeholder="Todas las monedas" value={localFilters.currency_code || ''} onChange={function (value) { return updateLocalFilter('currency_code', value); }} options={[
                { value: '', label: 'Todas las monedas' },
                { value: 'USD', label: 'USD - Dólar' },
                { value: 'COP', label: 'COP - Peso Colombiano' },
                { value: 'EUR', label: 'EUR - Euro' }
            ]}/>
            </div>
          </div>
        </div>)}
    </Card>);
}
