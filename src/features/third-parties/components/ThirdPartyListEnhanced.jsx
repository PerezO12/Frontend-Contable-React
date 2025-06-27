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
var _a;
/**
 * Componente principal de listado de terceros
 * Implementa UI elegante y moderna similar a InvoiceList
 * Incluye operaciones bulk, filtros avanzados y paginación
 */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useThirdParties } from '../hooks/useThirdParties';
import { ThirdPartyAdvancedFilters } from './ThirdPartyAdvancedFilters';
import { ThirdPartyBulkActionsBar } from './ThirdPartyBulkActionsBar';
import { PlusIcon, FunnelIcon, UserIcon, BuildingOfficeIcon, CheckCircleIcon, XCircleIcon } from '@/shared/components/icons';
import { ThirdPartyType, DOCUMENT_TYPE_LABELS } from '../types';
var typeConfig = (_a = {},
    _a[ThirdPartyType.CUSTOMER] = {
        label: 'Cliente',
        color: 'green',
        icon: UserIcon
    },
    _a[ThirdPartyType.SUPPLIER] = {
        label: 'Proveedor',
        color: 'blue',
        icon: BuildingOfficeIcon
    },
    _a[ThirdPartyType.EMPLOYEE] = {
        label: 'Empleado',
        color: 'purple',
        icon: UserIcon
    },
    _a);
