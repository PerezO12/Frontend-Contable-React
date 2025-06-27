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
 * Componente de filtros avanzados para terceros
 * Similar al de facturas pero adaptado a terceros
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ThirdPartyType, DocumentType } from '../types';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@/shared/components/icons';
export function ThirdPartyAdvancedFilters(_a) {
    var _b, _c;
    var filters = _a.filters, onFiltersChange = _a.onFiltersChange, onApplyFilters = _a.onApplyFilters, onClearFilters = _a.onClearFilters, _d = _a.loading, loading = _d === void 0 ? false : _d;
    var _e = useState(false), isExpanded = _e[0], setIsExpanded = _e[1];
    var _f = useState(filters), localFilters = _f[0], setLocalFilters = _f[1];
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
        {/* Búsqueda rápida por nombre */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
          <Input placeholder="Buscar por nombre..." value={localFilters.search || ''} onChange={function (e) { return updateLocalFilter('search', e.target.value); }} className="pl-10"/>
        </div>

        {/* Tipo de tercero */}
        <Select placeholder="Tipo" value={localFilters.third_party_type || ''} onChange={function (value) { return updateLocalFilter('third_party_type', value); }} options={[
            { value: '', label: 'Todos los tipos' },
            { value: ThirdPartyType.CUSTOMER, label: 'Cliente' },
            { value: ThirdPartyType.SUPPLIER, label: 'Proveedor' },
            { value: ThirdPartyType.EMPLOYEE, label: 'Empleado' }
        ]}/>

        {/* Estado */}
        <Select placeholder="Estado" value={((_b = localFilters.is_active) === null || _b === void 0 ? void 0 : _b.toString()) || ''} onChange={function (value) { return updateLocalFilter('is_active', value === '' ? undefined : value === 'true'); }} options={[
            { value: '', label: 'Todos los estados' },
            { value: 'true', label: 'Activos' },
            { value: 'false', label: 'Inactivos' }
        ]}/>

        {/* Botón aplicar */}
        <Button onClick={handleApplyFilters} disabled={loading} className="w-full">
          <MagnifyingGlassIcon className="h-4 w-4 mr-2"/>
          Buscar
        </Button>
      </div>

      {/* Filtros avanzados (expandibles) */}
      {isExpanded && (<div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Filtros Avanzados</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ciudad */}
            <div className="relative">
              <Input placeholder="Ciudad..." value={localFilters.city || ''} onChange={function (e) { return updateLocalFilter('city', e.target.value); }}/>
            </div>

            {/* País */}
            <div className="relative">
              <Input placeholder="País..." value={localFilters.country || ''} onChange={function (e) { return updateLocalFilter('country', e.target.value); }}/>
            </div>

            {/* Tipo de documento - SOLO el filtro, no el número */}
            <Select placeholder="Tipo de documento" value={localFilters.document_type || ''} onChange={function (value) { return updateLocalFilter('document_type', value); }} options={[
                { value: '', label: 'Todos los tipos' },
                { value: DocumentType.RUT, label: 'RUT' },
                { value: DocumentType.NIT, label: 'NIT' },
                { value: DocumentType.DNI, label: 'DNI' },
                { value: DocumentType.PASSPORT, label: 'Pasaporte' },
                { value: DocumentType.RFC, label: 'RFC' },
                { value: DocumentType.CUIT, label: 'CUIT' },
                { value: DocumentType.OTHER, label: 'Otro' }
            ]}/>
          </div>

          {/* NOTA: Los siguientes campos NO están soportados por el backend y están comentados:
                 - document_number, email, commercial_name, credit_limit_min, credit_limit_max
                 - has_balance, order_by - estos están en la interfaz pero comentados */}

          {/* Controles de paginación y elementos por página */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Elementos por página */}
            <Select placeholder="Elementos por página" value={((_c = localFilters.limit) === null || _c === void 0 ? void 0 : _c.toString()) || '50'} onChange={function (value) { return updateLocalFilter('limit', value ? parseInt(value) : 50); }} options={[
                { value: '25', label: '25 por página' },
                { value: '50', label: '50 por página' },
                { value: '100', label: '100 por página' },
                { value: '200', label: '200 por página' }
            ]}/>
            
            {/* Info de paginación */}
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500">
                Página actual: {Math.floor((localFilters.skip || 0) / (localFilters.limit || 50)) + 1}
              </span>
            </div>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center justify-center space-x-2 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={function () {
                var currentPage = Math.floor((localFilters.skip || 0) / (localFilters.limit || 50));
                var newSkip = Math.max(0, (currentPage - 1) * (localFilters.limit || 50));
                updateLocalFilter('skip', newSkip);
            }} disabled={!localFilters.skip || localFilters.skip <= 0} className="text-xs">
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={function () {
                var currentPage = Math.floor((localFilters.skip || 0) / (localFilters.limit || 50));
                var newSkip = (currentPage + 1) * (localFilters.limit || 50);
                updateLocalFilter('skip', newSkip);
            }} className="text-xs">
              Siguiente
            </Button>
            <Button variant="outline" size="sm" onClick={function () { return updateLocalFilter('skip', 0); }} disabled={!localFilters.skip || localFilters.skip <= 0} className="text-xs">
              Primera página
            </Button>
          </div>
        </div>)}
    </Card>);
}