var statusConfig = {
    'true': {
        label: 'Activo',
        color: 'green',
        icon: CheckCircleIcon
    },
    'false': {
        label: 'Inactivo',
        color: 'red',
        icon: XCircleIcon
    }
};
export function ThirdPartyListEnhanced(_a) {
    var navigate = useNavigate();
    var _b = useState(false), showFilters = _b[0], setShowFilters = _b[1];
    var _c = useState(new Set()), selectedThirdParties = _c[0], setSelectedThirdParties = _c[1];
    var _d = useState({
        limit: 50,
        skip: 0
    }), filters = _d[0], setFilters = _d[1];
    var _e = useThirdParties(filters), thirdParties = _e.thirdParties, loading = _e.loading, error = _e.error, total = _e.total, refetch = _e.refetch, refetchWithFilters = _e.refetchWithFilters, forceRefetch = _e.forceRefetch;
    // Calcular información de paginación
    var pagination = {
        page: Math.floor((filters.skip || 0) / (filters.limit || 50)) + 1,
        page_size: filters.limit || 50,
        total: total,
        total_pages: Math.ceil(total / (filters.limit || 50))
    };
    // Cargar terceros al montar el componente
    useEffect(function () {
        refetch();
    }, [refetch]);
    // Manejar cambios en filtros avanzados
    var handleFiltersChange = function (newFilters) {
        setFilters(__assign(__assign({}, newFilters), { skip: 0 // Reset pagination when filters change
         }));
    };
    // Aplicar filtros
    var applyFilters = function () {
        refetchWithFilters(filters);
    };
    // Limpiar filtros
    var handleClearFilters = function () {
        var clearedFilters = { limit: 50, skip: 0 }; // Mantener valores por defecto
        setFilters(clearedFilters);
        refetchWithFilters(clearedFilters);
    };
    // Cambiar página
    var handlePageChange = function (newPage) {
        var newSkip = (newPage - 1) * pagination.page_size;
        var newFilters = __assign(__assign({}, filters), { skip: newSkip });
        setFilters(newFilters);
        refetchWithFilters(newFilters);
    };
    // Manejar selección individual
    var toggleSelection = function (thirdPartyId) {
        var newSelected = new Set(selectedThirdParties);
        if (newSelected.has(thirdPartyId)) {
            newSelected.delete(thirdPartyId);
        }
        else {
            newSelected.add(thirdPartyId);
        }
        setSelectedThirdParties(newSelected);
    };
    // Manejar selección de todos
    var toggleSelectAll = function () {
        if (selectedThirdParties.size === (thirdParties === null || thirdParties === void 0 ? void 0 : thirdParties.length)) {
            setSelectedThirdParties(new Set());
        }
        else {
            setSelectedThirdParties(new Set((thirdParties === null || thirdParties === void 0 ? void 0 : thirdParties.map(function (tp) { return tp.id; })) || []));
        }
    };
    // Estado de selección
    var selectionState = {
        isAllSelected: selectedThirdParties.size > 0 && selectedThirdParties.size === (thirdParties === null || thirdParties === void 0 ? void 0 : thirdParties.length),
        isIndeterminate: selectedThirdParties.size > 0 && selectedThirdParties.size < ((thirdParties === null || thirdParties === void 0 ? void 0 : thirdParties.length) || 0)
    };
    // Limpiar selección
    var clearSelection = function () {
        setSelectedThirdParties(new Set());
    };
    // Manejar completión de operaciones (eliminar, etc.)
    var handleOperationComplete = useCallback(function () {
        // Limpiar selección inmediatamente
        clearSelection();
        // Forzar refetch de datos ignorando cache
        console.log('🔄 Refrescando datos después de operación bulk (forzando cache clean)...');
        forceRefetch(filters);
    }, [forceRefetch, filters]);
    // Manejar clic en fila para navegar a detalles
    var handleRowClick = function (thirdParty, event) {
        // No navegar si se hace clic en el checkbox
        var target = event.target;
        if (target.type === 'checkbox' || target.closest('input[type="checkbox"]')) {
            return;
        }
        navigate("/third-parties/".concat(thirdParty.id));
    };
    // Configurar columnas de la tabla (sin columna de acciones)
    var columns = [
        {
            key: 'select',
            label: 'Sel.',
            render: function (thirdParty) { return (<div className="flex items-center">
          <input type="checkbox" checked={selectedThirdParties.has(thirdParty.id)} onChange={function () { return toggleSelection(thirdParty.id); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
        </div>); }
        },
        {
            key: 'document',
            label: 'Documento',
            render: function (thirdParty) { return (<div className="font-medium text-gray-900">
          {thirdParty.document_number}
          <div className="text-sm text-gray-500">
            {DOCUMENT_TYPE_LABELS[thirdParty.document_type]}
          </div>
        </div>); }
        },
        {
            key: 'name',
            label: 'Nombre',
            render: function (thirdParty) { return (<div>
          <div className="font-medium text-gray-900">
            {thirdParty.commercial_name || thirdParty.name}
          </div>
          {thirdParty.commercial_name && (<div className="text-sm text-gray-500">
              {thirdParty.name}
            </div>)}
        </div>); }
        },
        {
            key: 'type',
            label: 'Tipo',
            render: function (thirdParty) {
                var config = typeConfig[thirdParty.third_party_type] || {
                    label: thirdParty.third_party_type,
                    color: 'gray',
                    icon: UserIcon
                };
                var Icon = config.icon;
                return (<Badge color={config.color} variant="subtle">
            <Icon className="h-3 w-3 mr-1"/>
            {config.label}
          </Badge>);
            }
        },
        {
            key: 'contact',
            label: 'Contacto',
            render: function (thirdParty) { return (<div className="text-sm">
          <div>{thirdParty.email || 'Sin email'}</div>
          <div className="text-gray-500">
            {thirdParty.phone || 'Sin teléfono'}
          </div>
        </div>); }
        },
        {
            key: 'balance',
            label: 'Saldo',
            render: function (thirdParty) { return (<div className="text-right">
          <div className="font-medium text-gray-900">
            {thirdParty.current_balance !== undefined
                    ? formatCurrency(thirdParty.current_balance)
                    : '-'}
          </div>
        </div>); }
        },
        {
            key: 'status',
            label: 'Estado',
            render: function (thirdParty) {
                var config = statusConfig[thirdParty.is_active.toString()] || {
                    label: thirdParty.is_active ? 'Activo' : 'Inactivo',
                    color: thirdParty.is_active ? 'green' : 'red',
                    icon: thirdParty.is_active ? CheckCircleIcon : XCircleIcon
                };
                var Icon = config.icon;
                return (<Badge color={config.color} variant="subtle">
            <Icon className="h-3 w-3 mr-1"/>
            {config.label}
          </Badge>);
            }
        }
    ];
    if (loading && (!thirdParties || thirdParties.length === 0)) {
        return (<div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg"/>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Terceros</h1>
          <p className="text-gray-600 mt-1">
            Gestión completa de clientes, proveedores y empleados
            {total > 0 && (<span className="ml-2 text-sm font-medium">
                • {total} terceros encontrados
                {pagination.total_pages > 1 && (<span className="text-gray-500">
                    {' '}(página {pagination.page} de {pagination.total_pages})
                  </span>)}
              </span>)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Control de elementos por página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Mostrar:</span>
            <select value={filters.limit || 50} onChange={function (e) {
            var newLimit = parseInt(e.target.value);
            var newFilters = __assign(__assign({}, filters), { limit: newLimit, skip: 0 // Reset to first page
             });
            setFilters(newFilters);
            refetchWithFilters(newFilters);
        }} className="px-2 py-1 border border-gray-300 rounded text-sm">
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
            <span className="text-sm text-gray-700">por página</span>
          </div>
          
          <Button variant="outline" onClick={function () { return setShowFilters(!showFilters); }} className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4"/>
            Filtros
          </Button>
          
          <Button onClick={function () { return navigate('/third-parties/new'); }} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4"/>
            Nuevo Tercero
          </Button>
        </div>
      </div>

      {/* Barra de acciones bulk */}
      <ThirdPartyBulkActionsBar selectedCount={selectedThirdParties.size} selectedIds={selectedThirdParties} onClearSelection={clearSelection} onOperationComplete={handleOperationComplete}/>

      {/* Filtros Avanzados */}
      {showFilters && (<ThirdPartyAdvancedFilters filters={filters} onFiltersChange={handleFiltersChange} onApplyFilters={applyFilters} onClearFilters={handleClearFilters} loading={loading}/>)}

      {/* Tabla de terceros */}
      {error && (<div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>)}

      {(!thirdParties || thirdParties.length === 0) && !loading ? (<EmptyState title="No hay terceros" description="Comienza creando tu primer tercero" action={<Button onClick={function () { return navigate('/third-parties/new'); }}>
              <PlusIcon className="h-4 w-4 mr-2"/>
              Nuevo Tercero
            </Button>}/>) : (<Card>
          {/* Tabla personalizada con bulk selection */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Header de selección múltiple */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input type="checkbox" checked={selectionState.isAllSelected} ref={function (input) {
                if (input) {
                    input.indeterminate = selectionState.isIndeterminate;
                }
            }} onChange={toggleSelectAll} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    </div>
                  </th>                      {columns.slice(1).map(function (column) { return (<th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {column.label}
                        </th>); })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (<tr>
                        <td colSpan={columns.length} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <LoadingSpinner size="sm" className="mr-2"/>
                            <span className="text-gray-500">Cargando terceros...</span>
                          </div>
                        </td>
                      </tr>) : ((thirdParties || []).map(function (thirdParty, index) { return (<tr key={thirdParty.id || index} className="hover:bg-gray-50 cursor-pointer" onClick={function (e) { return handleRowClick(thirdParty, e); }}>
                          {columns.map(function (column) { return (<td key={column.key} className="px-6 py-4 whitespace-nowrap">
                              {column.render ? column.render(thirdParty) : thirdParty[column.key]}
                            </td>); })}
                        </tr>); }))}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {pagination.total_pages > 1 && (<div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.page_size) + 1} a{' '}
                {Math.min(pagination.page * pagination.page_size, pagination.total)} de{' '}
                {pagination.total} terceros
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page <= 1 || loading} onClick={function () { return handlePageChange(pagination.page - 1); }}>
                  Anterior
                </Button>
                
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.total_pages}
                </span>
                
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.total_pages || loading} onClick={function () { return handlePageChange(pagination.page + 1); }}>
                  Siguiente
                </Button>
              </div>
            </div>)}
        </Card>)}
    </div>);
}
